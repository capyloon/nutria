import { clamp_host, data_view, UTF8_DECODER } from './intrinsics.js';
export class QrdecoderModule {
  addToImports(imports) {
  }
  
  async instantiate(module, imports) {
    imports = imports || {};
    this.addToImports(imports);
    
    if (module instanceof WebAssembly.Instance) {
      this.instance = module;
    } else if (module instanceof WebAssembly.Module) {
      this.instance = await WebAssembly.instantiate(module, imports);
    } else if (module instanceof ArrayBuffer || module instanceof Uint8Array) {
      const { instance } = await WebAssembly.instantiate(module, imports);
      this.instance = instance;
    } else {
      const { instance } = await WebAssembly.instantiateStreaming(module, imports);
      this.instance = instance;
    }
    this._exports = this.instance.exports;
  }
  decodeQr(arg0, arg1, arg2) {
    const memory = this._exports.memory;
    const realloc = this._exports["canonical_abi_realloc"];
    const free = this._exports["canonical_abi_free"];
    const val0 = arg0;
    const len0 = val0.length;
    const ptr0 = realloc(0, 0, 1, len0 * 1);
    (new Uint8Array(memory.buffer, ptr0, len0 * 1)).set(new Uint8Array(val0.buffer, val0.byteOffset, len0 * 1));
    const ret = this._exports['decode-qr'](ptr0, len0, clamp_host(arg1, 0, 4294967295), clamp_host(arg2, 0, 4294967295));
    let variant2;
    switch (data_view(memory).getUint8(ret + 0, true)) {
      
      case 0: {
        
        variant2 = null;
        break;
      }
      case 1: {
        const ptr1 = data_view(memory).getInt32(ret + 4, true);
        const len1 = data_view(memory).getInt32(ret + 8, true);
        const list1 = UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr1, len1));
        free(ptr1, len1, 1);
        
        variant2 = list1;
        break;
      }
      
      default:
      throw new RangeError("invalid variant discriminant for option");
    }
    return variant2;
  }
}
