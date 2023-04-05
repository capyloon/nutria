
function lowering0Callee(level, msg) {
  switch (level) {
    case "info":
      console.info(msg);
      break;
    case "debug":
      console.debug(msg);
      break;
    case "error":
      console.error(msg);
      break;
  }
}

const instantiateCore = WebAssembly.instantiate;

const utf8Decoder = new TextDecoder();

function toUint32(val) {
  return val >>> 0;
}

let dv = new DataView(new ArrayBuffer());
const dataView = (mem) =>
  dv.buffer === mem.buffer ? dv : (dv = new DataView(mem.buffer));

const fetchCompile = (url) => fetch(url).then(WebAssembly.compileStreaming);

const base64Compile = (str) =>
  WebAssembly.compile(Uint8Array.from(atob(str), (b) => b.charCodeAt(0)));

let exports0;
let exports1;
let memory0;

function lowering0(arg0, arg1, arg2) {
  let enum0;
  switch (arg0) {
    case 0: {
      enum0 = "info";
      break;
    }
    case 1: {
      enum0 = "debug";
      break;
    }
    case 2: {
      enum0 = "error";
      break;
    }
  }
  const ptr1 = arg1;
  const len1 = arg2;
  const result1 = utf8Decoder.decode(
    new Uint8Array(memory0.buffer, ptr1, len1)
  );
  lowering0Callee(enum0, result1);
}
let exports2;
let realloc0;
let postReturn0;

function decodeQr(arg0, arg1, arg2) {
  const val0 = arg0;
  const len0 = val0.byteLength;
  const ptr0 = realloc0(0, 0, 1, len0 * 1);
  const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
  new Uint8Array(memory0.buffer, ptr0, len0 * 1).set(src0);
  const ret = exports1["decode-qr"](ptr0, len0, toUint32(arg1), toUint32(arg2));
  let variant2;
  if (dataView(memory0).getUint8(ret + 0, true)) {
    const ptr1 = dataView(memory0).getInt32(ret + 4, true);
    const len1 = dataView(memory0).getInt32(ret + 8, true);
    const result1 = utf8Decoder.decode(
      new Uint8Array(memory0.buffer, ptr1, len1)
    );
    variant2 = result1;
  } else {
    variant2 = null;
  }
  postReturn0(ret);
  return variant2;
}

export { decodeQr };

const $init = (async () => {
  const module0 = fetchCompile(
    new URL("./qrdecoder.wasm", import.meta.url)
  );
  const module1 = base64Compile(
    "AGFzbQEAAAABBwFgA39/fwADAgEABAUBcAEBAQcQAgEwAAAIJGltcG9ydHMBAAoPAQ0AIAAgASACQQARAAALAC0JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQFMC43LjQ="
  );
  const module2 = base64Compile(
    "AGFzbQEAAAABBwFgA39/fwACFQIAATAAAAAIJGltcG9ydHMBcAEBAQkHAQBBAAsBAAAtCXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AQ13aXQtY29tcG9uZW50BTAuNy40ABwEbmFtZQAVFHdpdC1jb21wb25lbnQ6Zml4dXBz"
  );
  Promise.all([module0, module1, module2]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module1));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    console: {
      msg: exports0["0"],
    },
  }));
  memory0 = exports1.memory;
  ({ exports: exports2 } = await instantiateCore(await module2, {
    "": {
      $imports: exports0.$imports,
      0: lowering0,
    },
  }));
  realloc0 = exports1.cabi_realloc;
  postReturn0 = exports1["cabi_post_decode-qr"];
})();

await $init;
