/* ytdownloader — polyfills.js (ES5-only syntax, gumagana sa Chrome 37 / Android 5.x WebView)
   Covers: fetch + AbortController, URLSearchParams, Set, Array.from,
   String/Array includes-startsWith-padStart-flat, Object.getOwnPropertyDescriptors/Symbols
   Lahat ng code dito ay inaasahang pure ES5 — walang arrow/let/const/template.
   Sourced para sa compatibility ng lumang WebView (2026-09-14, v2.7 Android compat). */
(function () {
  'use strict';

  /* ============ Promise minimal polyfill (Chrome 32+ / Android 4.4+ wala) ============ */
  if (typeof Promise === 'undefined') {
    var PromisePolyfill = (function () {
      var PENDING = 0, FULFILLED = 1, REJECTED = 2;

      function Promise(fn) {
        if (!(this instanceof Promise)) { throw new TypeError('Promises must be constructed via new'); }
        if (typeof fn !== 'function') { throw new TypeError('not a function'); }
        this._state = PENDING;
        this._value = undefined;
        this._deferreds = [];
        var self = this;
        try {
          fn(function (v) { resolve(self, v); }, function (r) { reject(self, r); });
        } catch (e) {
          reject(self, e);
        }
      }

      function handle(self, deferred) {
        if (self._state === PENDING) {
          self._deferreds.push(deferred);
          return;
        }
        var cb = self._state === FULFILLED ? deferred.onFulfilled : deferred.onRejected;
        if (cb === undefined || cb === null) {
          if (self._state === FULFILLED) { deferred.resolve(self._value); }
          else { deferred.reject(self._value); }
          return;
        }
        setTimeout(function () {
          try {
            var ret = cb(self._value);
            deferred.resolve(ret);
          } catch (e) {
            deferred.reject(e);
          }
        }, 0);
      }

      function resolve(self, value) {
        if (value === self) {
          reject(self, new TypeError('A promise cannot be resolved with itself.'));
          return;
        }
        var then = value && (typeof value === 'object' || typeof value === 'function') ? value.then : undefined;
        if (then === undefined || then === null) {
          fulfill(self, value);
          return;
        }
        if (typeof then !== 'function') {
          fulfill(self, value);
          return;
        }
        var called = false;
        try {
          then.call(value, function (v) { if (!called) { called = true; resolve(self, v); } },
                            function (r) { if (!called) { called = true; reject(self, r); } });
          return;
        } catch (e) {
          if (!called) { called = true; reject(self, e); }
        }
      }

      function fulfill(self, value) {
        if (self._state !== PENDING) { return; }
        self._state = FULFILLED;
        self._value = value;
        finale(self);
      }

      function reject(self, reason) {
        if (self._state !== PENDING) { return; }
        self._state = REJECTED;
        self._value = reason;
        finale(self);
      }

      function finale(self) {
        var i = 0, len = self._deferreds.length;
        for (; i < len; i++) { handle(self, self._deferreds[i]); }
        self._deferreds = null;
      }

      Promise.prototype.then = function (onFulfilled, onRejected) {
        var self = this;
        return new Promise(function (resolve, reject) {
          handle(self, {
            onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : undefined,
            onRejected: typeof onRejected === 'function' ? onRejected : undefined,
            resolve: resolve,
            reject: reject
          });
        });
      };

      Promise.prototype['catch'] = function (onRejected) {
        return this.then(undefined, onRejected);
      };

      Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) { return value; }
        return new Promise(function (resolve) { resolve(value); });
      };

      Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) { reject(reason); });
      };

      Promise.all = function (arr) {
        return new Promise(function (resolve, reject) {
          if (!arr || typeof arr.length === 'undefined') { reject(new TypeError('Promise.all expects an array')); return; }
          var results = [], remaining = arr.length, done = false, i;
          if (arr.length === 0) { resolve(results); return; }
          function checkDone() {
            if (remaining === 0 && !done) { done = true; resolve(results); }
          }
          for (i = 0; i < arr.length; i++) {
            (function (idx) {
              Promise.resolve(arr[idx]).then(function (v) {
                results[idx] = v;
                remaining--;
                checkDone();
              }, function (e) {
                if (!done) { done = true; reject(e); }
              });
            })(i);
          }
        });
      };

      Promise.race = function (arr) {
        return new Promise(function (resolve, reject) {
          var done = false, i;
          for (i = 0; i < arr.length; i++) {
            (function (p) {
              Promise.resolve(p).then(function (v) { if (!done) { done = true; resolve(v); } },
                                        function (e) { if (!done) { done = true; reject(e); } });
            })(arr[i]);
          }
        });
      };

      return Promise;
    })();
    window.Promise = PromisePolyfill;
  }

  /* ============ Symbol minimal shim (Chrome 38+) — para sa Babel helpers ============ */
  if (typeof Symbol === 'undefined') {
    var SymbolShim = (function () {
      var counter = 0;
      function Sym(desc) {
        this.__desc = desc || '';
        this.__id = 'Symbol(' + this.__desc + ')_' + (++counter);
      }
      Sym.prototype.toString = function () { return this.__id; };
      Sym.prototype.valueOf = function () { return this; };
      var S = function (desc) { return new Sym(desc); };
      S.iterator = S('iterator');
      S.toPrimitive = S('toPrimitive');
      S.toStringTag = S('toStringTag');
      S.for = function (key) { return S(key); };
      S.keyFor = function () { return undefined; };
      return S;
    })();
    window.Symbol = SymbolShim;
    Symbol = SymbolShim;
  }

  /* ============ Object.getOwnPropertySymbols (Chrome 38+) ============ */
  if (!Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols = function () { return []; };
  }

  /* ============ Object.getOwnPropertyDescriptors (Chrome 54+) ============ */
  if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
      var result = {}, keys = Object.keys(obj), i, k;
      for (i = 0; i < keys.length; i++) {
        k = keys[i];
        result[k] = Object.getOwnPropertyDescriptor(obj, k);
      }
      return result;
    };
  }

  /* ============ Array.from (Chrome 45+) ============ */
  if (!Array.from) {
    Array.from = function (arrayLike, mapFn, thisArg) {
      var len = arrayLike.length, arr = [], i;
      for (i = 0; i < len; i++) {
        if (mapFn) {
          arr.push(mapFn.call(thisArg, arrayLike[i], i));
        } else {
          arr.push(arrayLike[i]);
        }
      }
      return arr;
    };
  }

  /* ============ Array.prototype.includes (Chrome 47+) ============ */
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
      var i, len = this.length;
      i = fromIndex || 0;
      if (i < 0) { i = Math.max(len + i, 0); }
      for (; i < len; i++) {
        if (this[i] === searchElement || (typeof searchElement === 'number' && isNaN(searchElement) && isNaN(this[i]))) {
          return true;
        }
      }
      return false;
    };
  }

  /* ============ Array.prototype.flat (Chrome 69+) ============ */
  if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
      var d = (typeof depth === 'number' && depth > 0) ? depth : 1;
      var out = [], self = this, i, j;
      for (i = 0; i < self.length; i++) {
        if (self[i] instanceof Array && d > 0) {
          var sub = self[i].flat(d - 1);
          for (j = 0; j < sub.length; j++) { out.push(sub[j]); }
        } else {
          out.push(self[i]);
        }
      }
      return out;
    };
  }

  /* ============ String.prototype.includes (Chrome 41+) ============ */
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      return this.indexOf(search, start || 0) !== -1;
    };
  }

  /* ============ String.prototype.startsWith (Chrome 41+) ============ */
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
      return this.substr(pos || 0, search.length) === search;
    };
  }

  /* ============ String.prototype.padStart (Chrome 57+) ============ */
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
      var s = String(this), pad = padString || ' ', need = targetLength - s.length, out = '', i;
      if (need <= 0) { return s; }
      for (i = 0; i < need; i++) { out += pad[i % pad.length]; }
      return out + s;
    };
  }

  /* ============ Set (Chrome 38+) — basic implementation ============ */
  if (typeof Set !== 'function') {
    var SetPolyfill = function (iterable) {
      this._items = [];
      this.size = 0;
      if (iterable && typeof iterable.forEach === 'function') {
        var self = this;
        iterable.forEach(function (v) { self.add(v); });
      }
    };
    SetPolyfill.prototype.add = function (value) {
      if (!this.has(value)) {
        this._items.push(value);
        this.size = this._items.length;
      }
      return this;
    };
    SetPolyfill.prototype.has = function (value) {
      var i;
      for (i = 0; i < this._items.length; i++) {
        if (this._items[i] === value) { return true; }
      }
      return false;
    };
    SetPolyfill.prototype['delete'] = function (value) {
      var i;
      for (i = 0; i < this._items.length; i++) {
        if (this._items[i] === value) {
          this._items.splice(i, 1);
          this.size = this._items.length;
          return true;
        }
      }
      return false;
    };
    SetPolyfill.prototype.clear = function () {
      this._items = [];
      this.size = 0;
    };
    SetPolyfill.prototype.forEach = function (callback, thisArg) {
      var i;
      for (i = 0; i < this._items.length; i++) {
        callback.call(thisArg, this._items[i], this._items[i], this);
      }
    };
    SetPolyfill.prototype.values = function () {
      return { next: function () { return this._done; }, _done: false };
    };
    SetPolyfill.prototype.keys = SetPolyfill.prototype.values;
    SetPolyfill.prototype.entries = function () {
      var items = this._items, i = 0;
      return {
        next: function () {
          if (i < items.length) {
            var v = items[i++];
            return { value: [v, v], done: false };
          }
          return { value: undefined, done: true };
        }
      };
    };
    try {
      SetPolyfill.prototype[typeof Symbol !== 'undefined' && Symbol.iterator ? Symbol.iterator : '@@iterator'] = SetPolyfill.prototype.values;
    } catch (e) { /* ignore */ }
    window.Set = SetPolyfill;
  }

  /* ============ AbortController + AbortSignal (Chrome 66+) ============ */
  if (!window.AbortController) {
    var AbortSignalPolyfill = function () {
      this.aborted = false;
      this._listeners = {};
    };
    AbortSignalPolyfill.prototype.addEventListener = function (type, fn) {
      if (type !== 'abort') { return; }
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(fn);
    };
    AbortSignalPolyfill.prototype.removeEventListener = function (type, fn) {
      var list = this._listeners[type] || [], i;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === fn) { list.splice(i, 1); }
      }
    };
    AbortSignalPolyfill.prototype.dispatchEvent = function () {
      var list = this._listeners.abort || [], i;
      for (i = 0; i < list.length; i++) { list[i].call(this); }
      return true;
    };

    var AbortControllerPolyfill = function () {
      this.signal = new AbortSignalPolyfill();
    };
    AbortControllerPolyfill.prototype.abort = function () {
      if (this.signal.aborted) { return; }
      this.signal.aborted = true;
      this.signal.dispatchEvent({ type: 'abort' });
    };
    window.AbortController = AbortControllerPolyfill;
  }

  /* ============ URLSearchParams (Chrome 49+) ============ */
  if (!window.URLSearchParams) {
    var URLSearchParamsPolyfill = function (init) {
      this._params = {};
      if (typeof init === 'string') {
        var pairs = init.replace(/^\?/, '').split('&'), i, kv;
        for (i = 0; i < pairs.length; i++) {
          if (!pairs[i]) { continue; }
          kv = pairs[i].split('=');
          this.append(decodeURIComponent(kv[0]), decodeURIComponent(kv[1] || ''));
        }
      }
    };
    URLSearchParamsPolyfill.prototype.append = function (key, value) {
      if (!this._params[key]) { this._params[key] = []; }
      this._params[key].push(String(value));
    };
    URLSearchParamsPolyfill.prototype.get = function (key) {
      var arr = this._params[key];
      return arr && arr.length ? arr[0] : null;
    };
    URLSearchParamsPolyfill.prototype.getAll = function (key) {
      return this._params[key] || [];
    };
    URLSearchParamsPolyfill.prototype.set = function (key, value) {
      this._params[key] = [String(value)];
    };
    URLSearchParamsPolyfill.prototype.has = function (key) {
      return !!this._params[key];
    };
    URLSearchParamsPolyfill.prototype.toString = function () {
      var out = [], keys = Object.keys(this._params), i, j;
      for (i = 0; i < keys.length; i++) {
        for (j = 0; j < this._params[keys[i]].length; j++) {
          out.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(this._params[keys[i]][j]));
        }
      }
      return out.join('&');
    };
    URLSearchParamsPolyfill.prototype['delete'] = function (key) {
      delete this._params[key];
    };
    window.URLSearchParams = URLSearchParamsPolyfill;
  }

  /* ============ fetch (Chrome 42+) — XMLHttpRequest-based ============ */
  if (!window.fetch) {
    window.fetch = function (input, init) {
      init = init || {};
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var method = init.method || 'GET';
        var url = typeof input === 'string' ? input : (input && input.url) || String(input);
        xhr.open(method, url, true);

        if (init.headers) {
          var hKeys = Object.keys(init.headers), hi;
          for (hi = 0; hi < hKeys.length; hi++) {
            xhr.setRequestHeader(hKeys[hi], init.headers[hKeys[hi]]);
          }
        }

        var aborted = false;
        var onAbort = function () {
          aborted = true;
          xhr.abort();
        };
        if (init.signal) {
          if (init.signal.aborted) {
            onAbort();
          } else {
            init.signal.addEventListener('abort', onAbort);
          }
        }

        xhr.onload = function () {
          if (aborted) { return; }
          var response = {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText || '',
            url: (xhr.responseURL || url),
            headers: {
              get: function (name) { return xhr.getResponseHeader(name); },
              has: function (name) { return xhr.getResponseHeader(name) !== null; }
            },
            text: function () {
              return Promise.resolve(xhr.responseText === undefined ? '' : String(xhr.responseText));
            },
            json: function () {
              return Promise.resolve(JSON.parse(xhr.responseText));
            },
            blob: function () {
              return Promise.resolve(xhr.response);
            },
            arrayBuffer: function () {
              return Promise.resolve(xhr.response);
            }
          };
          resolve(response);
        };
        xhr.onerror = function () {
          if (aborted) { return; }
          reject(new TypeError('Failed to fetch'));
        };
        xhr.onabort = function () {
          if (!aborted) { reject(new DOMException('The user aborted a request.', 'AbortError')); }
        };
        xhr.ontimeout = function () {
          reject(new Error('Network timeout'));
        };

        try {
          xhr.send(init.body || null);
        } catch (e) {
          reject(e);
        }
      });
    };
  }

  /* ============ Promise.prototype.finally (Chrome 63+) ============ */
  if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
    Promise.prototype.finally = function (onFinally) {
      var P = this.constructor;
      return this.then(
        function (value) {
          return P.resolve(onFinally()).then(function () { return value; });
        },
        function (reason) {
          return P.resolve(onFinally()).then(function () { throw reason; });
        }
      );
    };
  }
})();