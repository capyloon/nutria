
export function clamp_host(i, min, max) {
  if (!Number.isInteger(i)) throw new TypeError(`must be an integer`);
  if (i < min || i > max) throw new RangeError(`must be between ${min} and ${max}`);
  return i;
}

let DATA_VIEW = new DataView(new ArrayBuffer());

export function data_view(mem) {
  if (DATA_VIEW.buffer !== mem.buffer) DATA_VIEW = new DataView(mem.buffer);
  return DATA_VIEW;
}
export const UTF8_DECODER = new TextDecoder('utf-8');
