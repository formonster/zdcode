"use strict";var F=Object.create;var c=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,A=Object.prototype.hasOwnProperty;var R=(t,e)=>{for(var o in e)c(t,o,{get:e[o],enumerable:!0})},w=(t,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of y(e))!A.call(t,r)&&r!==o&&c(t,r,{get:()=>e[r],enumerable:!(n=v(e,r))||n.enumerable});return t};var d=(t,e,o)=>(o=t!=null?F(L(t)):{},w(e||!t||!t.__esModule?c(o,"default",{value:t,enumerable:!0}):o,t)),j=t=>w(c({},"__esModule",{value:!0}),t);var k={};R(k,{default:()=>b});module.exports=j(k);var C=require("@zdcode/utils");var f=d(require("inquirer"));async function h(t,e){let{action:o}=await f.default.prompt([{name:"action",type:"list",message:t,choices:e}]);return o}var x=async t=>{let{action:e}=await f.default.prompt([{name:"action",type:"input",message:t}]);return e};var T=d(require("path")),l=require("@zdcode/utils");function E(t){return t.charAt(0).toUpperCase()+t.slice(1)}function O(t){return t.charAt(0).toLowerCase()+t.slice(1)}var $={F:E,f:O},g=(t,e)=>{let o=t.match(/(\$T\{)([A-Za-z | _])+(\})/g);return o&&(o=Array.from(new Set(o)),o.map(r=>{let i=r.slice(3).slice(0,-1).split("|");return{content:r,formats:i.slice(0,-1),name:i.slice(-1)[0]}}).forEach(({content:r,formats:i,name:s})=>{let a=e[s];for(let p of i)$[p]&&(a=$[p](a));t=t.replace(new RegExp(r.replace("$","\\$").replace("{","\\{").replace("}","\\}").replace("|","\\|"),"g"),a)}),console.log("str",t)),t};var u=(t,e,o)=>{for(let n of e){let r=g(n.name,o);if(n.files){u(`${t}/${r}`,n.files,o);return}if(n.template){let i=n.template,s=(0,l.getProjectFile)(`.templates/${i}`),m=g(s,o);(0,l.writeFile)(T.default.resolve(process.cwd(),`${t}/${r}`),m)}}};var P=t=>{t.command("template").description("\u5FEB\u901F\u521B\u5EFA\u6A21\u677F\u6587\u4EF6").action(async()=>{let e=(0,C.getProjectJsonFile)(".templates/template.json"),o=await h("\u8BF7\u9009\u62E9\u6A21\u677F",e.map(({name:a})=>({name:a,value:a}))),n=e.find(({name:a})=>a===o);if(!n)throw new Error("\u6A21\u677F\u5F02\u5E38\uFF01");let{params:r=[],root:i,templates:s}=n,m={};if(r.length)for(let a of r){let p=await x(`\u8BF7\u8F93\u5165 ${a}:`);m[a]=p}u(i,s,m)})},b=P;0&&(module.exports={});