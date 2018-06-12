/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(6);
module.exports = __webpack_require__(7);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(4);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PageHeader = __webpack_require__(8);
var ProjectLooper = __webpack_require__(14);

var header = new PageHeader();

var project = new ProjectLooper();

//
// // $(window).on('load', function() { // makes sure the whole site is loaded
//     // $('#status').fadeOut(); // will first fade out the loading animation
//     // $('#preloader').delay(600).fadeOut('slow'); // will fade out the white DIV that covers the website.
//     // $('body').delay(600).css({'overflow':'visible'});
//     //
//
//
//
//    /* let  i = 0;
//     setInterval(function() {
//
//         let images= ['time.jpg','24hours.jpg','hipster.jpg','large-pg-img.jpg'];
//         (i === images.length-1) ? i = 0 : i++;
//
//         console.log(i);
//         var image = $('#image-holder');
//         image.fadeOut(2000, function () {
//             image.css("background", "url('img/" + images[i] + "')");
//             image.css("background-size", "cover");
//             image.fadeIn(2000);
//
//         });
//
//     }, 6000);*/
//
// //
// //     $(document).scroll(function() {
// //
// //         if($(this).scrollTop() >= 70) {
// //             $('.bg-custom-dark').css('background-color','#1C1C1D');
// //         } else {
// //             $('.bg-custom-dark').css('background-color','transparent');
// //
// //         }
// //
// //     });
// //
// //
// //     // hide elements display new ones for  4 panels
// //     $('.more-btn').click(function () {
// //         $('.panel').hide("slide", { direction: "right" }, 2000);
// //         $(this).parent().parent().find('.panel').show("slide", { direction: "left" }, 1000)
// //
// //     })
// //
// //
// // });
//
//
// //----- OPEN
// // OPEN
// // $('[data-popup-open]').on('click', function(e)  {
// //     var targeted_popup_class = jQuery(this).attr('data-popup-open');
// //     $('body').css("overflow","hidden");
// //     $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
// // });
// // //----- CLOSE
// // $('[data-popup-close]').on('click', function(e)  {
// //     var targeted_popup_class = jQuery(this).attr('data-popup-close');
// //     $('body').css("overflow","auto");
// //     $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
//
// // });
//
//


// Select all links with hashes
// $('a[href*="#"]')
// // Remove links that don't actually link to anything
//     .not('[href="#"]')
//     .not('[href="#0"]')
//     .click(function(event) {
//         // On-page links
//         if (
//             location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
//             &&
//             location.hostname == this.hostname
//         ) {
//             // Figure out element to scroll to
//             var target = $(this.hash);
//             target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//             // Does a scroll target exist?
//             if (target.length) {
//                 // Only prevent default if animation is actually gonna happen
//                 event.preventDefault();
//                 $('html, body').animate({
//                     scrollTop: target.offset().top
//                 }, 1000, function() {
//                     // Callback after animation
//                     // Must change focus!
//                     var $target = $(target);
//                     $target.focus();
//                     if ($target.is(":focus")) { // Checking if the target was focused
//                         return false;
//                     } else {
//                         $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
//                         $target.focus(); // Set focus again
//                     };
//                 });
//             }
//         }
//     });


// Cache selectors
var lastId,
    topMenu = $("#header-nav"),
    topMenuHeight = 75,

// All list items
menuItems = topMenu.find("a"),

// Anchors corresponding to menu items
scrollItems = menuItems.map(function () {
    var item = $($(this).attr("href"));
    if (item.length) {
        return item;
    }
});

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function (e) {
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 300);
    e.preventDefault();
});

// Bind to scroll
$(window).scroll(function () {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function () {
        if ($(this).offset().top < fromTop) return this;
    });
    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";

    if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        menuItems.parent().removeClass("active").end().filter("[href='#" + id + "']").parent().addClass("active");
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var animate = __webpack_require__(9);

//Constructor
function HeaderObject(settings) {
    var self = this;
    // Attach Div ID
    this.settings = settings;
    this.headerNav = '#header-nav';
    this.init();
}

HeaderObject.prototype.init = function () {

    var self = this;

    $(document).scroll(function () {

        if ($(this).scrollTop() >= 70) {
            $(self.headerNav).addClass('animated slideInDown bg-custom-dark').removeClass('nav-top');
        }

        if ($(this).scrollTop() < 30) {
            $(self.headerNav).removeClass('animated slideInDown bg-custom-dark').addClass('nav-top');
        }
    });

    $('.nav-item a').click(function () {
        // create click to do animation?
    });
};

module.exports = HeaderObject;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(10);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(12)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../css-loader/index.js!./animate.css", function() {
		var newContent = require("!!../css-loader/index.js!./animate.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\n/*!\n * animate.css -http://daneden.me/animate\n * Version - 3.6.0\n * Licensed under the MIT license - http://opensource.org/licenses/MIT\n *\n * Copyright (c) 2018 Daniel Eden\n */\n\n.animated {\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n}\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n  animation-iteration-count: infinite;\n}\n\n@-webkit-keyframes bounce {\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  40%,\n  43% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -30px, 0);\n    transform: translate3d(0, -30px, 0);\n  }\n\n  70% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -15px, 0);\n    transform: translate3d(0, -15px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, -4px, 0);\n    transform: translate3d(0, -4px, 0);\n  }\n}\n\n@keyframes bounce {\n  from,\n  20%,\n  53%,\n  80%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  40%,\n  43% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -30px, 0);\n    transform: translate3d(0, -30px, 0);\n  }\n\n  70% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -15px, 0);\n    transform: translate3d(0, -15px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, -4px, 0);\n    transform: translate3d(0, -4px, 0);\n  }\n}\n\n.bounce {\n  -webkit-animation-name: bounce;\n  animation-name: bounce;\n  -webkit-transform-origin: center bottom;\n  transform-origin: center bottom;\n}\n\n@-webkit-keyframes flash {\n  from,\n  50%,\n  to {\n    opacity: 1;\n  }\n\n  25%,\n  75% {\n    opacity: 0;\n  }\n}\n\n@keyframes flash {\n  from,\n  50%,\n  to {\n    opacity: 1;\n  }\n\n  25%,\n  75% {\n    opacity: 0;\n  }\n}\n\n.flash {\n  -webkit-animation-name: flash;\n  animation-name: flash;\n}\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n.pulse {\n  -webkit-animation-name: pulse;\n  animation-name: pulse;\n}\n\n@-webkit-keyframes rubberBand {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  30% {\n    -webkit-transform: scale3d(1.25, 0.75, 1);\n    transform: scale3d(1.25, 0.75, 1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.75, 1.25, 1);\n    transform: scale3d(0.75, 1.25, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.15, 0.85, 1);\n    transform: scale3d(1.15, 0.85, 1);\n  }\n\n  65% {\n    -webkit-transform: scale3d(0.95, 1.05, 1);\n    transform: scale3d(0.95, 1.05, 1);\n  }\n\n  75% {\n    -webkit-transform: scale3d(1.05, 0.95, 1);\n    transform: scale3d(1.05, 0.95, 1);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes rubberBand {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  30% {\n    -webkit-transform: scale3d(1.25, 0.75, 1);\n    transform: scale3d(1.25, 0.75, 1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.75, 1.25, 1);\n    transform: scale3d(0.75, 1.25, 1);\n  }\n\n  50% {\n    -webkit-transform: scale3d(1.15, 0.85, 1);\n    transform: scale3d(1.15, 0.85, 1);\n  }\n\n  65% {\n    -webkit-transform: scale3d(0.95, 1.05, 1);\n    transform: scale3d(0.95, 1.05, 1);\n  }\n\n  75% {\n    -webkit-transform: scale3d(1.05, 0.95, 1);\n    transform: scale3d(1.05, 0.95, 1);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n.rubberBand {\n  -webkit-animation-name: rubberBand;\n  animation-name: rubberBand;\n}\n\n@-webkit-keyframes shake {\n  from,\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  10%,\n  30%,\n  50%,\n  70%,\n  90% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0);\n  }\n\n  20%,\n  40%,\n  60%,\n  80% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0);\n  }\n}\n\n@keyframes shake {\n  from,\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  10%,\n  30%,\n  50%,\n  70%,\n  90% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0);\n  }\n\n  20%,\n  40%,\n  60%,\n  80% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0);\n  }\n}\n\n.shake {\n  -webkit-animation-name: shake;\n  animation-name: shake;\n}\n\n@-webkit-keyframes headShake {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0);\n  }\n\n  6.5% {\n    -webkit-transform: translateX(-6px) rotateY(-9deg);\n    transform: translateX(-6px) rotateY(-9deg);\n  }\n\n  18.5% {\n    -webkit-transform: translateX(5px) rotateY(7deg);\n    transform: translateX(5px) rotateY(7deg);\n  }\n\n  31.5% {\n    -webkit-transform: translateX(-3px) rotateY(-5deg);\n    transform: translateX(-3px) rotateY(-5deg);\n  }\n\n  43.5% {\n    -webkit-transform: translateX(2px) rotateY(3deg);\n    transform: translateX(2px) rotateY(3deg);\n  }\n\n  50% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0);\n  }\n}\n\n@keyframes headShake {\n  0% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0);\n  }\n\n  6.5% {\n    -webkit-transform: translateX(-6px) rotateY(-9deg);\n    transform: translateX(-6px) rotateY(-9deg);\n  }\n\n  18.5% {\n    -webkit-transform: translateX(5px) rotateY(7deg);\n    transform: translateX(5px) rotateY(7deg);\n  }\n\n  31.5% {\n    -webkit-transform: translateX(-3px) rotateY(-5deg);\n    transform: translateX(-3px) rotateY(-5deg);\n  }\n\n  43.5% {\n    -webkit-transform: translateX(2px) rotateY(3deg);\n    transform: translateX(2px) rotateY(3deg);\n  }\n\n  50% {\n    -webkit-transform: translateX(0);\n    transform: translateX(0);\n  }\n}\n\n.headShake {\n  -webkit-animation-timing-function: ease-in-out;\n  animation-timing-function: ease-in-out;\n  -webkit-animation-name: headShake;\n  animation-name: headShake;\n}\n\n@-webkit-keyframes swing {\n  20% {\n    -webkit-transform: rotate3d(0, 0, 1, 15deg);\n    transform: rotate3d(0, 0, 1, 15deg);\n  }\n\n  40% {\n    -webkit-transform: rotate3d(0, 0, 1, -10deg);\n    transform: rotate3d(0, 0, 1, -10deg);\n  }\n\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 5deg);\n    transform: rotate3d(0, 0, 1, 5deg);\n  }\n\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, -5deg);\n    transform: rotate3d(0, 0, 1, -5deg);\n  }\n\n  to {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n    transform: rotate3d(0, 0, 1, 0deg);\n  }\n}\n\n@keyframes swing {\n  20% {\n    -webkit-transform: rotate3d(0, 0, 1, 15deg);\n    transform: rotate3d(0, 0, 1, 15deg);\n  }\n\n  40% {\n    -webkit-transform: rotate3d(0, 0, 1, -10deg);\n    transform: rotate3d(0, 0, 1, -10deg);\n  }\n\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 5deg);\n    transform: rotate3d(0, 0, 1, 5deg);\n  }\n\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, -5deg);\n    transform: rotate3d(0, 0, 1, -5deg);\n  }\n\n  to {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n    transform: rotate3d(0, 0, 1, 0deg);\n  }\n}\n\n.swing {\n  -webkit-transform-origin: top center;\n  transform-origin: top center;\n  -webkit-animation-name: swing;\n  animation-name: swing;\n}\n\n@-webkit-keyframes tada {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  10%,\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n  }\n\n  30%,\n  50%,\n  70%,\n  90% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n  }\n\n  40%,\n  60%,\n  80% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes tada {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n\n  10%,\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n  }\n\n  30%,\n  50%,\n  70%,\n  90% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n  }\n\n  40%,\n  60%,\n  80% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n  }\n\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n.tada {\n  -webkit-animation-name: tada;\n  animation-name: tada;\n}\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n\n@-webkit-keyframes wobble {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  15% {\n    -webkit-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n  }\n\n  30% {\n    -webkit-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n  }\n\n  45% {\n    -webkit-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n  }\n\n  60% {\n    -webkit-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n  }\n\n  75% {\n    -webkit-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes wobble {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  15% {\n    -webkit-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n  }\n\n  30% {\n    -webkit-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n  }\n\n  45% {\n    -webkit-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n  }\n\n  60% {\n    -webkit-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n  }\n\n  75% {\n    -webkit-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.wobble {\n  -webkit-animation-name: wobble;\n  animation-name: wobble;\n}\n\n@-webkit-keyframes jello {\n  from,\n  11.1%,\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  22.2% {\n    -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);\n    transform: skewX(-12.5deg) skewY(-12.5deg);\n  }\n\n  33.3% {\n    -webkit-transform: skewX(6.25deg) skewY(6.25deg);\n    transform: skewX(6.25deg) skewY(6.25deg);\n  }\n\n  44.4% {\n    -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);\n    transform: skewX(-3.125deg) skewY(-3.125deg);\n  }\n\n  55.5% {\n    -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);\n    transform: skewX(1.5625deg) skewY(1.5625deg);\n  }\n\n  66.6% {\n    -webkit-transform: skewX(-0.78125deg) skewY(-0.78125deg);\n    transform: skewX(-0.78125deg) skewY(-0.78125deg);\n  }\n\n  77.7% {\n    -webkit-transform: skewX(0.390625deg) skewY(0.390625deg);\n    transform: skewX(0.390625deg) skewY(0.390625deg);\n  }\n\n  88.8% {\n    -webkit-transform: skewX(-0.1953125deg) skewY(-0.1953125deg);\n    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);\n  }\n}\n\n@keyframes jello {\n  from,\n  11.1%,\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  22.2% {\n    -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);\n    transform: skewX(-12.5deg) skewY(-12.5deg);\n  }\n\n  33.3% {\n    -webkit-transform: skewX(6.25deg) skewY(6.25deg);\n    transform: skewX(6.25deg) skewY(6.25deg);\n  }\n\n  44.4% {\n    -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);\n    transform: skewX(-3.125deg) skewY(-3.125deg);\n  }\n\n  55.5% {\n    -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);\n    transform: skewX(1.5625deg) skewY(1.5625deg);\n  }\n\n  66.6% {\n    -webkit-transform: skewX(-0.78125deg) skewY(-0.78125deg);\n    transform: skewX(-0.78125deg) skewY(-0.78125deg);\n  }\n\n  77.7% {\n    -webkit-transform: skewX(0.390625deg) skewY(0.390625deg);\n    transform: skewX(0.390625deg) skewY(0.390625deg);\n  }\n\n  88.8% {\n    -webkit-transform: skewX(-0.1953125deg) skewY(-0.1953125deg);\n    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);\n  }\n}\n\n.jello {\n  -webkit-animation-name: jello;\n  animation-name: jello;\n  -webkit-transform-origin: center;\n  transform-origin: center;\n}\n\n@-webkit-keyframes bounceIn {\n  from,\n  20%,\n  40%,\n  60%,\n  80%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounceIn {\n  from,\n  20%,\n  40%,\n  60%,\n  80%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n    transform: scale3d(0.97, 0.97, 0.97);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n.bounceIn {\n  -webkit-animation-duration: 0.75s;\n  animation-duration: 0.75s;\n  -webkit-animation-name: bounceIn;\n  animation-name: bounceIn;\n}\n\n@-webkit-keyframes bounceInDown {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n    transform: translate3d(0, 5px, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes bounceInDown {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n    transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n    transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n    transform: translate3d(0, 5px, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n  animation-name: bounceInDown;\n}\n\n@-webkit-keyframes bounceInLeft {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(-3000px, 0, 0);\n    transform: translate3d(-3000px, 0, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(25px, 0, 0);\n    transform: translate3d(25px, 0, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(5px, 0, 0);\n    transform: translate3d(5px, 0, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes bounceInLeft {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(-3000px, 0, 0);\n    transform: translate3d(-3000px, 0, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(25px, 0, 0);\n    transform: translate3d(25px, 0, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(5px, 0, 0);\n    transform: translate3d(5px, 0, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.bounceInLeft {\n  -webkit-animation-name: bounceInLeft;\n  animation-name: bounceInLeft;\n}\n\n@-webkit-keyframes bounceInRight {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(3000px, 0, 0);\n    transform: translate3d(3000px, 0, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(-25px, 0, 0);\n    transform: translate3d(-25px, 0, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(-5px, 0, 0);\n    transform: translate3d(-5px, 0, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes bounceInRight {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(3000px, 0, 0);\n    transform: translate3d(3000px, 0, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(-25px, 0, 0);\n    transform: translate3d(-25px, 0, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(-5px, 0, 0);\n    transform: translate3d(-5px, 0, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.bounceInRight {\n  -webkit-animation-name: bounceInRight;\n  animation-name: bounceInRight;\n}\n\n@-webkit-keyframes bounceInUp {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 3000px, 0);\n    transform: translate3d(0, 3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, -5px, 0);\n    transform: translate3d(0, -5px, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes bounceInUp {\n  from,\n  60%,\n  75%,\n  90%,\n  to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 3000px, 0);\n    transform: translate3d(0, 3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, -5px, 0);\n    transform: translate3d(0, -5px, 0);\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.bounceInUp {\n  -webkit-animation-name: bounceInUp;\n  animation-name: bounceInUp;\n}\n\n@-webkit-keyframes bounceOut {\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  50%,\n  55% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n}\n\n@keyframes bounceOut {\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9);\n  }\n\n  50%,\n  55% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n}\n\n.bounceOut {\n  -webkit-animation-duration: 0.75s;\n  animation-duration: 0.75s;\n  -webkit-animation-name: bounceOut;\n  animation-name: bounceOut;\n}\n\n@-webkit-keyframes bounceOutDown {\n  20% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0);\n  }\n\n  40%,\n  45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n@keyframes bounceOutDown {\n  20% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0);\n  }\n\n  40%,\n  45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n.bounceOutDown {\n  -webkit-animation-name: bounceOutDown;\n  animation-name: bounceOutDown;\n}\n\n@-webkit-keyframes bounceOutLeft {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(20px, 0, 0);\n    transform: translate3d(20px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n}\n\n@keyframes bounceOutLeft {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(20px, 0, 0);\n    transform: translate3d(20px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n}\n\n.bounceOutLeft {\n  -webkit-animation-name: bounceOutLeft;\n  animation-name: bounceOutLeft;\n}\n\n@-webkit-keyframes bounceOutRight {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(-20px, 0, 0);\n    transform: translate3d(-20px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n}\n\n@keyframes bounceOutRight {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(-20px, 0, 0);\n    transform: translate3d(-20px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n}\n\n.bounceOutRight {\n  -webkit-animation-name: bounceOutRight;\n  animation-name: bounceOutRight;\n}\n\n@-webkit-keyframes bounceOutUp {\n  20% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0);\n  }\n\n  40%,\n  45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 20px, 0);\n    transform: translate3d(0, 20px, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n@keyframes bounceOutUp {\n  20% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0);\n  }\n\n  40%,\n  45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 20px, 0);\n    transform: translate3d(0, 20px, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n.bounceOutUp {\n  -webkit-animation-name: bounceOutUp;\n  animation-name: bounceOutUp;\n}\n\n@-webkit-keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n.fadeIn {\n  -webkit-animation-name: fadeIn;\n  animation-name: fadeIn;\n}\n\n@-webkit-keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInDown {\n  -webkit-animation-name: fadeInDown;\n  animation-name: fadeInDown;\n}\n\n@-webkit-keyframes fadeInDownBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInDownBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInDownBig {\n  -webkit-animation-name: fadeInDownBig;\n  animation-name: fadeInDownBig;\n}\n\n@-webkit-keyframes fadeInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInLeft {\n  -webkit-animation-name: fadeInLeft;\n  animation-name: fadeInLeft;\n}\n\n@-webkit-keyframes fadeInLeftBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInLeftBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInLeftBig {\n  -webkit-animation-name: fadeInLeftBig;\n  animation-name: fadeInLeftBig;\n}\n\n@-webkit-keyframes fadeInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInRight {\n  -webkit-animation-name: fadeInRight;\n  animation-name: fadeInRight;\n}\n\n@-webkit-keyframes fadeInRightBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInRightBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInRightBig {\n  -webkit-animation-name: fadeInRightBig;\n  animation-name: fadeInRightBig;\n}\n\n@-webkit-keyframes fadeInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInUp {\n  -webkit-animation-name: fadeInUp;\n  animation-name: fadeInUp;\n}\n\n@-webkit-keyframes fadeInUpBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fadeInUpBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.fadeInUpBig {\n  -webkit-animation-name: fadeInUpBig;\n  animation-name: fadeInUpBig;\n}\n\n@-webkit-keyframes fadeOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes fadeOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n.fadeOut {\n  -webkit-animation-name: fadeOut;\n  animation-name: fadeOut;\n}\n\n@-webkit-keyframes fadeOutDown {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n}\n\n@keyframes fadeOutDown {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n}\n\n.fadeOutDown {\n  -webkit-animation-name: fadeOutDown;\n  animation-name: fadeOutDown;\n}\n\n@-webkit-keyframes fadeOutDownBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n@keyframes fadeOutDownBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n.fadeOutDownBig {\n  -webkit-animation-name: fadeOutDownBig;\n  animation-name: fadeOutDownBig;\n}\n\n@-webkit-keyframes fadeOutLeft {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n}\n\n@keyframes fadeOutLeft {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n}\n\n.fadeOutLeft {\n  -webkit-animation-name: fadeOutLeft;\n  animation-name: fadeOutLeft;\n}\n\n@-webkit-keyframes fadeOutLeftBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n}\n\n@keyframes fadeOutLeftBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0);\n  }\n}\n\n.fadeOutLeftBig {\n  -webkit-animation-name: fadeOutLeftBig;\n  animation-name: fadeOutLeftBig;\n}\n\n@-webkit-keyframes fadeOutRight {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n}\n\n@keyframes fadeOutRight {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n}\n\n.fadeOutRight {\n  -webkit-animation-name: fadeOutRight;\n  animation-name: fadeOutRight;\n}\n\n@-webkit-keyframes fadeOutRightBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n}\n\n@keyframes fadeOutRightBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0);\n  }\n}\n\n.fadeOutRightBig {\n  -webkit-animation-name: fadeOutRightBig;\n  animation-name: fadeOutRightBig;\n}\n\n@-webkit-keyframes fadeOutUp {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n}\n\n@keyframes fadeOutUp {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n}\n\n.fadeOutUp {\n  -webkit-animation-name: fadeOutUp;\n  animation-name: fadeOutUp;\n}\n\n@-webkit-keyframes fadeOutUpBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n@keyframes fadeOutUpBig {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n.fadeOutUpBig {\n  -webkit-animation-name: fadeOutUpBig;\n  animation-name: fadeOutUpBig;\n}\n\n@-webkit-keyframes flip {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n\n  50% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n}\n\n@keyframes flip {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out;\n  }\n\n  50% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n}\n\n.animated.flip {\n  -webkit-backface-visibility: visible;\n  backface-visibility: visible;\n  -webkit-animation-name: flip;\n  animation-name: flip;\n}\n\n@-webkit-keyframes flipInX {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n}\n\n@keyframes flipInX {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n}\n\n.flipInX {\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipInX;\n  animation-name: flipInX;\n}\n\n@-webkit-keyframes flipInY {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n}\n\n@keyframes flipInY {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n  }\n\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n  }\n\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n}\n\n.flipInY {\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipInY;\n  animation-name: flipInY;\n}\n\n@-webkit-keyframes flipOutX {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n@keyframes flipOutX {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n.flipOutX {\n  -webkit-animation-duration: 0.75s;\n  animation-duration: 0.75s;\n  -webkit-animation-name: flipOutX;\n  animation-name: flipOutX;\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n}\n\n@-webkit-keyframes flipOutY {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n@keyframes flipOutY {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n  }\n\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n.flipOutY {\n  -webkit-animation-duration: 0.75s;\n  animation-duration: 0.75s;\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipOutY;\n  animation-name: flipOutY;\n}\n\n@-webkit-keyframes lightSpeedIn {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);\n    transform: translate3d(100%, 0, 0) skewX(-30deg);\n    opacity: 0;\n  }\n\n  60% {\n    -webkit-transform: skewX(20deg);\n    transform: skewX(20deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: skewX(-5deg);\n    transform: skewX(-5deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes lightSpeedIn {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);\n    transform: translate3d(100%, 0, 0) skewX(-30deg);\n    opacity: 0;\n  }\n\n  60% {\n    -webkit-transform: skewX(20deg);\n    transform: skewX(20deg);\n    opacity: 1;\n  }\n\n  80% {\n    -webkit-transform: skewX(-5deg);\n    transform: skewX(-5deg);\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.lightSpeedIn {\n  -webkit-animation-name: lightSpeedIn;\n  animation-name: lightSpeedIn;\n  -webkit-animation-timing-function: ease-out;\n  animation-timing-function: ease-out;\n}\n\n@-webkit-keyframes lightSpeedOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);\n    transform: translate3d(100%, 0, 0) skewX(30deg);\n    opacity: 0;\n  }\n}\n\n@keyframes lightSpeedOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);\n    transform: translate3d(100%, 0, 0) skewX(30deg);\n    opacity: 0;\n  }\n}\n\n.lightSpeedOut {\n  -webkit-animation-name: lightSpeedOut;\n  animation-name: lightSpeedOut;\n  -webkit-animation-timing-function: ease-in;\n  animation-timing-function: ease-in;\n}\n\n@-webkit-keyframes rotateIn {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, -200deg);\n    transform: rotate3d(0, 0, 1, -200deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes rotateIn {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, -200deg);\n    transform: rotate3d(0, 0, 1, -200deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.rotateIn {\n  -webkit-animation-name: rotateIn;\n  animation-name: rotateIn;\n}\n\n@-webkit-keyframes rotateInDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes rotateInDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.rotateInDownLeft {\n  -webkit-animation-name: rotateInDownLeft;\n  animation-name: rotateInDownLeft;\n}\n\n@-webkit-keyframes rotateInDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes rotateInDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.rotateInDownRight {\n  -webkit-animation-name: rotateInDownRight;\n  animation-name: rotateInDownRight;\n}\n\n@-webkit-keyframes rotateInUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes rotateInUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.rotateInUpLeft {\n  -webkit-animation-name: rotateInUpLeft;\n  animation-name: rotateInUpLeft;\n}\n\n@-webkit-keyframes rotateInUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -90deg);\n    transform: rotate3d(0, 0, 1, -90deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n@keyframes rotateInUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -90deg);\n    transform: rotate3d(0, 0, 1, -90deg);\n    opacity: 0;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n  }\n}\n\n.rotateInUpRight {\n  -webkit-animation-name: rotateInUpRight;\n  animation-name: rotateInUpRight;\n}\n\n@-webkit-keyframes rotateOut {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, 200deg);\n    transform: rotate3d(0, 0, 1, 200deg);\n    opacity: 0;\n  }\n}\n\n@keyframes rotateOut {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, 200deg);\n    transform: rotate3d(0, 0, 1, 200deg);\n    opacity: 0;\n  }\n}\n\n.rotateOut {\n  -webkit-animation-name: rotateOut;\n  animation-name: rotateOut;\n}\n\n@-webkit-keyframes rotateOutDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n}\n\n@keyframes rotateOutDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0;\n  }\n}\n\n.rotateOutDownLeft {\n  -webkit-animation-name: rotateOutDownLeft;\n  animation-name: rotateOutDownLeft;\n}\n\n@-webkit-keyframes rotateOutDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n}\n\n@keyframes rotateOutDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n}\n\n.rotateOutDownRight {\n  -webkit-animation-name: rotateOutDownRight;\n  animation-name: rotateOutDownRight;\n}\n\n@-webkit-keyframes rotateOutUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n}\n\n@keyframes rotateOutUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0;\n  }\n}\n\n.rotateOutUpLeft {\n  -webkit-animation-name: rotateOutUpLeft;\n  animation-name: rotateOutUpLeft;\n}\n\n@-webkit-keyframes rotateOutUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 90deg);\n    transform: rotate3d(0, 0, 1, 90deg);\n    opacity: 0;\n  }\n}\n\n@keyframes rotateOutUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 90deg);\n    transform: rotate3d(0, 0, 1, 90deg);\n    opacity: 0;\n  }\n}\n\n.rotateOutUpRight {\n  -webkit-animation-name: rotateOutUpRight;\n  animation-name: rotateOutUpRight;\n}\n\n@-webkit-keyframes hinge {\n  0% {\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n  }\n\n  20%,\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 80deg);\n    transform: rotate3d(0, 0, 1, 80deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n  }\n\n  40%,\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, 60deg);\n    transform: rotate3d(0, 0, 1, 60deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 700px, 0);\n    transform: translate3d(0, 700px, 0);\n    opacity: 0;\n  }\n}\n\n@keyframes hinge {\n  0% {\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n  }\n\n  20%,\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 80deg);\n    transform: rotate3d(0, 0, 1, 80deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n  }\n\n  40%,\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, 60deg);\n    transform: rotate3d(0, 0, 1, 60deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n    opacity: 1;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 700px, 0);\n    transform: translate3d(0, 700px, 0);\n    opacity: 0;\n  }\n}\n\n.hinge {\n  -webkit-animation-duration: 2s;\n  animation-duration: 2s;\n  -webkit-animation-name: hinge;\n  animation-name: hinge;\n}\n\n@-webkit-keyframes jackInTheBox {\n  from {\n    opacity: 0;\n    -webkit-transform: scale(0.1) rotate(30deg);\n    transform: scale(0.1) rotate(30deg);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n  }\n\n  50% {\n    -webkit-transform: rotate(-10deg);\n    transform: rotate(-10deg);\n  }\n\n  70% {\n    -webkit-transform: rotate(3deg);\n    transform: rotate(3deg);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n}\n\n@keyframes jackInTheBox {\n  from {\n    opacity: 0;\n    -webkit-transform: scale(0.1) rotate(30deg);\n    transform: scale(0.1) rotate(30deg);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n  }\n\n  50% {\n    -webkit-transform: rotate(-10deg);\n    transform: rotate(-10deg);\n  }\n\n  70% {\n    -webkit-transform: rotate(3deg);\n    transform: rotate(3deg);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n}\n\n.jackInTheBox {\n  -webkit-animation-name: jackInTheBox;\n  animation-name: jackInTheBox;\n}\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n\n@-webkit-keyframes rollIn {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes rollIn {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n  }\n\n  to {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.rollIn {\n  -webkit-animation-name: rollIn;\n  animation-name: rollIn;\n}\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n\n@-webkit-keyframes rollOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n    transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n  }\n}\n\n@keyframes rollOut {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n    transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n  }\n}\n\n.rollOut {\n  -webkit-animation-name: rollOut;\n  animation-name: rollOut;\n}\n\n@-webkit-keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n@keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n.zoomIn {\n  -webkit-animation-name: zoomIn;\n  animation-name: zoomIn;\n}\n\n@-webkit-keyframes zoomInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomInDown {\n  -webkit-animation-name: zoomInDown;\n  animation-name: zoomInDown;\n}\n\n@-webkit-keyframes zoomInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomInLeft {\n  -webkit-animation-name: zoomInLeft;\n  animation-name: zoomInLeft;\n}\n\n@-webkit-keyframes zoomInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomInRight {\n  -webkit-animation-name: zoomInRight;\n  animation-name: zoomInRight;\n}\n\n@-webkit-keyframes zoomInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomInUp {\n  -webkit-animation-name: zoomInUp;\n  animation-name: zoomInUp;\n}\n\n@-webkit-keyframes zoomOut {\n  from {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes zoomOut {\n  from {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n.zoomOut {\n  -webkit-animation-name: zoomOut;\n  animation-name: zoomOut;\n}\n\n@-webkit-keyframes zoomOutDown {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomOutDown {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomOutDown {\n  -webkit-animation-name: zoomOutDown;\n  animation-name: zoomOutDown;\n}\n\n@-webkit-keyframes zoomOutLeft {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(-2000px, 0, 0);\n    transform: scale(0.1) translate3d(-2000px, 0, 0);\n    -webkit-transform-origin: left center;\n    transform-origin: left center;\n  }\n}\n\n@keyframes zoomOutLeft {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(-2000px, 0, 0);\n    transform: scale(0.1) translate3d(-2000px, 0, 0);\n    -webkit-transform-origin: left center;\n    transform-origin: left center;\n  }\n}\n\n.zoomOutLeft {\n  -webkit-animation-name: zoomOutLeft;\n  animation-name: zoomOutLeft;\n}\n\n@-webkit-keyframes zoomOutRight {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(2000px, 0, 0);\n    transform: scale(0.1) translate3d(2000px, 0, 0);\n    -webkit-transform-origin: right center;\n    transform-origin: right center;\n  }\n}\n\n@keyframes zoomOutRight {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(2000px, 0, 0);\n    transform: scale(0.1) translate3d(2000px, 0, 0);\n    -webkit-transform-origin: right center;\n    transform-origin: right center;\n  }\n}\n\n.zoomOutRight {\n  -webkit-animation-name: zoomOutRight;\n  animation-name: zoomOutRight;\n}\n\n@-webkit-keyframes zoomOutUp {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n@keyframes zoomOutUp {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n  }\n}\n\n.zoomOutUp {\n  -webkit-animation-name: zoomOutUp;\n  animation-name: zoomOutUp;\n}\n\n@-webkit-keyframes slideInDown {\n  from {\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInDown {\n  from {\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.slideInDown {\n  -webkit-animation-name: slideInDown;\n  animation-name: slideInDown;\n}\n\n@-webkit-keyframes slideInLeft {\n  from {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInLeft {\n  from {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.slideInLeft {\n  -webkit-animation-name: slideInLeft;\n  animation-name: slideInLeft;\n}\n\n@-webkit-keyframes slideInRight {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInRight {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.slideInRight {\n  -webkit-animation-name: slideInRight;\n  animation-name: slideInRight;\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n  animation-name: slideInUp;\n}\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n}\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n  }\n}\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n  animation-name: slideOutDown;\n}\n\n@-webkit-keyframes slideOutLeft {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n}\n\n@keyframes slideOutLeft {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n  }\n}\n\n.slideOutLeft {\n  -webkit-animation-name: slideOutLeft;\n  animation-name: slideOutLeft;\n}\n\n@-webkit-keyframes slideOutRight {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n}\n\n@keyframes slideOutRight {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n}\n\n.slideOutRight {\n  -webkit-animation-name: slideOutRight;\n  animation-name: slideOutRight;\n}\n\n@-webkit-keyframes slideOutUp {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n}\n\n@keyframes slideOutUp {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n}\n\n.slideOutUp {\n  -webkit-animation-name: slideOutUp;\n  animation-name: slideOutUp;\n}\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var animate = __webpack_require__(9);

//extend jquery animate
$.fn.extend({
    animateCss: function animateCss(animationName, callback) {
        var animationEnd = function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        }(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    }
});

//Constructor
function ProjectsObject(projects) {
    var self = this;

    this.projects = projects;

    // default projects value if null
    if (projects === undefined) {
        this.projects = [{
            title: "Project Name",
            desc: "Java Spring Framework, JQuery, Node",
            github: "http://www.github.com",
            image: "24hours.jpg"
        }, {
            title: "Project Someone",
            desc: "Java JQuery, Node",
            github: "http://www.github.com",
            image: "astro-bg.jpg"
        }, {
            title: "Project Test",
            desc: "Java Spring Framework, JQuery",
            github: "http://www.github.com",
            image: "hipster.jpg"
        }];
    }

    this.headerNav = '#header-nav';
    this.backBtn = '.projects-back';
    this.forwardBtn = '.projects-forward';

    this.currentProject = 0;
    this.maxProjects = 2;

    this.init();
}

ProjectsObject.prototype.init = function () {
    var self = this;

    $(this.backBtn).click(function () {
        self.change("back");
    });

    $(this.forwardBtn).click(function () {
        self.change("forward");
    });
};

ProjectsObject.prototype.change = function (direction) {
    var self = this;

    if (direction === "forward") {

        if (this.currentProject === this.maxProjects) {
            this.currentProject = 0;
        } else {
            this.currentProject++;
        }
    }

    if (direction === "back") {

        if (this.currentProject === 0) {
            this.currentProject = this.maxProjects;
        } else {
            this.currentProject--;
        }
    }

    this.renderProject();
};

ProjectsObject.prototype.renderProject = function () {

    var p = this.projects[this.currentProject];

    console.log(this.projects[this.currentProject]);

    var backImg = $('#work-bg');

    backImg.css("background-color", "#000");

    $('#work').animateCss('bounceOutRight', function () {

        var image = $('#work');
        image.css("background", "url('img/" + p.image + "')");
        image.css("background-size", "cover");

        $('.proj-name').text(p.title);
        $('.proj-desc').text(p.desc);
        $('.proj-link').attr("href", p.github);

        $('#screen').attr("src", "img/" + p.image);
        image.animateCss('bounceInLeft');
    });
};

module.exports = ProjectsObject;

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map