/* ═══════════════════════════════════════════════════════════
   API.JS — backend engine for ytdownloader (v2.3 SELFHOST)
   MULTI-BACKEND PARALLEL RESOLVER:
     0. Self-host  — ★ GUARANTEED path ★ (sarili mong yt-dlp server)
        (ytdlserve: your server downloads + merges via ffmpeg)
     1. Cobalt v11    — legacy living backend
        (session auth via Cloudflare Turnstile, or custom Api-Key)
     2. Piped API     — legacy instances, ALL tried at once
     3. Invidious API — legacy instances, ALL tried at once
     4. jina proxy    — r.jina.ai CORS read-proxy layer
     5. Direct URL    — plain mp4/webm/audio links
   KEY FIX (v2.1): instances are probed IN PARALLEL so the
   first working server wins within seconds.
   KEY UPGRADE (v2.2): in 2026 ALL public Piped/Invidious
   instances are dead. Cobalt v11 needs auth (Turnstile session
   or Api-Key).
   KEY UPGRADE (v2.3): YOUR OWN SERVER is the new king. Set the
   server URL in settings → the app uses ytdlserve (yt-dlp +
   ffmpeg server-side merge) = guaranteed downloads forever.
   ═══════════════════════════════════════════════════════════ */
'use strict';

const YTD = {
  VERSION: '2.3.0',

  /* ── backend instance pools ── */
  PIPED_INSTANCES: [
    'https://api.piped.private.coffee',
    'https://pipedapi.kavin.rocks',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.leptons.xyz',
    'https://pipedapi.orangenet.cc',
    'https://pipedapi.adminforge.de',
    'https://pipedapi.reallyaweso.me',
    'https://pipedapi.ducks.party',
    'https://pipedapi.r4fo.com',
    'https://pipedapi.drgns.space',
    'https://api.piped.yt',
    'https://pipedapi.vern.cc'
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
    'https://yewtu.be',
    'https://invidious.materialio.us',
    'https://invidious.lunar.icu'
  ],

  COBALT_INSTANCES: [
    'https://api.cobalt.tools',
    'https://cobalt-api.kwiatekmiki.com',
    'https://capi.1337.cx',
    'https://cobalt-api.marcsello.org',
    'https://api.cobalt.best'
  ],

  /* cobalt v11 (2026) — the living backend */
  COBALT_API: 'https://api.cobalt.tools',
  COBALT_WEB: 'https://cobalt.tools',
  TURNSTILE_SCRIPT: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',

  /* runtime caches for cobalt v11 */
  _serverInfo: null,
  _session: null,
  _captchaToken: null,
  _turnstileReady: false,
  _turnstileOk: false,
  _turnstileErr: null,

  /* extra network path: r.jina.ai is a CORS-enabled read proxy */
  JINA_PREFIX: 'https://r.jina.ai/',

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
  async fetchJson(url, timeoutMs = 8000, opts = {}) {
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

  /* fetch JSON through the jina read-proxy (CORS-enabled network layer) */
  async fetchJsonViaJina(url, timeoutMs = 10000) {
    const proxied = await YTD.fetchJson(YTD.JINA_PREFIX + url, timeoutMs);
    // jina wraps target content; the JSON payload is usually the last
    // big chunk after "Markdown Content:" — find the first { or [ and parse.
    if (proxied && typeof proxied === 'object') return proxied;
    const txt = String(proxied);
    const start = Math.max(txt.indexOf('{'), txt.indexOf('['));
    if (start < 0) throw new Error('jina: no json');
    try { return JSON.parse(txt.slice(start)); }
    catch (e) { throw new Error('jina: bad json'); }
  },

  /* try a URL through public CORS proxies (last-resort layer) */
  async fetchJsonViaProxies(url, timeoutMs = 10000) {
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

  /* ── merge: avoid duplicate urls across backends ── */
  mergeQualities(...lists) {
    const seen = new Set();
    const out = [];
    for (const list of lists) {
      for (const q of list || []) {
        if (!q || !q.url) continue;
        if (seen.has(q.url)) continue;
        seen.add(q.url);
        out.push(q);
      }
    }
    return out;
  },

  /* ═══════════════════════════════════════════════
     PIPED — standard schema: streams[] + audioStreams[]
     ═══════════════════════════════════════════════ */
  parseStandardPiped(data) {
    const quals = [];
    const seen = new Set();
    const streams = data.streams || [];
    const audio = (data.audioStreams || []).filter(a => a.url && !YTD.isHls(a.url));

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
     PARALLEL RESOLVE — try every instance at once,
     first working backend wins (max ~8s total).
     Each probe is a tiny promise; Promise.any-style.
     ═══════════════════════════════════════════════ */
  probePiped(id, base) {
    return YTD.fetchJson(base + '/streams/' + id).then((data) => {
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
    });
  },

  probeInvidious(id, base) {
    return YTD.fetchJson(base + '/api/v1/videos/' + id).then((data) => {
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
    });
  },

  probeCobalt(url, base, opts = {}) {
    const clean = base.replace(/\/$/, '');
    const payload = { url, downloadMode: 'auto', videoQuality: '1080' };
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
    return YTD.fetchJson(clean + '/', 9000, {
      method: 'POST', body: JSON.stringify(payload), headers
    }).then((data) => {
      if (data.status === 'error') throw new Error((data.error && data.error.code) || 'cobalt error');
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
    });
  },

  probeCobaltAudio(url, base, opts = {}) {
    const clean = base.replace(/\/$/, '');
    const payload = { url, downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128' };
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
    return YTD.fetchJson(clean + '/', 9000, {
      method: 'POST', body: JSON.stringify(payload), headers
    }).then((data) => {
      if (data.status === 'error') throw new Error((data.error && data.error.code) || 'cobalt error');
      if (!data.url) throw new Error('no url');
      return {
        backend: 'cobalt', instance: clean,
        url: data.url, size: data.size || null, raw: data
      };
    });
  },

  /* ═══════════════════════════════════════════════
     COBALT v11 (2026) — the only living backend
     Auth flow (mirrors the official web UI):
       1) Cloudflare Turnstile widget renders → token
       2) POST /session  {cf-turnstile-response} → {token, exp}
       3) POST /         Authorization: Bearer {token}
       4) …or direct:    Authorization: Api-Key {sk_…}
     ═══════════════════════════════════════════════ */

  /* GET / → {cobalt:{version, turnstileSitekey, services…}} */
  async getCobaltServerInfo(force = false) {
    if (!force && YTD._serverInfo) return YTD._serverInfo;
    try {
      const data = await YTD.fetchJson(YTD.COBALT_API + '/', 12000);
      if (data && data.cobalt && data.cobalt.turnstileSitekey) {
        YTD._serverInfo = data;
        return data;
      }
    } catch (e) { /* keep null */ }
    return YTD._serverInfo;
  },

  /* load + init the Cloudflare Turnstile widget (explicit mode) */
  initTurnstile(callback) {
    if (YTD._turnstileReady) { if (callback) callback(YTD._captchaToken); return; }
    const info = YTD._serverInfo;
    if (!info) return;
    const sitekey = info.cobalt.turnstileSitekey;
    if (!sitekey) return;

    const done = () => {
      const el = document.getElementById('turnstile-widget');
      if (!el || !window.turnstile) return;
      window.turnstile.render(el, {
        sitekey,
        size: 'invisible',
        'refresh-expired': 'auto',
        callback: (token) => {
          YTD._captchaToken = token;
          YTD._turnstileOk = true;
          try {
            const s = window.localStorage || {};
            // keep token session-scoped only; do not persist tokens
          } catch (e) {}
          if (callback) callback(token);
        },
        'error-callback': (code) => {
          YTD._turnstileErr = code;
          YTD._turnstileOk = false;
          if (callback) callback(null);
        },
        'expired-callback': () => {
          YTD._captchaToken = null;
          YTD._turnstileOk = false;
          try { window.turnstile.reset(el); } catch (e) {}
        }
      });
    };

    YTD._turnstileReady = true;
    if (window.turnstile) { done(); return; }
    const s = document.createElement('script');
    s.src = YTD.TURNSTILE_SCRIPT;
    s.async = true;
    s.defer = true;
    s.onload = done;
    document.head.appendChild(s);
  },

  /* POST /session with the turnstile token → {token, exp} */
  async requestCobaltSession(token) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const resp = await fetch(YTD.COBALT_API + '/session', {
        method: 'POST',
        redirect: 'manual',
        signal: ctrl.signal,
        headers: token ? { 'cf-turnstile-response': token } : {}
      });
      clearTimeout(t);
      const txt = await resp.text();
      try { return JSON.parse(txt); } catch (e) { throw new Error('session bad json'); }
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
  },

  /* cached session (Bearer token with expiry) */
  async getCobaltSession(captchaToken) {
    const now = Date.now();
    if (YTD._session && YTD._session.expiresAt > now + 5000) return YTD._session;
    const data = await YTD.requestCobaltSession(captchaToken);
    if (!data || data.status === 'error') {
      const code = data && data.error && data.error.code;
      throw new Error('cobalt session: ' + (code || 'failed'));
    }
    if (!data.token) throw new Error('cobalt session: no token');
    YTD._session = {
      token: data.token,
      expiresAt: now + (data.exp || 600) * 1000
    };
    return YTD._session;
  },

  /* the v11 download call → parsed result
     opts: {customKey, captchaToken, mode:'auto'|'audio', videoQuality, audioFormat,
            audioBitrate, knownTitle} */
  async probeCobaltV11(url, opts = {}) {
    const payload = {
      url,
      downloadMode: opts.mode || 'auto',
      videoQuality: opts.videoQuality || '720',
      filenameStyle: 'basic',
      disableMetadata: false
    };
    if ((opts.mode || 'auto') === 'audio') {
      payload.audioFormat = opts.audioFormat || 'mp3';
      payload.audioBitrate = opts.audioBitrate || '128';
    }
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (opts.customKey) {
      headers['Authorization'] = 'Api-Key ' + opts.customKey;
    } else {
      const session = await YTD.getCobaltSession(opts.captchaToken);
      headers['Authorization'] = 'Bearer ' + session.token;
    }

    const data = await YTD.fetchJson(YTD.COBALT_API + '/', 15000, {
      method: 'POST', body: JSON.stringify(payload), headers
    });

    if (data.status === 'error') {
      throw new Error((data.error && data.error.code) || 'cobalt error');
    }
    if (data.status === 'tunnel') {
      // streaming tunnel needs WebCodecs/MediaSource — hand off to web UI
      const err = new Error('tunnel');
      err.tunnel = data;
      throw err;
    }
    if (!data.url) throw new Error('cobalt: no url');

    const ytId = YTD.extractYtId(url);
    const filename = (data.filename || 'yt download').replace(/\.[^.]+$/, '');
    const mime = data.mimeType || 'video/mp4';

    // success mode (separate audio) → extra audio quality
    const quals = [YTD.qVideo(
      data.quality || 'Best',
      'via cobalt · ' + (data.quality || 'best') + (mime.includes('audio') ? '' : ' ' + mime),
      data.url, data.size || null, mime, 'cobalt-v11'
    )];
    if (data.audio && data.audio.url) {
      quals.push(YTD.qAudio(
        'Audio only (mp3)',
        'audio stream · ' + (data.audio.size ? Math.round(data.audio.size / 1024 / 1024 * 10) / 10 + ' MB' : '') ,
        data.audio.url, data.audio.size || null, 'audio/mpeg', 'cobalt-audio'
      ));
    }

    return {
      backend: 'cobalt', instance: YTD.COBALT_API, id: ytId,
      title: filename, channel: 'cobalt', duration: '-', durationSec: 0,
      thumb: 'https://i.ytimg.com/vi/' + (ytId || '') + '/hqdefault.jpg',
      qualities: YTD.sortQualities(quals), raw: data
    };
  },

  /* one-shot cobalt fallback: open the cobalt web UI with the
     link pre-filled — cobalt.tools auto-solves its own Turnstile
     and auto-starts the download (guaranteed to work anywhere). */
  openCobaltWeb(url, mode = 'auto') {
    const target = YTD.COBALT_WEB + '/?u=' + encodeURIComponent(url);
    const w = window.open(target, '_blank');
    if (!w) { window.location.href = target; }
    return true;
  },

  /* race many promises: first fulfillment wins, collect errors */
  firstOf(promises) {
    return new Promise((resolve, reject) => {
      let pending = promises.length;
      const errors = [];
      if (!pending) { reject(new Error('no probes')); return; }
      promises.forEach((p, i) => {
        Promise.resolve(p).then(
          (v) => resolve(v),
          (e) => {
            errors[i] = (e && e.message) || String(e);
            if (--pending === 0) reject(new Error(errors.filter(Boolean).join(' | ')));
          }
        );
      });
    });
  },

  /* ═══════════════════════════════════════════════
     RESOLVE MASTER — parallel piped + invidious + cobalt
     ═══════════════════════════════════════════════ */
  async resolve(url, opts = {}) {
    // direct media file
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

    const ytId = YTD.extractYtId(url);
    if (!ytId) {
      // generic URL → cobalt + proxies
      const errors = [];
      try { return await YTD.resolveCobaltSeq(url, opts); }
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
    }

    const errors = [];

    /* ── SELF-HOST FIRST — sequential priority (guaranteed path) ──
       Kapag may naka-set na server URL, subukan muna ito AGAD.
       Kung gumana → i-return kaagad (no waiting for dead backends).
       Kung patay ang server URL (nag-restart ang tunnel) →
       RETRY LOOP: i-refresh mula sa server.txt at subukan ulit
       hanggang 8 beses (5s pagitan = ~40s window) para i-ride out
       ang tunnel restart window ng watchdog. */

    // ── helper: subukan ang selfhost isang beses ──
    const trySelfHostOnce = async () => {
      const sh = await YTD.probeSelfHost(url);
      return (sh && sh.qualities && sh.qualities.length) ? sh : null;
    };

    const selfHostAttempts = 3;           // 3 × (probe + 3s sleep) ≈ mabilis na 10s window
    const selfHostIntervalMs = 3000;      // hintay sa pagitan ng retry — para sa manual restart

    if (YTD.getSelfHostUrl()) {
      for (let attempt = 0; attempt < selfHostAttempts; attempt++) {
        try {
          const sh = await trySelfHostOnce();
          if (sh) return sh;
          // bumalik na walang error pero walang laman → refresh + ituloy
        } catch (e) {
          if (attempt === 0) errors.push('selfhost: ' + e.message);
          // i-refresh ang server.txt — kung nag-restart ka (manual),
          // may BAGONG URL na ito at kukunin ito ng site automatic
          try {
            const fresh = await YTD.fetchServerTxtUrl();
            if (fresh && fresh !== YTD.getSelfHostUrl()) {
              YTD.setSelfHostUrl(fresh);
            }
          } catch (e2) { /* keep going */ }
        }
        // last attempt? → wag na maghintay, tapusin na
        if (attempt < selfHostAttempts - 1) {
          await new Promise((r) => setTimeout(r, selfHostIntervalMs));
        }
      }
    }

    /* ── parallel probes: cobalt v11 + ALL piped + ALL invidious + jina at once ── */
    const probes = [];

    /* cobalt v11 — the ONLY living backend in 2026.
       Needs auth: custom Api-Key, or a Turnstile-session (captchaToken).
       Without any auth → skip the probe (it would only 400) and let the
       UI offer the cobalt.tools web fallback instead. */
    const cobaltAuth = (opts.cobaltKey && String(opts.cobaltKey).trim())
      ? { customKey: String(opts.cobaltKey).trim() }
      : (YTD._captchaToken ? { captchaToken: YTD._captchaToken } : null);
    if (cobaltAuth) {
      probes.push(
        YTD.probeCobaltV11(url, { ...cobaltAuth, knownTitle: 'yt download' })
          .catch((e) => { throw new Error('cobalt: ' + e.message); })
      );
    } else {
      // no auth available yet — record, do not probe
      probes.push(new Promise((_, rej) => setTimeout(() =>
        rej(new Error('cobalt: auth needed (no key, no captcha yet)')), 50)));
    }

    for (const base of YTD.PIPED_INSTANCES) {
      probes.push(YTD.probePiped(ytId, base).catch((e) => { throw new Error('piped/' + base.replace(/^https?:\/\//, '') + ': ' + e.message); }));
    }
    for (const base of YTD.INVIDIOUS_INSTANCES) {
      probes.push(YTD.probeInvidious(ytId, base).catch((e) => { throw new Error('inv/' + base.replace(/^https?:\/\//, '') + ': ' + e.message); }));
    }
    // jina proxy layer for the most reliable direct instance (browser-CORS safe)
    probes.push(
      YTD.fetchJsonViaJina('https://api.piped.private.coffee/streams/' + ytId).then((data) => {
        let quals = null;
        if (Array.isArray(data.videoStreams) && data.videoStreams.length) quals = YTD.parseLbryPiped(data);
        else if (Array.isArray(data.streams) && data.streams.length) quals = YTD.parseStandardPiped(data);
        if (!quals || !quals.length) throw new Error('no streams');
        return {
          backend: 'piped-jina', instance: 'jina-proxy', id: ytId,
          title: data.title || 'Untitled',
          channel: data.uploader || data.uploaderName || data.author || 'Unknown',
          duration: YTD.fmtDur(data.duration), durationSec: data.duration || 0,
          thumb: data.thumbnailUrl || 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg',
          qualities: YTD.sortQualities(quals), raw: data
        };
      }).catch((e) => { throw new Error('jina/proxy: ' + e.message); })
    );
    // cobalt merge (best-effort; usually requires api key in 2026)
    for (const base of YTD.COBALT_INSTANCES) {
      probes.push(YTD.probeCobalt(url, base, opts).catch((e) => { throw new Error('cobalt/' + base.replace(/^https?:\/\//, '') + ': ' + e.message); }));
    }

    /* first winner with real qualities */
    try {
      const best = await YTD.firstOf(probes);
      if (!best || !best.qualities || !best.qualities.length) throw new Error('empty result');

      /* ── enrich: try to merge AUDIO-only from invidious + cobalt too ── */
      const audioProbes = [];
      for (const base of YTD.INVIDIOUS_INSTANCES) {
        audioProbes.push(
          YTD.probeInvidious(ytId, base).then((r) => (r.qualities || []).filter(q => q.kind === 'audio'))
            .catch(() => [])
        );
      }
      if (cobaltAuth) {
        audioProbes.push(
          YTD.probeCobaltV11(url, { ...cobaltAuth, mode: 'audio', knownTitle: 'audio' })
            .then((r) => (r.qualities || []))
            .catch(() => [])
        );
      }
      for (const base of YTD.COBALT_INSTANCES) {
        audioProbes.push(
          YTD.probeCobaltAudio(url, base, opts).then((a) => [
            YTD.qAudio('Audio only (mp3)', '128 kbps · ' + a.instance, a.url, a.size, 'audio/mpeg', 'cobalt-audio')
          ]).catch(() => [])
        );
      }
      const audioLists = await Promise.all(audioProbes);
      const audios = audioLists.flat().filter(Boolean);
      if (audios.length) {
        const merged = YTD.mergeQualities(best.qualities, audios);
        best.qualities = YTD.sortQualities(merged);
        best.audioAlso = true;
      }
      return best;
    } catch (e) {
      errors.push('backends: ' + e.message);
    }

    const allErr = new Error('all backends failed — ' + errors.join(' | '));
    // flag: cobalt wants a streaming tunnel → offer the web UI fallback
    if (errors.some((s) => s.includes('tunnel') || s.includes('auth needed'))) {
      allErr.cobaltFallback = true;
    }
    throw allErr;
  },

  /* cobalt sequential (generic-url fallback) */
  async resolveCobaltSeq(url, opts = {}) {
    let lastErr = null;
    for (const base of YTD.COBALT_INSTANCES) {
      try { return await YTD.probeCobalt(url, base, opts); }
      catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('all cobalt instances failed');
  },

  /* ═══════════════════════════════════════════════
     DOWNLOAD EXECUTION (browser)
     Streams to blob; on CORS failure → new-tab fallback.
     ═══════════════════════════════════════════════ */
  downloadStream(url, filename) {
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
  },

  /* ═══════════════════════════════════════════════
     AUTH / STATUS HELPERS (used by the UI)
     ═══════════════════════════════════════════════ */

  /* is a custom cobalt Api-Key configured? */
  hasCobaltKey() {
    try {
      const k = (window.localStorage.getItem('ytd_cobalt_key') || '').trim();
      return k.length > 0;
    } catch (e) { return false; }
  },

  getCobaltKey() {
    try { return (window.localStorage.getItem('ytd_cobalt_key') || '').trim(); }
    catch (e) { return ''; }
  },

  setCobaltKey(k) {
    try { window.localStorage.setItem('ytd_cobalt_key', (k || '').trim()); } catch (e) {}
  },

  /* ═══════════════════════════════════════════════
     SELF-HOSTED BACKEND — ytdlserve (sarili mong server)
     Pag may server URL (settings), ang app ay gumagamit
     nito bilang GUARANTEED na download path. Ang server
     mismo ang nag-e-extract + nag-merge (yt-dlp+ffmpeg).
     ═══════════════════════════════════════════════ */

  getSelfHostUrl() {
    try {
      const u = (window.localStorage.getItem('ytd_selfhost_url') || '').trim();
      return u ? u.replace(/\/+$/, '') : '';
    } catch (e) { return ''; }
  },

  setSelfHostUrl(u) {
    try { window.localStorage.setItem('ytd_selfhost_url', (u || '').trim()); } catch (e) {}
  },

  /* kumuha ng bagong server URL mula sa server.txt (kapag nag-restart ang tunnel) */
  async fetchServerTxtUrl() {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch('./server.txt?ts=' + Date.now(), { cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) return '';
      const u = (await r.text()).trim().replace(/\/+$/, '');
      return /^https:\/\/.+\.trycloudflare\.com$/.test(u) ? u : '';
    } catch (e) { return ''; }
  },

  /* probe /api/v1/info — server extracts info + gives format selectors */
  async probeSelfHost(url) {
    const base = YTD.getSelfHostUrl();
    if (!base) throw new Error('selfhost: not configured');
    const info = await YTD.fetchJson(base + '/api/v1/info?url=' + encodeURIComponent(url), 25000);
    if (!info || info.status === 'error') {
      throw new Error('selfhost: ' + ((info && info.error && info.error.code) || 'bad response'));
    }
    const quals = (info.qualities || []).map((q, i) => ({
      label: q.label || 'quality',
      sub: q.sub || '',
      kind: q.kind === 'audio' ? 'audio' : 'video',
      ext: q.ext || (q.kind === 'audio' ? 'm4a' : 'mp4'),
      mime: q.mime || (q.kind === 'audio' ? 'audio/mp4' : 'video/mp4'),
      size: typeof q.size === 'number' ? Math.round(q.size * 1048576) : null, // MB → bytes
      f: q.f || null,                 // yt-dlp format selector
      selfhost: true,
      key: 'sh-' + i
    })).filter((q) => q.f);

    if (!quals.length) throw new Error('selfhost: no qualities');
    const id = info.id || YTD.extractYtId(url) || '';
    return {
      backend: 'selfhost', instance: base, id,
      title: info.title || 'youtube video',
      channel: info.channel || 'unknown',
      duration: info.duration || '-', durationSec: 0,
      thumb: info.thumb || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
      qualities: YTD.sortQualities(quals), raw: info
    };
  },

  /* start a server-side download task → task_id */
  async selfHostStart(url, q, filename) {
    const base = YTD.getSelfHostUrl();
    if (!base) throw new Error('selfhost: not configured');
    const fn = String(filename || 'video').replace(/\.[^.]+$/, '');
    const startUrl = base + '/api/v1/start?u=' + encodeURIComponent(url) +
      '&f=' + encodeURIComponent(q.f || 'best') +
      '&ext=' + encodeURIComponent(q.ext || 'mp4') +
      '&fn=' + encodeURIComponent(fn);
    const data = await YTD.fetchJson(startUrl, 20000);
    if (!data || !data.task_id) {
      throw new Error('server: ' + ((data && data.error && data.error.code) || 'no task'));
    }
    return data.task_id;
  },

  /* poll until done → absolute file URL
     maxWaitMs: hangganang oras (default 10 min) para hindi mag-hang forever */
  async selfHostPoll(taskId, onUpdate, maxWaitMs = 600000) {
    const base = YTD.getSelfHostUrl();
    const deadline = Date.now() + maxWaitMs;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1250));
      let p = null;
      try {
        p = await YTD.fetchJson(base + '/api/v1/progress/' + taskId, 12000);
      } catch (e) { continue; } // transient → keep polling
      if (onUpdate) onUpdate(p || {});
      if (p && p.status === 'done' && p.file) return base + p.file;
      if (p && p.status === 'error') throw new Error('server: ' + (p.error || 'failed'));
    }
    throw new Error('server took too long — task may have timed out, try again');
  },

  /* can the app talk to the cobalt API right now? */
  hasCobaltAuth() {
    return YTD.hasCobaltKey() || !!YTD._captchaToken;
  },

  /* human-readable cobalt auth state */
  cobaltAuthStatus() {
    if (YTD.hasCobaltKey()) return 'ok (custom Api-Key)';
    if (YTD._captchaToken) return 'ok (Turnstile session)';
    if (YTD._turnstileErr && String(YTD._turnstileErr).startsWith('103')) {
      return 'turnstile blocked on this domain — use cobalt.tools fallback or Api-Key';
    }
    if (YTD._turnstileReady) return 'waiting for Turnstile…';
    return 'no auth — use cobalt.tools fallback or add Api-Key';
  }
};