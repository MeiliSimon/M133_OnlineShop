// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      const e = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(e)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
      return v;
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("common/types", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("frontend/page1", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    async function loadOverview() {
        const response = await fetch("/api/persons");
        const persons = await response.json();
        const list = document.querySelector("ul");
        for (const person of persons) {
            list.innerHTML += `
            <li>
                <a href="./page2.html?personId=${person.id}">${person.firstName} ${person.lastName}</a>
            </li>
        `;
        }
    }
    exports_2("loadOverview", loadOverview);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("frontend/page2", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    async function loadDetail() {
        const personId = new URLSearchParams(window.location.search).get("personId");
        const response = await fetch(`/api/persons/${personId}`);
        const person = await response.json();
        document.querySelector("h1").innerText = `${person.firstName} ${person.lastName}`;
        document.querySelector("span").innerText = person.id;
    }
    exports_3("loadDetail", loadDetail);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("frontend/app", ["frontend/page1", "frontend/page2"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (page1_ts_1_1) {
                exports_4({
                    "loadOverview": page1_ts_1_1["loadOverview"]
                });
            },
            function (page2_ts_1_1) {
                exports_4({
                    "loadDetail": page2_ts_1_1["loadDetail"]
                });
            }
        ],
        execute: function () {
        }
    };
});

const __exp = __instantiate("frontend/app", false);
export const loadOverview = __exp["loadOverview"];
export const loadDetail = __exp["loadDetail"];
