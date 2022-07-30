function O() {
}
function st(t, e) {
  for (const n in e)
    t[n] = e[n];
  return t;
}
function Fe(t) {
  return t();
}
function Ne() {
  return /* @__PURE__ */ Object.create(null);
}
function re(t) {
  t.forEach(Fe);
}
function Ve(t) {
  return typeof t == "function";
}
function W(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let he;
function Re(t, e) {
  return he || (he = document.createElement("a")), he.href = e, t === he.href;
}
function lt(t) {
  return Object.keys(t).length === 0;
}
function it(t, e, n, r) {
  if (t) {
    const o = We(t, e, n, r);
    return t[0](o);
  }
}
function We(t, e, n, r) {
  return t[1] && r ? st(n.ctx.slice(), t[1](r(e))) : n.ctx;
}
function ct(t, e, n, r) {
  if (t[2] && r) {
    const o = t[2](r(n));
    if (e.dirty === void 0)
      return o;
    if (typeof o == "object") {
      const s = [], c = Math.max(e.dirty.length, o.length);
      for (let f = 0; f < c; f += 1)
        s[f] = e.dirty[f] | o[f];
      return s;
    }
    return e.dirty | o;
  }
  return e.dirty;
}
function ft(t, e, n, r, o, s) {
  if (o) {
    const c = We(e, n, r, s);
    t.p(c, o);
  }
}
function at(t) {
  if (t.ctx.length > 32) {
    const e = [], n = t.ctx.length / 32;
    for (let r = 0; r < n; r++)
      e[r] = -1;
    return e;
  }
  return -1;
}
function R(t) {
  return t == null ? "" : t;
}
function j(t) {
  return t && Ve(t.destroy) ? t.destroy : O;
}
function v(t, e) {
  t.appendChild(e);
}
function ut(t, e, n) {
  const r = dt(t);
  if (!r.getElementById(e)) {
    const o = M("style");
    o.id = e, o.textContent = n, mt(r, o);
  }
}
function dt(t) {
  if (!t)
    return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && e.host ? e : t.ownerDocument;
}
function mt(t, e) {
  v(t.head || t, e);
}
function T(t, e, n) {
  t.insertBefore(e, n || null);
}
function L(t) {
  t.parentNode.removeChild(t);
}
function M(t) {
  return document.createElement(t);
}
function P(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function Xe(t) {
  return document.createTextNode(t);
}
function U() {
  return Xe(" ");
}
function ht() {
  return Xe("");
}
function pt(t, e, n, r) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
}
function l(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function gt(t) {
  return Array.from(t.childNodes);
}
function je(t, e, n, r) {
  n === null ? t.style.removeProperty(e) : t.style.setProperty(e, n, r ? "important" : "");
}
let Ae;
function fe(t) {
  Ae = t;
}
function oe(t, e) {
  const n = t.$$.callbacks[e.type];
  n && n.slice().forEach((r) => r.call(this, e));
}
const ce = [], be = [], ge = [], Oe = [], vt = Promise.resolve();
let ye = !1;
function wt() {
  ye || (ye = !0, vt.then(Ye));
}
function ke(t) {
  ge.push(t);
}
const ze = /* @__PURE__ */ new Set();
let pe = 0;
function Ye() {
  const t = Ae;
  do {
    for (; pe < ce.length; ) {
      const e = ce[pe];
      pe++, fe(e), _t(e.$$);
    }
    for (fe(null), ce.length = 0, pe = 0; be.length; )
      be.pop()();
    for (let e = 0; e < ge.length; e += 1) {
      const n = ge[e];
      ze.has(n) || (ze.add(n), n());
    }
    ge.length = 0;
  } while (ce.length);
  for (; Oe.length; )
    Oe.pop()();
  ye = !1, ze.clear(), fe(t);
}
function _t(t) {
  if (t.fragment !== null) {
    t.update(), re(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(ke);
  }
}
const ve = /* @__PURE__ */ new Set();
let ne;
function Ee() {
  ne = {
    r: 0,
    c: [],
    p: ne
  };
}
function Le() {
  ne.r || re(ne.c), ne = ne.p;
}
function p(t, e) {
  t && t.i && (ve.delete(t), t.i(e));
}
function w(t, e, n, r) {
  if (t && t.o) {
    if (ve.has(t))
      return;
    ve.add(t), ne.c.push(() => {
      ve.delete(t), r && (n && t.d(1), r());
    }), t.o(e);
  } else
    r && r();
}
function H(t) {
  t && t.c();
}
function k(t, e, n, r) {
  const { fragment: o, on_mount: s, on_destroy: c, after_update: f } = t.$$;
  o && o.m(e, n), r || ke(() => {
    const d = s.map(Fe).filter(Ve);
    c ? c.push(...d) : re(d), t.$$.on_mount = [];
  }), f.forEach(ke);
}
function E(t, e) {
  const n = t.$$;
  n.fragment !== null && (re(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function $t(t, e) {
  t.$$.dirty[0] === -1 && (ce.push(t), wt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function X(t, e, n, r, o, s, c, f = [-1]) {
  const d = Ae;
  fe(t);
  const a = t.$$ = {
    fragment: null,
    ctx: null,
    props: s,
    update: O,
    not_equal: o,
    bound: Ne(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (d ? d.$$.context : [])),
    callbacks: Ne(),
    dirty: f,
    skip_bound: !1,
    root: e.target || d.$$.root
  };
  c && c(a.root);
  let _ = !1;
  if (a.ctx = n ? n(t, e.props || {}, (h, $, ...g) => {
    const A = g.length ? g[0] : $;
    return a.ctx && o(a.ctx[h], a.ctx[h] = A) && (!a.skip_bound && a.bound[h] && a.bound[h](A), _ && $t(t, h)), $;
  }) : [], a.update(), _ = !0, re(a.before_update), a.fragment = r ? r(a.ctx) : !1, e.target) {
    if (e.hydrate) {
      const h = gt(e.target);
      a.fragment && a.fragment.l(h), h.forEach(L);
    } else
      a.fragment && a.fragment.c();
    e.intro && p(t.$$.fragment), k(t, e.target, e.anchor, e.customElement), Ye();
  }
  fe(d);
}
class Y {
  $destroy() {
    E(this, 1), this.$destroy = O;
  }
  $on(e, n) {
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(n), () => {
      const o = r.indexOf(n);
      o !== -1 && r.splice(o, 1);
    };
  }
  $set(e) {
    this.$$set && !lt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
function zt(t) {
  let e, n, r, o, s, c;
  const f = t[2].default, d = it(f, t, t[1], null);
  return {
    c() {
      e = M("span"), n = P("svg"), d && d.c(), l(n, "viewBox", "0 0 24 24"), l(n, "focusable", "false"), l(n, "width", "1em"), l(n, "height", "1em"), l(n, "fill", "currentColor"), l(n, "aria-hidden", "true"), l(e, "class", r = "h-preview-icon " + (t[0] ? "h-preview-icon-" + t[0] : ""));
    },
    m(a, _) {
      T(a, e, _), v(e, n), d && d.m(n, null), o = !0, s || (c = pt(e, "click", t[3]), s = !0);
    },
    p(a, [_]) {
      d && d.p && (!o || _ & 2) && ft(d, f, a, a[1], o ? ct(f, a[1], _, null) : at(a[1]), null), (!o || _ & 1 && r !== (r = "h-preview-icon " + (a[0] ? "h-preview-icon-" + a[0] : ""))) && l(e, "class", r);
    },
    i(a) {
      o || (p(d, a), o = !0);
    },
    o(a) {
      w(d, a), o = !1;
    },
    d(a) {
      a && L(e), d && d.d(a), s = !1, c();
    }
  };
}
function bt(t, e, n) {
  let { $$slots: r = {}, $$scope: o } = e, { name: s } = e;
  function c(f) {
    oe.call(this, t, f);
  }
  return t.$$set = (f) => {
    "name" in f && n(0, s = f.name), "$$scope" in f && n(1, o = f.$$scope);
  }, [s, o, r, c];
}
class Q extends Y {
  constructor(e) {
    super(), X(this, e, bt, zt, W, { name: 0 });
  }
}
function yt(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M13.414 6l1.829 1.828-1.415 1.415L9.586 5 13.828.757l1.415 1.415L13.414 4H16a5 5 0 0 1 5 5v4h-2V9a3 3 0 0 0-3-3h-2.586zM15 11v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zm-2 1H5v8h8v-8z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function kt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "rotate-left",
      $$slots: { default: [yt] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Et(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class Lt extends Y {
  constructor(e) {
    super(), X(this, e, Et, kt, W, {});
  }
}
function At(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M10.586 4L8.757 2.172 10.172.757 14.414 5l-4.242 4.243-1.415-1.415L10.586 6H8a3 3 0 0 0-3 3v4H3V9a5 5 0 0 1 5-5h2.586zM9 11a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V11zm2 1v8h8v-8h-8z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function Mt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "rotate-right",
      $$slots: { default: [At] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Ht(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class Tt extends Y {
  constructor(e) {
    super(), X(this, e, Ht, Mt, W, {});
  }
}
function Ct(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15zM7 10h8v2H7v-2z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function St(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "zoom-out",
      $$slots: { default: [Ct] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Pt(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class Nt extends Y {
  constructor(e) {
    super(), X(this, e, Pt, St, W, {});
  }
}
function Rt(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15zM10 10V7h2v3h3v2h-3v3h-2v-3H7v-2h3z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function jt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "zoom-in",
      $$slots: { default: [Rt] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Ot(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class It extends Y {
  constructor(e) {
    super(), X(this, e, Ot, jt, W, {});
  }
}
function qt(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function xt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "close",
      $$slots: { default: [qt] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Dt(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class Bt extends Y {
  constructor(e) {
    super(), X(this, e, Dt, xt, W, {});
  }
}
function Ft(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function Vt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "arrow-left",
      $$slots: { default: [Ft] },
      $$scope: { ctx: t }
    }
  }), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 1 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
class Wt extends Y {
  constructor(e) {
    super(), X(this, e, null, Vt, W, {});
  }
}
function Xt(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function Yt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "arrow-right",
      $$slots: { default: [Xt] },
      $$scope: { ctx: t }
    }
  }), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 1 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
class Zt extends Y {
  constructor(e) {
    super(), X(this, e, null, Yt, W, {});
  }
}
function Kt(t) {
  let e;
  return {
    c() {
      e = P("path"), l(e, "d", "M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795z");
    },
    m(n, r) {
      T(n, e, r);
    },
    p: O,
    d(n) {
      n && L(e);
    }
  };
}
function Gt(t) {
  let e, n;
  return e = new Q({
    props: {
      name: "reset",
      $$slots: { default: [Kt] },
      $$scope: { ctx: t }
    }
  }), e.$on("click", t[0]), {
    c() {
      H(e.$$.fragment);
    },
    m(r, o) {
      k(e, r, o), n = !0;
    },
    p(r, [o]) {
      const s = {};
      o & 2 && (s.$$scope = { dirty: o, ctx: r }), e.$set(s);
    },
    i(r) {
      n || (p(e.$$.fragment, r), n = !0);
    },
    o(r) {
      w(e.$$.fragment, r), n = !1;
    },
    d(r) {
      E(e, r);
    }
  };
}
function Ut(t) {
  function e(n) {
    oe.call(this, t, n);
  }
  return [e];
}
class Jt extends Y {
  constructor(e) {
    super(), X(this, e, Ut, Gt, W, {});
  }
}
function Qt(t) {
  let e, n, r, o, s, c, f;
  return {
    c() {
      e = P("svg"), n = P("path"), r = P("animateTransform"), o = P("path"), s = P("animateTransform"), c = P("path"), f = P("animateTransform"), l(r, "attributeName", "transform"), l(r, "attributeType", "XML"), l(r, "type", "rotate"), l(r, "dur", "2s"), l(r, "from", "0 50 50"), l(r, "to", "360 50 50"), l(r, "repeatCount", "indefinite"), l(n, "d", `M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3\r
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z`), l(s, "attributeName", "transform"), l(s, "attributeType", "XML"), l(s, "type", "rotate"), l(s, "dur", "1s"), l(s, "from", "0 50 50"), l(s, "to", "-360 50 50"), l(s, "repeatCount", "indefinite"), l(o, "d", `M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7\r
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z`), l(f, "attributeName", "transform"), l(f, "attributeType", "XML"), l(f, "type", "rotate"), l(f, "dur", "2s"), l(f, "from", "0 50 50"), l(f, "to", "360 50 50"), l(f, "repeatCount", "indefinite"), l(c, "d", `M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5\r
  L82,35.7z`), l(e, "viewBox", "0 0 100 100"), l(e, "focusable", "false"), l(e, "width", "1em"), l(e, "height", "1em"), l(e, "fill", "currentColor"), l(e, "aria-hidden", "true");
    },
    m(d, a) {
      T(d, e, a), v(e, n), v(n, r), v(e, o), v(o, s), v(e, c), v(c, f);
    },
    p: O,
    i: O,
    o: O,
    d(d) {
      d && L(e);
    }
  };
}
class en extends Y {
  constructor(e) {
    super(), X(this, e, null, Qt, W, {});
  }
}
const tn = window.requestAnimationFrame, nn = window.cancelAnimationFrame, rn = function(t, e, ...n) {
  typeof t == "function" && t.call(e, ...n);
}, Ze = function(t, e) {
  let n, r = !1, o = Date.now();
  const s = () => {
    r = !0, n && nn(n);
  }, c = () => {
    if (!r) {
      if (Date.now() - o >= e) {
        s(), rn(t, this, n);
        return;
      }
      n = tn(c);
    }
  };
  return c(), s;
}, on = function(t, e = 16) {
  let n;
  const r = function() {
    const o = this, s = arguments;
    n && n(), n = Ze(() => t.apply(o, s), e);
  };
  return r.cancel = function() {
    n && n(), n = null;
  }, r;
};
function sn(t) {
  ut(t, "svelte-zdtwro", '.h-preview-root.svelte-zdtwro .svelte-zdtwro{box-sizing:border-box}.h-preview-root.svelte-zdtwro.svelte-zdtwro{background-color:#00000073}.h-preview-icon{display:flex;justify-content:center;align-items:center}.h-preview-root.svelte-zdtwro.svelte-zdtwro,.h-loading.svelte-zdtwro.svelte-zdtwro,.h-preview.svelte-zdtwro.svelte-zdtwro{position:fixed;inset:0;z-index:1000;height:100vh;width:100%;top:0;overflow:hidden;inset:0;outline:0;-webkit-overflow-scrolling:touch}.h-preview-actions.svelte-zdtwro.svelte-zdtwro{display:flex;justify-content:flex-end;align-items:center;width:100%;color:#ffffffa6;list-style:none;background:rgba(0, 0, 0, 0.4);pointer-events:auto;font-size:1.125rem;font-variant:tabular-nums;line-height:1.5715;font-feature-settings:"tnum";position:absolute;top:0;left:0;z-index:1003}.h-preview-actions.svelte-zdtwro>div.svelte-zdtwro{padding:0.75rem;cursor:pointer}.h-preview-prev.h-disabled.svelte-zdtwro.svelte-zdtwro,.h-preview-next.h-disabled.svelte-zdtwro.svelte-zdtwro,.h-preview-actions.svelte-zdtwro>div.h-disabled.svelte-zdtwro{color:#ffffff40}.h-preview-actions.svelte-zdtwro>div.h-disabled.svelte-zdtwro{pointer-events:none}.h-preview-prev.h-disabled.svelte-zdtwro.svelte-zdtwro,.h-preview-next.h-disabled.svelte-zdtwro.svelte-zdtwro{cursor:not-allowed}.h-preview-actions.svelte-zdtwro>div.svelte-zdtwro:not(.h-disabled):hover{color:rgb(255 255 255)}.h-preview-image.svelte-zdtwro.svelte-zdtwro{user-select:none;text-align:center;position:absolute;inset:0;height:100vh;transition:transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);display:flex;justify-content:center;align-items:center}.h-preview-image.svelte-zdtwro>img.svelte-zdtwro{position:relative;max-width:100%;max-height:100%;vertical-align:middle;transform:scale(1);cursor:grab;transition:transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);user-select:none;pointer-events:auto}.h-preview-prev.svelte-zdtwro.svelte-zdtwro,.h-preview-next.svelte-zdtwro.svelte-zdtwro{position:absolute;top:48%;right:0.625rem;z-index:1;display:flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;color:#ffffffd9;background:rgba(0, 0, 0, 0.1);border-radius:50%;cursor:pointer;pointer-events:auto;transition:background 0.3s, color 0.3s;font-size:1.5rem}.h-preview-prev.svelte-zdtwro.svelte-zdtwro{right:unset;left:0.625rem}.h-preview-prev.svelte-zdtwro.svelte-zdtwro:not(.h-disabled):hover,.h-preview-next.svelte-zdtwro.svelte-zdtwro:not(.h-disabled):hover{background:rgba(0, 0, 0, 0.3);color:#fff}.h-loading.svelte-zdtwro.svelte-zdtwro{z-index:1002;font-size:3rem;color:#fff}.h-loading.svelte-zdtwro>span.svelte-zdtwro{position:absolute;top:50%;left:50%;transform:translate(-50%, -100%)}');
}
function Ie(t) {
  let e, n, r, o, s, c, f, d, a, _, h, $, g, A, x, I, y, V, D, N, Z, J, ee, B, K, se, G, ae, te, F, ie, ue;
  s = new Jt({}), a = new Lt({}), g = new Tt({}), y = new Nt({}), Z = new It({}), K = new Bt({});
  let C = t[2] && qe(t), z = t[6] > 1 && xe(t), b = t[0] && De(t);
  return {
    c() {
      e = M("div"), n = M("div"), r = M("div"), o = M("div"), H(s.$$.fragment), f = U(), d = M("div"), H(a.$$.fragment), h = U(), $ = M("div"), H(g.$$.fragment), x = U(), I = M("div"), H(y.$$.fragment), D = U(), N = M("div"), H(Z.$$.fragment), ee = U(), B = M("div"), H(K.$$.fragment), se = U(), G = M("div"), C && C.c(), ae = U(), z && z.c(), te = U(), b && b.c(), l(o, "class", c = R(t[0] ? "h-disabled" : "") + " svelte-zdtwro"), l(d, "class", _ = R(t[0] ? "h-disabled" : "") + " svelte-zdtwro"), l($, "class", A = R(t[0] ? "h-disabled" : "") + " svelte-zdtwro"), l(I, "class", V = R(t[0] || t[3] <= 1 ? "h-disabled" : "") + " svelte-zdtwro"), l(N, "class", J = R(t[0] ? "h-disabled" : "") + " svelte-zdtwro"), l(B, "class", "svelte-zdtwro"), l(r, "class", "h-preview-actions svelte-zdtwro"), l(G, "class", "h-preview-image svelte-zdtwro"), l(n, "class", "h-preview svelte-zdtwro"), l(e, "class", "h-preview-root svelte-zdtwro");
    },
    m(m, q) {
      T(m, e, q), v(e, n), v(n, r), v(r, o), k(s, o, null), v(r, f), v(r, d), k(a, d, null), v(r, h), v(r, $), k(g, $, null), v(r, x), v(r, I), k(y, I, null), v(r, D), v(r, N), k(Z, N, null), v(r, ee), v(r, B), k(K, B, null), v(n, se), v(n, G), C && C.m(G, null), v(n, ae), z && z.m(n, null), v(n, te), b && b.m(n, null), F = !0, ie || (ue = [
        j(t[20].call(null, o, t[10])),
        j(t[20].call(null, d, t[13])),
        j(t[20].call(null, $, t[14])),
        j(t[20].call(null, I, t[11])),
        j(t[20].call(null, N, t[12])),
        j(t[18].call(null, B)),
        j(t[19].call(null, r)),
        j(t[22].call(null, G)),
        j(t[18].call(null, n))
      ], ie = !0);
    },
    p(m, q) {
      (!F || q[0] & 1 && c !== (c = R(m[0] ? "h-disabled" : "") + " svelte-zdtwro")) && l(o, "class", c), (!F || q[0] & 1 && _ !== (_ = R(m[0] ? "h-disabled" : "") + " svelte-zdtwro")) && l(d, "class", _), (!F || q[0] & 1 && A !== (A = R(m[0] ? "h-disabled" : "") + " svelte-zdtwro")) && l($, "class", A), (!F || q[0] & 9 && V !== (V = R(m[0] || m[3] <= 1 ? "h-disabled" : "") + " svelte-zdtwro")) && l(I, "class", V), (!F || q[0] & 1 && J !== (J = R(m[0] ? "h-disabled" : "") + " svelte-zdtwro")) && l(N, "class", J), m[2] ? C ? C.p(m, q) : (C = qe(m), C.c(), C.m(G, null)) : C && (C.d(1), C = null), m[6] > 1 ? z ? (z.p(m, q), q[0] & 64 && p(z, 1)) : (z = xe(m), z.c(), p(z, 1), z.m(n, te)) : z && (Ee(), w(z, 1, 1, () => {
        z = null;
      }), Le()), m[0] ? b ? q[0] & 1 && p(b, 1) : (b = De(m), b.c(), p(b, 1), b.m(n, null)) : b && (Ee(), w(b, 1, 1, () => {
        b = null;
      }), Le());
    },
    i(m) {
      F || (p(s.$$.fragment, m), p(a.$$.fragment, m), p(g.$$.fragment, m), p(y.$$.fragment, m), p(Z.$$.fragment, m), p(K.$$.fragment, m), p(z), p(b), F = !0);
    },
    o(m) {
      w(s.$$.fragment, m), w(a.$$.fragment, m), w(g.$$.fragment, m), w(y.$$.fragment, m), w(Z.$$.fragment, m), w(K.$$.fragment, m), w(z), w(b), F = !1;
    },
    d(m) {
      m && L(e), E(s), E(a), E(g), E(y), E(Z), E(K), C && C.d(), z && z.d(), b && b.d(), ie = !1, re(ue);
    }
  };
}
function qe(t) {
  let e, n, r, o, s;
  return {
    c() {
      e = M("img"), Re(e.src, n = t[2].src) || l(e, "src", n), l(e, "alt", r = t[2].alt), l(e, "draggable", "false"), je(e, "transform", "translate3d(" + t[7] + "px, " + t[8] + "px, 0px) scale3d(" + t[3] + ", " + t[3] + ", 1) rotate(" + t[4] + "deg)"), l(e, "class", "svelte-zdtwro");
    },
    m(c, f) {
      T(c, e, f), t[25](e), o || (s = j(t[21].call(null, e)), o = !0);
    },
    p(c, f) {
      f[0] & 4 && !Re(e.src, n = c[2].src) && l(e, "src", n), f[0] & 4 && r !== (r = c[2].alt) && l(e, "alt", r), f[0] & 408 && je(e, "transform", "translate3d(" + c[7] + "px, " + c[8] + "px, 0px) scale3d(" + c[3] + ", " + c[3] + ", 1) rotate(" + c[4] + "deg)");
    },
    d(c) {
      c && L(e), t[25](null), o = !1, s();
    }
  };
}
function xe(t) {
  let e, n, r, o, s, c, f, d, a, _;
  return n = new Wt({}), c = new Zt({}), {
    c() {
      e = M("div"), H(n.$$.fragment), o = U(), s = M("div"), H(c.$$.fragment), l(e, "class", r = R("h-preview-prev" + (t[5] <= 0 ? " h-disabled" : "")) + " svelte-zdtwro"), l(s, "class", f = R("h-preview-next" + (t[5] >= t[6] - 1 ? " h-disabled" : "")) + " svelte-zdtwro");
    },
    m(h, $) {
      T(h, e, $), k(n, e, null), T(h, o, $), T(h, s, $), k(c, s, null), d = !0, a || (_ = [
        j(t[19].call(null, e, t[15])),
        j(t[19].call(null, s, t[16]))
      ], a = !0);
    },
    p(h, $) {
      (!d || $[0] & 32 && r !== (r = R("h-preview-prev" + (h[5] <= 0 ? " h-disabled" : "")) + " svelte-zdtwro")) && l(e, "class", r), (!d || $[0] & 96 && f !== (f = R("h-preview-next" + (h[5] >= h[6] - 1 ? " h-disabled" : "")) + " svelte-zdtwro")) && l(s, "class", f);
    },
    i(h) {
      d || (p(n.$$.fragment, h), p(c.$$.fragment, h), d = !0);
    },
    o(h) {
      w(n.$$.fragment, h), w(c.$$.fragment, h), d = !1;
    },
    d(h) {
      h && L(e), E(n), h && L(o), h && L(s), E(c), a = !1, re(_);
    }
  };
}
function De(t) {
  let e, n, r, o, s, c;
  return r = new en({}), {
    c() {
      e = M("div"), n = M("span"), H(r.$$.fragment), l(n, "class", "svelte-zdtwro"), l(e, "class", "h-loading svelte-zdtwro");
    },
    m(f, d) {
      T(f, e, d), v(e, n), k(r, n, null), o = !0, s || (c = j(t[19].call(null, e)), s = !0);
    },
    i(f) {
      o || (p(r.$$.fragment, f), o = !0);
    },
    o(f) {
      w(r.$$.fragment, f), o = !1;
    },
    d(f) {
      f && L(e), E(r), s = !1, c();
    }
  };
}
function ln(t) {
  let e, n, r, o, s = t[1] && Ie(t);
  return {
    c() {
      s && s.c(), e = ht();
    },
    m(c, f) {
      s && s.m(c, f), T(c, e, f), n = !0, r || (o = j(t[17].call(null, window)), r = !0);
    },
    p(c, f) {
      c[1] ? s ? (s.p(c, f), f[0] & 2 && p(s, 1)) : (s = Ie(c), s.c(), p(s, 1), s.m(e.parentNode, e)) : s && (Ee(), w(s, 1, 1, () => {
        s = null;
      }), Le());
    },
    i(c) {
      n || (p(s), n = !0);
    },
    o(c) {
      w(s), n = !1;
    },
    d(c) {
      s && s.d(c), c && L(e), r = !1, o();
    }
  };
}
let Be = 200;
function cn(t, e, n) {
  let { selector: r = null } = e;
  const o = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent), s = o ? "touchstart" : "keydown", c = o ? "touchend" : "mouseup", f = o ? "touchstart" : "mousedown", d = o ? "touchmove" : "mousemove", a = o ? "touchstart" : "click";
  let _ = {}, h = !1, $ = !1, g = null, A = null, x = 1, I = 0, y = -1, V = 0, D = 0, N = 0, Z = 0, J = 0, ee = !1, B = null, K, se = 0;
  const G = (i) => {
    let u = null;
    return i instanceof TouchEvent ? u = i.changedTouches[0] : u = i, { x: u.pageX, y: u.pageY };
  }, ae = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }), te = function(i) {
    const u = i.getAttribute("data-preview");
    if (u)
      if (_[u])
        n(2, A = _[u]);
      else {
        const S = new Image();
        S.src = u, S.alt = i.alt, n(0, h = !0), i.src && n(2, A = i), S.onload = function() {
          n(0, h = !1), n(2, A = S), _[u] = S;
        }, S.onerror = function() {
          n(0, h = !1), i.src && n(2, A = i);
        };
      }
    else
      i.src && n(2, A = i);
  }, F = on(function(i) {
    document.documentElement.style.overflowY = "hidden";
    const u = i.target;
    te(u), n(5, y = g.indexOf(A)), n(1, $ = !0);
  }, 150), ie = function(i) {
    if (!(o || !A) && !(i instanceof TouchEvent))
      switch (i.key) {
        case "ArrowRight":
          Te();
          break;
        case "ArrowLeft":
          He();
          break;
        case "+":
          $e();
          break;
        case "-":
          _e();
          break;
      }
  }, ue = function() {
    document.documentElement.style.overflowY = "", n(2, A = null), n(1, $ = !1), n(9, B = null), Me();
  }, C = function(i) {
    i.deltaY < 0 ? $e() : _e();
  }, z = function(i) {
    let u = null;
    return i instanceof TouchEvent ? u = i.changedTouches[0] : u = i, u && u.target.tagName && u.target.tagName.toUpperCase() === "IMG";
  }, b = function(i, u, S) {
    const de = u - S, me = de / 2;
    return i < 0 && i <= -de ? -me : i > 0 ? me : !1;
  }, m = function() {
    ee = !1;
    const i = () => {
      if (B) {
        let { width: u, height: S, left: de, top: me } = B.getBoundingClientRect();
        const { height: Se, width: Pe } = ae();
        if (u < Pe)
          n(7, D = 0);
        else {
          const le = b(de, u, Pe);
          le !== !1 && le !== D && n(7, D = le);
        }
        if (S < Se)
          n(8, N = 0);
        else {
          const le = b(me, S, Se);
          le !== !1 && n(8, N = le);
        }
      }
    };
    K && K(), Date.now() - se >= Be ? i() : K = Ze(i, Be), se = 0;
  }, q = function(i) {
    if (z(i)) {
      const u = G(i);
      Z = u.x - D, J = u.y - N, ee = !0;
    }
  }, Ge = function(i) {
    if (ee) {
      const u = G(i);
      n(7, D = u.x - Z), n(8, N = u.y - J), se = Date.now();
    }
  }, Me = function() {
    n(3, x = 1), n(4, I = 0), n(7, D = 0), n(8, N = 0), Z = 0, J = 0, ee = !1;
  }, _e = function() {
    x > 1 && (n(3, x = x - 1), n(7, D = D * (1 - 1 / x)), n(8, N = N * (1 - 1 / x)));
  }, $e = function() {
    n(3, x = x + 1);
  }, Ue = function() {
    n(4, I = I - 90);
  }, Je = function() {
    n(4, I = I + 90);
  }, He = function() {
    y > 0 && (n(5, y = y - 1), g[y] && te(g[y]));
  }, Te = function() {
    y < V - 1 && (n(5, y = y + 1), g[y] && te(g[y]));
  }, Qe = (i) => {
    i.addEventListener(c, function(u) {
      m();
    }), o || i.addEventListener(s, function(u) {
      ie(u);
    });
  }, et = (i) => {
    i.addEventListener(a, function(u) {
      ue();
    });
  }, Ce = (i, u) => {
    i.addEventListener(a, function(S) {
      S.stopPropagation(), typeof u == "function" && u();
    });
  }, tt = (i, u) => {
    i.addEventListener(a, function(S) {
      S.preventDefault(), S.stopPropagation(), u();
    });
  }, nt = (i) => {
    o || i.addEventListener("wheel", function(u) {
      C(u);
    }, { passive: !1 }), Ce(i), i.addEventListener(f, function(u) {
      q(u);
    }), o && i.addEventListener("touchend", function(u) {
      m();
    });
  }, rt = (i) => {
    i.addEventListener(d, function(u) {
      Ge(u);
    });
  };
  function ot(i) {
    be[i ? "unshift" : "push"](() => {
      B = i, n(9, B);
    });
  }
  return t.$$set = (i) => {
    "selector" in i && n(23, r = i.selector);
  }, t.$$.update = () => {
    if (t.$$.dirty[0] & 25165824) {
      if (_ = {}, n(6, V = 0), r || n(23, r = Array.from(document.querySelectorAll("img") || [])), Array.isArray(r)) {
        const i = r.filter((u) => u instanceof HTMLElement);
        i && i.length && (n(24, g = i), n(6, V = g.length));
      } else
        r instanceof HTMLElement ? (n(24, g = [r]), n(6, V = 1)) : typeof r == "string" && (n(24, g = Array.from(document.querySelectorAll(r))), g && g.length > 0 && n(6, V = g.length));
      g && g.length > 0 && g.forEach((i) => {
        i.addEventListener(a, F), o && i.addEventListener("touchmove", function() {
          F.cancel();
        });
      });
    }
  }, [
    h,
    $,
    A,
    x,
    I,
    y,
    V,
    D,
    N,
    B,
    Me,
    _e,
    $e,
    Ue,
    Je,
    He,
    Te,
    Qe,
    et,
    Ce,
    tt,
    nt,
    rt,
    r,
    g,
    ot
  ];
}
class fn extends Y {
  constructor(e) {
    super(), X(this, e, cn, ln, W, { selector: 23 }, sn, [-1, -1]);
  }
}
class an {
  constructor(e, n) {
    new fn({
      target: n instanceof HTMLElement ? n : document.body,
      props: {
        selector: e
      }
    });
  }
}
const we = [];
function Ke(t) {
  if (t && t.length)
    for (let e of t)
      we.indexOf(e) == -1 && we.push(e);
}
Ke(document.querySelectorAll("[data-humming] img"));
Ke(document.querySelectorAll("[data-humming-img]"));
we.length && new an(we);
export {
  an as default
};
