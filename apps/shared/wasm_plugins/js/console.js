import { UTF8_DECODER } from './intrinsics.js';
export function addConsoleToImports(imports, obj, get_export) {
  if (!("console" in imports)) imports["console"] = {};
  imports["console"]["console-log"] = function(arg0, arg1) {
    const memory = get_export("memory");
    const ptr0 = arg0;
    const len0 = arg1;
    obj.consoleLog(UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)));
  };
  imports["console"]["console-error"] = function(arg0, arg1) {
    const memory = get_export("memory");
    const ptr0 = arg0;
    const len0 = arg1;
    obj.consoleError(UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)));
  };
}