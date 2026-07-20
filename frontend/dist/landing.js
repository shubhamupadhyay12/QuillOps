var My = Object.defineProperty;
var Ry = (n, r, s) => r in n ? My(n, r, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[r] = s;
var Zn = (n, r, s) => Ry(n, typeof r != "symbol" ? r + "" : r, s);
var ql = { exports: {} }, Hi = {}, Ol = { exports: {} }, ve = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gf;
function Ly() {
  if (Gf) return ve;
  Gf = 1;
  var n = Symbol.for("react.element"), r = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), f = Symbol.for("react.provider"), h = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), x = Symbol.iterator;
  function S(T) {
    return T === null || typeof T != "object" ? null : (T = x && T[x] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var E = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C = Object.assign, R = {};
  function _(T, I, ce) {
    this.props = T, this.context = I, this.refs = R, this.updater = ce || E;
  }
  _.prototype.isReactComponent = {}, _.prototype.setState = function(T, I) {
    if (typeof T != "object" && typeof T != "function" && T != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, T, I, "setState");
  }, _.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function L() {
  }
  L.prototype = _.prototype;
  function D(T, I, ce) {
    this.props = T, this.context = I, this.refs = R, this.updater = ce || E;
  }
  var V = D.prototype = new L();
  V.constructor = D, C(V, _.prototype), V.isPureReactComponent = !0;
  var Q = Array.isArray, K = Object.prototype.hasOwnProperty, J = { current: null }, U = { key: !0, ref: !0, __self: !0, __source: !0 };
  function $(T, I, ce) {
    var pe, ge = {}, xe = null, je = null;
    if (I != null) for (pe in I.ref !== void 0 && (je = I.ref), I.key !== void 0 && (xe = "" + I.key), I) K.call(I, pe) && !U.hasOwnProperty(pe) && (ge[pe] = I[pe]);
    var ye = arguments.length - 2;
    if (ye === 1) ge.children = ce;
    else if (1 < ye) {
      for (var ke = Array(ye), Qe = 0; Qe < ye; Qe++) ke[Qe] = arguments[Qe + 2];
      ge.children = ke;
    }
    if (T && T.defaultProps) for (pe in ye = T.defaultProps, ye) ge[pe] === void 0 && (ge[pe] = ye[pe]);
    return { $$typeof: n, type: T, key: xe, ref: je, props: ge, _owner: J.current };
  }
  function he(T, I) {
    return { $$typeof: n, type: T.type, key: I, ref: T.ref, props: T.props, _owner: T._owner };
  }
  function oe(T) {
    return typeof T == "object" && T !== null && T.$$typeof === n;
  }
  function Ie(T) {
    var I = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function(ce) {
      return I[ce];
    });
  }
  var Ge = /\/+/g;
  function Te(T, I) {
    return typeof T == "object" && T !== null && T.key != null ? Ie("" + T.key) : I.toString(36);
  }
  function Ue(T, I, ce, pe, ge) {
    var xe = typeof T;
    (xe === "undefined" || xe === "boolean") && (T = null);
    var je = !1;
    if (T === null) je = !0;
    else switch (xe) {
      case "string":
      case "number":
        je = !0;
        break;
      case "object":
        switch (T.$$typeof) {
          case n:
          case r:
            je = !0;
        }
    }
    if (je) return je = T, ge = ge(je), T = pe === "" ? "." + Te(je, 0) : pe, Q(ge) ? (ce = "", T != null && (ce = T.replace(Ge, "$&/") + "/"), Ue(ge, I, ce, "", function(Qe) {
      return Qe;
    })) : ge != null && (oe(ge) && (ge = he(ge, ce + (!ge.key || je && je.key === ge.key ? "" : ("" + ge.key).replace(Ge, "$&/") + "/") + T)), I.push(ge)), 1;
    if (je = 0, pe = pe === "" ? "." : pe + ":", Q(T)) for (var ye = 0; ye < T.length; ye++) {
      xe = T[ye];
      var ke = pe + Te(xe, ye);
      je += Ue(xe, I, ce, ke, ge);
    }
    else if (ke = S(T), typeof ke == "function") for (T = ke.call(T), ye = 0; !(xe = T.next()).done; ) xe = xe.value, ke = pe + Te(xe, ye++), je += Ue(xe, I, ce, ke, ge);
    else if (xe === "object") throw I = String(T), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
    return je;
  }
  function Je(T, I, ce) {
    if (T == null) return T;
    var pe = [], ge = 0;
    return Ue(T, pe, "", "", function(xe) {
      return I.call(ce, xe, ge++);
    }), pe;
  }
  function Ae(T) {
    if (T._status === -1) {
      var I = T._result;
      I = I(), I.then(function(ce) {
        (T._status === 0 || T._status === -1) && (T._status = 1, T._result = ce);
      }, function(ce) {
        (T._status === 0 || T._status === -1) && (T._status = 2, T._result = ce);
      }), T._status === -1 && (T._status = 0, T._result = I);
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var re = { current: null }, B = { transition: null }, te = { ReactCurrentDispatcher: re, ReactCurrentBatchConfig: B, ReactCurrentOwner: J };
  function W() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ve.Children = { map: Je, forEach: function(T, I, ce) {
    Je(T, function() {
      I.apply(this, arguments);
    }, ce);
  }, count: function(T) {
    var I = 0;
    return Je(T, function() {
      I++;
    }), I;
  }, toArray: function(T) {
    return Je(T, function(I) {
      return I;
    }) || [];
  }, only: function(T) {
    if (!oe(T)) throw Error("React.Children.only expected to receive a single React element child.");
    return T;
  } }, ve.Component = _, ve.Fragment = s, ve.Profiler = c, ve.PureComponent = D, ve.StrictMode = l, ve.Suspense = g, ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te, ve.act = W, ve.cloneElement = function(T, I, ce) {
    if (T == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
    var pe = C({}, T.props), ge = T.key, xe = T.ref, je = T._owner;
    if (I != null) {
      if (I.ref !== void 0 && (xe = I.ref, je = J.current), I.key !== void 0 && (ge = "" + I.key), T.type && T.type.defaultProps) var ye = T.type.defaultProps;
      for (ke in I) K.call(I, ke) && !U.hasOwnProperty(ke) && (pe[ke] = I[ke] === void 0 && ye !== void 0 ? ye[ke] : I[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) pe.children = ce;
    else if (1 < ke) {
      ye = Array(ke);
      for (var Qe = 0; Qe < ke; Qe++) ye[Qe] = arguments[Qe + 2];
      pe.children = ye;
    }
    return { $$typeof: n, type: T.type, key: ge, ref: xe, props: pe, _owner: je };
  }, ve.createContext = function(T) {
    return T = { $$typeof: h, _currentValue: T, _currentValue2: T, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, T.Provider = { $$typeof: f, _context: T }, T.Consumer = T;
  }, ve.createElement = $, ve.createFactory = function(T) {
    var I = $.bind(null, T);
    return I.type = T, I;
  }, ve.createRef = function() {
    return { current: null };
  }, ve.forwardRef = function(T) {
    return { $$typeof: m, render: T };
  }, ve.isValidElement = oe, ve.lazy = function(T) {
    return { $$typeof: y, _payload: { _status: -1, _result: T }, _init: Ae };
  }, ve.memo = function(T, I) {
    return { $$typeof: p, type: T, compare: I === void 0 ? null : I };
  }, ve.startTransition = function(T) {
    var I = B.transition;
    B.transition = {};
    try {
      T();
    } finally {
      B.transition = I;
    }
  }, ve.unstable_act = W, ve.useCallback = function(T, I) {
    return re.current.useCallback(T, I);
  }, ve.useContext = function(T) {
    return re.current.useContext(T);
  }, ve.useDebugValue = function() {
  }, ve.useDeferredValue = function(T) {
    return re.current.useDeferredValue(T);
  }, ve.useEffect = function(T, I) {
    return re.current.useEffect(T, I);
  }, ve.useId = function() {
    return re.current.useId();
  }, ve.useImperativeHandle = function(T, I, ce) {
    return re.current.useImperativeHandle(T, I, ce);
  }, ve.useInsertionEffect = function(T, I) {
    return re.current.useInsertionEffect(T, I);
  }, ve.useLayoutEffect = function(T, I) {
    return re.current.useLayoutEffect(T, I);
  }, ve.useMemo = function(T, I) {
    return re.current.useMemo(T, I);
  }, ve.useReducer = function(T, I, ce) {
    return re.current.useReducer(T, I, ce);
  }, ve.useRef = function(T) {
    return re.current.useRef(T);
  }, ve.useState = function(T) {
    return re.current.useState(T);
  }, ve.useSyncExternalStore = function(T, I, ce) {
    return re.current.useSyncExternalStore(T, I, ce);
  }, ve.useTransition = function() {
    return re.current.useTransition();
  }, ve.version = "18.3.1", ve;
}
var Qf;
function ku() {
  return Qf || (Qf = 1, Ol.exports = Ly()), Ol.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yf;
function by() {
  if (Yf) return Hi;
  Yf = 1;
  var n = ku(), r = Symbol.for("react.element"), s = Symbol.for("react.fragment"), l = Object.prototype.hasOwnProperty, c = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, f = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(m, g, p) {
    var y, x = {}, S = null, E = null;
    p !== void 0 && (S = "" + p), g.key !== void 0 && (S = "" + g.key), g.ref !== void 0 && (E = g.ref);
    for (y in g) l.call(g, y) && !f.hasOwnProperty(y) && (x[y] = g[y]);
    if (m && m.defaultProps) for (y in g = m.defaultProps, g) x[y] === void 0 && (x[y] = g[y]);
    return { $$typeof: r, type: m, key: S, ref: E, props: x, _owner: c.current };
  }
  return Hi.Fragment = s, Hi.jsx = h, Hi.jsxs = h, Hi;
}
var Xf;
function _y() {
  return Xf || (Xf = 1, ql.exports = by()), ql.exports;
}
var a = _y(), Co = {}, Fl = { exports: {} }, Pt = {}, Bl = { exports: {} }, zl = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zf;
function Dy() {
  return Zf || (Zf = 1, (function(n) {
    function r(B, te) {
      var W = B.length;
      B.push(te);
      e: for (; 0 < W; ) {
        var T = W - 1 >>> 1, I = B[T];
        if (0 < c(I, te)) B[T] = te, B[W] = I, W = T;
        else break e;
      }
    }
    function s(B) {
      return B.length === 0 ? null : B[0];
    }
    function l(B) {
      if (B.length === 0) return null;
      var te = B[0], W = B.pop();
      if (W !== te) {
        B[0] = W;
        e: for (var T = 0, I = B.length, ce = I >>> 1; T < ce; ) {
          var pe = 2 * (T + 1) - 1, ge = B[pe], xe = pe + 1, je = B[xe];
          if (0 > c(ge, W)) xe < I && 0 > c(je, ge) ? (B[T] = je, B[xe] = W, T = xe) : (B[T] = ge, B[pe] = W, T = pe);
          else if (xe < I && 0 > c(je, W)) B[T] = je, B[xe] = W, T = xe;
          else break e;
        }
      }
      return te;
    }
    function c(B, te) {
      var W = B.sortIndex - te.sortIndex;
      return W !== 0 ? W : B.id - te.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      n.unstable_now = function() {
        return f.now();
      };
    } else {
      var h = Date, m = h.now();
      n.unstable_now = function() {
        return h.now() - m;
      };
    }
    var g = [], p = [], y = 1, x = null, S = 3, E = !1, C = !1, R = !1, _ = typeof setTimeout == "function" ? setTimeout : null, L = typeof clearTimeout == "function" ? clearTimeout : null, D = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function V(B) {
      for (var te = s(p); te !== null; ) {
        if (te.callback === null) l(p);
        else if (te.startTime <= B) l(p), te.sortIndex = te.expirationTime, r(g, te);
        else break;
        te = s(p);
      }
    }
    function Q(B) {
      if (R = !1, V(B), !C) if (s(g) !== null) C = !0, Ae(K);
      else {
        var te = s(p);
        te !== null && re(Q, te.startTime - B);
      }
    }
    function K(B, te) {
      C = !1, R && (R = !1, L($), $ = -1), E = !0;
      var W = S;
      try {
        for (V(te), x = s(g); x !== null && (!(x.expirationTime > te) || B && !Ie()); ) {
          var T = x.callback;
          if (typeof T == "function") {
            x.callback = null, S = x.priorityLevel;
            var I = T(x.expirationTime <= te);
            te = n.unstable_now(), typeof I == "function" ? x.callback = I : x === s(g) && l(g), V(te);
          } else l(g);
          x = s(g);
        }
        if (x !== null) var ce = !0;
        else {
          var pe = s(p);
          pe !== null && re(Q, pe.startTime - te), ce = !1;
        }
        return ce;
      } finally {
        x = null, S = W, E = !1;
      }
    }
    var J = !1, U = null, $ = -1, he = 5, oe = -1;
    function Ie() {
      return !(n.unstable_now() - oe < he);
    }
    function Ge() {
      if (U !== null) {
        var B = n.unstable_now();
        oe = B;
        var te = !0;
        try {
          te = U(!0, B);
        } finally {
          te ? Te() : (J = !1, U = null);
        }
      } else J = !1;
    }
    var Te;
    if (typeof D == "function") Te = function() {
      D(Ge);
    };
    else if (typeof MessageChannel < "u") {
      var Ue = new MessageChannel(), Je = Ue.port2;
      Ue.port1.onmessage = Ge, Te = function() {
        Je.postMessage(null);
      };
    } else Te = function() {
      _(Ge, 0);
    };
    function Ae(B) {
      U = B, J || (J = !0, Te());
    }
    function re(B, te) {
      $ = _(function() {
        B(n.unstable_now());
      }, te);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(B) {
      B.callback = null;
    }, n.unstable_continueExecution = function() {
      C || E || (C = !0, Ae(K));
    }, n.unstable_forceFrameRate = function(B) {
      0 > B || 125 < B ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : he = 0 < B ? Math.floor(1e3 / B) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, n.unstable_getFirstCallbackNode = function() {
      return s(g);
    }, n.unstable_next = function(B) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var te = 3;
          break;
        default:
          te = S;
      }
      var W = S;
      S = te;
      try {
        return B();
      } finally {
        S = W;
      }
    }, n.unstable_pauseExecution = function() {
    }, n.unstable_requestPaint = function() {
    }, n.unstable_runWithPriority = function(B, te) {
      switch (B) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          B = 3;
      }
      var W = S;
      S = B;
      try {
        return te();
      } finally {
        S = W;
      }
    }, n.unstable_scheduleCallback = function(B, te, W) {
      var T = n.unstable_now();
      switch (typeof W == "object" && W !== null ? (W = W.delay, W = typeof W == "number" && 0 < W ? T + W : T) : W = T, B) {
        case 1:
          var I = -1;
          break;
        case 2:
          I = 250;
          break;
        case 5:
          I = 1073741823;
          break;
        case 4:
          I = 1e4;
          break;
        default:
          I = 5e3;
      }
      return I = W + I, B = { id: y++, callback: te, priorityLevel: B, startTime: W, expirationTime: I, sortIndex: -1 }, W > T ? (B.sortIndex = W, r(p, B), s(g) === null && B === s(p) && (R ? (L($), $ = -1) : R = !0, re(Q, W - T))) : (B.sortIndex = I, r(g, B), C || E || (C = !0, Ae(K))), B;
    }, n.unstable_shouldYield = Ie, n.unstable_wrapCallback = function(B) {
      var te = S;
      return function() {
        var W = S;
        S = te;
        try {
          return B.apply(this, arguments);
        } finally {
          S = W;
        }
      };
    };
  })(zl)), zl;
}
var Jf;
function Iy() {
  return Jf || (Jf = 1, Bl.exports = Dy()), Bl.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eh;
function Vy() {
  if (eh) return Pt;
  eh = 1;
  var n = ku(), r = Iy();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, i = 1; i < arguments.length; i++) t += "&args[]=" + encodeURIComponent(arguments[i]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var l = /* @__PURE__ */ new Set(), c = {};
  function f(e, t) {
    h(e, t), h(e + "Capture", t);
  }
  function h(e, t) {
    for (c[e] = t, e = 0; e < t.length; e++) l.add(t[e]);
  }
  var m = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), g = Object.prototype.hasOwnProperty, p = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, y = {}, x = {};
  function S(e) {
    return g.call(x, e) ? !0 : g.call(y, e) ? !1 : p.test(e) ? x[e] = !0 : (y[e] = !0, !1);
  }
  function E(e, t, i, o) {
    if (i !== null && i.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : i !== null ? !i.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function C(e, t, i, o) {
    if (t === null || typeof t > "u" || E(e, t, i, o)) return !0;
    if (o) return !1;
    if (i !== null) switch (i.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function R(e, t, i, o, u, d, v) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = o, this.attributeNamespace = u, this.mustUseProperty = i, this.propertyName = e, this.type = t, this.sanitizeURL = d, this.removeEmptyString = v;
  }
  var _ = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    _[e] = new R(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    _[t] = new R(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    _[e] = new R(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    _[e] = new R(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    _[e] = new R(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    _[e] = new R(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    _[e] = new R(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    _[e] = new R(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    _[e] = new R(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var L = /[\-:]([a-z])/g;
  function D(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      L,
      D
    );
    _[t] = new R(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(L, D);
    _[t] = new R(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(L, D);
    _[t] = new R(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    _[e] = new R(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), _.xlinkHref = new R("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    _[e] = new R(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function V(e, t, i, o) {
    var u = _.hasOwnProperty(t) ? _[t] : null;
    (u !== null ? u.type !== 0 : o || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (C(t, i, u, o) && (i = null), o || u === null ? S(t) && (i === null ? e.removeAttribute(t) : e.setAttribute(t, "" + i)) : u.mustUseProperty ? e[u.propertyName] = i === null ? u.type === 3 ? !1 : "" : i : (t = u.attributeName, o = u.attributeNamespace, i === null ? e.removeAttribute(t) : (u = u.type, i = u === 3 || u === 4 && i === !0 ? "" : "" + i, o ? e.setAttributeNS(o, t, i) : e.setAttribute(t, i))));
  }
  var Q = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, K = Symbol.for("react.element"), J = Symbol.for("react.portal"), U = Symbol.for("react.fragment"), $ = Symbol.for("react.strict_mode"), he = Symbol.for("react.profiler"), oe = Symbol.for("react.provider"), Ie = Symbol.for("react.context"), Ge = Symbol.for("react.forward_ref"), Te = Symbol.for("react.suspense"), Ue = Symbol.for("react.suspense_list"), Je = Symbol.for("react.memo"), Ae = Symbol.for("react.lazy"), re = Symbol.for("react.offscreen"), B = Symbol.iterator;
  function te(e) {
    return e === null || typeof e != "object" ? null : (e = B && e[B] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var W = Object.assign, T;
  function I(e) {
    if (T === void 0) try {
      throw Error();
    } catch (i) {
      var t = i.stack.trim().match(/\n( *(at )?)/);
      T = t && t[1] || "";
    }
    return `
` + T + e;
  }
  var ce = !1;
  function pe(e, t) {
    if (!e || ce) return "";
    ce = !0;
    var i = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (M) {
          var o = M;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (M) {
          o = M;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (M) {
          o = M;
        }
        e();
      }
    } catch (M) {
      if (M && o && typeof M.stack == "string") {
        for (var u = M.stack.split(`
`), d = o.stack.split(`
`), v = u.length - 1, w = d.length - 1; 1 <= v && 0 <= w && u[v] !== d[w]; ) w--;
        for (; 1 <= v && 0 <= w; v--, w--) if (u[v] !== d[w]) {
          if (v !== 1 || w !== 1)
            do
              if (v--, w--, 0 > w || u[v] !== d[w]) {
                var j = `
` + u[v].replace(" at new ", " at ");
                return e.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", e.displayName)), j;
              }
            while (1 <= v && 0 <= w);
          break;
        }
      }
    } finally {
      ce = !1, Error.prepareStackTrace = i;
    }
    return (e = e ? e.displayName || e.name : "") ? I(e) : "";
  }
  function ge(e) {
    switch (e.tag) {
      case 5:
        return I(e.type);
      case 16:
        return I("Lazy");
      case 13:
        return I("Suspense");
      case 19:
        return I("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = pe(e.type, !1), e;
      case 11:
        return e = pe(e.type.render, !1), e;
      case 1:
        return e = pe(e.type, !0), e;
      default:
        return "";
    }
  }
  function xe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case U:
        return "Fragment";
      case J:
        return "Portal";
      case he:
        return "Profiler";
      case $:
        return "StrictMode";
      case Te:
        return "Suspense";
      case Ue:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ie:
        return (e.displayName || "Context") + ".Consumer";
      case oe:
        return (e._context.displayName || "Context") + ".Provider";
      case Ge:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Je:
        return t = e.displayName || null, t !== null ? t : xe(e.type) || "Memo";
      case Ae:
        t = e._payload, e = e._init;
        try {
          return xe(e(t));
        } catch {
        }
    }
    return null;
  }
  function je(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return xe(t);
      case 8:
        return t === $ ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function ye(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ke(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Qe(e) {
    var t = ke(e) ? "checked" : "value", i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), o = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var u = i.get, d = i.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return u.call(this);
      }, set: function(v) {
        o = "" + v, d.call(this, v);
      } }), Object.defineProperty(e, t, { enumerable: i.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(v) {
        o = "" + v;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function pn(e) {
    e._valueTracker || (e._valueTracker = Qe(e));
  }
  function _t(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var i = t.getValue(), o = "";
    return e && (o = ke(e) ? e.checked ? "true" : "false" : e.value), e = o, e !== i ? (t.setValue(e), !0) : !1;
  }
  function H(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function de(e, t) {
    var i = t.checked;
    return W({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: i ?? e._wrapperState.initialChecked });
  }
  function le(e, t) {
    var i = t.defaultValue == null ? "" : t.defaultValue, o = t.checked != null ? t.checked : t.defaultChecked;
    i = ye(t.value != null ? t.value : i), e._wrapperState = { initialChecked: o, initialValue: i, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ve(e, t) {
    t = t.checked, t != null && V(e, "checked", t, !1);
  }
  function Ce(e, t) {
    Ve(e, t);
    var i = ye(t.value), o = t.type;
    if (i != null) o === "number" ? (i === 0 && e.value === "" || e.value != i) && (e.value = "" + i) : e.value !== "" + i && (e.value = "" + i);
    else if (o === "submit" || o === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? rt(e, t.type, i) : t.hasOwnProperty("defaultValue") && rt(e, t.type, ye(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function St(e, t, i) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var o = t.type;
      if (!(o !== "submit" && o !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, i || t === e.value || (e.value = t), e.defaultValue = t;
    }
    i = e.name, i !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, i !== "" && (e.name = i);
  }
  function rt(e, t, i) {
    (t !== "number" || H(e.ownerDocument) !== e) && (i == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + i && (e.defaultValue = "" + i));
  }
  var Dt = Array.isArray;
  function rn(e, t, i, o) {
    if (e = e.options, t) {
      t = {};
      for (var u = 0; u < i.length; u++) t["$" + i[u]] = !0;
      for (i = 0; i < e.length; i++) u = t.hasOwnProperty("$" + e[i].value), e[i].selected !== u && (e[i].selected = u), u && o && (e[i].defaultSelected = !0);
    } else {
      for (i = "" + ye(i), t = null, u = 0; u < e.length; u++) {
        if (e[u].value === i) {
          e[u].selected = !0, o && (e[u].defaultSelected = !0);
          return;
        }
        t !== null || e[u].disabled || (t = e[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function mn(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return W({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function ut(e, t) {
    var i = t.value;
    if (i == null) {
      if (i = t.children, t = t.defaultValue, i != null) {
        if (t != null) throw Error(s(92));
        if (Dt(i)) {
          if (1 < i.length) throw Error(s(93));
          i = i[0];
        }
        t = i;
      }
      t == null && (t = ""), i = t;
    }
    e._wrapperState = { initialValue: ye(i) };
  }
  function vt(e, t) {
    var i = ye(t.value), o = ye(t.defaultValue);
    i != null && (i = "" + i, i !== e.value && (e.value = i), t.defaultValue == null && e.defaultValue !== i && (e.defaultValue = i)), o != null && (e.defaultValue = "" + o);
  }
  function rr(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function it(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Wt(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? it(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var sn, gn = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, i, o, u) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, i, o, u);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (sn = sn || document.createElement("div"), sn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = sn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Ln(e, t) {
    if (t) {
      var i = e.firstChild;
      if (i && i === e.lastChild && i.nodeType === 3) {
        i.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var ir = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, ms = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ir).forEach(function(e) {
    ms.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), ir[t] = ir[e];
    });
  });
  function ai(e, t, i) {
    return t == null || typeof t == "boolean" || t === "" ? "" : i || typeof t != "number" || t === 0 || ir.hasOwnProperty(e) && ir[e] ? ("" + t).trim() : t + "px";
  }
  function li(e, t) {
    e = e.style;
    for (var i in t) if (t.hasOwnProperty(i)) {
      var o = i.indexOf("--") === 0, u = ai(i, t[i], o);
      i === "float" && (i = "cssFloat"), o ? e.setProperty(i, u) : e[i] = u;
    }
  }
  var gs = W({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function b(e, t) {
    if (t) {
      if (gs[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function ue(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var be = null;
  function _e(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ct = null, me = null, qe = null;
  function Pe(e) {
    if (e = Ri(e)) {
      if (typeof ct != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = Os(t), ct(e.stateNode, e.type, t));
    }
  }
  function yt(e) {
    me ? qe ? qe.push(e) : qe = [e] : me = e;
  }
  function Ht() {
    if (me) {
      var e = me, t = qe;
      if (qe = me = null, Pe(e), t) for (e = 0; e < t.length; e++) Pe(t[e]);
    }
  }
  function ui(e, t) {
    return e(t);
  }
  function pc() {
  }
  var ta = !1;
  function mc(e, t, i) {
    if (ta) return e(t, i);
    ta = !0;
    try {
      return ui(e, t, i);
    } finally {
      ta = !1, (me !== null || qe !== null) && (pc(), Ht());
    }
  }
  function ci(e, t) {
    var i = e.stateNode;
    if (i === null) return null;
    var o = Os(i);
    if (o === null) return null;
    i = o[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (e = e.type, o = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !o;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (i && typeof i != "function") throw Error(s(231, t, typeof i));
    return i;
  }
  var na = !1;
  if (m) try {
    var di = {};
    Object.defineProperty(di, "passive", { get: function() {
      na = !0;
    } }), window.addEventListener("test", di, di), window.removeEventListener("test", di, di);
  } catch {
    na = !1;
  }
  function Ig(e, t, i, o, u, d, v, w, j) {
    var M = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(i, M);
    } catch (O) {
      this.onError(O);
    }
  }
  var fi = !1, vs = null, ys = !1, ra = null, Vg = { onError: function(e) {
    fi = !0, vs = e;
  } };
  function qg(e, t, i, o, u, d, v, w, j) {
    fi = !1, vs = null, Ig.apply(Vg, arguments);
  }
  function Og(e, t, i, o, u, d, v, w, j) {
    if (qg.apply(this, arguments), fi) {
      if (fi) {
        var M = vs;
        fi = !1, vs = null;
      } else throw Error(s(198));
      ys || (ys = !0, ra = M);
    }
  }
  function sr(e) {
    var t = e, i = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (i = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? i : null;
  }
  function gc(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function vc(e) {
    if (sr(e) !== e) throw Error(s(188));
  }
  function Fg(e) {
    var t = e.alternate;
    if (!t) {
      if (t = sr(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var i = e, o = t; ; ) {
      var u = i.return;
      if (u === null) break;
      var d = u.alternate;
      if (d === null) {
        if (o = u.return, o !== null) {
          i = o;
          continue;
        }
        break;
      }
      if (u.child === d.child) {
        for (d = u.child; d; ) {
          if (d === i) return vc(u), e;
          if (d === o) return vc(u), t;
          d = d.sibling;
        }
        throw Error(s(188));
      }
      if (i.return !== o.return) i = u, o = d;
      else {
        for (var v = !1, w = u.child; w; ) {
          if (w === i) {
            v = !0, i = u, o = d;
            break;
          }
          if (w === o) {
            v = !0, o = u, i = d;
            break;
          }
          w = w.sibling;
        }
        if (!v) {
          for (w = d.child; w; ) {
            if (w === i) {
              v = !0, i = d, o = u;
              break;
            }
            if (w === o) {
              v = !0, o = d, i = u;
              break;
            }
            w = w.sibling;
          }
          if (!v) throw Error(s(189));
        }
      }
      if (i.alternate !== o) throw Error(s(190));
    }
    if (i.tag !== 3) throw Error(s(188));
    return i.stateNode.current === i ? e : t;
  }
  function yc(e) {
    return e = Fg(e), e !== null ? xc(e) : null;
  }
  function xc(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = xc(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var wc = r.unstable_scheduleCallback, Sc = r.unstable_cancelCallback, Bg = r.unstable_shouldYield, zg = r.unstable_requestPaint, We = r.unstable_now, $g = r.unstable_getCurrentPriorityLevel, ia = r.unstable_ImmediatePriority, jc = r.unstable_UserBlockingPriority, xs = r.unstable_NormalPriority, Ug = r.unstable_LowPriority, kc = r.unstable_IdlePriority, ws = null, on = null;
  function Wg(e) {
    if (on && typeof on.onCommitFiberRoot == "function") try {
      on.onCommitFiberRoot(ws, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Kt = Math.clz32 ? Math.clz32 : Gg, Hg = Math.log, Kg = Math.LN2;
  function Gg(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Hg(e) / Kg | 0) | 0;
  }
  var Ss = 64, js = 4194304;
  function hi(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function ks(e, t) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var o = 0, u = e.suspendedLanes, d = e.pingedLanes, v = i & 268435455;
    if (v !== 0) {
      var w = v & ~u;
      w !== 0 ? o = hi(w) : (d &= v, d !== 0 && (o = hi(d)));
    } else v = i & ~u, v !== 0 ? o = hi(v) : d !== 0 && (o = hi(d));
    if (o === 0) return 0;
    if (t !== 0 && t !== o && (t & u) === 0 && (u = o & -o, d = t & -t, u >= d || u === 16 && (d & 4194240) !== 0)) return t;
    if ((o & 4) !== 0 && (o |= i & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= o; 0 < t; ) i = 31 - Kt(t), u = 1 << i, o |= e[i], t &= ~u;
    return o;
  }
  function Qg(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Yg(e, t) {
    for (var i = e.suspendedLanes, o = e.pingedLanes, u = e.expirationTimes, d = e.pendingLanes; 0 < d; ) {
      var v = 31 - Kt(d), w = 1 << v, j = u[v];
      j === -1 ? ((w & i) === 0 || (w & o) !== 0) && (u[v] = Qg(w, t)) : j <= t && (e.expiredLanes |= w), d &= ~w;
    }
  }
  function sa(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Ec() {
    var e = Ss;
    return Ss <<= 1, (Ss & 4194240) === 0 && (Ss = 64), e;
  }
  function oa(e) {
    for (var t = [], i = 0; 31 > i; i++) t.push(e);
    return t;
  }
  function pi(e, t, i) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Kt(t), e[t] = i;
  }
  function Xg(e, t) {
    var i = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var o = e.eventTimes;
    for (e = e.expirationTimes; 0 < i; ) {
      var u = 31 - Kt(i), d = 1 << u;
      t[u] = 0, o[u] = -1, e[u] = -1, i &= ~d;
    }
  }
  function aa(e, t) {
    var i = e.entangledLanes |= t;
    for (e = e.entanglements; i; ) {
      var o = 31 - Kt(i), u = 1 << o;
      u & t | e[o] & t && (e[o] |= t), i &= ~u;
    }
  }
  var Ee = 0;
  function Cc(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Tc, la, Pc, Nc, Ac, ua = !1, Es = [], bn = null, _n = null, Dn = null, mi = /* @__PURE__ */ new Map(), gi = /* @__PURE__ */ new Map(), In = [], Zg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Mc(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        bn = null;
        break;
      case "dragenter":
      case "dragleave":
        _n = null;
        break;
      case "mouseover":
      case "mouseout":
        Dn = null;
        break;
      case "pointerover":
      case "pointerout":
        mi.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        gi.delete(t.pointerId);
    }
  }
  function vi(e, t, i, o, u, d) {
    return e === null || e.nativeEvent !== d ? (e = { blockedOn: t, domEventName: i, eventSystemFlags: o, nativeEvent: d, targetContainers: [u] }, t !== null && (t = Ri(t), t !== null && la(t)), e) : (e.eventSystemFlags |= o, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
  }
  function Jg(e, t, i, o, u) {
    switch (t) {
      case "focusin":
        return bn = vi(bn, e, t, i, o, u), !0;
      case "dragenter":
        return _n = vi(_n, e, t, i, o, u), !0;
      case "mouseover":
        return Dn = vi(Dn, e, t, i, o, u), !0;
      case "pointerover":
        var d = u.pointerId;
        return mi.set(d, vi(mi.get(d) || null, e, t, i, o, u)), !0;
      case "gotpointercapture":
        return d = u.pointerId, gi.set(d, vi(gi.get(d) || null, e, t, i, o, u)), !0;
    }
    return !1;
  }
  function Rc(e) {
    var t = or(e.target);
    if (t !== null) {
      var i = sr(t);
      if (i !== null) {
        if (t = i.tag, t === 13) {
          if (t = gc(i), t !== null) {
            e.blockedOn = t, Ac(e.priority, function() {
              Pc(i);
            });
            return;
          }
        } else if (t === 3 && i.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Cs(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var i = da(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (i === null) {
        i = e.nativeEvent;
        var o = new i.constructor(i.type, i);
        be = o, i.target.dispatchEvent(o), be = null;
      } else return t = Ri(i), t !== null && la(t), e.blockedOn = i, !1;
      t.shift();
    }
    return !0;
  }
  function Lc(e, t, i) {
    Cs(e) && i.delete(t);
  }
  function ev() {
    ua = !1, bn !== null && Cs(bn) && (bn = null), _n !== null && Cs(_n) && (_n = null), Dn !== null && Cs(Dn) && (Dn = null), mi.forEach(Lc), gi.forEach(Lc);
  }
  function yi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ua || (ua = !0, r.unstable_scheduleCallback(r.unstable_NormalPriority, ev)));
  }
  function xi(e) {
    function t(u) {
      return yi(u, e);
    }
    if (0 < Es.length) {
      yi(Es[0], e);
      for (var i = 1; i < Es.length; i++) {
        var o = Es[i];
        o.blockedOn === e && (o.blockedOn = null);
      }
    }
    for (bn !== null && yi(bn, e), _n !== null && yi(_n, e), Dn !== null && yi(Dn, e), mi.forEach(t), gi.forEach(t), i = 0; i < In.length; i++) o = In[i], o.blockedOn === e && (o.blockedOn = null);
    for (; 0 < In.length && (i = In[0], i.blockedOn === null); ) Rc(i), i.blockedOn === null && In.shift();
  }
  var Tr = Q.ReactCurrentBatchConfig, Ts = !0;
  function tv(e, t, i, o) {
    var u = Ee, d = Tr.transition;
    Tr.transition = null;
    try {
      Ee = 1, ca(e, t, i, o);
    } finally {
      Ee = u, Tr.transition = d;
    }
  }
  function nv(e, t, i, o) {
    var u = Ee, d = Tr.transition;
    Tr.transition = null;
    try {
      Ee = 4, ca(e, t, i, o);
    } finally {
      Ee = u, Tr.transition = d;
    }
  }
  function ca(e, t, i, o) {
    if (Ts) {
      var u = da(e, t, i, o);
      if (u === null) Na(e, t, o, Ps, i), Mc(e, o);
      else if (Jg(u, e, t, i, o)) o.stopPropagation();
      else if (Mc(e, o), t & 4 && -1 < Zg.indexOf(e)) {
        for (; u !== null; ) {
          var d = Ri(u);
          if (d !== null && Tc(d), d = da(e, t, i, o), d === null && Na(e, t, o, Ps, i), d === u) break;
          u = d;
        }
        u !== null && o.stopPropagation();
      } else Na(e, t, o, null, i);
    }
  }
  var Ps = null;
  function da(e, t, i, o) {
    if (Ps = null, e = _e(o), e = or(e), e !== null) if (t = sr(e), t === null) e = null;
    else if (i = t.tag, i === 13) {
      if (e = gc(t), e !== null) return e;
      e = null;
    } else if (i === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Ps = e, null;
  }
  function bc(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch ($g()) {
          case ia:
            return 1;
          case jc:
            return 4;
          case xs:
          case Ug:
            return 16;
          case kc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Vn = null, fa = null, Ns = null;
  function _c() {
    if (Ns) return Ns;
    var e, t = fa, i = t.length, o, u = "value" in Vn ? Vn.value : Vn.textContent, d = u.length;
    for (e = 0; e < i && t[e] === u[e]; e++) ;
    var v = i - e;
    for (o = 1; o <= v && t[i - o] === u[d - o]; o++) ;
    return Ns = u.slice(e, 1 < o ? 1 - o : void 0);
  }
  function As(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ms() {
    return !0;
  }
  function Dc() {
    return !1;
  }
  function Nt(e) {
    function t(i, o, u, d, v) {
      this._reactName = i, this._targetInst = u, this.type = o, this.nativeEvent = d, this.target = v, this.currentTarget = null;
      for (var w in e) e.hasOwnProperty(w) && (i = e[w], this[w] = i ? i(d) : d[w]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? Ms : Dc, this.isPropagationStopped = Dc, this;
    }
    return W(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var i = this.nativeEvent;
      i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1), this.isDefaultPrevented = Ms);
    }, stopPropagation: function() {
      var i = this.nativeEvent;
      i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0), this.isPropagationStopped = Ms);
    }, persist: function() {
    }, isPersistent: Ms }), t;
  }
  var Pr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ha = Nt(Pr), wi = W({}, Pr, { view: 0, detail: 0 }), rv = Nt(wi), pa, ma, Si, Rs = W({}, wi, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: va, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Si && (Si && e.type === "mousemove" ? (pa = e.screenX - Si.screenX, ma = e.screenY - Si.screenY) : ma = pa = 0, Si = e), pa);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : ma;
  } }), Ic = Nt(Rs), iv = W({}, Rs, { dataTransfer: 0 }), sv = Nt(iv), ov = W({}, wi, { relatedTarget: 0 }), ga = Nt(ov), av = W({}, Pr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), lv = Nt(av), uv = W({}, Pr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), cv = Nt(uv), dv = W({}, Pr, { data: 0 }), Vc = Nt(dv), fv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, hv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, pv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function mv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = pv[e]) ? !!t[e] : !1;
  }
  function va() {
    return mv;
  }
  var gv = W({}, wi, { key: function(e) {
    if (e.key) {
      var t = fv[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = As(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? hv[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: va, charCode: function(e) {
    return e.type === "keypress" ? As(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? As(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), vv = Nt(gv), yv = W({}, Rs, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), qc = Nt(yv), xv = W({}, wi, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: va }), wv = Nt(xv), Sv = W({}, Pr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), jv = Nt(Sv), kv = W({}, Rs, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ev = Nt(kv), Cv = [9, 13, 27, 32], ya = m && "CompositionEvent" in window, ji = null;
  m && "documentMode" in document && (ji = document.documentMode);
  var Tv = m && "TextEvent" in window && !ji, Oc = m && (!ya || ji && 8 < ji && 11 >= ji), Fc = " ", Bc = !1;
  function zc(e, t) {
    switch (e) {
      case "keyup":
        return Cv.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function $c(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Nr = !1;
  function Pv(e, t) {
    switch (e) {
      case "compositionend":
        return $c(t);
      case "keypress":
        return t.which !== 32 ? null : (Bc = !0, Fc);
      case "textInput":
        return e = t.data, e === Fc && Bc ? null : e;
      default:
        return null;
    }
  }
  function Nv(e, t) {
    if (Nr) return e === "compositionend" || !ya && zc(e, t) ? (e = _c(), Ns = fa = Vn = null, Nr = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Oc && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Av = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Uc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Av[e.type] : t === "textarea";
  }
  function Wc(e, t, i, o) {
    yt(o), t = Is(t, "onChange"), 0 < t.length && (i = new ha("onChange", "change", null, i, o), e.push({ event: i, listeners: t }));
  }
  var ki = null, Ei = null;
  function Mv(e) {
    ud(e, 0);
  }
  function Ls(e) {
    var t = br(e);
    if (_t(t)) return e;
  }
  function Rv(e, t) {
    if (e === "change") return t;
  }
  var Hc = !1;
  if (m) {
    var xa;
    if (m) {
      var wa = "oninput" in document;
      if (!wa) {
        var Kc = document.createElement("div");
        Kc.setAttribute("oninput", "return;"), wa = typeof Kc.oninput == "function";
      }
      xa = wa;
    } else xa = !1;
    Hc = xa && (!document.documentMode || 9 < document.documentMode);
  }
  function Gc() {
    ki && (ki.detachEvent("onpropertychange", Qc), Ei = ki = null);
  }
  function Qc(e) {
    if (e.propertyName === "value" && Ls(Ei)) {
      var t = [];
      Wc(t, Ei, e, _e(e)), mc(Mv, t);
    }
  }
  function Lv(e, t, i) {
    e === "focusin" ? (Gc(), ki = t, Ei = i, ki.attachEvent("onpropertychange", Qc)) : e === "focusout" && Gc();
  }
  function bv(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ls(Ei);
  }
  function _v(e, t) {
    if (e === "click") return Ls(t);
  }
  function Dv(e, t) {
    if (e === "input" || e === "change") return Ls(t);
  }
  function Iv(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Gt = typeof Object.is == "function" ? Object.is : Iv;
  function Ci(e, t) {
    if (Gt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var i = Object.keys(e), o = Object.keys(t);
    if (i.length !== o.length) return !1;
    for (o = 0; o < i.length; o++) {
      var u = i[o];
      if (!g.call(t, u) || !Gt(e[u], t[u])) return !1;
    }
    return !0;
  }
  function Yc(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Xc(e, t) {
    var i = Yc(e);
    e = 0;
    for (var o; i; ) {
      if (i.nodeType === 3) {
        if (o = e + i.textContent.length, e <= t && o >= t) return { node: i, offset: t - e };
        e = o;
      }
      e: {
        for (; i; ) {
          if (i.nextSibling) {
            i = i.nextSibling;
            break e;
          }
          i = i.parentNode;
        }
        i = void 0;
      }
      i = Yc(i);
    }
  }
  function Zc(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Zc(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Jc() {
    for (var e = window, t = H(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var i = typeof t.contentWindow.location.href == "string";
      } catch {
        i = !1;
      }
      if (i) e = t.contentWindow;
      else break;
      t = H(e.document);
    }
    return t;
  }
  function Sa(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Vv(e) {
    var t = Jc(), i = e.focusedElem, o = e.selectionRange;
    if (t !== i && i && i.ownerDocument && Zc(i.ownerDocument.documentElement, i)) {
      if (o !== null && Sa(i)) {
        if (t = o.start, e = o.end, e === void 0 && (e = t), "selectionStart" in i) i.selectionStart = t, i.selectionEnd = Math.min(e, i.value.length);
        else if (e = (t = i.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var u = i.textContent.length, d = Math.min(o.start, u);
          o = o.end === void 0 ? d : Math.min(o.end, u), !e.extend && d > o && (u = o, o = d, d = u), u = Xc(i, d);
          var v = Xc(
            i,
            o
          );
          u && v && (e.rangeCount !== 1 || e.anchorNode !== u.node || e.anchorOffset !== u.offset || e.focusNode !== v.node || e.focusOffset !== v.offset) && (t = t.createRange(), t.setStart(u.node, u.offset), e.removeAllRanges(), d > o ? (e.addRange(t), e.extend(v.node, v.offset)) : (t.setEnd(v.node, v.offset), e.addRange(t)));
        }
      }
      for (t = [], e = i; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof i.focus == "function" && i.focus(), i = 0; i < t.length; i++) e = t[i], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var qv = m && "documentMode" in document && 11 >= document.documentMode, Ar = null, ja = null, Ti = null, ka = !1;
  function ed(e, t, i) {
    var o = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
    ka || Ar == null || Ar !== H(o) || (o = Ar, "selectionStart" in o && Sa(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), Ti && Ci(Ti, o) || (Ti = o, o = Is(ja, "onSelect"), 0 < o.length && (t = new ha("onSelect", "select", null, t, i), e.push({ event: t, listeners: o }), t.target = Ar)));
  }
  function bs(e, t) {
    var i = {};
    return i[e.toLowerCase()] = t.toLowerCase(), i["Webkit" + e] = "webkit" + t, i["Moz" + e] = "moz" + t, i;
  }
  var Mr = { animationend: bs("Animation", "AnimationEnd"), animationiteration: bs("Animation", "AnimationIteration"), animationstart: bs("Animation", "AnimationStart"), transitionend: bs("Transition", "TransitionEnd") }, Ea = {}, td = {};
  m && (td = document.createElement("div").style, "AnimationEvent" in window || (delete Mr.animationend.animation, delete Mr.animationiteration.animation, delete Mr.animationstart.animation), "TransitionEvent" in window || delete Mr.transitionend.transition);
  function _s(e) {
    if (Ea[e]) return Ea[e];
    if (!Mr[e]) return e;
    var t = Mr[e], i;
    for (i in t) if (t.hasOwnProperty(i) && i in td) return Ea[e] = t[i];
    return e;
  }
  var nd = _s("animationend"), rd = _s("animationiteration"), id = _s("animationstart"), sd = _s("transitionend"), od = /* @__PURE__ */ new Map(), ad = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function qn(e, t) {
    od.set(e, t), f(t, [e]);
  }
  for (var Ca = 0; Ca < ad.length; Ca++) {
    var Ta = ad[Ca], Ov = Ta.toLowerCase(), Fv = Ta[0].toUpperCase() + Ta.slice(1);
    qn(Ov, "on" + Fv);
  }
  qn(nd, "onAnimationEnd"), qn(rd, "onAnimationIteration"), qn(id, "onAnimationStart"), qn("dblclick", "onDoubleClick"), qn("focusin", "onFocus"), qn("focusout", "onBlur"), qn(sd, "onTransitionEnd"), h("onMouseEnter", ["mouseout", "mouseover"]), h("onMouseLeave", ["mouseout", "mouseover"]), h("onPointerEnter", ["pointerout", "pointerover"]), h("onPointerLeave", ["pointerout", "pointerover"]), f("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), f("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), f("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), f("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), f("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), f("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Pi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bv = new Set("cancel close invalid load scroll toggle".split(" ").concat(Pi));
  function ld(e, t, i) {
    var o = e.type || "unknown-event";
    e.currentTarget = i, Og(o, t, void 0, e), e.currentTarget = null;
  }
  function ud(e, t) {
    t = (t & 4) !== 0;
    for (var i = 0; i < e.length; i++) {
      var o = e[i], u = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (t) for (var v = o.length - 1; 0 <= v; v--) {
          var w = o[v], j = w.instance, M = w.currentTarget;
          if (w = w.listener, j !== d && u.isPropagationStopped()) break e;
          ld(u, w, M), d = j;
        }
        else for (v = 0; v < o.length; v++) {
          if (w = o[v], j = w.instance, M = w.currentTarget, w = w.listener, j !== d && u.isPropagationStopped()) break e;
          ld(u, w, M), d = j;
        }
      }
    }
    if (ys) throw e = ra, ys = !1, ra = null, e;
  }
  function Me(e, t) {
    var i = t[_a];
    i === void 0 && (i = t[_a] = /* @__PURE__ */ new Set());
    var o = e + "__bubble";
    i.has(o) || (cd(t, e, 2, !1), i.add(o));
  }
  function Pa(e, t, i) {
    var o = 0;
    t && (o |= 4), cd(i, e, o, t);
  }
  var Ds = "_reactListening" + Math.random().toString(36).slice(2);
  function Ni(e) {
    if (!e[Ds]) {
      e[Ds] = !0, l.forEach(function(i) {
        i !== "selectionchange" && (Bv.has(i) || Pa(i, !1, e), Pa(i, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ds] || (t[Ds] = !0, Pa("selectionchange", !1, t));
    }
  }
  function cd(e, t, i, o) {
    switch (bc(t)) {
      case 1:
        var u = tv;
        break;
      case 4:
        u = nv;
        break;
      default:
        u = ca;
    }
    i = u.bind(null, t, i, e), u = void 0, !na || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), o ? u !== void 0 ? e.addEventListener(t, i, { capture: !0, passive: u }) : e.addEventListener(t, i, !0) : u !== void 0 ? e.addEventListener(t, i, { passive: u }) : e.addEventListener(t, i, !1);
  }
  function Na(e, t, i, o, u) {
    var d = o;
    if ((t & 1) === 0 && (t & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var v = o.tag;
      if (v === 3 || v === 4) {
        var w = o.stateNode.containerInfo;
        if (w === u || w.nodeType === 8 && w.parentNode === u) break;
        if (v === 4) for (v = o.return; v !== null; ) {
          var j = v.tag;
          if ((j === 3 || j === 4) && (j = v.stateNode.containerInfo, j === u || j.nodeType === 8 && j.parentNode === u)) return;
          v = v.return;
        }
        for (; w !== null; ) {
          if (v = or(w), v === null) return;
          if (j = v.tag, j === 5 || j === 6) {
            o = d = v;
            continue e;
          }
          w = w.parentNode;
        }
      }
      o = o.return;
    }
    mc(function() {
      var M = d, O = _e(i), F = [];
      e: {
        var q = od.get(e);
        if (q !== void 0) {
          var G = ha, X = e;
          switch (e) {
            case "keypress":
              if (As(i) === 0) break e;
            case "keydown":
            case "keyup":
              G = vv;
              break;
            case "focusin":
              X = "focus", G = ga;
              break;
            case "focusout":
              X = "blur", G = ga;
              break;
            case "beforeblur":
            case "afterblur":
              G = ga;
              break;
            case "click":
              if (i.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              G = Ic;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              G = sv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              G = wv;
              break;
            case nd:
            case rd:
            case id:
              G = lv;
              break;
            case sd:
              G = jv;
              break;
            case "scroll":
              G = rv;
              break;
            case "wheel":
              G = Ev;
              break;
            case "copy":
            case "cut":
            case "paste":
              G = cv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              G = qc;
          }
          var Z = (t & 4) !== 0, He = !Z && e === "scroll", P = Z ? q !== null ? q + "Capture" : null : q;
          Z = [];
          for (var k = M, A; k !== null; ) {
            A = k;
            var z = A.stateNode;
            if (A.tag === 5 && z !== null && (A = z, P !== null && (z = ci(k, P), z != null && Z.push(Ai(k, z, A)))), He) break;
            k = k.return;
          }
          0 < Z.length && (q = new G(q, X, null, i, O), F.push({ event: q, listeners: Z }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (q = e === "mouseover" || e === "pointerover", G = e === "mouseout" || e === "pointerout", q && i !== be && (X = i.relatedTarget || i.fromElement) && (or(X) || X[vn])) break e;
          if ((G || q) && (q = O.window === O ? O : (q = O.ownerDocument) ? q.defaultView || q.parentWindow : window, G ? (X = i.relatedTarget || i.toElement, G = M, X = X ? or(X) : null, X !== null && (He = sr(X), X !== He || X.tag !== 5 && X.tag !== 6) && (X = null)) : (G = null, X = M), G !== X)) {
            if (Z = Ic, z = "onMouseLeave", P = "onMouseEnter", k = "mouse", (e === "pointerout" || e === "pointerover") && (Z = qc, z = "onPointerLeave", P = "onPointerEnter", k = "pointer"), He = G == null ? q : br(G), A = X == null ? q : br(X), q = new Z(z, k + "leave", G, i, O), q.target = He, q.relatedTarget = A, z = null, or(O) === M && (Z = new Z(P, k + "enter", X, i, O), Z.target = A, Z.relatedTarget = He, z = Z), He = z, G && X) t: {
              for (Z = G, P = X, k = 0, A = Z; A; A = Rr(A)) k++;
              for (A = 0, z = P; z; z = Rr(z)) A++;
              for (; 0 < k - A; ) Z = Rr(Z), k--;
              for (; 0 < A - k; ) P = Rr(P), A--;
              for (; k--; ) {
                if (Z === P || P !== null && Z === P.alternate) break t;
                Z = Rr(Z), P = Rr(P);
              }
              Z = null;
            }
            else Z = null;
            G !== null && dd(F, q, G, Z, !1), X !== null && He !== null && dd(F, He, X, Z, !0);
          }
        }
        e: {
          if (q = M ? br(M) : window, G = q.nodeName && q.nodeName.toLowerCase(), G === "select" || G === "input" && q.type === "file") var ee = Rv;
          else if (Uc(q)) if (Hc) ee = Dv;
          else {
            ee = bv;
            var ie = Lv;
          }
          else (G = q.nodeName) && G.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (ee = _v);
          if (ee && (ee = ee(e, M))) {
            Wc(F, ee, i, O);
            break e;
          }
          ie && ie(e, q, M), e === "focusout" && (ie = q._wrapperState) && ie.controlled && q.type === "number" && rt(q, "number", q.value);
        }
        switch (ie = M ? br(M) : window, e) {
          case "focusin":
            (Uc(ie) || ie.contentEditable === "true") && (Ar = ie, ja = M, Ti = null);
            break;
          case "focusout":
            Ti = ja = Ar = null;
            break;
          case "mousedown":
            ka = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ka = !1, ed(F, i, O);
            break;
          case "selectionchange":
            if (qv) break;
          case "keydown":
          case "keyup":
            ed(F, i, O);
        }
        var se;
        if (ya) e: {
          switch (e) {
            case "compositionstart":
              var fe = "onCompositionStart";
              break e;
            case "compositionend":
              fe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              fe = "onCompositionUpdate";
              break e;
          }
          fe = void 0;
        }
        else Nr ? zc(e, i) && (fe = "onCompositionEnd") : e === "keydown" && i.keyCode === 229 && (fe = "onCompositionStart");
        fe && (Oc && i.locale !== "ko" && (Nr || fe !== "onCompositionStart" ? fe === "onCompositionEnd" && Nr && (se = _c()) : (Vn = O, fa = "value" in Vn ? Vn.value : Vn.textContent, Nr = !0)), ie = Is(M, fe), 0 < ie.length && (fe = new Vc(fe, e, null, i, O), F.push({ event: fe, listeners: ie }), se ? fe.data = se : (se = $c(i), se !== null && (fe.data = se)))), (se = Tv ? Pv(e, i) : Nv(e, i)) && (M = Is(M, "onBeforeInput"), 0 < M.length && (O = new Vc("onBeforeInput", "beforeinput", null, i, O), F.push({ event: O, listeners: M }), O.data = se));
      }
      ud(F, t);
    });
  }
  function Ai(e, t, i) {
    return { instance: e, listener: t, currentTarget: i };
  }
  function Is(e, t) {
    for (var i = t + "Capture", o = []; e !== null; ) {
      var u = e, d = u.stateNode;
      u.tag === 5 && d !== null && (u = d, d = ci(e, i), d != null && o.unshift(Ai(e, d, u)), d = ci(e, t), d != null && o.push(Ai(e, d, u))), e = e.return;
    }
    return o;
  }
  function Rr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function dd(e, t, i, o, u) {
    for (var d = t._reactName, v = []; i !== null && i !== o; ) {
      var w = i, j = w.alternate, M = w.stateNode;
      if (j !== null && j === o) break;
      w.tag === 5 && M !== null && (w = M, u ? (j = ci(i, d), j != null && v.unshift(Ai(i, j, w))) : u || (j = ci(i, d), j != null && v.push(Ai(i, j, w)))), i = i.return;
    }
    v.length !== 0 && e.push({ event: t, listeners: v });
  }
  var zv = /\r\n?/g, $v = /\u0000|\uFFFD/g;
  function fd(e) {
    return (typeof e == "string" ? e : "" + e).replace(zv, `
`).replace($v, "");
  }
  function Vs(e, t, i) {
    if (t = fd(t), fd(e) !== t && i) throw Error(s(425));
  }
  function qs() {
  }
  var Aa = null, Ma = null;
  function Ra(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var La = typeof setTimeout == "function" ? setTimeout : void 0, Uv = typeof clearTimeout == "function" ? clearTimeout : void 0, hd = typeof Promise == "function" ? Promise : void 0, Wv = typeof queueMicrotask == "function" ? queueMicrotask : typeof hd < "u" ? function(e) {
    return hd.resolve(null).then(e).catch(Hv);
  } : La;
  function Hv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ba(e, t) {
    var i = t, o = 0;
    do {
      var u = i.nextSibling;
      if (e.removeChild(i), u && u.nodeType === 8) if (i = u.data, i === "/$") {
        if (o === 0) {
          e.removeChild(u), xi(t);
          return;
        }
        o--;
      } else i !== "$" && i !== "$?" && i !== "$!" || o++;
      i = u;
    } while (i);
    xi(t);
  }
  function On(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function pd(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var i = e.data;
        if (i === "$" || i === "$!" || i === "$?") {
          if (t === 0) return e;
          t--;
        } else i === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Lr = Math.random().toString(36).slice(2), an = "__reactFiber$" + Lr, Mi = "__reactProps$" + Lr, vn = "__reactContainer$" + Lr, _a = "__reactEvents$" + Lr, Kv = "__reactListeners$" + Lr, Gv = "__reactHandles$" + Lr;
  function or(e) {
    var t = e[an];
    if (t) return t;
    for (var i = e.parentNode; i; ) {
      if (t = i[vn] || i[an]) {
        if (i = t.alternate, t.child !== null || i !== null && i.child !== null) for (e = pd(e); e !== null; ) {
          if (i = e[an]) return i;
          e = pd(e);
        }
        return t;
      }
      e = i, i = e.parentNode;
    }
    return null;
  }
  function Ri(e) {
    return e = e[an] || e[vn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function br(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function Os(e) {
    return e[Mi] || null;
  }
  var Da = [], _r = -1;
  function Fn(e) {
    return { current: e };
  }
  function Re(e) {
    0 > _r || (e.current = Da[_r], Da[_r] = null, _r--);
  }
  function Ne(e, t) {
    _r++, Da[_r] = e.current, e.current = t;
  }
  var Bn = {}, dt = Fn(Bn), jt = Fn(!1), ar = Bn;
  function Dr(e, t) {
    var i = e.type.contextTypes;
    if (!i) return Bn;
    var o = e.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === t) return o.__reactInternalMemoizedMaskedChildContext;
    var u = {}, d;
    for (d in i) u[d] = t[d];
    return o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = u), u;
  }
  function kt(e) {
    return e = e.childContextTypes, e != null;
  }
  function Fs() {
    Re(jt), Re(dt);
  }
  function md(e, t, i) {
    if (dt.current !== Bn) throw Error(s(168));
    Ne(dt, t), Ne(jt, i);
  }
  function gd(e, t, i) {
    var o = e.stateNode;
    if (t = t.childContextTypes, typeof o.getChildContext != "function") return i;
    o = o.getChildContext();
    for (var u in o) if (!(u in t)) throw Error(s(108, je(e) || "Unknown", u));
    return W({}, i, o);
  }
  function Bs(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Bn, ar = dt.current, Ne(dt, e), Ne(jt, jt.current), !0;
  }
  function vd(e, t, i) {
    var o = e.stateNode;
    if (!o) throw Error(s(169));
    i ? (e = gd(e, t, ar), o.__reactInternalMemoizedMergedChildContext = e, Re(jt), Re(dt), Ne(dt, e)) : Re(jt), Ne(jt, i);
  }
  var yn = null, zs = !1, Ia = !1;
  function yd(e) {
    yn === null ? yn = [e] : yn.push(e);
  }
  function Qv(e) {
    zs = !0, yd(e);
  }
  function zn() {
    if (!Ia && yn !== null) {
      Ia = !0;
      var e = 0, t = Ee;
      try {
        var i = yn;
        for (Ee = 1; e < i.length; e++) {
          var o = i[e];
          do
            o = o(!0);
          while (o !== null);
        }
        yn = null, zs = !1;
      } catch (u) {
        throw yn !== null && (yn = yn.slice(e + 1)), wc(ia, zn), u;
      } finally {
        Ee = t, Ia = !1;
      }
    }
    return null;
  }
  var Ir = [], Vr = 0, $s = null, Us = 0, It = [], Vt = 0, lr = null, xn = 1, wn = "";
  function ur(e, t) {
    Ir[Vr++] = Us, Ir[Vr++] = $s, $s = e, Us = t;
  }
  function xd(e, t, i) {
    It[Vt++] = xn, It[Vt++] = wn, It[Vt++] = lr, lr = e;
    var o = xn;
    e = wn;
    var u = 32 - Kt(o) - 1;
    o &= ~(1 << u), i += 1;
    var d = 32 - Kt(t) + u;
    if (30 < d) {
      var v = u - u % 5;
      d = (o & (1 << v) - 1).toString(32), o >>= v, u -= v, xn = 1 << 32 - Kt(t) + u | i << u | o, wn = d + e;
    } else xn = 1 << d | i << u | o, wn = e;
  }
  function Va(e) {
    e.return !== null && (ur(e, 1), xd(e, 1, 0));
  }
  function qa(e) {
    for (; e === $s; ) $s = Ir[--Vr], Ir[Vr] = null, Us = Ir[--Vr], Ir[Vr] = null;
    for (; e === lr; ) lr = It[--Vt], It[Vt] = null, wn = It[--Vt], It[Vt] = null, xn = It[--Vt], It[Vt] = null;
  }
  var At = null, Mt = null, De = !1, Qt = null;
  function wd(e, t) {
    var i = Bt(5, null, null, 0);
    i.elementType = "DELETED", i.stateNode = t, i.return = e, t = e.deletions, t === null ? (e.deletions = [i], e.flags |= 16) : t.push(i);
  }
  function Sd(e, t) {
    switch (e.tag) {
      case 5:
        var i = e.type;
        return t = t.nodeType !== 1 || i.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, At = e, Mt = On(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, At = e, Mt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (i = lr !== null ? { id: xn, overflow: wn } : null, e.memoizedState = { dehydrated: t, treeContext: i, retryLane: 1073741824 }, i = Bt(18, null, null, 0), i.stateNode = t, i.return = e, e.child = i, At = e, Mt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Oa(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Fa(e) {
    if (De) {
      var t = Mt;
      if (t) {
        var i = t;
        if (!Sd(e, t)) {
          if (Oa(e)) throw Error(s(418));
          t = On(i.nextSibling);
          var o = At;
          t && Sd(e, t) ? wd(o, i) : (e.flags = e.flags & -4097 | 2, De = !1, At = e);
        }
      } else {
        if (Oa(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, De = !1, At = e;
      }
    }
  }
  function jd(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    At = e;
  }
  function Ws(e) {
    if (e !== At) return !1;
    if (!De) return jd(e), De = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ra(e.type, e.memoizedProps)), t && (t = Mt)) {
      if (Oa(e)) throw kd(), Error(s(418));
      for (; t; ) wd(e, t), t = On(t.nextSibling);
    }
    if (jd(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var i = e.data;
            if (i === "/$") {
              if (t === 0) {
                Mt = On(e.nextSibling);
                break e;
              }
              t--;
            } else i !== "$" && i !== "$!" && i !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Mt = null;
      }
    } else Mt = At ? On(e.stateNode.nextSibling) : null;
    return !0;
  }
  function kd() {
    for (var e = Mt; e; ) e = On(e.nextSibling);
  }
  function qr() {
    Mt = At = null, De = !1;
  }
  function Ba(e) {
    Qt === null ? Qt = [e] : Qt.push(e);
  }
  var Yv = Q.ReactCurrentBatchConfig;
  function Li(e, t, i) {
    if (e = i.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (i._owner) {
        if (i = i._owner, i) {
          if (i.tag !== 1) throw Error(s(309));
          var o = i.stateNode;
        }
        if (!o) throw Error(s(147, e));
        var u = o, d = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === d ? t.ref : (t = function(v) {
          var w = u.refs;
          v === null ? delete w[d] : w[d] = v;
        }, t._stringRef = d, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!i._owner) throw Error(s(290, e));
    }
    return e;
  }
  function Hs(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Ed(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Cd(e) {
    function t(P, k) {
      if (e) {
        var A = P.deletions;
        A === null ? (P.deletions = [k], P.flags |= 16) : A.push(k);
      }
    }
    function i(P, k) {
      if (!e) return null;
      for (; k !== null; ) t(P, k), k = k.sibling;
      return null;
    }
    function o(P, k) {
      for (P = /* @__PURE__ */ new Map(); k !== null; ) k.key !== null ? P.set(k.key, k) : P.set(k.index, k), k = k.sibling;
      return P;
    }
    function u(P, k) {
      return P = Yn(P, k), P.index = 0, P.sibling = null, P;
    }
    function d(P, k, A) {
      return P.index = A, e ? (A = P.alternate, A !== null ? (A = A.index, A < k ? (P.flags |= 2, k) : A) : (P.flags |= 2, k)) : (P.flags |= 1048576, k);
    }
    function v(P) {
      return e && P.alternate === null && (P.flags |= 2), P;
    }
    function w(P, k, A, z) {
      return k === null || k.tag !== 6 ? (k = Ll(A, P.mode, z), k.return = P, k) : (k = u(k, A), k.return = P, k);
    }
    function j(P, k, A, z) {
      var ee = A.type;
      return ee === U ? O(P, k, A.props.children, z, A.key) : k !== null && (k.elementType === ee || typeof ee == "object" && ee !== null && ee.$$typeof === Ae && Ed(ee) === k.type) ? (z = u(k, A.props), z.ref = Li(P, k, A), z.return = P, z) : (z = vo(A.type, A.key, A.props, null, P.mode, z), z.ref = Li(P, k, A), z.return = P, z);
    }
    function M(P, k, A, z) {
      return k === null || k.tag !== 4 || k.stateNode.containerInfo !== A.containerInfo || k.stateNode.implementation !== A.implementation ? (k = bl(A, P.mode, z), k.return = P, k) : (k = u(k, A.children || []), k.return = P, k);
    }
    function O(P, k, A, z, ee) {
      return k === null || k.tag !== 7 ? (k = vr(A, P.mode, z, ee), k.return = P, k) : (k = u(k, A), k.return = P, k);
    }
    function F(P, k, A) {
      if (typeof k == "string" && k !== "" || typeof k == "number") return k = Ll("" + k, P.mode, A), k.return = P, k;
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case K:
            return A = vo(k.type, k.key, k.props, null, P.mode, A), A.ref = Li(P, null, k), A.return = P, A;
          case J:
            return k = bl(k, P.mode, A), k.return = P, k;
          case Ae:
            var z = k._init;
            return F(P, z(k._payload), A);
        }
        if (Dt(k) || te(k)) return k = vr(k, P.mode, A, null), k.return = P, k;
        Hs(P, k);
      }
      return null;
    }
    function q(P, k, A, z) {
      var ee = k !== null ? k.key : null;
      if (typeof A == "string" && A !== "" || typeof A == "number") return ee !== null ? null : w(P, k, "" + A, z);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case K:
            return A.key === ee ? j(P, k, A, z) : null;
          case J:
            return A.key === ee ? M(P, k, A, z) : null;
          case Ae:
            return ee = A._init, q(
              P,
              k,
              ee(A._payload),
              z
            );
        }
        if (Dt(A) || te(A)) return ee !== null ? null : O(P, k, A, z, null);
        Hs(P, A);
      }
      return null;
    }
    function G(P, k, A, z, ee) {
      if (typeof z == "string" && z !== "" || typeof z == "number") return P = P.get(A) || null, w(k, P, "" + z, ee);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case K:
            return P = P.get(z.key === null ? A : z.key) || null, j(k, P, z, ee);
          case J:
            return P = P.get(z.key === null ? A : z.key) || null, M(k, P, z, ee);
          case Ae:
            var ie = z._init;
            return G(P, k, A, ie(z._payload), ee);
        }
        if (Dt(z) || te(z)) return P = P.get(A) || null, O(k, P, z, ee, null);
        Hs(k, z);
      }
      return null;
    }
    function X(P, k, A, z) {
      for (var ee = null, ie = null, se = k, fe = k = 0, nt = null; se !== null && fe < A.length; fe++) {
        se.index > fe ? (nt = se, se = null) : nt = se.sibling;
        var Se = q(P, se, A[fe], z);
        if (Se === null) {
          se === null && (se = nt);
          break;
        }
        e && se && Se.alternate === null && t(P, se), k = d(Se, k, fe), ie === null ? ee = Se : ie.sibling = Se, ie = Se, se = nt;
      }
      if (fe === A.length) return i(P, se), De && ur(P, fe), ee;
      if (se === null) {
        for (; fe < A.length; fe++) se = F(P, A[fe], z), se !== null && (k = d(se, k, fe), ie === null ? ee = se : ie.sibling = se, ie = se);
        return De && ur(P, fe), ee;
      }
      for (se = o(P, se); fe < A.length; fe++) nt = G(se, P, fe, A[fe], z), nt !== null && (e && nt.alternate !== null && se.delete(nt.key === null ? fe : nt.key), k = d(nt, k, fe), ie === null ? ee = nt : ie.sibling = nt, ie = nt);
      return e && se.forEach(function(Xn) {
        return t(P, Xn);
      }), De && ur(P, fe), ee;
    }
    function Z(P, k, A, z) {
      var ee = te(A);
      if (typeof ee != "function") throw Error(s(150));
      if (A = ee.call(A), A == null) throw Error(s(151));
      for (var ie = ee = null, se = k, fe = k = 0, nt = null, Se = A.next(); se !== null && !Se.done; fe++, Se = A.next()) {
        se.index > fe ? (nt = se, se = null) : nt = se.sibling;
        var Xn = q(P, se, Se.value, z);
        if (Xn === null) {
          se === null && (se = nt);
          break;
        }
        e && se && Xn.alternate === null && t(P, se), k = d(Xn, k, fe), ie === null ? ee = Xn : ie.sibling = Xn, ie = Xn, se = nt;
      }
      if (Se.done) return i(
        P,
        se
      ), De && ur(P, fe), ee;
      if (se === null) {
        for (; !Se.done; fe++, Se = A.next()) Se = F(P, Se.value, z), Se !== null && (k = d(Se, k, fe), ie === null ? ee = Se : ie.sibling = Se, ie = Se);
        return De && ur(P, fe), ee;
      }
      for (se = o(P, se); !Se.done; fe++, Se = A.next()) Se = G(se, P, fe, Se.value, z), Se !== null && (e && Se.alternate !== null && se.delete(Se.key === null ? fe : Se.key), k = d(Se, k, fe), ie === null ? ee = Se : ie.sibling = Se, ie = Se);
      return e && se.forEach(function(Ay) {
        return t(P, Ay);
      }), De && ur(P, fe), ee;
    }
    function He(P, k, A, z) {
      if (typeof A == "object" && A !== null && A.type === U && A.key === null && (A = A.props.children), typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case K:
            e: {
              for (var ee = A.key, ie = k; ie !== null; ) {
                if (ie.key === ee) {
                  if (ee = A.type, ee === U) {
                    if (ie.tag === 7) {
                      i(P, ie.sibling), k = u(ie, A.props.children), k.return = P, P = k;
                      break e;
                    }
                  } else if (ie.elementType === ee || typeof ee == "object" && ee !== null && ee.$$typeof === Ae && Ed(ee) === ie.type) {
                    i(P, ie.sibling), k = u(ie, A.props), k.ref = Li(P, ie, A), k.return = P, P = k;
                    break e;
                  }
                  i(P, ie);
                  break;
                } else t(P, ie);
                ie = ie.sibling;
              }
              A.type === U ? (k = vr(A.props.children, P.mode, z, A.key), k.return = P, P = k) : (z = vo(A.type, A.key, A.props, null, P.mode, z), z.ref = Li(P, k, A), z.return = P, P = z);
            }
            return v(P);
          case J:
            e: {
              for (ie = A.key; k !== null; ) {
                if (k.key === ie) if (k.tag === 4 && k.stateNode.containerInfo === A.containerInfo && k.stateNode.implementation === A.implementation) {
                  i(P, k.sibling), k = u(k, A.children || []), k.return = P, P = k;
                  break e;
                } else {
                  i(P, k);
                  break;
                }
                else t(P, k);
                k = k.sibling;
              }
              k = bl(A, P.mode, z), k.return = P, P = k;
            }
            return v(P);
          case Ae:
            return ie = A._init, He(P, k, ie(A._payload), z);
        }
        if (Dt(A)) return X(P, k, A, z);
        if (te(A)) return Z(P, k, A, z);
        Hs(P, A);
      }
      return typeof A == "string" && A !== "" || typeof A == "number" ? (A = "" + A, k !== null && k.tag === 6 ? (i(P, k.sibling), k = u(k, A), k.return = P, P = k) : (i(P, k), k = Ll(A, P.mode, z), k.return = P, P = k), v(P)) : i(P, k);
    }
    return He;
  }
  var Or = Cd(!0), Td = Cd(!1), Ks = Fn(null), Gs = null, Fr = null, za = null;
  function $a() {
    za = Fr = Gs = null;
  }
  function Ua(e) {
    var t = Ks.current;
    Re(Ks), e._currentValue = t;
  }
  function Wa(e, t, i) {
    for (; e !== null; ) {
      var o = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, o !== null && (o.childLanes |= t)) : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t), e === i) break;
      e = e.return;
    }
  }
  function Br(e, t) {
    Gs = e, za = Fr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Et = !0), e.firstContext = null);
  }
  function qt(e) {
    var t = e._currentValue;
    if (za !== e) if (e = { context: e, memoizedValue: t, next: null }, Fr === null) {
      if (Gs === null) throw Error(s(308));
      Fr = e, Gs.dependencies = { lanes: 0, firstContext: e };
    } else Fr = Fr.next = e;
    return t;
  }
  var cr = null;
  function Ha(e) {
    cr === null ? cr = [e] : cr.push(e);
  }
  function Pd(e, t, i, o) {
    var u = t.interleaved;
    return u === null ? (i.next = i, Ha(t)) : (i.next = u.next, u.next = i), t.interleaved = i, Sn(e, o);
  }
  function Sn(e, t) {
    e.lanes |= t;
    var i = e.alternate;
    for (i !== null && (i.lanes |= t), i = e, e = e.return; e !== null; ) e.childLanes |= t, i = e.alternate, i !== null && (i.childLanes |= t), i = e, e = e.return;
    return i.tag === 3 ? i.stateNode : null;
  }
  var $n = !1;
  function Ka(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Nd(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function jn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Un(e, t, i) {
    var o = e.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (we & 2) !== 0) {
      var u = o.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), o.pending = t, Sn(e, i);
    }
    return u = o.interleaved, u === null ? (t.next = t, Ha(o)) : (t.next = u.next, u.next = t), o.interleaved = t, Sn(e, i);
  }
  function Qs(e, t, i) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (i & 4194240) !== 0)) {
      var o = t.lanes;
      o &= e.pendingLanes, i |= o, t.lanes = i, aa(e, i);
    }
  }
  function Ad(e, t) {
    var i = e.updateQueue, o = e.alternate;
    if (o !== null && (o = o.updateQueue, i === o)) {
      var u = null, d = null;
      if (i = i.firstBaseUpdate, i !== null) {
        do {
          var v = { eventTime: i.eventTime, lane: i.lane, tag: i.tag, payload: i.payload, callback: i.callback, next: null };
          d === null ? u = d = v : d = d.next = v, i = i.next;
        } while (i !== null);
        d === null ? u = d = t : d = d.next = t;
      } else u = d = t;
      i = { baseState: o.baseState, firstBaseUpdate: u, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, e.updateQueue = i;
      return;
    }
    e = i.lastBaseUpdate, e === null ? i.firstBaseUpdate = t : e.next = t, i.lastBaseUpdate = t;
  }
  function Ys(e, t, i, o) {
    var u = e.updateQueue;
    $n = !1;
    var d = u.firstBaseUpdate, v = u.lastBaseUpdate, w = u.shared.pending;
    if (w !== null) {
      u.shared.pending = null;
      var j = w, M = j.next;
      j.next = null, v === null ? d = M : v.next = M, v = j;
      var O = e.alternate;
      O !== null && (O = O.updateQueue, w = O.lastBaseUpdate, w !== v && (w === null ? O.firstBaseUpdate = M : w.next = M, O.lastBaseUpdate = j));
    }
    if (d !== null) {
      var F = u.baseState;
      v = 0, O = M = j = null, w = d;
      do {
        var q = w.lane, G = w.eventTime;
        if ((o & q) === q) {
          O !== null && (O = O.next = {
            eventTime: G,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var X = e, Z = w;
            switch (q = t, G = i, Z.tag) {
              case 1:
                if (X = Z.payload, typeof X == "function") {
                  F = X.call(G, F, q);
                  break e;
                }
                F = X;
                break e;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = Z.payload, q = typeof X == "function" ? X.call(G, F, q) : X, q == null) break e;
                F = W({}, F, q);
                break e;
              case 2:
                $n = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (e.flags |= 64, q = u.effects, q === null ? u.effects = [w] : q.push(w));
        } else G = { eventTime: G, lane: q, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, O === null ? (M = O = G, j = F) : O = O.next = G, v |= q;
        if (w = w.next, w === null) {
          if (w = u.shared.pending, w === null) break;
          q = w, w = q.next, q.next = null, u.lastBaseUpdate = q, u.shared.pending = null;
        }
      } while (!0);
      if (O === null && (j = F), u.baseState = j, u.firstBaseUpdate = M, u.lastBaseUpdate = O, t = u.shared.interleaved, t !== null) {
        u = t;
        do
          v |= u.lane, u = u.next;
        while (u !== t);
      } else d === null && (u.shared.lanes = 0);
      hr |= v, e.lanes = v, e.memoizedState = F;
    }
  }
  function Md(e, t, i) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var o = e[t], u = o.callback;
      if (u !== null) {
        if (o.callback = null, o = i, typeof u != "function") throw Error(s(191, u));
        u.call(o);
      }
    }
  }
  var bi = {}, ln = Fn(bi), _i = Fn(bi), Di = Fn(bi);
  function dr(e) {
    if (e === bi) throw Error(s(174));
    return e;
  }
  function Ga(e, t) {
    switch (Ne(Di, t), Ne(_i, e), Ne(ln, bi), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Wt(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Wt(t, e);
    }
    Re(ln), Ne(ln, t);
  }
  function zr() {
    Re(ln), Re(_i), Re(Di);
  }
  function Rd(e) {
    dr(Di.current);
    var t = dr(ln.current), i = Wt(t, e.type);
    t !== i && (Ne(_i, e), Ne(ln, i));
  }
  function Qa(e) {
    _i.current === e && (Re(ln), Re(_i));
  }
  var Oe = Fn(0);
  function Xs(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var i = t.memoizedState;
        if (i !== null && (i = i.dehydrated, i === null || i.data === "$?" || i.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Ya = [];
  function Xa() {
    for (var e = 0; e < Ya.length; e++) Ya[e]._workInProgressVersionPrimary = null;
    Ya.length = 0;
  }
  var Zs = Q.ReactCurrentDispatcher, Za = Q.ReactCurrentBatchConfig, fr = 0, Fe = null, Xe = null, et = null, Js = !1, Ii = !1, Vi = 0, Xv = 0;
  function ft() {
    throw Error(s(321));
  }
  function Ja(e, t) {
    if (t === null) return !1;
    for (var i = 0; i < t.length && i < e.length; i++) if (!Gt(e[i], t[i])) return !1;
    return !0;
  }
  function el(e, t, i, o, u, d) {
    if (fr = d, Fe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Zs.current = e === null || e.memoizedState === null ? ty : ny, e = i(o, u), Ii) {
      d = 0;
      do {
        if (Ii = !1, Vi = 0, 25 <= d) throw Error(s(301));
        d += 1, et = Xe = null, t.updateQueue = null, Zs.current = ry, e = i(o, u);
      } while (Ii);
    }
    if (Zs.current = no, t = Xe !== null && Xe.next !== null, fr = 0, et = Xe = Fe = null, Js = !1, t) throw Error(s(300));
    return e;
  }
  function tl() {
    var e = Vi !== 0;
    return Vi = 0, e;
  }
  function un() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return et === null ? Fe.memoizedState = et = e : et = et.next = e, et;
  }
  function Ot() {
    if (Xe === null) {
      var e = Fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Xe.next;
    var t = et === null ? Fe.memoizedState : et.next;
    if (t !== null) et = t, Xe = e;
    else {
      if (e === null) throw Error(s(310));
      Xe = e, e = { memoizedState: Xe.memoizedState, baseState: Xe.baseState, baseQueue: Xe.baseQueue, queue: Xe.queue, next: null }, et === null ? Fe.memoizedState = et = e : et = et.next = e;
    }
    return et;
  }
  function qi(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function nl(e) {
    var t = Ot(), i = t.queue;
    if (i === null) throw Error(s(311));
    i.lastRenderedReducer = e;
    var o = Xe, u = o.baseQueue, d = i.pending;
    if (d !== null) {
      if (u !== null) {
        var v = u.next;
        u.next = d.next, d.next = v;
      }
      o.baseQueue = u = d, i.pending = null;
    }
    if (u !== null) {
      d = u.next, o = o.baseState;
      var w = v = null, j = null, M = d;
      do {
        var O = M.lane;
        if ((fr & O) === O) j !== null && (j = j.next = { lane: 0, action: M.action, hasEagerState: M.hasEagerState, eagerState: M.eagerState, next: null }), o = M.hasEagerState ? M.eagerState : e(o, M.action);
        else {
          var F = {
            lane: O,
            action: M.action,
            hasEagerState: M.hasEagerState,
            eagerState: M.eagerState,
            next: null
          };
          j === null ? (w = j = F, v = o) : j = j.next = F, Fe.lanes |= O, hr |= O;
        }
        M = M.next;
      } while (M !== null && M !== d);
      j === null ? v = o : j.next = w, Gt(o, t.memoizedState) || (Et = !0), t.memoizedState = o, t.baseState = v, t.baseQueue = j, i.lastRenderedState = o;
    }
    if (e = i.interleaved, e !== null) {
      u = e;
      do
        d = u.lane, Fe.lanes |= d, hr |= d, u = u.next;
      while (u !== e);
    } else u === null && (i.lanes = 0);
    return [t.memoizedState, i.dispatch];
  }
  function rl(e) {
    var t = Ot(), i = t.queue;
    if (i === null) throw Error(s(311));
    i.lastRenderedReducer = e;
    var o = i.dispatch, u = i.pending, d = t.memoizedState;
    if (u !== null) {
      i.pending = null;
      var v = u = u.next;
      do
        d = e(d, v.action), v = v.next;
      while (v !== u);
      Gt(d, t.memoizedState) || (Et = !0), t.memoizedState = d, t.baseQueue === null && (t.baseState = d), i.lastRenderedState = d;
    }
    return [d, o];
  }
  function Ld() {
  }
  function bd(e, t) {
    var i = Fe, o = Ot(), u = t(), d = !Gt(o.memoizedState, u);
    if (d && (o.memoizedState = u, Et = !0), o = o.queue, il(Id.bind(null, i, o, e), [e]), o.getSnapshot !== t || d || et !== null && et.memoizedState.tag & 1) {
      if (i.flags |= 2048, Oi(9, Dd.bind(null, i, o, u, t), void 0, null), tt === null) throw Error(s(349));
      (fr & 30) !== 0 || _d(i, t, u);
    }
    return u;
  }
  function _d(e, t, i) {
    e.flags |= 16384, e = { getSnapshot: t, value: i }, t = Fe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Fe.updateQueue = t, t.stores = [e]) : (i = t.stores, i === null ? t.stores = [e] : i.push(e));
  }
  function Dd(e, t, i, o) {
    t.value = i, t.getSnapshot = o, Vd(t) && qd(e);
  }
  function Id(e, t, i) {
    return i(function() {
      Vd(t) && qd(e);
    });
  }
  function Vd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var i = t();
      return !Gt(e, i);
    } catch {
      return !0;
    }
  }
  function qd(e) {
    var t = Sn(e, 1);
    t !== null && Jt(t, e, 1, -1);
  }
  function Od(e) {
    var t = un();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: qi, lastRenderedState: e }, t.queue = e, e = e.dispatch = ey.bind(null, Fe, e), [t.memoizedState, e];
  }
  function Oi(e, t, i, o) {
    return e = { tag: e, create: t, destroy: i, deps: o, next: null }, t = Fe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Fe.updateQueue = t, t.lastEffect = e.next = e) : (i = t.lastEffect, i === null ? t.lastEffect = e.next = e : (o = i.next, i.next = e, e.next = o, t.lastEffect = e)), e;
  }
  function Fd() {
    return Ot().memoizedState;
  }
  function eo(e, t, i, o) {
    var u = un();
    Fe.flags |= e, u.memoizedState = Oi(1 | t, i, void 0, o === void 0 ? null : o);
  }
  function to(e, t, i, o) {
    var u = Ot();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Xe !== null) {
      var v = Xe.memoizedState;
      if (d = v.destroy, o !== null && Ja(o, v.deps)) {
        u.memoizedState = Oi(t, i, d, o);
        return;
      }
    }
    Fe.flags |= e, u.memoizedState = Oi(1 | t, i, d, o);
  }
  function Bd(e, t) {
    return eo(8390656, 8, e, t);
  }
  function il(e, t) {
    return to(2048, 8, e, t);
  }
  function zd(e, t) {
    return to(4, 2, e, t);
  }
  function $d(e, t) {
    return to(4, 4, e, t);
  }
  function Ud(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Wd(e, t, i) {
    return i = i != null ? i.concat([e]) : null, to(4, 4, Ud.bind(null, t, e), i);
  }
  function sl() {
  }
  function Hd(e, t) {
    var i = Ot();
    t = t === void 0 ? null : t;
    var o = i.memoizedState;
    return o !== null && t !== null && Ja(t, o[1]) ? o[0] : (i.memoizedState = [e, t], e);
  }
  function Kd(e, t) {
    var i = Ot();
    t = t === void 0 ? null : t;
    var o = i.memoizedState;
    return o !== null && t !== null && Ja(t, o[1]) ? o[0] : (e = e(), i.memoizedState = [e, t], e);
  }
  function Gd(e, t, i) {
    return (fr & 21) === 0 ? (e.baseState && (e.baseState = !1, Et = !0), e.memoizedState = i) : (Gt(i, t) || (i = Ec(), Fe.lanes |= i, hr |= i, e.baseState = !0), t);
  }
  function Zv(e, t) {
    var i = Ee;
    Ee = i !== 0 && 4 > i ? i : 4, e(!0);
    var o = Za.transition;
    Za.transition = {};
    try {
      e(!1), t();
    } finally {
      Ee = i, Za.transition = o;
    }
  }
  function Qd() {
    return Ot().memoizedState;
  }
  function Jv(e, t, i) {
    var o = Gn(e);
    if (i = { lane: o, action: i, hasEagerState: !1, eagerState: null, next: null }, Yd(e)) Xd(t, i);
    else if (i = Pd(e, t, i, o), i !== null) {
      var u = wt();
      Jt(i, e, o, u), Zd(i, t, o);
    }
  }
  function ey(e, t, i) {
    var o = Gn(e), u = { lane: o, action: i, hasEagerState: !1, eagerState: null, next: null };
    if (Yd(e)) Xd(t, u);
    else {
      var d = e.alternate;
      if (e.lanes === 0 && (d === null || d.lanes === 0) && (d = t.lastRenderedReducer, d !== null)) try {
        var v = t.lastRenderedState, w = d(v, i);
        if (u.hasEagerState = !0, u.eagerState = w, Gt(w, v)) {
          var j = t.interleaved;
          j === null ? (u.next = u, Ha(t)) : (u.next = j.next, j.next = u), t.interleaved = u;
          return;
        }
      } catch {
      } finally {
      }
      i = Pd(e, t, u, o), i !== null && (u = wt(), Jt(i, e, o, u), Zd(i, t, o));
    }
  }
  function Yd(e) {
    var t = e.alternate;
    return e === Fe || t !== null && t === Fe;
  }
  function Xd(e, t) {
    Ii = Js = !0;
    var i = e.pending;
    i === null ? t.next = t : (t.next = i.next, i.next = t), e.pending = t;
  }
  function Zd(e, t, i) {
    if ((i & 4194240) !== 0) {
      var o = t.lanes;
      o &= e.pendingLanes, i |= o, t.lanes = i, aa(e, i);
    }
  }
  var no = { readContext: qt, useCallback: ft, useContext: ft, useEffect: ft, useImperativeHandle: ft, useInsertionEffect: ft, useLayoutEffect: ft, useMemo: ft, useReducer: ft, useRef: ft, useState: ft, useDebugValue: ft, useDeferredValue: ft, useTransition: ft, useMutableSource: ft, useSyncExternalStore: ft, useId: ft, unstable_isNewReconciler: !1 }, ty = { readContext: qt, useCallback: function(e, t) {
    return un().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: qt, useEffect: Bd, useImperativeHandle: function(e, t, i) {
    return i = i != null ? i.concat([e]) : null, eo(
      4194308,
      4,
      Ud.bind(null, t, e),
      i
    );
  }, useLayoutEffect: function(e, t) {
    return eo(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return eo(4, 2, e, t);
  }, useMemo: function(e, t) {
    var i = un();
    return t = t === void 0 ? null : t, e = e(), i.memoizedState = [e, t], e;
  }, useReducer: function(e, t, i) {
    var o = un();
    return t = i !== void 0 ? i(t) : t, o.memoizedState = o.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, o.queue = e, e = e.dispatch = Jv.bind(null, Fe, e), [o.memoizedState, e];
  }, useRef: function(e) {
    var t = un();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Od, useDebugValue: sl, useDeferredValue: function(e) {
    return un().memoizedState = e;
  }, useTransition: function() {
    var e = Od(!1), t = e[0];
    return e = Zv.bind(null, e[1]), un().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, i) {
    var o = Fe, u = un();
    if (De) {
      if (i === void 0) throw Error(s(407));
      i = i();
    } else {
      if (i = t(), tt === null) throw Error(s(349));
      (fr & 30) !== 0 || _d(o, t, i);
    }
    u.memoizedState = i;
    var d = { value: i, getSnapshot: t };
    return u.queue = d, Bd(Id.bind(
      null,
      o,
      d,
      e
    ), [e]), o.flags |= 2048, Oi(9, Dd.bind(null, o, d, i, t), void 0, null), i;
  }, useId: function() {
    var e = un(), t = tt.identifierPrefix;
    if (De) {
      var i = wn, o = xn;
      i = (o & ~(1 << 32 - Kt(o) - 1)).toString(32) + i, t = ":" + t + "R" + i, i = Vi++, 0 < i && (t += "H" + i.toString(32)), t += ":";
    } else i = Xv++, t = ":" + t + "r" + i.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, ny = {
    readContext: qt,
    useCallback: Hd,
    useContext: qt,
    useEffect: il,
    useImperativeHandle: Wd,
    useInsertionEffect: zd,
    useLayoutEffect: $d,
    useMemo: Kd,
    useReducer: nl,
    useRef: Fd,
    useState: function() {
      return nl(qi);
    },
    useDebugValue: sl,
    useDeferredValue: function(e) {
      var t = Ot();
      return Gd(t, Xe.memoizedState, e);
    },
    useTransition: function() {
      var e = nl(qi)[0], t = Ot().memoizedState;
      return [e, t];
    },
    useMutableSource: Ld,
    useSyncExternalStore: bd,
    useId: Qd,
    unstable_isNewReconciler: !1
  }, ry = { readContext: qt, useCallback: Hd, useContext: qt, useEffect: il, useImperativeHandle: Wd, useInsertionEffect: zd, useLayoutEffect: $d, useMemo: Kd, useReducer: rl, useRef: Fd, useState: function() {
    return rl(qi);
  }, useDebugValue: sl, useDeferredValue: function(e) {
    var t = Ot();
    return Xe === null ? t.memoizedState = e : Gd(t, Xe.memoizedState, e);
  }, useTransition: function() {
    var e = rl(qi)[0], t = Ot().memoizedState;
    return [e, t];
  }, useMutableSource: Ld, useSyncExternalStore: bd, useId: Qd, unstable_isNewReconciler: !1 };
  function Yt(e, t) {
    if (e && e.defaultProps) {
      t = W({}, t), e = e.defaultProps;
      for (var i in e) t[i] === void 0 && (t[i] = e[i]);
      return t;
    }
    return t;
  }
  function ol(e, t, i, o) {
    t = e.memoizedState, i = i(o, t), i = i == null ? t : W({}, t, i), e.memoizedState = i, e.lanes === 0 && (e.updateQueue.baseState = i);
  }
  var ro = { isMounted: function(e) {
    return (e = e._reactInternals) ? sr(e) === e : !1;
  }, enqueueSetState: function(e, t, i) {
    e = e._reactInternals;
    var o = wt(), u = Gn(e), d = jn(o, u);
    d.payload = t, i != null && (d.callback = i), t = Un(e, d, u), t !== null && (Jt(t, e, u, o), Qs(t, e, u));
  }, enqueueReplaceState: function(e, t, i) {
    e = e._reactInternals;
    var o = wt(), u = Gn(e), d = jn(o, u);
    d.tag = 1, d.payload = t, i != null && (d.callback = i), t = Un(e, d, u), t !== null && (Jt(t, e, u, o), Qs(t, e, u));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var i = wt(), o = Gn(e), u = jn(i, o);
    u.tag = 2, t != null && (u.callback = t), t = Un(e, u, o), t !== null && (Jt(t, e, o, i), Qs(t, e, o));
  } };
  function Jd(e, t, i, o, u, d, v) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(o, d, v) : t.prototype && t.prototype.isPureReactComponent ? !Ci(i, o) || !Ci(u, d) : !0;
  }
  function ef(e, t, i) {
    var o = !1, u = Bn, d = t.contextType;
    return typeof d == "object" && d !== null ? d = qt(d) : (u = kt(t) ? ar : dt.current, o = t.contextTypes, d = (o = o != null) ? Dr(e, u) : Bn), t = new t(i, d), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = ro, e.stateNode = t, t._reactInternals = e, o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = u, e.__reactInternalMemoizedMaskedChildContext = d), t;
  }
  function tf(e, t, i, o) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(i, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(i, o), t.state !== e && ro.enqueueReplaceState(t, t.state, null);
  }
  function al(e, t, i, o) {
    var u = e.stateNode;
    u.props = i, u.state = e.memoizedState, u.refs = {}, Ka(e);
    var d = t.contextType;
    typeof d == "object" && d !== null ? u.context = qt(d) : (d = kt(t) ? ar : dt.current, u.context = Dr(e, d)), u.state = e.memoizedState, d = t.getDerivedStateFromProps, typeof d == "function" && (ol(e, t, d, i), u.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (t = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), t !== u.state && ro.enqueueReplaceState(u, u.state, null), Ys(e, i, u, o), u.state = e.memoizedState), typeof u.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function $r(e, t) {
    try {
      var i = "", o = t;
      do
        i += ge(o), o = o.return;
      while (o);
      var u = i;
    } catch (d) {
      u = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: e, source: t, stack: u, digest: null };
  }
  function ll(e, t, i) {
    return { value: e, source: null, stack: i ?? null, digest: t ?? null };
  }
  function ul(e, t) {
    try {
      console.error(t.value);
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  var iy = typeof WeakMap == "function" ? WeakMap : Map;
  function nf(e, t, i) {
    i = jn(-1, i), i.tag = 3, i.payload = { element: null };
    var o = t.value;
    return i.callback = function() {
      co || (co = !0, El = o), ul(e, t);
    }, i;
  }
  function rf(e, t, i) {
    i = jn(-1, i), i.tag = 3;
    var o = e.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var u = t.value;
      i.payload = function() {
        return o(u);
      }, i.callback = function() {
        ul(e, t);
      };
    }
    var d = e.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (i.callback = function() {
      ul(e, t), typeof o != "function" && (Hn === null ? Hn = /* @__PURE__ */ new Set([this]) : Hn.add(this));
      var v = t.stack;
      this.componentDidCatch(t.value, { componentStack: v !== null ? v : "" });
    }), i;
  }
  function sf(e, t, i) {
    var o = e.pingCache;
    if (o === null) {
      o = e.pingCache = new iy();
      var u = /* @__PURE__ */ new Set();
      o.set(t, u);
    } else u = o.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), o.set(t, u));
    u.has(i) || (u.add(i), e = yy.bind(null, e, t, i), t.then(e, e));
  }
  function of(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function af(e, t, i, o, u) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, i.flags |= 131072, i.flags &= -52805, i.tag === 1 && (i.alternate === null ? i.tag = 17 : (t = jn(-1, 1), t.tag = 2, Un(i, t, 1))), i.lanes |= 1), e) : (e.flags |= 65536, e.lanes = u, e);
  }
  var sy = Q.ReactCurrentOwner, Et = !1;
  function xt(e, t, i, o) {
    t.child = e === null ? Td(t, null, i, o) : Or(t, e.child, i, o);
  }
  function lf(e, t, i, o, u) {
    i = i.render;
    var d = t.ref;
    return Br(t, u), o = el(e, t, i, o, d, u), i = tl(), e !== null && !Et ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~u, kn(e, t, u)) : (De && i && Va(t), t.flags |= 1, xt(e, t, o, u), t.child);
  }
  function uf(e, t, i, o, u) {
    if (e === null) {
      var d = i.type;
      return typeof d == "function" && !Rl(d) && d.defaultProps === void 0 && i.compare === null && i.defaultProps === void 0 ? (t.tag = 15, t.type = d, cf(e, t, d, o, u)) : (e = vo(i.type, null, o, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (d = e.child, (e.lanes & u) === 0) {
      var v = d.memoizedProps;
      if (i = i.compare, i = i !== null ? i : Ci, i(v, o) && e.ref === t.ref) return kn(e, t, u);
    }
    return t.flags |= 1, e = Yn(d, o), e.ref = t.ref, e.return = t, t.child = e;
  }
  function cf(e, t, i, o, u) {
    if (e !== null) {
      var d = e.memoizedProps;
      if (Ci(d, o) && e.ref === t.ref) if (Et = !1, t.pendingProps = o = d, (e.lanes & u) !== 0) (e.flags & 131072) !== 0 && (Et = !0);
      else return t.lanes = e.lanes, kn(e, t, u);
    }
    return cl(e, t, i, o, u);
  }
  function df(e, t, i) {
    var o = t.pendingProps, u = o.children, d = e !== null ? e.memoizedState : null;
    if (o.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ne(Wr, Rt), Rt |= i;
    else {
      if ((i & 1073741824) === 0) return e = d !== null ? d.baseLanes | i : i, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ne(Wr, Rt), Rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : i, Ne(Wr, Rt), Rt |= o;
    }
    else d !== null ? (o = d.baseLanes | i, t.memoizedState = null) : o = i, Ne(Wr, Rt), Rt |= o;
    return xt(e, t, u, i), t.child;
  }
  function ff(e, t) {
    var i = t.ref;
    (e === null && i !== null || e !== null && e.ref !== i) && (t.flags |= 512, t.flags |= 2097152);
  }
  function cl(e, t, i, o, u) {
    var d = kt(i) ? ar : dt.current;
    return d = Dr(t, d), Br(t, u), i = el(e, t, i, o, d, u), o = tl(), e !== null && !Et ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~u, kn(e, t, u)) : (De && o && Va(t), t.flags |= 1, xt(e, t, i, u), t.child);
  }
  function hf(e, t, i, o, u) {
    if (kt(i)) {
      var d = !0;
      Bs(t);
    } else d = !1;
    if (Br(t, u), t.stateNode === null) so(e, t), ef(t, i, o), al(t, i, o, u), o = !0;
    else if (e === null) {
      var v = t.stateNode, w = t.memoizedProps;
      v.props = w;
      var j = v.context, M = i.contextType;
      typeof M == "object" && M !== null ? M = qt(M) : (M = kt(i) ? ar : dt.current, M = Dr(t, M));
      var O = i.getDerivedStateFromProps, F = typeof O == "function" || typeof v.getSnapshotBeforeUpdate == "function";
      F || typeof v.UNSAFE_componentWillReceiveProps != "function" && typeof v.componentWillReceiveProps != "function" || (w !== o || j !== M) && tf(t, v, o, M), $n = !1;
      var q = t.memoizedState;
      v.state = q, Ys(t, o, v, u), j = t.memoizedState, w !== o || q !== j || jt.current || $n ? (typeof O == "function" && (ol(t, i, O, o), j = t.memoizedState), (w = $n || Jd(t, i, w, o, q, j, M)) ? (F || typeof v.UNSAFE_componentWillMount != "function" && typeof v.componentWillMount != "function" || (typeof v.componentWillMount == "function" && v.componentWillMount(), typeof v.UNSAFE_componentWillMount == "function" && v.UNSAFE_componentWillMount()), typeof v.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof v.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = o, t.memoizedState = j), v.props = o, v.state = j, v.context = M, o = w) : (typeof v.componentDidMount == "function" && (t.flags |= 4194308), o = !1);
    } else {
      v = t.stateNode, Nd(e, t), w = t.memoizedProps, M = t.type === t.elementType ? w : Yt(t.type, w), v.props = M, F = t.pendingProps, q = v.context, j = i.contextType, typeof j == "object" && j !== null ? j = qt(j) : (j = kt(i) ? ar : dt.current, j = Dr(t, j));
      var G = i.getDerivedStateFromProps;
      (O = typeof G == "function" || typeof v.getSnapshotBeforeUpdate == "function") || typeof v.UNSAFE_componentWillReceiveProps != "function" && typeof v.componentWillReceiveProps != "function" || (w !== F || q !== j) && tf(t, v, o, j), $n = !1, q = t.memoizedState, v.state = q, Ys(t, o, v, u);
      var X = t.memoizedState;
      w !== F || q !== X || jt.current || $n ? (typeof G == "function" && (ol(t, i, G, o), X = t.memoizedState), (M = $n || Jd(t, i, M, o, q, X, j) || !1) ? (O || typeof v.UNSAFE_componentWillUpdate != "function" && typeof v.componentWillUpdate != "function" || (typeof v.componentWillUpdate == "function" && v.componentWillUpdate(o, X, j), typeof v.UNSAFE_componentWillUpdate == "function" && v.UNSAFE_componentWillUpdate(o, X, j)), typeof v.componentDidUpdate == "function" && (t.flags |= 4), typeof v.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof v.componentDidUpdate != "function" || w === e.memoizedProps && q === e.memoizedState || (t.flags |= 4), typeof v.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && q === e.memoizedState || (t.flags |= 1024), t.memoizedProps = o, t.memoizedState = X), v.props = o, v.state = X, v.context = j, o = M) : (typeof v.componentDidUpdate != "function" || w === e.memoizedProps && q === e.memoizedState || (t.flags |= 4), typeof v.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && q === e.memoizedState || (t.flags |= 1024), o = !1);
    }
    return dl(e, t, i, o, d, u);
  }
  function dl(e, t, i, o, u, d) {
    ff(e, t);
    var v = (t.flags & 128) !== 0;
    if (!o && !v) return u && vd(t, i, !1), kn(e, t, d);
    o = t.stateNode, sy.current = t;
    var w = v && typeof i.getDerivedStateFromError != "function" ? null : o.render();
    return t.flags |= 1, e !== null && v ? (t.child = Or(t, e.child, null, d), t.child = Or(t, null, w, d)) : xt(e, t, w, d), t.memoizedState = o.state, u && vd(t, i, !0), t.child;
  }
  function pf(e) {
    var t = e.stateNode;
    t.pendingContext ? md(e, t.pendingContext, t.pendingContext !== t.context) : t.context && md(e, t.context, !1), Ga(e, t.containerInfo);
  }
  function mf(e, t, i, o, u) {
    return qr(), Ba(u), t.flags |= 256, xt(e, t, i, o), t.child;
  }
  var fl = { dehydrated: null, treeContext: null, retryLane: 0 };
  function hl(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function gf(e, t, i) {
    var o = t.pendingProps, u = Oe.current, d = !1, v = (t.flags & 128) !== 0, w;
    if ((w = v) || (w = e !== null && e.memoizedState === null ? !1 : (u & 2) !== 0), w ? (d = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (u |= 1), Ne(Oe, u & 1), e === null)
      return Fa(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (v = o.children, e = o.fallback, d ? (o = t.mode, d = t.child, v = { mode: "hidden", children: v }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = v) : d = yo(v, o, 0, null), e = vr(e, o, i, null), d.return = t, e.return = t, d.sibling = e, t.child = d, t.child.memoizedState = hl(i), t.memoizedState = fl, e) : pl(t, v));
    if (u = e.memoizedState, u !== null && (w = u.dehydrated, w !== null)) return oy(e, t, v, o, w, u, i);
    if (d) {
      d = o.fallback, v = t.mode, u = e.child, w = u.sibling;
      var j = { mode: "hidden", children: o.children };
      return (v & 1) === 0 && t.child !== u ? (o = t.child, o.childLanes = 0, o.pendingProps = j, t.deletions = null) : (o = Yn(u, j), o.subtreeFlags = u.subtreeFlags & 14680064), w !== null ? d = Yn(w, d) : (d = vr(d, v, i, null), d.flags |= 2), d.return = t, o.return = t, o.sibling = d, t.child = o, o = d, d = t.child, v = e.child.memoizedState, v = v === null ? hl(i) : { baseLanes: v.baseLanes | i, cachePool: null, transitions: v.transitions }, d.memoizedState = v, d.childLanes = e.childLanes & ~i, t.memoizedState = fl, o;
    }
    return d = e.child, e = d.sibling, o = Yn(d, { mode: "visible", children: o.children }), (t.mode & 1) === 0 && (o.lanes = i), o.return = t, o.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = o, t.memoizedState = null, o;
  }
  function pl(e, t) {
    return t = yo({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function io(e, t, i, o) {
    return o !== null && Ba(o), Or(t, e.child, null, i), e = pl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function oy(e, t, i, o, u, d, v) {
    if (i)
      return t.flags & 256 ? (t.flags &= -257, o = ll(Error(s(422))), io(e, t, v, o)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (d = o.fallback, u = t.mode, o = yo({ mode: "visible", children: o.children }, u, 0, null), d = vr(d, u, v, null), d.flags |= 2, o.return = t, d.return = t, o.sibling = d, t.child = o, (t.mode & 1) !== 0 && Or(t, e.child, null, v), t.child.memoizedState = hl(v), t.memoizedState = fl, d);
    if ((t.mode & 1) === 0) return io(e, t, v, null);
    if (u.data === "$!") {
      if (o = u.nextSibling && u.nextSibling.dataset, o) var w = o.dgst;
      return o = w, d = Error(s(419)), o = ll(d, o, void 0), io(e, t, v, o);
    }
    if (w = (v & e.childLanes) !== 0, Et || w) {
      if (o = tt, o !== null) {
        switch (v & -v) {
          case 4:
            u = 2;
            break;
          case 16:
            u = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            u = 32;
            break;
          case 536870912:
            u = 268435456;
            break;
          default:
            u = 0;
        }
        u = (u & (o.suspendedLanes | v)) !== 0 ? 0 : u, u !== 0 && u !== d.retryLane && (d.retryLane = u, Sn(e, u), Jt(o, e, u, -1));
      }
      return Ml(), o = ll(Error(s(421))), io(e, t, v, o);
    }
    return u.data === "$?" ? (t.flags |= 128, t.child = e.child, t = xy.bind(null, e), u._reactRetry = t, null) : (e = d.treeContext, Mt = On(u.nextSibling), At = t, De = !0, Qt = null, e !== null && (It[Vt++] = xn, It[Vt++] = wn, It[Vt++] = lr, xn = e.id, wn = e.overflow, lr = t), t = pl(t, o.children), t.flags |= 4096, t);
  }
  function vf(e, t, i) {
    e.lanes |= t;
    var o = e.alternate;
    o !== null && (o.lanes |= t), Wa(e.return, t, i);
  }
  function ml(e, t, i, o, u) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: o, tail: i, tailMode: u } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = i, d.tailMode = u);
  }
  function yf(e, t, i) {
    var o = t.pendingProps, u = o.revealOrder, d = o.tail;
    if (xt(e, t, o.children, i), o = Oe.current, (o & 2) !== 0) o = o & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && vf(e, i, t);
        else if (e.tag === 19) vf(e, i, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      o &= 1;
    }
    if (Ne(Oe, o), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (u) {
      case "forwards":
        for (i = t.child, u = null; i !== null; ) e = i.alternate, e !== null && Xs(e) === null && (u = i), i = i.sibling;
        i = u, i === null ? (u = t.child, t.child = null) : (u = i.sibling, i.sibling = null), ml(t, !1, u, i, d);
        break;
      case "backwards":
        for (i = null, u = t.child, t.child = null; u !== null; ) {
          if (e = u.alternate, e !== null && Xs(e) === null) {
            t.child = u;
            break;
          }
          e = u.sibling, u.sibling = i, i = u, u = e;
        }
        ml(t, !0, i, null, d);
        break;
      case "together":
        ml(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function so(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function kn(e, t, i) {
    if (e !== null && (t.dependencies = e.dependencies), hr |= t.lanes, (i & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, i = Yn(e, e.pendingProps), t.child = i, i.return = t; e.sibling !== null; ) e = e.sibling, i = i.sibling = Yn(e, e.pendingProps), i.return = t;
      i.sibling = null;
    }
    return t.child;
  }
  function ay(e, t, i) {
    switch (t.tag) {
      case 3:
        pf(t), qr();
        break;
      case 5:
        Rd(t);
        break;
      case 1:
        kt(t.type) && Bs(t);
        break;
      case 4:
        Ga(t, t.stateNode.containerInfo);
        break;
      case 10:
        var o = t.type._context, u = t.memoizedProps.value;
        Ne(Ks, o._currentValue), o._currentValue = u;
        break;
      case 13:
        if (o = t.memoizedState, o !== null)
          return o.dehydrated !== null ? (Ne(Oe, Oe.current & 1), t.flags |= 128, null) : (i & t.child.childLanes) !== 0 ? gf(e, t, i) : (Ne(Oe, Oe.current & 1), e = kn(e, t, i), e !== null ? e.sibling : null);
        Ne(Oe, Oe.current & 1);
        break;
      case 19:
        if (o = (i & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (o) return yf(e, t, i);
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Ne(Oe, Oe.current), o) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, df(e, t, i);
    }
    return kn(e, t, i);
  }
  var xf, gl, wf, Sf;
  xf = function(e, t) {
    for (var i = t.child; i !== null; ) {
      if (i.tag === 5 || i.tag === 6) e.appendChild(i.stateNode);
      else if (i.tag !== 4 && i.child !== null) {
        i.child.return = i, i = i.child;
        continue;
      }
      if (i === t) break;
      for (; i.sibling === null; ) {
        if (i.return === null || i.return === t) return;
        i = i.return;
      }
      i.sibling.return = i.return, i = i.sibling;
    }
  }, gl = function() {
  }, wf = function(e, t, i, o) {
    var u = e.memoizedProps;
    if (u !== o) {
      e = t.stateNode, dr(ln.current);
      var d = null;
      switch (i) {
        case "input":
          u = de(e, u), o = de(e, o), d = [];
          break;
        case "select":
          u = W({}, u, { value: void 0 }), o = W({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          u = mn(e, u), o = mn(e, o), d = [];
          break;
        default:
          typeof u.onClick != "function" && typeof o.onClick == "function" && (e.onclick = qs);
      }
      b(i, o);
      var v;
      i = null;
      for (M in u) if (!o.hasOwnProperty(M) && u.hasOwnProperty(M) && u[M] != null) if (M === "style") {
        var w = u[M];
        for (v in w) w.hasOwnProperty(v) && (i || (i = {}), i[v] = "");
      } else M !== "dangerouslySetInnerHTML" && M !== "children" && M !== "suppressContentEditableWarning" && M !== "suppressHydrationWarning" && M !== "autoFocus" && (c.hasOwnProperty(M) ? d || (d = []) : (d = d || []).push(M, null));
      for (M in o) {
        var j = o[M];
        if (w = u != null ? u[M] : void 0, o.hasOwnProperty(M) && j !== w && (j != null || w != null)) if (M === "style") if (w) {
          for (v in w) !w.hasOwnProperty(v) || j && j.hasOwnProperty(v) || (i || (i = {}), i[v] = "");
          for (v in j) j.hasOwnProperty(v) && w[v] !== j[v] && (i || (i = {}), i[v] = j[v]);
        } else i || (d || (d = []), d.push(
          M,
          i
        )), i = j;
        else M === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, w = w ? w.__html : void 0, j != null && w !== j && (d = d || []).push(M, j)) : M === "children" ? typeof j != "string" && typeof j != "number" || (d = d || []).push(M, "" + j) : M !== "suppressContentEditableWarning" && M !== "suppressHydrationWarning" && (c.hasOwnProperty(M) ? (j != null && M === "onScroll" && Me("scroll", e), d || w === j || (d = [])) : (d = d || []).push(M, j));
      }
      i && (d = d || []).push("style", i);
      var M = d;
      (t.updateQueue = M) && (t.flags |= 4);
    }
  }, Sf = function(e, t, i, o) {
    i !== o && (t.flags |= 4);
  };
  function Fi(e, t) {
    if (!De) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var i = null; t !== null; ) t.alternate !== null && (i = t), t = t.sibling;
        i === null ? e.tail = null : i.sibling = null;
        break;
      case "collapsed":
        i = e.tail;
        for (var o = null; i !== null; ) i.alternate !== null && (o = i), i = i.sibling;
        o === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : o.sibling = null;
    }
  }
  function ht(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, i = 0, o = 0;
    if (t) for (var u = e.child; u !== null; ) i |= u.lanes | u.childLanes, o |= u.subtreeFlags & 14680064, o |= u.flags & 14680064, u.return = e, u = u.sibling;
    else for (u = e.child; u !== null; ) i |= u.lanes | u.childLanes, o |= u.subtreeFlags, o |= u.flags, u.return = e, u = u.sibling;
    return e.subtreeFlags |= o, e.childLanes = i, t;
  }
  function ly(e, t, i) {
    var o = t.pendingProps;
    switch (qa(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ht(t), null;
      case 1:
        return kt(t.type) && Fs(), ht(t), null;
      case 3:
        return o = t.stateNode, zr(), Re(jt), Re(dt), Xa(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (e === null || e.child === null) && (Ws(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Qt !== null && (Pl(Qt), Qt = null))), gl(e, t), ht(t), null;
      case 5:
        Qa(t);
        var u = dr(Di.current);
        if (i = t.type, e !== null && t.stateNode != null) wf(e, t, i, o, u), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!o) {
            if (t.stateNode === null) throw Error(s(166));
            return ht(t), null;
          }
          if (e = dr(ln.current), Ws(t)) {
            o = t.stateNode, i = t.type;
            var d = t.memoizedProps;
            switch (o[an] = t, o[Mi] = d, e = (t.mode & 1) !== 0, i) {
              case "dialog":
                Me("cancel", o), Me("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Me("load", o);
                break;
              case "video":
              case "audio":
                for (u = 0; u < Pi.length; u++) Me(Pi[u], o);
                break;
              case "source":
                Me("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Me(
                  "error",
                  o
                ), Me("load", o);
                break;
              case "details":
                Me("toggle", o);
                break;
              case "input":
                le(o, d), Me("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Me("invalid", o);
                break;
              case "textarea":
                ut(o, d), Me("invalid", o);
            }
            b(i, d), u = null;
            for (var v in d) if (d.hasOwnProperty(v)) {
              var w = d[v];
              v === "children" ? typeof w == "string" ? o.textContent !== w && (d.suppressHydrationWarning !== !0 && Vs(o.textContent, w, e), u = ["children", w]) : typeof w == "number" && o.textContent !== "" + w && (d.suppressHydrationWarning !== !0 && Vs(
                o.textContent,
                w,
                e
              ), u = ["children", "" + w]) : c.hasOwnProperty(v) && w != null && v === "onScroll" && Me("scroll", o);
            }
            switch (i) {
              case "input":
                pn(o), St(o, d, !0);
                break;
              case "textarea":
                pn(o), rr(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = qs);
            }
            o = u, t.updateQueue = o, o !== null && (t.flags |= 4);
          } else {
            v = u.nodeType === 9 ? u : u.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = it(i)), e === "http://www.w3.org/1999/xhtml" ? i === "script" ? (e = v.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof o.is == "string" ? e = v.createElement(i, { is: o.is }) : (e = v.createElement(i), i === "select" && (v = e, o.multiple ? v.multiple = !0 : o.size && (v.size = o.size))) : e = v.createElementNS(e, i), e[an] = t, e[Mi] = o, xf(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (v = ue(i, o), i) {
                case "dialog":
                  Me("cancel", e), Me("close", e), u = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Me("load", e), u = o;
                  break;
                case "video":
                case "audio":
                  for (u = 0; u < Pi.length; u++) Me(Pi[u], e);
                  u = o;
                  break;
                case "source":
                  Me("error", e), u = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Me(
                    "error",
                    e
                  ), Me("load", e), u = o;
                  break;
                case "details":
                  Me("toggle", e), u = o;
                  break;
                case "input":
                  le(e, o), u = de(e, o), Me("invalid", e);
                  break;
                case "option":
                  u = o;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!o.multiple }, u = W({}, o, { value: void 0 }), Me("invalid", e);
                  break;
                case "textarea":
                  ut(e, o), u = mn(e, o), Me("invalid", e);
                  break;
                default:
                  u = o;
              }
              b(i, u), w = u;
              for (d in w) if (w.hasOwnProperty(d)) {
                var j = w[d];
                d === "style" ? li(e, j) : d === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, j != null && gn(e, j)) : d === "children" ? typeof j == "string" ? (i !== "textarea" || j !== "") && Ln(e, j) : typeof j == "number" && Ln(e, "" + j) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (c.hasOwnProperty(d) ? j != null && d === "onScroll" && Me("scroll", e) : j != null && V(e, d, j, v));
              }
              switch (i) {
                case "input":
                  pn(e), St(e, o, !1);
                  break;
                case "textarea":
                  pn(e), rr(e);
                  break;
                case "option":
                  o.value != null && e.setAttribute("value", "" + ye(o.value));
                  break;
                case "select":
                  e.multiple = !!o.multiple, d = o.value, d != null ? rn(e, !!o.multiple, d, !1) : o.defaultValue != null && rn(
                    e,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof u.onClick == "function" && (e.onclick = qs);
              }
              switch (i) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return ht(t), null;
      case 6:
        if (e && t.stateNode != null) Sf(e, t, e.memoizedProps, o);
        else {
          if (typeof o != "string" && t.stateNode === null) throw Error(s(166));
          if (i = dr(Di.current), dr(ln.current), Ws(t)) {
            if (o = t.stateNode, i = t.memoizedProps, o[an] = t, (d = o.nodeValue !== i) && (e = At, e !== null)) switch (e.tag) {
              case 3:
                Vs(o.nodeValue, i, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Vs(o.nodeValue, i, (e.mode & 1) !== 0);
            }
            d && (t.flags |= 4);
          } else o = (i.nodeType === 9 ? i : i.ownerDocument).createTextNode(o), o[an] = t, t.stateNode = o;
        }
        return ht(t), null;
      case 13:
        if (Re(Oe), o = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (De && Mt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) kd(), qr(), t.flags |= 98560, d = !1;
          else if (d = Ws(t), o !== null && o.dehydrated !== null) {
            if (e === null) {
              if (!d) throw Error(s(318));
              if (d = t.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(s(317));
              d[an] = t;
            } else qr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ht(t), d = !1;
          } else Qt !== null && (Pl(Qt), Qt = null), d = !0;
          if (!d) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = i, t) : (o = o !== null, o !== (e !== null && e.memoizedState !== null) && o && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Oe.current & 1) !== 0 ? Ze === 0 && (Ze = 3) : Ml())), t.updateQueue !== null && (t.flags |= 4), ht(t), null);
      case 4:
        return zr(), gl(e, t), e === null && Ni(t.stateNode.containerInfo), ht(t), null;
      case 10:
        return Ua(t.type._context), ht(t), null;
      case 17:
        return kt(t.type) && Fs(), ht(t), null;
      case 19:
        if (Re(Oe), d = t.memoizedState, d === null) return ht(t), null;
        if (o = (t.flags & 128) !== 0, v = d.rendering, v === null) if (o) Fi(d, !1);
        else {
          if (Ze !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (v = Xs(e), v !== null) {
              for (t.flags |= 128, Fi(d, !1), o = v.updateQueue, o !== null && (t.updateQueue = o, t.flags |= 4), t.subtreeFlags = 0, o = i, i = t.child; i !== null; ) d = i, e = o, d.flags &= 14680066, v = d.alternate, v === null ? (d.childLanes = 0, d.lanes = e, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = v.childLanes, d.lanes = v.lanes, d.child = v.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = v.memoizedProps, d.memoizedState = v.memoizedState, d.updateQueue = v.updateQueue, d.type = v.type, e = v.dependencies, d.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), i = i.sibling;
              return Ne(Oe, Oe.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          d.tail !== null && We() > Hr && (t.flags |= 128, o = !0, Fi(d, !1), t.lanes = 4194304);
        }
        else {
          if (!o) if (e = Xs(v), e !== null) {
            if (t.flags |= 128, o = !0, i = e.updateQueue, i !== null && (t.updateQueue = i, t.flags |= 4), Fi(d, !0), d.tail === null && d.tailMode === "hidden" && !v.alternate && !De) return ht(t), null;
          } else 2 * We() - d.renderingStartTime > Hr && i !== 1073741824 && (t.flags |= 128, o = !0, Fi(d, !1), t.lanes = 4194304);
          d.isBackwards ? (v.sibling = t.child, t.child = v) : (i = d.last, i !== null ? i.sibling = v : t.child = v, d.last = v);
        }
        return d.tail !== null ? (t = d.tail, d.rendering = t, d.tail = t.sibling, d.renderingStartTime = We(), t.sibling = null, i = Oe.current, Ne(Oe, o ? i & 1 | 2 : i & 1), t) : (ht(t), null);
      case 22:
      case 23:
        return Al(), o = t.memoizedState !== null, e !== null && e.memoizedState !== null !== o && (t.flags |= 8192), o && (t.mode & 1) !== 0 ? (Rt & 1073741824) !== 0 && (ht(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ht(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function uy(e, t) {
    switch (qa(t), t.tag) {
      case 1:
        return kt(t.type) && Fs(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return zr(), Re(jt), Re(dt), Xa(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Qa(t), null;
      case 13:
        if (Re(Oe), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          qr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Re(Oe), null;
      case 4:
        return zr(), null;
      case 10:
        return Ua(t.type._context), null;
      case 22:
      case 23:
        return Al(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var oo = !1, pt = !1, cy = typeof WeakSet == "function" ? WeakSet : Set, Y = null;
  function Ur(e, t) {
    var i = e.ref;
    if (i !== null) if (typeof i == "function") try {
      i(null);
    } catch (o) {
      ze(e, t, o);
    }
    else i.current = null;
  }
  function vl(e, t, i) {
    try {
      i();
    } catch (o) {
      ze(e, t, o);
    }
  }
  var jf = !1;
  function dy(e, t) {
    if (Aa = Ts, e = Jc(), Sa(e)) {
      if ("selectionStart" in e) var i = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        i = (i = e.ownerDocument) && i.defaultView || window;
        var o = i.getSelection && i.getSelection();
        if (o && o.rangeCount !== 0) {
          i = o.anchorNode;
          var u = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            i.nodeType, d.nodeType;
          } catch {
            i = null;
            break e;
          }
          var v = 0, w = -1, j = -1, M = 0, O = 0, F = e, q = null;
          t: for (; ; ) {
            for (var G; F !== i || u !== 0 && F.nodeType !== 3 || (w = v + u), F !== d || o !== 0 && F.nodeType !== 3 || (j = v + o), F.nodeType === 3 && (v += F.nodeValue.length), (G = F.firstChild) !== null; )
              q = F, F = G;
            for (; ; ) {
              if (F === e) break t;
              if (q === i && ++M === u && (w = v), q === d && ++O === o && (j = v), (G = F.nextSibling) !== null) break;
              F = q, q = F.parentNode;
            }
            F = G;
          }
          i = w === -1 || j === -1 ? null : { start: w, end: j };
        } else i = null;
      }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (Ma = { focusedElem: e, selectionRange: i }, Ts = !1, Y = t; Y !== null; ) if (t = Y, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Y = e;
    else for (; Y !== null; ) {
      t = Y;
      try {
        var X = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (X !== null) {
              var Z = X.memoizedProps, He = X.memoizedState, P = t.stateNode, k = P.getSnapshotBeforeUpdate(t.elementType === t.type ? Z : Yt(t.type, Z), He);
              P.__reactInternalSnapshotBeforeUpdate = k;
            }
            break;
          case 3:
            var A = t.stateNode.containerInfo;
            A.nodeType === 1 ? A.textContent = "" : A.nodeType === 9 && A.documentElement && A.removeChild(A.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (z) {
        ze(t, t.return, z);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, Y = e;
        break;
      }
      Y = t.return;
    }
    return X = jf, jf = !1, X;
  }
  function Bi(e, t, i) {
    var o = t.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var u = o = o.next;
      do {
        if ((u.tag & e) === e) {
          var d = u.destroy;
          u.destroy = void 0, d !== void 0 && vl(t, i, d);
        }
        u = u.next;
      } while (u !== o);
    }
  }
  function ao(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var i = t = t.next;
      do {
        if ((i.tag & e) === e) {
          var o = i.create;
          i.destroy = o();
        }
        i = i.next;
      } while (i !== t);
    }
  }
  function yl(e) {
    var t = e.ref;
    if (t !== null) {
      var i = e.stateNode;
      switch (e.tag) {
        case 5:
          e = i;
          break;
        default:
          e = i;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function kf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, kf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[an], delete t[Mi], delete t[_a], delete t[Kv], delete t[Gv])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ef(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Cf(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ef(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xl(e, t, i) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? i.nodeType === 8 ? i.parentNode.insertBefore(e, t) : i.insertBefore(e, t) : (i.nodeType === 8 ? (t = i.parentNode, t.insertBefore(e, i)) : (t = i, t.appendChild(e)), i = i._reactRootContainer, i != null || t.onclick !== null || (t.onclick = qs));
    else if (o !== 4 && (e = e.child, e !== null)) for (xl(e, t, i), e = e.sibling; e !== null; ) xl(e, t, i), e = e.sibling;
  }
  function wl(e, t, i) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? i.insertBefore(e, t) : i.appendChild(e);
    else if (o !== 4 && (e = e.child, e !== null)) for (wl(e, t, i), e = e.sibling; e !== null; ) wl(e, t, i), e = e.sibling;
  }
  var st = null, Xt = !1;
  function Wn(e, t, i) {
    for (i = i.child; i !== null; ) Tf(e, t, i), i = i.sibling;
  }
  function Tf(e, t, i) {
    if (on && typeof on.onCommitFiberUnmount == "function") try {
      on.onCommitFiberUnmount(ws, i);
    } catch {
    }
    switch (i.tag) {
      case 5:
        pt || Ur(i, t);
      case 6:
        var o = st, u = Xt;
        st = null, Wn(e, t, i), st = o, Xt = u, st !== null && (Xt ? (e = st, i = i.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(i) : e.removeChild(i)) : st.removeChild(i.stateNode));
        break;
      case 18:
        st !== null && (Xt ? (e = st, i = i.stateNode, e.nodeType === 8 ? ba(e.parentNode, i) : e.nodeType === 1 && ba(e, i), xi(e)) : ba(st, i.stateNode));
        break;
      case 4:
        o = st, u = Xt, st = i.stateNode.containerInfo, Xt = !0, Wn(e, t, i), st = o, Xt = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!pt && (o = i.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          u = o = o.next;
          do {
            var d = u, v = d.destroy;
            d = d.tag, v !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && vl(i, t, v), u = u.next;
          } while (u !== o);
        }
        Wn(e, t, i);
        break;
      case 1:
        if (!pt && (Ur(i, t), o = i.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = i.memoizedProps, o.state = i.memoizedState, o.componentWillUnmount();
        } catch (w) {
          ze(i, t, w);
        }
        Wn(e, t, i);
        break;
      case 21:
        Wn(e, t, i);
        break;
      case 22:
        i.mode & 1 ? (pt = (o = pt) || i.memoizedState !== null, Wn(e, t, i), pt = o) : Wn(e, t, i);
        break;
      default:
        Wn(e, t, i);
    }
  }
  function Pf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var i = e.stateNode;
      i === null && (i = e.stateNode = new cy()), t.forEach(function(o) {
        var u = wy.bind(null, e, o);
        i.has(o) || (i.add(o), o.then(u, u));
      });
    }
  }
  function Zt(e, t) {
    var i = t.deletions;
    if (i !== null) for (var o = 0; o < i.length; o++) {
      var u = i[o];
      try {
        var d = e, v = t, w = v;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              st = w.stateNode, Xt = !1;
              break e;
            case 3:
              st = w.stateNode.containerInfo, Xt = !0;
              break e;
            case 4:
              st = w.stateNode.containerInfo, Xt = !0;
              break e;
          }
          w = w.return;
        }
        if (st === null) throw Error(s(160));
        Tf(d, v, u), st = null, Xt = !1;
        var j = u.alternate;
        j !== null && (j.return = null), u.return = null;
      } catch (M) {
        ze(u, t, M);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Nf(t, e), t = t.sibling;
  }
  function Nf(e, t) {
    var i = e.alternate, o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Zt(t, e), cn(e), o & 4) {
          try {
            Bi(3, e, e.return), ao(3, e);
          } catch (Z) {
            ze(e, e.return, Z);
          }
          try {
            Bi(5, e, e.return);
          } catch (Z) {
            ze(e, e.return, Z);
          }
        }
        break;
      case 1:
        Zt(t, e), cn(e), o & 512 && i !== null && Ur(i, i.return);
        break;
      case 5:
        if (Zt(t, e), cn(e), o & 512 && i !== null && Ur(i, i.return), e.flags & 32) {
          var u = e.stateNode;
          try {
            Ln(u, "");
          } catch (Z) {
            ze(e, e.return, Z);
          }
        }
        if (o & 4 && (u = e.stateNode, u != null)) {
          var d = e.memoizedProps, v = i !== null ? i.memoizedProps : d, w = e.type, j = e.updateQueue;
          if (e.updateQueue = null, j !== null) try {
            w === "input" && d.type === "radio" && d.name != null && Ve(u, d), ue(w, v);
            var M = ue(w, d);
            for (v = 0; v < j.length; v += 2) {
              var O = j[v], F = j[v + 1];
              O === "style" ? li(u, F) : O === "dangerouslySetInnerHTML" ? gn(u, F) : O === "children" ? Ln(u, F) : V(u, O, F, M);
            }
            switch (w) {
              case "input":
                Ce(u, d);
                break;
              case "textarea":
                vt(u, d);
                break;
              case "select":
                var q = u._wrapperState.wasMultiple;
                u._wrapperState.wasMultiple = !!d.multiple;
                var G = d.value;
                G != null ? rn(u, !!d.multiple, G, !1) : q !== !!d.multiple && (d.defaultValue != null ? rn(
                  u,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : rn(u, !!d.multiple, d.multiple ? [] : "", !1));
            }
            u[Mi] = d;
          } catch (Z) {
            ze(e, e.return, Z);
          }
        }
        break;
      case 6:
        if (Zt(t, e), cn(e), o & 4) {
          if (e.stateNode === null) throw Error(s(162));
          u = e.stateNode, d = e.memoizedProps;
          try {
            u.nodeValue = d;
          } catch (Z) {
            ze(e, e.return, Z);
          }
        }
        break;
      case 3:
        if (Zt(t, e), cn(e), o & 4 && i !== null && i.memoizedState.isDehydrated) try {
          xi(t.containerInfo);
        } catch (Z) {
          ze(e, e.return, Z);
        }
        break;
      case 4:
        Zt(t, e), cn(e);
        break;
      case 13:
        Zt(t, e), cn(e), u = e.child, u.flags & 8192 && (d = u.memoizedState !== null, u.stateNode.isHidden = d, !d || u.alternate !== null && u.alternate.memoizedState !== null || (kl = We())), o & 4 && Pf(e);
        break;
      case 22:
        if (O = i !== null && i.memoizedState !== null, e.mode & 1 ? (pt = (M = pt) || O, Zt(t, e), pt = M) : Zt(t, e), cn(e), o & 8192) {
          if (M = e.memoizedState !== null, (e.stateNode.isHidden = M) && !O && (e.mode & 1) !== 0) for (Y = e, O = e.child; O !== null; ) {
            for (F = Y = O; Y !== null; ) {
              switch (q = Y, G = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Bi(4, q, q.return);
                  break;
                case 1:
                  Ur(q, q.return);
                  var X = q.stateNode;
                  if (typeof X.componentWillUnmount == "function") {
                    o = q, i = q.return;
                    try {
                      t = o, X.props = t.memoizedProps, X.state = t.memoizedState, X.componentWillUnmount();
                    } catch (Z) {
                      ze(o, i, Z);
                    }
                  }
                  break;
                case 5:
                  Ur(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    Rf(F);
                    continue;
                  }
              }
              G !== null ? (G.return = q, Y = G) : Rf(F);
            }
            O = O.sibling;
          }
          e: for (O = null, F = e; ; ) {
            if (F.tag === 5) {
              if (O === null) {
                O = F;
                try {
                  u = F.stateNode, M ? (d = u.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (w = F.stateNode, j = F.memoizedProps.style, v = j != null && j.hasOwnProperty("display") ? j.display : null, w.style.display = ai("display", v));
                } catch (Z) {
                  ze(e, e.return, Z);
                }
              }
            } else if (F.tag === 6) {
              if (O === null) try {
                F.stateNode.nodeValue = M ? "" : F.memoizedProps;
              } catch (Z) {
                ze(e, e.return, Z);
              }
            } else if ((F.tag !== 22 && F.tag !== 23 || F.memoizedState === null || F === e) && F.child !== null) {
              F.child.return = F, F = F.child;
              continue;
            }
            if (F === e) break e;
            for (; F.sibling === null; ) {
              if (F.return === null || F.return === e) break e;
              O === F && (O = null), F = F.return;
            }
            O === F && (O = null), F.sibling.return = F.return, F = F.sibling;
          }
        }
        break;
      case 19:
        Zt(t, e), cn(e), o & 4 && Pf(e);
        break;
      case 21:
        break;
      default:
        Zt(
          t,
          e
        ), cn(e);
    }
  }
  function cn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var i = e.return; i !== null; ) {
            if (Ef(i)) {
              var o = i;
              break e;
            }
            i = i.return;
          }
          throw Error(s(160));
        }
        switch (o.tag) {
          case 5:
            var u = o.stateNode;
            o.flags & 32 && (Ln(u, ""), o.flags &= -33);
            var d = Cf(e);
            wl(e, d, u);
            break;
          case 3:
          case 4:
            var v = o.stateNode.containerInfo, w = Cf(e);
            xl(e, w, v);
            break;
          default:
            throw Error(s(161));
        }
      } catch (j) {
        ze(e, e.return, j);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function fy(e, t, i) {
    Y = e, Af(e);
  }
  function Af(e, t, i) {
    for (var o = (e.mode & 1) !== 0; Y !== null; ) {
      var u = Y, d = u.child;
      if (u.tag === 22 && o) {
        var v = u.memoizedState !== null || oo;
        if (!v) {
          var w = u.alternate, j = w !== null && w.memoizedState !== null || pt;
          w = oo;
          var M = pt;
          if (oo = v, (pt = j) && !M) for (Y = u; Y !== null; ) v = Y, j = v.child, v.tag === 22 && v.memoizedState !== null ? Lf(u) : j !== null ? (j.return = v, Y = j) : Lf(u);
          for (; d !== null; ) Y = d, Af(d), d = d.sibling;
          Y = u, oo = w, pt = M;
        }
        Mf(e);
      } else (u.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = u, Y = d) : Mf(e);
    }
  }
  function Mf(e) {
    for (; Y !== null; ) {
      var t = Y;
      if ((t.flags & 8772) !== 0) {
        var i = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              pt || ao(5, t);
              break;
            case 1:
              var o = t.stateNode;
              if (t.flags & 4 && !pt) if (i === null) o.componentDidMount();
              else {
                var u = t.elementType === t.type ? i.memoizedProps : Yt(t.type, i.memoizedProps);
                o.componentDidUpdate(u, i.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = t.updateQueue;
              d !== null && Md(t, d, o);
              break;
            case 3:
              var v = t.updateQueue;
              if (v !== null) {
                if (i = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    i = t.child.stateNode;
                    break;
                  case 1:
                    i = t.child.stateNode;
                }
                Md(t, v, i);
              }
              break;
            case 5:
              var w = t.stateNode;
              if (i === null && t.flags & 4) {
                i = w;
                var j = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    j.autoFocus && i.focus();
                    break;
                  case "img":
                    j.src && (i.src = j.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var M = t.alternate;
                if (M !== null) {
                  var O = M.memoizedState;
                  if (O !== null) {
                    var F = O.dehydrated;
                    F !== null && xi(F);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(s(163));
          }
          pt || t.flags & 512 && yl(t);
        } catch (q) {
          ze(t, t.return, q);
        }
      }
      if (t === e) {
        Y = null;
        break;
      }
      if (i = t.sibling, i !== null) {
        i.return = t.return, Y = i;
        break;
      }
      Y = t.return;
    }
  }
  function Rf(e) {
    for (; Y !== null; ) {
      var t = Y;
      if (t === e) {
        Y = null;
        break;
      }
      var i = t.sibling;
      if (i !== null) {
        i.return = t.return, Y = i;
        break;
      }
      Y = t.return;
    }
  }
  function Lf(e) {
    for (; Y !== null; ) {
      var t = Y;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var i = t.return;
            try {
              ao(4, t);
            } catch (j) {
              ze(t, i, j);
            }
            break;
          case 1:
            var o = t.stateNode;
            if (typeof o.componentDidMount == "function") {
              var u = t.return;
              try {
                o.componentDidMount();
              } catch (j) {
                ze(t, u, j);
              }
            }
            var d = t.return;
            try {
              yl(t);
            } catch (j) {
              ze(t, d, j);
            }
            break;
          case 5:
            var v = t.return;
            try {
              yl(t);
            } catch (j) {
              ze(t, v, j);
            }
        }
      } catch (j) {
        ze(t, t.return, j);
      }
      if (t === e) {
        Y = null;
        break;
      }
      var w = t.sibling;
      if (w !== null) {
        w.return = t.return, Y = w;
        break;
      }
      Y = t.return;
    }
  }
  var hy = Math.ceil, lo = Q.ReactCurrentDispatcher, Sl = Q.ReactCurrentOwner, Ft = Q.ReactCurrentBatchConfig, we = 0, tt = null, Ye = null, ot = 0, Rt = 0, Wr = Fn(0), Ze = 0, zi = null, hr = 0, uo = 0, jl = 0, $i = null, Ct = null, kl = 0, Hr = 1 / 0, En = null, co = !1, El = null, Hn = null, fo = !1, Kn = null, ho = 0, Ui = 0, Cl = null, po = -1, mo = 0;
  function wt() {
    return (we & 6) !== 0 ? We() : po !== -1 ? po : po = We();
  }
  function Gn(e) {
    return (e.mode & 1) === 0 ? 1 : (we & 2) !== 0 && ot !== 0 ? ot & -ot : Yv.transition !== null ? (mo === 0 && (mo = Ec()), mo) : (e = Ee, e !== 0 || (e = window.event, e = e === void 0 ? 16 : bc(e.type)), e);
  }
  function Jt(e, t, i, o) {
    if (50 < Ui) throw Ui = 0, Cl = null, Error(s(185));
    pi(e, i, o), ((we & 2) === 0 || e !== tt) && (e === tt && ((we & 2) === 0 && (uo |= i), Ze === 4 && Qn(e, ot)), Tt(e, o), i === 1 && we === 0 && (t.mode & 1) === 0 && (Hr = We() + 500, zs && zn()));
  }
  function Tt(e, t) {
    var i = e.callbackNode;
    Yg(e, t);
    var o = ks(e, e === tt ? ot : 0);
    if (o === 0) i !== null && Sc(i), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = o & -o, e.callbackPriority !== t) {
      if (i != null && Sc(i), t === 1) e.tag === 0 ? Qv(_f.bind(null, e)) : yd(_f.bind(null, e)), Wv(function() {
        (we & 6) === 0 && zn();
      }), i = null;
      else {
        switch (Cc(o)) {
          case 1:
            i = ia;
            break;
          case 4:
            i = jc;
            break;
          case 16:
            i = xs;
            break;
          case 536870912:
            i = kc;
            break;
          default:
            i = xs;
        }
        i = zf(i, bf.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = i;
    }
  }
  function bf(e, t) {
    if (po = -1, mo = 0, (we & 6) !== 0) throw Error(s(327));
    var i = e.callbackNode;
    if (Kr() && e.callbackNode !== i) return null;
    var o = ks(e, e === tt ? ot : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & e.expiredLanes) !== 0 || t) t = go(e, o);
    else {
      t = o;
      var u = we;
      we |= 2;
      var d = If();
      (tt !== e || ot !== t) && (En = null, Hr = We() + 500, mr(e, t));
      do
        try {
          gy();
          break;
        } catch (w) {
          Df(e, w);
        }
      while (!0);
      $a(), lo.current = d, we = u, Ye !== null ? t = 0 : (tt = null, ot = 0, t = Ze);
    }
    if (t !== 0) {
      if (t === 2 && (u = sa(e), u !== 0 && (o = u, t = Tl(e, u))), t === 1) throw i = zi, mr(e, 0), Qn(e, o), Tt(e, We()), i;
      if (t === 6) Qn(e, o);
      else {
        if (u = e.current.alternate, (o & 30) === 0 && !py(u) && (t = go(e, o), t === 2 && (d = sa(e), d !== 0 && (o = d, t = Tl(e, d))), t === 1)) throw i = zi, mr(e, 0), Qn(e, o), Tt(e, We()), i;
        switch (e.finishedWork = u, e.finishedLanes = o, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            gr(e, Ct, En);
            break;
          case 3:
            if (Qn(e, o), (o & 130023424) === o && (t = kl + 500 - We(), 10 < t)) {
              if (ks(e, 0) !== 0) break;
              if (u = e.suspendedLanes, (u & o) !== o) {
                wt(), e.pingedLanes |= e.suspendedLanes & u;
                break;
              }
              e.timeoutHandle = La(gr.bind(null, e, Ct, En), t);
              break;
            }
            gr(e, Ct, En);
            break;
          case 4:
            if (Qn(e, o), (o & 4194240) === o) break;
            for (t = e.eventTimes, u = -1; 0 < o; ) {
              var v = 31 - Kt(o);
              d = 1 << v, v = t[v], v > u && (u = v), o &= ~d;
            }
            if (o = u, o = We() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * hy(o / 1960)) - o, 10 < o) {
              e.timeoutHandle = La(gr.bind(null, e, Ct, En), o);
              break;
            }
            gr(e, Ct, En);
            break;
          case 5:
            gr(e, Ct, En);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return Tt(e, We()), e.callbackNode === i ? bf.bind(null, e) : null;
  }
  function Tl(e, t) {
    var i = $i;
    return e.current.memoizedState.isDehydrated && (mr(e, t).flags |= 256), e = go(e, t), e !== 2 && (t = Ct, Ct = i, t !== null && Pl(t)), e;
  }
  function Pl(e) {
    Ct === null ? Ct = e : Ct.push.apply(Ct, e);
  }
  function py(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var i = t.updateQueue;
        if (i !== null && (i = i.stores, i !== null)) for (var o = 0; o < i.length; o++) {
          var u = i[o], d = u.getSnapshot;
          u = u.value;
          try {
            if (!Gt(d(), u)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (i = t.child, t.subtreeFlags & 16384 && i !== null) i.return = t, t = i;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Qn(e, t) {
    for (t &= ~jl, t &= ~uo, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var i = 31 - Kt(t), o = 1 << i;
      e[i] = -1, t &= ~o;
    }
  }
  function _f(e) {
    if ((we & 6) !== 0) throw Error(s(327));
    Kr();
    var t = ks(e, 0);
    if ((t & 1) === 0) return Tt(e, We()), null;
    var i = go(e, t);
    if (e.tag !== 0 && i === 2) {
      var o = sa(e);
      o !== 0 && (t = o, i = Tl(e, o));
    }
    if (i === 1) throw i = zi, mr(e, 0), Qn(e, t), Tt(e, We()), i;
    if (i === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, gr(e, Ct, En), Tt(e, We()), null;
  }
  function Nl(e, t) {
    var i = we;
    we |= 1;
    try {
      return e(t);
    } finally {
      we = i, we === 0 && (Hr = We() + 500, zs && zn());
    }
  }
  function pr(e) {
    Kn !== null && Kn.tag === 0 && (we & 6) === 0 && Kr();
    var t = we;
    we |= 1;
    var i = Ft.transition, o = Ee;
    try {
      if (Ft.transition = null, Ee = 1, e) return e();
    } finally {
      Ee = o, Ft.transition = i, we = t, (we & 6) === 0 && zn();
    }
  }
  function Al() {
    Rt = Wr.current, Re(Wr);
  }
  function mr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var i = e.timeoutHandle;
    if (i !== -1 && (e.timeoutHandle = -1, Uv(i)), Ye !== null) for (i = Ye.return; i !== null; ) {
      var o = i;
      switch (qa(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && Fs();
          break;
        case 3:
          zr(), Re(jt), Re(dt), Xa();
          break;
        case 5:
          Qa(o);
          break;
        case 4:
          zr();
          break;
        case 13:
          Re(Oe);
          break;
        case 19:
          Re(Oe);
          break;
        case 10:
          Ua(o.type._context);
          break;
        case 22:
        case 23:
          Al();
      }
      i = i.return;
    }
    if (tt = e, Ye = e = Yn(e.current, null), ot = Rt = t, Ze = 0, zi = null, jl = uo = hr = 0, Ct = $i = null, cr !== null) {
      for (t = 0; t < cr.length; t++) if (i = cr[t], o = i.interleaved, o !== null) {
        i.interleaved = null;
        var u = o.next, d = i.pending;
        if (d !== null) {
          var v = d.next;
          d.next = u, o.next = v;
        }
        i.pending = o;
      }
      cr = null;
    }
    return e;
  }
  function Df(e, t) {
    do {
      var i = Ye;
      try {
        if ($a(), Zs.current = no, Js) {
          for (var o = Fe.memoizedState; o !== null; ) {
            var u = o.queue;
            u !== null && (u.pending = null), o = o.next;
          }
          Js = !1;
        }
        if (fr = 0, et = Xe = Fe = null, Ii = !1, Vi = 0, Sl.current = null, i === null || i.return === null) {
          Ze = 1, zi = t, Ye = null;
          break;
        }
        e: {
          var d = e, v = i.return, w = i, j = t;
          if (t = ot, w.flags |= 32768, j !== null && typeof j == "object" && typeof j.then == "function") {
            var M = j, O = w, F = O.tag;
            if ((O.mode & 1) === 0 && (F === 0 || F === 11 || F === 15)) {
              var q = O.alternate;
              q ? (O.updateQueue = q.updateQueue, O.memoizedState = q.memoizedState, O.lanes = q.lanes) : (O.updateQueue = null, O.memoizedState = null);
            }
            var G = of(v);
            if (G !== null) {
              G.flags &= -257, af(G, v, w, d, t), G.mode & 1 && sf(d, M, t), t = G, j = M;
              var X = t.updateQueue;
              if (X === null) {
                var Z = /* @__PURE__ */ new Set();
                Z.add(j), t.updateQueue = Z;
              } else X.add(j);
              break e;
            } else {
              if ((t & 1) === 0) {
                sf(d, M, t), Ml();
                break e;
              }
              j = Error(s(426));
            }
          } else if (De && w.mode & 1) {
            var He = of(v);
            if (He !== null) {
              (He.flags & 65536) === 0 && (He.flags |= 256), af(He, v, w, d, t), Ba($r(j, w));
              break e;
            }
          }
          d = j = $r(j, w), Ze !== 4 && (Ze = 2), $i === null ? $i = [d] : $i.push(d), d = v;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, t &= -t, d.lanes |= t;
                var P = nf(d, j, t);
                Ad(d, P);
                break e;
              case 1:
                w = j;
                var k = d.type, A = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof k.getDerivedStateFromError == "function" || A !== null && typeof A.componentDidCatch == "function" && (Hn === null || !Hn.has(A)))) {
                  d.flags |= 65536, t &= -t, d.lanes |= t;
                  var z = rf(d, w, t);
                  Ad(d, z);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        qf(i);
      } catch (ee) {
        t = ee, Ye === i && i !== null && (Ye = i = i.return);
        continue;
      }
      break;
    } while (!0);
  }
  function If() {
    var e = lo.current;
    return lo.current = no, e === null ? no : e;
  }
  function Ml() {
    (Ze === 0 || Ze === 3 || Ze === 2) && (Ze = 4), tt === null || (hr & 268435455) === 0 && (uo & 268435455) === 0 || Qn(tt, ot);
  }
  function go(e, t) {
    var i = we;
    we |= 2;
    var o = If();
    (tt !== e || ot !== t) && (En = null, mr(e, t));
    do
      try {
        my();
        break;
      } catch (u) {
        Df(e, u);
      }
    while (!0);
    if ($a(), we = i, lo.current = o, Ye !== null) throw Error(s(261));
    return tt = null, ot = 0, Ze;
  }
  function my() {
    for (; Ye !== null; ) Vf(Ye);
  }
  function gy() {
    for (; Ye !== null && !Bg(); ) Vf(Ye);
  }
  function Vf(e) {
    var t = Bf(e.alternate, e, Rt);
    e.memoizedProps = e.pendingProps, t === null ? qf(e) : Ye = t, Sl.current = null;
  }
  function qf(e) {
    var t = e;
    do {
      var i = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (i = ly(i, t, Rt), i !== null) {
          Ye = i;
          return;
        }
      } else {
        if (i = uy(i, t), i !== null) {
          i.flags &= 32767, Ye = i;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Ze = 6, Ye = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Ye = t;
        return;
      }
      Ye = t = e;
    } while (t !== null);
    Ze === 0 && (Ze = 5);
  }
  function gr(e, t, i) {
    var o = Ee, u = Ft.transition;
    try {
      Ft.transition = null, Ee = 1, vy(e, t, i, o);
    } finally {
      Ft.transition = u, Ee = o;
    }
    return null;
  }
  function vy(e, t, i, o) {
    do
      Kr();
    while (Kn !== null);
    if ((we & 6) !== 0) throw Error(s(327));
    i = e.finishedWork;
    var u = e.finishedLanes;
    if (i === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, i === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var d = i.lanes | i.childLanes;
    if (Xg(e, d), e === tt && (Ye = tt = null, ot = 0), (i.subtreeFlags & 2064) === 0 && (i.flags & 2064) === 0 || fo || (fo = !0, zf(xs, function() {
      return Kr(), null;
    })), d = (i.flags & 15990) !== 0, (i.subtreeFlags & 15990) !== 0 || d) {
      d = Ft.transition, Ft.transition = null;
      var v = Ee;
      Ee = 1;
      var w = we;
      we |= 4, Sl.current = null, dy(e, i), Nf(i, e), Vv(Ma), Ts = !!Aa, Ma = Aa = null, e.current = i, fy(i), zg(), we = w, Ee = v, Ft.transition = d;
    } else e.current = i;
    if (fo && (fo = !1, Kn = e, ho = u), d = e.pendingLanes, d === 0 && (Hn = null), Wg(i.stateNode), Tt(e, We()), t !== null) for (o = e.onRecoverableError, i = 0; i < t.length; i++) u = t[i], o(u.value, { componentStack: u.stack, digest: u.digest });
    if (co) throw co = !1, e = El, El = null, e;
    return (ho & 1) !== 0 && e.tag !== 0 && Kr(), d = e.pendingLanes, (d & 1) !== 0 ? e === Cl ? Ui++ : (Ui = 0, Cl = e) : Ui = 0, zn(), null;
  }
  function Kr() {
    if (Kn !== null) {
      var e = Cc(ho), t = Ft.transition, i = Ee;
      try {
        if (Ft.transition = null, Ee = 16 > e ? 16 : e, Kn === null) var o = !1;
        else {
          if (e = Kn, Kn = null, ho = 0, (we & 6) !== 0) throw Error(s(331));
          var u = we;
          for (we |= 4, Y = e.current; Y !== null; ) {
            var d = Y, v = d.child;
            if ((Y.flags & 16) !== 0) {
              var w = d.deletions;
              if (w !== null) {
                for (var j = 0; j < w.length; j++) {
                  var M = w[j];
                  for (Y = M; Y !== null; ) {
                    var O = Y;
                    switch (O.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Bi(8, O, d);
                    }
                    var F = O.child;
                    if (F !== null) F.return = O, Y = F;
                    else for (; Y !== null; ) {
                      O = Y;
                      var q = O.sibling, G = O.return;
                      if (kf(O), O === M) {
                        Y = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = G, Y = q;
                        break;
                      }
                      Y = G;
                    }
                  }
                }
                var X = d.alternate;
                if (X !== null) {
                  var Z = X.child;
                  if (Z !== null) {
                    X.child = null;
                    do {
                      var He = Z.sibling;
                      Z.sibling = null, Z = He;
                    } while (Z !== null);
                  }
                }
                Y = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && v !== null) v.return = d, Y = v;
            else e: for (; Y !== null; ) {
              if (d = Y, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Bi(9, d, d.return);
              }
              var P = d.sibling;
              if (P !== null) {
                P.return = d.return, Y = P;
                break e;
              }
              Y = d.return;
            }
          }
          var k = e.current;
          for (Y = k; Y !== null; ) {
            v = Y;
            var A = v.child;
            if ((v.subtreeFlags & 2064) !== 0 && A !== null) A.return = v, Y = A;
            else e: for (v = k; Y !== null; ) {
              if (w = Y, (w.flags & 2048) !== 0) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    ao(9, w);
                }
              } catch (ee) {
                ze(w, w.return, ee);
              }
              if (w === v) {
                Y = null;
                break e;
              }
              var z = w.sibling;
              if (z !== null) {
                z.return = w.return, Y = z;
                break e;
              }
              Y = w.return;
            }
          }
          if (we = u, zn(), on && typeof on.onPostCommitFiberRoot == "function") try {
            on.onPostCommitFiberRoot(ws, e);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ee = i, Ft.transition = t;
      }
    }
    return !1;
  }
  function Of(e, t, i) {
    t = $r(i, t), t = nf(e, t, 1), e = Un(e, t, 1), t = wt(), e !== null && (pi(e, 1, t), Tt(e, t));
  }
  function ze(e, t, i) {
    if (e.tag === 3) Of(e, e, i);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Of(t, e, i);
        break;
      } else if (t.tag === 1) {
        var o = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Hn === null || !Hn.has(o))) {
          e = $r(i, e), e = rf(t, e, 1), t = Un(t, e, 1), e = wt(), t !== null && (pi(t, 1, e), Tt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function yy(e, t, i) {
    var o = e.pingCache;
    o !== null && o.delete(t), t = wt(), e.pingedLanes |= e.suspendedLanes & i, tt === e && (ot & i) === i && (Ze === 4 || Ze === 3 && (ot & 130023424) === ot && 500 > We() - kl ? mr(e, 0) : jl |= i), Tt(e, t);
  }
  function Ff(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = js, js <<= 1, (js & 130023424) === 0 && (js = 4194304)));
    var i = wt();
    e = Sn(e, t), e !== null && (pi(e, t, i), Tt(e, i));
  }
  function xy(e) {
    var t = e.memoizedState, i = 0;
    t !== null && (i = t.retryLane), Ff(e, i);
  }
  function wy(e, t) {
    var i = 0;
    switch (e.tag) {
      case 13:
        var o = e.stateNode, u = e.memoizedState;
        u !== null && (i = u.retryLane);
        break;
      case 19:
        o = e.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    o !== null && o.delete(t), Ff(e, i);
  }
  var Bf;
  Bf = function(e, t, i) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || jt.current) Et = !0;
    else {
      if ((e.lanes & i) === 0 && (t.flags & 128) === 0) return Et = !1, ay(e, t, i);
      Et = (e.flags & 131072) !== 0;
    }
    else Et = !1, De && (t.flags & 1048576) !== 0 && xd(t, Us, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var o = t.type;
        so(e, t), e = t.pendingProps;
        var u = Dr(t, dt.current);
        Br(t, i), u = el(null, t, o, e, u, i);
        var d = tl();
        return t.flags |= 1, typeof u == "object" && u !== null && typeof u.render == "function" && u.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, kt(o) ? (d = !0, Bs(t)) : d = !1, t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, Ka(t), u.updater = ro, t.stateNode = u, u._reactInternals = t, al(t, o, e, i), t = dl(null, t, o, !0, d, i)) : (t.tag = 0, De && d && Va(t), xt(null, t, u, i), t = t.child), t;
      case 16:
        o = t.elementType;
        e: {
          switch (so(e, t), e = t.pendingProps, u = o._init, o = u(o._payload), t.type = o, u = t.tag = jy(o), e = Yt(o, e), u) {
            case 0:
              t = cl(null, t, o, e, i);
              break e;
            case 1:
              t = hf(null, t, o, e, i);
              break e;
            case 11:
              t = lf(null, t, o, e, i);
              break e;
            case 14:
              t = uf(null, t, o, Yt(o.type, e), i);
              break e;
          }
          throw Error(s(
            306,
            o,
            ""
          ));
        }
        return t;
      case 0:
        return o = t.type, u = t.pendingProps, u = t.elementType === o ? u : Yt(o, u), cl(e, t, o, u, i);
      case 1:
        return o = t.type, u = t.pendingProps, u = t.elementType === o ? u : Yt(o, u), hf(e, t, o, u, i);
      case 3:
        e: {
          if (pf(t), e === null) throw Error(s(387));
          o = t.pendingProps, d = t.memoizedState, u = d.element, Nd(e, t), Ys(t, o, null, i);
          var v = t.memoizedState;
          if (o = v.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: v.cache, pendingSuspenseBoundaries: v.pendingSuspenseBoundaries, transitions: v.transitions }, t.updateQueue.baseState = d, t.memoizedState = d, t.flags & 256) {
            u = $r(Error(s(423)), t), t = mf(e, t, o, i, u);
            break e;
          } else if (o !== u) {
            u = $r(Error(s(424)), t), t = mf(e, t, o, i, u);
            break e;
          } else for (Mt = On(t.stateNode.containerInfo.firstChild), At = t, De = !0, Qt = null, i = Td(t, null, o, i), t.child = i; i; ) i.flags = i.flags & -3 | 4096, i = i.sibling;
          else {
            if (qr(), o === u) {
              t = kn(e, t, i);
              break e;
            }
            xt(e, t, o, i);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Rd(t), e === null && Fa(t), o = t.type, u = t.pendingProps, d = e !== null ? e.memoizedProps : null, v = u.children, Ra(o, u) ? v = null : d !== null && Ra(o, d) && (t.flags |= 32), ff(e, t), xt(e, t, v, i), t.child;
      case 6:
        return e === null && Fa(t), null;
      case 13:
        return gf(e, t, i);
      case 4:
        return Ga(t, t.stateNode.containerInfo), o = t.pendingProps, e === null ? t.child = Or(t, null, o, i) : xt(e, t, o, i), t.child;
      case 11:
        return o = t.type, u = t.pendingProps, u = t.elementType === o ? u : Yt(o, u), lf(e, t, o, u, i);
      case 7:
        return xt(e, t, t.pendingProps, i), t.child;
      case 8:
        return xt(e, t, t.pendingProps.children, i), t.child;
      case 12:
        return xt(e, t, t.pendingProps.children, i), t.child;
      case 10:
        e: {
          if (o = t.type._context, u = t.pendingProps, d = t.memoizedProps, v = u.value, Ne(Ks, o._currentValue), o._currentValue = v, d !== null) if (Gt(d.value, v)) {
            if (d.children === u.children && !jt.current) {
              t = kn(e, t, i);
              break e;
            }
          } else for (d = t.child, d !== null && (d.return = t); d !== null; ) {
            var w = d.dependencies;
            if (w !== null) {
              v = d.child;
              for (var j = w.firstContext; j !== null; ) {
                if (j.context === o) {
                  if (d.tag === 1) {
                    j = jn(-1, i & -i), j.tag = 2;
                    var M = d.updateQueue;
                    if (M !== null) {
                      M = M.shared;
                      var O = M.pending;
                      O === null ? j.next = j : (j.next = O.next, O.next = j), M.pending = j;
                    }
                  }
                  d.lanes |= i, j = d.alternate, j !== null && (j.lanes |= i), Wa(
                    d.return,
                    i,
                    t
                  ), w.lanes |= i;
                  break;
                }
                j = j.next;
              }
            } else if (d.tag === 10) v = d.type === t.type ? null : d.child;
            else if (d.tag === 18) {
              if (v = d.return, v === null) throw Error(s(341));
              v.lanes |= i, w = v.alternate, w !== null && (w.lanes |= i), Wa(v, i, t), v = d.sibling;
            } else v = d.child;
            if (v !== null) v.return = d;
            else for (v = d; v !== null; ) {
              if (v === t) {
                v = null;
                break;
              }
              if (d = v.sibling, d !== null) {
                d.return = v.return, v = d;
                break;
              }
              v = v.return;
            }
            d = v;
          }
          xt(e, t, u.children, i), t = t.child;
        }
        return t;
      case 9:
        return u = t.type, o = t.pendingProps.children, Br(t, i), u = qt(u), o = o(u), t.flags |= 1, xt(e, t, o, i), t.child;
      case 14:
        return o = t.type, u = Yt(o, t.pendingProps), u = Yt(o.type, u), uf(e, t, o, u, i);
      case 15:
        return cf(e, t, t.type, t.pendingProps, i);
      case 17:
        return o = t.type, u = t.pendingProps, u = t.elementType === o ? u : Yt(o, u), so(e, t), t.tag = 1, kt(o) ? (e = !0, Bs(t)) : e = !1, Br(t, i), ef(t, o, u), al(t, o, u, i), dl(null, t, o, !0, e, i);
      case 19:
        return yf(e, t, i);
      case 22:
        return df(e, t, i);
    }
    throw Error(s(156, t.tag));
  };
  function zf(e, t) {
    return wc(e, t);
  }
  function Sy(e, t, i, o) {
    this.tag = e, this.key = i, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Bt(e, t, i, o) {
    return new Sy(e, t, i, o);
  }
  function Rl(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function jy(e) {
    if (typeof e == "function") return Rl(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Ge) return 11;
      if (e === Je) return 14;
    }
    return 2;
  }
  function Yn(e, t) {
    var i = e.alternate;
    return i === null ? (i = Bt(e.tag, t, e.key, e.mode), i.elementType = e.elementType, i.type = e.type, i.stateNode = e.stateNode, i.alternate = e, e.alternate = i) : (i.pendingProps = t, i.type = e.type, i.flags = 0, i.subtreeFlags = 0, i.deletions = null), i.flags = e.flags & 14680064, i.childLanes = e.childLanes, i.lanes = e.lanes, i.child = e.child, i.memoizedProps = e.memoizedProps, i.memoizedState = e.memoizedState, i.updateQueue = e.updateQueue, t = e.dependencies, i.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, i.sibling = e.sibling, i.index = e.index, i.ref = e.ref, i;
  }
  function vo(e, t, i, o, u, d) {
    var v = 2;
    if (o = e, typeof e == "function") Rl(e) && (v = 1);
    else if (typeof e == "string") v = 5;
    else e: switch (e) {
      case U:
        return vr(i.children, u, d, t);
      case $:
        v = 8, u |= 8;
        break;
      case he:
        return e = Bt(12, i, t, u | 2), e.elementType = he, e.lanes = d, e;
      case Te:
        return e = Bt(13, i, t, u), e.elementType = Te, e.lanes = d, e;
      case Ue:
        return e = Bt(19, i, t, u), e.elementType = Ue, e.lanes = d, e;
      case re:
        return yo(i, u, d, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case oe:
            v = 10;
            break e;
          case Ie:
            v = 9;
            break e;
          case Ge:
            v = 11;
            break e;
          case Je:
            v = 14;
            break e;
          case Ae:
            v = 16, o = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = Bt(v, i, t, u), t.elementType = e, t.type = o, t.lanes = d, t;
  }
  function vr(e, t, i, o) {
    return e = Bt(7, e, o, t), e.lanes = i, e;
  }
  function yo(e, t, i, o) {
    return e = Bt(22, e, o, t), e.elementType = re, e.lanes = i, e.stateNode = { isHidden: !1 }, e;
  }
  function Ll(e, t, i) {
    return e = Bt(6, e, null, t), e.lanes = i, e;
  }
  function bl(e, t, i) {
    return t = Bt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = i, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function ky(e, t, i, o, u) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = oa(0), this.expirationTimes = oa(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = oa(0), this.identifierPrefix = o, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null;
  }
  function _l(e, t, i, o, u, d, v, w, j) {
    return e = new ky(e, t, i, w, j), t === 1 ? (t = 1, d === !0 && (t |= 8)) : t = 0, d = Bt(3, null, null, t), e.current = d, d.stateNode = e, d.memoizedState = { element: o, isDehydrated: i, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ka(d), e;
  }
  function Ey(e, t, i) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: J, key: o == null ? null : "" + o, children: e, containerInfo: t, implementation: i };
  }
  function $f(e) {
    if (!e) return Bn;
    e = e._reactInternals;
    e: {
      if (sr(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (kt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var i = e.type;
      if (kt(i)) return gd(e, i, t);
    }
    return t;
  }
  function Uf(e, t, i, o, u, d, v, w, j) {
    return e = _l(i, o, !0, e, u, d, v, w, j), e.context = $f(null), i = e.current, o = wt(), u = Gn(i), d = jn(o, u), d.callback = t ?? null, Un(i, d, u), e.current.lanes = u, pi(e, u, o), Tt(e, o), e;
  }
  function xo(e, t, i, o) {
    var u = t.current, d = wt(), v = Gn(u);
    return i = $f(i), t.context === null ? t.context = i : t.pendingContext = i, t = jn(d, v), t.payload = { element: e }, o = o === void 0 ? null : o, o !== null && (t.callback = o), e = Un(u, t, v), e !== null && (Jt(e, u, v, d), Qs(e, u, v)), v;
  }
  function wo(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Wf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var i = e.retryLane;
      e.retryLane = i !== 0 && i < t ? i : t;
    }
  }
  function Dl(e, t) {
    Wf(e, t), (e = e.alternate) && Wf(e, t);
  }
  function Cy() {
    return null;
  }
  var Hf = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Il(e) {
    this._internalRoot = e;
  }
  So.prototype.render = Il.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    xo(e, t, null, null);
  }, So.prototype.unmount = Il.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      pr(function() {
        xo(null, e, null, null);
      }), t[vn] = null;
    }
  };
  function So(e) {
    this._internalRoot = e;
  }
  So.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Nc();
      e = { blockedOn: null, target: e, priority: t };
      for (var i = 0; i < In.length && t !== 0 && t < In[i].priority; i++) ;
      In.splice(i, 0, e), i === 0 && Rc(e);
    }
  };
  function Vl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function jo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Kf() {
  }
  function Ty(e, t, i, o, u) {
    if (u) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var M = wo(v);
          d.call(M);
        };
      }
      var v = Uf(t, o, e, 0, null, !1, !1, "", Kf);
      return e._reactRootContainer = v, e[vn] = v.current, Ni(e.nodeType === 8 ? e.parentNode : e), pr(), v;
    }
    for (; u = e.lastChild; ) e.removeChild(u);
    if (typeof o == "function") {
      var w = o;
      o = function() {
        var M = wo(j);
        w.call(M);
      };
    }
    var j = _l(e, 0, !1, null, null, !1, !1, "", Kf);
    return e._reactRootContainer = j, e[vn] = j.current, Ni(e.nodeType === 8 ? e.parentNode : e), pr(function() {
      xo(t, j, i, o);
    }), j;
  }
  function ko(e, t, i, o, u) {
    var d = i._reactRootContainer;
    if (d) {
      var v = d;
      if (typeof u == "function") {
        var w = u;
        u = function() {
          var j = wo(v);
          w.call(j);
        };
      }
      xo(t, v, e, u);
    } else v = Ty(i, t, e, u, o);
    return wo(v);
  }
  Tc = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var i = hi(t.pendingLanes);
          i !== 0 && (aa(t, i | 1), Tt(t, We()), (we & 6) === 0 && (Hr = We() + 500, zn()));
        }
        break;
      case 13:
        pr(function() {
          var o = Sn(e, 1);
          if (o !== null) {
            var u = wt();
            Jt(o, e, 1, u);
          }
        }), Dl(e, 1);
    }
  }, la = function(e) {
    if (e.tag === 13) {
      var t = Sn(e, 134217728);
      if (t !== null) {
        var i = wt();
        Jt(t, e, 134217728, i);
      }
      Dl(e, 134217728);
    }
  }, Pc = function(e) {
    if (e.tag === 13) {
      var t = Gn(e), i = Sn(e, t);
      if (i !== null) {
        var o = wt();
        Jt(i, e, t, o);
      }
      Dl(e, t);
    }
  }, Nc = function() {
    return Ee;
  }, Ac = function(e, t) {
    var i = Ee;
    try {
      return Ee = e, t();
    } finally {
      Ee = i;
    }
  }, ct = function(e, t, i) {
    switch (t) {
      case "input":
        if (Ce(e, i), t = i.name, i.type === "radio" && t != null) {
          for (i = e; i.parentNode; ) i = i.parentNode;
          for (i = i.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < i.length; t++) {
            var o = i[t];
            if (o !== e && o.form === e.form) {
              var u = Os(o);
              if (!u) throw Error(s(90));
              _t(o), Ce(o, u);
            }
          }
        }
        break;
      case "textarea":
        vt(e, i);
        break;
      case "select":
        t = i.value, t != null && rn(e, !!i.multiple, t, !1);
    }
  }, ui = Nl, pc = pr;
  var Py = { usingClientEntryPoint: !1, Events: [Ri, br, Os, yt, Ht, Nl] }, Wi = { findFiberByHostInstance: or, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Ny = { bundleType: Wi.bundleType, version: Wi.version, rendererPackageName: Wi.rendererPackageName, rendererConfig: Wi.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Q.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = yc(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Wi.findFiberByHostInstance || Cy, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Eo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Eo.isDisabled && Eo.supportsFiber) try {
      ws = Eo.inject(Ny), on = Eo;
    } catch {
    }
  }
  return Pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Py, Pt.createPortal = function(e, t) {
    var i = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Vl(t)) throw Error(s(200));
    return Ey(e, t, null, i);
  }, Pt.createRoot = function(e, t) {
    if (!Vl(e)) throw Error(s(299));
    var i = !1, o = "", u = Hf;
    return t != null && (t.unstable_strictMode === !0 && (i = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (u = t.onRecoverableError)), t = _l(e, 1, !1, null, null, i, !1, o, u), e[vn] = t.current, Ni(e.nodeType === 8 ? e.parentNode : e), new Il(t);
  }, Pt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = yc(t), e = e === null ? null : e.stateNode, e;
  }, Pt.flushSync = function(e) {
    return pr(e);
  }, Pt.hydrate = function(e, t, i) {
    if (!jo(t)) throw Error(s(200));
    return ko(null, e, t, !0, i);
  }, Pt.hydrateRoot = function(e, t, i) {
    if (!Vl(e)) throw Error(s(405));
    var o = i != null && i.hydratedSources || null, u = !1, d = "", v = Hf;
    if (i != null && (i.unstable_strictMode === !0 && (u = !0), i.identifierPrefix !== void 0 && (d = i.identifierPrefix), i.onRecoverableError !== void 0 && (v = i.onRecoverableError)), t = Uf(t, null, e, 1, i ?? null, u, !1, d, v), e[vn] = t.current, Ni(e), o) for (e = 0; e < o.length; e++) i = o[e], u = i._getVersion, u = u(i._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [i, u] : t.mutableSourceEagerHydrationData.push(
      i,
      u
    );
    return new So(t);
  }, Pt.render = function(e, t, i) {
    if (!jo(t)) throw Error(s(200));
    return ko(null, e, t, !1, i);
  }, Pt.unmountComponentAtNode = function(e) {
    if (!jo(e)) throw Error(s(40));
    return e._reactRootContainer ? (pr(function() {
      ko(null, null, e, !1, function() {
        e._reactRootContainer = null, e[vn] = null;
      });
    }), !0) : !1;
  }, Pt.unstable_batchedUpdates = Nl, Pt.unstable_renderSubtreeIntoContainer = function(e, t, i, o) {
    if (!jo(i)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return ko(e, t, i, !1, o);
  }, Pt.version = "18.3.1-next-f1338f8080-20240426", Pt;
}
var th;
function _p() {
  if (th) return Fl.exports;
  th = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (r) {
        console.error(r);
      }
  }
  return n(), Fl.exports = Vy(), Fl.exports;
}
var nh;
function qy() {
  if (nh) return Co;
  nh = 1;
  var n = _p();
  return Co.createRoot = n.createRoot, Co.hydrateRoot = n.hydrateRoot, Co;
}
var Qo = qy(), N = ku();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Oy = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Dp = (...n) => n.filter((r, s, l) => !!r && r.trim() !== "" && l.indexOf(r) === s).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Fy = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const By = N.forwardRef(
  ({
    color: n = "currentColor",
    size: r = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: l,
    className: c = "",
    children: f,
    iconNode: h,
    ...m
  }, g) => N.createElement(
    "svg",
    {
      ref: g,
      ...Fy,
      width: r,
      height: r,
      stroke: n,
      strokeWidth: l ? Number(s) * 24 / Number(r) : s,
      className: Dp("lucide", c),
      ...m
    },
    [
      ...h.map(([p, y]) => N.createElement(p, y)),
      ...Array.isArray(f) ? f : [f]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ne = (n, r) => {
  const s = N.forwardRef(
    ({ className: l, ...c }, f) => N.createElement(By, {
      ref: f,
      iconNode: r,
      className: Dp(`lucide-${Oy(n)}`, l),
      ...c
    })
  );
  return s.displayName = `${n}`, s;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lo = ne("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ip = ne("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Io = ne("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vp = ne("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qp = ne("Bot", [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zy = ne("Braces", [
  [
    "path",
    { d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1", key: "ezmyqa" }
  ],
  [
    "path",
    {
      d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
      key: "e1hn23"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lt = ne("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Op = ne("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rh = ne("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eu = ne("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rs = ne("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cu = ne("Circle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $y = ne("Clipboard", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fp = ne("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tu = ne("CodeXml", [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uy = ne("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ih = ne("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vo = ne("Earth", [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wy = ne("Ellipsis", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hy = ne("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ky = ne("EyeOff", [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qo = ne("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gy = ne("FileCheck2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qy = ne("FileClock", [
  ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "37hlfg" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "8", cy: "16", r: "6", key: "10v15b" }],
  ["path", { d: "M9.5 17.5 8 16.25V14", key: "1o80t2" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nu = ne("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bp = ne("GitBranch", [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yy = ne("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pu = ne("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zp = ne("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xy = ne("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zy = ne("Layers", [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jy = ne("Linkedin", [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sh = ne("ListTree", [
  ["path", { d: "M21 12h-8", key: "1bmf0i" }],
  ["path", { d: "M21 6H8", key: "1pqkrb" }],
  ["path", { d: "M21 18h-8", key: "1tm79t" }],
  ["path", { d: "M3 6v4c0 1.1.9 2 2 2h3", key: "1ywdgy" }],
  ["path", { d: "M3 10v6c0 1.1.9 2 2 2h3", key: "2wc746" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cn = ne("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $p = ne("LockKeyhole", [
  ["circle", { cx: "12", cy: "16", r: "1", key: "1au0dj" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2", key: "6s8ecr" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3", key: "1pqi11" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e0 = ne("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t0 = ne("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Up = ne("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wp = ne("Network", [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const n0 = ne("PanelsTopLeft", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oh = ne("PencilLine", [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ],
  ["path", { d: "m15 5 3 3", key: "1w25hb" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r0 = ne("Pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nu = ne("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i0 = ne("Printer", [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hp = ne("Quote", [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Au = ne("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mu = ne("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kp = ne("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s0 = ne("Server", [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gp = ne("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ah = ne("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qp = ne("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const is = ne("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o0 = ne("Workflow", [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2", key: "by2w9f" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4", key: "xkn7yn" }],
  ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2", key: "1cgmvn" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ru = ne("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Yp = N.createContext({});
function Xp(n) {
  const r = N.useRef(null);
  return r.current === null && (r.current = n()), r.current;
}
const Ru = N.createContext(null), Oo = N.createContext({
  transformPagePoint: (n) => n,
  isStatic: !1,
  reducedMotion: "never"
});
function a0(n = !0) {
  const r = N.useContext(Ru);
  if (r === null)
    return [!0, null];
  const { isPresent: s, onExitComplete: l, register: c } = r, f = N.useId();
  N.useEffect(() => {
    n && c(f);
  }, [n]);
  const h = N.useCallback(() => n && l && l(f), [f, l, n]);
  return !s && l ? [!1, h] : [!0];
}
const Lu = typeof window < "u", l0 = Lu ? N.useLayoutEffect : N.useEffect, Lt = /* @__NO_SIDE_EFFECTS__ */ (n) => n;
let Zp = Lt;
const u0 = {
  useManualTiming: !1
};
function c0(n) {
  let r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), l = !1, c = !1;
  const f = /* @__PURE__ */ new WeakSet();
  let h = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function m(p) {
    f.has(p) && (g.schedule(p), n()), p(h);
  }
  const g = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (p, y = !1, x = !1) => {
      const E = x && l ? r : s;
      return y && f.add(p), E.has(p) || E.add(p), p;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (p) => {
      s.delete(p), f.delete(p);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (p) => {
      if (h = p, l) {
        c = !0;
        return;
      }
      l = !0, [r, s] = [s, r], r.forEach(m), r.clear(), l = !1, c && (c = !1, g.process(p));
    }
  };
  return g;
}
const To = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
], d0 = 40;
function Jp(n, r) {
  let s = !1, l = !0;
  const c = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, f = () => s = !0, h = To.reduce((L, D) => (L[D] = c0(f), L), {}), { read: m, resolveKeyframes: g, update: p, preRender: y, render: x, postRender: S } = h, E = () => {
    const L = performance.now();
    s = !1, c.delta = l ? 1e3 / 60 : Math.max(Math.min(L - c.timestamp, d0), 1), c.timestamp = L, c.isProcessing = !0, m.process(c), g.process(c), p.process(c), y.process(c), x.process(c), S.process(c), c.isProcessing = !1, s && r && (l = !1, n(E));
  }, C = () => {
    s = !0, l = !0, c.isProcessing || n(E);
  };
  return { schedule: To.reduce((L, D) => {
    const V = h[D];
    return L[D] = (Q, K = !1, J = !1) => (s || C(), V.schedule(Q, K, J)), L;
  }, {}), cancel: (L) => {
    for (let D = 0; D < To.length; D++)
      h[To[D]].cancel(L);
  }, state: c, steps: h };
}
const { schedule: Le, cancel: er, state: at, steps: $l } = Jp(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Lt, !0), em = N.createContext({ strict: !1 }), lh = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, ni = {};
for (const n in lh)
  ni[n] = {
    isEnabled: (r) => lh[n].some((s) => !!r[s])
  };
function f0(n) {
  for (const r in n)
    ni[r] = {
      ...ni[r],
      ...n[r]
    };
}
const h0 = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function Fo(n) {
  return n.startsWith("while") || n.startsWith("drag") && n !== "draggable" || n.startsWith("layout") || n.startsWith("onTap") || n.startsWith("onPan") || n.startsWith("onLayout") || h0.has(n);
}
let tm = (n) => !Fo(n);
function nm(n) {
  n && (tm = (r) => r.startsWith("on") ? !Fo(r) : n(r));
}
try {
  nm(require("@emotion/is-prop-valid").default);
} catch {
}
function p0(n, r, s) {
  const l = {};
  for (const c in n)
    c === "values" && typeof n.values == "object" || (tm(c) || s === !0 && Fo(c) || !r && !Fo(c) || // If trying to use native HTML drag events, forward drag listeners
    n.draggable && c.startsWith("onDrag")) && (l[c] = n[c]);
  return l;
}
function m0({ children: n, isValidProp: r, ...s }) {
  r && nm(r), s = { ...N.useContext(Oo), ...s }, s.isStatic = Xp(() => s.isStatic);
  const l = N.useMemo(() => s, [
    JSON.stringify(s.transition),
    s.transformPagePoint,
    s.reducedMotion
  ]);
  return a.jsx(Oo.Provider, { value: l, children: n });
}
function g0(n) {
  if (typeof Proxy > "u")
    return n;
  const r = /* @__PURE__ */ new Map(), s = (...l) => n(...l);
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (l, c) => c === "create" ? n : (r.has(c) || r.set(c, n(c)), r.get(c))
  });
}
const Yo = N.createContext({});
function ss(n) {
  return typeof n == "string" || Array.isArray(n);
}
function Xo(n) {
  return n !== null && typeof n == "object" && typeof n.start == "function";
}
const bu = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], _u = ["initial", ...bu];
function Zo(n) {
  return Xo(n.animate) || _u.some((r) => ss(n[r]));
}
function rm(n) {
  return !!(Zo(n) || n.variants);
}
function v0(n, r) {
  if (Zo(n)) {
    const { initial: s, animate: l } = n;
    return {
      initial: s === !1 || ss(s) ? s : void 0,
      animate: ss(l) ? l : void 0
    };
  }
  return n.inherit !== !1 ? r : {};
}
function y0(n) {
  const { initial: r, animate: s } = v0(n, N.useContext(Yo));
  return N.useMemo(() => ({ initial: r, animate: s }), [uh(r), uh(s)]);
}
function uh(n) {
  return Array.isArray(n) ? n.join(" ") : n;
}
const x0 = Symbol.for("motionComponentSymbol");
function Yr(n) {
  return n && typeof n == "object" && Object.prototype.hasOwnProperty.call(n, "current");
}
function w0(n, r, s) {
  return N.useCallback(
    (l) => {
      l && n.onMount && n.onMount(l), r && (l ? r.mount(l) : r.unmount()), s && (typeof s == "function" ? s(l) : Yr(s) && (s.current = l));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [r]
  );
}
const Du = (n) => n.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), S0 = "framerAppearId", im = "data-" + Du(S0), { schedule: Iu } = Jp(queueMicrotask, !1), sm = N.createContext({});
function j0(n, r, s, l, c) {
  var f, h;
  const { visualElement: m } = N.useContext(Yo), g = N.useContext(em), p = N.useContext(Ru), y = N.useContext(Oo).reducedMotion, x = N.useRef(null);
  l = l || g.renderer, !x.current && l && (x.current = l(n, {
    visualState: r,
    parent: m,
    props: s,
    presenceContext: p,
    blockInitialAnimation: p ? p.initial === !1 : !1,
    reducedMotionConfig: y
  }));
  const S = x.current, E = N.useContext(sm);
  S && !S.projection && c && (S.type === "html" || S.type === "svg") && k0(x.current, s, c, E);
  const C = N.useRef(!1);
  N.useInsertionEffect(() => {
    S && C.current && S.update(s, p);
  });
  const R = s[im], _ = N.useRef(!!R && !(!((f = window.MotionHandoffIsComplete) === null || f === void 0) && f.call(window, R)) && ((h = window.MotionHasOptimisedAnimation) === null || h === void 0 ? void 0 : h.call(window, R)));
  return l0(() => {
    S && (C.current = !0, window.MotionIsMounted = !0, S.updateFeatures(), Iu.render(S.render), _.current && S.animationState && S.animationState.animateChanges());
  }), N.useEffect(() => {
    S && (!_.current && S.animationState && S.animationState.animateChanges(), _.current && (queueMicrotask(() => {
      var L;
      (L = window.MotionHandoffMarkAsComplete) === null || L === void 0 || L.call(window, R);
    }), _.current = !1));
  }), S;
}
function k0(n, r, s, l) {
  const { layoutId: c, layout: f, drag: h, dragConstraints: m, layoutScroll: g, layoutRoot: p } = r;
  n.projection = new s(n.latestValues, r["data-framer-portal-id"] ? void 0 : om(n.parent)), n.projection.setOptions({
    layoutId: c,
    layout: f,
    alwaysMeasureLayout: !!h || m && Yr(m),
    visualElement: n,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof f == "string" ? f : "both",
    initialPromotionConfig: l,
    layoutScroll: g,
    layoutRoot: p
  });
}
function om(n) {
  if (n)
    return n.options.allowProjection !== !1 ? n.projection : om(n.parent);
}
function E0({ preloadedFeatures: n, createVisualElement: r, useRender: s, useVisualState: l, Component: c }) {
  var f, h;
  n && f0(n);
  function m(p, y) {
    let x;
    const S = {
      ...N.useContext(Oo),
      ...p,
      layoutId: C0(p)
    }, { isStatic: E } = S, C = y0(p), R = l(p, E);
    if (!E && Lu) {
      T0();
      const _ = P0(S);
      x = _.MeasureLayout, C.visualElement = j0(c, R, S, r, _.ProjectionNode);
    }
    return a.jsxs(Yo.Provider, { value: C, children: [x && C.visualElement ? a.jsx(x, { visualElement: C.visualElement, ...S }) : null, s(c, p, w0(R, C.visualElement, y), R, E, C.visualElement)] });
  }
  m.displayName = `motion.${typeof c == "string" ? c : `create(${(h = (f = c.displayName) !== null && f !== void 0 ? f : c.name) !== null && h !== void 0 ? h : ""})`}`;
  const g = N.forwardRef(m);
  return g[x0] = c, g;
}
function C0({ layoutId: n }) {
  const r = N.useContext(Yp).id;
  return r && n !== void 0 ? r + "-" + n : n;
}
function T0(n, r) {
  N.useContext(em).strict;
}
function P0(n) {
  const { drag: r, layout: s } = ni;
  if (!r && !s)
    return {};
  const l = { ...r, ...s };
  return {
    MeasureLayout: r != null && r.isEnabled(n) || s != null && s.isEnabled(n) ? l.MeasureLayout : void 0,
    ProjectionNode: l.ProjectionNode
  };
}
const N0 = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Vu(n) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof n != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    n.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(N0.indexOf(n) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(n))
    )
  );
}
function ch(n) {
  const r = [{}, {}];
  return n == null || n.values.forEach((s, l) => {
    r[0][l] = s.get(), r[1][l] = s.getVelocity();
  }), r;
}
function qu(n, r, s, l) {
  if (typeof r == "function") {
    const [c, f] = ch(l);
    r = r(s !== void 0 ? s : n.custom, c, f);
  }
  if (typeof r == "string" && (r = n.variants && n.variants[r]), typeof r == "function") {
    const [c, f] = ch(l);
    r = r(s !== void 0 ? s : n.custom, c, f);
  }
  return r;
}
const iu = (n) => Array.isArray(n), A0 = (n) => !!(n && typeof n == "object" && n.mix && n.toValue), M0 = (n) => iu(n) ? n[n.length - 1] || 0 : n, gt = (n) => !!(n && n.getVelocity);
function bo(n) {
  const r = gt(n) ? n.get() : n;
  return A0(r) ? r.toValue() : r;
}
function R0({ scrapeMotionValuesFromProps: n, createRenderState: r, onUpdate: s }, l, c, f) {
  const h = {
    latestValues: L0(l, c, f, n),
    renderState: r()
  };
  return s && (h.onMount = (m) => s({ props: l, current: m, ...h }), h.onUpdate = (m) => s(m)), h;
}
const am = (n) => (r, s) => {
  const l = N.useContext(Yo), c = N.useContext(Ru), f = () => R0(n, r, l, c);
  return s ? f() : Xp(f);
};
function L0(n, r, s, l) {
  const c = {}, f = l(n, {});
  for (const S in f)
    c[S] = bo(f[S]);
  let { initial: h, animate: m } = n;
  const g = Zo(n), p = rm(n);
  r && p && !g && n.inherit !== !1 && (h === void 0 && (h = r.initial), m === void 0 && (m = r.animate));
  let y = s ? s.initial === !1 : !1;
  y = y || h === !1;
  const x = y ? m : h;
  if (x && typeof x != "boolean" && !Xo(x)) {
    const S = Array.isArray(x) ? x : [x];
    for (let E = 0; E < S.length; E++) {
      const C = qu(n, S[E]);
      if (C) {
        const { transitionEnd: R, transition: _, ...L } = C;
        for (const D in L) {
          let V = L[D];
          if (Array.isArray(V)) {
            const Q = y ? V.length - 1 : 0;
            V = V[Q];
          }
          V !== null && (c[D] = V);
        }
        for (const D in R)
          c[D] = R[D];
      }
    }
  }
  return c;
}
const si = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Er = new Set(si), lm = (n) => (r) => typeof r == "string" && r.startsWith(n), um = /* @__PURE__ */ lm("--"), b0 = /* @__PURE__ */ lm("var(--"), Ou = (n) => b0(n) ? _0.test(n.split("/*")[0].trim()) : !1, _0 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, cm = (n, r) => r && typeof n == "number" ? r.transform(n) : n, Rn = (n, r, s) => s > r ? r : s < n ? n : s, oi = {
  test: (n) => typeof n == "number",
  parse: parseFloat,
  transform: (n) => n
}, os = {
  ...oi,
  transform: (n) => Rn(0, 1, n)
}, Po = {
  ...oi,
  default: 1
}, ds = (n) => ({
  test: (r) => typeof r == "string" && r.endsWith(n) && r.split(" ").length === 1,
  parse: parseFloat,
  transform: (r) => `${r}${n}`
}), Jn = /* @__PURE__ */ ds("deg"), fn = /* @__PURE__ */ ds("%"), ae = /* @__PURE__ */ ds("px"), D0 = /* @__PURE__ */ ds("vh"), I0 = /* @__PURE__ */ ds("vw"), dh = {
  ...fn,
  parse: (n) => fn.parse(n) / 100,
  transform: (n) => fn.transform(n * 100)
}, V0 = {
  // Border props
  borderWidth: ae,
  borderTopWidth: ae,
  borderRightWidth: ae,
  borderBottomWidth: ae,
  borderLeftWidth: ae,
  borderRadius: ae,
  radius: ae,
  borderTopLeftRadius: ae,
  borderTopRightRadius: ae,
  borderBottomRightRadius: ae,
  borderBottomLeftRadius: ae,
  // Positioning props
  width: ae,
  maxWidth: ae,
  height: ae,
  maxHeight: ae,
  top: ae,
  right: ae,
  bottom: ae,
  left: ae,
  // Spacing props
  padding: ae,
  paddingTop: ae,
  paddingRight: ae,
  paddingBottom: ae,
  paddingLeft: ae,
  margin: ae,
  marginTop: ae,
  marginRight: ae,
  marginBottom: ae,
  marginLeft: ae,
  // Misc
  backgroundPositionX: ae,
  backgroundPositionY: ae
}, q0 = {
  rotate: Jn,
  rotateX: Jn,
  rotateY: Jn,
  rotateZ: Jn,
  scale: Po,
  scaleX: Po,
  scaleY: Po,
  scaleZ: Po,
  skew: Jn,
  skewX: Jn,
  skewY: Jn,
  distance: ae,
  translateX: ae,
  translateY: ae,
  translateZ: ae,
  x: ae,
  y: ae,
  z: ae,
  perspective: ae,
  transformPerspective: ae,
  opacity: os,
  originX: dh,
  originY: dh,
  originZ: ae
}, fh = {
  ...oi,
  transform: Math.round
}, Fu = {
  ...V0,
  ...q0,
  zIndex: fh,
  size: ae,
  // SVG
  fillOpacity: os,
  strokeOpacity: os,
  numOctaves: fh
}, O0 = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, F0 = si.length;
function B0(n, r, s) {
  let l = "", c = !0;
  for (let f = 0; f < F0; f++) {
    const h = si[f], m = n[h];
    if (m === void 0)
      continue;
    let g = !0;
    if (typeof m == "number" ? g = m === (h.startsWith("scale") ? 1 : 0) : g = parseFloat(m) === 0, !g || s) {
      const p = cm(m, Fu[h]);
      if (!g) {
        c = !1;
        const y = O0[h] || h;
        l += `${y}(${p}) `;
      }
      s && (r[h] = p);
    }
  }
  return l = l.trim(), s ? l = s(r, c ? "" : l) : c && (l = "none"), l;
}
function Bu(n, r, s) {
  const { style: l, vars: c, transformOrigin: f } = n;
  let h = !1, m = !1;
  for (const g in r) {
    const p = r[g];
    if (Er.has(g)) {
      h = !0;
      continue;
    } else if (um(g)) {
      c[g] = p;
      continue;
    } else {
      const y = cm(p, Fu[g]);
      g.startsWith("origin") ? (m = !0, f[g] = y) : l[g] = y;
    }
  }
  if (r.transform || (h || s ? l.transform = B0(r, n.transform, s) : l.transform && (l.transform = "none")), m) {
    const { originX: g = "50%", originY: p = "50%", originZ: y = 0 } = f;
    l.transformOrigin = `${g} ${p} ${y}`;
  }
}
const z0 = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, $0 = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function U0(n, r, s = 1, l = 0, c = !0) {
  n.pathLength = 1;
  const f = c ? z0 : $0;
  n[f.offset] = ae.transform(-l);
  const h = ae.transform(r), m = ae.transform(s);
  n[f.array] = `${h} ${m}`;
}
function hh(n, r, s) {
  return typeof n == "string" ? n : ae.transform(r + s * n);
}
function W0(n, r, s) {
  const l = hh(r, n.x, n.width), c = hh(s, n.y, n.height);
  return `${l} ${c}`;
}
function zu(n, {
  attrX: r,
  attrY: s,
  attrScale: l,
  originX: c,
  originY: f,
  pathLength: h,
  pathSpacing: m = 1,
  pathOffset: g = 0,
  // This is object creation, which we try to avoid per-frame.
  ...p
}, y, x) {
  if (Bu(n, p, x), y) {
    n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
    return;
  }
  n.attrs = n.style, n.style = {};
  const { attrs: S, style: E, dimensions: C } = n;
  S.transform && (C && (E.transform = S.transform), delete S.transform), C && (c !== void 0 || f !== void 0 || E.transform) && (E.transformOrigin = W0(C, c !== void 0 ? c : 0.5, f !== void 0 ? f : 0.5)), r !== void 0 && (S.x = r), s !== void 0 && (S.y = s), l !== void 0 && (S.scale = l), h !== void 0 && U0(S, h, m, g, !1);
}
const $u = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
}), dm = () => ({
  ...$u(),
  attrs: {}
}), Uu = (n) => typeof n == "string" && n.toLowerCase() === "svg";
function fm(n, { style: r, vars: s }, l, c) {
  Object.assign(n.style, r, c && c.getProjectionStyles(l));
  for (const f in s)
    n.style.setProperty(f, s[f]);
}
const hm = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function pm(n, r, s, l) {
  fm(n, r, void 0, l);
  for (const c in r.attrs)
    n.setAttribute(hm.has(c) ? c : Du(c), r.attrs[c]);
}
const Bo = {};
function H0(n) {
  Object.assign(Bo, n);
}
function mm(n, { layout: r, layoutId: s }) {
  return Er.has(n) || n.startsWith("origin") || (r || s !== void 0) && (!!Bo[n] || n === "opacity");
}
function Wu(n, r, s) {
  var l;
  const { style: c } = n, f = {};
  for (const h in c)
    (gt(c[h]) || r.style && gt(r.style[h]) || mm(h, n) || ((l = s == null ? void 0 : s.getValue(h)) === null || l === void 0 ? void 0 : l.liveStyle) !== void 0) && (f[h] = c[h]);
  return f;
}
function gm(n, r, s) {
  const l = Wu(n, r, s);
  for (const c in n)
    if (gt(n[c]) || gt(r[c])) {
      const f = si.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      l[f] = n[c];
    }
  return l;
}
function K0(n, r) {
  try {
    r.dimensions = typeof n.getBBox == "function" ? n.getBBox() : n.getBoundingClientRect();
  } catch {
    r.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
const ph = ["x", "y", "width", "height", "cx", "cy", "r"], G0 = {
  useVisualState: am({
    scrapeMotionValuesFromProps: gm,
    createRenderState: dm,
    onUpdate: ({ props: n, prevProps: r, current: s, renderState: l, latestValues: c }) => {
      if (!s)
        return;
      let f = !!n.drag;
      if (!f) {
        for (const m in c)
          if (Er.has(m)) {
            f = !0;
            break;
          }
      }
      if (!f)
        return;
      let h = !r;
      if (r)
        for (let m = 0; m < ph.length; m++) {
          const g = ph[m];
          n[g] !== r[g] && (h = !0);
        }
      h && Le.read(() => {
        K0(s, l), Le.render(() => {
          zu(l, c, Uu(s.tagName), n.transformTemplate), pm(s, l);
        });
      });
    }
  })
}, Q0 = {
  useVisualState: am({
    scrapeMotionValuesFromProps: Wu,
    createRenderState: $u
  })
};
function vm(n, r, s) {
  for (const l in r)
    !gt(r[l]) && !mm(l, s) && (n[l] = r[l]);
}
function Y0({ transformTemplate: n }, r) {
  return N.useMemo(() => {
    const s = $u();
    return Bu(s, r, n), Object.assign({}, s.vars, s.style);
  }, [r]);
}
function X0(n, r) {
  const s = n.style || {}, l = {};
  return vm(l, s, n), Object.assign(l, Y0(n, r)), l;
}
function Z0(n, r) {
  const s = {}, l = X0(n, r);
  return n.drag && n.dragListener !== !1 && (s.draggable = !1, l.userSelect = l.WebkitUserSelect = l.WebkitTouchCallout = "none", l.touchAction = n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`), n.tabIndex === void 0 && (n.onTap || n.onTapStart || n.whileTap) && (s.tabIndex = 0), s.style = l, s;
}
function J0(n, r, s, l) {
  const c = N.useMemo(() => {
    const f = dm();
    return zu(f, r, Uu(l), n.transformTemplate), {
      ...f.attrs,
      style: { ...f.style }
    };
  }, [r]);
  if (n.style) {
    const f = {};
    vm(f, n.style, n), c.style = { ...f, ...c.style };
  }
  return c;
}
function e1(n = !1) {
  return (s, l, c, { latestValues: f }, h) => {
    const g = (Vu(s) ? J0 : Z0)(l, f, h, s), p = p0(l, typeof s == "string", n), y = s !== N.Fragment ? { ...p, ...g, ref: c } : {}, { children: x } = l, S = N.useMemo(() => gt(x) ? x.get() : x, [x]);
    return N.createElement(s, {
      ...y,
      children: S
    });
  };
}
function t1(n, r) {
  return function(l, { forwardMotionProps: c } = { forwardMotionProps: !1 }) {
    const h = {
      ...Vu(l) ? G0 : Q0,
      preloadedFeatures: n,
      useRender: e1(c),
      createVisualElement: r,
      Component: l
    };
    return E0(h);
  };
}
function ym(n, r) {
  if (!Array.isArray(r))
    return !1;
  const s = r.length;
  if (s !== n.length)
    return !1;
  for (let l = 0; l < s; l++)
    if (r[l] !== n[l])
      return !1;
  return !0;
}
function Jo(n, r, s) {
  const l = n.getProps();
  return qu(l, r, s !== void 0 ? s : l.custom, n);
}
function Hu(n, r) {
  return n ? n[r] || n.default || n : void 0;
}
const xm = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...si
]);
let _o;
function n1() {
  _o = void 0;
}
const hn = {
  now: () => (_o === void 0 && hn.set(at.isProcessing || u0.useManualTiming ? at.timestamp : performance.now()), _o),
  set: (n) => {
    _o = n, queueMicrotask(n1);
  }
};
function Ku(n, r) {
  n.indexOf(r) === -1 && n.push(r);
}
function Gu(n, r) {
  const s = n.indexOf(r);
  s > -1 && n.splice(s, 1);
}
class Qu {
  constructor() {
    this.subscriptions = [];
  }
  add(r) {
    return Ku(this.subscriptions, r), () => Gu(this.subscriptions, r);
  }
  notify(r, s, l) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1)
        this.subscriptions[0](r, s, l);
      else
        for (let f = 0; f < c; f++) {
          const h = this.subscriptions[f];
          h && h(r, s, l);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function wm(n, r) {
  return r ? n * (1e3 / r) : 0;
}
const mh = 30, r1 = (n) => !isNaN(parseFloat(n));
class i1 {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(r, s = {}) {
    this.version = "11.18.2", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (l, c = !0) => {
      const f = hn.now();
      this.updatedAt !== f && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(l), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), c && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(r), this.owner = s.owner;
  }
  setCurrent(r) {
    this.current = r, this.updatedAt = hn.now(), this.canTrackVelocity === null && r !== void 0 && (this.canTrackVelocity = r1(this.current));
  }
  setPrevFrameValue(r = this.current) {
    this.prevFrameValue = r, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(r) {
    return this.on("change", r);
  }
  on(r, s) {
    this.events[r] || (this.events[r] = new Qu());
    const l = this.events[r].add(s);
    return r === "change" ? () => {
      l(), Le.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : l;
  }
  clearListeners() {
    for (const r in this.events)
      this.events[r].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(r, s) {
    this.passiveEffect = r, this.stopPassiveEffect = s;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(r, s = !0) {
    !s || !this.passiveEffect ? this.updateAndNotify(r, s) : this.passiveEffect(r, this.updateAndNotify);
  }
  setWithVelocity(r, s, l) {
    this.set(s), this.prev = void 0, this.prevFrameValue = r, this.prevUpdatedAt = this.updatedAt - l;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(r, s = !0) {
    this.updateAndNotify(r), this.prev = r, this.prevUpdatedAt = this.prevFrameValue = void 0, s && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const r = hn.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || r - this.updatedAt > mh)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, mh);
    return wm(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(r) {
    return this.stop(), new Promise((s) => {
      this.hasAnimated = !0, this.animation = r(s), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function as(n, r) {
  return new i1(n, r);
}
function s1(n, r, s) {
  n.hasValue(r) ? n.getValue(r).set(s) : n.addValue(r, as(s));
}
function o1(n, r) {
  const s = Jo(n, r);
  let { transitionEnd: l = {}, transition: c = {}, ...f } = s || {};
  f = { ...f, ...l };
  for (const h in f) {
    const m = M0(f[h]);
    s1(n, h, m);
  }
}
function a1(n) {
  return !!(gt(n) && n.add);
}
function su(n, r) {
  const s = n.getValue("willChange");
  if (a1(s))
    return s.add(r);
}
function Sm(n) {
  return n.props[im];
}
// @__NO_SIDE_EFFECTS__
function Yu(n) {
  let r;
  return () => (r === void 0 && (r = n()), r);
}
const l1 = /* @__PURE__ */ Yu(() => window.ScrollTimeline !== void 0);
class u1 {
  constructor(r) {
    this.stop = () => this.runAll("stop"), this.animations = r.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((r) => "finished" in r ? r.finished : r));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(r) {
    return this.animations[0][r];
  }
  setAll(r, s) {
    for (let l = 0; l < this.animations.length; l++)
      this.animations[l][r] = s;
  }
  attachTimeline(r, s) {
    const l = this.animations.map((c) => {
      if (l1() && c.attachTimeline)
        return c.attachTimeline(r);
      if (typeof s == "function")
        return s(c);
    });
    return () => {
      l.forEach((c, f) => {
        c && c(), this.animations[f].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(r) {
    this.setAll("time", r);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(r) {
    this.setAll("speed", r);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let r = 0;
    for (let s = 0; s < this.animations.length; s++)
      r = Math.max(r, this.animations[s].duration);
    return r;
  }
  runAll(r) {
    this.animations.forEach((s) => s[r]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class c1 extends u1 {
  then(r, s) {
    return Promise.all(this.animations).then(r).catch(s);
  }
}
const An = /* @__NO_SIDE_EFFECTS__ */ (n) => n * 1e3, Mn = /* @__NO_SIDE_EFFECTS__ */ (n) => n / 1e3;
function Xu(n) {
  return typeof n == "function";
}
function gh(n, r) {
  n.timeline = r, n.onfinish = null;
}
const Zu = (n) => Array.isArray(n) && typeof n[0] == "number", d1 = {
  linearEasing: void 0
};
function f1(n, r) {
  const s = /* @__PURE__ */ Yu(n);
  return () => {
    var l;
    return (l = d1[r]) !== null && l !== void 0 ? l : s();
  };
}
const zo = /* @__PURE__ */ f1(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), ri = /* @__NO_SIDE_EFFECTS__ */ (n, r, s) => {
  const l = r - n;
  return l === 0 ? 1 : (s - n) / l;
}, jm = (n, r, s = 10) => {
  let l = "";
  const c = Math.max(Math.round(r / s), 2);
  for (let f = 0; f < c; f++)
    l += n(/* @__PURE__ */ ri(0, c - 1, f)) + ", ";
  return `linear(${l.substring(0, l.length - 2)})`;
};
function km(n) {
  return !!(typeof n == "function" && zo() || !n || typeof n == "string" && (n in ou || zo()) || Zu(n) || Array.isArray(n) && n.every(km));
}
const Yi = ([n, r, s, l]) => `cubic-bezier(${n}, ${r}, ${s}, ${l})`, ou = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Yi([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Yi([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Yi([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Yi([0.33, 1.53, 0.69, 0.99])
};
function Em(n, r) {
  if (n)
    return typeof n == "function" && zo() ? jm(n, r) : Zu(n) ? Yi(n) : Array.isArray(n) ? n.map((s) => Em(s, r) || ou.easeOut) : ou[n];
}
const Cm = (n, r, s) => (((1 - 3 * s + 3 * r) * n + (3 * s - 6 * r)) * n + 3 * r) * n, h1 = 1e-7, p1 = 12;
function m1(n, r, s, l, c) {
  let f, h, m = 0;
  do
    h = r + (s - r) / 2, f = Cm(h, l, c) - n, f > 0 ? s = h : r = h;
  while (Math.abs(f) > h1 && ++m < p1);
  return h;
}
function fs(n, r, s, l) {
  if (n === r && s === l)
    return Lt;
  const c = (f) => m1(f, 0, 1, n, s);
  return (f) => f === 0 || f === 1 ? f : Cm(c(f), r, l);
}
const Tm = (n) => (r) => r <= 0.5 ? n(2 * r) / 2 : (2 - n(2 * (1 - r))) / 2, Pm = (n) => (r) => 1 - n(1 - r), Nm = /* @__PURE__ */ fs(0.33, 1.53, 0.69, 0.99), Ju = /* @__PURE__ */ Pm(Nm), Am = /* @__PURE__ */ Tm(Ju), Mm = (n) => (n *= 2) < 1 ? 0.5 * Ju(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1))), ec = (n) => 1 - Math.sin(Math.acos(n)), Rm = Pm(ec), Lm = Tm(ec), bm = (n) => /^0[^.\s]+$/u.test(n);
function g1(n) {
  return typeof n == "number" ? n === 0 : n !== null ? n === "none" || n === "0" || bm(n) : !0;
}
const Ji = (n) => Math.round(n * 1e5) / 1e5, tc = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function v1(n) {
  return n == null;
}
const y1 = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, nc = (n, r) => (s) => !!(typeof s == "string" && y1.test(s) && s.startsWith(n) || r && !v1(s) && Object.prototype.hasOwnProperty.call(s, r)), _m = (n, r, s) => (l) => {
  if (typeof l != "string")
    return l;
  const [c, f, h, m] = l.match(tc);
  return {
    [n]: parseFloat(c),
    [r]: parseFloat(f),
    [s]: parseFloat(h),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, x1 = (n) => Rn(0, 255, n), Ul = {
  ...oi,
  transform: (n) => Math.round(x1(n))
}, jr = {
  test: /* @__PURE__ */ nc("rgb", "red"),
  parse: /* @__PURE__ */ _m("red", "green", "blue"),
  transform: ({ red: n, green: r, blue: s, alpha: l = 1 }) => "rgba(" + Ul.transform(n) + ", " + Ul.transform(r) + ", " + Ul.transform(s) + ", " + Ji(os.transform(l)) + ")"
};
function w1(n) {
  let r = "", s = "", l = "", c = "";
  return n.length > 5 ? (r = n.substring(1, 3), s = n.substring(3, 5), l = n.substring(5, 7), c = n.substring(7, 9)) : (r = n.substring(1, 2), s = n.substring(2, 3), l = n.substring(3, 4), c = n.substring(4, 5), r += r, s += s, l += l, c += c), {
    red: parseInt(r, 16),
    green: parseInt(s, 16),
    blue: parseInt(l, 16),
    alpha: c ? parseInt(c, 16) / 255 : 1
  };
}
const au = {
  test: /* @__PURE__ */ nc("#"),
  parse: w1,
  transform: jr.transform
}, Xr = {
  test: /* @__PURE__ */ nc("hsl", "hue"),
  parse: /* @__PURE__ */ _m("hue", "saturation", "lightness"),
  transform: ({ hue: n, saturation: r, lightness: s, alpha: l = 1 }) => "hsla(" + Math.round(n) + ", " + fn.transform(Ji(r)) + ", " + fn.transform(Ji(s)) + ", " + Ji(os.transform(l)) + ")"
}, mt = {
  test: (n) => jr.test(n) || au.test(n) || Xr.test(n),
  parse: (n) => jr.test(n) ? jr.parse(n) : Xr.test(n) ? Xr.parse(n) : au.parse(n),
  transform: (n) => typeof n == "string" ? n : n.hasOwnProperty("red") ? jr.transform(n) : Xr.transform(n)
}, S1 = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function j1(n) {
  var r, s;
  return isNaN(n) && typeof n == "string" && (((r = n.match(tc)) === null || r === void 0 ? void 0 : r.length) || 0) + (((s = n.match(S1)) === null || s === void 0 ? void 0 : s.length) || 0) > 0;
}
const Dm = "number", Im = "color", k1 = "var", E1 = "var(", vh = "${}", C1 = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function ls(n) {
  const r = n.toString(), s = [], l = {
    color: [],
    number: [],
    var: []
  }, c = [];
  let f = 0;
  const m = r.replace(C1, (g) => (mt.test(g) ? (l.color.push(f), c.push(Im), s.push(mt.parse(g))) : g.startsWith(E1) ? (l.var.push(f), c.push(k1), s.push(g)) : (l.number.push(f), c.push(Dm), s.push(parseFloat(g))), ++f, vh)).split(vh);
  return { values: s, split: m, indexes: l, types: c };
}
function Vm(n) {
  return ls(n).values;
}
function qm(n) {
  const { split: r, types: s } = ls(n), l = r.length;
  return (c) => {
    let f = "";
    for (let h = 0; h < l; h++)
      if (f += r[h], c[h] !== void 0) {
        const m = s[h];
        m === Dm ? f += Ji(c[h]) : m === Im ? f += mt.transform(c[h]) : f += c[h];
      }
    return f;
  };
}
const T1 = (n) => typeof n == "number" ? 0 : n;
function P1(n) {
  const r = Vm(n);
  return qm(n)(r.map(T1));
}
const tr = {
  test: j1,
  parse: Vm,
  createTransformer: qm,
  getAnimatableNone: P1
}, N1 = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function A1(n) {
  const [r, s] = n.slice(0, -1).split("(");
  if (r === "drop-shadow")
    return n;
  const [l] = s.match(tc) || [];
  if (!l)
    return n;
  const c = s.replace(l, "");
  let f = N1.has(r) ? 1 : 0;
  return l !== s && (f *= 100), r + "(" + f + c + ")";
}
const M1 = /\b([a-z-]*)\(.*?\)/gu, lu = {
  ...tr,
  getAnimatableNone: (n) => {
    const r = n.match(M1);
    return r ? r.map(A1).join(" ") : n;
  }
}, R1 = {
  ...Fu,
  // Color props
  color: mt,
  backgroundColor: mt,
  outlineColor: mt,
  fill: mt,
  stroke: mt,
  // Border props
  borderColor: mt,
  borderTopColor: mt,
  borderRightColor: mt,
  borderBottomColor: mt,
  borderLeftColor: mt,
  filter: lu,
  WebkitFilter: lu
}, rc = (n) => R1[n];
function Om(n, r) {
  let s = rc(n);
  return s !== lu && (s = tr), s.getAnimatableNone ? s.getAnimatableNone(r) : void 0;
}
const L1 = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function b1(n, r, s) {
  let l = 0, c;
  for (; l < n.length && !c; ) {
    const f = n[l];
    typeof f == "string" && !L1.has(f) && ls(f).values.length && (c = n[l]), l++;
  }
  if (c && s)
    for (const f of r)
      n[f] = Om(s, c);
}
const yh = (n) => n === oi || n === ae, xh = (n, r) => parseFloat(n.split(", ")[r]), wh = (n, r) => (s, { transform: l }) => {
  if (l === "none" || !l)
    return 0;
  const c = l.match(/^matrix3d\((.+)\)$/u);
  if (c)
    return xh(c[1], r);
  {
    const f = l.match(/^matrix\((.+)\)$/u);
    return f ? xh(f[1], n) : 0;
  }
}, _1 = /* @__PURE__ */ new Set(["x", "y", "z"]), D1 = si.filter((n) => !_1.has(n));
function I1(n) {
  const r = [];
  return D1.forEach((s) => {
    const l = n.getValue(s);
    l !== void 0 && (r.push([s, l.get()]), l.set(s.startsWith("scale") ? 1 : 0));
  }), r;
}
const ii = {
  // Dimensions
  width: ({ x: n }, { paddingLeft: r = "0", paddingRight: s = "0" }) => n.max - n.min - parseFloat(r) - parseFloat(s),
  height: ({ y: n }, { paddingTop: r = "0", paddingBottom: s = "0" }) => n.max - n.min - parseFloat(r) - parseFloat(s),
  top: (n, { top: r }) => parseFloat(r),
  left: (n, { left: r }) => parseFloat(r),
  bottom: ({ y: n }, { top: r }) => parseFloat(r) + (n.max - n.min),
  right: ({ x: n }, { left: r }) => parseFloat(r) + (n.max - n.min),
  // Transform
  x: wh(4, 13),
  y: wh(5, 14)
};
ii.translateX = ii.x;
ii.translateY = ii.y;
const kr = /* @__PURE__ */ new Set();
let uu = !1, cu = !1;
function Fm() {
  if (cu) {
    const n = Array.from(kr).filter((l) => l.needsMeasurement), r = new Set(n.map((l) => l.element)), s = /* @__PURE__ */ new Map();
    r.forEach((l) => {
      const c = I1(l);
      c.length && (s.set(l, c), l.render());
    }), n.forEach((l) => l.measureInitialState()), r.forEach((l) => {
      l.render();
      const c = s.get(l);
      c && c.forEach(([f, h]) => {
        var m;
        (m = l.getValue(f)) === null || m === void 0 || m.set(h);
      });
    }), n.forEach((l) => l.measureEndState()), n.forEach((l) => {
      l.suspendedScrollY !== void 0 && window.scrollTo(0, l.suspendedScrollY);
    });
  }
  cu = !1, uu = !1, kr.forEach((n) => n.complete()), kr.clear();
}
function Bm() {
  kr.forEach((n) => {
    n.readKeyframes(), n.needsMeasurement && (cu = !0);
  });
}
function V1() {
  Bm(), Fm();
}
class ic {
  constructor(r, s, l, c, f, h = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...r], this.onComplete = s, this.name = l, this.motionValue = c, this.element = f, this.isAsync = h;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (kr.add(this), uu || (uu = !0, Le.read(Bm), Le.resolveKeyframes(Fm))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: r, name: s, element: l, motionValue: c } = this;
    for (let f = 0; f < r.length; f++)
      if (r[f] === null)
        if (f === 0) {
          const h = c == null ? void 0 : c.get(), m = r[r.length - 1];
          if (h !== void 0)
            r[0] = h;
          else if (l && s) {
            const g = l.readValue(s, m);
            g != null && (r[0] = g);
          }
          r[0] === void 0 && (r[0] = m), c && h === void 0 && c.set(r[0]);
        } else
          r[f] = r[f - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), kr.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, kr.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const zm = (n) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n), q1 = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function O1(n) {
  const r = q1.exec(n);
  if (!r)
    return [,];
  const [, s, l, c] = r;
  return [`--${s ?? l}`, c];
}
function $m(n, r, s = 1) {
  const [l, c] = O1(n);
  if (!l)
    return;
  const f = window.getComputedStyle(r).getPropertyValue(l);
  if (f) {
    const h = f.trim();
    return zm(h) ? parseFloat(h) : h;
  }
  return Ou(c) ? $m(c, r, s + 1) : c;
}
const Um = (n) => (r) => r.test(n), F1 = {
  test: (n) => n === "auto",
  parse: (n) => n
}, Wm = [oi, ae, fn, Jn, I0, D0, F1], Sh = (n) => Wm.find(Um(n));
class Hm extends ic {
  constructor(r, s, l, c, f) {
    super(r, s, l, c, f, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: r, element: s, name: l } = this;
    if (!s || !s.current)
      return;
    super.readKeyframes();
    for (let g = 0; g < r.length; g++) {
      let p = r[g];
      if (typeof p == "string" && (p = p.trim(), Ou(p))) {
        const y = $m(p, s.current);
        y !== void 0 && (r[g] = y), g === r.length - 1 && (this.finalKeyframe = p);
      }
    }
    if (this.resolveNoneKeyframes(), !xm.has(l) || r.length !== 2)
      return;
    const [c, f] = r, h = Sh(c), m = Sh(f);
    if (h !== m)
      if (yh(h) && yh(m))
        for (let g = 0; g < r.length; g++) {
          const p = r[g];
          typeof p == "string" && (r[g] = parseFloat(p));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: r, name: s } = this, l = [];
    for (let c = 0; c < r.length; c++)
      g1(r[c]) && l.push(c);
    l.length && b1(r, l, s);
  }
  measureInitialState() {
    const { element: r, unresolvedKeyframes: s, name: l } = this;
    if (!r || !r.current)
      return;
    l === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = ii[l](r.measureViewportBox(), window.getComputedStyle(r.current)), s[0] = this.measuredOrigin;
    const c = s[s.length - 1];
    c !== void 0 && r.getValue(l, c).jump(c, !1);
  }
  measureEndState() {
    var r;
    const { element: s, name: l, unresolvedKeyframes: c } = this;
    if (!s || !s.current)
      return;
    const f = s.getValue(l);
    f && f.jump(this.measuredOrigin, !1);
    const h = c.length - 1, m = c[h];
    c[h] = ii[l](s.measureViewportBox(), window.getComputedStyle(s.current)), m !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = m), !((r = this.removedTransforms) === null || r === void 0) && r.length && this.removedTransforms.forEach(([g, p]) => {
      s.getValue(g).set(p);
    }), this.resolveNoneKeyframes();
  }
}
const jh = (n, r) => r === "zIndex" ? !1 : !!(typeof n == "number" || Array.isArray(n) || typeof n == "string" && // It's animatable if we have a string
(tr.test(n) || n === "0") && // And it contains numbers and/or colors
!n.startsWith("url("));
function B1(n) {
  const r = n[0];
  if (n.length === 1)
    return !0;
  for (let s = 0; s < n.length; s++)
    if (n[s] !== r)
      return !0;
}
function z1(n, r, s, l) {
  const c = n[0];
  if (c === null)
    return !1;
  if (r === "display" || r === "visibility")
    return !0;
  const f = n[n.length - 1], h = jh(c, r), m = jh(f, r);
  return !h || !m ? !1 : B1(n) || (s === "spring" || Xu(s)) && l;
}
const $1 = (n) => n !== null;
function ea(n, { repeat: r, repeatType: s = "loop" }, l) {
  const c = n.filter($1), f = r && s !== "loop" && r % 2 === 1 ? 0 : c.length - 1;
  return !f || l === void 0 ? c[f] : l;
}
const U1 = 40;
class Km {
  constructor({ autoplay: r = !0, delay: s = 0, type: l = "keyframes", repeat: c = 0, repeatDelay: f = 0, repeatType: h = "loop", ...m }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = hn.now(), this.options = {
      autoplay: r,
      delay: s,
      type: l,
      repeat: c,
      repeatDelay: f,
      repeatType: h,
      ...m
    }, this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    return this.resolvedAt ? this.resolvedAt - this.createdAt > U1 ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && V1(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(r, s) {
    this.resolvedAt = hn.now(), this.hasAttemptedResolve = !0;
    const { name: l, type: c, velocity: f, delay: h, onComplete: m, onUpdate: g, isGenerator: p } = this.options;
    if (!p && !z1(r, l, c, f))
      if (h)
        this.options.duration = 0;
      else {
        g && g(ea(r, this.options, s)), m && m(), this.resolveFinishedPromise();
        return;
      }
    const y = this.initPlayback(r, s);
    y !== !1 && (this._resolved = {
      keyframes: r,
      finalKeyframe: s,
      ...y
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(r, s) {
    return this.currentFinishedPromise.then(r, s);
  }
  flatten() {
    this.options.type = "keyframes", this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((r) => {
      this.resolveFinishedPromise = r;
    });
  }
}
const du = 2e4;
function Gm(n) {
  let r = 0;
  const s = 50;
  let l = n.next(r);
  for (; !l.done && r < du; )
    r += s, l = n.next(r);
  return r >= du ? 1 / 0 : r;
}
const Be = (n, r, s) => n + (r - n) * s;
function Wl(n, r, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? n + (r - n) * 6 * s : s < 1 / 2 ? r : s < 2 / 3 ? n + (r - n) * (2 / 3 - s) * 6 : n;
}
function W1({ hue: n, saturation: r, lightness: s, alpha: l }) {
  n /= 360, r /= 100, s /= 100;
  let c = 0, f = 0, h = 0;
  if (!r)
    c = f = h = s;
  else {
    const m = s < 0.5 ? s * (1 + r) : s + r - s * r, g = 2 * s - m;
    c = Wl(g, m, n + 1 / 3), f = Wl(g, m, n), h = Wl(g, m, n - 1 / 3);
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(f * 255),
    blue: Math.round(h * 255),
    alpha: l
  };
}
function $o(n, r) {
  return (s) => s > 0 ? r : n;
}
const Hl = (n, r, s) => {
  const l = n * n, c = s * (r * r - l) + l;
  return c < 0 ? 0 : Math.sqrt(c);
}, H1 = [au, jr, Xr], K1 = (n) => H1.find((r) => r.test(n));
function kh(n) {
  const r = K1(n);
  if (!r)
    return !1;
  let s = r.parse(n);
  return r === Xr && (s = W1(s)), s;
}
const Eh = (n, r) => {
  const s = kh(n), l = kh(r);
  if (!s || !l)
    return $o(n, r);
  const c = { ...s };
  return (f) => (c.red = Hl(s.red, l.red, f), c.green = Hl(s.green, l.green, f), c.blue = Hl(s.blue, l.blue, f), c.alpha = Be(s.alpha, l.alpha, f), jr.transform(c));
}, G1 = (n, r) => (s) => r(n(s)), hs = (...n) => n.reduce(G1), fu = /* @__PURE__ */ new Set(["none", "hidden"]);
function Q1(n, r) {
  return fu.has(n) ? (s) => s <= 0 ? n : r : (s) => s >= 1 ? r : n;
}
function Y1(n, r) {
  return (s) => Be(n, r, s);
}
function sc(n) {
  return typeof n == "number" ? Y1 : typeof n == "string" ? Ou(n) ? $o : mt.test(n) ? Eh : J1 : Array.isArray(n) ? Qm : typeof n == "object" ? mt.test(n) ? Eh : X1 : $o;
}
function Qm(n, r) {
  const s = [...n], l = s.length, c = n.map((f, h) => sc(f)(f, r[h]));
  return (f) => {
    for (let h = 0; h < l; h++)
      s[h] = c[h](f);
    return s;
  };
}
function X1(n, r) {
  const s = { ...n, ...r }, l = {};
  for (const c in s)
    n[c] !== void 0 && r[c] !== void 0 && (l[c] = sc(n[c])(n[c], r[c]));
  return (c) => {
    for (const f in l)
      s[f] = l[f](c);
    return s;
  };
}
function Z1(n, r) {
  var s;
  const l = [], c = { color: 0, var: 0, number: 0 };
  for (let f = 0; f < r.values.length; f++) {
    const h = r.types[f], m = n.indexes[h][c[h]], g = (s = n.values[m]) !== null && s !== void 0 ? s : 0;
    l[f] = g, c[h]++;
  }
  return l;
}
const J1 = (n, r) => {
  const s = tr.createTransformer(r), l = ls(n), c = ls(r);
  return l.indexes.var.length === c.indexes.var.length && l.indexes.color.length === c.indexes.color.length && l.indexes.number.length >= c.indexes.number.length ? fu.has(n) && !c.values.length || fu.has(r) && !l.values.length ? Q1(n, r) : hs(Qm(Z1(l, c), c.values), s) : $o(n, r);
};
function Ym(n, r, s) {
  return typeof n == "number" && typeof r == "number" && typeof s == "number" ? Be(n, r, s) : sc(n)(n, r);
}
const ex = 5;
function Xm(n, r, s) {
  const l = Math.max(r - ex, 0);
  return wm(s - n(l), r - l);
}
const $e = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Kl = 1e-3;
function tx({ duration: n = $e.duration, bounce: r = $e.bounce, velocity: s = $e.velocity, mass: l = $e.mass }) {
  let c, f, h = 1 - r;
  h = Rn($e.minDamping, $e.maxDamping, h), n = Rn($e.minDuration, $e.maxDuration, /* @__PURE__ */ Mn(n)), h < 1 ? (c = (p) => {
    const y = p * h, x = y * n, S = y - s, E = hu(p, h), C = Math.exp(-x);
    return Kl - S / E * C;
  }, f = (p) => {
    const x = p * h * n, S = x * s + s, E = Math.pow(h, 2) * Math.pow(p, 2) * n, C = Math.exp(-x), R = hu(Math.pow(p, 2), h);
    return (-c(p) + Kl > 0 ? -1 : 1) * ((S - E) * C) / R;
  }) : (c = (p) => {
    const y = Math.exp(-p * n), x = (p - s) * n + 1;
    return -Kl + y * x;
  }, f = (p) => {
    const y = Math.exp(-p * n), x = (s - p) * (n * n);
    return y * x;
  });
  const m = 5 / n, g = rx(c, f, m);
  if (n = /* @__PURE__ */ An(n), isNaN(g))
    return {
      stiffness: $e.stiffness,
      damping: $e.damping,
      duration: n
    };
  {
    const p = Math.pow(g, 2) * l;
    return {
      stiffness: p,
      damping: h * 2 * Math.sqrt(l * p),
      duration: n
    };
  }
}
const nx = 12;
function rx(n, r, s) {
  let l = s;
  for (let c = 1; c < nx; c++)
    l = l - n(l) / r(l);
  return l;
}
function hu(n, r) {
  return n * Math.sqrt(1 - r * r);
}
const ix = ["duration", "bounce"], sx = ["stiffness", "damping", "mass"];
function Ch(n, r) {
  return r.some((s) => n[s] !== void 0);
}
function ox(n) {
  let r = {
    velocity: $e.velocity,
    stiffness: $e.stiffness,
    damping: $e.damping,
    mass: $e.mass,
    isResolvedFromDuration: !1,
    ...n
  };
  if (!Ch(n, sx) && Ch(n, ix))
    if (n.visualDuration) {
      const s = n.visualDuration, l = 2 * Math.PI / (s * 1.2), c = l * l, f = 2 * Rn(0.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(c);
      r = {
        ...r,
        mass: $e.mass,
        stiffness: c,
        damping: f
      };
    } else {
      const s = tx(n);
      r = {
        ...r,
        ...s,
        mass: $e.mass
      }, r.isResolvedFromDuration = !0;
    }
  return r;
}
function Zm(n = $e.visualDuration, r = $e.bounce) {
  const s = typeof n != "object" ? {
    visualDuration: n,
    keyframes: [0, 1],
    bounce: r
  } : n;
  let { restSpeed: l, restDelta: c } = s;
  const f = s.keyframes[0], h = s.keyframes[s.keyframes.length - 1], m = { done: !1, value: f }, { stiffness: g, damping: p, mass: y, duration: x, velocity: S, isResolvedFromDuration: E } = ox({
    ...s,
    velocity: -/* @__PURE__ */ Mn(s.velocity || 0)
  }), C = S || 0, R = p / (2 * Math.sqrt(g * y)), _ = h - f, L = /* @__PURE__ */ Mn(Math.sqrt(g / y)), D = Math.abs(_) < 5;
  l || (l = D ? $e.restSpeed.granular : $e.restSpeed.default), c || (c = D ? $e.restDelta.granular : $e.restDelta.default);
  let V;
  if (R < 1) {
    const K = hu(L, R);
    V = (J) => {
      const U = Math.exp(-R * L * J);
      return h - U * ((C + R * L * _) / K * Math.sin(K * J) + _ * Math.cos(K * J));
    };
  } else if (R === 1)
    V = (K) => h - Math.exp(-L * K) * (_ + (C + L * _) * K);
  else {
    const K = L * Math.sqrt(R * R - 1);
    V = (J) => {
      const U = Math.exp(-R * L * J), $ = Math.min(K * J, 300);
      return h - U * ((C + R * L * _) * Math.sinh($) + K * _ * Math.cosh($)) / K;
    };
  }
  const Q = {
    calculatedDuration: E && x || null,
    next: (K) => {
      const J = V(K);
      if (E)
        m.done = K >= x;
      else {
        let U = 0;
        R < 1 && (U = K === 0 ? /* @__PURE__ */ An(C) : Xm(V, K, J));
        const $ = Math.abs(U) <= l, he = Math.abs(h - J) <= c;
        m.done = $ && he;
      }
      return m.value = m.done ? h : J, m;
    },
    toString: () => {
      const K = Math.min(Gm(Q), du), J = jm((U) => Q.next(K * U).value, K, 30);
      return K + "ms " + J;
    }
  };
  return Q;
}
function Th({ keyframes: n, velocity: r = 0, power: s = 0.8, timeConstant: l = 325, bounceDamping: c = 10, bounceStiffness: f = 500, modifyTarget: h, min: m, max: g, restDelta: p = 0.5, restSpeed: y }) {
  const x = n[0], S = {
    done: !1,
    value: x
  }, E = ($) => m !== void 0 && $ < m || g !== void 0 && $ > g, C = ($) => m === void 0 ? g : g === void 0 || Math.abs(m - $) < Math.abs(g - $) ? m : g;
  let R = s * r;
  const _ = x + R, L = h === void 0 ? _ : h(_);
  L !== _ && (R = L - x);
  const D = ($) => -R * Math.exp(-$ / l), V = ($) => L + D($), Q = ($) => {
    const he = D($), oe = V($);
    S.done = Math.abs(he) <= p, S.value = S.done ? L : oe;
  };
  let K, J;
  const U = ($) => {
    E(S.value) && (K = $, J = Zm({
      keyframes: [S.value, C(S.value)],
      velocity: Xm(V, $, S.value),
      // TODO: This should be passing * 1000
      damping: c,
      stiffness: f,
      restDelta: p,
      restSpeed: y
    }));
  };
  return U(0), {
    calculatedDuration: null,
    next: ($) => {
      let he = !1;
      return !J && K === void 0 && (he = !0, Q($), U($)), K !== void 0 && $ >= K ? J.next($ - K) : (!he && Q($), S);
    }
  };
}
const ax = /* @__PURE__ */ fs(0.42, 0, 1, 1), lx = /* @__PURE__ */ fs(0, 0, 0.58, 1), Jm = /* @__PURE__ */ fs(0.42, 0, 0.58, 1), ux = (n) => Array.isArray(n) && typeof n[0] != "number", cx = {
  linear: Lt,
  easeIn: ax,
  easeInOut: Jm,
  easeOut: lx,
  circIn: ec,
  circInOut: Lm,
  circOut: Rm,
  backIn: Ju,
  backInOut: Am,
  backOut: Nm,
  anticipate: Mm
}, Ph = (n) => {
  if (Zu(n)) {
    Zp(n.length === 4);
    const [r, s, l, c] = n;
    return fs(r, s, l, c);
  } else if (typeof n == "string")
    return cx[n];
  return n;
};
function dx(n, r, s) {
  const l = [], c = s || Ym, f = n.length - 1;
  for (let h = 0; h < f; h++) {
    let m = c(n[h], n[h + 1]);
    if (r) {
      const g = Array.isArray(r) ? r[h] || Lt : r;
      m = hs(g, m);
    }
    l.push(m);
  }
  return l;
}
function fx(n, r, { clamp: s = !0, ease: l, mixer: c } = {}) {
  const f = n.length;
  if (Zp(f === r.length), f === 1)
    return () => r[0];
  if (f === 2 && r[0] === r[1])
    return () => r[1];
  const h = n[0] === n[1];
  n[0] > n[f - 1] && (n = [...n].reverse(), r = [...r].reverse());
  const m = dx(r, l, c), g = m.length, p = (y) => {
    if (h && y < n[0])
      return r[0];
    let x = 0;
    if (g > 1)
      for (; x < n.length - 2 && !(y < n[x + 1]); x++)
        ;
    const S = /* @__PURE__ */ ri(n[x], n[x + 1], y);
    return m[x](S);
  };
  return s ? (y) => p(Rn(n[0], n[f - 1], y)) : p;
}
function hx(n, r) {
  const s = n[n.length - 1];
  for (let l = 1; l <= r; l++) {
    const c = /* @__PURE__ */ ri(0, r, l);
    n.push(Be(s, 1, c));
  }
}
function px(n) {
  const r = [0];
  return hx(r, n.length - 1), r;
}
function mx(n, r) {
  return n.map((s) => s * r);
}
function gx(n, r) {
  return n.map(() => r || Jm).splice(0, n.length - 1);
}
function Uo({ duration: n = 300, keyframes: r, times: s, ease: l = "easeInOut" }) {
  const c = ux(l) ? l.map(Ph) : Ph(l), f = {
    done: !1,
    value: r[0]
  }, h = mx(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    s && s.length === r.length ? s : px(r),
    n
  ), m = fx(h, r, {
    ease: Array.isArray(c) ? c : gx(r, c)
  });
  return {
    calculatedDuration: n,
    next: (g) => (f.value = m(g), f.done = g >= n, f)
  };
}
const vx = (n) => {
  const r = ({ timestamp: s }) => n(s);
  return {
    start: () => Le.update(r, !0),
    stop: () => er(r),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => at.isProcessing ? at.timestamp : hn.now()
  };
}, yx = {
  decay: Th,
  inertia: Th,
  tween: Uo,
  keyframes: Uo,
  spring: Zm
}, xx = (n) => n / 100;
class oc extends Km {
  constructor(r) {
    super(r), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: g } = this.options;
      g && g();
    };
    const { name: s, motionValue: l, element: c, keyframes: f } = this.options, h = (c == null ? void 0 : c.KeyframeResolver) || ic, m = (g, p) => this.onKeyframesResolved(g, p);
    this.resolver = new h(f, m, s, l, c), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(r) {
    const { type: s = "keyframes", repeat: l = 0, repeatDelay: c = 0, repeatType: f, velocity: h = 0 } = this.options, m = Xu(s) ? s : yx[s] || Uo;
    let g, p;
    m !== Uo && typeof r[0] != "number" && (g = hs(xx, Ym(r[0], r[1])), r = [0, 100]);
    const y = m({ ...this.options, keyframes: r });
    f === "mirror" && (p = m({
      ...this.options,
      keyframes: [...r].reverse(),
      velocity: -h
    })), y.calculatedDuration === null && (y.calculatedDuration = Gm(y));
    const { calculatedDuration: x } = y, S = x + c, E = S * (l + 1) - c;
    return {
      generator: y,
      mirroredGenerator: p,
      mapPercentToKeyframes: g,
      calculatedDuration: x,
      resolvedDuration: S,
      totalDuration: E
    };
  }
  onPostResolved() {
    const { autoplay: r = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !r ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(r, s = !1) {
    const { resolved: l } = this;
    if (!l) {
      const { keyframes: $ } = this.options;
      return { done: !0, value: $[$.length - 1] };
    }
    const { finalKeyframe: c, generator: f, mirroredGenerator: h, mapPercentToKeyframes: m, keyframes: g, calculatedDuration: p, totalDuration: y, resolvedDuration: x } = l;
    if (this.startTime === null)
      return f.next(0);
    const { delay: S, repeat: E, repeatType: C, repeatDelay: R, onUpdate: _ } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, r) : this.speed < 0 && (this.startTime = Math.min(r - y / this.speed, this.startTime)), s ? this.currentTime = r : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(r - this.startTime) * this.speed;
    const L = this.currentTime - S * (this.speed >= 0 ? 1 : -1), D = this.speed >= 0 ? L < 0 : L > y;
    this.currentTime = Math.max(L, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = y);
    let V = this.currentTime, Q = f;
    if (E) {
      const $ = Math.min(this.currentTime, y) / x;
      let he = Math.floor($), oe = $ % 1;
      !oe && $ >= 1 && (oe = 1), oe === 1 && he--, he = Math.min(he, E + 1), !!(he % 2) && (C === "reverse" ? (oe = 1 - oe, R && (oe -= R / x)) : C === "mirror" && (Q = h)), V = Rn(0, 1, oe) * x;
    }
    const K = D ? { done: !1, value: g[0] } : Q.next(V);
    m && (K.value = m(K.value));
    let { done: J } = K;
    !D && p !== null && (J = this.speed >= 0 ? this.currentTime >= y : this.currentTime <= 0);
    const U = this.holdTime === null && (this.state === "finished" || this.state === "running" && J);
    return U && c !== void 0 && (K.value = ea(g, this.options, c)), _ && _(K.value), U && this.finish(), K;
  }
  get duration() {
    const { resolved: r } = this;
    return r ? /* @__PURE__ */ Mn(r.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ Mn(this.currentTime);
  }
  set time(r) {
    r = /* @__PURE__ */ An(r), this.currentTime = r, this.holdTime !== null || this.speed === 0 ? this.holdTime = r : this.driver && (this.startTime = this.driver.now() - r / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(r) {
    const s = this.playbackSpeed !== r;
    this.playbackSpeed = r, s && (this.time = /* @__PURE__ */ Mn(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: r = vx, onPlay: s, startTime: l } = this.options;
    this.driver || (this.driver = r((f) => this.tick(f))), s && s();
    const c = this.driver.now();
    this.holdTime !== null ? this.startTime = c - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = c) : this.startTime = l ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var r;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (r = this.currentTime) !== null && r !== void 0 ? r : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: r } = this.options;
    r && r();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(r) {
    return this.startTime = 0, this.tick(r, !0);
  }
}
const wx = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Sx(n, r, s, { delay: l = 0, duration: c = 300, repeat: f = 0, repeatType: h = "loop", ease: m = "easeInOut", times: g } = {}) {
  const p = { [r]: s };
  g && (p.offset = g);
  const y = Em(m, c);
  return Array.isArray(y) && (p.easing = y), n.animate(p, {
    delay: l,
    duration: c,
    easing: Array.isArray(y) ? "linear" : y,
    fill: "both",
    iterations: f + 1,
    direction: h === "reverse" ? "alternate" : "normal"
  });
}
const jx = /* @__PURE__ */ Yu(() => Object.hasOwnProperty.call(Element.prototype, "animate")), Wo = 10, kx = 2e4;
function Ex(n) {
  return Xu(n.type) || n.type === "spring" || !km(n.ease);
}
function Cx(n, r) {
  const s = new oc({
    ...r,
    keyframes: n,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let l = { done: !1, value: n[0] };
  const c = [];
  let f = 0;
  for (; !l.done && f < kx; )
    l = s.sample(f), c.push(l.value), f += Wo;
  return {
    times: void 0,
    keyframes: c,
    duration: f - Wo,
    ease: "linear"
  };
}
const eg = {
  anticipate: Mm,
  backInOut: Am,
  circInOut: Lm
};
function Tx(n) {
  return n in eg;
}
class Nh extends Km {
  constructor(r) {
    super(r);
    const { name: s, motionValue: l, element: c, keyframes: f } = this.options;
    this.resolver = new Hm(f, (h, m) => this.onKeyframesResolved(h, m), s, l, c), this.resolver.scheduleResolve();
  }
  initPlayback(r, s) {
    let { duration: l = 300, times: c, ease: f, type: h, motionValue: m, name: g, startTime: p } = this.options;
    if (!m.owner || !m.owner.current)
      return !1;
    if (typeof f == "string" && zo() && Tx(f) && (f = eg[f]), Ex(this.options)) {
      const { onComplete: x, onUpdate: S, motionValue: E, element: C, ...R } = this.options, _ = Cx(r, R);
      r = _.keyframes, r.length === 1 && (r[1] = r[0]), l = _.duration, c = _.times, f = _.ease, h = "keyframes";
    }
    const y = Sx(m.owner.current, g, r, { ...this.options, duration: l, times: c, ease: f });
    return y.startTime = p ?? this.calcStartTime(), this.pendingTimeline ? (gh(y, this.pendingTimeline), this.pendingTimeline = void 0) : y.onfinish = () => {
      const { onComplete: x } = this.options;
      m.set(ea(r, this.options, s)), x && x(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: y,
      duration: l,
      times: c,
      type: h,
      ease: f,
      keyframes: r
    };
  }
  get duration() {
    const { resolved: r } = this;
    if (!r)
      return 0;
    const { duration: s } = r;
    return /* @__PURE__ */ Mn(s);
  }
  get time() {
    const { resolved: r } = this;
    if (!r)
      return 0;
    const { animation: s } = r;
    return /* @__PURE__ */ Mn(s.currentTime || 0);
  }
  set time(r) {
    const { resolved: s } = this;
    if (!s)
      return;
    const { animation: l } = s;
    l.currentTime = /* @__PURE__ */ An(r);
  }
  get speed() {
    const { resolved: r } = this;
    if (!r)
      return 1;
    const { animation: s } = r;
    return s.playbackRate;
  }
  set speed(r) {
    const { resolved: s } = this;
    if (!s)
      return;
    const { animation: l } = s;
    l.playbackRate = r;
  }
  get state() {
    const { resolved: r } = this;
    if (!r)
      return "idle";
    const { animation: s } = r;
    return s.playState;
  }
  get startTime() {
    const { resolved: r } = this;
    if (!r)
      return null;
    const { animation: s } = r;
    return s.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(r) {
    if (!this._resolved)
      this.pendingTimeline = r;
    else {
      const { resolved: s } = this;
      if (!s)
        return Lt;
      const { animation: l } = s;
      gh(l, r);
    }
    return Lt;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: r } = this;
    if (!r)
      return;
    const { animation: s } = r;
    s.playState === "finished" && this.updateFinishedPromise(), s.play();
  }
  pause() {
    const { resolved: r } = this;
    if (!r)
      return;
    const { animation: s } = r;
    s.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: r } = this;
    if (!r)
      return;
    const { animation: s, keyframes: l, duration: c, type: f, ease: h, times: m } = r;
    if (s.playState === "idle" || s.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: p, onUpdate: y, onComplete: x, element: S, ...E } = this.options, C = new oc({
        ...E,
        keyframes: l,
        duration: c,
        type: f,
        ease: h,
        times: m,
        isGenerator: !0
      }), R = /* @__PURE__ */ An(this.time);
      p.setWithVelocity(C.sample(R - Wo).value, C.sample(R).value, Wo);
    }
    const { onStop: g } = this.options;
    g && g(), this.cancel();
  }
  complete() {
    const { resolved: r } = this;
    r && r.animation.finish();
  }
  cancel() {
    const { resolved: r } = this;
    r && r.animation.cancel();
  }
  static supports(r) {
    const { motionValue: s, name: l, repeatDelay: c, repeatType: f, damping: h, type: m } = r;
    if (!s || !s.owner || !(s.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: g, transformTemplate: p } = s.owner.getProps();
    return jx() && l && wx.has(l) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !g && !p && !c && f !== "mirror" && h !== 0 && m !== "inertia";
  }
}
const Px = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Nx = (n) => ({
  type: "spring",
  stiffness: 550,
  damping: n === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Ax = {
  type: "keyframes",
  duration: 0.8
}, Mx = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Rx = (n, { keyframes: r }) => r.length > 2 ? Ax : Er.has(n) ? n.startsWith("scale") ? Nx(r[1]) : Px : Mx;
function Lx({ when: n, delay: r, delayChildren: s, staggerChildren: l, staggerDirection: c, repeat: f, repeatType: h, repeatDelay: m, from: g, elapsed: p, ...y }) {
  return !!Object.keys(y).length;
}
const ac = (n, r, s, l = {}, c, f) => (h) => {
  const m = Hu(l, n) || {}, g = m.delay || l.delay || 0;
  let { elapsed: p = 0 } = l;
  p = p - /* @__PURE__ */ An(g);
  let y = {
    keyframes: Array.isArray(s) ? s : [null, s],
    ease: "easeOut",
    velocity: r.getVelocity(),
    ...m,
    delay: -p,
    onUpdate: (S) => {
      r.set(S), m.onUpdate && m.onUpdate(S);
    },
    onComplete: () => {
      h(), m.onComplete && m.onComplete();
    },
    name: n,
    motionValue: r,
    element: f ? void 0 : c
  };
  Lx(m) || (y = {
    ...y,
    ...Rx(n, y)
  }), y.duration && (y.duration = /* @__PURE__ */ An(y.duration)), y.repeatDelay && (y.repeatDelay = /* @__PURE__ */ An(y.repeatDelay)), y.from !== void 0 && (y.keyframes[0] = y.from);
  let x = !1;
  if ((y.type === !1 || y.duration === 0 && !y.repeatDelay) && (y.duration = 0, y.delay === 0 && (x = !0)), x && !f && r.get() !== void 0) {
    const S = ea(y.keyframes, m);
    if (S !== void 0)
      return Le.update(() => {
        y.onUpdate(S), y.onComplete();
      }), new c1([]);
  }
  return !f && Nh.supports(y) ? new Nh(y) : new oc(y);
};
function bx({ protectedKeys: n, needsAnimating: r }, s) {
  const l = n.hasOwnProperty(s) && r[s] !== !0;
  return r[s] = !1, l;
}
function tg(n, r, { delay: s = 0, transitionOverride: l, type: c } = {}) {
  var f;
  let { transition: h = n.getDefaultTransition(), transitionEnd: m, ...g } = r;
  l && (h = l);
  const p = [], y = c && n.animationState && n.animationState.getState()[c];
  for (const x in g) {
    const S = n.getValue(x, (f = n.latestValues[x]) !== null && f !== void 0 ? f : null), E = g[x];
    if (E === void 0 || y && bx(y, x))
      continue;
    const C = {
      delay: s,
      ...Hu(h || {}, x)
    };
    let R = !1;
    if (window.MotionHandoffAnimation) {
      const L = Sm(n);
      if (L) {
        const D = window.MotionHandoffAnimation(L, x, Le);
        D !== null && (C.startTime = D, R = !0);
      }
    }
    su(n, x), S.start(ac(x, S, E, n.shouldReduceMotion && xm.has(x) ? { type: !1 } : C, n, R));
    const _ = S.animation;
    _ && p.push(_);
  }
  return m && Promise.all(p).then(() => {
    Le.update(() => {
      m && o1(n, m);
    });
  }), p;
}
function pu(n, r, s = {}) {
  var l;
  const c = Jo(n, r, s.type === "exit" ? (l = n.presenceContext) === null || l === void 0 ? void 0 : l.custom : void 0);
  let { transition: f = n.getDefaultTransition() || {} } = c || {};
  s.transitionOverride && (f = s.transitionOverride);
  const h = c ? () => Promise.all(tg(n, c, s)) : () => Promise.resolve(), m = n.variantChildren && n.variantChildren.size ? (p = 0) => {
    const { delayChildren: y = 0, staggerChildren: x, staggerDirection: S } = f;
    return _x(n, r, y + p, x, S, s);
  } : () => Promise.resolve(), { when: g } = f;
  if (g) {
    const [p, y] = g === "beforeChildren" ? [h, m] : [m, h];
    return p().then(() => y());
  } else
    return Promise.all([h(), m(s.delay)]);
}
function _x(n, r, s = 0, l = 0, c = 1, f) {
  const h = [], m = (n.variantChildren.size - 1) * l, g = c === 1 ? (p = 0) => p * l : (p = 0) => m - p * l;
  return Array.from(n.variantChildren).sort(Dx).forEach((p, y) => {
    p.notify("AnimationStart", r), h.push(pu(p, r, {
      ...f,
      delay: s + g(y)
    }).then(() => p.notify("AnimationComplete", r)));
  }), Promise.all(h);
}
function Dx(n, r) {
  return n.sortNodePosition(r);
}
function Ix(n, r, s = {}) {
  n.notify("AnimationStart", r);
  let l;
  if (Array.isArray(r)) {
    const c = r.map((f) => pu(n, f, s));
    l = Promise.all(c);
  } else if (typeof r == "string")
    l = pu(n, r, s);
  else {
    const c = typeof r == "function" ? Jo(n, r, s.custom) : r;
    l = Promise.all(tg(n, c, s));
  }
  return l.then(() => {
    n.notify("AnimationComplete", r);
  });
}
const Vx = _u.length;
function ng(n) {
  if (!n)
    return;
  if (!n.isControllingVariants) {
    const s = n.parent ? ng(n.parent) || {} : {};
    return n.props.initial !== void 0 && (s.initial = n.props.initial), s;
  }
  const r = {};
  for (let s = 0; s < Vx; s++) {
    const l = _u[s], c = n.props[l];
    (ss(c) || c === !1) && (r[l] = c);
  }
  return r;
}
const qx = [...bu].reverse(), Ox = bu.length;
function Fx(n) {
  return (r) => Promise.all(r.map(({ animation: s, options: l }) => Ix(n, s, l)));
}
function Bx(n) {
  let r = Fx(n), s = Ah(), l = !0;
  const c = (g) => (p, y) => {
    var x;
    const S = Jo(n, y, g === "exit" ? (x = n.presenceContext) === null || x === void 0 ? void 0 : x.custom : void 0);
    if (S) {
      const { transition: E, transitionEnd: C, ...R } = S;
      p = { ...p, ...R, ...C };
    }
    return p;
  };
  function f(g) {
    r = g(n);
  }
  function h(g) {
    const { props: p } = n, y = ng(n.parent) || {}, x = [], S = /* @__PURE__ */ new Set();
    let E = {}, C = 1 / 0;
    for (let _ = 0; _ < Ox; _++) {
      const L = qx[_], D = s[L], V = p[L] !== void 0 ? p[L] : y[L], Q = ss(V), K = L === g ? D.isActive : null;
      K === !1 && (C = _);
      let J = V === y[L] && V !== p[L] && Q;
      if (J && l && n.manuallyAnimateOnMount && (J = !1), D.protectedKeys = { ...E }, // If it isn't active and hasn't *just* been set as inactive
      !D.isActive && K === null || // If we didn't and don't have any defined prop for this animation type
      !V && !D.prevProp || // Or if the prop doesn't define an animation
      Xo(V) || typeof V == "boolean")
        continue;
      const U = zx(D.prevProp, V);
      let $ = U || // If we're making this variant active, we want to always make it active
      L === g && D.isActive && !J && Q || // If we removed a higher-priority variant (i is in reverse order)
      _ > C && Q, he = !1;
      const oe = Array.isArray(V) ? V : [V];
      let Ie = oe.reduce(c(L), {});
      K === !1 && (Ie = {});
      const { prevResolvedValues: Ge = {} } = D, Te = {
        ...Ge,
        ...Ie
      }, Ue = (re) => {
        $ = !0, S.has(re) && (he = !0, S.delete(re)), D.needsAnimating[re] = !0;
        const B = n.getValue(re);
        B && (B.liveStyle = !1);
      };
      for (const re in Te) {
        const B = Ie[re], te = Ge[re];
        if (E.hasOwnProperty(re))
          continue;
        let W = !1;
        iu(B) && iu(te) ? W = !ym(B, te) : W = B !== te, W ? B != null ? Ue(re) : S.add(re) : B !== void 0 && S.has(re) ? Ue(re) : D.protectedKeys[re] = !0;
      }
      D.prevProp = V, D.prevResolvedValues = Ie, D.isActive && (E = { ...E, ...Ie }), l && n.blockInitialAnimation && ($ = !1), $ && (!(J && U) || he) && x.push(...oe.map((re) => ({
        animation: re,
        options: { type: L }
      })));
    }
    if (S.size) {
      const _ = {};
      S.forEach((L) => {
        const D = n.getBaseTarget(L), V = n.getValue(L);
        V && (V.liveStyle = !0), _[L] = D ?? null;
      }), x.push({ animation: _ });
    }
    let R = !!x.length;
    return l && (p.initial === !1 || p.initial === p.animate) && !n.manuallyAnimateOnMount && (R = !1), l = !1, R ? r(x) : Promise.resolve();
  }
  function m(g, p) {
    var y;
    if (s[g].isActive === p)
      return Promise.resolve();
    (y = n.variantChildren) === null || y === void 0 || y.forEach((S) => {
      var E;
      return (E = S.animationState) === null || E === void 0 ? void 0 : E.setActive(g, p);
    }), s[g].isActive = p;
    const x = h(g);
    for (const S in s)
      s[S].protectedKeys = {};
    return x;
  }
  return {
    animateChanges: h,
    setActive: m,
    setAnimateFunction: f,
    getState: () => s,
    reset: () => {
      s = Ah(), l = !0;
    }
  };
}
function zx(n, r) {
  return typeof r == "string" ? r !== n : Array.isArray(r) ? !ym(r, n) : !1;
}
function yr(n = !1) {
  return {
    isActive: n,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Ah() {
  return {
    animate: yr(!0),
    whileInView: yr(),
    whileHover: yr(),
    whileTap: yr(),
    whileDrag: yr(),
    whileFocus: yr(),
    exit: yr()
  };
}
class nr {
  constructor(r) {
    this.isMounted = !1, this.node = r;
  }
  update() {
  }
}
class $x extends nr {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(r) {
    super(r), r.animationState || (r.animationState = Bx(r));
  }
  updateAnimationControlsSubscription() {
    const { animate: r } = this.node.getProps();
    Xo(r) && (this.unmountControls = r.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: r } = this.node.getProps(), { animate: s } = this.node.prevProps || {};
    r !== s && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var r;
    this.node.animationState.reset(), (r = this.unmountControls) === null || r === void 0 || r.call(this);
  }
}
let Ux = 0;
class Wx extends nr {
  constructor() {
    super(...arguments), this.id = Ux++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: r, onExitComplete: s } = this.node.presenceContext, { isPresent: l } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || r === l)
      return;
    const c = this.node.animationState.setActive("exit", !r);
    s && !r && c.then(() => s(this.id));
  }
  mount() {
    const { register: r } = this.node.presenceContext || {};
    r && (this.unmount = r(this.id));
  }
  unmount() {
  }
}
const Hx = {
  animation: {
    Feature: $x
  },
  exit: {
    Feature: Wx
  }
}, en = {
  x: !1,
  y: !1
};
function rg() {
  return en.x || en.y;
}
function Kx(n) {
  return n === "x" || n === "y" ? en[n] ? null : (en[n] = !0, () => {
    en[n] = !1;
  }) : en.x || en.y ? null : (en.x = en.y = !0, () => {
    en.x = en.y = !1;
  });
}
const lc = (n) => n.pointerType === "mouse" ? typeof n.button != "number" || n.button <= 0 : n.isPrimary !== !1;
function us(n, r, s, l = { passive: !0 }) {
  return n.addEventListener(r, s, l), () => n.removeEventListener(r, s);
}
function ps(n) {
  return {
    point: {
      x: n.pageX,
      y: n.pageY
    }
  };
}
const Gx = (n) => (r) => lc(r) && n(r, ps(r));
function es(n, r, s, l) {
  return us(n, r, Gx(s), l);
}
const Mh = (n, r) => Math.abs(n - r);
function Qx(n, r) {
  const s = Mh(n.x, r.x), l = Mh(n.y, r.y);
  return Math.sqrt(s ** 2 + l ** 2);
}
class ig {
  constructor(r, s, { transformPagePoint: l, contextWindow: c, dragSnapToOrigin: f = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const x = Ql(this.lastMoveEventInfo, this.history), S = this.startEvent !== null, E = Qx(x.offset, { x: 0, y: 0 }) >= 3;
      if (!S && !E)
        return;
      const { point: C } = x, { timestamp: R } = at;
      this.history.push({ ...C, timestamp: R });
      const { onStart: _, onMove: L } = this.handlers;
      S || (_ && _(this.lastMoveEvent, x), this.startEvent = this.lastMoveEvent), L && L(this.lastMoveEvent, x);
    }, this.handlePointerMove = (x, S) => {
      this.lastMoveEvent = x, this.lastMoveEventInfo = Gl(S, this.transformPagePoint), Le.update(this.updatePoint, !0);
    }, this.handlePointerUp = (x, S) => {
      this.end();
      const { onEnd: E, onSessionEnd: C, resumeAnimation: R } = this.handlers;
      if (this.dragSnapToOrigin && R && R(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const _ = Ql(x.type === "pointercancel" ? this.lastMoveEventInfo : Gl(S, this.transformPagePoint), this.history);
      this.startEvent && E && E(x, _), C && C(x, _);
    }, !lc(r))
      return;
    this.dragSnapToOrigin = f, this.handlers = s, this.transformPagePoint = l, this.contextWindow = c || window;
    const h = ps(r), m = Gl(h, this.transformPagePoint), { point: g } = m, { timestamp: p } = at;
    this.history = [{ ...g, timestamp: p }];
    const { onSessionStart: y } = s;
    y && y(r, Ql(m, this.history)), this.removeListeners = hs(es(this.contextWindow, "pointermove", this.handlePointerMove), es(this.contextWindow, "pointerup", this.handlePointerUp), es(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(r) {
    this.handlers = r;
  }
  end() {
    this.removeListeners && this.removeListeners(), er(this.updatePoint);
  }
}
function Gl(n, r) {
  return r ? { point: r(n.point) } : n;
}
function Rh(n, r) {
  return { x: n.x - r.x, y: n.y - r.y };
}
function Ql({ point: n }, r) {
  return {
    point: n,
    delta: Rh(n, sg(r)),
    offset: Rh(n, Yx(r)),
    velocity: Xx(r, 0.1)
  };
}
function Yx(n) {
  return n[0];
}
function sg(n) {
  return n[n.length - 1];
}
function Xx(n, r) {
  if (n.length < 2)
    return { x: 0, y: 0 };
  let s = n.length - 1, l = null;
  const c = sg(n);
  for (; s >= 0 && (l = n[s], !(c.timestamp - l.timestamp > /* @__PURE__ */ An(r))); )
    s--;
  if (!l)
    return { x: 0, y: 0 };
  const f = /* @__PURE__ */ Mn(c.timestamp - l.timestamp);
  if (f === 0)
    return { x: 0, y: 0 };
  const h = {
    x: (c.x - l.x) / f,
    y: (c.y - l.y) / f
  };
  return h.x === 1 / 0 && (h.x = 0), h.y === 1 / 0 && (h.y = 0), h;
}
const og = 1e-4, Zx = 1 - og, Jx = 1 + og, ag = 0.01, ew = 0 - ag, tw = 0 + ag;
function bt(n) {
  return n.max - n.min;
}
function nw(n, r, s) {
  return Math.abs(n - r) <= s;
}
function Lh(n, r, s, l = 0.5) {
  n.origin = l, n.originPoint = Be(r.min, r.max, n.origin), n.scale = bt(s) / bt(r), n.translate = Be(s.min, s.max, n.origin) - n.originPoint, (n.scale >= Zx && n.scale <= Jx || isNaN(n.scale)) && (n.scale = 1), (n.translate >= ew && n.translate <= tw || isNaN(n.translate)) && (n.translate = 0);
}
function ts(n, r, s, l) {
  Lh(n.x, r.x, s.x, l ? l.originX : void 0), Lh(n.y, r.y, s.y, l ? l.originY : void 0);
}
function bh(n, r, s) {
  n.min = s.min + r.min, n.max = n.min + bt(r);
}
function rw(n, r, s) {
  bh(n.x, r.x, s.x), bh(n.y, r.y, s.y);
}
function _h(n, r, s) {
  n.min = r.min - s.min, n.max = n.min + bt(r);
}
function ns(n, r, s) {
  _h(n.x, r.x, s.x), _h(n.y, r.y, s.y);
}
function iw(n, { min: r, max: s }, l) {
  return r !== void 0 && n < r ? n = l ? Be(r, n, l.min) : Math.max(n, r) : s !== void 0 && n > s && (n = l ? Be(s, n, l.max) : Math.min(n, s)), n;
}
function Dh(n, r, s) {
  return {
    min: r !== void 0 ? n.min + r : void 0,
    max: s !== void 0 ? n.max + s - (n.max - n.min) : void 0
  };
}
function sw(n, { top: r, left: s, bottom: l, right: c }) {
  return {
    x: Dh(n.x, s, c),
    y: Dh(n.y, r, l)
  };
}
function Ih(n, r) {
  let s = r.min - n.min, l = r.max - n.max;
  return r.max - r.min < n.max - n.min && ([s, l] = [l, s]), { min: s, max: l };
}
function ow(n, r) {
  return {
    x: Ih(n.x, r.x),
    y: Ih(n.y, r.y)
  };
}
function aw(n, r) {
  let s = 0.5;
  const l = bt(n), c = bt(r);
  return c > l ? s = /* @__PURE__ */ ri(r.min, r.max - l, n.min) : l > c && (s = /* @__PURE__ */ ri(n.min, n.max - c, r.min)), Rn(0, 1, s);
}
function lw(n, r) {
  const s = {};
  return r.min !== void 0 && (s.min = r.min - n.min), r.max !== void 0 && (s.max = r.max - n.min), s;
}
const mu = 0.35;
function uw(n = mu) {
  return n === !1 ? n = 0 : n === !0 && (n = mu), {
    x: Vh(n, "left", "right"),
    y: Vh(n, "top", "bottom")
  };
}
function Vh(n, r, s) {
  return {
    min: qh(n, r),
    max: qh(n, s)
  };
}
function qh(n, r) {
  return typeof n == "number" ? n : n[r] || 0;
}
const Oh = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Zr = () => ({
  x: Oh(),
  y: Oh()
}), Fh = () => ({ min: 0, max: 0 }), Ke = () => ({
  x: Fh(),
  y: Fh()
});
function $t(n) {
  return [n("x"), n("y")];
}
function lg({ top: n, left: r, right: s, bottom: l }) {
  return {
    x: { min: r, max: s },
    y: { min: n, max: l }
  };
}
function cw({ x: n, y: r }) {
  return { top: r.min, right: n.max, bottom: r.max, left: n.min };
}
function dw(n, r) {
  if (!r)
    return n;
  const s = r({ x: n.left, y: n.top }), l = r({ x: n.right, y: n.bottom });
  return {
    top: s.y,
    left: s.x,
    bottom: l.y,
    right: l.x
  };
}
function Yl(n) {
  return n === void 0 || n === 1;
}
function gu({ scale: n, scaleX: r, scaleY: s }) {
  return !Yl(n) || !Yl(r) || !Yl(s);
}
function xr(n) {
  return gu(n) || ug(n) || n.z || n.rotate || n.rotateX || n.rotateY || n.skewX || n.skewY;
}
function ug(n) {
  return Bh(n.x) || Bh(n.y);
}
function Bh(n) {
  return n && n !== "0%";
}
function Ho(n, r, s) {
  const l = n - s, c = r * l;
  return s + c;
}
function zh(n, r, s, l, c) {
  return c !== void 0 && (n = Ho(n, c, l)), Ho(n, s, l) + r;
}
function vu(n, r = 0, s = 1, l, c) {
  n.min = zh(n.min, r, s, l, c), n.max = zh(n.max, r, s, l, c);
}
function cg(n, { x: r, y: s }) {
  vu(n.x, r.translate, r.scale, r.originPoint), vu(n.y, s.translate, s.scale, s.originPoint);
}
const $h = 0.999999999999, Uh = 1.0000000000001;
function fw(n, r, s, l = !1) {
  const c = s.length;
  if (!c)
    return;
  r.x = r.y = 1;
  let f, h;
  for (let m = 0; m < c; m++) {
    f = s[m], h = f.projectionDelta;
    const { visualElement: g } = f.options;
    g && g.props.style && g.props.style.display === "contents" || (l && f.options.layoutScroll && f.scroll && f !== f.root && ei(n, {
      x: -f.scroll.offset.x,
      y: -f.scroll.offset.y
    }), h && (r.x *= h.x.scale, r.y *= h.y.scale, cg(n, h)), l && xr(f.latestValues) && ei(n, f.latestValues));
  }
  r.x < Uh && r.x > $h && (r.x = 1), r.y < Uh && r.y > $h && (r.y = 1);
}
function Jr(n, r) {
  n.min = n.min + r, n.max = n.max + r;
}
function Wh(n, r, s, l, c = 0.5) {
  const f = Be(n.min, n.max, c);
  vu(n, r, s, f, l);
}
function ei(n, r) {
  Wh(n.x, r.x, r.scaleX, r.scale, r.originX), Wh(n.y, r.y, r.scaleY, r.scale, r.originY);
}
function dg(n, r) {
  return lg(dw(n.getBoundingClientRect(), r));
}
function hw(n, r, s) {
  const l = dg(n, s), { scroll: c } = r;
  return c && (Jr(l.x, c.offset.x), Jr(l.y, c.offset.y)), l;
}
const fg = ({ current: n }) => n ? n.ownerDocument.defaultView : null, pw = /* @__PURE__ */ new WeakMap();
class mw {
  constructor(r) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Ke(), this.visualElement = r;
  }
  start(r, { snapToCursor: s = !1 } = {}) {
    const { presenceContext: l } = this.visualElement;
    if (l && l.isPresent === !1)
      return;
    const c = (y) => {
      const { dragSnapToOrigin: x } = this.getProps();
      x ? this.pauseAnimation() : this.stopAnimation(), s && this.snapToCursor(ps(y).point);
    }, f = (y, x) => {
      const { drag: S, dragPropagation: E, onDragStart: C } = this.getProps();
      if (S && !E && (this.openDragLock && this.openDragLock(), this.openDragLock = Kx(S), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), $t((_) => {
        let L = this.getAxisMotionValue(_).get() || 0;
        if (fn.test(L)) {
          const { projection: D } = this.visualElement;
          if (D && D.layout) {
            const V = D.layout.layoutBox[_];
            V && (L = bt(V) * (parseFloat(L) / 100));
          }
        }
        this.originPoint[_] = L;
      }), C && Le.postRender(() => C(y, x)), su(this.visualElement, "transform");
      const { animationState: R } = this.visualElement;
      R && R.setActive("whileDrag", !0);
    }, h = (y, x) => {
      const { dragPropagation: S, dragDirectionLock: E, onDirectionLock: C, onDrag: R } = this.getProps();
      if (!S && !this.openDragLock)
        return;
      const { offset: _ } = x;
      if (E && this.currentDirection === null) {
        this.currentDirection = gw(_), this.currentDirection !== null && C && C(this.currentDirection);
        return;
      }
      this.updateAxis("x", x.point, _), this.updateAxis("y", x.point, _), this.visualElement.render(), R && R(y, x);
    }, m = (y, x) => this.stop(y, x), g = () => $t((y) => {
      var x;
      return this.getAnimationState(y) === "paused" && ((x = this.getAxisMotionValue(y).animation) === null || x === void 0 ? void 0 : x.play());
    }), { dragSnapToOrigin: p } = this.getProps();
    this.panSession = new ig(r, {
      onSessionStart: c,
      onStart: f,
      onMove: h,
      onSessionEnd: m,
      resumeAnimation: g
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: p,
      contextWindow: fg(this.visualElement)
    });
  }
  stop(r, s) {
    const l = this.isDragging;
    if (this.cancel(), !l)
      return;
    const { velocity: c } = s;
    this.startAnimation(c);
    const { onDragEnd: f } = this.getProps();
    f && Le.postRender(() => f(r, s));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: r, animationState: s } = this.visualElement;
    r && (r.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: l } = this.getProps();
    !l && this.openDragLock && (this.openDragLock(), this.openDragLock = null), s && s.setActive("whileDrag", !1);
  }
  updateAxis(r, s, l) {
    const { drag: c } = this.getProps();
    if (!l || !No(r, c, this.currentDirection))
      return;
    const f = this.getAxisMotionValue(r);
    let h = this.originPoint[r] + l[r];
    this.constraints && this.constraints[r] && (h = iw(h, this.constraints[r], this.elastic[r])), f.set(h);
  }
  resolveConstraints() {
    var r;
    const { dragConstraints: s, dragElastic: l } = this.getProps(), c = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (r = this.visualElement.projection) === null || r === void 0 ? void 0 : r.layout, f = this.constraints;
    s && Yr(s) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : s && c ? this.constraints = sw(c.layoutBox, s) : this.constraints = !1, this.elastic = uw(l), f !== this.constraints && c && this.constraints && !this.hasMutatedConstraints && $t((h) => {
      this.constraints !== !1 && this.getAxisMotionValue(h) && (this.constraints[h] = lw(c.layoutBox[h], this.constraints[h]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: r, onMeasureDragConstraints: s } = this.getProps();
    if (!r || !Yr(r))
      return !1;
    const l = r.current, { projection: c } = this.visualElement;
    if (!c || !c.layout)
      return !1;
    const f = hw(l, c.root, this.visualElement.getTransformPagePoint());
    let h = ow(c.layout.layoutBox, f);
    if (s) {
      const m = s(cw(h));
      this.hasMutatedConstraints = !!m, m && (h = lg(m));
    }
    return h;
  }
  startAnimation(r) {
    const { drag: s, dragMomentum: l, dragElastic: c, dragTransition: f, dragSnapToOrigin: h, onDragTransitionEnd: m } = this.getProps(), g = this.constraints || {}, p = $t((y) => {
      if (!No(y, s, this.currentDirection))
        return;
      let x = g && g[y] || {};
      h && (x = { min: 0, max: 0 });
      const S = c ? 200 : 1e6, E = c ? 40 : 1e7, C = {
        type: "inertia",
        velocity: l ? r[y] : 0,
        bounceStiffness: S,
        bounceDamping: E,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...f,
        ...x
      };
      return this.startAxisValueAnimation(y, C);
    });
    return Promise.all(p).then(m);
  }
  startAxisValueAnimation(r, s) {
    const l = this.getAxisMotionValue(r);
    return su(this.visualElement, r), l.start(ac(r, l, 0, s, this.visualElement, !1));
  }
  stopAnimation() {
    $t((r) => this.getAxisMotionValue(r).stop());
  }
  pauseAnimation() {
    $t((r) => {
      var s;
      return (s = this.getAxisMotionValue(r).animation) === null || s === void 0 ? void 0 : s.pause();
    });
  }
  getAnimationState(r) {
    var s;
    return (s = this.getAxisMotionValue(r).animation) === null || s === void 0 ? void 0 : s.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(r) {
    const s = `_drag${r.toUpperCase()}`, l = this.visualElement.getProps(), c = l[s];
    return c || this.visualElement.getValue(r, (l.initial ? l.initial[r] : void 0) || 0);
  }
  snapToCursor(r) {
    $t((s) => {
      const { drag: l } = this.getProps();
      if (!No(s, l, this.currentDirection))
        return;
      const { projection: c } = this.visualElement, f = this.getAxisMotionValue(s);
      if (c && c.layout) {
        const { min: h, max: m } = c.layout.layoutBox[s];
        f.set(r[s] - Be(h, m, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: r, dragConstraints: s } = this.getProps(), { projection: l } = this.visualElement;
    if (!Yr(s) || !l || !this.constraints)
      return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    $t((h) => {
      const m = this.getAxisMotionValue(h);
      if (m && this.constraints !== !1) {
        const g = m.get();
        c[h] = aw({ min: g, max: g }, this.constraints[h]);
      }
    });
    const { transformTemplate: f } = this.visualElement.getProps();
    this.visualElement.current.style.transform = f ? f({}, "") : "none", l.root && l.root.updateScroll(), l.updateLayout(), this.resolveConstraints(), $t((h) => {
      if (!No(h, r, null))
        return;
      const m = this.getAxisMotionValue(h), { min: g, max: p } = this.constraints[h];
      m.set(Be(g, p, c[h]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    pw.set(this.visualElement, this);
    const r = this.visualElement.current, s = es(r, "pointerdown", (g) => {
      const { drag: p, dragListener: y = !0 } = this.getProps();
      p && y && this.start(g);
    }), l = () => {
      const { dragConstraints: g } = this.getProps();
      Yr(g) && g.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: c } = this.visualElement, f = c.addEventListener("measure", l);
    c && !c.layout && (c.root && c.root.updateScroll(), c.updateLayout()), Le.read(l);
    const h = us(window, "resize", () => this.scalePositionWithinConstraints()), m = c.addEventListener("didUpdate", (({ delta: g, hasLayoutChanged: p }) => {
      this.isDragging && p && ($t((y) => {
        const x = this.getAxisMotionValue(y);
        x && (this.originPoint[y] += g[y].translate, x.set(x.get() + g[y].translate));
      }), this.visualElement.render());
    }));
    return () => {
      h(), s(), f(), m && m();
    };
  }
  getProps() {
    const r = this.visualElement.getProps(), { drag: s = !1, dragDirectionLock: l = !1, dragPropagation: c = !1, dragConstraints: f = !1, dragElastic: h = mu, dragMomentum: m = !0 } = r;
    return {
      ...r,
      drag: s,
      dragDirectionLock: l,
      dragPropagation: c,
      dragConstraints: f,
      dragElastic: h,
      dragMomentum: m
    };
  }
}
function No(n, r, s) {
  return (r === !0 || r === n) && (s === null || s === n);
}
function gw(n, r = 10) {
  let s = null;
  return Math.abs(n.y) > r ? s = "y" : Math.abs(n.x) > r && (s = "x"), s;
}
class vw extends nr {
  constructor(r) {
    super(r), this.removeGroupControls = Lt, this.removeListeners = Lt, this.controls = new mw(r);
  }
  mount() {
    const { dragControls: r } = this.node.getProps();
    r && (this.removeGroupControls = r.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Lt;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Hh = (n) => (r, s) => {
  n && Le.postRender(() => n(r, s));
};
class yw extends nr {
  constructor() {
    super(...arguments), this.removePointerDownListener = Lt;
  }
  onPointerDown(r) {
    this.session = new ig(r, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: fg(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: r, onPanStart: s, onPan: l, onPanEnd: c } = this.node.getProps();
    return {
      onSessionStart: Hh(r),
      onStart: Hh(s),
      onMove: l,
      onEnd: (f, h) => {
        delete this.session, c && Le.postRender(() => c(f, h));
      }
    };
  }
  mount() {
    this.removePointerDownListener = es(this.node.current, "pointerdown", (r) => this.onPointerDown(r));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Do = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function Kh(n, r) {
  return r.max === r.min ? 0 : n / (r.max - r.min) * 100;
}
const Ki = {
  correct: (n, r) => {
    if (!r.target)
      return n;
    if (typeof n == "string")
      if (ae.test(n))
        n = parseFloat(n);
      else
        return n;
    const s = Kh(n, r.target.x), l = Kh(n, r.target.y);
    return `${s}% ${l}%`;
  }
}, xw = {
  correct: (n, { treeScale: r, projectionDelta: s }) => {
    const l = n, c = tr.parse(n);
    if (c.length > 5)
      return l;
    const f = tr.createTransformer(n), h = typeof c[0] != "number" ? 1 : 0, m = s.x.scale * r.x, g = s.y.scale * r.y;
    c[0 + h] /= m, c[1 + h] /= g;
    const p = Be(m, g, 0.5);
    return typeof c[2 + h] == "number" && (c[2 + h] /= p), typeof c[3 + h] == "number" && (c[3 + h] /= p), f(c);
  }
};
class ww extends N.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: r, layoutGroup: s, switchLayoutGroup: l, layoutId: c } = this.props, { projection: f } = r;
    H0(Sw), f && (s.group && s.group.add(f), l && l.register && c && l.register(f), f.root.didUpdate(), f.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), f.setOptions({
      ...f.options,
      onExitComplete: () => this.safeToRemove()
    })), Do.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(r) {
    const { layoutDependency: s, visualElement: l, drag: c, isPresent: f } = this.props, h = l.projection;
    return h && (h.isPresent = f, c || r.layoutDependency !== s || s === void 0 ? h.willUpdate() : this.safeToRemove(), r.isPresent !== f && (f ? h.promote() : h.relegate() || Le.postRender(() => {
      const m = h.getStack();
      (!m || !m.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: r } = this.props.visualElement;
    r && (r.root.didUpdate(), Iu.postRender(() => {
      !r.currentAnimation && r.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: r, layoutGroup: s, switchLayoutGroup: l } = this.props, { projection: c } = r;
    c && (c.scheduleCheckAfterUnmount(), s && s.group && s.group.remove(c), l && l.deregister && l.deregister(c));
  }
  safeToRemove() {
    const { safeToRemove: r } = this.props;
    r && r();
  }
  render() {
    return null;
  }
}
function hg(n) {
  const [r, s] = a0(), l = N.useContext(Yp);
  return a.jsx(ww, { ...n, layoutGroup: l, switchLayoutGroup: N.useContext(sm), isPresent: r, safeToRemove: s });
}
const Sw = {
  borderRadius: {
    ...Ki,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Ki,
  borderTopRightRadius: Ki,
  borderBottomLeftRadius: Ki,
  borderBottomRightRadius: Ki,
  boxShadow: xw
};
function jw(n, r, s) {
  const l = gt(n) ? n : as(n);
  return l.start(ac("", l, r, s)), l.animation;
}
function kw(n) {
  return n instanceof SVGElement && n.tagName !== "svg";
}
const Ew = (n, r) => n.depth - r.depth;
class Cw {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(r) {
    Ku(this.children, r), this.isDirty = !0;
  }
  remove(r) {
    Gu(this.children, r), this.isDirty = !0;
  }
  forEach(r) {
    this.isDirty && this.children.sort(Ew), this.isDirty = !1, this.children.forEach(r);
  }
}
function Tw(n, r) {
  const s = hn.now(), l = ({ timestamp: c }) => {
    const f = c - s;
    f >= r && (er(l), n(f - r));
  };
  return Le.read(l, !0), () => er(l);
}
const pg = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Pw = pg.length, Gh = (n) => typeof n == "string" ? parseFloat(n) : n, Qh = (n) => typeof n == "number" || ae.test(n);
function Nw(n, r, s, l, c, f) {
  c ? (n.opacity = Be(
    0,
    // TODO Reinstate this if only child
    s.opacity !== void 0 ? s.opacity : 1,
    Aw(l)
  ), n.opacityExit = Be(r.opacity !== void 0 ? r.opacity : 1, 0, Mw(l))) : f && (n.opacity = Be(r.opacity !== void 0 ? r.opacity : 1, s.opacity !== void 0 ? s.opacity : 1, l));
  for (let h = 0; h < Pw; h++) {
    const m = `border${pg[h]}Radius`;
    let g = Yh(r, m), p = Yh(s, m);
    if (g === void 0 && p === void 0)
      continue;
    g || (g = 0), p || (p = 0), g === 0 || p === 0 || Qh(g) === Qh(p) ? (n[m] = Math.max(Be(Gh(g), Gh(p), l), 0), (fn.test(p) || fn.test(g)) && (n[m] += "%")) : n[m] = p;
  }
  (r.rotate || s.rotate) && (n.rotate = Be(r.rotate || 0, s.rotate || 0, l));
}
function Yh(n, r) {
  return n[r] !== void 0 ? n[r] : n.borderRadius;
}
const Aw = /* @__PURE__ */ mg(0, 0.5, Rm), Mw = /* @__PURE__ */ mg(0.5, 0.95, Lt);
function mg(n, r, s) {
  return (l) => l < n ? 0 : l > r ? 1 : s(/* @__PURE__ */ ri(n, r, l));
}
function Xh(n, r) {
  n.min = r.min, n.max = r.max;
}
function zt(n, r) {
  Xh(n.x, r.x), Xh(n.y, r.y);
}
function Zh(n, r) {
  n.translate = r.translate, n.scale = r.scale, n.originPoint = r.originPoint, n.origin = r.origin;
}
function Jh(n, r, s, l, c) {
  return n -= r, n = Ho(n, 1 / s, l), c !== void 0 && (n = Ho(n, 1 / c, l)), n;
}
function Rw(n, r = 0, s = 1, l = 0.5, c, f = n, h = n) {
  if (fn.test(r) && (r = parseFloat(r), r = Be(h.min, h.max, r / 100) - h.min), typeof r != "number")
    return;
  let m = Be(f.min, f.max, l);
  n === f && (m -= r), n.min = Jh(n.min, r, s, m, c), n.max = Jh(n.max, r, s, m, c);
}
function ep(n, r, [s, l, c], f, h) {
  Rw(n, r[s], r[l], r[c], r.scale, f, h);
}
const Lw = ["x", "scaleX", "originX"], bw = ["y", "scaleY", "originY"];
function tp(n, r, s, l) {
  ep(n.x, r, Lw, s ? s.x : void 0, l ? l.x : void 0), ep(n.y, r, bw, s ? s.y : void 0, l ? l.y : void 0);
}
function np(n) {
  return n.translate === 0 && n.scale === 1;
}
function gg(n) {
  return np(n.x) && np(n.y);
}
function rp(n, r) {
  return n.min === r.min && n.max === r.max;
}
function _w(n, r) {
  return rp(n.x, r.x) && rp(n.y, r.y);
}
function ip(n, r) {
  return Math.round(n.min) === Math.round(r.min) && Math.round(n.max) === Math.round(r.max);
}
function vg(n, r) {
  return ip(n.x, r.x) && ip(n.y, r.y);
}
function sp(n) {
  return bt(n.x) / bt(n.y);
}
function op(n, r) {
  return n.translate === r.translate && n.scale === r.scale && n.originPoint === r.originPoint;
}
class Dw {
  constructor() {
    this.members = [];
  }
  add(r) {
    Ku(this.members, r), r.scheduleRender();
  }
  remove(r) {
    if (Gu(this.members, r), r === this.prevLead && (this.prevLead = void 0), r === this.lead) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(r) {
    const s = this.members.findIndex((c) => r === c);
    if (s === 0)
      return !1;
    let l;
    for (let c = s; c >= 0; c--) {
      const f = this.members[c];
      if (f.isPresent !== !1) {
        l = f;
        break;
      }
    }
    return l ? (this.promote(l), !0) : !1;
  }
  promote(r, s) {
    const l = this.lead;
    if (r !== l && (this.prevLead = l, this.lead = r, r.show(), l)) {
      l.instance && l.scheduleRender(), r.scheduleRender(), r.resumeFrom = l, s && (r.resumeFrom.preserveOpacity = !0), l.snapshot && (r.snapshot = l.snapshot, r.snapshot.latestValues = l.animationValues || l.latestValues), r.root && r.root.isUpdating && (r.isLayoutDirty = !0);
      const { crossfade: c } = r.options;
      c === !1 && l.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((r) => {
      const { options: s, resumingFrom: l } = r;
      s.onExitComplete && s.onExitComplete(), l && l.options.onExitComplete && l.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((r) => {
      r.instance && r.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function Iw(n, r, s) {
  let l = "";
  const c = n.x.translate / r.x, f = n.y.translate / r.y, h = (s == null ? void 0 : s.z) || 0;
  if ((c || f || h) && (l = `translate3d(${c}px, ${f}px, ${h}px) `), (r.x !== 1 || r.y !== 1) && (l += `scale(${1 / r.x}, ${1 / r.y}) `), s) {
    const { transformPerspective: p, rotate: y, rotateX: x, rotateY: S, skewX: E, skewY: C } = s;
    p && (l = `perspective(${p}px) ${l}`), y && (l += `rotate(${y}deg) `), x && (l += `rotateX(${x}deg) `), S && (l += `rotateY(${S}deg) `), E && (l += `skewX(${E}deg) `), C && (l += `skewY(${C}deg) `);
  }
  const m = n.x.scale * r.x, g = n.y.scale * r.y;
  return (m !== 1 || g !== 1) && (l += `scale(${m}, ${g})`), l || "none";
}
const wr = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
}, Xi = typeof window < "u" && window.MotionDebug !== void 0, Xl = ["", "X", "Y", "Z"], Vw = { visibility: "hidden" }, ap = 1e3;
let qw = 0;
function Zl(n, r, s, l) {
  const { latestValues: c } = r;
  c[n] && (s[n] = c[n], r.setStaticValue(n, 0), l && (l[n] = 0));
}
function yg(n) {
  if (n.hasCheckedOptimisedAppear = !0, n.root === n)
    return;
  const { visualElement: r } = n.options;
  if (!r)
    return;
  const s = Sm(r);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: c, layoutId: f } = n.options;
    window.MotionCancelOptimisedAnimation(s, "transform", Le, !(c || f));
  }
  const { parent: l } = n;
  l && !l.hasCheckedOptimisedAppear && yg(l);
}
function xg({ attachResizeListener: n, defaultParent: r, measureScroll: s, checkIsScrollRoot: l, resetTransform: c }) {
  return class {
    constructor(h = {}, m = r == null ? void 0 : r()) {
      this.id = qw++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, Xi && (wr.totalNodes = wr.resolvedTargetDeltas = wr.recalculatedProjection = 0), this.nodes.forEach(Bw), this.nodes.forEach(Hw), this.nodes.forEach(Kw), this.nodes.forEach(zw), Xi && window.MotionDebug.record(wr);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = h, this.root = m ? m.root || m : this, this.path = m ? [...m.path, m] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
      for (let g = 0; g < this.path.length; g++)
        this.path[g].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Cw());
    }
    addEventListener(h, m) {
      return this.eventHandlers.has(h) || this.eventHandlers.set(h, new Qu()), this.eventHandlers.get(h).add(m);
    }
    notifyListeners(h, ...m) {
      const g = this.eventHandlers.get(h);
      g && g.notify(...m);
    }
    hasListeners(h) {
      return this.eventHandlers.has(h);
    }
    /**
     * Lifecycles
     */
    mount(h, m = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = kw(h), this.instance = h;
      const { layoutId: g, layout: p, visualElement: y } = this.options;
      if (y && !y.current && y.mount(h), this.root.nodes.add(this), this.parent && this.parent.children.add(this), m && (p || g) && (this.isLayoutDirty = !0), n) {
        let x;
        const S = () => this.root.updateBlockedByResize = !1;
        n(h, () => {
          this.root.updateBlockedByResize = !0, x && x(), x = Tw(S, 250), Do.hasAnimatedSinceResize && (Do.hasAnimatedSinceResize = !1, this.nodes.forEach(up));
        });
      }
      g && this.root.registerSharedNode(g, this), this.options.animate !== !1 && y && (g || p) && this.addEventListener("didUpdate", ({ delta: x, hasLayoutChanged: S, hasRelativeTargetChanged: E, layout: C }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const R = this.options.transition || y.getDefaultTransition() || Zw, { onLayoutAnimationStart: _, onLayoutAnimationComplete: L } = y.getProps(), D = !this.targetLayout || !vg(this.targetLayout, C) || E, V = !S && E;
        if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || V || S && (D || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(x, V);
          const Q = {
            ...Hu(R, "layout"),
            onPlay: _,
            onComplete: L
          };
          (y.shouldReduceMotion || this.options.layoutRoot) && (Q.delay = 0, Q.type = !1), this.startAnimation(Q);
        } else
          S || up(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = C;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const h = this.getStack();
      h && h.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, er(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Gw), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: h } = this.options;
      return h && h.getProps().transformTemplate;
    }
    willUpdate(h = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && yg(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let y = 0; y < this.path.length; y++) {
        const x = this.path[y];
        x.shouldResetTransform = !0, x.updateScroll("snapshot"), x.options.layoutRoot && x.willUpdate(!1);
      }
      const { layoutId: m, layout: g } = this.options;
      if (m === void 0 && !g)
        return;
      const p = this.getTransformTemplate();
      this.prevTransformTemplateValue = p ? p(this.latestValues, "") : void 0, this.updateSnapshot(), h && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(lp);
        return;
      }
      this.isUpdating || this.nodes.forEach(Uw), this.isUpdating = !1, this.nodes.forEach(Ww), this.nodes.forEach(Ow), this.nodes.forEach(Fw), this.clearAllSnapshots();
      const m = hn.now();
      at.delta = Rn(0, 1e3 / 60, m - at.timestamp), at.timestamp = m, at.isProcessing = !0, $l.update.process(at), $l.preRender.process(at), $l.render.process(at), at.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Iu.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach($w), this.sharedNodes.forEach(Qw);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Le.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Le.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let g = 0; g < this.path.length; g++)
          this.path[g].updateScroll();
      const h = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = Ke(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: m } = this.options;
      m && m.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0);
    }
    updateScroll(h = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (m = !1), m) {
        const g = l(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: h,
          isRoot: g,
          offset: s(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : g
        };
      }
    }
    resetTransform() {
      if (!c)
        return;
      const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !gg(this.projectionDelta), g = this.getTransformTemplate(), p = g ? g(this.latestValues, "") : void 0, y = p !== this.prevTransformTemplateValue;
      h && (m || xr(this.latestValues) || y) && (c(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(h = !0) {
      const m = this.measurePageBox();
      let g = this.removeElementScroll(m);
      return h && (g = this.removeTransform(g)), Jw(g), {
        animationId: this.root.animationId,
        measuredBox: m,
        layoutBox: g,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var h;
      const { visualElement: m } = this.options;
      if (!m)
        return Ke();
      const g = m.measureViewportBox();
      if (!(((h = this.scroll) === null || h === void 0 ? void 0 : h.wasRoot) || this.path.some(eS))) {
        const { scroll: y } = this.root;
        y && (Jr(g.x, y.offset.x), Jr(g.y, y.offset.y));
      }
      return g;
    }
    removeElementScroll(h) {
      var m;
      const g = Ke();
      if (zt(g, h), !((m = this.scroll) === null || m === void 0) && m.wasRoot)
        return g;
      for (let p = 0; p < this.path.length; p++) {
        const y = this.path[p], { scroll: x, options: S } = y;
        y !== this.root && x && S.layoutScroll && (x.wasRoot && zt(g, h), Jr(g.x, x.offset.x), Jr(g.y, x.offset.y));
      }
      return g;
    }
    applyTransform(h, m = !1) {
      const g = Ke();
      zt(g, h);
      for (let p = 0; p < this.path.length; p++) {
        const y = this.path[p];
        !m && y.options.layoutScroll && y.scroll && y !== y.root && ei(g, {
          x: -y.scroll.offset.x,
          y: -y.scroll.offset.y
        }), xr(y.latestValues) && ei(g, y.latestValues);
      }
      return xr(this.latestValues) && ei(g, this.latestValues), g;
    }
    removeTransform(h) {
      const m = Ke();
      zt(m, h);
      for (let g = 0; g < this.path.length; g++) {
        const p = this.path[g];
        if (!p.instance || !xr(p.latestValues))
          continue;
        gu(p.latestValues) && p.updateSnapshot();
        const y = Ke(), x = p.measurePageBox();
        zt(y, x), tp(m, p.latestValues, p.snapshot ? p.snapshot.layoutBox : void 0, y);
      }
      return xr(this.latestValues) && tp(m, this.latestValues), m;
    }
    setTargetDelta(h) {
      this.targetDelta = h, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(h) {
      this.options = {
        ...this.options,
        ...h,
        crossfade: h.crossfade !== void 0 ? h.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== at.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(h = !1) {
      var m;
      const g = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = g.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = g.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = g.isSharedProjectionDirty);
      const p = !!this.resumingFrom || this !== g;
      if (!(h || p && this.isSharedProjectionDirty || this.isProjectionDirty || !((m = this.parent) === null || m === void 0) && m.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: x, layoutId: S } = this.options;
      if (!(!this.layout || !(x || S))) {
        if (this.resolvedRelativeTargetAt = at.timestamp, !this.targetDelta && !this.relativeTarget) {
          const E = this.getClosestProjectingParent();
          E && E.layout && this.animationProgress !== 1 ? (this.relativeParent = E, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Ke(), this.relativeTargetOrigin = Ke(), ns(this.relativeTargetOrigin, this.layout.layoutBox, E.layout.layoutBox), zt(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (this.target || (this.target = Ke(), this.targetWithTransforms = Ke()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), rw(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : zt(this.target, this.layout.layoutBox), cg(this.target, this.targetDelta)) : zt(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
            this.attemptToResolveRelativeTarget = !1;
            const E = this.getClosestProjectingParent();
            E && !!E.resumingFrom == !!this.resumingFrom && !E.options.layoutScroll && E.target && this.animationProgress !== 1 ? (this.relativeParent = E, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Ke(), this.relativeTargetOrigin = Ke(), ns(this.relativeTargetOrigin, this.target, E.target), zt(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          Xi && wr.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || gu(this.parent.latestValues) || ug(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var h;
      const m = this.getLead(), g = !!this.resumingFrom || this !== m;
      let p = !0;
      if ((this.isProjectionDirty || !((h = this.parent) === null || h === void 0) && h.isProjectionDirty) && (p = !1), g && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = !1), this.resolvedRelativeTargetAt === at.timestamp && (p = !1), p)
        return;
      const { layout: y, layoutId: x } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(y || x))
        return;
      zt(this.layoutCorrected, this.layout.layoutBox);
      const S = this.treeScale.x, E = this.treeScale.y;
      fw(this.layoutCorrected, this.treeScale, this.path, g), m.layout && !m.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (m.target = m.layout.layoutBox, m.targetWithTransforms = Ke());
      const { target: C } = m;
      if (!C) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Zh(this.prevProjectionDelta.x, this.projectionDelta.x), Zh(this.prevProjectionDelta.y, this.projectionDelta.y)), ts(this.projectionDelta, this.layoutCorrected, C, this.latestValues), (this.treeScale.x !== S || this.treeScale.y !== E || !op(this.projectionDelta.x, this.prevProjectionDelta.x) || !op(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", C)), Xi && wr.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(h = !0) {
      var m;
      if ((m = this.options.visualElement) === null || m === void 0 || m.scheduleRender(), h) {
        const g = this.getStack();
        g && g.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Zr(), this.projectionDelta = Zr(), this.projectionDeltaWithTransform = Zr();
    }
    setAnimationOrigin(h, m = !1) {
      const g = this.snapshot, p = g ? g.latestValues : {}, y = { ...this.latestValues }, x = Zr();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
      const S = Ke(), E = g ? g.source : void 0, C = this.layout ? this.layout.source : void 0, R = E !== C, _ = this.getStack(), L = !_ || _.members.length <= 1, D = !!(R && !L && this.options.crossfade === !0 && !this.path.some(Xw));
      this.animationProgress = 0;
      let V;
      this.mixTargetDelta = (Q) => {
        const K = Q / 1e3;
        cp(x.x, h.x, K), cp(x.y, h.y, K), this.setTargetDelta(x), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (ns(S, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Yw(this.relativeTarget, this.relativeTargetOrigin, S, K), V && _w(this.relativeTarget, V) && (this.isProjectionDirty = !1), V || (V = Ke()), zt(V, this.relativeTarget)), R && (this.animationValues = y, Nw(y, p, this.latestValues, K, D, L)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = K;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(h) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (er(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Le.update(() => {
        Do.hasAnimatedSinceResize = !0, this.currentAnimation = jw(0, ap, {
          ...h,
          onUpdate: (m) => {
            this.mixTargetDelta(m), h.onUpdate && h.onUpdate(m);
          },
          onComplete: () => {
            h.onComplete && h.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const h = this.getStack();
      h && h.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(ap), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const h = this.getLead();
      let { targetWithTransforms: m, target: g, layout: p, latestValues: y } = h;
      if (!(!m || !g || !p)) {
        if (this !== h && this.layout && p && wg(this.options.animationType, this.layout.layoutBox, p.layoutBox)) {
          g = this.target || Ke();
          const x = bt(this.layout.layoutBox.x);
          g.x.min = h.target.x.min, g.x.max = g.x.min + x;
          const S = bt(this.layout.layoutBox.y);
          g.y.min = h.target.y.min, g.y.max = g.y.min + S;
        }
        zt(m, g), ei(m, y), ts(this.projectionDeltaWithTransform, this.layoutCorrected, m, y);
      }
    }
    registerSharedNode(h, m) {
      this.sharedNodes.has(h) || this.sharedNodes.set(h, new Dw()), this.sharedNodes.get(h).add(m);
      const p = m.options.initialPromotionConfig;
      m.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity: p && p.shouldPreserveFollowOpacity ? p.shouldPreserveFollowOpacity(m) : void 0
      });
    }
    isLead() {
      const h = this.getStack();
      return h ? h.lead === this : !0;
    }
    getLead() {
      var h;
      const { layoutId: m } = this.options;
      return m ? ((h = this.getStack()) === null || h === void 0 ? void 0 : h.lead) || this : this;
    }
    getPrevLead() {
      var h;
      const { layoutId: m } = this.options;
      return m ? (h = this.getStack()) === null || h === void 0 ? void 0 : h.prevLead : void 0;
    }
    getStack() {
      const { layoutId: h } = this.options;
      if (h)
        return this.root.sharedNodes.get(h);
    }
    promote({ needsReset: h, transition: m, preserveFollowOpacity: g } = {}) {
      const p = this.getStack();
      p && p.promote(this, g), h && (this.projectionDelta = void 0, this.needsReset = !0), m && this.setOptions({ transition: m });
    }
    relegate() {
      const h = this.getStack();
      return h ? h.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: h } = this.options;
      if (!h)
        return;
      let m = !1;
      const { latestValues: g } = h;
      if ((g.z || g.rotate || g.rotateX || g.rotateY || g.rotateZ || g.skewX || g.skewY) && (m = !0), !m)
        return;
      const p = {};
      g.z && Zl("z", h, p, this.animationValues);
      for (let y = 0; y < Xl.length; y++)
        Zl(`rotate${Xl[y]}`, h, p, this.animationValues), Zl(`skew${Xl[y]}`, h, p, this.animationValues);
      h.render();
      for (const y in p)
        h.setStaticValue(y, p[y]), this.animationValues && (this.animationValues[y] = p[y]);
      h.scheduleRender();
    }
    getProjectionStyles(h) {
      var m, g;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return Vw;
      const p = {
        visibility: ""
      }, y = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, p.opacity = "", p.pointerEvents = bo(h == null ? void 0 : h.pointerEvents) || "", p.transform = y ? y(this.latestValues, "") : "none", p;
      const x = this.getLead();
      if (!this.projectionDelta || !this.layout || !x.target) {
        const R = {};
        return this.options.layoutId && (R.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, R.pointerEvents = bo(h == null ? void 0 : h.pointerEvents) || ""), this.hasProjected && !xr(this.latestValues) && (R.transform = y ? y({}, "") : "none", this.hasProjected = !1), R;
      }
      const S = x.animationValues || x.latestValues;
      this.applyTransformsToTarget(), p.transform = Iw(this.projectionDeltaWithTransform, this.treeScale, S), y && (p.transform = y(S, p.transform));
      const { x: E, y: C } = this.projectionDelta;
      p.transformOrigin = `${E.origin * 100}% ${C.origin * 100}% 0`, x.animationValues ? p.opacity = x === this ? (g = (m = S.opacity) !== null && m !== void 0 ? m : this.latestValues.opacity) !== null && g !== void 0 ? g : 1 : this.preserveOpacity ? this.latestValues.opacity : S.opacityExit : p.opacity = x === this ? S.opacity !== void 0 ? S.opacity : "" : S.opacityExit !== void 0 ? S.opacityExit : 0;
      for (const R in Bo) {
        if (S[R] === void 0)
          continue;
        const { correct: _, applyTo: L } = Bo[R], D = p.transform === "none" ? S[R] : _(S[R], x);
        if (L) {
          const V = L.length;
          for (let Q = 0; Q < V; Q++)
            p[L[Q]] = D;
        } else
          p[R] = D;
      }
      return this.options.layoutId && (p.pointerEvents = x === this ? bo(h == null ? void 0 : h.pointerEvents) || "" : "none"), p;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((h) => {
        var m;
        return (m = h.currentAnimation) === null || m === void 0 ? void 0 : m.stop();
      }), this.root.nodes.forEach(lp), this.root.sharedNodes.clear();
    }
  };
}
function Ow(n) {
  n.updateLayout();
}
function Fw(n) {
  var r;
  const s = ((r = n.resumeFrom) === null || r === void 0 ? void 0 : r.snapshot) || n.snapshot;
  if (n.isLead() && n.layout && s && n.hasListeners("didUpdate")) {
    const { layoutBox: l, measuredBox: c } = n.layout, { animationType: f } = n.options, h = s.source !== n.layout.source;
    f === "size" ? $t((x) => {
      const S = h ? s.measuredBox[x] : s.layoutBox[x], E = bt(S);
      S.min = l[x].min, S.max = S.min + E;
    }) : wg(f, s.layoutBox, l) && $t((x) => {
      const S = h ? s.measuredBox[x] : s.layoutBox[x], E = bt(l[x]);
      S.max = S.min + E, n.relativeTarget && !n.currentAnimation && (n.isProjectionDirty = !0, n.relativeTarget[x].max = n.relativeTarget[x].min + E);
    });
    const m = Zr();
    ts(m, l, s.layoutBox);
    const g = Zr();
    h ? ts(g, n.applyTransform(c, !0), s.measuredBox) : ts(g, l, s.layoutBox);
    const p = !gg(m);
    let y = !1;
    if (!n.resumeFrom) {
      const x = n.getClosestProjectingParent();
      if (x && !x.resumeFrom) {
        const { snapshot: S, layout: E } = x;
        if (S && E) {
          const C = Ke();
          ns(C, s.layoutBox, S.layoutBox);
          const R = Ke();
          ns(R, l, E.layoutBox), vg(C, R) || (y = !0), x.options.layoutRoot && (n.relativeTarget = R, n.relativeTargetOrigin = C, n.relativeParent = x);
        }
      }
    }
    n.notifyListeners("didUpdate", {
      layout: l,
      snapshot: s,
      delta: g,
      layoutDelta: m,
      hasLayoutChanged: p,
      hasRelativeTargetChanged: y
    });
  } else if (n.isLead()) {
    const { onExitComplete: l } = n.options;
    l && l();
  }
  n.options.transition = void 0;
}
function Bw(n) {
  Xi && wr.totalNodes++, n.parent && (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty), n.isSharedProjectionDirty || (n.isSharedProjectionDirty = !!(n.isProjectionDirty || n.parent.isProjectionDirty || n.parent.isSharedProjectionDirty)), n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty));
}
function zw(n) {
  n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1;
}
function $w(n) {
  n.clearSnapshot();
}
function lp(n) {
  n.clearMeasurements();
}
function Uw(n) {
  n.isLayoutDirty = !1;
}
function Ww(n) {
  const { visualElement: r } = n.options;
  r && r.getProps().onBeforeLayoutMeasure && r.notify("BeforeLayoutMeasure"), n.resetTransform();
}
function up(n) {
  n.finishAnimation(), n.targetDelta = n.relativeTarget = n.target = void 0, n.isProjectionDirty = !0;
}
function Hw(n) {
  n.resolveTargetDelta();
}
function Kw(n) {
  n.calcProjection();
}
function Gw(n) {
  n.resetSkewAndRotation();
}
function Qw(n) {
  n.removeLeadSnapshot();
}
function cp(n, r, s) {
  n.translate = Be(r.translate, 0, s), n.scale = Be(r.scale, 1, s), n.origin = r.origin, n.originPoint = r.originPoint;
}
function dp(n, r, s, l) {
  n.min = Be(r.min, s.min, l), n.max = Be(r.max, s.max, l);
}
function Yw(n, r, s, l) {
  dp(n.x, r.x, s.x, l), dp(n.y, r.y, s.y, l);
}
function Xw(n) {
  return n.animationValues && n.animationValues.opacityExit !== void 0;
}
const Zw = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, fp = (n) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(n), hp = fp("applewebkit/") && !fp("chrome/") ? Math.round : Lt;
function pp(n) {
  n.min = hp(n.min), n.max = hp(n.max);
}
function Jw(n) {
  pp(n.x), pp(n.y);
}
function wg(n, r, s) {
  return n === "position" || n === "preserve-aspect" && !nw(sp(r), sp(s), 0.2);
}
function eS(n) {
  var r;
  return n !== n.root && ((r = n.scroll) === null || r === void 0 ? void 0 : r.wasRoot);
}
const tS = xg({
  attachResizeListener: (n, r) => us(n, "resize", r),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Jl = {
  current: void 0
}, Sg = xg({
  measureScroll: (n) => ({
    x: n.scrollLeft,
    y: n.scrollTop
  }),
  defaultParent: () => {
    if (!Jl.current) {
      const n = new tS({});
      n.mount(window), n.setOptions({ layoutScroll: !0 }), Jl.current = n;
    }
    return Jl.current;
  },
  resetTransform: (n, r) => {
    n.style.transform = r !== void 0 ? r : "none";
  },
  checkIsScrollRoot: (n) => window.getComputedStyle(n).position === "fixed"
}), nS = {
  pan: {
    Feature: yw
  },
  drag: {
    Feature: vw,
    ProjectionNode: Sg,
    MeasureLayout: hg
  }
};
function rS(n, r, s) {
  var l;
  if (n instanceof Element)
    return [n];
  if (typeof n == "string") {
    let c = document;
    const f = (l = void 0) !== null && l !== void 0 ? l : c.querySelectorAll(n);
    return f ? Array.from(f) : [];
  }
  return Array.from(n);
}
function jg(n, r) {
  const s = rS(n), l = new AbortController(), c = {
    passive: !0,
    ...r,
    signal: l.signal
  };
  return [s, c, () => l.abort()];
}
function mp(n) {
  return (r) => {
    r.pointerType === "touch" || rg() || n(r);
  };
}
function iS(n, r, s = {}) {
  const [l, c, f] = jg(n, s), h = mp((m) => {
    const { target: g } = m, p = r(m);
    if (typeof p != "function" || !g)
      return;
    const y = mp((x) => {
      p(x), g.removeEventListener("pointerleave", y);
    });
    g.addEventListener("pointerleave", y, c);
  });
  return l.forEach((m) => {
    m.addEventListener("pointerenter", h, c);
  }), f;
}
function gp(n, r, s) {
  const { props: l } = n;
  n.animationState && l.whileHover && n.animationState.setActive("whileHover", s === "Start");
  const c = "onHover" + s, f = l[c];
  f && Le.postRender(() => f(r, ps(r)));
}
class sS extends nr {
  mount() {
    const { current: r } = this.node;
    r && (this.unmount = iS(r, (s) => (gp(this.node, s, "Start"), (l) => gp(this.node, l, "End"))));
  }
  unmount() {
  }
}
class oS extends nr {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let r = !1;
    try {
      r = this.node.current.matches(":focus-visible");
    } catch {
      r = !0;
    }
    !r || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = hs(us(this.node.current, "focus", () => this.onFocus()), us(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const kg = (n, r) => r ? n === r ? !0 : kg(n, r.parentElement) : !1, aS = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function lS(n) {
  return aS.has(n.tagName) || n.tabIndex !== -1;
}
const Zi = /* @__PURE__ */ new WeakSet();
function vp(n) {
  return (r) => {
    r.key === "Enter" && n(r);
  };
}
function eu(n, r) {
  n.dispatchEvent(new PointerEvent("pointer" + r, { isPrimary: !0, bubbles: !0 }));
}
const uS = (n, r) => {
  const s = n.currentTarget;
  if (!s)
    return;
  const l = vp(() => {
    if (Zi.has(s))
      return;
    eu(s, "down");
    const c = vp(() => {
      eu(s, "up");
    }), f = () => eu(s, "cancel");
    s.addEventListener("keyup", c, r), s.addEventListener("blur", f, r);
  });
  s.addEventListener("keydown", l, r), s.addEventListener("blur", () => s.removeEventListener("keydown", l), r);
};
function yp(n) {
  return lc(n) && !rg();
}
function cS(n, r, s = {}) {
  const [l, c, f] = jg(n, s), h = (m) => {
    const g = m.currentTarget;
    if (!yp(m) || Zi.has(g))
      return;
    Zi.add(g);
    const p = r(m), y = (E, C) => {
      window.removeEventListener("pointerup", x), window.removeEventListener("pointercancel", S), !(!yp(E) || !Zi.has(g)) && (Zi.delete(g), typeof p == "function" && p(E, { success: C }));
    }, x = (E) => {
      y(E, s.useGlobalTarget || kg(g, E.target));
    }, S = (E) => {
      y(E, !1);
    };
    window.addEventListener("pointerup", x, c), window.addEventListener("pointercancel", S, c);
  };
  return l.forEach((m) => {
    !lS(m) && m.getAttribute("tabindex") === null && (m.tabIndex = 0), (s.useGlobalTarget ? window : m).addEventListener("pointerdown", h, c), m.addEventListener("focus", (p) => uS(p, c), c);
  }), f;
}
function xp(n, r, s) {
  const { props: l } = n;
  n.animationState && l.whileTap && n.animationState.setActive("whileTap", s === "Start");
  const c = "onTap" + (s === "End" ? "" : s), f = l[c];
  f && Le.postRender(() => f(r, ps(r)));
}
class dS extends nr {
  mount() {
    const { current: r } = this.node;
    r && (this.unmount = cS(r, (s) => (xp(this.node, s, "Start"), (l, { success: c }) => xp(this.node, l, c ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const yu = /* @__PURE__ */ new WeakMap(), tu = /* @__PURE__ */ new WeakMap(), fS = (n) => {
  const r = yu.get(n.target);
  r && r(n);
}, hS = (n) => {
  n.forEach(fS);
};
function pS({ root: n, ...r }) {
  const s = n || document;
  tu.has(s) || tu.set(s, {});
  const l = tu.get(s), c = JSON.stringify(r);
  return l[c] || (l[c] = new IntersectionObserver(hS, { root: n, ...r })), l[c];
}
function mS(n, r, s) {
  const l = pS(r);
  return yu.set(n, s), l.observe(n), () => {
    yu.delete(n), l.unobserve(n);
  };
}
const gS = {
  some: 0,
  all: 1
};
class vS extends nr {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: r = {} } = this.node.getProps(), { root: s, margin: l, amount: c = "some", once: f } = r, h = {
      root: s ? s.current : void 0,
      rootMargin: l,
      threshold: typeof c == "number" ? c : gS[c]
    }, m = (g) => {
      const { isIntersecting: p } = g;
      if (this.isInView === p || (this.isInView = p, f && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: y, onViewportLeave: x } = this.node.getProps(), S = p ? y : x;
      S && S(g);
    };
    return mS(this.node.current, h, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: r, prevProps: s } = this.node;
    ["amount", "margin", "root"].some(yS(r, s)) && this.startObserver();
  }
  unmount() {
  }
}
function yS({ viewport: n = {} }, { viewport: r = {} } = {}) {
  return (s) => n[s] !== r[s];
}
const xS = {
  inView: {
    Feature: vS
  },
  tap: {
    Feature: dS
  },
  focus: {
    Feature: oS
  },
  hover: {
    Feature: sS
  }
}, wS = {
  layout: {
    ProjectionNode: Sg,
    MeasureLayout: hg
  }
}, Ko = { current: null }, uc = { current: !1 };
function Eg() {
  if (uc.current = !0, !!Lu)
    if (window.matchMedia) {
      const n = window.matchMedia("(prefers-reduced-motion)"), r = () => Ko.current = n.matches;
      n.addListener(r), r();
    } else
      Ko.current = !1;
}
const SS = [...Wm, mt, tr], jS = (n) => SS.find(Um(n)), wp = /* @__PURE__ */ new WeakMap();
function kS(n, r, s) {
  for (const l in r) {
    const c = r[l], f = s[l];
    if (gt(c))
      n.addValue(l, c);
    else if (gt(f))
      n.addValue(l, as(c, { owner: n }));
    else if (f !== c)
      if (n.hasValue(l)) {
        const h = n.getValue(l);
        h.liveStyle === !0 ? h.jump(c) : h.hasAnimated || h.set(c);
      } else {
        const h = n.getStaticValue(l);
        n.addValue(l, as(h !== void 0 ? h : c, { owner: n }));
      }
  }
  for (const l in s)
    r[l] === void 0 && n.removeValue(l);
  return r;
}
const Sp = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class ES {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(r, s, l) {
    return {};
  }
  constructor({ parent: r, props: s, presenceContext: l, reducedMotionConfig: c, blockInitialAnimation: f, visualState: h }, m = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = ic, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const E = hn.now();
      this.renderScheduledAt < E && (this.renderScheduledAt = E, Le.render(this.render, !1, !0));
    };
    const { latestValues: g, renderState: p, onUpdate: y } = h;
    this.onUpdate = y, this.latestValues = g, this.baseTarget = { ...g }, this.initialValues = s.initial ? { ...g } : {}, this.renderState = p, this.parent = r, this.props = s, this.presenceContext = l, this.depth = r ? r.depth + 1 : 0, this.reducedMotionConfig = c, this.options = m, this.blockInitialAnimation = !!f, this.isControllingVariants = Zo(s), this.isVariantNode = rm(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(r && r.current);
    const { willChange: x, ...S } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const E in S) {
      const C = S[E];
      g[E] !== void 0 && gt(C) && C.set(g[E], !1);
    }
  }
  mount(r) {
    this.current = r, wp.set(r, this), this.projection && !this.projection.instance && this.projection.mount(r), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, l) => this.bindToMotionValue(l, s)), uc.current || Eg(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Ko.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    wp.delete(this.current), this.projection && this.projection.unmount(), er(this.notifyUpdate), er(this.render), this.valueSubscriptions.forEach((r) => r()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const r in this.events)
      this.events[r].clear();
    for (const r in this.features) {
      const s = this.features[r];
      s && (s.unmount(), s.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(r, s) {
    this.valueSubscriptions.has(r) && this.valueSubscriptions.get(r)();
    const l = Er.has(r), c = s.on("change", (m) => {
      this.latestValues[r] = m, this.props.onUpdate && Le.preRender(this.notifyUpdate), l && this.projection && (this.projection.isTransformDirty = !0);
    }), f = s.on("renderRequest", this.scheduleRender);
    let h;
    window.MotionCheckAppearSync && (h = window.MotionCheckAppearSync(this, r, s)), this.valueSubscriptions.set(r, () => {
      c(), f(), h && h(), s.owner && s.stop();
    });
  }
  sortNodePosition(r) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== r.type ? 0 : this.sortInstanceNodePosition(this.current, r.current);
  }
  updateFeatures() {
    let r = "animation";
    for (r in ni) {
      const s = ni[r];
      if (!s)
        continue;
      const { isEnabled: l, Feature: c } = s;
      if (!this.features[r] && c && l(this.props) && (this.features[r] = new c(this)), this.features[r]) {
        const f = this.features[r];
        f.isMounted ? f.update() : (f.mount(), f.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Ke();
  }
  getStaticValue(r) {
    return this.latestValues[r];
  }
  setStaticValue(r, s) {
    this.latestValues[r] = s;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(r, s) {
    (r.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = r, this.prevPresenceContext = this.presenceContext, this.presenceContext = s;
    for (let l = 0; l < Sp.length; l++) {
      const c = Sp[l];
      this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
      const f = "on" + c, h = r[f];
      h && (this.propEventSubscriptions[c] = this.on(c, h));
    }
    this.prevMotionValues = kS(this, this.scrapeMotionValuesFromProps(r, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(r) {
    return this.props.variants ? this.props.variants[r] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(r) {
    const s = this.getClosestVariantNode();
    if (s)
      return s.variantChildren && s.variantChildren.add(r), () => s.variantChildren.delete(r);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(r, s) {
    const l = this.values.get(r);
    s !== l && (l && this.removeValue(r), this.bindToMotionValue(r, s), this.values.set(r, s), this.latestValues[r] = s.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(r) {
    this.values.delete(r);
    const s = this.valueSubscriptions.get(r);
    s && (s(), this.valueSubscriptions.delete(r)), delete this.latestValues[r], this.removeValueFromRenderState(r, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(r) {
    return this.values.has(r);
  }
  getValue(r, s) {
    if (this.props.values && this.props.values[r])
      return this.props.values[r];
    let l = this.values.get(r);
    return l === void 0 && s !== void 0 && (l = as(s === null ? void 0 : s, { owner: this }), this.addValue(r, l)), l;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(r, s) {
    var l;
    let c = this.latestValues[r] !== void 0 || !this.current ? this.latestValues[r] : (l = this.getBaseTargetFromProps(this.props, r)) !== null && l !== void 0 ? l : this.readValueFromInstance(this.current, r, this.options);
    return c != null && (typeof c == "string" && (zm(c) || bm(c)) ? c = parseFloat(c) : !jS(c) && tr.test(s) && (c = Om(r, s)), this.setBaseTarget(r, gt(c) ? c.get() : c)), gt(c) ? c.get() : c;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(r, s) {
    this.baseTarget[r] = s;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(r) {
    var s;
    const { initial: l } = this.props;
    let c;
    if (typeof l == "string" || typeof l == "object") {
      const h = qu(this.props, l, (s = this.presenceContext) === null || s === void 0 ? void 0 : s.custom);
      h && (c = h[r]);
    }
    if (l && c !== void 0)
      return c;
    const f = this.getBaseTargetFromProps(this.props, r);
    return f !== void 0 && !gt(f) ? f : this.initialValues[r] !== void 0 && c === void 0 ? void 0 : this.baseTarget[r];
  }
  on(r, s) {
    return this.events[r] || (this.events[r] = new Qu()), this.events[r].add(s);
  }
  notify(r, ...s) {
    this.events[r] && this.events[r].notify(...s);
  }
}
class Cg extends ES {
  constructor() {
    super(...arguments), this.KeyframeResolver = Hm;
  }
  sortInstanceNodePosition(r, s) {
    return r.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(r, s) {
    return r.style ? r.style[s] : void 0;
  }
  removeValueFromRenderState(r, { vars: s, style: l }) {
    delete s[r], delete l[r];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: r } = this.props;
    gt(r) && (this.childSubscription = r.on("change", (s) => {
      this.current && (this.current.textContent = `${s}`);
    }));
  }
}
function CS(n) {
  return window.getComputedStyle(n);
}
class TS extends Cg {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = fm;
  }
  readValueFromInstance(r, s) {
    if (Er.has(s)) {
      const l = rc(s);
      return l && l.default || 0;
    } else {
      const l = CS(r), c = (um(s) ? l.getPropertyValue(s) : l[s]) || 0;
      return typeof c == "string" ? c.trim() : c;
    }
  }
  measureInstanceViewportBox(r, { transformPagePoint: s }) {
    return dg(r, s);
  }
  build(r, s, l) {
    Bu(r, s, l.transformTemplate);
  }
  scrapeMotionValuesFromProps(r, s, l) {
    return Wu(r, s, l);
  }
}
class PS extends Cg {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Ke;
  }
  getBaseTargetFromProps(r, s) {
    return r[s];
  }
  readValueFromInstance(r, s) {
    if (Er.has(s)) {
      const l = rc(s);
      return l && l.default || 0;
    }
    return s = hm.has(s) ? s : Du(s), r.getAttribute(s);
  }
  scrapeMotionValuesFromProps(r, s, l) {
    return gm(r, s, l);
  }
  build(r, s, l) {
    zu(r, s, this.isSVGTag, l.transformTemplate);
  }
  renderInstance(r, s, l, c) {
    pm(r, s, l, c);
  }
  mount(r) {
    this.isSVGTag = Uu(r.tagName), super.mount(r);
  }
}
const NS = (n, r) => Vu(n) ? new PS(r) : new TS(r, {
  allowProjection: n !== N.Fragment
}), AS = /* @__PURE__ */ t1({
  ...Hx,
  ...xS,
  ...nS,
  ...wS
}, NS), dn = /* @__PURE__ */ g0(AS);
function Cr() {
  !uc.current && Eg();
  const [n] = N.useState(Ko.current);
  return n;
}
const MS = `#version 300 es
precision highp float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`, RS = `#version 300 es
precision highp float;
out vec4 outputColor;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define R resolution
#define MN min(R.x, R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(rnd(i), rnd(i + vec2(1, 0)), u.x),
             mix(rnd(i + vec2(0, 1)), rnd(i + 1.0), u.x), u.y);
}

float fbm(vec2 p) {
  float total = 0.0, amplitude = 1.0;
  mat2 transform = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 4; i++) {
    total += amplitude * noise(p);
    p *= 2.0 * transform;
    amplitude *= 0.5;
  }
  return total;
}

float clouds(vec2 p) {
  float depth = 1.0, total = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float amount = depth * fbm(fi * 10.0 + p.x * 0.2 + 0.2 * (1.0 + fi) * p.y + depth + fi * fi + p);
    total = mix(total, depth, amount);
    depth = amount;
    p *= 2.0 / (fi + 1.0);
  }
  return total;
}

void main() {
  vec2 uv = (FC - 0.5 * R) / MN;
  vec2 space = uv * vec2(2.0, 1.0);
  vec3 color = vec3(0.0);
  float background = clouds(vec2(space.x + time * 0.16, -space.y));
  uv *= 1.0 - 0.22 * (sin(time * 0.14) * 0.5 + 0.5);

  for (int i = 1; i < 9; i++) {
    float fi = float(i);
    uv += 0.1 * cos(fi * vec2(0.1 + 0.01 * fi, 0.8) + fi * fi + time * 0.22 + 0.1 * uv.x);
    vec2 p = uv;
    float distanceToCenter = max(length(p), 0.002);
    color += 0.0015 / distanceToCenter * (cos(sin(fi) * vec3(1.0, 2.0, 3.0)) + 1.0);
    float grain = noise(fi + p + background * 1.731);
    color += 0.002 * grain / max(length(max(p, vec2(grain * p.x * 0.02, p.y))), 0.002);
    color = mix(color, vec3(background * 0.32, background * 0.14, background * 0.035), clamp(distanceToCenter, 0.0, 1.0));
  }

  color *= vec3(1.12, 0.76, 0.42);
  outputColor = vec4(color, 1.0);
}`;
class LS {
  constructor(r) {
    Zn(this, "gl");
    Zn(this, "program", null);
    Zn(this, "vertexShader", null);
    Zn(this, "fragmentShader", null);
    Zn(this, "buffer", null);
    Zn(this, "resolutionUniform", null);
    Zn(this, "timeUniform", null);
    this.canvas = r;
    const s = r.getContext("webgl2", {
      alpha: !1,
      antialias: !1,
      depth: !1,
      powerPreference: "high-performance"
    });
    if (!s) throw new Error("WEBGL2_UNAVAILABLE");
    this.gl = s;
  }
  compile(r, s) {
    const l = this.gl.createShader(r);
    return l ? (this.gl.shaderSource(l, s), this.gl.compileShader(l), this.gl.getShaderParameter(l, this.gl.COMPILE_STATUS) ? l : (this.gl.deleteShader(l), null)) : null;
  }
  initialize() {
    const r = this.gl;
    if (this.vertexShader = this.compile(r.VERTEX_SHADER, MS), this.fragmentShader = this.compile(r.FRAGMENT_SHADER, RS), !this.vertexShader || !this.fragmentShader || (this.program = r.createProgram(), !this.program) || (r.attachShader(this.program, this.vertexShader), r.attachShader(this.program, this.fragmentShader), r.linkProgram(this.program), !r.getProgramParameter(this.program, r.LINK_STATUS)) || (this.buffer = r.createBuffer(), !this.buffer)) return !1;
    r.bindBuffer(r.ARRAY_BUFFER, this.buffer), r.bufferData(r.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), r.STATIC_DRAW);
    const s = r.getAttribLocation(this.program, "position");
    return s < 0 ? !1 : (r.enableVertexAttribArray(s), r.vertexAttribPointer(s, 2, r.FLOAT, !1, 0, 0), this.resolutionUniform = r.getUniformLocation(this.program, "resolution"), this.timeUniform = r.getUniformLocation(this.program, "time"), !0);
  }
  resize(r, s, l) {
    const c = Math.max(1, Math.round(r * l)), f = Math.max(1, Math.round(s * l));
    (this.canvas.width !== c || this.canvas.height !== f) && (this.canvas.width = c, this.canvas.height = f, this.gl.viewport(0, 0, c, f));
  }
  render(r, s = 1) {
    if (!this.program) return;
    const l = this.gl;
    l.useProgram(this.program), l.bindBuffer(l.ARRAY_BUFFER, this.buffer), l.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height), l.uniform1f(this.timeUniform, r * 1e-3 * s), l.drawArrays(l.TRIANGLE_STRIP, 0, 4);
  }
  dispose() {
    const r = this.gl;
    this.program && this.vertexShader && r.detachShader(this.program, this.vertexShader), this.program && this.fragmentShader && r.detachShader(this.program, this.fragmentShader), this.buffer && r.deleteBuffer(this.buffer), this.vertexShader && r.deleteShader(this.vertexShader), this.fragmentShader && r.deleteShader(this.fragmentShader), this.program && r.deleteProgram(this.program), this.buffer = null, this.vertexShader = null, this.fragmentShader = null, this.program = null;
  }
}
function Tg({ children: n, className: r = "", forceFallback: s = !1, forceReducedMotion: l = !1, variant: c = "hero" }) {
  const f = N.useRef(null), h = N.useRef(null), [m, g] = N.useState(s);
  return N.useEffect(() => {
    const p = f.current, y = h.current;
    if (s || !p || !y) return;
    let x;
    try {
      x = new LS(y);
    } catch {
      g(!0);
      return;
    }
    if (!x.initialize()) {
      x.dispose(), g(!0);
      return;
    }
    const S = window.matchMedia("(prefers-reduced-motion: reduce)"), E = window.matchMedia("(max-width: 640px)");
    let C = null, R = !1, _ = 0;
    const L = () => {
      const $ = navigator.connection;
      return E.matches && (($ == null ? void 0 : $.saveData) === !0 || (navigator.hardwareConcurrency || 8) <= 4);
    }, D = () => {
      const $ = p.getBoundingClientRect(), he = E.matches ? 1 : c === "ambient" ? 1.25 : 1.5;
      x.resize($.width, $.height, Math.min(window.devicePixelRatio || 1, he)), x.render(l || S.matches || L() ? 0 : performance.now(), c === "ambient" ? 0.38 : 1);
    }, V = ($) => {
      if (R || document.hidden || l || S.matches || L()) return;
      const he = E.matches ? 1e3 / 30 : c === "ambient" ? 1e3 / 40 : 0;
      $ - _ >= he && (x.render($, c === "ambient" ? 0.38 : 1), _ = $), C = window.requestAnimationFrame(V);
    }, Q = () => {
      C !== null && window.cancelAnimationFrame(C), C = null, D(), !document.hidden && !l && !S.matches && !L() && (C = window.requestAnimationFrame(V));
    }, K = () => Q(), J = ($) => {
      $.preventDefault(), R = !0, C !== null && window.cancelAnimationFrame(C), C = null, g(!0);
    }, U = new ResizeObserver(D);
    return U.observe(p), S.addEventListener("change", Q), E.addEventListener("change", Q), document.addEventListener("visibilitychange", K), y.addEventListener("webglcontextlost", J), Q(), () => {
      R = !0, C !== null && window.cancelAnimationFrame(C), U.disconnect(), S.removeEventListener("change", Q), E.removeEventListener("change", Q), document.removeEventListener("visibilitychange", K), y.removeEventListener("webglcontextlost", J), x.dispose();
    };
  }, [s, l, c]), /* @__PURE__ */ a.jsxs("div", { ref: f, className: `q-shader-hero is-${c} ${r}`, children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-shader-fallback", "aria-hidden": "true" }),
    !m && /* @__PURE__ */ a.jsx("canvas", { ref: h, className: "q-shader-canvas", "data-motion": l ? "static" : "adaptive", "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("div", { className: "q-shader-overlay", "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("div", { className: "q-shader-content", children: n })
  ] });
}
function Pg(n, r) {
  return n === "failed" || r === "failed" ? "failed" : n === "complete" && r === "complete" ? "completed" : n === "complete" && r === "active" ? "to-active" : "pending";
}
function Ng({
  steps: n,
  variant: r = "marketing",
  orientation: s = "horizontal",
  loop: l = !0,
  showDescriptions: c = !0,
  className: f = ""
}) {
  const h = Cr() || new URLSearchParams(window.location.search).get("motion") === "reduce", m = Math.min(1, n.length - 1), [g, p] = N.useState(h ? m : -1);
  return N.useEffect(() => {
    if (h || !n.length) {
      p(m);
      return;
    }
    let y;
    const x = () => {
      p((C) => C >= n.length ? l ? -1 : n.length : C + 1);
    }, S = (C = 1550) => {
      window.clearTimeout(y), y = window.setTimeout(x, C);
    }, E = () => {
      window.clearTimeout(y), document.hidden || S(500);
    };
    return document.hidden || S(g >= n.length - 1 ? 1e3 : g < 0 ? 450 : 1550), document.addEventListener("visibilitychange", E), () => {
      window.clearTimeout(y), document.removeEventListener("visibilitychange", E);
    };
  }, [g, l, h, m, n.length]), /* @__PURE__ */ a.jsx("ol", { className: `q-animated-workflow is-${r} is-${s} ${f}`.trim(), children: n.map((y, x) => {
    const S = x < g ? "complete" : x === g ? "active" : "pending", E = x + 1 < g ? "complete" : x + 1 === g ? "active" : "pending";
    return /* @__PURE__ */ a.jsxs("li", { className: `is-${S}`, "aria-label": `${y.label}: ${S}`, children: [
      /* @__PURE__ */ a.jsxs("span", { className: "q-workflow-marker-wrapper", "aria-hidden": "true", children: [
        /* @__PURE__ */ a.jsx("span", { className: "q-workflow-index", children: S === "complete" ? /* @__PURE__ */ a.jsx(lt, {}) : String(x + 1).padStart(2, "0") }),
        x < n.length - 1 ? /* @__PURE__ */ a.jsx("span", { className: `q-workflow-connector is-${Pg(S, E)}` }) : null
      ] }),
      /* @__PURE__ */ a.jsxs("span", { className: "q-workflow-copy", children: [
        /* @__PURE__ */ a.jsx("strong", { children: y.label }),
        c && y.description ? /* @__PURE__ */ a.jsx("small", { children: y.description }) : null
      ] })
    ] }, `${x}-${y.label}`);
  }) });
}
const cc = "M5.5 25.5 9.8 10.5 21.1 4.9 27.1 10.9 21.5 22.2 6.5 26.5Z", dc = "M15.1 17.2 7.2 25.8";
function $2(n = "q-brand-mark", r = "") {
  const s = r ? `role="img" aria-label="${r}"` : 'aria-hidden="true"';
  return `<svg class="${n}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" ${s}><path d="${cc}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"/><path d="${dc}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round"/><circle class="q-brand-node" cx="15.1" cy="17.2" r="2.35" fill="currentColor"/></svg>`;
}
function bS() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" color="#f6b21a"><rect width="32" height="32" rx="7" fill="#09090b"/><path d="${cc}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"/><path d="${dc}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round"/><circle cx="15.1" cy="17.2" r="2.35" fill="currentColor"/></svg>`;
}
function _S({ size: n = 28, className: r = "", title: s = "QuillOps", decorative: l = !0 }) {
  const c = N.useId();
  return /* @__PURE__ */ a.jsxs(
    "svg",
    {
      className: `q-brand-mark ${r}`.trim(),
      width: n,
      height: n,
      viewBox: "0 0 32 32",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": l ? "true" : void 0,
      "aria-labelledby": l ? void 0 : c,
      role: l ? void 0 : "img",
      children: [
        l ? null : /* @__PURE__ */ a.jsx("title", { id: c, children: s }),
        /* @__PURE__ */ a.jsx("path", { d: cc, stroke: "currentColor", strokeWidth: "2.15", strokeLinecap: "round", strokeLinejoin: "round" }),
        /* @__PURE__ */ a.jsx("path", { d: dc, stroke: "currentColor", strokeWidth: "2.15", strokeLinecap: "round" }),
        /* @__PURE__ */ a.jsx("circle", { className: "q-brand-node", cx: "15.1", cy: "17.2", r: "2.35", fill: "currentColor" })
      ]
    }
  );
}
function fc({ variant: n = "full", size: r, className: s = "", href: l = "/" }) {
  const c = r ?? (n === "compact" ? 24 : n === "mark-only" ? 28 : 30);
  return /* @__PURE__ */ a.jsxs("a", { className: `q-wordmark q-logo-${n} ${s}`.trim(), href: l, "aria-label": "Go to QuillOps homepage", children: [
    /* @__PURE__ */ a.jsx("span", { className: "q-wordmark-mark", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx(_S, { size: c }) }),
    n === "mark-only" ? null : /* @__PURE__ */ a.jsx("span", { className: "q-wordmark-text", children: "QuillOps" })
  ] });
}
function DS() {
  return /* @__PURE__ */ a.jsxs("header", { className: "q-auth-brand-header", children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-auth-utility-row", children: /* @__PURE__ */ a.jsxs("a", { className: "q-auth-back", href: "#/", children: [
      /* @__PURE__ */ a.jsx(Ip, { "aria-hidden": "true" }),
      " Back to QuillOps"
    ] }) }),
    /* @__PURE__ */ a.jsx(fc, { className: "q-auth-wordmark" })
  ] });
}
const Gr = "quillops_jwt", Gi = "quillops_user_email";
class Ao extends Error {
  constructor(r, s = 0, l = "unknown") {
    super(r), this.status = s, this.code = l, this.name = "ApiError";
  }
}
function IS() {
  return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? window.location.port === "8000" ? window.location.origin : `http://${window.location.hostname}:8000` : null;
}
function jp() {
  var r;
  return (((r = document.querySelector('meta[name="quillops-api-base"]')) == null ? void 0 : r.content.trim()) || IS() || window.location.origin).replace(/\/$/, "");
}
function kp(n) {
  return localStorage.getItem(n) ?? sessionStorage.getItem(n);
}
function Qi(n) {
  localStorage.removeItem(n), sessionStorage.removeItem(n);
}
function VS(n) {
  try {
    const r = n.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), s = r.padEnd(Math.ceil(r.length / 4) * 4, "="), l = JSON.parse(atob(s));
    return typeof l.exp == "number" && l.exp * 1e3 <= Date.now();
  } catch {
    return !0;
  }
}
const Go = {
  getToken() {
    const n = kp(Gr);
    return n && VS(n) ? (this.clearSession(), null) : n;
  },
  setSession(n, r, s) {
    this.clearSession();
    const l = s ? localStorage : sessionStorage;
    l.setItem(Gr, n), l.setItem(Gi, r);
  },
  setToken(n, r = !0) {
    Qi(Gr), (r ? localStorage : sessionStorage).setItem(Gr, n);
  },
  setUserEmail(n, r = !0) {
    Qi(Gi), (r ? localStorage : sessionStorage).setItem(Gi, n);
  },
  clearToken() {
    Qi(Gr);
  },
  clearSession() {
    Qi(Gr), Qi(Gi);
  },
  isAuthenticated() {
    return !!this.getToken();
  },
  getUserEmail() {
    return kp(Gi) || "User";
  },
  logout(n = !0) {
    this.clearSession(), n && (window.location.hash = "#/login");
  }
};
function qS(n) {
  return typeof n == "string" ? n : Array.isArray(n) ? n.map((r) => {
    var l;
    return `${((l = r.loc) == null ? void 0 : l.at(-1)) ?? "field"}: ${r.msg || "Invalid value"}`;
  }).join(" · ") : "The submitted information could not be validated.";
}
function OS(n) {
  const r = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? " Start the QuillOps FastAPI server on port 8000 and try again." : " Please verify the configured API URL.";
  return `The API returned a webpage instead of JSON from ${n}.${r}`;
}
async function Mo(n, r = {}) {
  var g;
  const s = `${jp()}${n}`, l = Go.getToken(), c = new Headers(r.headers);
  c.set("Accept", "application/json"), r.body !== void 0 && c.set("Content-Type", "application/json"), l && c.set("Authorization", `Bearer ${l}`);
  let f;
  try {
    f = await fetch(s, {
      ...r,
      headers: c,
      body: r.body === void 0 ? void 0 : JSON.stringify(r.body)
    });
  } catch {
    throw new Ao(`Unable to reach the QuillOps API at ${jp()}. Check that the backend is running and try again.`, 0, "network");
  }
  if (f.status === 204) return null;
  if (!(((g = f.headers.get("content-type")) == null ? void 0 : g.toLowerCase()) || "").includes("application/json"))
    throw await f.text(), new Ao(OS(s), f.status, "invalid-content-type");
  let m;
  try {
    m = await f.json();
  } catch {
    throw new Ao("The API returned malformed JSON. Please try again shortly.", f.status, "invalid-json");
  }
  if (!f.ok) {
    const p = typeof m == "object" && m !== null && "detail" in m ? m.detail : void 0;
    throw f.status === 401 && n !== "/auth/login" && Go.logout(), new Ao(
      p !== void 0 ? qS(p) : f.status >= 500 ? "The server encountered an error. Please try again." : "The request could not be completed.",
      f.status,
      f.status === 401 ? "authentication" : "api"
    );
  }
  return m;
}
const Sr = {
  get: (n) => Mo(n, { method: "GET" }),
  post: (n, r) => Mo(n, { method: "POST", body: r }),
  put: (n, r) => Mo(n, { method: "PUT", body: r }),
  delete: (n) => Mo(n, { method: "DELETE" })
}, FS = [
  { label: "Research the topic" },
  { label: "Review the plan" },
  { label: "Write in parallel" },
  { label: "Preserve every revision" }
];
function BS({ mode: n }) {
  const r = n === "login", s = Cr(), [l, c] = N.useState(""), [f, h] = N.useState(""), [m, g] = N.useState(!1), [p, y] = N.useState(!0), [x, S] = N.useState(!1), [E, C] = N.useState(""), [R, _] = N.useState(""), L = async (D) => {
    D.preventDefault(), C(""), _("");
    const V = l.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(V)) {
      C("Enter a valid email address.");
      return;
    }
    if (!f) {
      C("Enter your password.");
      return;
    }
    if (!r && f.length < 8) {
      C("Password must contain at least 8 characters.");
      return;
    }
    S(!0);
    try {
      const Q = await Sr.post(r ? "/auth/login" : "/auth/register", { email: V, password: f });
      if (!Q.access_token) throw new Error("The API did not return an access token.");
      Go.setSession(Q.access_token, V, p), _(r ? "Signed in. Opening your workspace…" : "Account created. Opening your workspace…"), window.setTimeout(() => {
        window.location.hash = "#/dashboard";
      }, s ? 0 : 350);
    } catch (Q) {
      C(Q instanceof Error ? Q.message : "Authentication failed. Please try again."), S(!1);
    }
  };
  return /* @__PURE__ */ a.jsxs("div", { className: "q-landing q-auth-page", children: [
    /* @__PURE__ */ a.jsx("a", { className: "q-skip-link", href: "#auth-form", children: "Skip to authentication form" }),
    /* @__PURE__ */ a.jsx(Tg, { className: "q-auth-shader", variant: "ambient", children: /* @__PURE__ */ a.jsxs("main", { className: "q-auth-shell", children: [
      /* @__PURE__ */ a.jsxs(
        dn.section,
        {
          className: "q-auth-card",
          "aria-labelledby": "auth-title",
          initial: s ? !1 : { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
          children: [
            /* @__PURE__ */ a.jsx(DS, {}),
            /* @__PURE__ */ a.jsxs("div", { className: "q-auth-heading", children: [
              /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: r ? "WELCOME BACK" : "CREATE YOUR WORKSPACE" }),
              /* @__PURE__ */ a.jsx("h1", { id: "auth-title", children: r ? "Continue your workspace." : "Start with an idea." }),
              /* @__PURE__ */ a.jsx("p", { children: r ? "Sign in to resume your drafts, workflow checkpoints and revision history." : "Create an account for a persistent, human-controlled writing workflow." })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "q-auth-toast-stack", "aria-live": "polite", "aria-atomic": "true", children: [
              E && /* @__PURE__ */ a.jsx("div", { className: "q-auth-toast is-error", role: "alert", children: E }),
              R && /* @__PURE__ */ a.jsxs("div", { className: "q-auth-toast is-success", role: "status", children: [
                /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
                R
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("form", { id: "auth-form", className: "q-auth-form", onSubmit: L, noValidate: !0, children: [
              /* @__PURE__ */ a.jsx("label", { htmlFor: "auth-email", children: "Email address" }),
              /* @__PURE__ */ a.jsxs("div", { className: "q-auth-input-wrap", children: [
                /* @__PURE__ */ a.jsx(e0, { "aria-hidden": "true" }),
                /* @__PURE__ */ a.jsx("input", { id: "auth-email", type: "email", inputMode: "email", autoComplete: "email", value: l, onChange: (D) => c(D.target.value), placeholder: "you@company.com", "aria-invalid": !!(E && !/^\S+@\S+\.\S+$/.test(l)), disabled: x })
              ] }),
              /* @__PURE__ */ a.jsx("div", { className: "q-auth-label-row", children: /* @__PURE__ */ a.jsx("label", { htmlFor: "auth-password", children: "Password" }) }),
              /* @__PURE__ */ a.jsxs("div", { className: "q-auth-input-wrap", children: [
                /* @__PURE__ */ a.jsx($p, { "aria-hidden": "true" }),
                /* @__PURE__ */ a.jsx("input", { id: "auth-password", type: m ? "text" : "password", autoComplete: r ? "current-password" : "new-password", value: f, onChange: (D) => h(D.target.value), placeholder: r ? "Your password" : "At least 8 characters", disabled: x }),
                /* @__PURE__ */ a.jsx("button", { type: "button", className: "q-password-toggle", "aria-label": m ? "Hide password" : "Show password", "aria-pressed": m, onClick: () => g((D) => !D), children: m ? /* @__PURE__ */ a.jsx(Ky, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(qo, { "aria-hidden": "true" }) })
              ] }),
              /* @__PURE__ */ a.jsxs("label", { className: "q-remember-control", children: [
                /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: p, onChange: (D) => y(D.target.checked) }),
                /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ a.jsx(lt, {}) }),
                /* @__PURE__ */ a.jsx("span", { children: r ? "Remember me on this device" : "Keep me signed in on this device" })
              ] }),
              /* @__PURE__ */ a.jsx("button", { className: "q-button q-auth-submit", type: "submit", disabled: x, children: x ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
                /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
                r ? "Signing in…" : "Creating account…"
              ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
                r ? "Continue" : "Create account",
                /* @__PURE__ */ a.jsx(Io, { "aria-hidden": "true" })
              ] }) })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "q-auth-divider", children: /* @__PURE__ */ a.jsx("span", { children: "or continue with" }) }),
            /* @__PURE__ */ a.jsxs("div", { className: "q-social-placeholders", "aria-label": "Social login options coming soon", children: [
              /* @__PURE__ */ a.jsxs("button", { type: "button", disabled: !0, "aria-label": "Google sign in coming soon", children: [
                /* @__PURE__ */ a.jsx("span", { className: "q-google-mark", "aria-hidden": "true", children: "G" }),
                "Google ",
                /* @__PURE__ */ a.jsx("small", { children: "Coming soon" })
              ] }),
              /* @__PURE__ */ a.jsxs("button", { type: "button", disabled: !0, "aria-label": "GitHub sign in coming soon", children: [
                /* @__PURE__ */ a.jsx(Yy, { "aria-hidden": "true" }),
                "GitHub ",
                /* @__PURE__ */ a.jsx("small", { children: "Coming soon" })
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("p", { className: "q-auth-switch", children: [
              r ? "New to QuillOps?" : "Already have an account?",
              " ",
              /* @__PURE__ */ a.jsx("a", { href: r ? "#/register" : "#/login", children: r ? "Create an account" : "Sign in" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ a.jsxs(dn.aside, { className: "q-auth-workflow", initial: s ? !1 : { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.45, delay: s ? 0 : 0.12 }, "aria-label": "QuillOps workflow overview", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-auth-workflow-header", children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx(Gp, { "aria-hidden": "true" }),
            "HUMAN CHECKPOINT ACTIVE"
          ] }),
          /* @__PURE__ */ a.jsx("small", { children: "WORKFLOW 01" })
        ] }),
        /* @__PURE__ */ a.jsxs("h2", { children: [
          "Writing that waits",
          /* @__PURE__ */ a.jsx("br", {}),
          "for your judgment."
        ] }),
        /* @__PURE__ */ a.jsx("p", { children: "QuillOps keeps the process visible and pauses before generation so structure stays an editorial decision." }),
        /* @__PURE__ */ a.jsx(Ng, { steps: FS, variant: "compact", orientation: "vertical", showDescriptions: !1 }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-auth-workflow-foot", children: [
          /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
          "Persistent state · Durable checkpoints"
        ] })
      ] })
    ] }) })
  ] });
}
const zS = ["Router", "Research", "Planner", "Human Review", "Workers", "Reducer"];
function $S() {
  return /* @__PURE__ */ a.jsx("section", { className: "q-section q-architecture-section", id: "architecture", "aria-labelledby": "architecture-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-architecture-grid", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-architecture-copy", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "VISIBLE BY DESIGN" }),
      /* @__PURE__ */ a.jsxs("h2", { id: "architecture-title", children: [
        "A real workflow,",
        /* @__PURE__ */ a.jsx("br", {}),
        "not a hidden prompt."
      ] }),
      /* @__PURE__ */ a.jsx("p", { children: "QuillOps makes the orchestration legible—from HTTP request to durable state. Each system does one job, and the review boundary stays explicit." }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-architecture-note", children: [
        /* @__PURE__ */ a.jsx(rs, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "Durable by construction." }),
          /* @__PURE__ */ a.jsx("br", {}),
          "Application data and workflow checkpoints survive beyond a single process."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-architecture-map", "aria-label": "QuillOps system architecture", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-arch-node", children: [
        /* @__PURE__ */ a.jsx(s0, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "FastAPI" }),
          /* @__PURE__ */ a.jsx("small", { children: "API + authentication" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(Lo, { className: "q-arch-arrow", "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-arch-node", children: [
        /* @__PURE__ */ a.jsx(Wp, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "Celery + Redis" }),
          /* @__PURE__ */ a.jsx("small", { children: "Background execution" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(Lo, { className: "q-arch-arrow", "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-langgraph-box", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-langgraph-title", children: [
          /* @__PURE__ */ a.jsx(o0, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: "LangGraph" }),
            /* @__PURE__ */ a.jsx("small", { children: "Stateful orchestration" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "q-graph-nodes", children: zS.map((n, r) => /* @__PURE__ */ a.jsxs("span", { className: n === "Human Review" ? "is-human" : "", children: [
          String(r + 1).padStart(2, "0"),
          " · ",
          n
        ] }, n)) })
      ] }),
      /* @__PURE__ */ a.jsx(Lo, { className: "q-arch-arrow", "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-arch-node", children: [
        /* @__PURE__ */ a.jsx(Uy, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "PostgreSQL + checkpoints" }),
          /* @__PURE__ */ a.jsx("small", { children: "Content, versions, workflow state" })
        ] })
      ] })
    ] })
  ] }) });
}
const US = ["FastAPI", "LangGraph", "Celery", "Redis", "PostgreSQL"];
function WS() {
  return /* @__PURE__ */ a.jsx("section", { className: "q-section q-about-section", id: "about", "aria-labelledby": "about-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-about-grid", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-section-intro q-section-intro-left", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "ABOUT QUILLOPS" }),
      /* @__PURE__ */ a.jsx("h2", { id: "about-title", children: "Built for transparent AI collaboration." }),
      /* @__PURE__ */ a.jsx("p", { children: "QuillOps is a human-in-the-loop technical writing system designed and developed by Shubham Upadhyay. It makes research, planning, approval, generation and revision visible instead of hiding the entire process behind one prompt." })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-about-system", "aria-label": "QuillOps technology stack", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-about-system-head", children: [
        /* @__PURE__ */ a.jsx(Wp, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("small", { children: "SYSTEM PROFILE" }),
          /* @__PURE__ */ a.jsx("strong", { children: "Durable by design" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "q-about-stack", children: US.map((n, r) => /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx("small", { children: String(r + 1).padStart(2, "0") }),
        n
      ] }, n)) }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-about-system-foot", children: [
        /* @__PURE__ */ a.jsx(zy, { "aria-hidden": "true" }),
        "Inspectable stages ",
        /* @__PURE__ */ a.jsx(Bp, { "aria-hidden": "true" }),
        "Recoverable revisions"
      ] })
    ] })
  ] }) });
}
const HS = [
  [n0, "Persistent workspace", "Close the app and return days later without losing your work."],
  [Bp, "Durable AI pipeline", "Paused workflows survive process restarts and resume correctly."],
  [Zy, "Parallel section writing", "Sections can be generated independently and assembled consistently."],
  [qp, "AI-assisted editing", "Give focused instructions without regenerating the entire article."],
  [zp, "Version history", "Every meaningful edit creates a recoverable revision."],
  [$p, "Private by default", "Each user can access only their own blogs."]
];
function KS() {
  const n = Cr();
  return /* @__PURE__ */ a.jsx("section", { className: "q-section q-features-section", id: "features", "aria-labelledby": "features-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-section-intro q-section-intro-left", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "BUILT FOR WORK THAT CONTINUES" }),
      /* @__PURE__ */ a.jsx("h2", { id: "features-title", children: "A workspace with memory." }),
      /* @__PURE__ */ a.jsx("p", { children: "Not a disposable chat. A durable environment for long-form technical work." })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "q-feature-grid", children: HS.map(([r, s, l], c) => /* @__PURE__ */ a.jsxs(
      dn.article,
      {
        className: "q-feature-card",
        initial: n ? !1 : { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: !0, amount: 0.3 },
        transition: { duration: 0.35, delay: n ? 0 : c % 3 * 0.06 },
        children: [
          /* @__PURE__ */ a.jsx("span", { className: "q-feature-icon", children: /* @__PURE__ */ a.jsx(r, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("h3", { children: s }),
          /* @__PURE__ */ a.jsx("p", { children: l }),
          /* @__PURE__ */ a.jsxs("span", { className: "q-card-index", children: [
            "0",
            c + 1
          ] })
        ]
      },
      s
    )) })
  ] }) });
}
function GS() {
  return /* @__PURE__ */ a.jsxs("section", { className: "q-final-cta", "aria-labelledby": "final-cta-title", children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-final-glow", "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-final-cta-inner", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "YOUR NEXT DRAFT, WITH YOU IN THE LOOP" }),
      /* @__PURE__ */ a.jsx("h2", { id: "final-cta-title", children: "Turn your next idea into a technical draft you control." }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-hero-actions", children: [
        /* @__PURE__ */ a.jsxs("a", { className: "q-button", href: "#/register", children: [
          "Create your first blog ",
          /* @__PURE__ */ a.jsx(Io, { "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ a.jsx("a", { className: "q-button q-button-secondary", href: "#/login", children: "Log in" })
      ] })
    ] })
  ] });
}
function Ag({ compact: n = !1, label: r = "Approve and continue", onStateChange: s }) {
  const [l, c] = N.useState("idle");
  N.useEffect(() => {
    if (s == null || s(l), l === "idle") return;
    const h = {
      approving: { state: "approved", delay: 650 },
      approved: { state: "writing", delay: 850 },
      writing: { state: "idle", delay: 1600 }
    }, m = window.setTimeout(() => c(h[l].state), h[l].delay);
    return () => window.clearTimeout(m);
  }, [s, l]);
  const f = l === "approving" ? "Approving…" : l === "approved" ? "Approved ✓" : l === "writing" ? "Writing started" : r;
  return /* @__PURE__ */ a.jsxs(
    "button",
    {
      className: `q-button q-demo-approval ${n ? "q-button-small" : ""} is-${l}`,
      type: "button",
      onClick: () => c("approving"),
      disabled: l !== "idle",
      "aria-live": "polite",
      children: [
        l === "approving" ? /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
        f
      ]
    }
  );
}
const QS = [
  ["Routing", "done"],
  ["Research", "done"],
  ["Planning", "done"],
  ["Review", "current"],
  ["Writing", "pending"],
  ["Final assembly", "pending"]
];
function YS() {
  const n = Cr();
  return /* @__PURE__ */ a.jsxs(
    dn.div,
    {
      className: "q-product-preview",
      initial: n ? !1 : { opacity: 0, y: 36 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: n ? 0 : 0.65 },
      "aria-label": "Example QuillOps plan review workspace",
      children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-preview-topbar", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("span", { className: "q-kicker", children: "BLOG" }),
            /* @__PURE__ */ a.jsx("h2", { children: "Building Reliable LangGraph Agents" })
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "q-status-pill", children: [
            /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
            "Waiting for review"
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-preview-grid", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-preview-pipeline", children: [
            /* @__PURE__ */ a.jsx("p", { className: "q-preview-label", children: "PIPELINE" }),
            /* @__PURE__ */ a.jsx("ol", { children: QS.map(([r, s]) => /* @__PURE__ */ a.jsxs("li", { className: `is-${s}`, children: [
              s === "done" ? /* @__PURE__ */ a.jsx(lt, { "aria-label": "Complete" }) : /* @__PURE__ */ a.jsx(Cu, { "aria-label": s === "current" ? "Current step" : "Not started" }),
              /* @__PURE__ */ a.jsx("span", { children: r })
            ] }, r)) })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-outline-preview", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "q-outline-heading", children: [
              /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsx("p", { className: "q-preview-label", children: "OUTLINE PREVIEW" }),
                /* @__PURE__ */ a.jsx("p", { children: "4 sections · ~1,800 words" })
              ] }),
              /* @__PURE__ */ a.jsx("span", { children: "Editable" })
            ] }),
            /* @__PURE__ */ a.jsx("ol", { children: ["Why reliability matters", "Durable execution", "Human approval checkpoints", "Failure recovery patterns"].map((r, s) => /* @__PURE__ */ a.jsxs("li", { children: [
              /* @__PURE__ */ a.jsx(Pu, { "aria-hidden": "true" }),
              /* @__PURE__ */ a.jsxs("span", { className: "q-outline-number", children: [
                "0",
                s + 1
              ] }),
              /* @__PURE__ */ a.jsx("span", { children: r })
            ] }, r)) }),
            /* @__PURE__ */ a.jsxs("div", { className: "q-preview-footer", children: [
              /* @__PURE__ */ a.jsxs("p", { children: [
                /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
                "Generation is paused at a durable checkpoint."
              ] }),
              /* @__PURE__ */ a.jsx(Ag, { compact: !0, label: "Approve plan" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const XS = [
  ["01", "The reliability problem", "Set the stakes and define durable execution."],
  ["02", "Checkpointing state", "Explain state persistence and recovery boundaries."],
  ["03", "Approval before side effects", "Place the human checkpoint before generation."]
];
function ZS() {
  const n = Cr(), [r, s] = N.useState("idle");
  return /* @__PURE__ */ a.jsx("section", { className: "q-section q-control-section", id: "product", "aria-labelledby": "control-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-control-grid", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-control-copy", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "A DURABLE HUMAN CHECKPOINT" }),
      /* @__PURE__ */ a.jsxs("h2", { id: "control-title", children: [
        "AI moves fast.",
        /* @__PURE__ */ a.jsx("br", {}),
        "You keep control."
      ] }),
      /* @__PURE__ */ a.jsx("p", { className: "q-lede", children: "QuillOps stops after planning—not after it has already made every editorial decision." }),
      /* @__PURE__ */ a.jsxs("ul", { className: "q-control-points", children: [
        /* @__PURE__ */ a.jsxs("li", { children: [
          /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: "Generation pauses before writing." }),
            " Review the exact structure first."
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("li", { children: [
          /* @__PURE__ */ a.jsx(oh, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: "Edit the outline directly." }),
            " Reorder sections and sharpen intent."
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("li", { children: [
          /* @__PURE__ */ a.jsx(Au, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: "Resume from the checkpoint." }),
            " The workflow continues without starting over."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs(
      dn.div,
      {
        className: `q-review-card is-${r}`,
        initial: n ? !1 : { opacity: 0, x: 28 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: !0, amount: 0.3 },
        transition: { duration: 0.45 },
        children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-review-card-top", children: [
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("span", { className: "q-kicker", children: "PLAN REVIEW" }),
              /* @__PURE__ */ a.jsx("h3", { children: "Reliable agents in production" })
            ] }),
            /* @__PURE__ */ a.jsxs("span", { className: `q-status-pill is-${r}`, children: [
              /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
              r === "idle" || r === "approving" ? "Action required" : r === "approved" ? "Approved" : "Writing"
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-review-meta", children: [
            /* @__PURE__ */ a.jsx("span", { children: "Audience · Platform engineers" }),
            /* @__PURE__ */ a.jsx("span", { children: "Tone · Technical" })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "q-review-items", children: XS.map(([l, c, f]) => /* @__PURE__ */ a.jsxs("div", { className: "q-review-item", children: [
            /* @__PURE__ */ a.jsx(Pu, { "aria-hidden": "true" }),
            /* @__PURE__ */ a.jsx("span", { children: l }),
            /* @__PURE__ */ a.jsxs("div", { children: [
              /* @__PURE__ */ a.jsx("h4", { children: c }),
              /* @__PURE__ */ a.jsx("p", { children: f })
            ] }),
            /* @__PURE__ */ a.jsx(oh, { "aria-label": `Edit ${c}` })
          ] }, l)) }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-review-bottom", children: [
            /* @__PURE__ */ a.jsxs("p", { children: [
              /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
              "Checkpoint saved ",
              /* @__PURE__ */ a.jsx("span", { children: "just now" })
            ] }),
            /* @__PURE__ */ a.jsx(Ag, { onStateChange: s })
          ] })
        ]
      }
    )
  ] }) });
}
const xu = {
  linkedin: "https://www.linkedin.com/in/shubhamupadhyay25",
  github: "https://github.com/shubhamupadhyay12/QuillOps"
}, U2 = xu.linkedin, JS = (/* @__PURE__ */ new Date()).getFullYear();
function e2() {
  return /* @__PURE__ */ a.jsxs("footer", { className: "q-footer", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-footer-grid", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx(fc, {}),
        /* @__PURE__ */ a.jsx("p", { children: "The operating system for technical writing." })
      ] }),
      /* @__PURE__ */ a.jsxs("nav", { "aria-label": "Footer navigation", children: [
        /* @__PURE__ */ a.jsx("a", { href: "#/section/product", children: "Product" }),
        /* @__PURE__ */ a.jsx("a", { href: "#/section/workflow", children: "Workflow" }),
        /* @__PURE__ */ a.jsx("a", { href: "#/section/architecture", children: "Architecture" }),
        /* @__PURE__ */ a.jsx("a", { href: "#/section/about", children: "About" }),
        /* @__PURE__ */ a.jsx("a", { href: "#/login", children: "Login" }),
        /* @__PURE__ */ a.jsx("a", { href: "#/register", children: "Register" }),
        /* @__PURE__ */ a.jsx("a", { href: xu.github, target: "_blank", rel: "noopener noreferrer", children: "GitHub" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-shell q-footer-bottom", children: [
      /* @__PURE__ */ a.jsxs("span", { children: [
        "© ",
        JS,
        " QuillOps"
      ] }),
      /* @__PURE__ */ a.jsxs("span", { className: "q-footer-credit", children: [
        "Built by ",
        /* @__PURE__ */ a.jsx("strong", { children: "Shubham Upadhyay" }),
        /* @__PURE__ */ a.jsx("a", { className: "q-footer-linkedin", href: xu.linkedin, target: "_blank", rel: "noopener noreferrer", "aria-label": "Connect with Shubham Upadhyay on LinkedIn", children: /* @__PURE__ */ a.jsx(Jy, { "aria-hidden": "true" }) })
      ] })
    ] })
  ] });
}
const Ep = [
  ["Product", "#/section/product"],
  ["Workflow", "#/section/workflow"],
  ["Features", "#/section/features"],
  ["Architecture", "#/section/architecture"],
  ["About", "#/section/about"]
];
function t2() {
  const [n, r] = N.useState(!1), [s, l] = N.useState(!1);
  return N.useEffect(() => {
    const c = () => l(window.scrollY > 24), f = (h) => {
      h.key === "Escape" && r(!1);
    };
    return c(), window.addEventListener("scroll", c, { passive: !0 }), window.addEventListener("keydown", f), () => {
      window.removeEventListener("scroll", c), window.removeEventListener("keydown", f);
    };
  }, []), /* @__PURE__ */ a.jsxs("header", { className: `q-public-nav ${s ? "is-scrolled" : ""}`, children: [
    /* @__PURE__ */ a.jsxs("nav", { className: "q-nav-inner", "aria-label": "Main navigation", children: [
      /* @__PURE__ */ a.jsx(fc, {}),
      /* @__PURE__ */ a.jsxs("div", { className: "q-nav-links", children: [
        Ep.map(([c, f]) => /* @__PURE__ */ a.jsx("a", { href: f, children: c }, f)),
        /* @__PURE__ */ a.jsx("a", { href: "https://github.com/shubhamupadhyay12/QuillOps", target: "_blank", rel: "noopener noreferrer", children: "GitHub" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-nav-actions", children: [
        /* @__PURE__ */ a.jsx("a", { className: "q-login-link", href: "#/login", children: "Log in" }),
        /* @__PURE__ */ a.jsx("a", { className: "q-button q-button-small", href: "#/register", children: "Start writing" }),
        /* @__PURE__ */ a.jsx(
          "button",
          {
            className: "q-menu-trigger",
            type: "button",
            "aria-expanded": n,
            "aria-controls": "mobile-navigation",
            "aria-label": n ? "Close navigation menu" : "Open navigation menu",
            onClick: () => r((c) => !c),
            children: n ? /* @__PURE__ */ a.jsx(ru, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(t0, { "aria-hidden": "true" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { id: "mobile-navigation", className: `q-mobile-menu ${n ? "is-open" : ""}`, "aria-hidden": !n, children: [
      Ep.map(([c, f]) => /* @__PURE__ */ a.jsx("a", { href: f, onClick: () => r(!1), children: c }, f)),
      /* @__PURE__ */ a.jsx("a", { href: "https://github.com/shubhamupadhyay12/QuillOps", target: "_blank", rel: "noopener noreferrer", children: "GitHub" }),
      /* @__PURE__ */ a.jsx("a", { href: "#/login", onClick: () => r(!1), children: "Log in" })
    ] })
  ] });
}
const n2 = [
  { label: "Route", description: "Understands the request and chooses the right workflow." },
  { label: "Research", description: "Collects supporting evidence when the topic requires it." },
  { label: "Plan", description: "Creates a structured outline for the intended reader." },
  { label: "Review", description: "You edit, reorder and approve the plan." },
  { label: "Write", description: "Specialized workers produce sections in parallel." },
  { label: "Assemble", description: "Normalizes every section into one consistent document." },
  { label: "Refine", description: "Keeps manual edits, AI edits and recoverable versions." }
];
function r2() {
  return /* @__PURE__ */ a.jsx("section", { className: "q-section q-workflow-section", id: "workflow", "aria-labelledby": "workflow-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-section-intro", children: [
      /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "THE QUILL PIPELINE / 01—07" }),
      /* @__PURE__ */ a.jsx("h2", { id: "workflow-title", children: "From idea to publication-ready draft." }),
      /* @__PURE__ */ a.jsx("p", { children: "Every stage is visible. One deliberate checkpoint keeps the author in charge." })
    ] }),
    /* @__PURE__ */ a.jsx(Ng, { steps: n2 })
  ] }) });
}
const Qr = ["Research", "Plan", "Review", "Parallel writing", "Revision history"];
function i2() {
  const n = Cr() || new URLSearchParams(window.location.search).get("motion") === "reduce", [r, s] = N.useState(n ? 2 : -1), [l, c] = N.useState(!0), [f, h] = N.useState(!document.hidden), m = N.useRef(null);
  return N.useEffect(() => {
    const g = m.current;
    if (!g || n || typeof IntersectionObserver > "u") return;
    const p = new IntersectionObserver(([y]) => c(y.isIntersecting), { threshold: 0.2 });
    return p.observe(g), () => p.disconnect();
  }, [n]), N.useEffect(() => {
    const g = () => h(!document.hidden);
    return document.addEventListener("visibilitychange", g), () => document.removeEventListener("visibilitychange", g);
  }, []), N.useEffect(() => {
    if (n) {
      s(2);
      return;
    }
    if (!l || !f) return;
    const g = r === -1 ? 320 : r >= Qr.length ? 1500 : 1450, p = r >= Qr.length ? -1 : r + 1, y = window.setTimeout(() => s(p), g);
    return () => window.clearTimeout(y);
  }, [f, r, n, l]), /* @__PURE__ */ a.jsxs("div", { ref: m, className: "q-marketing-workflow", "aria-label": "QuillOps visible workflow demonstration", children: [
    Qr.map((g, p) => {
      const y = p < r ? "complete" : p === r ? "active" : "pending", x = p < r ? "complete" : p === r ? "filling" : "pending";
      return /* @__PURE__ */ a.jsxs("div", { className: `is-${y}`, "aria-label": `${g}: ${y}`, children: [
        /* @__PURE__ */ a.jsx("span", { className: "q-marketing-marker", "aria-hidden": "true", children: y === "complete" ? /* @__PURE__ */ a.jsx(lt, {}) : String(p + 1).padStart(2, "0") }),
        p < Qr.length - 1 ? /* @__PURE__ */ a.jsx("span", { className: `q-marketing-connector is-${x}`, "aria-hidden": "true", children: /* @__PURE__ */ a.jsx("i", {}) }) : null,
        /* @__PURE__ */ a.jsxs("small", { children: [
          "0",
          p + 1
        ] }),
        /* @__PURE__ */ a.jsx("strong", { children: g })
      ] }, g);
    }),
    /* @__PURE__ */ a.jsx("span", { className: "q-visually-hidden", children: r >= Qr.length ? "Workflow complete" : r >= 0 ? `${Qr[r]} active` : "Workflow ready" })
  ] });
}
function s2() {
  const n = new URLSearchParams(window.location.search).get("motion") === "reduce", r = Cr() || n, s = new URLSearchParams(window.location.search).get("webgl") === "off", l = (c) => ({
    initial: r ? !1 : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.48, delay: r ? 0 : c }
  });
  return /* @__PURE__ */ a.jsx(m0, { reducedMotion: n ? "always" : "user", children: /* @__PURE__ */ a.jsxs("div", { className: `q-landing ${n ? "is-reduced-motion" : ""}`, id: "top", children: [
    /* @__PURE__ */ a.jsx("a", { className: "q-skip-link", href: "#/section/main-content", children: "Skip to content" }),
    /* @__PURE__ */ a.jsx(t2, {}),
    /* @__PURE__ */ a.jsxs("main", { id: "main-content", children: [
      /* @__PURE__ */ a.jsx(Tg, { forceFallback: s, forceReducedMotion: n, children: /* @__PURE__ */ a.jsxs("div", { className: "q-hero-shell", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-hero-copy", children: [
          /* @__PURE__ */ a.jsxs(dn.p, { className: "q-hero-eyebrow", ...l(0.08), children: [
            /* @__PURE__ */ a.jsx(qo, { "aria-hidden": "true" }),
            " HUMAN-IN-THE-LOOP AI WRITING"
          ] }),
          /* @__PURE__ */ a.jsxs(dn.h1, { ...l(0.16), children: [
            "Technical writing,",
            /* @__PURE__ */ a.jsx("br", {}),
            /* @__PURE__ */ a.jsx("span", { children: "orchestrated." })
          ] }),
          /* @__PURE__ */ a.jsx(dn.p, { className: "q-hero-description", ...l(0.26), children: "QuillOps researches your topic, designs the outline, waits for your approval, writes every section and preserves every revision—without taking editorial control away from you." }),
          /* @__PURE__ */ a.jsxs(dn.div, { className: "q-hero-actions", ...l(0.36), children: [
            /* @__PURE__ */ a.jsxs("a", { className: "q-button", href: "#/register", children: [
              "Start writing ",
              /* @__PURE__ */ a.jsx(Io, { "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ a.jsx("a", { className: "q-button q-button-secondary", href: "#/section/workflow", children: "Explore the workflow" })
          ] }),
          /* @__PURE__ */ a.jsxs(dn.p, { className: "q-hero-support", ...l(0.44), children: [
            /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" }),
            "Research. Review. Generate. Refine.",
            /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsx(YS, {})
      ] }) }),
      /* @__PURE__ */ a.jsx("section", { className: "q-section q-positioning-section", "aria-labelledby": "positioning-title", children: /* @__PURE__ */ a.jsxs("div", { className: "q-shell", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-section-intro", children: [
          /* @__PURE__ */ a.jsx("p", { className: "q-eyebrow", children: "NOT ANOTHER ONE-PROMPT WRITER" }),
          /* @__PURE__ */ a.jsx("h2", { id: "positioning-title", children: "Great technical content needs a process." }),
          /* @__PURE__ */ a.jsx("p", { children: "One-shot tools collapse research, structure and judgment into an invisible answer. QuillOps exposes the work so you can shape it before prose is generated." })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-comparison", children: [
          /* @__PURE__ */ a.jsxs("article", { className: "q-comparison-card q-comparison-typical", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "q-comparison-heading", children: [
              /* @__PURE__ */ a.jsx("span", { children: "Typical AI writer" }),
              /* @__PURE__ */ a.jsx("small", { children: "BLACK BOX" })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "q-simple-flow", children: [
              /* @__PURE__ */ a.jsx("span", { children: "Prompt" }),
              /* @__PURE__ */ a.jsx(Io, { "aria-hidden": "true" }),
              /* @__PURE__ */ a.jsx("span", { children: "Generated article" })
            ] }),
            /* @__PURE__ */ a.jsxs("p", { children: [
              /* @__PURE__ */ a.jsx(Up, { "aria-hidden": "true" }),
              "The reasoning and editorial choices stay hidden."
            ] })
          ] }),
          /* @__PURE__ */ a.jsxs("article", { className: "q-comparison-card q-comparison-quillops", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "q-comparison-heading", children: [
              /* @__PURE__ */ a.jsx("span", { children: "QuillOps" }),
              /* @__PURE__ */ a.jsx("small", { children: "VISIBLE WORKFLOW" })
            ] }),
            /* @__PURE__ */ a.jsx(i2, {}),
            /* @__PURE__ */ a.jsxs("p", { children: [
              /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
              "Each transition is explicit, inspectable and recoverable."
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ a.jsx(r2, {}),
      /* @__PURE__ */ a.jsx(ZS, {}),
      /* @__PURE__ */ a.jsx(KS, {}),
      /* @__PURE__ */ a.jsx($S, {}),
      /* @__PURE__ */ a.jsx(WS, {}),
      /* @__PURE__ */ a.jsx(GS, {})
    ] }),
    /* @__PURE__ */ a.jsx(e2, {})
  ] }) });
}
const o2 = `#version 300 es
precision highp float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`, a2 = `#version 300 es
precision highp float;
out vec4 outputColor;
uniform vec2 resolution;
uniform float time;
uniform float stage;
void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float radius = length(p);
  float distortion = 0.035 + stage * 0.004;
  float rx = p.x * (1.0 + radius * distortion);
  float gx = p.x;
  float bx = p.x * (1.0 - radius * distortion);
  float wave = 2.4 + stage * 0.12;
  float amp = 0.23 + stage * 0.008;
  float r = 0.012 / max(abs(p.y + sin((rx + time) * wave) * amp), 0.012);
  float g = 0.008 / max(abs(p.y + sin((gx + time) * wave) * amp), 0.014);
  float b = 0.004 / max(abs(p.y + sin((bx + time) * wave) * amp), 0.016);
  float mask = smoothstep(1.05, 0.08, radius) * smoothstep(0.02, 0.45, radius);
  vec3 amber = vec3(r * 1.0, g * 0.48, b * 0.16) * mask;
  outputColor = vec4(amber, mask * 0.72);
}`, Cp = {
  queued: 0,
  routing: 1,
  researching: 2,
  synthesizing_research: 3,
  planning_outline: 4,
  validating_outline: 5,
  saving_checkpoint: 6,
  waiting_for_review: 7,
  failed: 8
};
function Tp(n, r, s) {
  const l = n.createShader(r);
  return l ? (n.shaderSource(l, s), n.compileShader(l), n.getShaderParameter(l, n.COMPILE_STATUS) ? l : (n.deleteShader(l), null)) : null;
}
function l2({ stage: n }) {
  const r = N.useRef(null), s = N.useRef(null), l = N.useRef(Cp[n] ?? 0), [c, f] = N.useState(!1);
  return l.current = Cp[n] ?? 0, N.useEffect(() => {
    const h = r.current, m = s.current;
    if (!h || !m) return;
    const g = new URLSearchParams(window.location.search);
    if (g.get("webgl") === "off") {
      f(!0);
      return;
    }
    const p = m.getContext("webgl2", { alpha: !0, antialias: !1, depth: !1, powerPreference: "low-power" });
    if (!p) {
      f(!0);
      return;
    }
    const y = Tp(p, p.VERTEX_SHADER, o2), x = Tp(p, p.FRAGMENT_SHADER, a2), S = p.createProgram(), E = p.createBuffer();
    if (!y || !x || !S || !E) {
      E && p.deleteBuffer(E), S && p.deleteProgram(S), y && p.deleteShader(y), x && p.deleteShader(x), f(!0);
      return;
    }
    if (p.attachShader(S, y), p.attachShader(S, x), p.linkProgram(S), !p.getProgramParameter(S, p.LINK_STATUS)) {
      p.deleteBuffer(E), p.deleteProgram(S), p.deleteShader(y), p.deleteShader(x), f(!0);
      return;
    }
    p.bindBuffer(p.ARRAY_BUFFER, E), p.bufferData(p.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), p.STATIC_DRAW);
    const C = p.getAttribLocation(S, "position");
    p.enableVertexAttribArray(C), p.vertexAttribPointer(C, 2, p.FLOAT, !1, 0, 0);
    const R = p.getUniformLocation(S, "resolution"), _ = p.getUniformLocation(S, "time"), L = p.getUniformLocation(S, "stage"), D = window.matchMedia("(prefers-reduced-motion: reduce)");
    let V = null, Q = 0;
    const K = () => {
      const oe = h.getBoundingClientRect(), Ie = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1 : 1.25);
      m.width = Math.max(1, Math.round(oe.width * Ie)), m.height = Math.max(1, Math.round(oe.height * Ie)), p.viewport(0, 0, m.width, m.height);
    }, J = (oe) => {
      p.useProgram(S), p.uniform2f(R, m.width, m.height), p.uniform1f(_, D.matches || g.get("motion") === "reduce" ? 0 : oe * 22e-5), p.uniform1f(L, l.current), p.clearColor(0, 0, 0, 0), p.clear(p.COLOR_BUFFER_BIT), p.drawArrays(p.TRIANGLE_STRIP, 0, 4);
    }, U = (oe) => {
      document.hidden || D.matches || g.get("motion") === "reduce" || (oe - Q >= 1e3 / 30 && (J(oe), Q = oe), V = requestAnimationFrame(U));
    }, $ = () => {
      V !== null && cancelAnimationFrame(V), V = null, K(), J(0), !document.hidden && !D.matches && g.get("motion") !== "reduce" && (V = requestAnimationFrame(U));
    }, he = new ResizeObserver($);
    return he.observe(h), document.addEventListener("visibilitychange", $), D.addEventListener("change", $), $(), () => {
      V !== null && cancelAnimationFrame(V), he.disconnect(), document.removeEventListener("visibilitychange", $), D.removeEventListener("change", $), p.deleteBuffer(E), p.deleteProgram(S), p.deleteShader(y), p.deleteShader(x);
    };
  }, []), /* @__PURE__ */ a.jsxs("div", { ref: r, className: `planning-energy-field is-${n}`, "aria-hidden": "true", children: [
    /* @__PURE__ */ a.jsx("div", { className: "planning-energy-fallback" }),
    c ? null : /* @__PURE__ */ a.jsx("canvas", { ref: s })
  ] });
}
const u2 = 220, Ut = 120, tn = 550, Ro = 10, hc = {
  short: { sectionMin: 4, sectionMax: 6, targetWords: 1e3 },
  standard: { sectionMin: 6, sectionMax: 9, targetWords: 1900 },
  "long-form": { sectionMin: 8, sectionMax: 12, targetWords: 3200 }
}, c2 = [
  { id: "brief", label: "Brief", value: 200 },
  { id: "standard", label: "Standard", value: 400 },
  { id: "detailed", label: "Detailed", value: tn }
];
function Mg(n) {
  return Number.isFinite(n) ? Math.min(tn, Math.max(Ut, Math.round(n))) : Ut;
}
function Rg(n) {
  return n.reduce((r, s) => r + (Number.isFinite(s.target_words) ? s.target_words : 0), 0);
}
function wu(n) {
  return Math.max(1, Math.ceil(Math.max(0, n) / u2));
}
function Lg(n, r) {
  return r <= 0 ? "normal" : n > r * 1.1 ? "warning" : n < r * 0.75 ? "under" : "normal";
}
function d2(n, r) {
  return r <= 0 ? 0 : Math.min(100, Math.max(0, n / r * 100));
}
const f2 = [
  ["Quick guide", 1e3, "800–1,200 words"],
  ["Standard article", 1800, "1,500–2,200 words"],
  ["Deep dive", 3e3, "2,500–3,500 words"]
];
function h2({ form: n, onChange: r, invalidFields: s }) {
  return /* @__PURE__ */ a.jsxs("section", { className: "q-article-brief", "aria-labelledby": "article-brief-title", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-review-card-heading", children: [
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx(nu, { "aria-hidden": "true" }),
        " ARTICLE BRIEF"
      ] }),
      /* @__PURE__ */ a.jsxs("small", { children: [
        wu(n.targetWords),
        "-minute target read"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("h2", { id: "article-brief-title", children: "Article configuration" }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-brief-grid", children: [
      /* @__PURE__ */ a.jsxs("label", { className: "is-wide", htmlFor: "article-title", children: [
        "Proposed article title",
        /* @__PURE__ */ a.jsx("input", { id: "article-title", value: n.blog_title, "aria-invalid": s.has("article-title"), onChange: (l) => r({ blog_title: l.target.value }) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: "article-audience", children: [
        "Target audience",
        /* @__PURE__ */ a.jsx("input", { id: "article-audience", value: n.audience, "aria-invalid": s.has("article-audience"), onChange: (l) => r({ audience: l.target.value }) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: "article-tone", children: [
        "Tone",
        /* @__PURE__ */ a.jsx("input", { id: "article-tone", value: n.tone, "aria-invalid": s.has("article-tone"), onChange: (l) => r({ tone: l.target.value }) })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: "article-kind", children: [
        "Content archetype",
        /* @__PURE__ */ a.jsxs("select", { id: "article-kind", value: n.blog_kind, onChange: (l) => r({ blog_kind: l.target.value }), children: [
          /* @__PURE__ */ a.jsx("option", { value: "explainer", children: "Explainer" }),
          /* @__PURE__ */ a.jsx("option", { value: "tutorial", children: "Tutorial" }),
          /* @__PURE__ */ a.jsx("option", { value: "news_roundup", children: "News roundup" }),
          /* @__PURE__ */ a.jsx("option", { value: "comparison", children: "Comparison" }),
          /* @__PURE__ */ a.jsx("option", { value: "system_design", children: "System design" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: "article-objective", children: [
        "Optional writing objective",
        /* @__PURE__ */ a.jsx("textarea", { id: "article-objective", rows: 2, value: n.writingObjective, placeholder: "What should the reader be able to do after reading?", onChange: (l) => r({ writingObjective: l.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("fieldset", { className: "q-target-length", children: [
      /* @__PURE__ */ a.jsx("legend", { children: "Total target length" }),
      /* @__PURE__ */ a.jsx("div", { className: "q-length-presets", children: f2.map(([l, c, f]) => /* @__PURE__ */ a.jsxs("button", { type: "button", className: n.targetWords === c ? "is-selected" : "", "aria-pressed": n.targetWords === c, onClick: () => r({ targetWords: c }), children: [
        /* @__PURE__ */ a.jsx("strong", { children: l }),
        /* @__PURE__ */ a.jsx("span", { children: f })
      ] }, l)) }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: "article-target-words", children: [
        "Custom target",
        /* @__PURE__ */ a.jsx("input", { id: "article-target-words", type: "number", min: "600", max: "6000", step: "100", value: n.targetWords, onChange: (l) => {
          const c = Number(l.target.value);
          Number.isFinite(c) && r({ targetWords: Math.min(6e3, Math.max(600, c)) });
        } }),
        /* @__PURE__ */ a.jsx("span", { children: "words" })
      ] })
    ] })
  ] });
}
function p2({ errorCount: n, disabled: r, approving: s, approved: l, onApprove: c, onOpenSummary: f }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "q-mobile-approval-bar", children: [
    /* @__PURE__ */ a.jsx("button", { type: "button", className: "q-mobile-summary-button", onClick: f, children: n ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(Eu, { "aria-hidden": "true" }),
      n,
      " issues"
    ] }) : "View summary" }),
    /* @__PURE__ */ a.jsx("button", { type: "button", className: "q-approve-button", disabled: r || s || l, onClick: c, children: l ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
      "Approved — writing started"
    ] }) : s ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
      "Approving…"
    ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(Kp, { "aria-hidden": "true" }),
      "Approve plan and begin writing"
    ] }) })
  ] });
}
function m2({ tasks: n, issues: r, activeId: s, onNavigate: l }) {
  const c = (f) => {
    const h = r.filter((m) => m.sectionId === f);
    return h.some((m) => m.severity === "error") ? "invalid" : h.length ? "warning" : "valid";
  };
  return /* @__PURE__ */ a.jsxs("nav", { className: "q-outline-navigator", "aria-label": "Outline sections", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-outline-navigator-title", children: [
      /* @__PURE__ */ a.jsx("span", { children: "OUTLINE NAVIGATOR" }),
      /* @__PURE__ */ a.jsxs("small", { children: [
        n.length,
        " sections"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("ol", { children: n.map((f, h) => {
      const m = c(f.id);
      return /* @__PURE__ */ a.jsx("li", { children: /* @__PURE__ */ a.jsxs("button", { type: "button", className: s === f.id ? "is-active" : "", onClick: () => l(f.id), "aria-current": s === f.id ? "location" : void 0, children: [
        /* @__PURE__ */ a.jsx("span", { children: String(h + 1).padStart(2, "0") }),
        /* @__PURE__ */ a.jsx("strong", { children: f.title || "Untitled section" }),
        /* @__PURE__ */ a.jsx("small", { children: f.target_words }),
        m === "invalid" ? /* @__PURE__ */ a.jsx(Eu, { "aria-label": "Invalid" }) : m === "warning" ? /* @__PURE__ */ a.jsx(Cu, { "aria-label": "Warning" }) : /* @__PURE__ */ a.jsx(rs, { "aria-label": "Valid" })
      ] }) }, f.id);
    }) }),
    /* @__PURE__ */ a.jsxs("label", { className: "q-outline-mobile-select", children: [
      "Jump to section",
      /* @__PURE__ */ a.jsx("select", { value: s, onChange: (f) => l(Number(f.target.value)), children: n.map((f, h) => /* @__PURE__ */ a.jsxs("option", { value: f.id, children: [
        String(h + 1).padStart(2, "0"),
        " — ",
        f.title,
        " · ",
        f.target_words,
        " words"
      ] }, f.id)) })
    ] })
  ] });
}
function g2({ form: n, issues: r, saveStatus: s, approving: l, approved: c, approvalError: f, overBudgetConfirmed: h, onConfirmBudget: m, onIssue: g, onApprove: p, mobileOpen: y, onMobileOpenChange: x }) {
  const S = Rg(n.tasks), E = Lg(S, n.targetWords), C = r.filter((V) => V.severity === "error"), R = r.find((V) => V.id === "allocation-warning"), _ = { research: n.tasks.filter((V) => V.requires_research).length, citations: n.tasks.filter((V) => V.requires_citations).length, code: n.tasks.filter((V) => V.requires_code).length }, L = C.length === 0, D = s === "saving" ? "Saving locally…" : s === "saved" ? "Saved locally" : s === "error" ? "Local save failed" : "No local edits";
  return /* @__PURE__ */ a.jsxs("aside", { className: `q-plan-summary ${y ? "is-mobile-open" : ""}`, "aria-labelledby": "plan-summary-title", children: [
    /* @__PURE__ */ a.jsxs("button", { className: "q-summary-mobile-toggle", type: "button", onClick: () => x(!y), "aria-expanded": y, children: [
      /* @__PURE__ */ a.jsx("span", { children: "Plan summary" }),
      /* @__PURE__ */ a.jsx("strong", { children: L ? "Ready" : `${C.length} issues` }),
      /* @__PURE__ */ a.jsx(Op, { "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-plan-summary-content", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-review-card-heading", children: [
        /* @__PURE__ */ a.jsx("span", { children: "PLAN SUMMARY" }),
        /* @__PURE__ */ a.jsxs("small", { className: `is-save-${s}`, children: [
          /* @__PURE__ */ a.jsx(Mu, { "aria-hidden": "true" }),
          D
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("h2", { id: "plan-summary-title", children: "Plan summary" }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-summary-primary", children: [
        /* @__PURE__ */ a.jsx("strong", { children: n.tasks.length }),
        /* @__PURE__ */ a.jsx("span", { children: "sections" }),
        /* @__PURE__ */ a.jsx("strong", { children: S.toLocaleString() }),
        /* @__PURE__ */ a.jsx("span", { children: "allocated words" }),
        /* @__PURE__ */ a.jsx("strong", { children: wu(S) }),
        /* @__PURE__ */ a.jsx("span", { children: "minute read" })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: `q-allocation is-${E}`, children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "Word allocation" }),
          /* @__PURE__ */ a.jsxs("strong", { children: [
            S.toLocaleString(),
            " / ",
            n.targetWords.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "q-allocation-bar", "aria-label": `${S} of ${n.targetWords} words allocated`, children: /* @__PURE__ */ a.jsx("span", { style: { width: `${d2(S, n.targetWords)}%` } }) }),
        /* @__PURE__ */ a.jsx("p", { children: S > n.targetWords ? `${(S - n.targetWords).toLocaleString()} words over target` : `${(n.targetWords - S).toLocaleString()} words remaining` })
      ] }),
      /* @__PURE__ */ a.jsxs("dl", { className: "q-requirement-summary", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: "Research sections" }),
          /* @__PURE__ */ a.jsx("dd", { children: _.research })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: "Citation sections" }),
          /* @__PURE__ */ a.jsx("dd", { children: _.citations })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: "Code examples" }),
          /* @__PURE__ */ a.jsx("dd", { children: _.code })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: "Estimated reading" }),
          /* @__PURE__ */ a.jsxs("dd", { children: [
            /* @__PURE__ */ a.jsx(Fp, { "aria-hidden": "true" }),
            " ",
            wu(S),
            " min"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: `q-validation-summary ${L ? "is-ready" : "has-errors"}`, children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          L ? /* @__PURE__ */ a.jsx(rs, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(is, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx("strong", { children: L ? "Ready to approve" : `${C.length} ${C.length === 1 ? "item needs" : "items need"} attention` }),
            /* @__PURE__ */ a.jsx("small", { children: L ? "All required plan fields are complete." : "Open an issue to jump to its field." })
          ] })
        ] }),
        r.length ? /* @__PURE__ */ a.jsx("ul", { children: r.map((V) => /* @__PURE__ */ a.jsx("li", { children: /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => g(V), className: `is-${V.severity}`, children: V.message }) }, V.id)) }) : null
      ] }),
      R ? /* @__PURE__ */ a.jsxs("label", { className: "q-budget-confirm", children: [
        /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: h, onChange: (V) => m(V.target.checked) }),
        /* @__PURE__ */ a.jsx("span", { children: "I reviewed the allocation and want to continue." })
      ] }) : null,
      f ? /* @__PURE__ */ a.jsx("p", { className: "q-approval-error", role: "alert", children: f }) : null,
      /* @__PURE__ */ a.jsx("button", { className: "q-approve-button", type: "button", onClick: p, disabled: l || c || !!(R && !h), children: c ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(rs, { "aria-hidden": "true" }),
        " Approved — writing started"
      ] }) : l ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
        " Approving…"
      ] }) : C.length ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(is, { "aria-hidden": "true" }),
        " Review ",
        C.length,
        " ",
        C.length === 1 ? "issue" : "issues"
      ] }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(Kp, { "aria-hidden": "true" }),
        " Approve plan and begin writing"
      ] }) }),
      /* @__PURE__ */ a.jsx("p", { className: "q-approval-note", children: "Approval resumes the durable workflow from this checkpoint." })
    ] })
  ] });
}
function v2(n) {
  try {
    return new URL(n).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}
function y2({ evidence: n }) {
  return /* @__PURE__ */ a.jsxs("section", { className: "q-research-context", "aria-labelledby": "research-context-title", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-review-card-heading", children: [
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx(Vo, { "aria-hidden": "true" }),
        " RESEARCH CONTEXT"
      ] }),
      /* @__PURE__ */ a.jsxs("small", { children: [
        n.length,
        " ",
        n.length === 1 ? "source" : "sources"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("h2", { id: "research-context-title", children: "Research context" }),
    n.length ? /* @__PURE__ */ a.jsx("div", { className: "q-source-list", children: n.map((r, s) => /* @__PURE__ */ a.jsxs("article", { children: [
      /* @__PURE__ */ a.jsx("strong", { children: r.title }),
      /* @__PURE__ */ a.jsx("span", { children: v2(r.url) }),
      r.snippet ? /* @__PURE__ */ a.jsx("p", { children: r.snippet }) : null,
      /* @__PURE__ */ a.jsxs("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", children: [
        "Open source ",
        /* @__PURE__ */ a.jsx(Hy, { "aria-hidden": "true" })
      ] })
    ] }, `${r.url}-${s}`)) }) : /* @__PURE__ */ a.jsxs("div", { className: "q-research-empty", children: [
      /* @__PURE__ */ a.jsx(Vo, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("strong", { children: "No research sources attached" }),
      /* @__PURE__ */ a.jsx("p", { children: "This plan can still be approved. Enable web research for sections that need current evidence or citations." })
    ] })
  ] });
}
function Pp(n) {
  n.style.height = "auto", n.style.height = `${n.scrollHeight}px`;
}
function x2({ sectionId: n, bullets: r, onChange: s, invalid: l = !1 }) {
  const c = (g, p) => s(r.map((y, x) => x === g ? p : y)), f = (g, p) => {
    const y = [...r];
    [y[g], y[g + p]] = [y[g + p], y[g]], s(y), requestAnimationFrame(() => {
      var x;
      return (x = document.getElementById(`section-${n}-bullet-${g + p}`)) == null ? void 0 : x.focus();
    });
  }, h = (g) => {
    r.length <= 3 || (s(r.filter((p, y) => y !== g)), requestAnimationFrame(() => {
      var p;
      return (p = document.getElementById(`section-${n}-bullet-${Math.max(0, g - 1)}`)) == null ? void 0 : p.focus();
    }));
  }, m = () => {
    if (r.length >= 6) return;
    const g = r.length;
    s([...r, ""]), requestAnimationFrame(() => {
      var p;
      return (p = document.getElementById(`section-${n}-bullet-${g}`)) == null ? void 0 : p.focus();
    });
  };
  return /* @__PURE__ */ a.jsxs("fieldset", { className: "q-bullet-editor", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "q-fieldset-heading", children: [
      /* @__PURE__ */ a.jsx("legend", { children: "Outline points" }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        r.length,
        " of 6"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "q-bullet-list", children: r.map((g, p) => /* @__PURE__ */ a.jsxs("div", { className: "q-bullet-row", children: [
      /* @__PURE__ */ a.jsx("span", { className: "q-bullet-number", "aria-hidden": "true", children: String(p + 1).padStart(2, "0") }),
      /* @__PURE__ */ a.jsx(
        "textarea",
        {
          id: `section-${n}-bullet-${p}`,
          rows: 1,
          value: g,
          "aria-label": `Section bullet point ${p + 1}`,
          "aria-invalid": l && !g.trim(),
          onInput: (y) => Pp(y.currentTarget),
          onFocus: (y) => Pp(y.currentTarget),
          onChange: (y) => c(p, y.target.value)
        }
      ),
      /* @__PURE__ */ a.jsxs("div", { className: "q-bullet-actions", children: [
        /* @__PURE__ */ a.jsx("button", { type: "button", disabled: p === 0, onClick: () => f(p, -1), "aria-label": `Move bullet ${p + 1} up`, children: /* @__PURE__ */ a.jsx(Vp, { "aria-hidden": "true" }) }),
        /* @__PURE__ */ a.jsx("button", { type: "button", disabled: p === r.length - 1, onClick: () => f(p, 1), "aria-label": `Move bullet ${p + 1} down`, children: /* @__PURE__ */ a.jsx(Lo, { "aria-hidden": "true" }) }),
        /* @__PURE__ */ a.jsx("button", { type: "button", className: "is-danger", disabled: r.length <= 3, onClick: () => h(p), "aria-label": `Remove bullet ${p + 1}`, children: /* @__PURE__ */ a.jsx(Qp, { "aria-hidden": "true" }) })
      ] })
    ] }, `${n}-${p}`)) }),
    /* @__PURE__ */ a.jsxs("button", { className: "q-add-bullet", type: "button", onClick: m, disabled: r.length >= 6, children: [
      /* @__PURE__ */ a.jsx(Nu, { "aria-hidden": "true" }),
      " Add bullet point"
    ] }),
    l ? /* @__PURE__ */ a.jsx("p", { className: "q-field-error", children: "Each section needs 3 to 6 complete bullet points." }) : null
  ] });
}
const w2 = [
  ["requires_research", "Web research", Vo, "Use current external evidence"],
  ["requires_citations", "Citations", Hp, "Include source attribution"],
  ["requires_code", "Code block", Tu, "Include a practical code example"]
];
function S2({ task: n, onChange: r }) {
  return /* @__PURE__ */ a.jsxs("fieldset", { className: "q-requirements", children: [
    /* @__PURE__ */ a.jsx("legend", { children: "Generation requirements" }),
    /* @__PURE__ */ a.jsx("div", { className: "q-requirement-grid", children: w2.map(([s, l, c, f]) => {
      const h = n[s];
      return /* @__PURE__ */ a.jsxs("label", { className: h ? "is-selected" : "", children: [
        /* @__PURE__ */ a.jsx("input", { type: "checkbox", checked: h, onChange: (m) => r({ [s]: m.target.checked }) }),
        /* @__PURE__ */ a.jsx(c, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: l }),
          /* @__PURE__ */ a.jsx("small", { children: f })
        ] }),
        h ? /* @__PURE__ */ a.jsx(lt, { className: "q-requirement-check", "aria-hidden": "true" }) : null
      ] }, s);
    }) })
  ] });
}
function j2({ sectionId: n, value: r, onChange: s, invalid: l = !1 }) {
  const [c, f] = N.useState(String(r));
  N.useEffect(() => f(String(r)), [r]);
  const h = (p) => {
    const y = Mg(p);
    f(String(y)), s(y);
  }, m = (r - Ut) / (tn - Ut) * 100, g = `section-${n}-words-error`;
  return /* @__PURE__ */ a.jsxs("fieldset", { className: "q-word-budget", "aria-describedby": l ? g : void 0, children: [
    /* @__PURE__ */ a.jsx("legend", { children: "Word budget" }),
    /* @__PURE__ */ a.jsx("div", { className: "q-budget-presets", "aria-label": "Word budget presets", children: c2.map((p) => /* @__PURE__ */ a.jsxs("button", { type: "button", className: r === p.value ? "is-selected" : "", onClick: () => h(p.value), "aria-pressed": r === p.value, children: [
      /* @__PURE__ */ a.jsx("span", { children: p.label }),
      /* @__PURE__ */ a.jsx("small", { children: p.value })
    ] }, p.id)) }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-budget-stepper", children: [
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => h(r - Ro), disabled: r <= Ut, "aria-label": "Decrease word budget", children: /* @__PURE__ */ a.jsx(Up, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsxs("label", { htmlFor: `section-${n}-words`, children: [
        /* @__PURE__ */ a.jsx("span", { className: "q-visually-hidden", children: "Section word budget" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            id: `section-${n}-words`,
            type: "number",
            min: Ut,
            max: tn,
            step: Ro,
            inputMode: "numeric",
            value: c,
            "aria-invalid": l,
            onChange: (p) => {
              const y = p.target.value;
              f(y);
              const x = Number(y);
              y !== "" && Number.isFinite(x) && x >= Ut && x <= tn && s(x);
            },
            onBlur: () => h(Number(c))
          }
        ),
        /* @__PURE__ */ a.jsx("span", { children: "words" })
      ] }),
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => h(r + Ro), disabled: r >= tn, "aria-label": "Increase word budget", children: /* @__PURE__ */ a.jsx(Nu, { "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ a.jsx("input", { className: "q-budget-range", type: "range", min: Ut, max: tn, step: Ro, value: r, onChange: (p) => h(Number(p.target.value)), "aria-label": "Fine-adjust word budget" }),
    /* @__PURE__ */ a.jsx("div", { className: "q-budget-bar", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx("span", { style: { width: `${Math.max(0, Math.min(100, m))}%` } }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-budget-limits", children: [
      /* @__PURE__ */ a.jsxs("span", { children: [
        Ut,
        " minimum"
      ] }),
      /* @__PURE__ */ a.jsxs("strong", { children: [
        r,
        " words"
      ] }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        tn,
        " maximum"
      ] })
    ] }),
    l ? /* @__PURE__ */ a.jsxs("p", { className: "q-field-error", id: g, children: [
      "Enter between ",
      Ut,
      " and ",
      tn,
      " words."
    ] }) : null
  ] });
}
var k2 = _p();
function E2({ task: n, index: r, count: s, minimumCount: l, expanded: c, issues: f, onToggle: h, onChange: m, onMove: g, onDelete: p }) {
  const y = f.some((U) => U.severity === "error"), x = `section-${n.id}-panel`, S = (U) => m({ ...n, ...U }), E = [n.requires_research && "Research", n.requires_citations && "Citations", n.requires_code && "Code"].filter(Boolean), [C, R] = N.useState(!1), [_, L] = N.useState({ top: 0, left: 0 }), D = N.useRef(null), V = N.useRef(null), Q = N.useCallback(() => {
    if (!D.current) return;
    const U = D.current.getBoundingClientRect(), $ = 152, he = 145, Ge = window.innerHeight - U.bottom >= $ || U.top < $ ? U.bottom + 4 : U.top - $ - 4;
    let Te = U.left + U.width / 2 - he / 2;
    Te = Math.max(8, Math.min(window.innerWidth - he - 8, Te)), L({ top: Ge, left: Te });
  }, []), K = () => {
    C ? R(!1) : (Q(), R(!0));
  }, J = (U) => {
    g(U), R(!1);
  };
  return N.useEffect(() => {
    if (!C) return;
    const U = (he) => {
      var oe;
      if (he instanceof KeyboardEvent && he.key === "Escape") {
        R(!1), (oe = D.current) == null || oe.focus();
        return;
      }
      (he instanceof MouseEvent || he instanceof TouchEvent) && V.current && !V.current.contains(he.target) && D.current && !D.current.contains(he.target) && R(!1);
    }, $ = () => {
      R(!1);
    };
    return document.addEventListener("mousedown", U), document.addEventListener("touchstart", U), document.addEventListener("keydown", U), window.addEventListener("scroll", $, { capture: !0, passive: !0 }), window.addEventListener("resize", $), () => {
      document.removeEventListener("mousedown", U), document.removeEventListener("touchstart", U), document.removeEventListener("keydown", U), window.removeEventListener("scroll", $, { capture: !0 }), window.removeEventListener("resize", $);
    };
  }, [C, Q]), /* @__PURE__ */ a.jsxs("article", { id: `section-card-${n.id}`, className: `q-section-card ${c ? "is-expanded" : ""} ${y ? "has-error" : ""}`, "data-review-section": n.id, children: [
    /* @__PURE__ */ a.jsxs("header", { className: "q-section-card-header", children: [
      /* @__PURE__ */ a.jsx("span", { className: "q-drag-handle", "aria-hidden": "true", children: /* @__PURE__ */ a.jsx(Pu, {}) }),
      /* @__PURE__ */ a.jsxs("button", { className: "q-section-toggle", type: "button", onClick: h, "aria-expanded": c, "aria-controls": x, children: [
        /* @__PURE__ */ a.jsxs("span", { className: "q-section-index", children: [
          "SECTION ",
          String(r + 1).padStart(2, "0")
        ] }),
        /* @__PURE__ */ a.jsx("strong", { id: `section-${n.id}-heading`, tabIndex: -1, children: n.title || "Untitled section" }),
        /* @__PURE__ */ a.jsxs("span", { className: "q-section-compact-meta", children: [
          /* @__PURE__ */ a.jsxs("b", { children: [
            n.target_words,
            " words"
          ] }),
          E.length ? E.join(" · ") : "No special requirements"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "q-section-status", "aria-label": y ? "Section needs attention" : "Section is valid", children: y ? /* @__PURE__ */ a.jsx(Eu, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(rs, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "q-section-delete", type: "button", disabled: s <= l, onClick: p, "aria-label": `Delete section ${r + 1}: ${n.title}`, children: /* @__PURE__ */ a.jsx(Qp, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsx("button", { className: "q-section-chevron", type: "button", onClick: h, "aria-label": `${c ? "Collapse" : "Expand"} section “${n.title || `Section ${r + 1}`}”`, "aria-expanded": c, "aria-controls": x, children: /* @__PURE__ */ a.jsx(Op, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsx(
        "button",
        {
          ref: D,
          className: "q-section-reorder-trigger q-section-overflow",
          type: "button",
          "aria-label": `Reorder options for section ${r + 1}: ${n.title}`,
          onClick: K,
          "aria-haspopup": "menu",
          "aria-expanded": C,
          children: /* @__PURE__ */ a.jsx(Wy, { "aria-hidden": "true" })
        }
      ),
      C && k2.createPortal(
        /* @__PURE__ */ a.jsxs(
          "div",
          {
            ref: V,
            className: "q-section-reorder-menu",
            role: "menu",
            "aria-label": `Reorder section ${r + 1}`,
            style: {
              position: "fixed",
              top: `${_.top}px`,
              left: `${_.left}px`,
              zIndex: 9999
            },
            children: [
              /* @__PURE__ */ a.jsx("button", { role: "menuitem", type: "button", disabled: r === 0, onClick: () => J(-1), children: "Move up" }),
              /* @__PURE__ */ a.jsx("button", { role: "menuitem", type: "button", disabled: r === s - 1, onClick: () => J(1), children: "Move down" }),
              /* @__PURE__ */ a.jsx("button", { role: "menuitem", type: "button", disabled: r === 0, onClick: () => J(-r), children: "Move to top" }),
              /* @__PURE__ */ a.jsx("button", { role: "menuitem", type: "button", disabled: r === s - 1, onClick: () => J(s - r - 1), children: "Move to bottom" })
            ]
          }
        ),
        document.body
      )
    ] }),
    /* @__PURE__ */ a.jsxs("div", { id: x, className: "q-section-card-panel", hidden: !c, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-section-fields", children: [
        /* @__PURE__ */ a.jsxs("label", { htmlFor: `section-${n.id}-title`, children: [
          "Section title",
          /* @__PURE__ */ a.jsx("input", { id: `section-${n.id}-title`, value: n.title, "aria-invalid": f.some((U) => U.id.endsWith("-title")), onChange: (U) => S({ title: U.target.value }) })
        ] }),
        /* @__PURE__ */ a.jsxs("label", { htmlFor: `section-${n.id}-goal`, children: [
          "Generation focus",
          /* @__PURE__ */ a.jsx("textarea", { id: `section-${n.id}-goal`, rows: 3, value: n.goal, "aria-invalid": f.some((U) => U.id.endsWith("-goal")), onChange: (U) => S({ goal: U.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(j2, { sectionId: n.id, value: n.target_words, invalid: f.some((U) => U.id.endsWith("-words")), onChange: (U) => S({ target_words: U }) }),
      /* @__PURE__ */ a.jsx(x2, { sectionId: n.id, bullets: n.bullets, invalid: f.some((U) => U.id.endsWith("-bullets")), onChange: (U) => S({ bullets: U }) }),
      /* @__PURE__ */ a.jsx(S2, { task: n, onChange: S })
    ] })
  ] });
}
function bg(n, r) {
  return {
    id: Number.isInteger(n.id) ? n.id : r + 1,
    title: n.title.trim(),
    goal: n.goal.trim(),
    bullets: n.bullets.map((s) => s.trim()),
    target_words: Mg(Number(n.target_words)),
    tags: Array.isArray(n.tags) ? n.tags.map(String) : [],
    requires_research: !!n.requires_research,
    requires_citations: !!n.requires_citations,
    requires_code: !!n.requires_code
  };
}
function C2(n) {
  var c, f;
  const r = n.tasks.map(bg), s = n.requested_length ?? "standard", l = n.target_words ?? hc[s].targetWords;
  return {
    blog_title: n.blog_title ?? "",
    audience: n.audience ?? "",
    tone: n.tone ?? "",
    blog_kind: n.blog_kind ?? "explainer",
    constraints: [...n.constraints ?? []],
    requested_length: s,
    target_words: l,
    tasks: r,
    targetWords: l,
    writingObjective: ((c = n.constraints) == null ? void 0 : c[0]) ?? "",
    preservedConstraints: ((f = n.constraints) == null ? void 0 : f.slice(1)) ?? []
  };
}
function T2(n) {
  const r = n.writingObjective.trim();
  return {
    blog_title: n.blog_title.trim(),
    audience: n.audience.trim(),
    tone: n.tone.trim(),
    blog_kind: n.blog_kind,
    constraints: r ? [r, ...n.preservedConstraints] : [...n.preservedConstraints],
    requested_length: n.requested_length,
    target_words: n.target_words,
    tasks: n.tasks.map(bg)
  };
}
function P2(n, r, s) {
  return `quillops:review-draft:${encodeURIComponent(n)}:${r}:${encodeURIComponent(s)}`;
}
function N2(n, r) {
  try {
    const s = JSON.parse(localStorage.getItem(n) ?? "null");
    return !s || s.backendUpdatedAt !== r || s.savedAt <= Date.parse(r) ? null : s;
  } catch {
    return null;
  }
}
function A2(n, r, s) {
  localStorage.setItem(n, JSON.stringify({ savedAt: Date.now(), backendUpdatedAt: r, form: s }));
}
function Np(n) {
  localStorage.removeItem(n);
}
function Ap(n) {
  const r = [];
  [
    ["blog_title", "Article title is missing", "article-title"],
    ["audience", "Target audience is missing", "article-audience"],
    ["tone", "Tone guidance is missing", "article-tone"]
  ].forEach(([f, h, m]) => {
    n[f].trim() || r.push({ id: f, message: h, fieldId: m, severity: "error" });
  });
  const l = hc[n.requested_length];
  (n.tasks.length < l.sectionMin || n.tasks.length > l.sectionMax) && r.push({ id: "section-count", message: `The ${n.requested_length} outline must contain ${l.sectionMin} to ${l.sectionMax} sections`, fieldId: "outline-heading", severity: "error" }), n.tasks.forEach((f, h) => {
    const m = h + 1;
    f.title.trim() || r.push({ id: `section-${f.id}-title`, message: `Section ${m} needs a title`, fieldId: `section-${f.id}-title`, sectionId: f.id, severity: "error" }), f.goal.trim() || r.push({ id: `section-${f.id}-goal`, message: `Section ${m} has no generation goal`, fieldId: `section-${f.id}-goal`, sectionId: f.id, severity: "error" }), (f.bullets.length < 3 || f.bullets.length > 6 || f.bullets.some((g) => !g.trim())) && r.push({ id: `section-${f.id}-bullets`, message: `Section ${m} needs 3 to 6 complete bullet points`, fieldId: `section-${f.id}-bullet-0`, sectionId: f.id, severity: "error" }), (!Number.isFinite(f.target_words) || f.target_words < Ut || f.target_words > tn) && r.push({ id: `section-${f.id}-words`, message: `Section ${m} needs ${Ut} to ${tn} words`, fieldId: `section-${f.id}-words`, sectionId: f.id, severity: "error" });
  });
  const c = Rg(n.tasks);
  return Lg(c, n.targetWords) === "warning" && r.push({ id: "allocation-warning", message: `Allocation is ${c - n.targetWords} words above the target`, fieldId: "article-target-words", severity: "warning" }), r;
}
const Mp = "quillops:review-explanation-dismissed";
function M2({ blog: n, onApproved: r }) {
  var _t;
  const s = N.useMemo(() => C2(n.plan), [n.plan]), l = N.useMemo(() => P2(Go.getUserEmail(), n.id, n.updated_at), [n.id, n.updated_at]), c = N.useMemo(() => N2(l, n.updated_at), [n.updated_at, l]), [f, h] = N.useState(() => (c == null ? void 0 : c.form) ?? s), [m, g] = N.useState(() => {
    var H;
    return new Set([(H = f.tasks[0]) == null ? void 0 : H.id].filter((de) => typeof de == "number"));
  }), [p, y] = N.useState(((_t = f.tasks[0]) == null ? void 0 : _t.id) ?? 0), [x, S] = N.useState(!!c), [E, C] = N.useState(c ? "saved" : "unchanged"), [R, _] = N.useState(""), [L, D] = N.useState(!1), [V, Q] = N.useState(!1), [K, J] = N.useState(!1), [U, $] = N.useState(!1), [he, oe] = N.useState(c ? "A newer local draft was restored." : ""), [Ie, Ge] = N.useState(() => localStorage.getItem(Mp) !== "1"), Te = N.useRef(!1), Ue = N.useRef(null), Je = N.useRef(!1), Ae = N.useRef(null), re = N.useRef(null), B = N.useMemo(() => Ap(f), [f]), te = B.filter((H) => H.severity === "error").length, W = B.some((H) => H.id === "allocation-warning") && !K, T = N.useMemo(() => new Set(B.map((H) => H.fieldId)), [B]), I = hc[f.requested_length], ce = N.useCallback((H) => {
    h((de) => typeof H == "function" ? H(de) : { ...de, ...H }), S(!0), C("saving"), _(""), J(!1);
  }, []);
  N.useEffect(() => {
    if (!x || L) return;
    C("saving");
    const H = window.setTimeout(() => {
      try {
        A2(l, n.updated_at, f), C("saved"), oe("Saved locally");
      } catch {
        C("error"), oe("Local recovery could not be saved");
      }
    }, 650);
    return () => window.clearTimeout(H);
  }, [L, n.updated_at, x, l, f]), N.useEffect(() => {
    const H = (de) => {
      x && de.preventDefault();
    };
    return window.addEventListener("beforeunload", H), () => window.removeEventListener("beforeunload", H);
  }, [x]), N.useEffect(() => () => {
    Ue.current && window.clearTimeout(Ue.current);
  }, []), N.useEffect(() => {
    const H = (de) => {
      if (Je.current) {
        const it = Ae.current;
        if (it) {
          const Wt = document.getElementById(`section-card-${it}`);
          if (Wt) {
            const sn = Wt.getBoundingClientRect(), gn = window.innerHeight * 0.28;
            Math.abs(sn.top - gn) < 30 && (Je.current = !1, Ae.current = null, re.current && (window.clearTimeout(re.current), re.current = null));
          }
        }
        return;
      }
      const le = (de == null ? void 0 : de.target) === document ? document.documentElement : (de == null ? void 0 : de.target) instanceof HTMLElement ? de.target : null, Ve = [
        document.documentElement,
        document.body,
        document.querySelector(".app-shell-main"),
        document.querySelector(".dashboard-main")
      ], Ce = le && le.scrollTop > 0 ? le : Ve.find((it) => it && it.scrollTop > 0) || document.documentElement, St = Ce.scrollTop !== void 0 ? Ce.scrollTop : window.scrollY, rt = Ce.scrollHeight !== void 0 ? Ce.scrollHeight : document.documentElement.scrollHeight, Dt = Ce.clientHeight !== void 0 ? Ce.clientHeight : window.innerHeight;
      if (St + Dt >= rt - 50 && f.tasks.length > 0) {
        const it = f.tasks[f.tasks.length - 1].id;
        if (it && it !== p) {
          y(it);
          return;
        }
      }
      const mn = Dt * 0.28, ut = document.querySelectorAll("[data-review-section]");
      let vt = p, rr = 1 / 0;
      ut.forEach((it) => {
        const Wt = Number(it.getAttribute("data-review-section"));
        if (!Wt) return;
        const sn = it.getBoundingClientRect(), gn = Math.abs(sn.top - mn);
        gn < rr && (rr = gn, vt = Wt);
      }), vt && vt !== p && y(vt);
    };
    return window.addEventListener("scroll", H, { capture: !0, passive: !0 }), () => {
      window.removeEventListener("scroll", H, { capture: !0 }), re.current && window.clearTimeout(re.current);
    };
  }, [p, f.tasks]);
  const pe = (H, de) => ce((le) => ({ ...le, tasks: le.tasks.map((Ve) => Ve.id === H ? de : Ve) })), ge = (H, de) => ce((le) => {
    const Ve = le.tasks.findIndex((rt) => rt.id === H), Ce = Ve + de;
    if (Ve < 0 || Ce < 0 || Ce >= le.tasks.length) return le;
    const St = [...le.tasks];
    return [St[Ve], St[Ce]] = [St[Ce], St[Ve]], { ...le, tasks: St };
  }), xe = (H) => {
    const de = f.tasks.find((le) => le.id === H);
    !de || f.tasks.length <= I.sectionMin || window.confirm(`Delete section “${de.title || "Untitled section"}”? This removes its outline details from the plan.`) && ce((le) => ({ ...le, tasks: le.tasks.filter((Ve) => Ve.id !== H) }));
  }, je = () => ce((H) => {
    if (H.tasks.length >= I.sectionMax) return H;
    const de = Math.max(0, ...H.tasks.map((le) => le.id)) + 1;
    return g((le) => new Set(le).add(de)), { ...H, tasks: [...H.tasks, { id: de, title: "New section", goal: "", bullets: ["", "", ""], target_words: 300, tags: [], requires_research: !1, requires_citations: !1, requires_code: !1 }] };
  }), ye = N.useCallback((H, de) => {
    g((le) => new Set(le).add(H)), y(H), Je.current = !0, Ae.current = H, re.current && window.clearTimeout(re.current), re.current = window.setTimeout(() => {
      Je.current = !1, Ae.current = null;
    }, 1500), requestAnimationFrame(() => {
      const le = document.getElementById(`section-card-${H}`);
      if (le) {
        const rt = [
          document.querySelector(".app-shell-main"),
          document.querySelector(".dashboard-main"),
          document.documentElement,
          document.body
        ].find((vt) => vt && vt.scrollTop > 0) || document.documentElement, Dt = rt.scrollTop !== void 0 ? rt.scrollTop : window.scrollY, mn = le.getBoundingClientRect().top + Dt - 140 - 16;
        rt.scrollTo({
          top: mn,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        const ut = document.getElementById(de ?? `section-${H}-heading`);
        ut == null || ut.focus({ preventScroll: !0 }), ut == null || ut.classList.add("q-review-highlight"), window.setTimeout(() => ut == null ? void 0 : ut.classList.remove("q-review-highlight"), 1200);
      }
    });
  }, []), ke = (H) => {
    if (oe(H.message), H.sectionId) ye(H.sectionId, H.fieldId);
    else {
      const de = document.getElementById(H.fieldId);
      de == null || de.scrollIntoView({ behavior: "smooth", block: "center" }), de == null || de.focus();
    }
  }, Qe = async () => {
    if (Te.current) return;
    const H = Ap(f), de = H.find((le) => le.severity === "error");
    if (de) {
      oe(`${H.filter((le) => le.severity === "error").length} validation issues found`), ke(de);
      return;
    }
    if (H.some((le) => le.id === "allocation-warning") && !K) {
      oe("Confirm the word allocation before approving"), $(!0);
      return;
    }
    Te.current = !0, D(!0), _(""), oe("Approval started");
    try {
      await Sr.post(`/blogs/${n.id}/approve-plan`, { plan: T2(f) }), Np(l), S(!1), D(!1), Q(!0), oe("Approved — writing started"), Ue.current = window.setTimeout(r, 650);
    } catch (le) {
      _(le instanceof Error ? le.message : "The plan could not be approved. Your edits are still saved locally."), oe("Approval failed. Your edits are still available."), D(!1), Te.current = !1;
    }
  }, pn = () => {
    Np(l), h(s), S(!1), C("unchanged"), oe("Local draft discarded");
  };
  return /* @__PURE__ */ a.jsxs("div", { className: "q-review-workspace", children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-review-ambient", "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsxs("header", { className: "q-review-header", children: [
      /* @__PURE__ */ a.jsxs("a", { href: "#/dashboard", children: [
        /* @__PURE__ */ a.jsx(Ip, { "aria-hidden": "true" }),
        " Back to Workspace"
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-review-title-row", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("p", { children: "HUMAN REVIEW CHECKPOINT" }),
          /* @__PURE__ */ a.jsx("h1", { children: "Review and shape your outline" }),
          /* @__PURE__ */ a.jsx("span", { children: "QuillOps has paused before writing. Refine the structure, section goals and generation requirements, then approve the plan when it is ready." })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-review-status", children: [
          /* @__PURE__ */ a.jsxs("strong", { children: [
            /* @__PURE__ */ a.jsx(Cu, { "aria-hidden": "true" }),
            " Waiting for your approval"
          ] }),
          /* @__PURE__ */ a.jsxs("small", { children: [
            /* @__PURE__ */ a.jsx(Mu, { "aria-hidden": "true" }),
            E === "saving" ? "Saving locally…" : E === "saved" ? "Saved locally" : "No local changes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("ol", { className: "q-review-workflow-strip", "aria-label": "Workflow status", children: [
        /* @__PURE__ */ a.jsxs("li", { className: "is-complete", children: [
          /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Research",
            /* @__PURE__ */ a.jsx("small", { children: "Complete" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("li", { className: "is-complete", children: [
          /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Planning",
            /* @__PURE__ */ a.jsx("small", { children: "Complete" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("li", { className: "is-active", children: [
          /* @__PURE__ */ a.jsx("span", { children: "03" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Human review",
            /* @__PURE__ */ a.jsx("small", { children: "Active" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("li", { children: [
          /* @__PURE__ */ a.jsx("span", { children: "04" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            "Writing",
            /* @__PURE__ */ a.jsx("small", { children: "Pending" })
          ] })
        ] })
      ] }),
      c ? /* @__PURE__ */ a.jsxs("div", { className: "q-recovery-notice", role: "status", children: [
        /* @__PURE__ */ a.jsx(Au, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: "Local draft restored" }),
          "Your newer edits were recovered from this browser."
        ] }),
        /* @__PURE__ */ a.jsx("button", { type: "button", onClick: pn, children: "Discard recovery" })
      ] }) : null
    ] }),
    Ie ? /* @__PURE__ */ a.jsxs("aside", { className: "q-review-explanation", children: [
      /* @__PURE__ */ a.jsx(Xy, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: "Why QuillOps pauses here" }),
        /* @__PURE__ */ a.jsx("p", { children: "Review structure before prose is generated, adjust section depth, choose where evidence is required and approve a durable checkpoint without restarting the workflow." })
      ] }),
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => {
        localStorage.setItem(Mp, "1"), Ge(!1);
      }, children: "Dismiss" })
    ] }) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "q-review-layout", children: [
      /* @__PURE__ */ a.jsxs("main", { className: "q-review-main", children: [
        /* @__PURE__ */ a.jsx(h2, { form: f, invalidFields: T, onChange: ce }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-review-editor-grid", children: [
          /* @__PURE__ */ a.jsx(m2, { tasks: f.tasks, issues: B, activeId: p, onNavigate: ye }),
          /* @__PURE__ */ a.jsxs("section", { className: "q-outline-editor", "aria-labelledby": "outline-heading", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "q-outline-heading", children: [
              /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsx("p", { children: "SECTION OUTLINE" }),
                /* @__PURE__ */ a.jsx("h2", { id: "outline-heading", tabIndex: -1, children: "Shape the reading journey" })
              ] }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                I.sectionMin,
                "–",
                I.sectionMax,
                " sections · 3–6 points each"
              ] })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "q-section-list", children: f.tasks.map((H, de) => /* @__PURE__ */ a.jsx(E2, { task: H, index: de, count: f.tasks.length, minimumCount: I.sectionMin, expanded: m.has(H.id), issues: B.filter((le) => le.sectionId === H.id), onToggle: () => g((le) => {
              const Ve = new Set(le);
              return Ve.has(H.id) ? Ve.delete(H.id) : Ve.add(H.id), Ve;
            }), onChange: (le) => pe(H.id, le), onMove: (le) => ge(H.id, le), onDelete: () => xe(H.id) }, H.id)) }),
            /* @__PURE__ */ a.jsxs("button", { className: "q-add-section", type: "button", disabled: f.tasks.length >= I.sectionMax, onClick: je, children: [
              /* @__PURE__ */ a.jsx(Nu, { "aria-hidden": "true" }),
              " Add section"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-review-sidebar-stack", children: [
        /* @__PURE__ */ a.jsx(g2, { form: f, issues: B, saveStatus: E, approving: L, approved: V, approvalError: R, overBudgetConfirmed: K, onConfirmBudget: J, onIssue: ke, onApprove: Qe, mobileOpen: U, onMobileOpenChange: $ }),
        /* @__PURE__ */ a.jsx(y2, { evidence: n.evidence ?? [] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(p2, { errorCount: te, approving: L, approved: V, disabled: W, onApprove: Qe, onOpenSummary: () => {
      var H;
      $(!0), (H = document.getElementById("plan-summary-title")) == null || H.scrollIntoView({ block: "center" });
    } }),
    /* @__PURE__ */ a.jsx("div", { className: "q-visually-hidden", "aria-live": "polite", "aria-atomic": "true", children: he })
  ] });
}
const Su = ["Route", "Research", "Plan", "Review", "Write", "Assemble", "Refine"];
function R2(n, r = !1) {
  const s = n === "assembling" || n === "validating_article" ? 5 : n === "editing" || n === "queued_for_edit" || n === "completed" ? 6 : 4;
  return Su.map((l, c) => r && c === s ? "failed" : n === "completed" || c < s ? "complete" : c === s ? "active" : "pending");
}
function L2({ stage: n, failed: r = !1 }) {
  const s = R2(n, r);
  return /* @__PURE__ */ a.jsx("ol", { className: "q-real-workflow-progress", "aria-label": "Real workflow progress", children: Su.map((l, c) => {
    const f = s[c];
    return /* @__PURE__ */ a.jsxs("li", { className: `is-${f}`, "aria-label": `${l}: ${f}`, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-real-marker-wrap", children: [
        /* @__PURE__ */ a.jsx("span", { className: "q-real-marker", "aria-hidden": "true", children: f === "complete" ? /* @__PURE__ */ a.jsx(lt, {}) : f === "failed" ? /* @__PURE__ */ a.jsx(is, {}) : String(c + 1).padStart(2, "0") }),
        c < Su.length - 1 ? /* @__PURE__ */ a.jsx("span", { className: `q-real-connector is-${Pg(f, s[c + 1])}` }) : null
      ] }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: l }),
        /* @__PURE__ */ a.jsx("small", { children: f })
      ] })
    ] }, l);
  }) });
}
function b2(n) {
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
function _2({ blog: n }) {
  var x, S, E, C, R, _;
  const [r, s] = N.useState(() => Math.max(0, Math.floor((Date.now() - new Date(n.updated_at).getTime()) / 1e3)));
  N.useEffect(() => {
    const L = window.setInterval(() => s((D) => D + 1), 1e3);
    return () => window.clearInterval(L);
  }, []);
  const l = n.status === "queued_for_edit" || n.status === "editing", c = l ? "editing" : ((x = n.generation_state) == null ? void 0 : x.stage) ?? n.status, f = N.useMemo(() => {
    var L, D;
    return ((L = n.generation_state) == null ? void 0 : L.sections) ?? (((D = n.plan) == null ? void 0 : D.tasks) ?? []).map((V) => ({ ...V, status: "queued" }));
  }, [(S = n.generation_state) == null ? void 0 : S.sections, (E = n.plan) == null ? void 0 : E.tasks]), h = ((C = n.generation_state) == null ? void 0 : C.completed_sections) ?? f.filter((L) => L.status === "completed").length, m = ((R = n.generation_state) == null ? void 0 : R.total_sections) ?? f.length, g = ((_ = n.generation_state) == null ? void 0 : _.message) || n.stage_message || (l ? "Applying the requested refinement" : "Preparing approved sections"), p = f.filter((L) => L.status !== "queued").slice(-5).reverse(), y = c === "assembling" || c === "validating_article";
  return /* @__PURE__ */ a.jsxs("section", { className: "q-writing-mission", "aria-labelledby": "writing-mission-title", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "q-writing-mission-header", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("p", { children: "WRITING MISSION CONTROL" }),
        /* @__PURE__ */ a.jsx("h1", { id: "writing-mission-title", children: l ? "Refining your article" : "Writing your article" }),
        /* @__PURE__ */ a.jsx("span", { children: l ? "QuillOps is applying your editorial instruction while preserving the current version." : "QuillOps is generating sections from the plan you approved and assembling them into one consistent draft." })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "q-writing-live", children: [
        /* @__PURE__ */ a.jsxs("strong", { children: [
          /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
          l ? "Refinement active" : c.replaceAll("_", " ")
        ] }),
        /* @__PURE__ */ a.jsxs("small", { children: [
          /* @__PURE__ */ a.jsx(Fp, { "aria-hidden": "true" }),
          b2(r)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(L2, { stage: c }),
    /* @__PURE__ */ a.jsxs("div", { className: `q-writing-overview ${y ? "is-assembling" : ""}`, children: [
      y ? /* @__PURE__ */ a.jsxs("div", { className: "q-assembly-stack", "aria-hidden": "true", children: [
        /* @__PURE__ */ a.jsx("span", {}),
        /* @__PURE__ */ a.jsx("span", {}),
        /* @__PURE__ */ a.jsx("span", {}),
        /* @__PURE__ */ a.jsx("i", {})
      ] }) : /* @__PURE__ */ a.jsxs("div", { className: "q-writing-energy", "aria-hidden": "true", children: [
        /* @__PURE__ */ a.jsx("span", {}),
        /* @__PURE__ */ a.jsx("span", {}),
        /* @__PURE__ */ a.jsx("span", {})
      ] }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("p", { children: "LIVE WORKFLOW STATE" }),
        /* @__PURE__ */ a.jsx("h2", { children: g }),
        /* @__PURE__ */ a.jsx("span", { children: l ? "The existing article remains safe until the new version is complete." : `${h} of ${m || "—"} sections completed` })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "q-writing-progress", role: "progressbar", "aria-label": `${h} of ${m} sections complete. ${g}`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": n.progress, children: /* @__PURE__ */ a.jsx("span", { style: { width: `${Math.max(0, Math.min(100, n.progress || 0))}%` } }) })
    ] }),
    l ? null : /* @__PURE__ */ a.jsxs("div", { className: "q-writing-grid-wrap", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "q-writing-section-heading", children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("p", { children: "PARALLEL SECTION WORKERS" }),
          /* @__PURE__ */ a.jsx("h2", { children: "Approved outline in production" })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          h,
          "/",
          m,
          " complete"
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "q-writing-worker-grid", children: f.map((L, D) => /* @__PURE__ */ a.jsxs("article", { className: `is-${L.status}`, children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsxs("span", { children: [
            "SECTION ",
            String(D + 1).padStart(2, "0")
          ] }),
          /* @__PURE__ */ a.jsx("strong", { children: L.status })
        ] }),
        /* @__PURE__ */ a.jsx("h3", { children: L.title }),
        /* @__PURE__ */ a.jsxs("p", { children: [
          L.generated_words ? `${L.generated_words} generated` : `${L.target_words} target`,
          " words"
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-worker-requirements", children: [
          L.requires_research ? /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx(Vo, { "aria-hidden": "true" }),
            "Research"
          ] }) : null,
          L.requires_citations ? /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx(Hp, { "aria-hidden": "true" }),
            "Citations"
          ] }) : null,
          L.requires_code ? /* @__PURE__ */ a.jsxs("span", { children: [
            /* @__PURE__ */ a.jsx(Tu, { "aria-hidden": "true" }),
            "Code"
          ] }) : null
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "q-worker-state", "aria-label": `Status: ${L.status}`, children: L.status === "completed" ? /* @__PURE__ */ a.jsx(lt, { "aria-hidden": "true" }) : L.status === "failed" ? /* @__PURE__ */ a.jsx(Gp, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Cn, { className: L.status === "generating" ? "q-spin" : "", "aria-hidden": "true" }) })
      ] }, L.id)) })
    ] }),
    /* @__PURE__ */ a.jsxs("aside", { className: "q-writing-activity", "aria-labelledby": "writing-activity-title", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("p", { children: "SAFE ACTIVITY FEED" }),
        /* @__PURE__ */ a.jsx("h2", { id: "writing-activity-title", children: "What QuillOps is doing" })
      ] }),
      /* @__PURE__ */ a.jsx("ol", { children: l ? /* @__PURE__ */ a.jsxs("li", { children: [
        /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: "Applying your focused editorial instruction" })
      ] }) : p.length ? p.map((L) => /* @__PURE__ */ a.jsxs("li", { children: [
        L.status === "completed" ? /* @__PURE__ */ a.jsx(Gy, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: L.status === "completed" ? `Completed “${L.title}”` : `${L.status} “${L.title}”` })
      ] }, L.id)) : /* @__PURE__ */ a.jsxs("li", { children: [
        /* @__PURE__ */ a.jsx(Cn, { className: "q-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: "Preparing section context" })
      ] }) }),
      /* @__PURE__ */ a.jsx("p", { children: "The job continues safely if you leave this page. Return at any time to see the persisted state." })
    ] })
  ] });
}
function ti(n) {
  return n.trim() ? n.trim().split(/\s+/).length : 0;
}
function D2(n, r, s = !1) {
  var E;
  const l = [...n.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((C, R) => ({ level: C[1].length, title: C[2].trim(), id: `section-${Math.max(0, R - 1)}` })), c = l.filter((C) => C.level === 2), f = c.find((C, R) => c.findIndex((_) => _.title.toLocaleLowerCase() === C.title.toLocaleLowerCase()) !== R), h = l.find((C, R) => R > 0 && C.level - l[R - 1].level > 1), m = n.split(/^##\s+/m).slice(1).map((C, R) => ({ id: `section-${R}`, words: ti(C.replace(/^.+\n/, "")) })), g = m.find((C) => C.words === 0), p = m.find((C) => C.words > 0 && C.words < 40), y = /\[[^\]]*\]\(\s*\)/.test(n), x = ti(n), S = [
    { id: "title", label: "Document title", passed: l.filter((C) => C.level === 1).length === 1, detail: "Use exactly one H1 title." },
    { id: "hierarchy", label: "Heading hierarchy", passed: !h, detail: h ? `Heading “${h.title}” skips a level.` : "Heading levels progress in order.", targetId: h == null ? void 0 : h.id },
    { id: "empty-sections", label: "No empty sections", passed: !g, detail: g ? "A section has no body content." : "Every section contains content.", targetId: g == null ? void 0 : g.id },
    { id: "short-sections", label: "Section depth", passed: !p, detail: p ? `A section has only ${p.words} words.` : "Sections have useful depth.", targetId: p == null ? void 0 : p.id },
    { id: "duplicates", label: "Unique section headings", passed: !f, detail: f ? `Duplicate heading: “${f.title}”.` : "Primary headings are unique.", targetId: f == null ? void 0 : f.id },
    { id: "fences", label: "Balanced code fences", passed: (((E = n.match(/```/g)) == null ? void 0 : E.length) ?? 0) % 2 === 0, detail: "Every fenced code block must close." },
    { id: "links", label: "Links have destinations", passed: !y, detail: y ? "At least one Markdown link is empty." : "Markdown links include destinations." },
    { id: "citations", label: "Required citations", passed: !s || /https?:\/\//.test(n), detail: s ? "The approved plan requires at least one source URL." : "The approved plan does not require citations." },
    { id: "length", label: "Document length", passed: x >= 300, detail: `${x.toLocaleString()} total words.` }
  ];
  return r && S.push({ id: "target", label: "Target allocation", passed: Math.abs(x - r) <= Math.max(150, r * 0.25), detail: `${x.toLocaleString()} of ${r.toLocaleString()} planned words.` }), { checks: S, passed: S.filter((C) => C.passed).length, attention: S.filter((C) => !C.passed).length, words: x, lines: n ? n.split(/\r?\n/).length : 0, readingMinutes: Math.max(1, Math.ceil(x / 220)) };
}
function I2(n) {
  const r = (n || "").toLocaleLowerCase();
  return r ? r.startsWith("restored version") ? "Restored version" : r === "manual edit" || r.includes("manual") ? "Manual edit" : "AI refinement" : "Initial generation";
}
function Rp(n) {
  return n ? !window.marked || !window.DOMPurify ? `<pre>${n.replace(/[&<>]/g, (r) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[r])}</pre>` : window.DOMPurify.sanitize(window.marked.parse(n)) : "<p>This draft has no content yet.</p>";
}
function Lp(n, r, s) {
  const l = URL.createObjectURL(new Blob([r], { type: s })), c = document.createElement("a");
  c.href = l, c.download = n, c.click(), window.setTimeout(() => URL.revokeObjectURL(l), 0);
}
function bp(n) {
  return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "quillops-draft";
}
function V2({ initialBlog: n, onBusy: r }) {
  var ms, ai, li, gs;
  const [s, l] = N.useState(n), [c, f] = N.useState(n.content || ""), [h, m] = N.useState("read"), [g, p] = N.useState(""), [y, x] = N.useState(""), [S, E] = N.useState(""), [C, R] = N.useState(!1), [_, L] = N.useState(null), [D, V] = N.useState(null), [Q, K] = N.useState(!1), [J, U] = N.useState(0), [$, he] = N.useState(""), [oe, Ie] = N.useState(""), [Ge, Te] = N.useState(!1), [Ue, Je] = N.useState(!1), [Ae, re] = N.useState("idle"), [B, te] = N.useState(""), [W, T] = N.useState(""), [I, ce] = N.useState("document"), [pe, ge] = N.useState(null), [xe, je] = N.useState(!1), ye = N.useRef(null), ke = N.useRef(null), Qe = N.useRef(null), pn = N.useRef(null), _t = `quillops_article_recovery_${s.id}`, H = c !== s.content, de = N.useMemo(() => Rp(c), [c]), le = N.useMemo(() => {
    var b, ue;
    return ((ue = (b = s.plan) == null ? void 0 : b.tasks) == null ? void 0 : ue.reduce((be, _e) => be + Number(_e.target_words || 0), 0)) || void 0;
  }, [(ms = s.plan) == null ? void 0 : ms.tasks]), Ve = N.useMemo(() => {
    var b, ue;
    return ((ue = (b = s.plan) == null ? void 0 : b.tasks) == null ? void 0 : ue.some((be) => be.requires_citations)) || !1;
  }, [(ai = s.plan) == null ? void 0 : ai.tasks]), Ce = N.useMemo(() => D2(c, le, Ve), [Ve, c, le]), St = N.useMemo(() => [...c.matchAll(/^(##|###)\s+(.+)$/gm)].map((b, ue) => ({ level: b[1].length, text: b[2], id: `section-${ue}` })), [c]), rt = s.title || ((li = c.match(/^#\s+(.+)$/m)) == null ? void 0 : li[1]) || s.topic.split(`

Audience:`)[0];
  N.useEffect(() => {
    const b = localStorage.getItem(_t);
    b && b !== n.content && E("A newer local edit is available. Open Edit mode to recover it.");
  }, [n.content, _t]), N.useEffect(() => {
    if (h !== "edit") return;
    const b = window.setTimeout(() => localStorage.setItem(_t, c), 450);
    return () => window.clearTimeout(b);
  }, [c, h, _t]), N.useEffect(() => {
    const b = (ue) => {
      H && ue.preventDefault();
    };
    return window.addEventListener("beforeunload", b), () => window.removeEventListener("beforeunload", b);
  }, [H]), N.useEffect(() => {
    if (h === "edit") return;
    const b = ye.current;
    if (!b) return;
    const ue = [...b.querySelectorAll("h2,h3")];
    ue.forEach((me, qe) => {
      if (me.id = `section-${qe}`, !me.querySelector(".q-heading-link")) {
        const Pe = document.createElement("button");
        Pe.type = "button", Pe.className = "q-heading-link", Pe.setAttribute("aria-label", `Copy link to ${me.textContent || "section"}`), Pe.innerHTML = '<i class="fa-solid fa-link" aria-hidden="true"></i>', Pe.addEventListener("click", async () => {
          const yt = `#/blog/${s.id}/section/${me.id}`;
          history.replaceState(null, "", yt), await navigator.clipboard.writeText(location.href), E("Section link copied.");
        }), me.appendChild(Pe);
      }
    }), b.querySelectorAll("pre").forEach((me) => {
      var yt, Ht;
      if ((yt = me.parentElement) != null && yt.classList.contains("q-code-wrap")) return;
      const qe = document.createElement("div");
      qe.className = "q-code-wrap", (Ht = me.parentNode) == null || Ht.insertBefore(qe, me), qe.appendChild(me);
      const Pe = document.createElement("button");
      Pe.type = "button", Pe.className = "q-code-copy", Pe.textContent = "Copy code", Pe.addEventListener("click", async () => {
        await navigator.clipboard.writeText(me.textContent || ""), Pe.textContent = "Copied", window.setTimeout(() => {
          Pe.textContent = "Copy code";
        }, 1600);
      }), qe.appendChild(Pe);
    });
    const be = new IntersectionObserver((me) => {
      const qe = me.filter((Pe) => Pe.isIntersecting).sort((Pe, yt) => Pe.boundingClientRect.top - yt.boundingClientRect.top)[0];
      qe && he(qe.target.id);
    }, { rootMargin: "-18% 0px -70%", threshold: 0 });
    ue.forEach((me) => be.observe(me));
    const _e = () => {
      const me = window.getSelection();
      me != null && me.anchorNode && b.contains(me.anchorNode) && Ie(me.toString().trim().slice(0, 4e3));
    };
    document.addEventListener("selectionchange", _e);
    const ct = location.hash.split("/section/")[1];
    return ct && requestAnimationFrame(() => {
      var me;
      return (me = document.getElementById(ct)) == null ? void 0 : me.scrollIntoView({ block: "start" });
    }), () => {
      be.disconnect(), document.removeEventListener("selectionchange", _e);
    };
  }, [s.id, de, h]), N.useEffect(() => {
    const b = (ue) => {
      const be = (ue == null ? void 0 : ue.target) === document ? document.documentElement : (ue == null ? void 0 : ue.target) instanceof HTMLElement ? ue.target : null, _e = [
        document.documentElement,
        document.body,
        document.querySelector(".app-shell-main"),
        document.querySelector(".dashboard-main"),
        document.querySelector(".q-article-workspace"),
        document.querySelector(".q-document-panel")
      ], ct = be && be.scrollTop > 0 ? be : _e.find((Ht) => Ht && Ht.scrollTop > 0) || document.documentElement, me = ct.scrollTop !== void 0 ? ct.scrollTop : window.scrollY, qe = ct.scrollHeight !== void 0 ? ct.scrollHeight : document.documentElement.scrollHeight, Pe = ct.clientHeight !== void 0 ? ct.clientHeight : window.innerHeight, yt = qe - Pe;
      U(yt > 0 ? Math.min(100, Math.max(0, me / yt * 100)) : 100), je(me >= 120);
    };
    return b(), window.addEventListener("scroll", b, { capture: !0, passive: !0 }), () => window.removeEventListener("scroll", b, { capture: !0 });
  }, []);
  const Dt = () => {
    const ue = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    [
      document.documentElement,
      document.body,
      document.querySelector(".app-shell-main"),
      document.querySelector(".dashboard-main"),
      document.querySelector(".q-article-workspace"),
      document.querySelector(".q-document-panel")
    ].forEach((_e) => {
      _e && _e.scrollTo({ top: 0, behavior: ue });
    }), window.scrollTo({ top: 0, behavior: ue });
  };
  N.useEffect(() => {
    const b = document.querySelector(".app-shell");
    return b == null || b.classList.toggle("is-article-preview", h === "preview"), () => b == null ? void 0 : b.classList.remove("is-article-preview");
  }, [h]), N.useEffect(() => {
    var _e, ct;
    if (!_) return;
    const b = document.activeElement instanceof HTMLElement ? document.activeElement : null, ue = document.body.style.overflow;
    document.body.style.overflow = "hidden", Qe.current = document.querySelector(".q-version-drawer"), pn.current = ((_e = Qe.current) == null ? void 0 : _e.querySelector("section > header button")) || null, (ct = pn.current) == null || ct.focus();
    const be = (me) => {
      var Ht;
      if (me.key === "Escape") {
        me.preventDefault(), L(null);
        return;
      }
      if (me.key !== "Tab") return;
      const qe = [...((Ht = Qe.current) == null ? void 0 : Ht.querySelectorAll('button:not(.q-version-backdrop):not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')) || []].filter((ui) => !ui.hidden && ui.getClientRects().length > 0);
      if (!qe.length) return;
      const Pe = qe[0], yt = qe[qe.length - 1];
      me.shiftKey && document.activeElement === Pe ? (me.preventDefault(), yt.focus()) : !me.shiftKey && document.activeElement === yt && (me.preventDefault(), Pe.focus());
    };
    return document.addEventListener("keydown", be), () => {
      document.removeEventListener("keydown", be), document.body.style.overflow = ue, b == null || b.focus();
    };
  }, [_]);
  function rn(b) {
    b === "edit" && f(localStorage.getItem(_t) || c), m(b);
  }
  function mn() {
    const b = ke.current;
    b && Ie(b.value.slice(b.selectionStart, b.selectionEnd).trim().slice(0, 4e3));
  }
  async function ut() {
    R(!0), E("");
    try {
      const b = await Sr.put(`/blogs/${s.id}`, { content: c, instruction: g.trim() || "Manual edit" });
      l(b), f(b.content), m("read"), p(""), localStorage.removeItem(_t), L(null), E("Draft saved as a new recoverable version.");
    } catch (b) {
      E(b instanceof Error ? b.message : "Unable to save this draft.");
    } finally {
      R(!1);
    }
  }
  async function vt(b, ue = "document") {
    const be = ue === "selection" ? `${b}. Rewrite only this selected passage and preserve the rest of the document exactly:

${oe}` : b;
    re("loading"), te(""), T(b), ce(ue), pe === null && ge(c), R(!0), E("");
    try {
      const _e = await Sr.post(`/blogs/${s.id}/refine`, {
        instruction: be,
        content: c
      });
      f(_e.refined_content), re("success"), R(!1), E("✓ Refinement ready");
    } catch (_e) {
      re("error"), te(_e instanceof Error ? _e.message : "Unable to generate refinement."), R(!1);
    }
  }
  async function rr() {
    R(!0), E("");
    try {
      const b = await Sr.put(`/blogs/${s.id}`, {
        content: c,
        instruction: `Refinement: ${W}`
      });
      l(b), f(b.content), ge(null), re("idle"), L(null), E("Draft saved with refinement applied as a new version.");
    } catch (b) {
      E(b instanceof Error ? b.message : "Unable to save refinement.");
    } finally {
      R(!1);
    }
  }
  function it() {
    pe !== null && f(pe), ge(null), re("idle"), E("Refinement discarded.");
  }
  function Wt() {
    vt(W, I);
  }
  async function sn() {
    try {
      const b = await Sr.get(`/blogs/${s.id}/versions`);
      L(b), V(b[0] || null), K(!1);
    } catch (b) {
      E(b instanceof Error ? b.message : "Unable to load version history.");
    }
  }
  async function gn(b) {
    R(!0);
    try {
      const ue = await Sr.post(`/blogs/${s.id}/restore/${b.id}`);
      l(ue), f(ue.content), L(null), V(null), E(`Version ${b.version_number} restored as version ${ue.current_version}.`);
    } catch (ue) {
      E(ue instanceof Error ? ue.message : "Unable to restore this version.");
    } finally {
      R(!1);
    }
  }
  async function Ln(b, ue) {
    await navigator.clipboard.writeText(b), E(`${ue} copied.`);
  }
  function ir(b) {
    var ue;
    b && ((ue = document.getElementById(b)) == null || ue.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }));
  }
  return h === "preview" ? /* @__PURE__ */ a.jsxs("section", { className: "q-publication-preview", "aria-labelledby": "preview-article-title", children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-reading-progress", role: "progressbar", "aria-label": "Article reading progress", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(J), children: /* @__PURE__ */ a.jsx("span", { style: { width: `${J}%` } }) }),
    /* @__PURE__ */ a.jsxs("button", { className: "q-exit-preview", type: "button", onClick: () => m("read"), children: [
      /* @__PURE__ */ a.jsx(qo, { "aria-hidden": "true" }),
      "Exit preview"
    ] }),
    /* @__PURE__ */ a.jsxs("header", { className: "q-publication-header", children: [
      /* @__PURE__ */ a.jsx("p", { children: "QUILLOPS · READER PREVIEW" }),
      /* @__PURE__ */ a.jsx("h1", { id: "preview-article-title", children: rt }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        Ce.readingMinutes,
        " min read · ",
        Ce.words.toLocaleString(),
        " words"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("article", { ref: ye, className: "markdown-body q-publication-document", dangerouslySetInnerHTML: { __html: de } })
  ] }) : /* @__PURE__ */ a.jsxs("section", { className: "q-article-workspace", "aria-labelledby": "article-title", children: [
    /* @__PURE__ */ a.jsx("div", { className: "q-reading-progress", role: "progressbar", "aria-label": "Article reading progress", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(J), children: /* @__PURE__ */ a.jsx("span", { style: { width: `${J}%` } }) }),
    /* @__PURE__ */ a.jsxs("header", { className: "q-article-header", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsxs("p", { children: [
          "ARTICLE WORKSPACE · VERSION ",
          s.current_version
        ] }),
        /* @__PURE__ */ a.jsx("h1", { id: "article-title", children: rt }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          Ce.words.toLocaleString(),
          " words · ",
          Ce.readingMinutes,
          " min read · Saved ",
          new Date(s.updated_at).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "q-mode-switch", "aria-label": "Article mode", children: ["read", "edit", "preview"].map((b) => /* @__PURE__ */ a.jsxs("button", { type: "button", className: h === b ? "is-active" : "", "aria-pressed": h === b, onClick: () => rn(b), children: [
        b === "read" ? /* @__PURE__ */ a.jsx(nu, {}) : b === "edit" ? /* @__PURE__ */ a.jsx(r0, {}) : /* @__PURE__ */ a.jsx(qo, {}),
        b
      ] }, b)) })
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "q-mobile-panel-switches", children: [
      /* @__PURE__ */ a.jsxs("button", { type: "button", "aria-expanded": Ge, "aria-controls": "article-outline-panel", onClick: () => Te((b) => !b), children: [
        /* @__PURE__ */ a.jsx(sh, {}),
        "Outline"
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", "aria-expanded": Ue, "aria-controls": "article-tools-panel", onClick: () => Je((b) => !b), children: [
        /* @__PURE__ */ a.jsx(ah, {}),
        "Tools"
      ] })
    ] }),
    S ? /* @__PURE__ */ a.jsxs("div", { className: "q-workspace-message", role: "status", children: [
      S,
      /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => E(""), "aria-label": "Dismiss message", children: /* @__PURE__ */ a.jsx(ru, {}) })
    ] }) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "q-article-layout", children: [
      /* @__PURE__ */ a.jsxs("aside", { id: "article-outline-panel", className: `q-outline-panel ${Ge ? "is-mobile-open" : ""}`, children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx(sh, {}),
          /* @__PURE__ */ a.jsx("span", { children: "ON THIS PAGE" })
        ] }),
        /* @__PURE__ */ a.jsx("nav", { "aria-label": "Article outline", children: St.length ? St.map((b) => /* @__PURE__ */ a.jsx("button", { type: "button", className: `${b.level === 3 ? "is-child" : ""} ${$ === b.id ? "is-active" : ""}`, "aria-current": $ === b.id ? "location" : void 0, onClick: () => {
          var ue;
          Te(!1), (ue = document.getElementById(b.id)) == null || ue.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        }, children: b.text }, b.id)) : /* @__PURE__ */ a.jsx("span", { children: "No section headings yet." }) })
      ] }),
      /* @__PURE__ */ a.jsx("main", { className: "q-document-panel", children: h === "edit" ? /* @__PURE__ */ a.jsxs("div", { className: "q-editor", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "q-editor-meta", children: [
          /* @__PURE__ */ a.jsx("span", { children: H ? "Unsaved changes" : "Saved" }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            Ce.words.toLocaleString(),
            " words · ",
            Ce.lines,
            " lines"
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("label", { htmlFor: "article-editor", children: "Markdown draft" }),
        /* @__PURE__ */ a.jsx("textarea", { ref: ke, id: "article-editor", value: c, onChange: (b) => f(b.target.value), onSelect: mn, spellCheck: "true" }),
        /* @__PURE__ */ a.jsx("label", { htmlFor: "revision-note", children: "Revision note" }),
        /* @__PURE__ */ a.jsx("input", { id: "revision-note", value: g, onChange: (b) => p(b.target.value), placeholder: "What changed?" }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => {
            f(s.content), m("read");
          }, children: "Cancel" }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "btn btn-primary", disabled: C || !H, onClick: ut, children: [
            /* @__PURE__ */ a.jsx(Mu, {}),
            C ? "Saving…" : "Save new version"
          ] })
        ] })
      ] }) : /* @__PURE__ */ a.jsx("article", { ref: ye, className: "markdown-body q-article-document", dangerouslySetInnerHTML: { __html: de } }) }),
      /* @__PURE__ */ a.jsxs("aside", { id: "article-tools-panel", className: `q-inspector-panel ${Ue ? "is-mobile-open" : ""}`, children: [
        /* @__PURE__ */ a.jsxs("section", { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-panel-title", children: [
            /* @__PURE__ */ a.jsx(ah, {}),
            /* @__PURE__ */ a.jsx("span", { children: "AI COPILOT" })
          ] }),
          /* @__PURE__ */ a.jsx("p", { children: "Every accepted refinement preserves the current version first." }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-quick-actions", children: [
            ["Improve clarity", "Make more concise", "Add technical depth", "Improve examples", "Improve introduction", "Improve conclusion", "Check structure"].map((b) => /* @__PURE__ */ a.jsxs("button", { type: "button", disabled: C, onClick: () => vt(b), children: [
              /* @__PURE__ */ a.jsx(rh, {}),
              b
            ] }, b)),
            /* @__PURE__ */ a.jsxs("button", { type: "button", disabled: C || !oe, onClick: () => vt("Rewrite for clarity and technical precision", "selection"), children: [
              /* @__PURE__ */ a.jsx(rh, {}),
              "Rewrite selection",
              oe ? ` (${oe.split(/\s+/).length} words)` : ""
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("textarea", { "aria-label": "Custom AI instruction", value: y, onChange: (b) => x(b.target.value), placeholder: "Rewrite the introduction for backend engineers and add a practical analogy." }),
          /* @__PURE__ */ a.jsxs("button", { className: "btn btn-primary", type: "button", style: { width: "100%" }, disabled: C || y.trim().length < 3, onClick: () => vt(y.trim()), children: [
            /* @__PURE__ */ a.jsx(qp, {}),
            C && Ae === "loading" ? "Generating..." : "Generate refinement"
          ] }),
          Ae === "loading" && /* @__PURE__ */ a.jsxs("div", { className: "q-copilot-status is-loading", style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", color: "#fbbf24", fontSize: "0.68rem" }, children: [
            /* @__PURE__ */ a.jsx("span", { className: "q-spin", style: { display: "inline-block" }, children: "⏳" }),
            /* @__PURE__ */ a.jsx("span", { children: "AI is rewriting your content..." })
          ] }),
          Ae === "success" && /* @__PURE__ */ a.jsxs("div", { className: "q-copilot-status is-success", style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }, children: [
            /* @__PURE__ */ a.jsx("div", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#4ade80", fontSize: "0.68rem" }, children: /* @__PURE__ */ a.jsx("span", { children: "✓ Refinement ready" }) }),
            /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
              /* @__PURE__ */ a.jsx("button", { className: "btn btn-primary", type: "button", style: { flex: 1, minHeight: "36px", fontSize: "0.62rem" }, onClick: rr, disabled: C, children: "Apply to Document" }),
              /* @__PURE__ */ a.jsx("button", { className: "btn btn-secondary", type: "button", style: { flex: 1, minHeight: "36px", fontSize: "0.62rem" }, onClick: it, disabled: C, children: "Discard" })
            ] })
          ] }),
          Ae === "error" && /* @__PURE__ */ a.jsxs("div", { className: "q-copilot-status is-error", style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }, children: [
            /* @__PURE__ */ a.jsx("div", { style: { display: "flex", alignItems: "center", gap: "6px", color: "#f87171", fontSize: "0.68rem" }, children: /* @__PURE__ */ a.jsx("span", { children: "⚠ Unable to generate refinement." }) }),
            /* @__PURE__ */ a.jsx("button", { className: "btn btn-secondary", type: "button", style: { alignSelf: "flex-start", minHeight: "30px", fontSize: "0.6rem", padding: "0 10px" }, onClick: Wt, disabled: C, children: "Retry" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-panel-title", children: [
            /* @__PURE__ */ a.jsx(lt, {}),
            /* @__PURE__ */ a.jsx("span", { children: "ARTICLE CHECKS" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-check-summary", children: [
            /* @__PURE__ */ a.jsxs("strong", { children: [
              Ce.passed,
              " passed"
            ] }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              Ce.attention,
              " need attention"
            ] })
          ] }),
          /* @__PURE__ */ a.jsx("ul", { className: "q-article-checks", children: Ce.checks.map((b) => /* @__PURE__ */ a.jsx("li", { className: b.passed ? "is-good" : "is-attention", children: b.targetId ? /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => ir(b.targetId), children: [
            b.passed ? /* @__PURE__ */ a.jsx(lt, {}) : /* @__PURE__ */ a.jsx(is, {}),
            /* @__PURE__ */ a.jsxs("span", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: b.label }),
              /* @__PURE__ */ a.jsx("small", { children: b.detail })
            ] })
          ] }) : /* @__PURE__ */ a.jsxs("div", { children: [
            b.passed ? /* @__PURE__ */ a.jsx(lt, {}) : /* @__PURE__ */ a.jsx(is, {}),
            /* @__PURE__ */ a.jsxs("span", { children: [
              /* @__PURE__ */ a.jsx("strong", { children: b.label }),
              /* @__PURE__ */ a.jsx("small", { children: b.detail })
            ] })
          ] }) }, b.id)) })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-panel-title", children: [
            /* @__PURE__ */ a.jsx(zp, {}),
            /* @__PURE__ */ a.jsx("span", { children: "VERSIONS" })
          ] }),
          /* @__PURE__ */ a.jsxs("button", { type: "button", className: "q-panel-action", onClick: sn, children: [
            /* @__PURE__ */ a.jsx(Qy, {}),
            "Open version history"
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("section", { children: [
          /* @__PURE__ */ a.jsxs("div", { className: "q-panel-title", children: [
            /* @__PURE__ */ a.jsx(ih, {}),
            /* @__PURE__ */ a.jsx("span", { children: "EXPORT" })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "q-export-grid", children: [
            /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => Ln(c, "Markdown"), children: [
              /* @__PURE__ */ a.jsx($y, {}),
              "Copy Markdown"
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => Lp(`${bp(rt)}.md`, c, "text/markdown"), children: [
              /* @__PURE__ */ a.jsx(ih, {}),
              "Download Markdown"
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => {
              var b;
              return Ln(((b = ye.current) == null ? void 0 : b.innerText) || c, "Rendered text");
            }, children: [
              /* @__PURE__ */ a.jsx(nu, {}),
              "Copy rendered text"
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => Lp(`${bp(rt)}.html`, `<!doctype html><meta charset="utf-8"><title>${rt.replace(/[<>]/g, "")}</title><article>${de}</article>`, "text/html"), children: [
              /* @__PURE__ */ a.jsx(Tu, {}),
              "Export HTML"
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => window.print(), children: [
              /* @__PURE__ */ a.jsx(i0, {}),
              "Print"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("button", { className: `q-back-to-top ${xe ? "is-visible" : ""}`, type: "button", onClick: Dt, children: [
      /* @__PURE__ */ a.jsx(Vp, {}),
      "Back to top"
    ] }),
    _ ? /* @__PURE__ */ a.jsxs("div", { className: "q-version-drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "version-title", children: [
      /* @__PURE__ */ a.jsx("button", { className: "q-version-backdrop", type: "button", onClick: () => L(null), "aria-label": "Close version history" }),
      /* @__PURE__ */ a.jsxs("section", { children: [
        /* @__PURE__ */ a.jsxs("header", { children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("p", { children: "NON-DESTRUCTIVE HISTORY" }),
            /* @__PURE__ */ a.jsx("h2", { id: "version-title", children: "Version history" })
          ] }),
          /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => L(null), "aria-label": "Close version history", children: /* @__PURE__ */ a.jsx(ru, {}) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "q-version-layout", children: [
          /* @__PURE__ */ a.jsx("ol", { children: _.map((b, ue) => {
            var _e;
            const be = ti(b.content) - ti(((_e = _[ue + 1]) == null ? void 0 : _e.content) || b.content);
            return /* @__PURE__ */ a.jsxs("li", { className: (D == null ? void 0 : D.id) === b.id ? "is-active" : "", children: [
              /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsxs("strong", { children: [
                  "Version ",
                  b.version_number
                ] }),
                /* @__PURE__ */ a.jsxs("span", { children: [
                  I2(b.edit_instruction),
                  " · ",
                  be === 0 ? "baseline" : `${be > 0 ? "+" : ""}${be} words`
                ] }),
                /* @__PURE__ */ a.jsx("small", { children: b.edit_instruction || "Original generation" }),
                /* @__PURE__ */ a.jsx("time", { dateTime: b.created_at, children: new Date(b.created_at).toLocaleString() })
              ] }),
              /* @__PURE__ */ a.jsxs("div", { children: [
                /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => {
                  V(b), K(!1);
                }, children: "Open" }),
                /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => {
                  V(b), K(!0);
                }, children: "Compare" }),
                /* @__PURE__ */ a.jsxs("button", { type: "button", onClick: () => gn(b), disabled: C, children: [
                  /* @__PURE__ */ a.jsx(Au, {}),
                  "Restore"
                ] })
              ] })
            ] }, b.id);
          }) }),
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsxs("div", { className: "q-version-preview-meta", children: [
              /* @__PURE__ */ a.jsx("strong", { children: D ? `Version ${D.version_number}` : "Preview" }),
              Q && D ? /* @__PURE__ */ a.jsxs("span", { children: [
                ti(D.content) - Ce.words >= 0 ? "+" : "",
                ti(D.content) - Ce.words,
                " words versus current"
              ] }) : null
            ] }),
            /* @__PURE__ */ a.jsx("article", { className: "markdown-body q-version-preview", dangerouslySetInnerHTML: { __html: Rp((D == null ? void 0 : D.content) || ((gs = _[0]) == null ? void 0 : gs.content) || "") } })
          ] })
        ] })
      ] })
    ] }) : null
  ] });
}
let Tn = null, nn = null, ju = null, Pn = null, Nn = null;
const cs = document.querySelector('link[rel="icon"]') ?? document.createElement("link");
cs.rel = "icon";
cs.type = "image/svg+xml";
cs.href = `data:image/svg+xml,${encodeURIComponent(bS())}`;
cs.isConnected || document.head.append(cs);
function _g(n, r) {
  Tn == null || Tn.unmount(), Tn = Qo.createRoot(n), Tn.render(r);
}
function W2(n) {
  _g(n, /* @__PURE__ */ a.jsx(s2, {}));
}
function H2(n, r) {
  _g(n, /* @__PURE__ */ a.jsx(BS, { mode: r }, r));
}
function K2() {
  Tn == null || Tn.unmount(), Tn = null, F2(), q2(), O2();
}
function G2(n, r, s) {
  Pn == null || Pn.unmount(), Pn = Qo.createRoot(n), Pn.render(/* @__PURE__ */ a.jsx(M2, { blog: r, onApproved: s }));
}
function q2() {
  Pn == null || Pn.unmount(), Pn = null;
}
function Dg(n, r) {
  Nn == null || Nn.unmount(), Nn = Qo.createRoot(n), Nn.render(r);
}
function Q2(n, r) {
  Dg(n, /* @__PURE__ */ a.jsx(_2, { blog: r }));
}
function Y2(n, r, s) {
  Dg(n, /* @__PURE__ */ a.jsx(V2, { initialBlog: r, onBusy: s }));
}
function O2() {
  Nn == null || Nn.unmount(), Nn = null;
}
function X2(n, r) {
  ju !== n && (nn == null || nn.unmount(), nn = Qo.createRoot(n), ju = n), nn == null || nn.render(/* @__PURE__ */ a.jsx(l2, { stage: r }));
}
function F2() {
  nn == null || nn.unmount(), nn = null, ju = null;
}
export {
  Sr as api,
  Go as auth,
  U2 as linkedInUrl,
  $2 as quillOpsMarkMarkup,
  Y2 as renderArticleWorkspace,
  H2 as renderAuth,
  W2 as renderLanding,
  X2 as renderPlanningVisual,
  G2 as renderReviewWorkspace,
  Q2 as renderWritingMissionControl,
  F2 as unmountPlanningVisual,
  K2 as unmountReactView,
  q2 as unmountReviewWorkspace,
  O2 as unmountWorkflowWorkspace
};
