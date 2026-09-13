/* ═══════════════════════════════════════════════════════════
   APP.JS — ytdownloader main engine (v1.1 REDESIGN)
   Clean white/red UI · welcome boot · video+audio quality picker
   ═══════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── UTILS ── */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function toast(msg, ms = 3200) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.add('hidden'), ms);
  }
  function fmtBytes(b) {
    if (!b || b <= 0) return '?';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return b.toFixed(i > 1 ? 1 : 0) + ' ' + u[i];
  }
  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  const isApk = new URLSearchParams(location.search).has('fromapp');

  /* Android native bridge (injected by the APK WebView) */
  function androidDownload(url, filename) {
    if (window.AppDownloader && window.AppDownloader.download) {
      try { window.AppDownloader.download(url, filename); return true; } catch (e) {}
    }
    return false;
  }
  window.ytdl = { androidDownload, getIsApk: () => isApk };

  /* ── WELCOME BOOT ── */
  function runBoot() {
    const bar = $('#bootBarFill');
    let p = 0;
    const iv = setInterval(() => {
      p += 6 + Math.floor(Math.random() * 8);
      if (p >= 100) { p = 100; }
      bar.style.width = p + '%';
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(finishBoot, 250);
      }
    }, 55);
  }
  function finishBoot() {
    $('#bootScreen').classList.add('fade-out');
    $('#mainApp').classList.remove('hidden');
    setTimeout(() => { $('#bootScreen').style.display = 'none'; }, 600);
  }

  /* ── NAV ── */
  function switchPage(name) {
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === name));
    $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
    if (name === 'library') renderLibrary();
    if (name === 'about') renderAbout();
    window.scrollTo({ top: 0 });
  }
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchPage(b.dataset.page)));

  /* ── STATE ── */
  const state = { resolved: null, activeQuality: null, currentTask: null };

  function setStatus(msg, cls) {
    const el = $('#statusLine');
    el.textContent = '// ' + msg + ' //';
    el.className = 'term-note ' + (cls || '');
  }

  /* ── SETTINGS (cobalt key + turnstile auto-session) ── */
  function getSettings() {
    let cobaltKey = '';
    try { cobaltKey = localStorage.getItem('ytd_cobalt_key') || ''; } catch (e) {}
    return { cobaltKey };
  }

  function saveCobaltKey(k) {
    try {
      localStorage.setItem('ytd_cobalt_key', (k || '').trim());
      YTD.setCobaltKey(k);
    } catch (e) {}
    toast('Cobalt API key saved (sk_…)');
    renderBackendStatus();
  }

  const keyInput = $('#cobaltKeyInput');
  const saveKeyBtn = $('#saveKeyBtn');

  async function renderBackendStatus() {
    const el = $('#backendStatus');
    if (!el) return;
    const info = YTD._serverInfo;
    el.innerHTML = '';

    const add = (k, v, cls) => {
      const row = document.createElement('div');
      row.className = 'backend-row detail';
      row.innerHTML = '<span class="backend-k">' + esc(k) + '</span><span class="backend-v ' + (cls || '') + '">' + esc(v) + '</span>';
      el.appendChild(row);
    };

    if (!info) {
      add('cobalt server', 'unreachable', 'red');
      add('auth', YTD.cobaltAuthStatus(), 'yellow');
      add('hint', 'The cobalt API is currently unreachable — downloads will fall back to the cobalt web helper.', 'dim');
      return;
    }

    const c = info.cobalt || {};
    const ver = info.cobalt ? ('v' + (String(info.cobalt.version || '').replace(/^v/, ''))) : 'unknown';
    add('cobalt server', ver + ' · ' + (YTD.COBALT_API || '').replace(/^https?:\/\//, ''), 'green');
    add('turnstile sitekey', (c.turnstileSitekey ? c.turnstileSitekey.slice(0, 10) + '…' : 'absent'), 'dim');
    if (YTD.hasCobaltKey()) {
      add('custom Api-Key', 'configured ✓', 'green');
      add('auth', 'direct (using your key)', 'green');
    } else if (YTD._captchaToken) {
      add('auth', 'session ready (turnstile)', 'green');
      add('turnstile', 'solved ✓', 'green');
    } else if (YTD._turnstileErr && String(YTD._turnstileErr).startsWith('103')) {
      add('turnstile', 'blocked on this domain — use Api-Key or web helper', 'red');
    } else {
      add('auth', YTD.cobaltAuthStatus(), 'yellow');
    }
  }

  async function initCobalt() {
    try { await YTD.getCobaltServerInfo(); } catch (e) {}
    /* pre-fill saved key */
    const saved = YTD.getCobaltKey();
    if (saved) keyInput.value = saved;
    renderBackendStatus();
    /* turnstile solves session automatically for cobalt auth */
    if (!YTD.hasCobaltKey()) {
      try { YTD.initTurnstile(); } catch (e) {}
    }
    /* probe result hook */
    $('#cobaltFallbackBtn').addEventListener('click', () => {
      const u = urlInput.value.trim() || (state.resolved && state.resolved.url);
      if (u) YTD.openCobaltWeb(u, 'auto');
    });
  }

  saveKeyBtn.addEventListener('click', () => saveCobaltKey(keyInput.value));
  keyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveCobaltKey(keyInput.value); });

  /* ── FETCH / RESOLVE ── */
  const resolveBtn = $('#resolveBtn');
  const urlInput = $('#urlInput');

  async function doResolve() {
    const url = urlInput.value.trim();
    if (!url) { toast('Please paste a YouTube link first'); return; }
    hide($('#resultPanel'));
    hide($('#videoInfo'));
    hide($('#qualityPanel'));
    hide($('#progressPanel'));
    state.resolved = null;
    state.activeQuality = null;
    resolveBtn.disabled = true;
    resolveBtn.textContent = 'Loading...';
    setStatus('resolving link, please wait...', '');
    try {
      const settings = getSettings();
      const res = await YTD.resolve(url, { cobaltKey: settings.cobaltKey });
      state.resolved = res;
      const vi = $('#videoInfo');
      $('#thumbImg').src = res.thumb || 'assets/Ytdl.png';
      $('#videoTitle').textContent = res.title;
      $('#videoChannel').textContent = '// channel: ' + res.channel + ' //';
      $('#videoDuration').textContent = (res.duration && res.duration !== '-' ? '// duration: ' + res.duration + ' // ' : '// ') + 'engine: ' + res.backend + ' //';
      show(vi);
      renderQualities(res.qualities);
      show($('#qualityPanel'));
      setStatus('ready — pick a quality below', 'green');
    } catch (err) {
      console.error('resolve error:', err);
      hide($('#videoInfo'));
      hide($('#qualityPanel'));
      $('#resultMsg').className = 'result-msg';
      let msg = '<b>Unable to resolve that link.</b><div class="dim">' + esc(err.message) +
        '<br><br>Tips: check your internet connection · paste the full YouTube link · or try a direct .mp4 link.</div>';
      if (err.cobaltFallback) {
        msg = '<b>All direct backends are currently out of reach.</b><div class="dim">' +
          esc(err.message) +
          '<br><br>Use the <b>cobalt.tools</b> helper on the right — it opens the official Cobalt downloader with your link pre-loaded, solves its own captcha automatically, and saves your file. (100% free, no account needed.)</div>';
        show($('#cobaltFallbackBtn'));
      } else {
        hide($('#cobaltFallbackBtn'));
      }
      $('#resultMsg').innerHTML = msg;
      show($('#resultPanel'));
      setStatus('error', 'err');
    } finally {
      resolveBtn.disabled = false;
      resolveBtn.textContent = 'Download';
    }
  }

  function renderQualities(qualities) {
    const grid = $('#qualityGrid');
    grid.innerHTML = '';
    const qn = $('#qualityNote');
    const videos = qualities.filter(q => q.kind !== 'audio');
    const audios = qualities.filter(q => q.kind === 'audio');

    let first = null;
    videos.forEach((q, idx) => {
      const b = document.createElement('button');
      b.className = 'q-btn' + (idx === 0 ? ' selected' : '');
      b.innerHTML =
        '<span class="q-label">' + esc(q.label) + '</span>' +
        '<span class="q-sub">' + esc(q.sub) + '</span>' +
        '<span class="q-tag video">video</span>';
      b.addEventListener('click', () => {
        $$('.q-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        state.activeQuality = q;
        toast('Selected: ' + q.label);
      });
      grid.appendChild(b);
      if (!first) first = q;
    });

    // audio-only group (exactly like the classic tool's audio options)
    audios.forEach((q) => {
      const b = document.createElement('button');
      b.className = 'q-btn';
      b.innerHTML =
        '<span class="q-label">' + esc(q.label) + '</span>' +
        '<span class="q-sub">' + esc(q.sub) + '</span>' +
        '<span class="q-tag audio">audio only</span>';
      b.addEventListener('click', () => {
        $$('.q-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        state.activeQuality = q;
        toast('Selected: ' + q.label);
      });
      grid.appendChild(b);
    });

    state.activeQuality = state.activeQuality || first;
    const sizes = qualities.filter(q => q.size).map(q => fmtBytes(q.size)).join(' | ');
    qn.textContent = sizes ? '// approx size: ' + sizes + ' //' : '// qualities found from available streams //';
    if (state.activeQuality) toast('Pick a quality, then press download');
  }

  /* ── DOWNLOAD ── */
  function cleanFilename(title, ext) {
    let f = title.replace(/[\\/:*?"<>|#%&{}]/g, '_').replace(/\s+/g, '_').slice(0, 120);
    if (!f) f = 'ytdownload';
    return f + '.' + (ext || 'mp4');
  }
  function extFor(q) {
    if (!q || !q.mime) return 'mp4';
    if (q.mime.includes('webm')) return 'webm';
    if (q.mime.includes('mp3')) return 'mp3';
    if (q.mime.includes('m4a')) return 'm4a';
    if (q.mime.includes('opus')) return 'opus';
    if (q.mime.includes('ogg')) return 'ogg';
    return 'mp4';
  }

  async function doDownload() {
    if (!state.activeQuality) { toast('Pick a quality first'); return; }
    if (state.currentTask) { toast('A download is already running'); return; }
    const q = state.activeQuality;
    const res = state.resolved;
    const filename = cleanFilename(res.title, extFor(q));

    // ANDROID APK — native bridge saves to real Download folder
    if (isApk && androidDownload(q.url, filename)) {
      toast('Download started — check your phone Download folder', 4200);
      recordDownload(res, q, filename, 'android-downloads');
      setStatus('downloading to phone /Download', 'green');
      return;
    }

    // BROWSER — stream to blob, then save
    setStatus('downloading — ' + filename, '');
    show($('#progressPanel'));
    hide($('#resultPanel'));
    $('#progressLabel').textContent = 'downloading ' + q.label + ' ...';
    $('#progressFill').style.width = '0%';
    $('#progressStats').textContent = '';
    try {
      state.currentTask = YTD.downloadStream(q.url, filename);
      state.currentTask._t0 = Date.now();
      state.currentTask.onProgress = (recv, total) => {
        const pct = total ? Math.min(100, Math.round((recv / total) * 100)) : 0;
        $('#progressFill').style.width = pct + '%';
        const spd = recv / Math.max(1, (Date.now() - state.currentTask._t0) / 1000);
        $('#progressStats').innerHTML = fmtBytes(recv) + (total ? ' / ' + fmtBytes(total) : '') +
          ' · ' + pct + '%' + ' · ' + fmtBytes(spd) + '/s';
      };
      await new Promise((resv, rej) => {
        const iv = setInterval(() => {
          const t = state.currentTask;
          if (!t) { clearInterval(iv); rej(new Error('cancelled')); }
          else if (t.done) { clearInterval(iv); resv(); }
          else if (t.error) { clearInterval(iv); rej(t.error); }
          else if (t.aborted) { clearInterval(iv); rej(new Error('aborted')); }
        }, 220);
      });
      $('#progressFill').style.width = '100%';
      $('#progressLabel').textContent = 'Done!';
      recordDownload(res, q, filename, 'browser-download');
      showResult('<b>Download complete!</b><div class="dim">Check your browser download folder.</div>');
      setStatus('done — saved to downloads', 'green');
    } catch (err) {
      hide($('#progressPanel'));
      showResult('<b>Download failed:</b> ' + esc(err.message));
      setStatus('error', 'err');
    } finally {
      state.currentTask = null;
    }
  }

  function showResult(html) {
    const r = $('#resultMsg');
    r.className = 'result-msg';
    r.innerHTML = html;
    show($('#resultPanel'));
  }

  function recordDownload(res, q, filename, method) {
    YTDB.add({
      ts: Date.now(),
      title: res.title,
      channel: res.channel,
      quality: q.label,
      url: q.url,
      filename,
      thumb: res.thumb || null,
      size: q.size || null,
      method,
      backend: res.backend
    }).then(() => {
      if ($('#page-library').classList.contains('active')) renderLibrary();
    }).catch(() => {});
  }

  /* ── LIBRARY ── */
  async function renderLibrary() {
    const list = $('#libraryList');
    const clearBtn = $('#clearLibraryBtn');
    let items = [];
    try { items = await YTDB.getAll(); } catch (e) {}
    if (!items.length) {
      list.innerHTML = '<div class="lib-empty">// library empty — nothing downloaded yet //</div>';
      clearBtn.classList.add('hidden');
      return;
    }
    clearBtn.classList.remove('hidden');
    list.innerHTML = '';
    items.forEach(it => {
      const el = document.createElement('div');
      el.className = 'lib-item';
      const thumb = it.thumb
        ? '<img class="lib-thumb" src="' + esc(it.thumb) + '" alt="">'
        : '<img class="lib-thumb" src="assets/Ytdl.png" alt="">';
      const date = new Date(it.ts).toLocaleString();
      el.innerHTML =
        thumb +
        '<div class="lib-info">' +
          '<div class="lib-title">' + esc(it.title) + '</div>' +
          '<div class="lib-sub">' + esc(it.quality) + ' · ' + esc(it.method) + ' · ' +
            (it.size ? fmtBytes(it.size) : '?') + ' · ' + esc(date) + '</div>' +
        '</div>' +
        '<div class="lib-actions">' +
          '<button class="lib-icon-btn" data-act="dl" title="download again">&#8595;</button>' +
          '<button class="lib-icon-btn" data-act="del" title="delete record">&#128465;</button>' +
        '</div>';
      el.querySelector('[data-act="dl"]').addEventListener('click', () => {
        const q = { label: it.quality, url: it.url, mime: it.url.includes('.webm') ? 'video/webm' : 'video/mp4' };
        state.resolved = { title: it.title, channel: it.channel, thumb: it.thumb, backend: it.backend, qualities: [q] };
        state.activeQuality = q;
        doDownload();
      });
      el.querySelector('[data-act="del"]').addEventListener('click', async () => {
        try { await YTDB.remove(it.ts); } catch (e) {}
        renderLibrary();
      });
      list.appendChild(el);
    });
  }

  $('#clearLibraryBtn').addEventListener('click', async () => {
    try { await YTDB.clear(); } catch (e) {}
    renderLibrary();
    toast('Library cleared');
  });

  /* ── ABOUT — ENGLISH SPEECH + GCASH DONATION ── */
  function aboutHtml() {
    return [
      '<div class="about-logo"><img src="assets/Ytdl.png" alt="ytdownloader"></div>',

      '<h3>THE CREATOR — dvc</h3>',
      '<p>ytdownloader was designed, engineered, and shipped by <span class="highlight">dvc</span> — a builder who believes that technology should be free, fast, and honest. No corporations, no middlemen, no hidden paywalls, no tricks. Just a clean tool and the will to make video downloading simple for everyone on this planet.</p>',

      '<h3>THE PHILOSOPHY</h3>',
      '<p>Almost every so-called "free" downloader on the internet is either full of clickbait, riddled with malware, locked behind premium subscriptions, or quietly harvesting your data. dvc saw that mess and built the opposite — a lean, honest tool that treats you like a human being, not like a product.</p>',
      '<p>You paste a link, you pick your quality, you hit download, and the file lands on your device. That is the whole deal. That is the promise.</p>',

      '<h3>WHO IS dvc?</h3>',
      '<p>dvc is not a company. dvc is not a faceless team of marketers. dvc is one determined individual who loves software the way it was meant to be — useful, open, and unpretentious. Every build, every fix, every feature was done with full care and full execution.</p>',

      '<h3>THE BUILD</h3>',
      '<p>This is a hand-built application — a multi-backend engine that talks to public video APIs, a local download library that remembers what you grab, and a native Android app compiled with a bare-metal command-line pipeline. No gigabytes of bloat, no fake "AI-powered" marketing fluff. Just code that works, packaged tight, and tested until it holds.</p>',
      '<p>The Android app saves downloads straight into your phone\'s <span class="highlight">Download folder</span> — the same folder your file manager shows you every day. Your downloads belong to you.</p>',

      '<h3>FREE FOREVER</h3>',
      '<p><span class="highlight">ytdownloader is and will remain 100% free.</span> No premium tier hiding good qualities. No "pro" version. No ads interrupting your downloads. The best quality, the fastest engine, the full library — everything is in the free version, because there is only one version. One tool, one standard, for everyone.</p>',

      '<h3>HOW DOES IT STAY ALIVE? — DONATIONS</h3>',
      '<p>Servers cost money. Domains cost money. Time costs money. But instead of charging the people who use it, instead of stuffing the page with ads, ytdownloader is sustained <span class="highlight">100% by donations</span> — by people like you who believe free tools deserve to exist.</p>',
      '<p>If ytdownloader has helped you, the best thing you can do is send a small donation. Even a small amount keeps the servers online, the backends alive, and the downloads unlimited for the next person, and the next, and the next.</p>',
      '<p>Every donation is a message that says: <span class="highlight">"I want this tool to stay alive."</span></p>',

      '<h3>SUPPORT THE BUILD — GCASH</h3>',
      '<div class="donate-box">',
        '<div class="donate-icon">&#128154;</div>',
        '<div class="donate-text">',
          '<div class="donate-title">GCASH DONATION</div>',
          '<div class="donate-num" id="gcashNum">+639945160282</div>',
          '<div class="donate-note">open your GCash app &gt; Send Money &gt; enter number above</div>',
          '<button id="copyGcashBtn" class="btn btn-donate">Copy GCash number</button>',
        '</div>',
      '</div>',
      '<p><span class="highlight">Thank you</span> — genuinely — to everyone who donates. You are the reason this tool stays online, stays updated, and stays free for everyone. Every peso keeps the light on.</p>',

      '<h3>THE PROMISE</h3>',
      '<p>No spyware. No hidden miners. No surprise subscriptions. No "download this extra app first" nonsense. No 47 pop-ups. No ads chasing you around the page. Just a straight line between you and the video you want. That line is ytdownloader, and it belongs to you the moment you open it.</p>',

      '<div class="code-block">/* ytdownloader v1.1 · (c) dvc · free forever · donations = keep it alive */</div>'
    ].join('\n');
  }

  function renderAbout() {
    const el = $('#aboutContent');
    if (el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = aboutHtml();
    const copyBtn = $('#copyGcashBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const num = '+639945160282';
        const done = () => {
          copyBtn.textContent = 'Copied!';
          toast('GCash number copied');
          setTimeout(() => { copyBtn.textContent = 'Copy GCash number'; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(num).then(done).catch(() => fallbackCopy(num, done));
        } else {
          fallbackCopy(num, done);
        }
      });
    }
  }

  function fallbackCopy(text, done) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      toast('// GCash: +639945160282 //', 5000);
    }
  }

  /* ── EVENTS ── */
  resolveBtn.addEventListener('click', doResolve);
  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doResolve(); });
  $('#downloadAgainBtn').addEventListener('click', () => {
    hide($('#resultPanel'));
    hide($('#videoInfo'));
    hide($('#qualityPanel'));
    hide($('#progressPanel'));
    hide($('#cobaltFallbackBtn'));
    state.resolved = null;
    state.activeQuality = null;
    urlInput.value = '';
    urlInput.focus();
    setStatus('system: idle', '');
  });

  /* ── HIDE APK SECTION IF INSIDE THE APK ── */
  if (isApk) {
    const s = $('#downloadAppSection');
    if (s) hide(s);
  }

  /* ── INIT ── */
  initCobalt();
  runBoot();
});