function o(n,t){return new Promise(r=>{function e(i){i.target===n&&(n.removeEventListener(t,e),r())}n.addEventListener(t,e)})}export{o as a};
