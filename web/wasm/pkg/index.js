import * as wasm from "./index_bg.wasm";
export * from "./index_bg.js";
import { __wbg_set_wasm } from "./index_bg.js";
__wbg_set_wasm(wasm);
// __wbindgen_start is only available when using #[wasm_bindgen(start)]
// We use init_panic_hook() instead
if (typeof wasm.__wbindgen_start === 'function') {
  wasm.__wbindgen_start();
}
