/* ═══════════════════════════════════════════════════════════
   APP.JS — ytdownloader main engine (C++3D terminal build)
   PART A: utils / boot / matrix / tilt / nav / fetch / quality
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

  /* ── BOOT SEQUENCE ── */
  const ASCII = String.raw` _____ _______ _____ ___  _      _   _ _____ _____ ____  _____ _____
|_   _|__   __|  _  |  _ \| |    | \ | | ____| ____|  _ \| ____|  __ \
  | |    | |  | | | | |_) | |    |  \| |  _| |  _| | |_) |  _| | |  | |
  | |    | |  | |_| |  _ <| |___ | |\  | |___| |___|  _ <| |___| |__| |
  |_|    |_|   \___/|_| \_\_____|_| \_|_____|_____|_| \_\_____|_____/`;

  const BOOT_LINES = [
    ['[ DVC SYSTEMS ] initializing ytdownloader v1.0 ...', 'ok'],
    ['compiling cpp3d terminal shell .............. OK', 'ok'],
    ['linking core: matrix-rain(1.4) ............... OK', 'ok'],
    ['linking core: 3d-tilt(2.0) ................... OK', 'ok'],
    ['mounting backend: piped-api .................. OK', 'ok'],
    ['mounting backend: cobalt ..................... READY', 'warn'],
    ['loading download-library (indexeddb) ......... OK', 'ok'],
    ['ownership check: dvc ......................... VERIFIED', 'ok'],
    ['build: promode x dvc — full execution ........ OK', 'ok'],
    ['system ready. welcome, dvc.', 'ok']
  ];

  function runBoot() {
    const logo = $('#bootLogo');
    const log = $('#bootLog');
    const bar = $('#bootBarFill');
    let i = 0;
    const typeLogo = setInterval(() => {
      logo.textContent = ASCII.slice(0, i);
      if (++i > ASCII.length) {
        clearInterval(typeLogo);
        logo.textContent = ASCII;
        let li = 0;
        const typeLog = setInterval(() => {
          if (li < BOOT_LINES.length) {
            const [txt, cls] = BOOT_LINES[li];
            const div = document.createElement('div');
            div.className = cls;
            div.textContent = '> ' + txt;
            log.appendChild(div);
            log.scrollTop = log.scrollHeight;
            bar.style.width = Math.min(100, Math.round(((li + 1) / BOOT_LINES.length) * 100)) + '%';
            li++;
          } else {
            clearInterval(typeLog);
            setTimeout(finishBoot, 300);
          }
        }, 95);
      }
    }, 6);
  }

  function finishBoot() {
    $('#bootScreen').classList.add('fade-out');
    $('#mainApp').classList.remove('hidden');
    setTimeout(() => { $('#bootScreen').style.display = 'none'; }, 700);
    startTypedCmd();
  }

  const FETCH_CMD = 'yt-dlp "https://www.youtube.com/watch?v=..." --format best --output downloads/';
  function startTypedCmd() {
    const el = $('#typedCmd');
    let i = 0;
    const t = setInterval(() => {
      el.textContent = FETCH_CMD.slice(0, i);
      if (++i > FETCH_CMD.length) clearInterval(t);
    }, 18);
  }

  /* ── MATRIX RAIN ── */
  function initMatrix() {
    const cv = $('#matrixRain');
    const ctx = cv.getContext('2d');
    let w, h, cols, drops;
    const fontSize = 14;
    function resize() {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
      cols = Math.floor(w / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -40);
    }
    resize();
    window.addEventListener('resize', resize);
    const chars = '01ABCDEF{}[]<>;:$#%&*+=?/*!-@';
    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 60) return;
      last = ts;
      ctx.fillStyle = 'rgba(10,15,26,0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.92 ? '#00e5ff' : '#00ff9f';
        ctx.globalAlpha = 0.6;
        ctx.fillText(ch, x, y);
        ctx.globalAlpha = 1;
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  }

  /* ── 3D TILT CARDS ── */
  function initTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(12px)';
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── NAV ── */
  function switchPage(name) {
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === name));
    $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
    if (name === 'library') renderLibrary();
    if (name === 'about') renderAbout();
    window.scrollTo(0, 0);
  }
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchPage(b.dataset.page)));

  /* ── STATE ── */
  const state = { resolved: null, activeQuality: null, currentTask: null };

  function setStatus(msg, cls) {
    const el = $('#statusLine');
    el.textContent = '// ' + msg + ' //';
    el.className = 'term-note ' + (cls || '');
  }

  /* ── SETTINGS ── */
  function getSettings() {
    let cobaltKey = '';
    try { cobaltKey = localStorage.getItem('ytdl_cobalt_key') || ''; } catch (e) {}
    return { cobaltKey };
  }

  /* ── FETCH / RESOLVE ── */
  const resolveBtn = $('#resolveBtn');
  const urlInput = $('#urlInput');

  async function doResolve() {
    const url = urlInput.value.trim();
    if (!url) { toast('// error: no url provided //'); return; }
    hide($('#resultPanel'));
    hide($('#videoInfo'));
    hide($('#qualityPanel'));
    hide($('#progressPanel'));
    state.resolved = null;
    state.activeQuality = null;
    resolveBtn.disabled = true;
    resolveBtn.textContent = '[ FETCHING... ]';
    setStatus('resolving url via multi-backend engine...', '');
    try {
      const settings = getSettings();
      const res = await YTD.resolve(url, { cobaltKey: settings.cobaltKey });
      state.resolved = res;
      const vi = $('#videoInfo');
      $('#thumbImg').src = res.thumb || 'assets/Ytdl.png';
      $('#videoTitle').textContent = res.title;
      $('#videoChannel').textContent = '// channel: ' + res.channel + ' //';
      $('#videoDuration').textContent = '// duration: ' + res.duration + ' // backend: ' + res.backend + ' //';
      show(vi);
      renderQualities(res.qualities);
      show($('#qualityPanel'));
      setStatus('ready. pick a quality below', 'green');
    } catch (err) {
      console.error('resolve error:', err);
      hide($('#videoInfo'));
      hide($('#qualityPanel'));
      $('#resultMsg').className = 'result-msg';
      $('#resultMsg').innerHTML = 'x <b>resolve failed</b>: ' + esc(err.message) +
        '<br><span class="dim">// try another url, or paste a direct .mp4 link //</span>';
      show($('#resultPanel'));
      setStatus('error: ' + err.message, 'err');
    } finally {
      resolveBtn.disabled = false;
      resolveBtn.textContent = '[ FETCH ]';
    }
  }

  function renderQualities(qualities) {
    const grid = $('#qualityGrid');
    grid.innerHTML = '';
    const qn = $('#qualityNote');
    qualities.forEach((q, idx) => {
      const b = document.createElement('button');
      b.className = 'q-btn' + (idx === 0 ? ' selected' : '');
      b.innerHTML = '<span class="q-label">' + esc(q.label) + '</span><span class="q-sub">' + esc(q.sub) + '</span>';
      b.addEventListener('click', () => {
        $$('.q-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        state.activeQuality = q;
        toast('quality selected: ' + q.label);
      });
      grid.appendChild(b);
    });
    state.activeQuality = qualities[0];
    const sizes = qualities.filter(q => q.size).map(q => fmtBytes(q.size)).join(' | ');
    qn.textContent = sizes ? '// estimated size: ' + sizes + ' //' : '// quality list generated from available streams //';
    if (qualities.length === 1) qn.textContent += ' single stream available - hit download.';
  }

  /* ── DOWNLOAD (browser) ── */
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
    return 'mp4';
  }

  async function doDownload() {
    if (!state.activeQuality) { toast('// pick a quality first //'); return; }
    if (state.currentTask) { toast('// download already running //'); return; }
    const q = state.activeQuality;
    const res = state.resolved;
    const filename = cleanFilename(res.title, extFor(q));

    // ANDROID APK — native bridge saves to real Download folder
    if (isApk && androidDownload(q.url, filename)) {
      toast('// download started - check your phone Download folder //', 4200);
      recordDownload(res, q, filename, 'android-downloads');
      setStatus('downloading via native engine to /Download', 'green');
      return;
    }

    // BROWSER — stream to blob, then save
    setStatus('downloading -> ' + filename, '');
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
        $('#progressStats').innerHTML = '<span class="s">' + fmtBytes(recv) + '</span> / ' +
          (total ? fmtBytes(total) : '...') + '&nbsp; | &nbsp;' + pct + '%' +
          (total && recv ? '&nbsp; | &nbsp; speed ' + fmtBytes(spd) + '/s' : '');
      };
      await new Promise((resv, rej) => {
        const iv = setInterval(() => {
          const t = state.currentTask;
          if (!t) { clearInterval(iv); rej(new Error('cancelled')); }
          else if (t.done) { clearInterval(iv); resv(); }
          else if (t.error) { clearInterval(iv); rej(t.error); }
          else if (t.aborted) { clearInterval(iv); rej(new Error('aborted')); }
        }, 250);
      });
      $('#progressFill').style.width = '100%';
      $('#progressLabel').textContent = 'DONE ✓';
      recordDownload(res, q, filename, 'browser-download');
      showResult('ok <b>download complete!</b> file saved to your device downloads.<br><span class="dim">// check your browser download folder //</span>');
      setStatus('done. saved to downloads/', 'green');
    } catch (err) {
      hide($('#progressPanel'));
      showResult('x <b>download failed</b>: ' + esc(err.message));
      setStatus('error: ' + err.message, 'err');
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
      list.innerHTML = '<div class="lib-empty">// library empty - nothing downloaded yet //</div>';
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
          '<div class="lib-sub">' + esc(it.quality) + ' | ' + esc(it.method) + ' | ' +
            (it.size ? fmtBytes(it.size) : '?') + ' | ' + esc(date) + '</div>' +
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
    toast('// library cleared //');
  });/* ── ABOUT — LONG ENGLISH SPEECH BY dvc ── */
  function aboutHtml() {
    return [
      '<div class="about-logo"><img src="assets/Ytdl.png" alt="ytdownloader"></div>',

      '<h3>// THE CREATOR — dvc //</h3>',
      '<p>This tool was designed, engineered, and shipped by <span class="highlight">dvc</span> — a builder who believes that technology should be free, fast, and honest. No corporations. No middlemen. No hidden paywalls. No tricks. Just a clean terminal, a real engine, and the will to make video downloading simple for everyone on this planet.</p>',

      '<h3>// THE PHILOSOPHY //</h3>',
      '<p>ytdownloader was born from a very simple frustration: almost every so-called "free" downloader on the internet is either full of clickbait, riddled with malware, locked behind premium subscriptions, or quietly harvesting your data. dvc saw that mess and decided to build the opposite — a lean, mean, terminal-grade tool that treats you like a human being, not like a product.</p>',
      '<p>Everything here is built from the ground up with the spirit of a C++ terminal: direct, transparent, no sugar-coating. What you see is what you get. You paste a link, you pick your quality, you hit download, and the file lands on your device. That is the whole deal. That is the promise.</p>',

      '<h3>// WHO IS dvc? //</h3>',
      '<p>dvc is not a company. dvc is not a faceless team of marketers. dvc is one determined individual who loves software the way it was meant to be — useful, open, and unpretentious. When you use ytdownloader, you are using the work of a real person who tested every line, argued with every bug, and refused to accept anything half-baked. Every build, every fix, every feature was done with full care and full execution.</p>',
      '<p>The name behind the project is simple. The vision behind it is not. dvc wants to prove that one person, with the right tools and the right mindset, can still ship something genuinely good to the entire world without asking for a single peso from the users.</p>',

      '<h3>// THE BUILD //</h3>',
      '<p>This is not a drag-and-drop template. This is a hand-built application — a custom C++3D terminal-style interface, a multi-backend resolution engine that talks to public streaming APIs, a local download library that remembers everything you grab, and a native Android version compiled with a bare-metal command-line pipeline: aapt2, javac, d8, zipalign, apksigner. No gigabytes of bloat. No fake "AI-powered" marketing fluff. Just code that works, packaged tight, signed properly, and tested until it holds.</p>',
      '<p>The Android APK is built natively so that downloads are written straight into your phone\'s Download folder — the same folder your file manager shows you every day. You can see the files, play them, share them, move them, or install them. That is the whole point: <span class="highlight">your downloads belong to you</span>, and they should land somewhere you can actually reach them.</p>',

      '<h3>// FREE FOREVER //</h3>',
      '<p>Yes, you read that right. <span class="highlight">ytdownloader is and will remain 100% free</span>. There is no premium tier hiding the good qualities. There is no "pro" version that unlocks what the free one hides. There are no ads interrupting your downloads. The best quality, the fastest backend, the full library — everything is in the free version, because there is only one version. One tool. One standard. For everyone.</p>',

      '<h3>// HOW DOES IT STAY ALIVE? — DONATIONS //</h3>',
      '<p>Servers cost money. Domains cost money. Time costs money. And building a tool like this takes real hours and real dedication. But instead of charging the people who use it, instead of stuffing the page with ads that slow everything down, ytdownloader is sustained <span class="highlight">100% by donations</span> — by people like you who believe free tools deserve to exist.</p>',
      '<p>If ytdownloader has helped you — if you downloaded a video you really needed, if this tool saved you from some shady downloader site, if you simply appreciate that something this good is still free — then the best thing you can do is send a small donation. Even a small amount helps keep the servers online, the backends alive, and the downloads unlimited for the next person, and the next, and the next.</p>',
      '<p>Every donation is a message that says: <span class="highlight">"I want this tool to stay alive."</span> And every download you make without paying a cent is the system working exactly as designed. dvc built it so that access is never the price — support is voluntary. That is the only deal, and it is a deal most people are happy to make.</p>',

      '<h3>// SUPPORT THE BUILD — GCASH //</h3>',
      '<div class="donate-box">',
        '<div class="donate-icon">💚</div>',
        '<div class="donate-text">',
          '<div class="donate-title">GCASH DONATION</div>',
          '<div class="donate-num" id="gcashNum">+63 945 160 0282</div>',
          '<div class="donate-note">// open your GCash app > Send Money > enter number above //</div>',
          '<button id="copyGcashBtn" class="btn btn-donate">[ COPY_GCASH_NO ]</button>',
        '</div>',
      '</div>',
      '<p><span class="highlight">Thank you</span> — genuinely — to everyone who donates. You are the reason this tool stays online, stays updated, and stays free for everyone. Every peso keeps the light on.</p>',

      '<h3>// THE PROMISE //</h3>',
      '<p>No spyware. No cryptocurrency miners hidden in the background. No surprise subscriptions. No "download this extra app first" nonsense. No 47 pop-ups before you get your file. No ads chasing you around the page. Just a straight line between you and the video you want. That line is ytdownloader, and it belongs to you the moment you open it.</p>',

      '<h3>// THE FUTURE //</h3>',
      '<p>This is version 1.0, and it is already working. But the road does not stop here. More backends, more formats, more platforms, better speeds, smoother interfaces — the plan is to keep sharpening this blade until it is the sharpest downloader the web has ever seen. And every single upgrade will stay free, because that is the only version dvc knows how to ship.</p>',

      '<h3>// THE FINAL WORDS //</h3>',
      '<p>If you reached this page, you are part of the story now. You are one of the people who believed that free tools can still be good tools. So go ahead — paste a link, pick a quality, hit download, and enjoy your video. And if this tool has ever helped you, remember: a small donation is all it takes to make sure it stays here forever.</p>',
      '<p><span class="highlight">Thank you for using ytdownloader.</span> Built with sweat, shipped with love, kept free on purpose.</p>',
      '<div class="code-block">/* ytdownloader v1.0 | (c) dvc | free forever | donations = keep it alive */</div>'
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
        const done = () => { copyBtn.textContent = '[ COPIED! ]'; toast('GCash number copied!'); setTimeout(() => { copyBtn.textContent = '[ COPY_GCASH_NO ]'; }, 2200); };
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

  /* ── SETTINGS PAGE ── */
  const cobaltInput = $('#cobaltKey');
  const saveBtn = $('#saveSettingsBtn');
  const settingsStatus = $('#settingsStatus');

  try {
    cobaltInput.value = localStorage.getItem('ytdl_cobalt_key') || '';
  } catch (e) {}

  saveBtn.addEventListener('click', () => {
    const cKey = cobaltInput.value.trim();
    try {
      localStorage.setItem('ytdl_cobalt_key', cKey);
      settingsStatus.textContent = '// settings saved //';
      settingsStatus.className = 'term-note green';
      toast('settings saved');
    } catch (e) {
      settingsStatus.textContent = '// error saving settings //';
      settingsStatus.className = 'term-note err';
    }
  });

  /* ── EVENTS ── */
  resolveBtn.addEventListener('click', doResolve);
  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doResolve(); });
  $('#downloadAgainBtn').addEventListener('click', () => {
    hide($('#resultPanel'));
    hide($('#videoInfo'));
    hide($('#qualityPanel'));
    hide($('#progressPanel'));
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
  initMatrix();
  initTilt();
  runBoot();
});