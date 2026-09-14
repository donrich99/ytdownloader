'use strict';

function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var YTD = {
  VERSION: '2.3.0',
  PIPED_INSTANCES: ['https://api.piped.private.coffee', 'https://pipedapi.kavin.rocks', 'https://api.piped.projectsegfau.lt', 'https://pipedapi.leptons.xyz', 'https://pipedapi.orangenet.cc', 'https://pipedapi.adminforge.de', 'https://pipedapi.reallyaweso.me', 'https://pipedapi.ducks.party', 'https://pipedapi.r4fo.com', 'https://pipedapi.drgns.space', 'https://api.piped.yt', 'https://pipedapi.vern.cc'],
  INVIDIOUS_INSTANCES: ['https://inv.nadeko.net', 'https://invidious.nerdvpn.de', 'https://iv.melmac.space', 'https://invidious.f5.si', 'https://iv.ggtyler.dev', 'https://invidious.privacyredirect.com', 'https://invidious.jing.rocks', 'https://iv.datura.network', 'https://inv.tux.pizza', 'https://yewtu.be', 'https://invidious.materialio.us', 'https://invidious.lunar.icu'],
  COBALT_INSTANCES: ['https://api.cobalt.tools', 'https://cobalt-api.kwiatekmiki.com', 'https://capi.1337.cx', 'https://cobalt-api.marcsello.org', 'https://api.cobalt.best'],
  COBALT_API: 'https://api.cobalt.tools',
  COBALT_WEB: 'https://cobalt.tools',
  TURNSTILE_SCRIPT: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
  _serverInfo: null,
  _session: null,
  _captchaToken: null,
  _turnstileReady: false,
  _turnstileOk: false,
  _turnstileErr: null,
  JINA_PREFIX: 'https://r.jina.ai/',
  ITAG_MAP: {
    17: '144p',
    36: '240p',
    5: '240p',
    43: '360p',
    18: '360p',
    59: '480p',
    22: '720p',
    37: '1080p',
    38: '4K',
    133: '240p',
    134: '360p',
    135: '480p',
    136: '720p',
    137: '1080p',
    138: '4K',
    160: '144p',
    212: '480p',
    264: '1440p',
    266: '4K',
    139: 'Audio 48k',
    140: 'Audio 128k',
    141: 'Audio 256k',
    249: 'Audio 50k',
    250: 'Audio 70k',
    251: 'Audio 160k',
    599: 'Audio 48k',
    598: 'Audio 128k',
    597: 'Audio 256k'
  },
  extractYtId: function extractYtId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/|attribution_link\?.*u=|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  },
  esc: function esc(s) {
    try {
      var d = document.createElement('div');
      d.textContent = s == null ? '' : String(s);
      return d.innerHTML;
    } catch (e) {
      return String(s == null ? '' : s);
    }
  },
  isDirectUrl: function isDirectUrl(url) {
    return /\.(mp4|webm|mkv|avi|mov|m4a|mp3|ogg|wav|flac|opus)(\?|#|$)/i.test(url);
  },
  isHls: function isHls(url) {
    return /\.m3u8(\?|#|$)|application\/x-mpegurl|master\.m3u8/i.test(url || '');
  },
  fmtDur: function fmtDur(sec) {
    sec = sec || 0;
    var h = Math.floor(sec / 3600),
      m = Math.floor(sec % 3600 / 60),
      s = Math.floor(sec % 60);
    return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },
  fetchJson: function fetchJson(url) {
    var _arguments = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee() {
      var timeoutMs, opts, ctrl, t, resp, txt, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            timeoutMs = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : 8000;
            opts = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : {};
            ctrl = new AbortController();
            t = setTimeout(function () {
              return ctrl.abort();
            }, timeoutMs);
            _context.p = 1;
            _context.n = 2;
            return fetch(url, _objectSpread(_objectSpread({
              signal: ctrl.signal,
              headers: _objectSpread({
                'Accept': 'application/json'
              }, opts.headers || {})
            }, opts.method ? {
              method: opts.method
            } : {}), opts.body ? {
              body: opts.body
            } : {}));
          case 2:
            resp = _context.v;
            clearTimeout(t);
            if (resp.ok) {
              _context.n = 3;
              break;
            }
            throw new Error('HTTP ' + resp.status);
          case 3:
            _context.n = 4;
            return resp.text();
          case 4:
            txt = _context.v;
            _context.p = 5;
            return _context.a(2, JSON.parse(txt));
          case 6:
            _context.p = 6;
            _t = _context.v;
            throw new Error('bad json');
          case 7:
            _context.p = 7;
            _t2 = _context.v;
            clearTimeout(t);
            throw _t2;
          case 8:
            return _context.a(2);
        }
      }, _callee, null, [[5, 6], [1, 7]]);
    }))();
  },
  fetchJsonViaJina: function fetchJsonViaJina(url) {
    var _arguments2 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee2() {
      var timeoutMs, proxied, txt, start, _t3;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            timeoutMs = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : 10000;
            _context2.n = 1;
            return YTD.fetchJson(YTD.JINA_PREFIX + url, timeoutMs);
          case 1:
            proxied = _context2.v;
            if (!(proxied && _typeof(proxied) === 'object')) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, proxied);
          case 2:
            txt = String(proxied);
            start = Math.max(txt.indexOf('{'), txt.indexOf('['));
            if (!(start < 0)) {
              _context2.n = 3;
              break;
            }
            throw new Error('jina: no json');
          case 3:
            _context2.p = 3;
            return _context2.a(2, JSON.parse(txt.slice(start)));
          case 4:
            _context2.p = 4;
            _t3 = _context2.v;
            throw new Error('jina: bad json');
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[3, 4]]);
    }))();
  },
  fetchJsonViaProxies: function fetchJsonViaProxies(url) {
    var _arguments3 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee3() {
      var timeoutMs, qt, proxies, lastErr, _i, _proxies, p, data, _t4, _t5;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            timeoutMs = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : 10000;
            qt = encodeURIComponent(url);
            proxies = ['https://api.allorigins.win/raw?url=' + qt, 'https://api.allorigins.win/get?url=' + qt, 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url)];
            lastErr = null;
            _i = 0, _proxies = proxies;
          case 1:
            if (!(_i < _proxies.length)) {
              _context3.n = 9;
              break;
            }
            p = _proxies[_i];
            _context3.p = 2;
            _context3.n = 3;
            return YTD.fetchJson(p, timeoutMs);
          case 3:
            data = _context3.v;
            if (!(data && _typeof(data) === 'object' && typeof data.contents === 'string')) {
              _context3.n = 6;
              break;
            }
            _context3.p = 4;
            return _context3.a(2, JSON.parse(data.contents));
          case 5:
            _context3.p = 5;
            _t4 = _context3.v;
            return _context3.a(2, data);
          case 6:
            return _context3.a(2, data);
          case 7:
            _context3.p = 7;
            _t5 = _context3.v;
            lastErr = _t5;
          case 8:
            _i++;
            _context3.n = 1;
            break;
          case 9:
            throw lastErr || new Error('proxies failed');
          case 10:
            return _context3.a(2);
        }
      }, _callee3, null, [[4, 5], [2, 7]]);
    }))();
  },
  qVideo: function qVideo(label, sub, url, size, mime, key) {
    return {
      label: label,
      sub: sub,
      url: url,
      size: size > 0 ? size : null,
      mime: mime || 'video/mp4',
      key: key,
      kind: 'video',
      merge: false
    };
  },
  qAudio: function qAudio(label, sub, url, size, mime, key) {
    return {
      label: label,
      sub: sub,
      url: url,
      size: size > 0 ? size : null,
      mime: mime || 'audio/mp4',
      key: key,
      kind: 'audio',
      merge: false
    };
  },
  sortQualities: function sortQualities(quals) {
    var labelRank = function labelRank(l) {
      var m = l.match(/(\d{3,4})p|Audio (\d+)k/);
      if (!m) return 50;
      return m[2] ? +m[2] : +m[1] >= 2000 ? 10 : (2160 - +m[1]) / 100;
    };
    return _toConsumableArray(quals).sort(function (a, b) {
      return (a.kind === 'video' ? 0 : 1) - (b.kind === 'video' ? 0 : 1) || labelRank(a.label) - labelRank(b.label);
    });
  },
  mergeQualities: function mergeQualities() {
    var seen = new Set();
    var out = [];
    for (var _len = arguments.length, lists = new Array(_len), _key = 0; _key < _len; _key++) {
      lists[_key] = arguments[_key];
    }
    for (var _i2 = 0, _lists = lists; _i2 < _lists.length; _i2++) {
      var list = _lists[_i2];
      var _iterator = _createForOfIteratorHelper(list || []),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var q = _step.value;
          if (!q || !q.url) continue;
          if (seen.has(q.url)) continue;
          seen.add(q.url);
          out.push(q);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return out;
  },
  parseStandardPiped: function parseStandardPiped(data) {
    var quals = [];
    var seen = new Set();
    var streams = data.streams || [];
    var audio = (data.audioStreams || []).filter(function (a) {
      return a.url && !YTD.isHls(a.url);
    });
    var muxed = streams.filter(function (s) {
      return s.videoOnly === false && s.url && !YTD.isHls(s.url);
    }).sort(function (a, b) {
      return (b.height || 0) - (a.height || 0);
    });
    var _iterator2 = _createForOfIteratorHelper(muxed),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var s = _step2.value;
        if (seen.has(s.url)) continue;
        seen.add(s.url);
        var h = s.height || 0;
        quals.push(YTD.qVideo(h >= 1000 ? h + 'p' : h + 'p', h + 'p · video+audio · ' + (s.mimeType || 'mp4'), s.url, s.contentLength, s.mimeType || 'video/mp4', 'mux-' + h));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var vOnly = streams.filter(function (s) {
      return s.videoOnly === true && s.url && !YTD.isHls(s.url);
    }).sort(function (a, b) {
      return (b.height || 0) - (a.height || 0);
    });
    var seenH = new Set();
    var _iterator3 = _createForOfIteratorHelper(vOnly),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _s = _step3.value;
        if (seen.has(_s.url)) continue;
        var _h = _s.height || 0;
        if (seenH.has(_h) || _h < 360) continue;
        seenH.add(_h);
        seen.add(_s.url);
        quals.push(YTD.qVideo(_h >= 1000 ? _h + 'p' : _h + 'p', _h + 'p · video only' + (audio.length ? ' (silent)' : '') + ' · ' + (_s.mimeType || 'mp4'), _s.url, _s.contentLength, _s.mimeType || 'video/mp4', 'v-' + _h));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var aSorted = _toConsumableArray(audio).sort(function (a, b) {
      return (b.bitrate || 0) - (a.bitrate || 0);
    });
    var _iterator4 = _createForOfIteratorHelper(aSorted.slice(0, 4)),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var a = _step4.value;
        if (seen.has(a.url)) continue;
        seen.add(a.url);
        var kb = Math.round((a.bitrate || 0) / 1000);
        var ext = (a.mimeType || '').includes('webm') ? 'webm' : (a.mimeType || '').includes('m4a') ? 'm4a' : 'm4a';
        quals.push(YTD.qAudio('Audio ' + (kb || 128) + 'k', (kb || 128) + ' kbps · audio-only · ' + ext, a.url, a.contentLength, a.mimeType || 'audio/mp4', 'a-' + kb));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return quals;
  },
  parseLbryPiped: function parseLbryPiped(data) {
    var quals = [];
    var seen = new Set();
    var vs = data.videoStreams || [];
    var _iterator5 = _createForOfIteratorHelper(vs),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var s = _step5.value;
        if (!s.url || seen.has(s.url)) continue;
        var mime = s.mimeType || '';
        if (YTD.isHls(s.url) || mime.includes('mpegurl')) continue;
        seen.add(s.url);
        var itagMatch = s.url.match(/itag=(\d+)/);
        var itag = itagMatch ? +itagMatch[1] : null;
        var rawLabel = itag && YTD.ITAG_MAP[itag] && !YTD.ITAG_MAP[itag].startsWith('Audio') ? YTD.ITAG_MAP[itag] : s.quality || 'video';
        var label = /p$/.test(rawLabel) ? rawLabel : rawLabel + 'p';
        quals.push(YTD.qVideo(label, (YTD.ITAG_MAP[itag] || s.format || s.quality || 'direct') + ' · muxed mp4' + (itag === 18 ? ' · audio+video' : ''), s.url, s.contentLength, 'video/mp4', 'lbry-' + (itag || Math.random().toString(36).slice(2, 7))));
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    var audio = (data.audioStreams || []).filter(function (a) {
      return a.url && !YTD.isHls(a.url);
    });
    var aSorted = _toConsumableArray(audio).sort(function (a, b) {
      return (b.bitrate || 0) - (a.bitrate || 0);
    });
    var _iterator6 = _createForOfIteratorHelper(aSorted.slice(0, 4)),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var a = _step6.value;
        if (seen.has(a.url)) continue;
        seen.add(a.url);
        var kb = Math.round((a.bitrate || 0) / 1000);
        quals.push(YTD.qAudio('Audio ' + (kb || 128) + 'k', (kb || 128) + ' kbps · audio-only', a.url, a.contentLength, a.mimeType || 'audio/mp4', 'a-' + kb));
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return quals;
  },
  parseInvidious: function parseInvidious(data) {
    var quals = [];
    var seen = new Set();
    var formats = (data.adaptiveFormats || []).concat(data.formatStreams || []);
    var byItag = {};
    var _iterator7 = _createForOfIteratorHelper(formats),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var _f = _step7.value;
        if (!_f || !_f.url || seen.has(_f.url)) continue;
        var m = (_f.url || '').match(/itag=(\d+)/);
        var itag = m ? +m[1] : null;
        var _key2 = itag || Math.random().toString(36).slice(2, 8);
        if (byItag[_key2]) continue;
        byItag[_key2] = _f;
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    for (var _i3 = 0, _Object$keys = Object.keys(byItag); _i3 < _Object$keys.length; _i3++) {
      var key = _Object$keys[_i3];
      var f = byItag[key];
      var itagNum = +key;
      seen.add(f.url);
      var mime = f.mimeType || f.type || '';
      var isAudio = mime.includes('audio') || itagNum >= 139 && itagNum <= 141 || itagNum >= 249 && itagNum <= 251 || itagNum >= 597 && itagNum <= 599;
      var label = YTD.ITAG_MAP[itagNum] || f.qualityLabel || '';
      var size = f.contentLength || f.clen;
      if (isAudio) {
        quals.push(YTD.qAudio(label || 'Audio', (f.bitrate ? Math.round(f.bitrate / 1000) + ' kbps' : '') + ' · audio-only', f.url, size, mime.includes('webm') ? 'audio/webm' : 'audio/mp4', 'iv-a-' + key));
      } else {
        quals.push(YTD.qVideo(label || f.qualityLabel || 'video', (label || '') + ' · ' + (f.videoOnly ? 'video only' : 'video+audio') + ' · ' + (mime.includes('webm') ? 'webm' : 'mp4'), f.url, size, mime.includes('webm') ? 'video/webm' : 'video/mp4', 'iv-v-' + key));
      }
    }
    return quals;
  },
  probePiped: function probePiped(id, base) {
    return YTD.fetchJson(base + '/streams/' + id).then(function (data) {
      if (!data) throw new Error('empty');
      var quals = null;
      if (Array.isArray(data.streams) && data.streams.length) quals = YTD.parseStandardPiped(data);else if (Array.isArray(data.videoStreams) && data.videoStreams.length) quals = YTD.parseLbryPiped(data);
      if (!quals || !quals.length) throw new Error('no usable streams');
      return {
        backend: 'piped',
        instance: base,
        id: id,
        title: data.title || 'Untitled',
        channel: data.uploader || data.uploaderName || data.author || 'Unknown',
        duration: YTD.fmtDur(data.duration),
        durationSec: data.duration || 0,
        thumb: data.thumbnailUrl || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
        qualities: YTD.sortQualities(quals),
        raw: data
      };
    });
  },
  probeInvidious: function probeInvidious(id, base) {
    return YTD.fetchJson(base + '/api/v1/videos/' + id).then(function (data) {
      if (!data || !data.title) throw new Error('no data');
      var quals = YTD.parseInvidious(data);
      if (!quals.length) throw new Error('no formats');
      return {
        backend: 'invidious',
        instance: base,
        id: id,
        title: data.title,
        channel: data.author || 'Unknown',
        duration: YTD.fmtDur(data.lengthSeconds),
        durationSec: data.lengthSeconds || 0,
        thumb: data.videoThumbnails && data.videoThumbnails.length ? data.videoThumbnails[data.videoThumbnails.length - 1].url : 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
        qualities: YTD.sortQualities(quals),
        raw: data
      };
    });
  },
  probeCobalt: function probeCobalt(url, base) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var clean = base.replace(/\/$/, '');
    var payload = {
      url: url,
      downloadMode: 'auto',
      videoQuality: '1080'
    };
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
    return YTD.fetchJson(clean + '/', 9000, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: headers
    }).then(function (data) {
      if (data.status === 'error') throw new Error(data.error && data.error.code || 'cobalt error');
      if (!data.url) throw new Error('no url');
      return {
        backend: 'cobalt',
        instance: clean,
        id: YTD.extractYtId(url),
        title: (opts.knownTitle || data.filename || 'yt download').replace(/\.[^.]+$/, ''),
        channel: 'cobalt merge',
        duration: '-',
        durationSec: 0,
        thumb: 'https://i.ytimg.com/vi/' + (YTD.extractYtId(url) || '') + '/hqdefault.jpg',
        qualities: [YTD.qVideo('Best (merged)', '1080p max · via ' + clean, data.url, data.size || null, 'video/mp4', 'cobalt-best')],
        raw: data
      };
    });
  },
  probeCobaltAudio: function probeCobaltAudio(url, base) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var clean = base.replace(/\/$/, '');
    var payload = {
      url: url,
      downloadMode: 'audio',
      audioFormat: 'mp3',
      audioBitrate: '128'
    };
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (opts.cobaltKey) headers['Authorization'] = 'Bearer ' + opts.cobaltKey;
    return YTD.fetchJson(clean + '/', 9000, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: headers
    }).then(function (data) {
      if (data.status === 'error') throw new Error(data.error && data.error.code || 'cobalt error');
      if (!data.url) throw new Error('no url');
      return {
        backend: 'cobalt',
        instance: clean,
        url: data.url,
        size: data.size || null,
        raw: data
      };
    });
  },
  getCobaltServerInfo: function getCobaltServerInfo() {
    var _arguments4 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee4() {
      var force, data, _t6;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            force = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : false;
            if (!(!force && YTD._serverInfo)) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, YTD._serverInfo);
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return YTD.fetchJson(YTD.COBALT_API + '/', 12000);
          case 2:
            data = _context4.v;
            if (!(data && data.cobalt && data.cobalt.turnstileSitekey)) {
              _context4.n = 3;
              break;
            }
            YTD._serverInfo = data;
            return _context4.a(2, data);
          case 3:
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t6 = _context4.v;
          case 5:
            return _context4.a(2, YTD._serverInfo);
        }
      }, _callee4, null, [[1, 4]]);
    }))();
  },
  initTurnstile: function initTurnstile(_callback) {
    if (YTD._turnstileReady) {
      if (_callback) _callback(YTD._captchaToken);
      return;
    }
    var info = YTD._serverInfo;
    if (!info) return;
    var sitekey = info.cobalt.turnstileSitekey;
    if (!sitekey) return;
    var done = function done() {
      var el = document.getElementById('turnstile-widget');
      if (!el || !window.turnstile) return;
      window.turnstile.render(el, {
        sitekey: sitekey,
        size: 'invisible',
        'refresh-expired': 'auto',
        callback: function callback(token) {
          YTD._captchaToken = token;
          YTD._turnstileOk = true;
          try {
            var _s2 = window.localStorage || {};
          } catch (e) {}
          if (_callback) _callback(token);
        },
        'error-callback': function errorCallback(code) {
          YTD._turnstileErr = code;
          YTD._turnstileOk = false;
          if (_callback) _callback(null);
        },
        'expired-callback': function expiredCallback() {
          YTD._captchaToken = null;
          YTD._turnstileOk = false;
          try {
            window.turnstile.reset(el);
          } catch (e) {}
        }
      });
    };
    YTD._turnstileReady = true;
    if (window.turnstile) {
      done();
      return;
    }
    var s = document.createElement('script');
    s.src = YTD.TURNSTILE_SCRIPT;
    s.async = true;
    s.defer = true;
    s.onload = done;
    document.head.appendChild(s);
  },
  requestCobaltSession: function requestCobaltSession(token) {
    return _asyncToGenerator(_regenerator().m(function _callee5() {
      var ctrl, t, resp, txt, _t7, _t8;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            ctrl = new AbortController();
            t = setTimeout(function () {
              return ctrl.abort();
            }, 12000);
            _context5.p = 1;
            _context5.n = 2;
            return fetch(YTD.COBALT_API + '/session', {
              method: 'POST',
              redirect: 'manual',
              signal: ctrl.signal,
              headers: token ? {
                'cf-turnstile-response': token
              } : {}
            });
          case 2:
            resp = _context5.v;
            clearTimeout(t);
            _context5.n = 3;
            return resp.text();
          case 3:
            txt = _context5.v;
            _context5.p = 4;
            return _context5.a(2, JSON.parse(txt));
          case 5:
            _context5.p = 5;
            _t7 = _context5.v;
            throw new Error('session bad json');
          case 6:
            _context5.p = 6;
            _t8 = _context5.v;
            clearTimeout(t);
            throw _t8;
          case 7:
            return _context5.a(2);
        }
      }, _callee5, null, [[4, 5], [1, 6]]);
    }))();
  },
  getCobaltSession: function getCobaltSession(captchaToken) {
    return _asyncToGenerator(_regenerator().m(function _callee6() {
      var now, data, code;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            now = Date.now();
            if (!(YTD._session && YTD._session.expiresAt > now + 5000)) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2, YTD._session);
          case 1:
            _context6.n = 2;
            return YTD.requestCobaltSession(captchaToken);
          case 2:
            data = _context6.v;
            if (!(!data || data.status === 'error')) {
              _context6.n = 3;
              break;
            }
            code = data && data.error && data.error.code;
            throw new Error('cobalt session: ' + (code || 'failed'));
          case 3:
            if (data.token) {
              _context6.n = 4;
              break;
            }
            throw new Error('cobalt session: no token');
          case 4:
            YTD._session = {
              token: data.token,
              expiresAt: now + (data.exp || 600) * 1000
            };
            return _context6.a(2, YTD._session);
        }
      }, _callee6);
    }))();
  },
  probeCobaltV11: function probeCobaltV11(url) {
    var _arguments5 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee7() {
      var opts, payload, headers, session, data, err, ytId, filename, mime, quals;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            opts = _arguments5.length > 1 && _arguments5[1] !== undefined ? _arguments5[1] : {};
            payload = {
              url: url,
              downloadMode: opts.mode || 'auto',
              videoQuality: opts.videoQuality || '720',
              filenameStyle: 'basic',
              disableMetadata: false
            };
            if ((opts.mode || 'auto') === 'audio') {
              payload.audioFormat = opts.audioFormat || 'mp3';
              payload.audioBitrate = opts.audioBitrate || '128';
            }
            headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
            if (!opts.customKey) {
              _context7.n = 1;
              break;
            }
            headers['Authorization'] = 'Api-Key ' + opts.customKey;
            _context7.n = 3;
            break;
          case 1:
            _context7.n = 2;
            return YTD.getCobaltSession(opts.captchaToken);
          case 2:
            session = _context7.v;
            headers['Authorization'] = 'Bearer ' + session.token;
          case 3:
            _context7.n = 4;
            return YTD.fetchJson(YTD.COBALT_API + '/', 15000, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: headers
            });
          case 4:
            data = _context7.v;
            if (!(data.status === 'error')) {
              _context7.n = 5;
              break;
            }
            throw new Error(data.error && data.error.code || 'cobalt error');
          case 5:
            if (!(data.status === 'tunnel')) {
              _context7.n = 6;
              break;
            }
            err = new Error('tunnel');
            err.tunnel = data;
            throw err;
          case 6:
            if (data.url) {
              _context7.n = 7;
              break;
            }
            throw new Error('cobalt: no url');
          case 7:
            ytId = YTD.extractYtId(url);
            filename = (data.filename || 'yt download').replace(/\.[^.]+$/, '');
            mime = data.mimeType || 'video/mp4';
            quals = [YTD.qVideo(data.quality || 'Best', 'via cobalt · ' + (data.quality || 'best') + (mime.includes('audio') ? '' : ' ' + mime), data.url, data.size || null, mime, 'cobalt-v11')];
            if (data.audio && data.audio.url) {
              quals.push(YTD.qAudio('Audio only (mp3)', 'audio stream · ' + (data.audio.size ? Math.round(data.audio.size / 1024 / 1024 * 10) / 10 + ' MB' : ''), data.audio.url, data.audio.size || null, 'audio/mpeg', 'cobalt-audio'));
            }
            return _context7.a(2, {
              backend: 'cobalt',
              instance: YTD.COBALT_API,
              id: ytId,
              title: filename,
              channel: 'cobalt',
              duration: '-',
              durationSec: 0,
              thumb: 'https://i.ytimg.com/vi/' + (ytId || '') + '/hqdefault.jpg',
              qualities: YTD.sortQualities(quals),
              raw: data
            });
        }
      }, _callee7);
    }))();
  },
  openCobaltWeb: function openCobaltWeb(url) {
    var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
    var target = YTD.COBALT_WEB + '/?u=' + encodeURIComponent(url);
    var w = window.open(target, '_blank');
    if (!w) {
      window.location.href = target;
    }
    return true;
  },
  firstOf: function firstOf(promises) {
    return new Promise(function (resolve, reject) {
      var pending = promises.length;
      var errors = [];
      if (!pending) {
        reject(new Error('no probes'));
        return;
      }
      promises.forEach(function (p, i) {
        Promise.resolve(p).then(function (v) {
          return resolve(v);
        }, function (e) {
          errors[i] = e && e.message || String(e);
          if (--pending === 0) reject(new Error(errors.filter(Boolean).join(' | ')));
        });
      });
    });
  },
  resolve: function resolve(url) {
    var _arguments6 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee9() {
      var opts, m, isAudioFile, ytId, _errors, proxied, errors, trySelfHostOnce, selfHostAttempts, selfHostIntervalMs, attempt, sh, fresh, probes, cobaltAuth, _iterator8, _step8, _loop, _iterator9, _step9, _loop2, _iterator0, _step0, _loop3, best, audioProbes, _iterator1, _step1, base, _iterator10, _step10, _base, audioLists, audios, merged, allErr, _t9, _t0, _t1, _t10, _t11, _t12, _t13, _t14;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            opts = _arguments6.length > 1 && _arguments6[1] !== undefined ? _arguments6[1] : {};
            if (!YTD.isDirectUrl(url)) {
              _context10.n = 1;
              break;
            }
            m = url.split('/').pop().split('?')[0];
            isAudioFile = /\.(mp3|m4a|ogg|wav|flac|opus)(\?|#|$)/i.test(url);
            return _context10.a(2, {
              backend: 'direct',
              id: null,
              title: m || 'direct download',
              channel: 'direct url',
              duration: '-',
              durationSec: 0,
              thumb: null,
              qualities: [isAudioFile ? YTD.qAudio('Audio file', 'original file', url, null, 'audio/mpeg', 'direct') : YTD.qVideo('Direct file', 'original file', url, null, 'video/mp4', 'direct')],
              raw: null
            });
          case 1:
            ytId = YTD.extractYtId(url);
            if (ytId) {
              _context10.n = 8;
              break;
            }
            _errors = [];
            _context10.p = 2;
            _context10.n = 3;
            return YTD.resolveCobaltSeq(url, opts);
          case 3:
            return _context10.a(2, _context10.v);
          case 4:
            _context10.p = 4;
            _t9 = _context10.v;
            _errors.push('cobalt: ' + _t9.message);
            _context10.p = 5;
            _context10.n = 6;
            return YTD.fetchJsonViaProxies(url);
          case 6:
            proxied = _context10.v;
            return _context10.a(2, {
              backend: 'proxy',
              id: null,
              title: url.split('/').pop() || 'download',
              channel: 'proxy',
              duration: '-',
              durationSec: 0,
              thumb: null,
              qualities: [YTD.qVideo('Direct file (proxy)', 'via cors proxy', url, null, 'application/octet-stream', 'proxy')],
              raw: null
            });
          case 7:
            _context10.p = 7;
            _t0 = _context10.v;
            _errors.push('proxy: ' + _t0.message);
            throw new Error('no backend could resolve this url — ' + _errors.join(' | '));
          case 8:
            errors = [];
            trySelfHostOnce = function () {
              var _trySelfHostOnce = _asyncToGenerator(_regenerator().m(function _callee8() {
                var sh;
                return _regenerator().w(function (_context8) {
                  while (1) switch (_context8.n) {
                    case 0:
                      _context8.n = 1;
                      return YTD.probeSelfHost(url);
                    case 1:
                      sh = _context8.v;
                      return _context8.a(2, sh && sh.qualities && sh.qualities.length ? sh : null);
                  }
                }, _callee8);
              }));
              function trySelfHostOnce() {
                return _trySelfHostOnce.apply(this, arguments);
              }
              return trySelfHostOnce;
            }();
            selfHostAttempts = 3;
            selfHostIntervalMs = 3000;
            if (!YTD.getSelfHostUrl()) {
              _context10.n = 19;
              break;
            }
            attempt = 0;
          case 9:
            if (!(attempt < selfHostAttempts)) {
              _context10.n = 19;
              break;
            }
            _context10.p = 10;
            _context10.n = 11;
            return trySelfHostOnce();
          case 11:
            sh = _context10.v;
            if (!sh) {
              _context10.n = 12;
              break;
            }
            return _context10.a(2, sh);
          case 12:
            _context10.n = 17;
            break;
          case 13:
            _context10.p = 13;
            _t1 = _context10.v;
            if (attempt === 0) errors.push('selfhost: ' + _t1.message);
            _context10.p = 14;
            _context10.n = 15;
            return YTD.fetchServerTxtUrl();
          case 15:
            fresh = _context10.v;
            if (fresh && fresh !== YTD.getSelfHostUrl()) {
              YTD.setSelfHostUrl(fresh);
            }
            _context10.n = 17;
            break;
          case 16:
            _context10.p = 16;
            _t10 = _context10.v;
          case 17:
            if (!(attempt < selfHostAttempts - 1)) {
              _context10.n = 18;
              break;
            }
            _context10.n = 18;
            return new Promise(function (r) {
              return setTimeout(r, selfHostIntervalMs);
            });
          case 18:
            attempt++;
            _context10.n = 9;
            break;
          case 19:
            probes = [];
            cobaltAuth = opts.cobaltKey && String(opts.cobaltKey).trim() ? {
              customKey: String(opts.cobaltKey).trim()
            } : YTD._captchaToken ? {
              captchaToken: YTD._captchaToken
            } : null;
            if (cobaltAuth) {
              probes.push(YTD.probeCobaltV11(url, _objectSpread(_objectSpread({}, cobaltAuth), {}, {
                knownTitle: 'yt download'
              })).catch(function (e) {
                throw new Error('cobalt: ' + e.message);
              }));
            } else {
              probes.push(new Promise(function (_, rej) {
                return setTimeout(function () {
                  return rej(new Error('cobalt: auth needed (no key, no captcha yet)'));
                }, 50);
              }));
            }
            _iterator8 = _createForOfIteratorHelper(YTD.PIPED_INSTANCES);
            _context10.p = 20;
            _loop = _regenerator().m(function _loop() {
              var base;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    base = _step8.value;
                    probes.push(YTD.probePiped(ytId, base).catch(function (e) {
                      throw new Error('piped/' + base.replace(/^https?:\/\//, '') + ': ' + e.message);
                    }));
                  case 1:
                    return _context9.a(2);
                }
              }, _loop);
            });
            _iterator8.s();
          case 21:
            if ((_step8 = _iterator8.n()).done) {
              _context10.n = 23;
              break;
            }
            return _context10.d(_regeneratorValues(_loop()), 22);
          case 22:
            _context10.n = 21;
            break;
          case 23:
            _context10.n = 25;
            break;
          case 24:
            _context10.p = 24;
            _t11 = _context10.v;
            _iterator8.e(_t11);
          case 25:
            _context10.p = 25;
            _iterator8.f();
            return _context10.f(25);
          case 26:
            _iterator9 = _createForOfIteratorHelper(YTD.INVIDIOUS_INSTANCES);
            _context10.p = 27;
            _loop2 = _regenerator().m(function _loop2() {
              var base;
              return _regenerator().w(function (_context0) {
                while (1) switch (_context0.n) {
                  case 0:
                    base = _step9.value;
                    probes.push(YTD.probeInvidious(ytId, base).catch(function (e) {
                      throw new Error('inv/' + base.replace(/^https?:\/\//, '') + ': ' + e.message);
                    }));
                  case 1:
                    return _context0.a(2);
                }
              }, _loop2);
            });
            _iterator9.s();
          case 28:
            if ((_step9 = _iterator9.n()).done) {
              _context10.n = 30;
              break;
            }
            return _context10.d(_regeneratorValues(_loop2()), 29);
          case 29:
            _context10.n = 28;
            break;
          case 30:
            _context10.n = 32;
            break;
          case 31:
            _context10.p = 31;
            _t12 = _context10.v;
            _iterator9.e(_t12);
          case 32:
            _context10.p = 32;
            _iterator9.f();
            return _context10.f(32);
          case 33:
            probes.push(YTD.fetchJsonViaJina('https://api.piped.private.coffee/streams/' + ytId).then(function (data) {
              var quals = null;
              if (Array.isArray(data.videoStreams) && data.videoStreams.length) quals = YTD.parseLbryPiped(data);else if (Array.isArray(data.streams) && data.streams.length) quals = YTD.parseStandardPiped(data);
              if (!quals || !quals.length) throw new Error('no streams');
              return {
                backend: 'piped-jina',
                instance: 'jina-proxy',
                id: ytId,
                title: data.title || 'Untitled',
                channel: data.uploader || data.uploaderName || data.author || 'Unknown',
                duration: YTD.fmtDur(data.duration),
                durationSec: data.duration || 0,
                thumb: data.thumbnailUrl || 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg',
                qualities: YTD.sortQualities(quals),
                raw: data
              };
            }).catch(function (e) {
              throw new Error('jina/proxy: ' + e.message);
            }));
            _iterator0 = _createForOfIteratorHelper(YTD.COBALT_INSTANCES);
            _context10.p = 34;
            _loop3 = _regenerator().m(function _loop3() {
              var base;
              return _regenerator().w(function (_context1) {
                while (1) switch (_context1.n) {
                  case 0:
                    base = _step0.value;
                    probes.push(YTD.probeCobalt(url, base, opts).catch(function (e) {
                      throw new Error('cobalt/' + base.replace(/^https?:\/\//, '') + ': ' + e.message);
                    }));
                  case 1:
                    return _context1.a(2);
                }
              }, _loop3);
            });
            _iterator0.s();
          case 35:
            if ((_step0 = _iterator0.n()).done) {
              _context10.n = 37;
              break;
            }
            return _context10.d(_regeneratorValues(_loop3()), 36);
          case 36:
            _context10.n = 35;
            break;
          case 37:
            _context10.n = 39;
            break;
          case 38:
            _context10.p = 38;
            _t13 = _context10.v;
            _iterator0.e(_t13);
          case 39:
            _context10.p = 39;
            _iterator0.f();
            return _context10.f(39);
          case 40:
            _context10.p = 40;
            _context10.n = 41;
            return YTD.firstOf(probes);
          case 41:
            best = _context10.v;
            if (!(!best || !best.qualities || !best.qualities.length)) {
              _context10.n = 42;
              break;
            }
            throw new Error('empty result');
          case 42:
            audioProbes = [];
            _iterator1 = _createForOfIteratorHelper(YTD.INVIDIOUS_INSTANCES);
            try {
              for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
                base = _step1.value;
                audioProbes.push(YTD.probeInvidious(ytId, base).then(function (r) {
                  return (r.qualities || []).filter(function (q) {
                    return q.kind === 'audio';
                  });
                }).catch(function () {
                  return [];
                }));
              }
            } catch (err) {
              _iterator1.e(err);
            } finally {
              _iterator1.f();
            }
            if (cobaltAuth) {
              audioProbes.push(YTD.probeCobaltV11(url, _objectSpread(_objectSpread({}, cobaltAuth), {}, {
                mode: 'audio',
                knownTitle: 'audio'
              })).then(function (r) {
                return r.qualities || [];
              }).catch(function () {
                return [];
              }));
            }
            _iterator10 = _createForOfIteratorHelper(YTD.COBALT_INSTANCES);
            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                _base = _step10.value;
                audioProbes.push(YTD.probeCobaltAudio(url, _base, opts).then(function (a) {
                  return [YTD.qAudio('Audio only (mp3)', '128 kbps · ' + a.instance, a.url, a.size, 'audio/mpeg', 'cobalt-audio')];
                }).catch(function () {
                  return [];
                }));
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }
            _context10.n = 43;
            return Promise.all(audioProbes);
          case 43:
            audioLists = _context10.v;
            audios = audioLists.flat().filter(Boolean);
            if (audios.length) {
              merged = YTD.mergeQualities(best.qualities, audios);
              best.qualities = YTD.sortQualities(merged);
              best.audioAlso = true;
            }
            return _context10.a(2, best);
          case 44:
            _context10.p = 44;
            _t14 = _context10.v;
            errors.push('backends: ' + _t14.message);
            allErr = new Error('all backends failed — ' + errors.join(' | '));
            if (errors.some(function (s) {
              return s.includes('tunnel') || s.includes('auth needed');
            })) {
              allErr.cobaltFallback = true;
            }
            throw allErr;
          case 45:
            return _context10.a(2);
        }
      }, _callee9, null, [[40, 44], [34, 38, 39, 40], [27, 31, 32, 33], [20, 24, 25, 26], [14, 16], [10, 13], [5, 7], [2, 4]]);
    }))();
  },
  resolveCobaltSeq: function resolveCobaltSeq(url) {
    var _arguments7 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee0() {
      var opts, lastErr, _iterator11, _step11, base, _t15, _t16;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            opts = _arguments7.length > 1 && _arguments7[1] !== undefined ? _arguments7[1] : {};
            lastErr = null;
            _iterator11 = _createForOfIteratorHelper(YTD.COBALT_INSTANCES);
            _context11.p = 1;
            _iterator11.s();
          case 2:
            if ((_step11 = _iterator11.n()).done) {
              _context11.n = 7;
              break;
            }
            base = _step11.value;
            _context11.p = 3;
            _context11.n = 4;
            return YTD.probeCobalt(url, base, opts);
          case 4:
            return _context11.a(2, _context11.v);
          case 5:
            _context11.p = 5;
            _t15 = _context11.v;
            lastErr = _t15;
          case 6:
            _context11.n = 2;
            break;
          case 7:
            _context11.n = 9;
            break;
          case 8:
            _context11.p = 8;
            _t16 = _context11.v;
            _iterator11.e(_t16);
          case 9:
            _context11.p = 9;
            _iterator11.f();
            return _context11.f(9);
          case 10:
            throw lastErr || new Error('all cobalt instances failed');
          case 11:
            return _context11.a(2);
        }
      }, _callee0, null, [[3, 5], [1, 8, 9, 10]]);
    }))();
  },
  downloadStream: function downloadStream(url, filename) {
    var ctrl = new AbortController();
    var task = {
      ctrl: ctrl,
      done: false,
      error: null,
      aborted: false,
      usedFallback: false
    };
    _asyncToGenerator(_regenerator().m(function _callee1() {
      var resp, total, reader, chunks, received, _yield$reader$read, done, value, type, blob, objUrl, a, w, _t17, _t18;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.p = _context12.n) {
          case 0:
            _context12.p = 0;
            _context12.n = 1;
            return fetch(url, {
              signal: ctrl.signal,
              headers: {
                'Accept': '*/*'
              }
            });
          case 1:
            resp = _context12.v;
            if (resp.ok) {
              _context12.n = 2;
              break;
            }
            throw new Error('HTTP ' + resp.status);
          case 2:
            total = +(resp.headers.get('Content-Length') || 0);
            reader = resp.body.getReader();
            chunks = [];
            received = 0;
          case 3:
            if (!true) {
              _context12.n = 6;
              break;
            }
            _context12.n = 4;
            return reader.read();
          case 4:
            _yield$reader$read = _context12.v;
            done = _yield$reader$read.done;
            value = _yield$reader$read.value;
            if (!done) {
              _context12.n = 5;
              break;
            }
            return _context12.a(3, 6);
          case 5:
            chunks.push(value);
            received += value.length;
            if (task.onProgress) task.onProgress(received, total);
            _context12.n = 3;
            break;
          case 6:
            type = resp.headers.get('Content-Type') || 'video/mp4';
            blob = new Blob(chunks, {
              type: type
            });
            objUrl = URL.createObjectURL(blob);
            a = document.createElement('a');
            a.href = objUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () {
              return URL.revokeObjectURL(objUrl);
            }, 120000);
            task.done = true;
            task.blobUrl = objUrl;
            _context12.n = 12;
            break;
          case 7:
            _context12.p = 7;
            _t17 = _context12.v;
            if (!(_t17.name === 'AbortError')) {
              _context12.n = 8;
              break;
            }
            task.aborted = true;
            return _context12.a(2);
          case 8:
            _context12.p = 8;
            w = window.open(url, '_blank');
            if (!w) {
              _context12.n = 9;
              break;
            }
            task.usedFallback = true;
            task.done = true;
            task.fallbackMsg = 'opened in new tab — save from there (direct save blocked)';
            return _context12.a(2);
          case 9:
            _context12.n = 11;
            break;
          case 10:
            _context12.p = 10;
            _t18 = _context12.v;
          case 11:
            task.error = _t17;
          case 12:
            return _context12.a(2);
        }
      }, _callee1, null, [[8, 10], [0, 7]]);
    }))();
    return task;
  },
  cancelTask: function cancelTask(task) {
    if (task && task.ctrl) {
      task.ctrl.abort();
      task.aborted = true;
    }
  },
  hasCobaltKey: function hasCobaltKey() {
    try {
      var k = (window.localStorage.getItem('ytd_cobalt_key') || '').trim();
      return k.length > 0;
    } catch (e) {
      return false;
    }
  },
  getCobaltKey: function getCobaltKey() {
    try {
      return (window.localStorage.getItem('ytd_cobalt_key') || '').trim();
    } catch (e) {
      return '';
    }
  },
  setCobaltKey: function setCobaltKey(k) {
    try {
      window.localStorage.setItem('ytd_cobalt_key', (k || '').trim());
    } catch (e) {}
  },
  getSelfHostUrl: function getSelfHostUrl() {
    try {
      var u = (window.localStorage.getItem('ytd_selfhost_url') || '').trim();
      return u ? u.replace(/\/+$/, '') : '';
    } catch (e) {
      return '';
    }
  },
  setSelfHostUrl: function setSelfHostUrl(u) {
    try {
      window.localStorage.setItem('ytd_selfhost_url', (u || '').trim());
    } catch (e) {}
  },
  fetchServerTxtUrl: function fetchServerTxtUrl() {
    return _asyncToGenerator(_regenerator().m(function _callee10() {
      var _ctrl, t, r, u, _t19;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            _context13.p = 0;
            _ctrl = new AbortController();
            t = setTimeout(function () {
              return _ctrl.abort();
            }, 8000);
            _context13.n = 1;
            return fetch('./server.txt?ts=' + Date.now(), {
              cache: 'no-store',
              signal: _ctrl.signal
            });
          case 1:
            r = _context13.v;
            clearTimeout(t);
            if (r.ok) {
              _context13.n = 2;
              break;
            }
            return _context13.a(2, '');
          case 2:
            _context13.n = 3;
            return r.text();
          case 3:
            u = _context13.v.trim().replace(/\/+$/, '');
            return _context13.a(2, /^https:\/\/.+\.trycloudflare\.com$/.test(u) ? u : '');
          case 4:
            _context13.p = 4;
            _t19 = _context13.v;
            return _context13.a(2, '');
        }
      }, _callee10, null, [[0, 4]]);
    }))();
  },
  probeSelfHost: function probeSelfHost(url) {
    return _asyncToGenerator(_regenerator().m(function _callee11() {
      var base, info, quals, id;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            base = YTD.getSelfHostUrl();
            if (base) {
              _context14.n = 1;
              break;
            }
            throw new Error('selfhost: not configured');
          case 1:
            _context14.n = 2;
            return YTD.fetchJson(base + '/api/v1/health', 8000).then(function (h) {
              if (!h || h.status !== 'ok') throw new Error('selfhost: server down');
              return YTD.fetchJson(base + '/api/v1/info?url=' + encodeURIComponent(url), 25000);
            });
          case 2:
            info = _context14.v;
            if (!(!info || info.status === 'error')) {
              _context14.n = 3;
              break;
            }
            throw new Error('selfhost: ' + (info && info.error && info.error.code || 'bad response'));
          case 3:
            quals = (info.qualities || []).map(function (q, i) {
              return {
                label: q.label || 'quality',
                sub: q.sub || '',
                kind: q.kind === 'audio' ? 'audio' : 'video',
                ext: q.ext || (q.kind === 'audio' ? 'm4a' : 'mp4'),
                mime: q.mime || (q.kind === 'audio' ? 'audio/mp4' : 'video/mp4'),
                size: typeof q.size === 'number' ? Math.round(q.size * 1048576) : null,
                f: q.f || null,
                selfhost: true,
                key: 'sh-' + i
              };
            }).filter(function (q) {
              return q.f;
            });
            if (quals.length) {
              _context14.n = 4;
              break;
            }
            throw new Error('selfhost: no qualities');
          case 4:
            id = info.id || YTD.extractYtId(url) || '';
            return _context14.a(2, {
              backend: 'selfhost',
              instance: base,
              id: id,
              title: info.title || 'youtube video',
              channel: info.channel || 'unknown',
              duration: info.duration || '-',
              durationSec: 0,
              thumb: info.thumb || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
              qualities: YTD.sortQualities(quals),
              raw: info
            });
        }
      }, _callee11);
    }))();
  },
  selfHostStart: function selfHostStart(url, q, filename) {
    return _asyncToGenerator(_regenerator().m(function _callee12() {
      var base, fn, startUrl, data;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            base = YTD.getSelfHostUrl();
            if (base) {
              _context15.n = 1;
              break;
            }
            throw new Error('selfhost: not configured');
          case 1:
            fn = String(filename || 'video').replace(/\.[^.]+$/, '');
            startUrl = base + '/api/v1/start?u=' + encodeURIComponent(url) + '&f=' + encodeURIComponent(q.f || 'best') + '&ext=' + encodeURIComponent(q.ext || 'mp4') + '&fn=' + encodeURIComponent(fn);
            _context15.n = 2;
            return YTD.fetchJson(startUrl, 20000);
          case 2:
            data = _context15.v;
            if (!(!data || !data.task_id)) {
              _context15.n = 3;
              break;
            }
            throw new Error('server: ' + (data && data.error && data.error.code || 'no task'));
          case 3:
            return _context15.a(2, data.task_id);
        }
      }, _callee12);
    }))();
  },
  selfHostPoll: function selfHostPoll(taskId, onUpdate) {
    var _arguments8 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee13() {
      var maxWaitMs, base, deadline, p, _t20;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.p = _context16.n) {
          case 0:
            maxWaitMs = _arguments8.length > 2 && _arguments8[2] !== undefined ? _arguments8[2] : 600000;
            base = YTD.getSelfHostUrl();
            deadline = Date.now() + maxWaitMs;
          case 1:
            if (!(Date.now() < deadline)) {
              _context16.n = 9;
              break;
            }
            _context16.n = 2;
            return new Promise(function (r) {
              return setTimeout(r, 1250);
            });
          case 2:
            p = null;
            _context16.p = 3;
            _context16.n = 4;
            return YTD.fetchJson(base + '/api/v1/progress/' + taskId, 12000);
          case 4:
            p = _context16.v;
            _context16.n = 6;
            break;
          case 5:
            _context16.p = 5;
            _t20 = _context16.v;
            return _context16.a(3, 1);
          case 6:
            if (onUpdate) onUpdate(p || {});
            if (!(p && p.status === 'done' && p.file)) {
              _context16.n = 7;
              break;
            }
            return _context16.a(2, base + p.file);
          case 7:
            if (!(p && p.status === 'error')) {
              _context16.n = 8;
              break;
            }
            throw new Error('server: ' + (p.error || 'failed'));
          case 8:
            _context16.n = 1;
            break;
          case 9:
            throw new Error('server took too long — task may have timed out, try again');
          case 10:
            return _context16.a(2);
        }
      }, _callee13, null, [[3, 5]]);
    }))();
  },
  hasCobaltAuth: function hasCobaltAuth() {
    return YTD.hasCobaltKey() || !!YTD._captchaToken;
  },
  cobaltAuthStatus: function cobaltAuthStatus() {
    if (YTD.hasCobaltKey()) return 'ok (custom Api-Key)';
    if (YTD._captchaToken) return 'ok (Turnstile session)';
    if (YTD._turnstileErr && String(YTD._turnstileErr).startsWith('103')) {
      return 'turnstile blocked on this domain — use cobalt.tools fallback or Api-Key';
    }
    if (YTD._turnstileReady) return 'waiting for Turnstile…';
    return 'no auth — use cobalt.tools fallback or add Api-Key';
  },
  checkServerHealth: function checkServerHealth(base) {
    if (!base) return Promise.resolve(false);
    return YTD.fetchJson(base + '/api/v1/health', 8000).then(function (h) {
      return !!(h && h.status === 'ok');
    }).catch(function () { return false; });
  },
  // ── SELF-HOST SERVER MONITOR (automation) ──────────────
  // bawat N segundo: i-ping ang server health.
  //   buhay  → manatili sa kasalukuyang URL (status 'alive')
  //   patay  → auto-fetch ng fresh server.txt → kung bago ang URL,
  //            i-update ang localStorage at subukan ang bago (status 'reconnected')
  //   wala pa ring bago → patuloy na mag-poll (status 'dead') hanggang
  //            mag-start ulit si @dvc ng server → awtomatikong maka-recover.
  serverMonitor: {
    _timer: null,
    _interval: 15000,
    _status: 'off',
    _cbs: [],
    _checking: false,
    onStatus: function (cb) {
      if (typeof cb === 'function') this._cbs.push(cb);
    },
    _emit: function (status, detail) {
      this._status = status;
      for (var i = 0; i < this._cbs.length; i++) {
        try { this._cbs[i](status, detail); } catch (e) {}
      }
    },
    start: function () {
      if (this._timer) return;
      this._timer = setInterval((function () { this._tick(); }).bind(this), this._interval);
      this._tick();
    },
    stop: function () {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    },
    isAlive: function () {
      return this._status === 'alive' || this._status === 'reconnected';
    },
    _tick: function () {
      var self = this;
      if (self._checking) return;
      var base = YTD.getSelfHostUrl();
      if (!base) { self._emit('off'); return; }
      self._checking = true;
      self._emit('checking');
      YTD.checkServerHealth(base).then(function (ok) {
        if (ok) { self._checking = false; self._emit('alive', { url: base }); return; }
        // patay ang kasalukuyang URL → kumuha ng fresh server.txt
        return YTD.fetchServerTxtUrl().then(function (fresh) {
          if (fresh && fresh !== base) {
            YTD.setSelfHostUrl(fresh);
            return YTD.checkServerHealth(fresh).then(function (ok2) {
              self._checking = false;
              if (ok2) self._emit('reconnected', { url: fresh, old: base });
              else self._emit('dead', { url: fresh });
            });
          }
          self._checking = false;
          self._emit('dead', { url: base });
        }).catch(function () {
          self._checking = false;
          self._emit('dead', { url: base });
        });
      }).catch(function () {
        self._checking = false;
        self._emit('dead', { url: base });
      });
    }
  }
};