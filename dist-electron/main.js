!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=67)}({67:function(e,n,t){"use strict";var o=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(r,i){function c(e){try{a(o.next(e))}catch(e){i(e)}}function u(e){try{a(o.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(c,u)}a((o=o.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const r=t(70),i=t(71),c=t(68);let u;process.argv.slice(1).some(e=>"--serve"===e);function a(){u=new r.BrowserWindow({width:800,height:600,webPreferences:{nodeIntegration:!0,worldSafeExecuteJavaScript:!0}}),u.loadURL(i.format({pathname:c.join(__dirname,"/dist/index.html"),protocol:"file:",slashes:!0})),u.webContents.openDevTools(),u.on("closed",()=>{u=null})}r.app.on("ready",a),r.app.on("window-all-closed",()=>{"darwin"!==process.platform&&r.app.quit()}),r.app.on("activate",()=>{null===u&&a()}),n.on=function(e,n,t){return r.ipcMain.on(e,(r,i)=>o(this,void 0,void 0,(function*(){if(i.command!==n)return;const o=`${e}_response`;try{yield t(i),r.reply(e,{command:o,success:!0})}catch(n){r.reply(e,{command:o,success:!1,e:n})}})))},n.send=function(e,n,t){const o={command:n,payload:t};u.webContents.send(e,o)}},68:function(e,n){e.exports=require("path")},70:function(e,n){e.exports=require("electron")},71:function(e,n){e.exports=require("url")}});