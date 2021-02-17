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
})({"index.js":[function(require,module,exports) {
window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var animation;
  var fireArr = [];
  var fragments = []; //animate();
  ////初始化烟花数：5

  for (var i = 0; i < 5; i++) {
    fireArr.push(createRandomFire(CreateFireObj));
  }

  if (fireArr.length) {
    animate();
  }

  function CreateFireObj(x, y, color, offsetValueX, offsetValueY) {
    this.fragArr = [];
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.vx = 2;
    this.vy = 2;
    this.radius = 4;
    this.color = color;
    this.angel = 180;
    this.offsetValueX = offsetValueX;
    this.offsetValueY = offsetValueY;
    this.disappear = false;
    this.boomJudge = true;

    this.draw = function () {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true), ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    this.move = function () {
      this.x += this.vx + this.offsetValueX;
      this.y -= this.vy + this.offsetValueY;
    }; //烟花爆炸，产生碎片


    this.boom = function () {
      var scope = Math.round(getRandom(10, 40)); //var scope = 1;

      for (var i = 0; i < scope; i++) {
        var angel = getRandom(0, 2 * Math.PI);
        var range = Math.round(getRandom(50, 300));
        var targetX = this.x + range * Math.cos(angel);
        var targetY = this.y + range * Math.sin(angel);
        var r = Math.round(getRandom(120, 255));
        var g = Math.round(getRandom(120, 255));
        var b = Math.round(getRandom(120, 255));
        var color = "rgb(" + r + "," + g + "," + b + ")";
        var frag = new CreateFrag(this.x, this.y, color, targetX, targetY);
        this.fragArr.push(frag);
      }
    };
  }

  function CreateFrag(x, y, color, tx, ty) {
    var that = this;
    that.x = x;
    that.y = y;
    that.ty = ty;
    that.tx = tx;
    that.color = color;
    that.disappear = false;

    that.draw = function () {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = that.color;
      ctx.fillRect(that.x, that.y, 2, 2);
      ctx.restore();
    };

    that.move = function () {
      that.ty = that.ty + 0.5;
      var dx = that.tx - that.x,
          dy = that.ty - that.y;
      that.x = Math.abs(dx) < 0.1 ? that.tx : that.x + dx * 0.01;
      that.y = Math.abs(dy) < 0.1 ? that.ty : that.y + dy * 0.01;

      if (dx == 0 || dy == 0 || that.y >= 700 || that.x <= 300 || that.x >= 1700) {
        that.fragDisappear = true;
      }
    };
  }

  function createRandomFire(func) {
    var r = Math.round(getRandom(200, 255));
    var g = Math.round(getRandom(200, 255));
    var b = Math.round(getRandom(0, 255));
    var color = "rgb(" + r + "," + g + "," + b + ")";
    var fire = new func(960 + getRandom(-300, 300), 800, color, getRandom(-5, 5), getRandom(0, 3));
    return fire;
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)"; //产生拖尾效果

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (fireArr.length) {
      fireArr.forEach(function (item, index) {
        var marginWidthLeft = parseInt(getRandom(0, canvas.width / 5), 10);
        var marginWidthRight = parseInt(getRandom(1500, canvas.width), 10);
        var marginHeight = parseInt(getRandom(0, 300), 10);

        if (item.x >= marginWidthRight || item.x <= marginWidthLeft || item.y <= marginHeight) {
          item.disappear = true;
        }

        if (!item.disappear) {
          item.draw();
          item.move();
        } else {
          var removeFire = fireArr.splice(index, 1);
          fragments.push(removeFire);

          if (fragments.length) {
            fragments.forEach(function (item, index) {
              if (item[0].boomJudge) {
                item[0].boom();
                item[0].boomJudge = false;
              }
            });
          }

          fireArr.push(createRandomFire(CreateFireObj));
        }
      });
    }

    if (fragments.length) {
      fragments.forEach(function (item1, index1) {
        item1[0].fragArr.forEach(function (item2, index2) {
          if (item2.fragDisappear) {
            fragments.splice(index1, 1);
          }

          item2.draw();
          item2.move();
        });
      });
    }

    animation = window.requestAnimationFrame(animate);
  }

  function getRandom(a, b) {
    return Math.random() * (b - a) + a;
  }
};

function move() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fire.draw();
  fire.x = fire.trackRadius * Math.cos(Math.PI / 180 * fire.angel) + fire.trackRadius + 960;
  fire.y = fire.trackRadius * Math.sin(Math.PI / 180 * fire.angel) + 700;
  fire.angel += 2;
}

var button = document.getElementById("animationTest");
button.addEventListener("click", function () {
  new CreateFireObj(960, 700, "blue", 100, Math.random() * 3, Math.random() * 3).animate();
});
},{}],"C:/Users/王俊然/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53211" + '/');

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
},{}]},{},["C:/Users/王俊然/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/canvas-firework.e31bb0bc.js.map