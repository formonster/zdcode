import O from"chalk";import{getProjectJsonFile as q}from"@zdcode/utils";import y from"inquirer";async function h(o,r){let{action:e}=await y.prompt([{name:"action",type:"list",message:o,choices:r}]);return e}var x=async o=>{let{action:r}=await y.prompt([{name:"action",type:"input",message:o}]);return r},C=async(o,r)=>{let{action:e}=await y.prompt([{name:"action",type:"confirm",message:o,default:r}]);return e};import k from"fs";import A from"path";import w from"chalk";import{writeFile as S,getProjectFile as d}from"@zdcode/utils";import{humpToChain as P,lowerFirstLetter as R,upperFirstLetter as L}from"@zdcode/utils";var v={F:L,f:R,"-":P},$=(o,r,e)=>o.replace(new RegExp(r.replace("$","\\$").replace("{","\\{").replace("}","\\}").replace("|","\\|"),"g"),e),g=(o,r)=>{let e=o.match(/(\$T\{)([A-Za-z|_|:|-])+(\})/g);return e&&(e=Array.from(new Set(e)),e.map(s=>{let c=s.slice(3).slice(0,-1).split("|");return{content:s,formats:c.slice(0,-1),name:c.slice(-1)[0]}}).forEach(({content:s,formats:c,name:p})=>{let i=r[p];if(!i)return;let t=i;for(let n of c)v[n]&&(t=v[n](t));o=$(o,s,t)})),o};var T=async(o,r,e)=>{for(let a of r){let s=a.root,c=a.name&&g(a.name,e),p=[o,s,c].filter(Boolean).join("/").replace(/\/\//g,"/");if(a.files){await T(p,a.files,e);continue}if(a.type==="replace"){let{replaceFile:i,replaceOptions:t}=a;if(!i||!t)continue;let n=A.join(p,i),l=d(n);for(let u of t){let{target:m,template:f,content:b}=u;if(!m)throw new Error("\u8BF7\u6307\u5B9A\u8981\u66FF\u6362\u5185\u5BB9\u7684\u6587\u4EF6\u8DEF\u5F84\uFF01");if(!f&&!b)throw new Error("\u8BF7\u6307\u5B9A\u8981\u66FF\u6362\u7684\u5185\u5BB9\uFF01");let j=d(`.templates/${f}`),F=g(m,e),E=$(l,`// $T{${F}}`,`// $T{${F}}
${g(j,e)}`);k.writeFileSync(n,E,"utf8")}console.log("\u{1F389}",w.blue("replace"),w.gray(n))}if(a.template){let i=a.template,t=d(`.templates/${i}`),n=g(t,e);await S(A.resolve(process.cwd(),p),n),console.log("\u{1F389}",w.blue("create "),w.gray(p))}}};var z=o=>{o.command("template").description("\u5FEB\u901F\u521B\u5EFA\u6A21\u677F\u6587\u4EF6").action(async()=>{let r=q(".templates/template.json"),e=await h("\u8BF7\u9009\u62E9\u6A21\u677F",r.map(({name:t})=>({name:t,value:t}))),a=r.find(({name:t})=>t===e);if(!a)throw new Error("\u6A21\u677F\u5F02\u5E38\uFF01");let{params:s=[],root:c,templates:p}=a,i={};if(s.length)for(let t of s){if(typeof t=="string"){let n=await x(`\u8BF7\u8F93\u5165 ${t}:`);i[t]=n}if(Array.isArray(t)){let[n,l]=t;if(typeof l=="string"&&l==="boolean"){let m=await C(`${n}?`);i[n]=m}if(Array.isArray(l)){let u=l,m=await h(`\u8BF7\u9009\u62E9 ${n}`,u.map(f=>({name:f,value:f})));i[n]=m}}}console.log(""),console.log("\u{1F433}",O.gray("\u5F00\u59CB\u751F\u6210\u6A21\u677F\u6587\u4EF6")),console.log(""),await T(c,p,i),console.log(""),console.log("\u{1F433}",O.green("success!")),console.log("")})},W=z;export{W as default};
