/* ═══════════════════════════════════════════════════════════
   API.JS — backend engine for ytdownloader (v1.1 defensive)
   Multi-backend: Piped API (primary) → Cobalt (fallback) →
   direct URL. Handles BOTH Piped schemas:
     - standard: streams[] (height/videoOnly) + audioStreams[]
     - LBRY-style: videoStreams[] (format=muxed mp4 / HLS)
   ═══════════════════════════════════════════════════════════ */
'use strict';

const YTD = {
  VERSION: '1.1.0',

  PIPED_INSTANCES: [
    'https://api.piped.private.coffee',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.ducks.party',
    'https://pipedapi.adminforge.de'
  ],

  COBALT_INSTANCES: [
    'https://api.cobalt.best',
    'https://cobalt-api.kwiatekmiki.com',
    'https://capi.1337.cx',
    'https://cobalt-api.marcsello.org',
    'https://cobalt-api.kwiatekmiki.com/api'
  ],

  /* ── extract YouTube video ID from any URL form ── */
  extractYtId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  },

  esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  },

  isDirectUrl(url) {
    return /\.(mp4|webm|mkv|avi|mov|m4a|mp3|ogg|wav|flac)(\?|$)/i.test(url);
  },

  isHls(url) {
    return /\.m3u8(\?|$)|application\/x-mpegurl|master\.m3u8/i.test(url || '');
  },

  /* ═══ BACKEND 1: PIPED ═══ */
  async pipedGet(path, timeoutMs = 15000) {
    let lastErr = null;
    for (const base of YTD.PIPED_INSTANCES) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        const resp = await fetch(base + path, { signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(t);
        if (!resp.ok) { lastErr = new Error(base + ' HTTP ' + resp.status); continue; }
        const txt = await resp.text();
        try { return JSON.parse(txt); } catch (e) { lastErr = new Error(base + ' bad json'); continue; }
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('all piped instances failed');
  },

  /* standard schema: streams[] + audioStreams[] */
  parseStandardPiped(data) {
    const streams = data.streams || [];
    const muxed = streams.filter(s => s.videoOnly === false && s.url && !YTD.isHls(s.url));
    const vOnly = streams.filter(s => s.videoOnly === true && s.url && !YTD.isHls(s.url));
    const audio = (data.audioStreams || []).filter(a => a.url && !YTD.isHls(a.url));
    const quals = [];

    const muxSorted = [...muxed].sort((a, b) => (b.height || 0) - (a.height || 0));
    if (muxSorted.length) {
      const best = muxSorted[0];
      quals.push({
        label: 'Best (muxed)',
        sub: (best.height || '?') + 'p single file has sound',
        url: best.url, size: best.contentLength, key: 'mux-best',
        mime: best.mimeType || 'video/mp4', merge: false
      });
      for (const s of muxSorted) {
        const h = s.height || 0;
        if (h <= 1080 && h >= 144) {
          quals.push({
            label: h + 'p', sub: h + 'p single file has sound',
            url: s.url, size: s.contentLength, key: 'mux-' + h,
            mime: s.mimeType || 'video/mp4', merge: false
          });
        }
      }
    }

    const vSorted = [...vOnly].sort((a, b) => (b.height || 0) - (a.height || 0));
    const seenH = new Set();
    for (const s of vSorted) {
      const h = s.height || 0;
      if (h >= 360 && !seenH.has(h)) {
        seenH.add(h);
        quals.push({
          label: h >= 1000 ? h + 'p' : h + 'p (video only)',
          sub: h + 'p video track' + (audio.length ? ' + separate audio' : ''),
          url: s.url, size: s.contentLength, key: 'v-' + h,
          mime: s.mimeType || 'video/mp4', merge: false
        });
      }
    }

    const aSorted = [...audio].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    if (aSorted.length) {
      const bestA = aSorted[0];
      quals.push({
        label: 'Audio (best)',
        sub: Math.round((bestA.bitrate || 0) / 1000) + ' kbps ' + (bestA.mimeType || 'audio/webm'),
        url: bestA.url, size: bestA.contentLength, key: 'a-best',
        mime: bestA.mimeType || 'audio/webm', merge: false
      });
      for (const a of aSorted.slice(0, 3)) {
        quals.push({
          label: 'Audio ' + Math.round((a.bitrate || 0) / 1000) + 'k',
          sub: Math.round((a.bitrate || 0) / 1000) + ' kbps ' + (a.mimeType || 'audio/webm'),
          url: a.url, size: a.contentLength, key: 'a-' + Math.round((a.bitrate || 0) / 1000),
          mime: a.mimeType || 'audio/webm', merge: false
        });
      }
    }
    return quals;
  },

  /* LBRY-style schema: videoStreams[] (muxed mp4 or HLS) */
  parseLbryPiped(data) {
    const vs = data.videoStreams || [];
    const quals = [];
    const seen = new Set();
    for (const s of vs) {
      if (!s.url || seen.has(s.url)) continue;
      const mime = s.mimeType || '';
      const isMp4 = mime.includes('mp4');
      const isHls = YTD.isHls(s.url) || mime.includes('mpegurl');
      if (isHls) continue; // skip pure HLS for direct download
      if (!isMp4) continue;
      seen.add(s.url);
      const itagMatch = s.url.match(/itag=(\d+)/);
      const itag = itagMatch ? +itagMatch[1] : null;
      const ITAG_MAP = { 18: '360p', 22: '720p', 37: '1080p', 59: '480p', 43: '360p', 5: '240p', 17: '144p' };
      const label = itag && ITAG_MAP[itag] ? ITAG_MAP[itag] : (s.quality || 'video');
      quals.push({
        label: label + (label === 'video' ? '' : ' (youtube)'),
        sub: (itag && ITAG_MAP[itag] ? 'muxed mp4 from youtube' : (s.format || s.quality || 'direct') + ' muxed mp4'),
        url: s.url, size: s.contentLength >= 0 ? s.contentLength : null, key: 'lbry-' + itag,
        mime: 'video/mp4', merge: false
      });
    }
    return quals;
  },

  async resolvePiped(id) {
    const data = await YTD.pipedGet('/streams/' + id);
    if (!data || (!data.streams && !data.videoStreams)) throw new Error('no stream data from piped');

    const thumb = data.thumbnailUrl || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';

    let quals;
    if (Array.isArray(data.streams) && data.streams.length) {
      quals = YTD.parseStandardPiped(data);
    } else if (Array.isArray(data.videoStreams) && data.videoStreams.length) {
      quals = YTD.parseLbryPiped(data);
    }

    if (!quals || !quals.length) throw new Error('no downloadable streams found');

    const fmtDur = (sec) => {
      sec = sec || 0;
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    };

    return {
      backend: 'piped',
      id,
      title: data.title || 'Untitled',
      channel: data.uploader || data.uploaderName || 'Unknown',
      duration: fmtDur(data.duration),
      durationSec: data.duration || 0,
      thumb,
      qualities: quals,
      raw: data
    };
  },

  /* ═══ BACKEND 2: COBALT ═══ */
  async cobaltResolve(url, isAudio = false, apiKey = '', instOverride = null) {
    const payload = { url, downloadMode: isAudio ? 'audio' : 'auto', videoQuality: '1080' };
    const list = instOverride ? [instOverride] : YTD.COBALT_INSTANCES;
    let lastErr = null;
    for (const base of list) {
      try {
        const clean = base.replace(/\/$/, '');
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 20000);
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
        const resp = await fetch(clean + '/', {
          method: 'POST', headers, body: JSON.stringify(payload), signal: ctrl.signal
        });
        clearTimeout(t);
        if (!resp.ok) { lastErr = new Error(clean + ' HTTP ' + resp.status); continue; }
        const json = await resp.json();
        if (json.status === 'error') { lastErr = new Error(json.error?.code || 'cobalt error'); continue; }
        return {
          backend: 'cobalt', url: json.url,
          filename: json.filename || 'download',
          status: json.status || 'success', instance: clean
        };
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('all cobalt instances failed');
  },

  /* ═══ RESOLVE MASTER ═══ */
  async resolve(url, opts = {}) {
    if (YTD.isDirectUrl(url)) {
      const m = url.split('/').pop().split('?')[0];
      return {
        backend: 'direct', id: null, title: m || 'direct download',
        channel: 'direct url', duration: '-', durationSec: 0, thumb: null,
        qualities: [{ label: 'Direct file', sub: 'original file', url, size: null, key: 'direct', mime: 'application/octet-stream', merge: false }],
        raw: null
      };
    }

    const ytId = YTD.extractYtId(url);
    if (ytId) {
      try { return await YTD.resolvePiped(ytId); }
      catch (pipedErr) {
        try {
          const c = await YTD.cobaltResolve(url, false, opts.cobaltKey);
          return {
            backend: 'cobalt', id: ytId, title: c.filename || 'yt ' + ytId,
            channel: 'cobalt', duration: '-', durationSec: 0,
            thumb: 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg',
            qualities: [{
              label: 'Best (cobalt merge)', sub: 'merged via ' + c.instance,
              url: c.url, size: null, key: 'cobalt-best', mime: 'video/mp4', merge: true, cobalt: c
            }],
            raw: null
          };
        } catch (e) {
          throw new Error('backends unavailable: piped (' + (pipedErr.message || '?') + ') | cobalt (' + (e.message || '?') + ')');
        }
      }
    }

    // generic url — cobalt only
    try {
      const c = await YTD.cobaltResolve(url, false, opts.cobaltKey);
      return {
        backend: 'cobalt', id: null, title: c.filename || 'download',
        channel: 'cobalt', duration: '-', durationSec: 0, thumb: null,
        qualities: [{
          label: 'Best (cobalt)', sub: 'via ' + c.instance, url: c.url,
          size: null, key: 'cobalt-best', mime: 'video/mp4', merge: true, cobalt: c
        }],
        raw: null
      };
    } catch (e) {
      throw new Error('unsupported url — no backend could resolve it');
    }
  },

  /* ═══ DOWNLOAD EXECUTION (browser) ═══
     Streams to blob; on CORS failure falls back to opening the
     URL in a new tab (browser handles download natively). */
  async downloadStream(url, filename) {
    const ctrl = new AbortController();
    const task = { ctrl, done: false, error: null, aborted: false, usedFallback: false };

    (async () => {
      try {
        const resp = await fetch(url, {
          signal: ctrl.signal,
          headers: { 'Accept': '*/*', 'Origin': location.origin }
        });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const total = +(resp.headers.get('Content-Length') || 0);
        const reader = resp.body.getReader();
        const chunks = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (task.onProgress) task.onProgress(received, total);
        }
        const type = resp.headers.get('Content-Type') || 'video/mp4';
        const blob = new Blob(chunks, { type });
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objUrl), 120000);
        task.done = true;
        task.blobUrl = objUrl;
      } catch (err) {
        if (err.name === 'AbortError') { task.aborted = true; return; }
        // CORS / network failure → open in new tab (native download)
        try {
          const w = window.open(url, '_blank');
          if (w) {
            task.usedFallback = true;
            task.done = true;
            task.fallbackMsg = 'opened in new tab — save from there (CORS blocked direct save)';
            return;
          }
        } catch (e2) {}
        task.error = err;
      }
    })();

    return task;
  },

  cancelTask(task) {
    if (task && task.ctrl) { task.ctrl.abort(); task.aborted = true; }
  }
};