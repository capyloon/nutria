var n=new Map;function s(t,o="cors"){if(n.has(t))return n.get(t);let i=fetch(t,{mode:o}).then(async e=>({ok:e.ok,status:e.status,html:await e.text()}));return n.set(t,i),i}export{s as a};
