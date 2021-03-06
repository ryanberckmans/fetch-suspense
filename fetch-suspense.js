"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var deepEqual = require("deep-equal");
var getDefaultFetchFunction = function () {
    if (typeof window === 'undefined') {
        return function () {
            return Promise.reject(new Error('Cannot find `window`. Use `createUseFetch` to provide a custom `fetch` function.'));
        };
    }
    if (typeof window.fetch === 'undefined') {
        return function () {
            return Promise.reject(new Error('Cannot find `window.fetch`. Use `createUseFetch` to provide a custom `fetch` function.'));
        };
    }
    return window.fetch;
};
var createUseFetch = function (fetch) {
    if (fetch === void 0) { fetch = getDefaultFetchFunction(); }
    var caches = [];
    function useFetch(input, init, options) {
        if (options === void 0) { options = 0; }
        var e_1, _a;
        if (typeof options === 'number') {
            return useFetch(input, init, { lifespan: options });
        }
        var _b = options.metadata, metadata = _b === void 0 ? false : _b, _c = options.lifespan, lifespan = _c === void 0 ? 0 : _c;
        try {
            for (var caches_1 = __values(caches), caches_1_1 = caches_1.next(); !caches_1_1.done; caches_1_1 = caches_1.next()) {
                var cache_1 = caches_1_1.value;
                var cacheHit = deepEqual(input, cache_1.input) && deepEqual(init, cache_1.init);
                if (cacheHit && options.evict) {
                    evict(caches, cache_1);
                    break;
                }
                else if (cacheHit) {
                    if (Object.prototype.hasOwnProperty.call(cache_1, 'error')) {
                        throw cache_1.error;
                    }
                    if (Object.prototype.hasOwnProperty.call(cache_1, 'response')) {
                        if (metadata) {
                            return {
                                bodyUsed: cache_1.bodyUsed,
                                contentType: cache_1.contentType,
                                headers: cache_1.headers,
                                ok: cache_1.ok,
                                redirected: cache_1.redirected,
                                response: cache_1.response,
                                status: cache_1.status,
                                statusText: cache_1.statusText,
                                url: cache_1.url,
                            };
                        }
                        return cache_1.response;
                    }
                    throw cache_1.fetch;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (caches_1_1 && !caches_1_1.done && (_a = caches_1.return)) _a.call(caches_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var cache = {
            fetch: fetch(input, init)
                .then(function (response) {
                cache.contentType = response.headers.get('Content-Type');
                if (metadata) {
                    cache.bodyUsed = response.bodyUsed;
                    cache.headers = response.headers;
                    cache.ok = response.ok;
                    cache.redirected = response.redirected;
                    cache.status = response.status;
                    cache.statusText = response.statusText;
                }
                if (cache.contentType &&
                    cache.contentType.indexOf('application/json') !== -1) {
                    return response.json();
                }
                return response.text();
            })
                .then(function (response) {
                cache.response = response;
            })
                .catch(function (e) {
                cache.error = e;
            })
                .then(function () {
                if (lifespan > 0) {
                    setTimeout(function () {
                        evict(caches, cache);
                    }, lifespan);
                }
            }),
            init: init,
            input: input,
        };
        caches.push(cache);
        throw cache.fetch;
    }
    return useFetch;
    function evict(_caches, _cache) {
        var index = _caches.indexOf(_cache);
        if (index !== -1) {
            _caches.splice(index, 1);
        }
    }
};
var _export = Object.assign(createUseFetch(), {
    createUseFetch: createUseFetch,
    default: createUseFetch(),
});
module.exports = _export;
