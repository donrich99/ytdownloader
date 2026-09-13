/* ═══════════════════════════════════════════════════════════
   API.JS — backend engine for ytdownloader (v2.0 MAJOR REWRITE)
   MULTI-BACKEND RESOLVER (sequential fallback):
     1. Piped API     — 12+ public instances (standard + LBRY schema)
     2. Invidious API — 10+ instances (adaptiveFormats: VIDEO + AUDIO)
     3. Cobalt QB     — merge-quality fallback
     4. Direct URL    — plain mp4/webm/audio links
   Every backend returns BOTH video qualities AND audio-only
   options, so the UI can show a full quality picker like the
   classic ytdownloader tool (quality 1-9 incl. audio).
   ═══════════════════════════════════════════════════════════ */
'use strict';

const YTD = {
  VERSION: '2.0.0',

  /* ── backend instance pools (fastest/most reliable first) ── */
  PIPED_INSTANCES: [
    'https://api.piped.private.coffee',
    'https://pipedapi.kavin.rocks',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.leptons.xyz',
    'https://pipedapi.orangenet.cc',
    'https://pipedapi.adminforge.de',
    'https://pipedapi.reallyaweso.me',
    'https://api.piped.private.coffee',
    'https://pipedapi.ducks.party',
    'https://pipedapi.r4fo.com',
    'https://pipedapi.drgns.space',
    'https://api.piped.yt'
  ],

  INVIDIOUS_INSTANCES: [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://iv.melmac.space',
    'https://invidious.f5.si',
    'https://iv.ggtyler.dev',
    'https://invidious.privacyredirect.com',
    'https://invidious.jing.rocks',
    'https://iv.datura.network',
    'https://inv.tux.pizza',
    'https://yewtu.be'
  ],

  COBALT_INSTANCES: [
    'https://api.cobalt.tools',
    'https://cobalt-api.kwiatekmiki.com',
    'https://capi.1337.cx',
    'https://cobalt-api.marcsello.org',
    'https://api.cobalt.best'
  ],

  /* ── itag → human-readable map (YouTube) ── */
  ITAG_MAP: {
    17:  '144p', 36: '240p', 5: '240p', 43: '360p', 18: '360p', 59: '480p',
    22:  '720p', 37: '1080p', 38: '4K',
    /* video-only */
    133: '240p', 134: '360p', 135: '480p', 136: '720p', 137: '1080p',
    138: '4K', 160: '144p', 212: '480p', 264: '1440p', 266: '4K',
    /* audio-only */
    139:  'Audio 48k', 140: 'Audio 128k', 141: 'Audio 256k',
    249:  'Audio 50k', 250: 'Audio 70k', 251: 'Audio 160k',
    599:  'Audio 48k', 598: 'Audio 128k', 597: 'Audio 256k'
  },

  /* ── helpers ── */
  extractYtId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/|attribution_link\?.*u=|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  },

  esc(s) {
    try {
      const d = document.createElement('div');
      d.textContent = s == null ? '' : String(s);
      return d.innerHTML;
    } catch (e) { return String(s == null ? '' : s); }
  },

  isDirectUrl(url) {
    return /\.(mp4|webm|mkv|avi|mov|m4a|mp3|ogg|wav|flac|opus)(\?|#|$)/i.test(url);
  },

  isHls(url) {
    return /\.m3u8(\?|#|$)|application\/x-mpegurl|master\.m3u8/i.test(url || '');
  },

  fmtDur(sec) {
    sec = sec || 0;
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
    return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },

  /* fetch with timeout + JSON parse (single URL) */
  async fetchJson(url, timeoutMs = 12000, opts = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const resp = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'Accept': 'application/json', ...(opts.headers || {}) },
        ...(opts.method ? { method: opts.method } : {}),
        ...(opts.body ? { body: opts.body } : {})
      });
      clearTimeout(t);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const txt = await resp.text();
      try { return JSON.parse(txt); } catch (e) { throw new Error('bad json'); }
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
  },

  /* try a URL through public CORS proxies (last-resort network layer) */
  async fetchJsonViaProxies(url, timeoutMs = 20000) {
    const qt = encodeURIComponent(url);
    const proxies = [
      'https://api.allorigins.win/raw?url=' + qt,
      'https://api.allorigins.win/get?url=' + qt,
      'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url)
    ];
    let lastErr = null;
    for (const p of proxies) {
      try {
        const data = await YTD.fetchJson(p, timeoutMs);
        // allorigins /get wraps in { contents: "<json string>" }
        if (data && typeof data === 'object' && typeof data.contents === 'string') {
          try { return JSON.parse(data.contents); } catch (e) { return data; }
        }
        return data;
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('proxies failed');
  },

  /* ═══════════════════════════════════════════════
     QUALITY OBJECT FACTORIES
     Each: { label, sub, url, size, mime, key, kind }
     kind: 'video' | 'audio' (UI groups them)
     ═══════════════════════════════════════════════ */
  qVideo(label, sub, url, size, mime, key) {
    return { label, sub, url, size: size > 0 ? size : null, mime: mime || 'video/mp4', key, kind: 'video', merge: false };
  },
  qAudio(label, sub, url, size, mime, key) {
    return { label, sub, url, size: size > 0 ? size : null, mime: mime || 'audio/mp4', key, kind: 'audio', merge: false };
  },

  /* ── sort qualities: video best-first(1080→144), then audio best-first ── */
  sortQualities(quals) {
    const labelRank = (l) => {
      const m = l.match(/(\d{3,4})p|Audio (\d+)k/);
      if (!m) return 50;
      return m[2] ? +m[2] : ((+m[1] >= 2000) ? 10 : (2160 - +m[1]) / 100);
    };
    return [...quals].sort((a, b) => (a.kind === 'video' ? 0 : 1) - (b.kind === 'video' ? 0 : 1) || labelRank(a.label) - labelRank(b.label));
  },

  /* ═══════════════════════════════════════════════
     PIPED — standard schema: streams[] + audioStreams[]
     ═══════════════════════════════════════════════ */
  parseStandardPiped(data) {
    const quals = [];
    const seen = new Set();
    const streams = data.streams || [];
    const audio = (data.audioStreams || []).filter(a => a.url && !YTD.isHls(a.url));

    /* muxed: single-file video+audio */
    const muxed = streams.filter(s => s.videoOnly === false && s.url && !YTD.isHls(s.url))
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    for (const s of muxed) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      const h = s.height || 0;
      quals.push(YTD.qVideo(
        h >= 1000 ? h + 'p' : h + 'p',
        h + 'p · video+audio · ' + (s.mimeType || 'mp4'),
        s.url, s.contentLength, s.mimeType || 'video/mp4', 'mux-' + h
      ));
    }

    /* video-only high quality */
    const vOnly = streams.filter(s => s.videoOnly === true && s.url && !YTD.isHls(s.url))
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    const seenH = new Set();
    for (const s of vOnly) {
      if (seen.has(s.url)) continue;
      const h = s.height || 0;
      if (seenH.has(h) || h < 360) continue;
      seenH.add(h);
      seen.add(s.url);
      quals.push(YTD.qVideo(
        h >= 1000 ? h + 'p' : h + 'p',
        h + 'p · video only' + (audio.length ? ' (silent)' : '') + ' · ' + (s.mimeType || 'mp4'),
        s.url, s.contentLength, s.mimeType || 'video/mp4', 'v-' + h
      ));
    }

    /* audio-only (m4a/webm/opus) */
    const aSorted = [...audio].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    for (const a of aSorted.slice(0, 4)) {
      if (seen.has(a.url)) continue;
      seen.add(a.url);
      const kb = Math.round((a.bitrate || 0) / 1000);
      const ext = (a.mimeType || '').includes('webm') ? 'webm' : (a.mimeType || '').includes('m4a') ? 'm4a' : 'm4a';
      quals.push(YTD.qAudio(
        'Audio ' + (kb || 128) + 'k',
        (kb || 128) + ' kbps · audio-only · ' + ext,
        a.url, a.contentLength, a.mimeType || 'audio/mp4', 'a-' + kb
      ));
    }
    return quals;
  },

  /* ── PIPED — LBRY-style schema: videoStreams[] + audioStreams[] ── */
  parseLbryPiped(data) {
    const quals = [];
    const seen = new Set();
    const vs = data.videoStreams || [];
    for (const s of vs) {
      if (!s.url || seen.has(s.url)) continue;
      const mime = s.mimeType || '';
      if (YTD.isHls(s.url) || mime.includes('mpegurl')) continue;
      seen.add(s.url);
      const itagMatch = s.url.match(/itag=(\d+)/);
      const itag = itagMatch ? +itagMatch[1] : null;
      const rawLabel = (itag && YTD.ITAG_MAP[itag] && !YTD.ITAG_MAP[itag].startsWith('Audio')) ? YTD.ITAG_MAP[itag] : (s.quality || 'video');
      const label = /p$/.test(rawLabel) ? rawLabel : rawLabel + 'p';
      quals.push(YTD.qVideo(
        label,
        (YTD.ITAG_MAP[itag] || s.format || s.quality || 'direct') + ' · muxed mp4' + (itag === 18 ? ' · audio+video' : ''),
        s.url, s.contentLength, 'video/mp4', 'lbry-' + (itag || Math.random().toString(36).slice(2, 7))
      ));
    }

    /* LBRY audioStreams (very common in Odysee-backed instances) */
    const audio = (data.audioStreams || []).filter(a => a.url && !YTD.isHls(a.url));
    const aSorted = [...audio].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    for (const a of aSorted.slice(0, 4)) {
      if (seen.has(a.url)) continue;
      seen.add(a.url);
      const kb = Math.round((a.bitrate || 0) / 1000);
      quals.push(YTD.qAudio(
        'Audio ' + (kb || 128) + 'k',
        (kb || 128) + ' kbps · audio-only',
        a.url, a.contentLength, a.mimeType || 'audio/mp4', 'a-' + kb
      ));
    }
    return quals;
  },

  /* ── INVIDIOUS schema: formatStreams[] + adaptiveFormats[] ── */
  parseInvidious(data) {
    const quals = [];
    const seen = new Set();
    const formats = (data.adaptiveFormats || []).concat(data.formatStreams || []);

    const byItag = {};
    for (const f of formats) {
      if (!f || !f.url || seen.has(f.url)) continue;
      const m = (f.url || '').match(/itag=(\d+)/);
      const itag = m ? +m[1] : null;
      const key = itag || Math.random().toString(36).slice(2, 8);
      if (byItag[key]) continue;
      byItag[key] = f;
    }

    for (const key of Object.keys(byItag)) {
      const f = byItag[key];
      const itagNum = +key;
      seen.add(f.url);
      const mime = f.mimeType || f.type || '';
      const isAudio = mime.includes('audio') || (itagNum >= 139 && itagNum <= 141) || (itagNum >= 249 && itagNum <= 251) || (itagNum >= 597 && itagNum <= 599);
      const label = YTD.ITAG_MAP[itagNum] || (f.qualityLabel || '');
      const size = f.contentLength || f.clen;

      if (isAudio) {
        quals.push(YTD.qAudio(
          label || 'Audio',
          (f.bitrate ? Math.round(f.bitrate / 1000) + ' kbps' : '') + ' · audio-only',
          f.url, size, mime.includes('webm') ? 'audio/webm' : 'audio/mp4', 'iv-a-' + key
        ));
      } else {
        quals.push(YTD.qVideo(
          label || (f.qualityLabel || 'video'),
          (label || '') + ' · ' + (f.videoOnly ? 'video only' : 'video+audio') + ' · ' + (mime.includes('webm') ? 'webm' : 'mp4'),
          f.url, size, mime.includes('webm') ? 'video/webm' : 'video/mp4', 'iv-v-' + key
        ));
      }
    }
    return quals;
  },

  /* ═══════════════════════════════════════════════
     RESOLVE PER BACKEND (all instances tried)
     ═══════════════════════════════════════════════ */
  async resolvePiped(id) {
    let lastErr = null;
    for (const base of YTD.PIPED_INSTANCES) {
      try {
        const data = await YTD.fetchJson(base + '/streams/' + id);
        if (!data) throw new Error('empty');
        let quals = null;
        if (Array.isArray(data.streams) && data.streams.length) quals = YTD.parseStandardPiped(data);
        else if (Array.isArray(data.videoStreams) && data.videoStreams.length) quals = YTD.parseLbryPiped(data);
        if (!quals || !quals.length) throw new Error('no usable streams');
        return {
          backend: 'piped', instance: base, id,
          title: data.title || 'Untitled',
          channel: data.uploader || data.uploaderName || data.author || 'Unknown',
          duration: YTD.fmtDur(data.duration), durationSec: data.duration || 0,
          thumb: data.thumbnailUrl || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
          qualities: YTD.sortQualities(quals), raw: data
        };
      } catch (e) { lastErr = e; }
    }
    // last resort: piped through CORS proxies
    try {
      const proxied = await YTD.fetchJsonViaProxies('https://api.piped.private.coffee/streams/' + id);
      let quals = null;
      if (Array.isArray(proxied.streams) && proxied.streams.length) quals = YTD.parseStandardPiped(proxied);
      else if (Array.isArray(proxied.videoStreams) && proxied.videoStreams.length) quals = YTD.parseLbryPiped(proxied);
      if (quals && quals.length) {
        return {
          backend: 'piped-proxy', instance: 'cors-proxy', id,
          title: proxied.title || 'Untitled',
          channel: proxied.uploader || proxied.uploaderName || 'Unknown',
          duration: YTD.fmtDur(proxied.duration), durationSec: proxied.duration || 0,
          thumb: proxied.thumbnailUrl || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
          qualities: YTD.sortQualities(quals), raw: proxied
        };
      }
    } catch (e) { lastErr = e; }
    throw lastErr || new Error('all piped instances failed');
  },

  async resolveInvidious(id) {
    let lastErr = null;
    for (const base of YTD.INVIDIOUS_INSTANCES) {
      try {
        const data = await YTD.fetchJson(base + '/api/v1/videos/' + id, 12000);
        if (!data || !data.title) throw new Error('no data');
        const quals = YTD.parseInvidious(data);
        if (!quals.length) throw new Error('no formats');
        return {
          backend: 'invidious', instance: base, id,
          title: data.title, channel: data.author || 'Unknown',
          duration: YTD.fmtDur(data.lengthSeconds), durationSec: data.lengthSeconds || 0,
          thumb: data.videoThumbnails && data.videoThumbnails.length ? data.videoThumbnails[data.videoThumbnails.length - 1].url : 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
          qualities: YTD.sortQualities(quals), raw: data
        };
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('all invidious instances failed');
  },

  async resolveCobalt(url, opts = {}) {
    const payload = { url, downloadMode: 'auto', videoQuality: '1080' };
    let lastErr = null;
    const list = opts.cobaltInstance ? [opts.cobaltInstance] : YTD.COBALT_INSTANCES;
    for (const base of list) {
      try {
        const clean = base.replace(/\/$/, '');
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
        const data = await YTD.fetchJson(clean + '/', 15000, {
          method: 'POST', body: JSON.stringify(payload), headers
        });
        if (data.status === 'error') throw new Error(data.error && data.error.code || 'cobalt error');
        if (!data.url) throw new Error('no url');
        return {
          backend: 'cobalt', instance: clean, id: YTD.extractYtId(url),
          title: (opts.knownTitle || data.filename || 'yt download').replace(/\.[^.]+$/, ''),
          channel: 'cobalt merge',
          duration: '-', durationSec: 0,
          thumb: 'https://i.ytimg.com/vi/' + (YTD.extractYtId(url) || '') + '/hqdefault.jpg',
          qualities: [
            YTD.qVideo('Best (merged)', '1080p max · via ' + clean, data.url, data.size || null, 'video/mp4', 'cobalt-best')
          ],
          raw: data
        };
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('all cobalt instances failed');
  },

  /* ═══════════════════════════════════════════════
     RESOLVE AUDIO-ONLY (fast path for "Audio only")
     Tries: invidious audio formats → cobalt audio mode
     ═══════════════════════════════════════════════ */
  async resolveAudio(url, opts = {}) {
    const ytId = YTD.extractYtId(url);
    if (ytId) {
      // invidious adaptiveFormats → audio streams
      try {
        const r = await YTD.resolveInvidious(ytId);
        const audioQ = (r.qualities || []).filter(q => q.kind === 'audio');
        if (audioQ.length) {
          return {
            backend: r.backend, instance: r.instance, id: ytId,
            title: r.title, channel: r.channel, duration: r.duration, durationSec: r.durationSec,
            thumb: r.thumb, qualities: audioQ, raw: r.raw
          };
        }
      } catch (e) {}
    }

    // cobalt audio mode
    const payload = { url, downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128' };
    let lastErr = null;
    const list = YTD.COBALT_INSTANCES;
    for (const base of list) {
      try {
        const clean = base.replace(/\/$/, '');
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
        const data = await YTD.fetchJson(clean + '/', 15000, {
          method: 'POST', body: JSON.stringify(payload), headers
        });
        if (data.status === 'error') throw new Error((data.error && data.error.code) || 'cobalt error');
        if (!data.url) throw new Error('no url');
        return {
          backend: 'cobalt', instance: clean, id: ytId,
          title: (opts.knownTitle || data.filename || 'yt audio').replace(/\.[^.]+$/, ''),
          channel: 'cobalt audio', duration: '-', durationSec: 0,
          thumb: ytId ? 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg' : null,
          qualities: [YTD.qAudio('Audio only (mp3)', '128 kbps via ' + clean, data.url, data.size || null, 'audio/mpeg', 'cobalt-audio')],
          raw: data
        };
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('no audio stream available — all backends failed');
  },

  /* ═══════════════════════════════════════════════
     RESOLVE MASTER — tries every backend in order
     ═══════════════════════════════════════════════ */
  async resolve(url, opts = {}) {
    // 1. direct media file
    if (YTD.isDirectUrl(url)) {
      const m = url.split('/').pop().split('?')[0];
      const isAudioFile = /\.(mp3|m4a|ogg|wav|flac|opus)(\?|#|$)/i.test(url);
      return {
        backend: 'direct', id: null, title: m || 'direct download',
        channel: 'direct url', duration: '-', durationSec: 0, thumb: null,
        qualities: [isAudioFile
          ? YTD.qAudio('Audio file', 'original file', url, null, 'audio/mpeg', 'direct')
          : YTD.qVideo('Direct file', 'original file', url, null, 'video/mp4', 'direct')],
        raw: null
      };
    }

    // 2. YouTube URL → piped → invidious → cobalt
    const ytId = YTD.extractYtId(url);
    if (ytId) {
      const errors = [];
      try { return await YTD.resolvePiped(ytId); }
      catch (e) { errors.push('piped: ' + e.message); }
      try { return await YTD.resolveInvidious(ytId); }
      catch (e) { errors.push('invidious: ' + e.message); }
      try { return await YTD.resolveCobalt(url, opts); }
      catch (e) { errors.push('cobalt: ' + e.message); }
      throw new Error('all backends failed — ' + errors.join(' | '));
    }

    // 3. generic URL → cobalt only
    const errors = [];
    try { return await YTD.resolveCobalt(url, opts); }
    catch (e) { errors.push('cobalt: ' + e.message); }
    try {
      const proxied = await YTD.fetchJsonViaProxies(url);
      return {
        backend: 'proxy', id: null, title: url.split('/').pop() || 'download',
        channel: 'proxy', duration: '-', durationSec: 0, thumb: null,
        qualities: [YTD.qVideo('Direct file (proxy)', 'via cors proxy', url, null, 'application/octet-stream', 'proxy')],
        raw: null
      };
    } catch (e) { errors.push('proxy: ' + e.message); }
    throw new Error('no backend could resolve this url — ' + errors.join(' | '));
  },

  /* ═══════════════════════════════════════════════
     DOWNLOAD EXECUTION (browser)
     Streams to blob; on CORS failure → new-tab fallback.
     ═══════════════════════════════════════════════ */
  async downloadStream(url, filename) {
    const ctrl = new AbortController();
    const task = { ctrl, done: false, error: null, aborted: false, usedFallback: false };

    (async () => {
      try {
        const resp = await fetch(url, {
          signal: ctrl.signal,
          headers: { 'Accept': '*/*' }
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
        // streaming failed (CORS / network) → native download via new tab
        try {
          const w = window.open(url, '_blank');
          if (w) {
            task.usedFallback = true;
            task.done = true;
            task.fallbackMsg = 'opened in new tab — save from there (direct save blocked)';
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