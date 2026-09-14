'use strict';

function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
document.addEventListener('DOMContentLoaded', function () {
  var $ = function $(s) {
    return document.querySelector(s);
  };
  var $$ = function $$(s) {
    return Array.from(document.querySelectorAll(s));
  };
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function toast(msg) {
    var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3200;
    var t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._h);
    t._h = setTimeout(function () {
      return t.classList.add('hidden');
    }, ms);
  }
  function fmtBytes(b) {
    if (!b || b <= 0) return '?';
    var u = ['B', 'KB', 'MB', 'GB'];
    var i = 0;
    while (b >= 1024 && i < u.length - 1) {
      b /= 1024;
      i++;
    }
    return b.toFixed(i > 1 ? 1 : 0) + ' ' + u[i];
  }
  function show(el) {
    el.classList.remove('hidden');
  }
  function hide(el) {
    el.classList.add('hidden');
  }
  var isApk = new URLSearchParams(location.search).has('fromapp');
  function androidDownload(url, filename) {
    if (window.AppDownloader && window.AppDownloader.download) {
      try {
        window.AppDownloader.download(url, filename);
        return true;
      } catch (e) {}
    }
    return false;
  }
  window.ytdl = {
    androidDownload: androidDownload,
    getIsApk: function getIsApk() {
      return isApk;
    }
  };
  function runBoot() {
    var bar = $('#bootBarFill');
    var p = 0;
    var iv = setInterval(function () {
      p += 6 + Math.floor(Math.random() * 8);
      if (p >= 100) {
        p = 100;
      }
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
    setTimeout(function () {
      $('#bootScreen').style.display = 'none';
    }, 600);
  }
  function renderTutorial() {
    var vid = $('#tutorialVideo');
    if (!vid) return;
    var src = isApk ? 'assets/tutorial/app.mp4' : 'assets/tutorial/webpage.mp4';
    if (vid.dataset.src !== src) {
      vid.dataset.src = src;
      vid.src = src;
      vid.load();
    }
    var hint = $('#tutorialHint');
    if (hint) {
      hint.textContent = isApk ? '// tutorial video for the ytdownloader Android app //' : '// tutorial video for the ytdownloader website — ' + src + ' //';
    }
  }
  function switchPage(name) {
    $$('.nav-btn').forEach(function (b) {
      return b.classList.toggle('active', b.dataset.page === name);
    });
    $$('.page').forEach(function (p) {
      return p.classList.toggle('active', p.id === 'page-' + name);
    });
    if (name === 'library') renderLibrary();
    if (name === 'about') renderAbout();
    if (name === 'tutorial') renderTutorial();
    window.scrollTo({
      top: 0
    });
  }
  $$('.nav-btn').forEach(function (b) {
    return b.addEventListener('click', function () {
      return switchPage(b.dataset.page);
    });
  });
  var state = {
    resolved: null,
    resolvedUrl: null,
    activeQuality: null,
    currentTask: null,
    hasQualities: false
  };
  function setStatus(msg, cls) {
    var el = $('#statusLine');
    el.textContent = '// ' + msg + ' //';
    el.className = 'term-note ' + (cls || '');
  }
  function getSettings() {
    var cobaltKey = '';
    try {
      cobaltKey = localStorage.getItem('ytd_cobalt_key') || '';
    } catch (e) {}
    var selfHostUrl = '';
    try {
      selfHostUrl = localStorage.getItem('ytd_selfhost_url') || '';
    } catch (e) {}
    return {
      cobaltKey: cobaltKey,
      selfHostUrl: selfHostUrl
    };
  }
  function saveCobaltKey(k) {
    try {
      localStorage.setItem('ytd_cobalt_key', (k || '').trim());
      YTD.setCobaltKey(k);
    } catch (e) {}
    toast('Cobalt API key saved (sk_…)');
    renderBackendStatus();
  }
  var keyInput = $('#cobaltKeyInput');
  var saveKeyBtn = $('#saveKeyBtn');
  var serverInput = $('#serverUrlInput');
  var saveServerBtn = $('#saveServerBtn');
  function saveServerUrl() {
    var val = serverInput.value.trim();
    YTD.setSelfHostUrl(val);
    toast(val ? 'Server URL saved — using your own backend' : 'Server URL cleared');
    renderBackendStatus();
  }
  function renderBackendStatus() {
    return _renderBackendStatus.apply(this, arguments);
  }
  function _renderBackendStatus() {
    _renderBackendStatus = _asyncToGenerator(_regenerator().m(function _callee2() {
      var el, info, sh, add, c, ver;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            el = $('#backendStatus');
            if (el) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            info = YTD._serverInfo;
            el.innerHTML = '';
            sh = YTD.getSelfHostUrl();
            add = function add(k, v, cls) {
              var row = document.createElement('div');
              row.className = 'backend-row detail';
              row.innerHTML = '<span class="backend-k">' + esc(k) + '</span><span class="backend-v ' + (cls || '') + '">' + esc(v) + '</span>';
              el.appendChild(row);
            };
            if (sh) {
              add('self-host server', sh.replace(/^https?:\/\//, '') + ' ✓', 'green');
              add('self-host auth', 'own server — recommended path', 'green');
            } else {
              add('self-host server', 'not set — using public backends', 'dim');
            }
            if (info) {
              _context2.n = 2;
              break;
            }
            add('cobalt server', 'unreachable', 'red');
            add('auth', YTD.cobaltAuthStatus(), 'yellow');
            add('hint', 'Set your own server URL above for the guaranteed path. The cobalt API is also unreachable — downloads will fall back to the cobalt web helper.', 'dim');
            return _context2.a(2);
          case 2:
            c = info.cobalt || {};
            ver = info.cobalt ? 'v' + String(info.cobalt.version || '').replace(/^v/, '') : 'unknown';
            add('cobalt server', ver + ' · ' + (YTD.COBALT_API || '').replace(/^https?:\/\//, ''), 'green');
            add('turnstile sitekey', c.turnstileSitekey ? c.turnstileSitekey.slice(0, 10) + '…' : 'absent', 'dim');
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
          case 3:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _renderBackendStatus.apply(this, arguments);
  }
  function initCobalt() {
    return _initCobalt.apply(this, arguments);
  }
  function _initCobalt() {
    _initCobalt = _asyncToGenerator(_regenerator().m(function _callee3() {
      var saved, savedSh, r, u, _t2, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _context3.n = 1;
            return YTD.getCobaltServerInfo();
          case 1:
            _context3.n = 3;
            break;
          case 2:
            _context3.p = 2;
            _t2 = _context3.v;
          case 3:
            saved = YTD.getCobaltKey();
            if (saved) keyInput.value = saved;
            savedSh = YTD.getSelfHostUrl();
            if (savedSh) serverInput.value = savedSh;
            renderBackendStatus();
            _context3.p = 4;
            _context3.n = 5;
            return fetch('./server.txt?ts=' + Date.now(), {
              cache: 'no-store'
            });
          case 5:
            r = _context3.v;
            if (!r.ok) {
              _context3.n = 7;
              break;
            }
            _context3.n = 6;
            return r.text();
          case 6:
            u = _context3.v.trim().replace(/\/+$/, '');
            if (/^https:\/\/.+\.trycloudflare\.com$/.test(u)) {
              if (u !== savedSh) {
                YTD.setSelfHostUrl(u);
                serverInput.value = u;
                renderBackendStatus();
                toast('Your download server connected ✓', 3200);
              }
            }
          case 7:
            _context3.n = 9;
            break;
          case 8:
            _context3.p = 8;
            _t3 = _context3.v;
          case 9:
            if (!YTD.hasCobaltKey()) {
              try {
                YTD.initTurnstile();
              } catch (e) {}
            }
            $('#cobaltFallbackBtn').addEventListener('click', function () {
              var u = urlInput.value.trim() || state.resolved && state.resolved.url;
              if (u) YTD.openCobaltWeb(u, 'auto');
            });
          case 10:
            return _context3.a(2);
        }
      }, _callee3, null, [[4, 8], [0, 2]]);
    }));
    return _initCobalt.apply(this, arguments);
  }
  window.__saveServer = saveServerUrl;
  saveServerBtn.addEventListener('click', saveServerUrl);
  serverInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveServerUrl();
  });
  saveKeyBtn.addEventListener('click', function () {
    return saveCobaltKey(keyInput.value);
  });
  keyInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveCobaltKey(keyInput.value);
  });
  var resolveBtn = $('#resolveBtn');
  var urlInput = $('#urlInput');
  function doResolve() {
    return _doResolve.apply(this, arguments);
  }
  function _doResolve() {
    _doResolve = _asyncToGenerator(_regenerator().m(function _callee4() {
      var url, settings, res, vi, msg, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            url = urlInput.value.trim();
            if (url) {
              _context4.n = 1;
              break;
            }
            toast('Please paste a YouTube link first');
            return _context4.a(2);
          case 1:
            hide($('#resultPanel'));
            hide($('#videoInfo'));
            hide($('#qualityPanel'));
            hide($('#progressPanel'));
            state.resolved = null;
            state.activeQuality = null;
            state.hasQualities = false;
            resolveBtn.disabled = true;
            resolveBtn.textContent = 'Loading...';
            setStatus('resolving link, please wait...', '');
            _context4.p = 2;
            settings = getSettings();
            _context4.n = 3;
            return YTD.resolve(url, {
              cobaltKey: settings.cobaltKey
            });
          case 3:
            res = _context4.v;
            state.resolved = res;
            state.resolvedUrl = url;
            vi = $('#videoInfo');
            $('#thumbImg').src = res.thumb || 'assets/Ytdl.png';
            $('#videoTitle').textContent = res.title;
            $('#videoChannel').textContent = '// channel: ' + res.channel + ' //';
            $('#videoDuration').textContent = (res.duration && res.duration !== '-' ? '// duration: ' + res.duration + ' // ' : '// ') + 'engine: ' + res.backend + ' //';
            show(vi);
            renderQualities(res.qualities);
            show($('#qualityPanel'));
            setStatus('ready — pick a quality below', 'green');
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t4 = _context4.v;
            console.error('resolve error:', _t4);
            hide($('#videoInfo'));
            hide($('#qualityPanel'));
            $('#resultMsg').className = 'result-msg';
            msg = '<b>Unable to resolve that link.</b><div class="dim">' + esc(_t4.message) + '<br><br>Tips: check your internet connection · paste the full YouTube link · or try a direct .mp4 link.</div>';
            if (_t4.cobaltFallback) {
              msg = '<b>All direct backends are currently out of reach.</b><div class="dim">' + esc(_t4.message) + '<br><br>Use the <b>cobalt.tools</b> helper on the right — it opens the official Cobalt downloader with your link pre-loaded, solves its own captcha automatically, and saves your file. (100% free, no account needed.)</div>';
              show($('#cobaltFallbackBtn'));
            } else {
              hide($('#cobaltFallbackBtn'));
            }
            $('#resultMsg').innerHTML = msg;
            show($('#resultPanel'));
            setStatus('error', 'err');
          case 5:
            _context4.p = 5;
            resolveBtn.disabled = false;
            resolveBtn.textContent = 'Download';
            return _context4.f(5);
          case 6:
            return _context4.a(2);
        }
      }, _callee4, null, [[2, 4, 5, 6]]);
    }));
    return _doResolve.apply(this, arguments);
  }
  function renderQualities(qualities) {
    var grid = $('#qualityGrid');
    grid.innerHTML = '';
    var qn = $('#qualityNote');
    var videos = qualities.filter(function (q) {
      return q.kind !== 'audio';
    });
    var audios = qualities.filter(function (q) {
      return q.kind === 'audio';
    });
    var first = null;
    videos.forEach(function (q, idx) {
      var b = document.createElement('button');
      b.className = 'q-btn' + (idx === 0 ? ' selected' : '');
      b.innerHTML = '<span class="q-label">' + esc(q.label) + '</span>' + '<span class="q-sub">' + esc(q.sub) + '</span>' + '<span class="q-tag video">video</span>';
      b.addEventListener('click', function () {
        $$('.q-btn').forEach(function (x) {
          return x.classList.remove('selected');
        });
        b.classList.add('selected');
        state.activeQuality = q;
        toast('Selected: ' + q.label);
      });
      grid.appendChild(b);
      if (!first) first = q;
    });
    audios.forEach(function (q) {
      var b = document.createElement('button');
      b.className = 'q-btn';
      b.innerHTML = '<span class="q-label">' + esc(q.label) + '</span>' + '<span class="q-sub">' + esc(q.sub) + '</span>' + '<span class="q-tag audio">audio only</span>';
      b.addEventListener('click', function () {
        $$('.q-btn').forEach(function (x) {
          return x.classList.remove('selected');
        });
        b.classList.add('selected');
        state.activeQuality = q;
        toast('Selected: ' + q.label);
      });
      grid.appendChild(b);
    });
    state.activeQuality = state.activeQuality || first;
    state.hasQualities = true;
    var sizes = qualities.filter(function (q) {
      return q.size;
    }).map(function (q) {
      return fmtBytes(q.size);
    }).join(' | ');
    qn.textContent = sizes ? '// approx size: ' + sizes + ' //' : '// qualities found from available streams //';
    if (state.activeQuality) toast('Selected: ' + state.activeQuality.label + ' — press Download');
  }
  function termReset() {
    var L = $('#progressLog');
    if (L) L.innerHTML = '';
    var P = $('#progressPct');
    if (P) P.textContent = '0%';
  }
  function termLog(msg, cls) {
    var L = $('#progressLog');
    if (!L) return;
    var d = document.createElement('span');
    d.className = 'line ' + (cls || '');
    d.textContent = msg;
    L.appendChild(d);
    while (L.children.length > 14) L.removeChild(L.firstChild);
    L.scrollTop = L.scrollHeight;
  }
  function termPct(p) {
    var P = $('#progressPct');
    if (P) P.textContent = Math.max(0, Math.min(100, Math.round(p))) + '%';
  }
  var BOOT_LINES = [['$ g++ downloader.cpp -o ytd && ./ytd', 'cmd'], ['[C++ WGET] linking core module ........ OK', 'ok'], ['[C++ WGET] connecting to ytdlserve ...... OK', 'ok'], ['[C++ WGET] acquiring stream handle ........', 'dim']];
  function termBoot() {
    termReset();
    BOOT_LINES.forEach(function (_ref, i) {
      var _ref2 = _slicedToArray(_ref, 2),
        t = _ref2[0],
        c = _ref2[1];
      return setTimeout(function () {
        return termLog(t, c);
      }, 130 * i);
    });
  }
  function cleanFilename(title, ext) {
    var f = title.replace(/[\\/:*?"<>|#%&{}]/g, '_').replace(/\s+/g, '_').slice(0, 120);
    if (!f) f = 'ytdownload';
    return f + '.' + (ext || 'mp4');
  }
  function extFor(q) {
    if (!q) return 'mp4';
    if (q.ext && /^(mp4|webm|mkv|m4a|mp3|opus|ogg)$/.test(q.ext)) return q.ext;
    if (!q.mime) return 'mp4';
    if (q.mime.includes('webm')) return 'webm';
    if (q.mime.includes('mp3')) return 'mp3';
    if (q.mime.includes('m4a')) return 'm4a';
    if (q.mime.includes('opus')) return 'opus';
    if (q.mime.includes('ogg')) return 'ogg';
    return 'mp4';
  }
  function doDownload() {
    return _doDownload.apply(this, arguments);
  }
  function _doDownload() {
    _doDownload = _asyncToGenerator(_regenerator().m(function _callee5() {
      var q, res, filename, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            if (state.activeQuality) {
              _context5.n = 1;
              break;
            }
            toast('Pick a quality first');
            return _context5.a(2);
          case 1:
            if (!state.currentTask) {
              _context5.n = 2;
              break;
            }
            toast('A download is already running');
            return _context5.a(2);
          case 2:
            q = state.activeQuality;
            res = state.resolved;
            filename = cleanFilename(res.title, extFor(q));
            if (!q.selfhost) {
              _context5.n = 4;
              break;
            }
            _context5.n = 3;
            return doSelfHostDownload(q, res, filename);
          case 3:
            return _context5.a(2);
          case 4:
            if (!(isApk && androidDownload(q.url, filename))) {
              _context5.n = 5;
              break;
            }
            toast('Download started — check your phone Download folder', 4200);
            recordDownload(res, q, filename, 'android-downloads');
            setStatus('downloading to phone /Download', 'green');
            return _context5.a(2);
          case 5:
            setStatus('downloading — ' + filename, 'cpp');
            show($('#progressPanel'));
            hide($('#resultPanel'));
            termBoot();
            setTimeout(function () {
              try {
                $('#progressPanel').scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest'
                });
              } catch (e) {}
            }, 120);
            $('#progressLabel').textContent = 'downloading ' + q.label + ' ...';
            $('#progressFill').style.width = '0%';
            $('#progressStats').textContent = '';
            setTimeout(function () {
              return termLog('[C++ WGET] opening stream → device ........', 'dim');
            }, 450);
            _context5.p = 6;
            state.currentTask = YTD.downloadStream(q.url, filename);
            state.currentTask._t0 = Date.now();
            state.currentTask.onProgress = function (recv, total) {
              var pct = total ? Math.min(100, Math.round(recv / total * 100)) : 0;
              $('#progressFill').style.width = pct + '%';
              termPct(pct);
              var spd = recv / Math.max(1, (Date.now() - state.currentTask._t0) / 1000);
              $('#progressStats').textContent = fmtBytes(recv) + (total ? ' / ' + fmtBytes(total) : '') + ' · ' + pct + '%' + ' · ' + fmtBytes(spd) + '/s';
            };
            _context5.n = 7;
            return new Promise(function (resv, rej) {
              var iv = setInterval(function () {
                var t = state.currentTask;
                if (!t) {
                  clearInterval(iv);
                  rej(new Error('cancelled'));
                } else if (t.done) {
                  clearInterval(iv);
                  resv();
                } else if (t.error) {
                  clearInterval(iv);
                  rej(t.error);
                } else if (t.aborted) {
                  clearInterval(iv);
                  rej(new Error('aborted'));
                }
              }, 220);
            });
          case 7:
            $('#progressFill').style.width = '100%';
            $('#progressLabel').textContent = 'Done!';
            termLog('[C++ WGET] transfer complete ✔', 'ok');
            termLog('$ echo "DOWNLOAD COMPLETE" » exit code 0', 'cmd');
            recordDownload(res, q, filename, 'browser-download');
            hide($('#progressPanel'));
            showResult('<b>Download complete!</b><div class="dim">Check your browser download folder.</div>');
            setStatus('done — saved to downloads', 'green');
            _context5.n = 9;
            break;
          case 8:
            _context5.p = 8;
            _t5 = _context5.v;
            hide($('#progressPanel'));
            showResult('<b>Download failed:</b> ' + esc(_t5.message));
            setStatus('error', 'err');
          case 9:
            _context5.p = 9;
            state.currentTask = null;
            return _context5.f(9);
          case 10:
            return _context5.a(2);
        }
      }, _callee5, null, [[6, 8, 9, 10]]);
    }));
    return _doDownload.apply(this, arguments);
  }
  function doSelfHostDownload(_x, _x2, _x3) {
    return _doSelfHostDownload.apply(this, arguments);
  }
  function _doSelfHostDownload() {
    _doSelfHostDownload = _asyncToGenerator(_regenerator().m(function _callee6(q, res, filename) {
      var ytUrl, taskId, lastPct, wasProcessing, fileUrl, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            ytUrl = state.resolvedUrl || urlInput.value.trim();
            if (ytUrl) {
              _context6.n = 1;
              break;
            }
            toast('No source URL — paste the link again');
            return _context6.a(2);
          case 1:
            setStatus('server: preparing download…', 'cpp');
            show($('#progressPanel'));
            hide($('#resultPanel'));
            termBoot();
            setTimeout(function () {
              try {
                $('#progressPanel').scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest'
                });
              } catch (e) {}
            }, 120);
            $('#progressLabel').textContent = 'server is preparing ' + q.label + ' …';
            $('#progressFill').style.width = '0%';
            $('#progressStats').textContent = '';
            setTimeout(function () {
              return termLog('[C++ WGET] requesting task from ytdlserve ........', 'dim');
            }, 450);
            _context6.p = 2;
            _context6.n = 3;
            return YTD.selfHostStart(ytUrl, q, filename);
          case 3:
            taskId = _context6.v;
            termLog('[C++ WGET] task acquired → ' + taskId.slice(0, 8) + '…', 'ok');
            termLog(q.ext === 'mp3' ? '[yt-dlp] fetching bestaudio → converting to MP3 320k ...' : q.ext === 'm4a' || q.kind === 'audio' ? '[yt-dlp] fetching audio stream (AAC) ..........' : '[yt-dlp] fetching video+audio streams ...', 'dim');
            lastPct = -1;
            wasProcessing = false;
            _context6.n = 4;
            return YTD.selfHostPoll(taskId, function (p) {
              var pct = Math.max(0, Math.min(100, Math.round(p.progress || 0)));
              termPct(pct);
              if (pct > 5 && lastPct <= 5) termLog('[yt-dlp] streaming from YouTube .........', 'ok');
              if (pct >= 50 && lastPct < 50) termLog(q.ext === 'mp3' ? '[ffmpeg] converting audio → MP3 320k ...' : '[ffmpeg] muxing video+audio streams ...', 'warn');
              if (p.status === 'processing' && !wasProcessing) {
                wasProcessing = true;
                termLog('[ffmpeg] merging … please wait', 'dim');
              }
              if (pct !== lastPct) {
                lastPct = pct;
                $('#progressFill').style.width = pct + '%';
              }
              var st = p.status || '';
              $('#progressStats').textContent = (st === 'processing' ? 'merging video+audio …' : st === 'downloading' ? 'downloading from YouTube: ' : '') + (p.message || '');
              $('#progressLabel').textContent = st === 'processing' ? 'merging on server…' : 'server · ' + q.label;
              setStatus(st === 'processing' ? 'server: merging video+audio …' : 'server: downloading ' + pct + '%', 'cpp');
            });
          case 4:
            fileUrl = _context6.v;
            $('#progressLabel').textContent = 'downloading file…';
            $('#progressFill').style.width = '100%';
            $('#progressStats').textContent = 'server finished — receiving file…';
            termPct(100);
            termLog('[C++ WGET] merging complete ✔ payload ready', 'ok');
            if (!(isApk && androidDownload(fileUrl, filename))) {
              _context6.n = 5;
              break;
            }
            toast('Download started — check your phone Download folder', 4200);
            recordDownload(res, q, filename, 'server-merge');
            hide($('#progressPanel'));
            showResult('<b>Download complete!</b><div class="dim">Saved to your phone <b>/Download/ytdownloader</b> folder.</div>');
            setStatus('done — saved to phone /Download', 'green');
            return _context6.a(2);
          case 5:
            state.currentTask = YTD.downloadStream(fileUrl, filename);
            state.currentTask._t0 = Date.now();
            state.currentTask.onProgress = function (recv, total) {
              var pct = total ? Math.min(100, Math.round(recv / total * 100)) : 0;
              $('#progressFill').style.width = pct + '%';
              termPct(pct);
              var spd = recv / Math.max(1, (Date.now() - state.currentTask._t0) / 1000);
              $('#progressStats').innerHTML = fmtBytes(recv) + (total ? ' / ' + fmtBytes(total) : '') + ' · ' + pct + '%' + ' · ' + fmtBytes(spd) + '/s';
            };
            _context6.n = 6;
            return new Promise(function (resv, rej) {
              var iv = setInterval(function () {
                var t = state.currentTask;
                if (!t) {
                  clearInterval(iv);
                  rej(new Error('cancelled'));
                } else if (t.done) {
                  clearInterval(iv);
                  resv();
                } else if (t.error) {
                  clearInterval(iv);
                  rej(t.error);
                } else if (t.aborted) {
                  clearInterval(iv);
                  rej(new Error('aborted'));
                }
              }, 220);
            });
          case 6:
            $('#progressFill').style.width = '100%';
            $('#progressLabel').textContent = 'Done!';
            termLog('[C++ WGET] transfer complete ✔', 'ok');
            termLog('$ echo "DOWNLOAD COMPLETE" » exit code 0', 'cmd');
            recordDownload(res, q, filename, 'server-merge');
            hide($('#progressPanel'));
            showResult('<b>Download complete!</b><div class="dim">Merged on your server, saved to your downloads folder.</div>');
            setStatus('done — saved to downloads', 'green');
            _context6.n = 8;
            break;
          case 7:
            _context6.p = 7;
            _t6 = _context6.v;
            hide($('#progressPanel'));
            termLog('[C++ WGET] transfer FAILED: ' + esc(_t6.message.slice(0, 80)), 'err');
            showResult('<b>Download failed:</b> ' + esc(_t6.message));
            setStatus('error', 'err');
          case 8:
            _context6.p = 8;
            state.currentTask = null;
            return _context6.f(8);
          case 9:
            return _context6.a(2);
        }
      }, _callee6, null, [[2, 7, 8, 9]]);
    }));
    return _doSelfHostDownload.apply(this, arguments);
  }
  function showResult(html) {
    var r = $('#resultMsg');
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
      url: q.url || (q.selfhost ? state.resolvedUrl || null : null),
      f: q.f || null,
      selfhost: !!q.selfhost,
      ext: q.ext || null,
      filename: filename,
      thumb: res.thumb || null,
      size: q.size || null,
      method: method,
      backend: res.backend
    }).then(function () {
      if ($('#page-library').classList.contains('active')) renderLibrary();
    }).catch(function () {});
  }
  function renderLibrary() {
    return _renderLibrary.apply(this, arguments);
  }
  function _renderLibrary() {
    _renderLibrary = _asyncToGenerator(_regenerator().m(function _callee8() {
      var list, clearBtn, items, _t8;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            list = $('#libraryList');
            clearBtn = $('#clearLibraryBtn');
            items = [];
            _context8.p = 1;
            _context8.n = 2;
            return YTDB.getAll();
          case 2:
            items = _context8.v;
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t8 = _context8.v;
          case 4:
            if (items.length) {
              _context8.n = 5;
              break;
            }
            list.innerHTML = '<div class="lib-empty">// library empty — nothing downloaded yet //</div>';
            clearBtn.classList.add('hidden');
            return _context8.a(2);
          case 5:
            clearBtn.classList.remove('hidden');
            list.innerHTML = '';
            items.forEach(function (it) {
              var el = document.createElement('div');
              el.className = 'lib-item';
              var thumb = it.thumb ? '<img class="lib-thumb" src="' + esc(it.thumb) + '" alt="">' : '<img class="lib-thumb" src="assets/Ytdl.png" alt="">';
              var date = new Date(it.ts).toLocaleString();
              el.innerHTML = thumb + '<div class="lib-info">' + '<div class="lib-title">' + esc(it.title) + '</div>' + '<div class="lib-sub">' + esc(it.quality) + ' · ' + esc(it.method) + ' · ' + (it.size ? fmtBytes(it.size) : '?') + ' · ' + esc(date) + '</div>' + '</div>' + '<div class="lib-actions">' + '<button class="lib-icon-btn" data-act="dl" title="download again">&#8595;</button>' + '<button class="lib-icon-btn" data-act="del" title="delete record">&#128465;</button>' + '</div>';
              el.querySelector('[data-act="dl"]').addEventListener('click', function () {
                if (it.selfhost && it.f) {
                  var sh = YTD.getSelfHostUrl();
                  if (!sh) {
                    toast('Set your server URL first (Backend settings)');
                    return;
                  }
                  var isAudio = /audio/i.test(it.quality || '');
                  var _q = {
                    label: it.quality,
                    sub: 'server re-download',
                    kind: isAudio ? 'audio' : 'video',
                    ext: it.ext || (isAudio ? 'm4a' : 'mp4'),
                    mime: isAudio ? 'audio/mp4' : 'video/mp4',
                    f: it.f,
                    selfhost: true
                  };
                  state.resolved = {
                    title: it.title,
                    channel: it.channel,
                    thumb: it.thumb,
                    backend: 'selfhost',
                    qualities: [_q]
                  };
                  state.resolvedUrl = it.url;
                  state.activeQuality = _q;
                  doDownload();
                  return;
                }
                var q = {
                  label: it.quality,
                  url: it.url,
                  mime: it.url.includes('.webm') ? 'video/webm' : 'video/mp4'
                };
                state.resolved = {
                  title: it.title,
                  channel: it.channel,
                  thumb: it.thumb,
                  backend: it.backend,
                  qualities: [q]
                };
                state.activeQuality = q;
                doDownload();
              });
              el.querySelector('[data-act="del"]').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee7() {
                var _t7;
                return _regenerator().w(function (_context7) {
                  while (1) switch (_context7.p = _context7.n) {
                    case 0:
                      _context7.p = 0;
                      _context7.n = 1;
                      return YTDB.remove(it.ts);
                    case 1:
                      _context7.n = 3;
                      break;
                    case 2:
                      _context7.p = 2;
                      _t7 = _context7.v;
                    case 3:
                      renderLibrary();
                    case 4:
                      return _context7.a(2);
                  }
                }, _callee7, null, [[0, 2]]);
              })));
              list.appendChild(el);
            });
          case 6:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3]]);
    }));
    return _renderLibrary.apply(this, arguments);
  }
  $('#clearLibraryBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee() {
    var _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return YTDB.clear();
        case 1:
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
        case 3:
          renderLibrary();
          toast('Library cleared');
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  })));
  function aboutHtml() {
    return ['<div class="about-logo"><img src="assets/Ytdl.png" alt="ytdownloader"></div>', '<h3>THE CREATOR — dvc</h3>', '<p>ytdownloader was designed, engineered, and shipped by <span class="highlight">dvc</span> — a builder who believes that technology should be free, fast, and honest. No corporations, no middlemen, no hidden paywalls, no tricks. Just a clean tool and the will to make video downloading simple for everyone — wherever you are, whatever device you use.</p>', '<h3>THE PHILOSOPHY</h3>', '<p>Almost every so-called "free" downloader on the internet is either full of clickbait, riddled with malware, locked behind premium subscriptions, or quietly harvesting your data. dvc saw that mess and built the opposite — a lean, honest tool that treats you like a human being, not like a product.</p>', '<p>You paste a link, you pick your quality, you hit download, and the file lands on your device. That is the whole deal. That is the promise.</p>', '<h3>WHO IS dvc?</h3>', '<p>dvc is not a company. dvc is not a faceless team of marketers. dvc is one determined individual who loves software the way it was meant to be — useful, open, and unpretentious. Every build, every fix, every feature was done with full care and full execution.</p>', '<h3>THE BUILD</h3>', '<p>This is a hand-built application — a multi-backend engine that talks to public video APIs, a local download library that remembers what you grab, and a native Android app compiled with a bare-metal command-line pipeline. No gigabytes of bloat, no fake "AI-powered" marketing fluff. Just code that works, packaged tight, and tested until it holds.</p>', '<p>The Android app saves downloads straight into your phone\'s <span class="highlight">Download folder</span> — the same folder your file manager shows you every day. Your downloads belong to you.</p>', '<h3>FREE FOREVER</h3>', '<p><span class="highlight">ytdownloader is and will remain 100% free.</span> No premium tier hiding good qualities. No "pro" version. No ads interrupting your downloads. The best quality, the fastest engine, the full library — everything is in the free version, because there is only one version. One tool, one standard, for everyone.</p>', '<h3>HOW DOES IT STAY ALIVE? — DONATIONS</h3>', '<p>Servers cost money. Domains cost money. Time costs money. But instead of charging the people who use it, instead of stuffing the page with ads, ytdownloader is sustained <span class="highlight">100% by donations</span> — by people like you who believe free tools deserve to exist.</p>', '<p>If ytdownloader has helped you, the best thing you can do is send a small donation. Even a small amount keeps the servers online, the backends alive, and the downloads unlimited for the next person, and the next, and the next.</p>', '<p>Every donation is a message that says: <span class="highlight">"I want this tool to stay alive."</span></p>', '<h3>SUPPORT THE BUILD — GCASH</h3>', '<div class="donate-box">', '<div class="donate-icon">&#128154;</div>', '<div class="donate-text">', '<div class="donate-title">GCASH DONATION</div>', '<div class="donate-num" id="gcashNum">+639945160282</div>', '<div class="donate-note">open your GCash app &gt; Send Money &gt; enter number above</div>', '<button id="copyGcashBtn" class="btn btn-donate">Copy GCash number</button>', '</div>', '</div>', '<p><span class="highlight">Thank you</span> — genuinely — to everyone who donates. You are the reason this tool stays online, stays updated, and stays free for everyone. Every peso keeps the light on.</p>', '<h3>THE PROMISE</h3>', '<p>No spyware. No hidden miners. No surprise subscriptions. No "download this extra app first" nonsense. No 47 pop-ups. No ads chasing you around the page. Just a straight line between you and the video you want. That line is ytdownloader, and it belongs to you the moment you open it.</p>', '<div class="code-block">/* ytdownloader v1.1 · (c) dvc · free forever · donations = keep it alive */</div>'].join('\n');
  }
  function renderAbout() {
    var el = $('#aboutContent');
    if (el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = aboutHtml();
    var copyBtn = $('#copyGcashBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var num = '+639945160282';
        var done = function done() {
          copyBtn.textContent = 'Copied!';
          toast('GCash number copied');
          setTimeout(function () {
            copyBtn.textContent = 'Copy GCash number';
          }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(num).then(done).catch(function () {
            return fallbackCopy(num, done);
          });
        } else {
          fallbackCopy(num, done);
        }
      });
    }
  }
  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement('textarea');
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
  function onPrimaryAction() {
    if (state.hasQualities && state.resolved) doDownload();else doResolve();
  }
  resolveBtn.addEventListener('click', onPrimaryAction);
  urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') onPrimaryAction();
  });
  urlInput.addEventListener('input', function () {
    state.hasQualities = false;
  });
  $('#downloadAgainBtn').addEventListener('click', function () {
    hide($('#resultPanel'));
    hide($('#videoInfo'));
    hide($('#qualityPanel'));
    hide($('#progressPanel'));
    hide($('#cobaltFallbackBtn'));
    state.resolved = null;
    state.activeQuality = null;
    state.hasQualities = false;
    urlInput.value = '';
    urlInput.focus();
    setStatus('system: idle', '');
  });
  if (isApk) {
    var s = $('#downloadAppSection');
    if (s) hide(s);
  }
  // ── SELF-HOST SERVER MONITOR (automation) ──────────────────
  // Bawat 15s: i-ping ang selfhost server.
  //  buhay  → status badge = ► server online (green)
  //  patay  → auto-fetch fresh server.txt → bagong tunnel URL →
  //           i-update ang input + localStorage → re-probe →
  //           kung buhay = 'reconnected' (toast + green)
  //  patay pa rin → badge = ✕ offline (red), patuloy mag-poll
  // Pagka-start ni @dvc ng server (bash restart_ytd.sh), ang app
  // ay awtomatikong kukuha ng bagong URL at babalik sa normal.
  var serverBadge = $('#serverStatusBadge');
  function setServerBadge(status, detail) {
    if (!serverBadge) return;
    var cls = 'server-badge';
    var label;
    if (status === 'alive') { cls += ' alive'; label = 'server online'; }
    else if (status === 'reconnected') { cls += ' alive'; label = 'server re-connected ✓'; }
    else if (status === 'checking') { cls += ' checking'; label = 'checking server…'; }
    else if (status === 'dead') { cls += ' dead'; label = 'server offline — waiting…'; }
    else { cls += ' checking'; label = '…'; }
    serverBadge.className = cls;
    serverBadge.textContent = label;
  }
  function setupServerMonitor() {
    if (YTD.serverMonitor && typeof YTD.serverMonitor.start === 'function') {
      YTD.serverMonitor.onStatus(function (status, detail) {
        setServerBadge(status, detail);
        if (status === 'reconnected' && detail) {
          // sync ang input sa bagong URL + ipaalam sa user
          serverInput.value = detail.url || '';
          try { window.localStorage.setItem('ytd_selfhost_url', detail.url || ''); } catch (e) {}
          toast('Server reconnected — new tunnel detected ✓', 4000);
          renderBackendStatus();
        } else if (status === 'alive' && detail && detail.url) {
          if (serverInput.value !== detail.url) serverInput.value = detail.url;
        } else if (status === 'dead') {
          serverInput.classList.add('input-state-dead');
        } else {
          serverInput.classList.remove('input-state-dead');
        }
      });
      YTD.serverMonitor.start();
    }
  }
  initCobalt();
  setupServerMonitor();
  runBoot();
});