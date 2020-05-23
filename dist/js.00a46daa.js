// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../fonts/NotoKufiArabic-Regular.ttf":[["NotoKufiArabic-Regular.dbf78380.ttf","../fonts/NotoKufiArabic-Regular.ttf"],"../fonts/NotoKufiArabic-Regular.ttf"],"./../fonts/NotoKufiArabic-Bold.ttf":[["NotoKufiArabic-Bold.29f84702.ttf","../fonts/NotoKufiArabic-Bold.ttf"],"../fonts/NotoKufiArabic-Bold.ttf"],"./../fonts/NotoNaskhArabicUI-Regular.ttf":[["NotoNaskhArabicUI-Regular.e2fa66c3.ttf","../fonts/NotoNaskhArabicUI-Regular.ttf"],"../fonts/NotoNaskhArabicUI-Regular.ttf"],"./../fonts/NotoNaskhArabicUI-Bold.ttf":[["NotoNaskhArabicUI-Bold.00e86c7a.ttf","../fonts/NotoNaskhArabicUI-Bold.ttf"],"../fonts/NotoNaskhArabicUI-Bold.ttf"],"_css_loader":"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radialGradiant = radialGradiant;
exports.drawText = drawText;
exports.SVGtoImage = SVGtoImage;

function ctxWordWrap(ctx, text, max_width) {
  var output = "";
  var scache = "";
  var lastIsLong;

  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    scache += c;
    var mtext = ctx.measureText(scache);
    var width = Math.abs(mtext.actualBoundingBoxLeft + mtext.actualBoundingBoxRight);
    var isLong = width > max_width;
    var isLast = i == text.length - 1;

    if (lastIsLong || isLong && c == " " || isLast) {
      output += scache + (isLast ? "" : "\n");
      scache = ""; // if (isLong) lastIsLong = true; 
      // if (lastIsLong) lastIsLong = false;
    }
  }

  return output.split("\n");
}

function SVGtoImage(svg) {
  return new Promise(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      return resolve(img);
    };

    img.onerror = reject;
    img.src = "data:image/svg+xml," + encodeURIComponent(svg.outerHTML);
  });
}

function drawText(ctx, text, x, y, max_width, line_height) {
  var lines = ctxWordWrap(ctx, text, max_width);

  if (line_height === undefined) {
    var mtext = ctx.measureText(lines[0]);
    line_height = mtext.actualBoundingBoxDescent + mtext.actualBoundingBoxAscent + 4;
  }

  lines.forEach(function (v, i) {
    ctx.fillText(v.trim(), x, y + i * line_height);
  });
  return lines;
}

function radialGradiant(ctx, x, y, c1, c2) {
  // it just works
  var _ctx$canvas = ctx.canvas,
      width = _ctx$canvas.width,
      height = _ctx$canvas.height;
  var r1 = width / 6,
      r2 = height * .75;
  var gradiant = ctx.createRadialGradient(x, y, Math.min(r1, r2), x, y, Math.max(width * .7, height * .7));
  gradiant.addColorStop(0, c1);
  gradiant.addColorStop(1, c2);
  return gradiant;
}
},{}],"js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLOR_SCHEMES = void 0;
var COLOR_SCHEMES = [// [
//   [primary, secondary, text=primary]
//   pattren_opacity, message_box
// ]
[["#6DAB7E", "#FAF9F9"], "11", 1], [["#AB6D7E", "#FAF9F9"], "11", 1], [["#7EAB6D", "#FAF9F9"], "11", 1], [["#6D7EAB", "#FAF9F9"], "11", 1], [["#47204c", "#A66364", "#c37b7c", "#FAF9F9dd"], "11"], [["#1a1128", "#e58a7a", "#B66364", "#FAF9F9bb"], "11"]];
exports.COLOR_SCHEMES = COLOR_SCHEMES;
},{}],"js/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCanvas = initCanvas;
exports.draw = draw;
exports.updateTheme = updateTheme;
exports.exportCanvas = exportCanvas;
exports.updateSVGColor = updateSVGColor;
exports.scheme = void 0;

var _utils = require("./utils");

var _config = require("./config");

var _ui = require("./ui");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var scheme = _config.COLOR_SCHEMES[0]; // selected color scheme

exports.scheme = scheme;
console.log(scheme);
var font_title = "Noto Kufi";
var title_bold = "bold";
var font_message = "Noto Naskh";
var message_bold = "";

function initCanvas() {
  _ui.ui.ctx = _ui.ui.canvas.getContext("2d");

  _ui.ui.canvas_wrapper.appendChild(_ui.ui.canvas);

  fitCanvas();
  window.onresize = fitCanvas;
  setTimeout(draw, 100, _ui.ui.ctx); // fix some font issues
}

function fitToCanvas(width, height) {
  var cwrapper_rect = _ui.ui.canvas_wrapper.getBoundingClientRect();

  var ratio = Math.min(cwrapper_rect.width / width, cwrapper_rect.height / height);
  return {
    width: width * ratio,
    height: height * ratio
  };
}

function fitCanvas() {
  var canvas_rect = _ui.ui.canvas.getBoundingClientRect();

  var cwrapper_rect = _ui.ui.canvas_wrapper.getBoundingClientRect();

  var _fitToCanvas = fitToCanvas(1920, 1080),
      width = _fitToCanvas.width,
      height = _fitToCanvas.height;

  _ui.ui.canvas.width = Math.max(width, 1920);
  _ui.ui.canvas.height = Math.max(height, 1080);
  draw(_ui.ui.ctx);
}

function updateSVGColor() {
  return _updateSVGColor.apply(this, arguments);
}

function _updateSVGColor() {
  _updateSVGColor = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var id, svg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = regeneratorRuntime.keys(_ui.ui.svgs);

          case 1:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 10;
              break;
            }

            id = _context.t1.value;
            svg = _ui.ui.svgs[id];
            svg.querySelector("path").setAttribute("fill", scheme[0][1] + (scheme[1] || "05"));
            _context.next = 7;
            return (0, _utils.SVGtoImage)(svg);

          case 7:
            _ui.ui.imgs[id] = _context.sent;
            _context.next = 1;
            break;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _updateSVGColor.apply(this, arguments);
}

function updateTheme() {
  return _updateTheme.apply(this, arguments);
}

function _updateTheme() {
  _updateTheme = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var c,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            c = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : scheme;
            exports.scheme = scheme = c;
            _context2.next = 4;
            return updateSVGColor();

          case 4:
            draw(_ui.ui.ctx);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _updateTheme.apply(this, arguments);
}

var rfs = function rfs(f, w) {
  return f / 1280 * w;
};

var aspect = function aspect(mw, mh, w, h) {
  var r = Math.min(mw / w, mh / h);
  return [w * r, h * r];
};

function draw(ctx, bg_aspect, ar) {
  var _ctx$canvas = ctx.canvas,
      width = _ctx$canvas.width,
      height = _ctx$canvas.height;
  var color = scheme[0];
  if (!color[2]) color[2] = color[0];
  font_title = _ui.ui.title_font.value;
  title_bold = _ui.ui.title_fontbold.checked ? "bold" : "";
  font_message = _ui.ui.message_font.value;
  message_bold = _ui.ui.message_fontbold.checked ? "bold" : "";
  ctx.fillStyle = color[0];
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = (0, _utils.radialGradiant)(ctx, width / 2, height / 2, color[1] + "1a", "transparent");
  ctx.fillRect(0, 0, width, height);

  if (_ui.ui.bgpatt.value == "arpatt") {
    ctx.drawImage.apply(ctx, [_ui.ui.imgs.arpatt, 0, 0].concat(_toConsumableArray(bg_aspect || [width, height])));
  } else {
    var img = _ui.ui.imgs[_ui.ui.bgpatt.value];

    var _aspect = aspect(80, 80, img.width, img.height),
        _aspect2 = _slicedToArray(_aspect, 2),
        _w = _aspect2[0],
        _h = _aspect2[1];

    var m = 6;

    for (var i = 0; i < width / (_w + m); i++) {
      for (var j = 0; j < height / _h; j++) {
        ctx.drawImage(img, i * (_w + m), j * (_h + m), _w, _h);
      }
    }
  }

  var _aspect3 = aspect(width * .7, height * .6, 2160, 1080),
      _aspect4 = _slicedToArray(_aspect3, 2),
      w = _aspect4[0],
      h = _aspect4[1];

  var x1 = (width - w) / 2,
      y1 = (height - h) / 2;
  var temp = _ui.ui.stemplate.value;
  _ui.ui.vpos.style.display = scheme[2] || temp == 2 ? "none" : "";

  if (temp == 2) {
    w = width * .45;
    h = height;
    x1 = 0;
    y1 = 0;
  }

  if (scheme[2] || temp == 2) {
    ctx.fillStyle = color[3] || color[1] + "cc";
    ctx.fillRect(x1, y1, w, h);
  }

  ctx.font = title_bold + " " + rfs(scheme[2] && temp != 2 ? 30 : 50, width) + "px " + font_title;
  ctx.fillStyle = color[2];
  ctx.textAlign = "center";
  var vchecked = document.querySelector("[name=\"logovpos\"]:checked");
  var vpos = vchecked && vchecked.id.replace("logo", "");
  var logom = _ui.ui.imgs.logo && scheme[2] && vpos == "top" ? 64 : 0;
  logom = logom / 1080 * height;
  ctx.fillText("كل عام وأنتم بخير", x1 + w / 2, height * .36 + logom);
  ctx.font = message_bold + " " + rfs(scheme[2] || temp == 2 ? 22 : 30, width) + "px " + font_message;
  var lines = (0, _utils.drawText)(ctx, _ui.ui.message_text.value, x1 + w / 2, height * .46 + (scheme[2] ? 0 : 15) + logom, w - (scheme[2] ? temp == 1 ? 200 : 150 : temp == 2 ? 150 : 0) - (message_bold ? 50 : 0));
  var margin = Math.min(lines.length * 25, 175) / 1920 * width;

  if (_ui.ui.imgs.logo) {
    var _aspect5 = aspect(128, 128, _ui.ui.imgs.logo.width, _ui.ui.imgs.logo.height),
        _aspect6 = _slicedToArray(_aspect5, 2),
        lw = _aspect6[0],
        lh = _aspect6[1];

    var x = 0,
        y = 0;

    if (scheme[2] || temp == 2) {
      x = x1 + (w - lw) / 2;
      y = (temp == 2 ? 64 : y1) + (vpos == "bottom" ? h / 2 + margin : 30);
    } else {
      var hchecked = document.querySelector("[name=\"logohpos\"]:checked");
      var hpos = hchecked && hchecked.id.replace("logo", "");
      x = hpos == "right" ? width - lw - 30 : hpos == "center" ? (width - lw) / 2 : 0;
      y = vpos == "bottom" ? height - lh - 30 : 0;
    }

    ctx.drawImage(_ui.ui.imgs.logo, 15 + x, 15 + y, lw, lh);
  } else {
    var _x = x1 + w / 2;

    var _y = height / 2 + margin;

    ctx.font = title_bold + " " + rfs(scheme[2] && temp != 2 ? 25 : 30, width) + "px " + font_title;
    ctx.fillText(_ui.ui.name.value, 15 + _x, 50 + _y + (scheme[2] ? 0 : 60));
  }
}

function exportCanvas(e) {
  var exportCanvas = document.createElement("canvas");
  var _ui$canvas = _ui.ui.canvas,
      width = _ui$canvas.width,
      height = _ui$canvas.height;
  var ratio = _ui.ui.aspect_ratio.value;
  var res = _ui.ui.resolution.value;
  exportCanvas.width = height * ratio * res;
  exportCanvas.height = height * res;
  draw(exportCanvas.getContext("2d"), [width * res, height * res], ratio);
  e.target.href = exportCanvas.toDataURL("image/png");
  e.target.download = Date.now().toString(16) + ".png";
}
},{"./utils":"js/utils.js","./config":"js/config.js","./ui":"js/ui.js"}],"../imgs/arpatt.svg":[function(require,module,exports) {
module.exports = "/arpatt.392deabe.svg";
},{}],"../imgs/candy.svg":[function(require,module,exports) {
module.exports = "/candy.3e0d0ae7.svg";
},{}],"../imgs/lights.svg":[function(require,module,exports) {
module.exports = "/lights.531d0d89.svg";
},{}],"js/assets.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAssets = loadAssets;
exports.FONTS = void 0;

var _arpatt = _interopRequireDefault(require("../../imgs/arpatt.svg"));

var _candy = _interopRequireDefault(require("../../imgs/candy.svg"));

var _lights = _interopRequireDefault(require("../../imgs/lights.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var IMGS = [_arpatt.default, _candy.default, _lights.default];
var FONTS = ["Noto Kufi", "Noto Naskh", "Cairo", "Amiri"];
exports.FONTS = FONTS;
var svgWrapper = document.createElement("div");
var imgs_loaded;

function loadAssets() {
  return _loadAssets.apply(this, arguments);
}

function _loadAssets() {
  _loadAssets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var imgs;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!imgs_loaded) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            if (document.readyState != "complete") window.addEventListener("load", loadAssets);
            _context2.prev = 3;
            imgs = IMGS.map( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(p) {
                var response, svg, svgs, el;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return fetch(p);

                      case 2:
                        response = _context.sent;

                        if (response.ok) {
                          _context.next = 5;
                          break;
                        }

                        throw new Error(response.statusMessage);

                      case 5:
                        _context.next = 7;
                        return response.text();

                      case 7:
                        svg = _context.sent;
                        svgWrapper.innerHTML += svg;
                        svgs = document.querySelectorAll("svg");
                        el = svgs[svgs.length - 1];
                        el.id = p.split(".")[0].replace("/", "");
                        imgs[el.id] = el;
                        return _context.abrupt("return", el);

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref.apply(this, arguments);
              };
            }());
            imgs_loaded = true;
            document.body.appendChild(svgWrapper);
            svgWrapper.style.display = "none";
            return _context2.abrupt("return", Promise.all(imgs));

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](3);
            console.error(_context2.t0.message || _context2.t0);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 11]]);
  }));
  return _loadAssets.apply(this, arguments);
}
},{"../../imgs/arpatt.svg":"../imgs/arpatt.svg","../../imgs/candy.svg":"../imgs/candy.svg","../../imgs/lights.svg":"../imgs/lights.svg"}],"js/ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUI = initUI;
exports.ui = void 0;

var _canvas = require("./canvas");

var _config = require("./config");

var _assets = require("./assets");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ui = {
  imgs: {}
};
exports.ui = ui;

function initUI() {
  var elems = document.querySelectorAll("[id]");

  for (var i = 0; i < elems.length; i++) {
    var e = elems[i]; // if(e.id.startsWith("data:")) {
    //   ui[e.id.replace("data:", "")]
    // }

    ui[e.id] = e;
  }

  ui.logo.onchange = onLogoChange; // TODO
  // ui.custom_color.onclick = toggleCustomThemeUI;

  ui.downloadCanvas.onclick = _canvas.exportCanvas;
  var span_cb = document.querySelectorAll("input[type=\"checkbox\"] + span, input[type=\"radio\"] + span");

  var _iterator = _createForOfIteratorHelper(span_cb),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var c = _step.value;
      c.addEventListener("click", toggleCheckboxes);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  ui.sidebar.onscroll = function () {
    return ui.nav.classList.toggle("shadow", ui.sidebar.scrollTop >= 5);
  };

  initNavigation();
  initFontList();
  initInputs();
  initColors();
}

function initNavigation() {
  var li = ui.nav.querySelectorAll("li"),
      active = ui.nav.querySelector("li.active"),
      activeTab = document.querySelector(".tab.active");

  var _loop = function _loop(i) {
    li[i].addEventListener("click", function (e) {
      if (e.target !== active) {
        // switch between tabs
        var tab = document.querySelectorAll(".tab")[i];

        if (tab) {
          e.target.classList.add("active");
          active.classList.remove("active");
          active = e.target;
          tab.classList.add("active");
          activeTab.classList.remove("active");
          activeTab = tab;
        }
      }
    });
  };

  for (var i = 0; i < li.length; i++) {
    _loop(i);
  }
}

function initFontList() {
  var fonts_list_select = document.querySelectorAll(".fonts_list");

  var _iterator2 = _createForOfIteratorHelper(_assets.FONTS),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var f = _step2.value;
      var op = new Option();
      op.textContent = f;

      var _iterator3 = _createForOfIteratorHelper(fonts_list_select),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var s = _step3.value;
          s.appendChild(op.cloneNode(true));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function initInputs() {
  var inputs = document.querySelectorAll("input:not([type='color']), textarea, select");

  var _iterator4 = _createForOfIteratorHelper(inputs),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var input = _step4.value;

      if (input.type == "checkbox" || input.type == "radio") {
        input.addEventListener("change", function (e) {
          return (0, _canvas.draw)(ui.ctx);
        });
      } else {
        input.addEventListener("input", function (e) {
          return (0, _canvas.draw)(ui.ctx);
        });
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
}

function toggleCheckboxes(e) {
  var c = e.target.previousElementSibling;
  if (c && c.type == "radio" && c.checked) return;
  c.checked = !c.checked;
  (0, _canvas.draw)(ui.ctx);
}

function toggleCustomThemeUI() {
  var opened = ui.custom_theme.style.display == "block";
  this.classList.toggle("opened", !opened);
  ui.custom_theme.style.display = opened ? "" : "block";
  ui.color1.value = _canvas.scheme[0][0];
  ui.color2.value = _canvas.scheme[0][1];
}

function addColor(c1, c2) {
  var div = document.createElement("div");
  div.innerHTML = "<span></span><span></span>";
  div.firstChild.style.background = c1;
  div.lastChild.style.background = c2;
  return div;
}

function initColors() {
  var _iterator5 = _createForOfIteratorHelper(_config.COLOR_SCHEMES),
      _step5;

  try {
    var _loop2 = function _loop2() {
      var c = _step5.value;
      var div = addColor.apply(void 0, _toConsumableArray(c[0]));
      ui.colors.insertBefore(div, ui.colors.firstElementChild);

      div.onclick = function (e) {
        return (0, _canvas.updateTheme)(c);
      };
    };

    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      _loop2();
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}

function onLogoChange() {
  var file = ui.logo.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    var img = new Image();
    img.src = reader.result;
    ui.imgs.logo = img;

    img.onload = function () {
      return (0, _canvas.draw)(ui.ctx);
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
},{"./canvas":"js/canvas.js","./config":"js/config.js","./assets":"js/assets.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

require("../style.css");

var _ui = require("./ui");

var _assets = require("./assets");

var _canvas = require("./canvas");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

{
  /* <link rel="stylesheet" href="style.css">
  <script src="js/utils.js"></script>
  <script src="js/config.js"></script>
  <script src="js/assets.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/canvas.js"></script> */
}

function init() {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var overlay, svg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            overlay = document.getElementById("overlay");
            _context.prev = 1;
            (0, _ui.initUI)();
            _context.next = 5;
            return (0, _assets.loadAssets)();

          case 5:
            _ui.ui.svgs = _context.sent.reduce(function (v, e) {
              return _objectSpread(_objectSpread({}, v), {}, _defineProperty({}, e.id, e));
            }, {});
            _context.t0 = regeneratorRuntime.keys(_ui.ui.svgs);

          case 7:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 14;
              break;
            }

            svg = _context.t1.value;
            _context.next = 11;
            return (0, _utils.SVGtoImage)(_ui.ui.svgs[svg]);

          case 11:
            _ui.ui.imgs[svg] = _context.sent;
            _context.next = 7;
            break;

          case 14:
            console.log(_ui.ui.imgs);
            (0, _canvas.updateTheme)();
            (0, _canvas.initCanvas)();
            setTimeout(function () {
              return overlay.style.display = "none";
            }, 100);
            _context.next = 24;
            break;

          case 20:
            _context.prev = 20;
            _context.t2 = _context["catch"](1);
            overlay.firstElementChild.textContent = "حدث خطأ ما 😢";
            console.error(_context.t2);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 20]]);
  }));
  return _init.apply(this, arguments);
}

window.addEventListener("load", init);
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","../style.css":"style.css","./ui":"js/ui.js","./assets":"js/assets.js","./canvas":"js/canvas.js","./utils":"js/utils.js"}],"../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40445" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map