import { repositoryName } from "./slicemachine.config.json";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/prismic", "@nuxt/image", "@nuxtjs/color-mode"],
  build: {
    transpile: ["vue-vimeo-player"],
  },
  nitro: {
    preset: "static",
    output: {
      dir: ".netlify/functions-internal",
      publicDir: "dist",
    },
  },
  prismic: {
    endpoint: repositoryName,
    clientConfig: {
      routes: [
        {
          type: "home",
          path: "/",
        },
        {
          type: "about",
          path: "/about",
        },
        {
          type: "work",
          path: "/work",
        },
        {
          type: "case_study",
          path: "/work/:uid",
        },
        {
          type: "news_landing",
          path: "/news",
        },
        {
          type: "contact",
          path: "/contact",
        },
        {
          type: "archive",
          path: "/archive",
        },
      ],
    },
  },
  colorMode: {
    preference: "dark", // Set default theme to dark
    classSuffix: "",
  },
  app: {
    pageTransition: false,
    head: {
      htmlAttrs: {
        lang: "en-CA",
      },
      title: "Choir",
      meta: [
        { charset: "utf-8" },
        {
          name: "description",
          content: "Content here",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          key: "og:title",
          property: "og:title",
          content: "Choir",
        },
        {
          key: "og:description",
          property: "og:description",
          content: "Content here.",
        },
        {
          key: "og:image",
          property: "og:image",
          content: "",
        },
        {
          key: "og:image:secure_url",
          property: "og:image:secure_url",
          content: "",
        },
        {
          key: "og:image:alt",
          property: "og:image:alt",
          content: "Choir",
        },
        {
          key: "og:type",
          property: "og:type",
          content: "website",
        },

        {
          key: "twitter:title",
          name: "twitter:title",
          content: "Choir",
        },
        {
          key: "twitter:description",
          name: "twitter:description",
          content: "Content here",
        },
        {
          key: "twitter:image",
          name: "twitter:image",
          content: "",
        },
        {
          key: "twitter:image:alt",
          name: "twitter:image:alt",
          content: "Choir",
        },
      ],
      link: [
        { rel: "sitemap", href: "/sitemap.xml" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],

      script: [
        {
          innerHTML: `
            /*! modernizr 3.6.0 (Custom Build) | MIT *
            * https://modernizr.com/download/?-eventlistener-touchevents-setclasses !*/
            !function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in d)if(d.hasOwnProperty(l)){if(e=[],n=d[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,d,c="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:c+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+c,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=c,h.fake&&(h.style.background="",h.style.overflow="hidden",d=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=d,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],d=[],c={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){d.push({name:e,fn:n,options:t})},addAsyncTest:function(e){d.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=c,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase(),h=c._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];c._prefixes=h;var m=c.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),Modernizr.addTest("eventlistener","addEventListener"in e),s(),a(f),delete c.addTest,delete c.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);
          `,
          type: "text/javascript",
        },
      ],
    },
  },
  devServer: {
    https: true, // Enable HTTPS for local development
  },
  image: {
    imgix: {
      baseURL: "",
    },
    screens: {
      sm: 812,
      md: 1180,
      lg: 1512,
      xl: 2200,
    },
  },
  css: ["~/assets/scss/reset.scss", "~/assets/scss/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/typography.scss" as *;',
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    server: {
      cors: true, // Only for dev
    },
  },
});
