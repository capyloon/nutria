import {
  clamp_host,
  data_view,
  UTF8_DECODER,
  utf8_encode,
  UTF8_ENCODED_LEN,
} from "./intrinsics.js";
export class ImageModule {
  addToImports(imports) {}

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
      const { instance } = await WebAssembly.instantiateStreaming(
        module,
        imports
      );
      this.instance = instance;
    }
    this._exports = this.instance.exports;
  }
  algorithms(arg0) {
    const memory = this._exports.memory;
    const realloc = this._exports["canonical_abi_realloc"];
    const free = this._exports["canonical_abi_free"];
    const ptr0 = utf8_encode(arg0, realloc, memory);
    const len0 = UTF8_ENCODED_LEN;
    const ret = this._exports["algorithms"](ptr0, len0);
    const len3 = data_view(memory).getInt32(ret + 4, true);
    const base3 = data_view(memory).getInt32(ret + 0, true);
    const result3 = [];
    for (let i = 0; i < len3; i++) {
      const base = base3 + i * 16;
      const ptr1 = data_view(memory).getInt32(base + 0, true);
      const len1 = data_view(memory).getInt32(base + 4, true);
      const list1 = UTF8_DECODER.decode(
        new Uint8Array(memory.buffer, ptr1, len1)
      );
      free(ptr1, len1, 1);
      const ptr2 = data_view(memory).getInt32(base + 8, true);
      const len2 = data_view(memory).getInt32(base + 12, true);
      const list2 = UTF8_DECODER.decode(
        new Uint8Array(memory.buffer, ptr2, len2)
      );
      free(ptr2, len2, 1);
      result3.push({
        name: list1,
        description: list2,
      });
    }
    free(base3, len3 * 16, 4);
    return result3;
  }
  processImage(arg0, arg1, arg2, arg3) {
    const memory = this._exports.memory;
    const realloc = this._exports["canonical_abi_realloc"];
    const free = this._exports["canonical_abi_free"];
    const ptr0 = utf8_encode(arg0, realloc, memory);
    const len0 = UTF8_ENCODED_LEN;
    const val1 = arg1;
    const len1 = val1.length;
    const ptr1 = realloc(0, 0, 1, len1 * 1);
    new Uint8Array(memory.buffer, ptr1, len1 * 1).set(
      new Uint8Array(val1.buffer, val1.byteOffset, len1 * 1)
    );
    const ret = this._exports["process-image"](
      ptr0,
      len0,
      ptr1,
      len1,
      clamp_host(arg2, 0, 4294967295),
      clamp_host(arg3, 0, 4294967295)
    );
    let variant3;
    switch (data_view(memory).getUint8(ret + 0, true)) {
      case 0: {
        variant3 = null;
        break;
      }
      case 1: {
        const ptr2 = data_view(memory).getInt32(ret + 4, true);
        const len2 = data_view(memory).getInt32(ret + 8, true);
        const list2 = new Uint8Array(
          memory.buffer.slice(ptr2, ptr2 + len2 * 1)
        );
        free(ptr2, len2, 1);

        variant3 = list2;
        break;
      }

      default:
        throw new RangeError("invalid variant discriminant for option");
    }
    return variant3;
  }
}
