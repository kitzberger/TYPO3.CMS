!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),"cjs"):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],(function(o){e(o,"amd")})):e(CodeMirror,"plain")}((function(e,o){e.modeURL||(e.modeURL="../mode/%N/%N.js");var r={};function n(o,r,n){var t=e.modes[o],i=t&&t.dependencies;if(!i)return r();for(var d=[],a=0;a<i.length;++a)e.modes.hasOwnProperty(i[a])||d.push(i[a]);if(!d.length)return r();var f=function(e,o){var r=o;return function(){0==--r&&e()}}(r,d.length);for(a=0;a<d.length;++a)e.requireMode(d[a],f,n)}e.requireMode=function(t,i,d){if("string"!=typeof t&&(t=t.name),e.modes.hasOwnProperty(t))return n(t,i,d);if(r.hasOwnProperty(t))return r[t].push(i);var a=d&&d.path?d.path(t):e.modeURL.replace(/%N/g,t);if(d&&d.loadMode)d.loadMode(a,(function(){n(t,i,d)}));else if("plain"==o){var f=document.createElement("script");f.src=a;var u=document.getElementsByTagName("script")[0],c=r[t]=[i];e.on(f,"load",(function(){n(t,(function(){for(var e=0;e<c.length;++e)c[e]()}),d)})),u.parentNode.insertBefore(f,u)}else"cjs"==o?(require(a),i()):"amd"==o&&requirejs([a],i)},e.autoLoadMode=function(o,r,n){e.modes.hasOwnProperty(r)||e.requireMode(r,(function(){o.setOption("mode",o.getOption("mode"))}),n)}}));