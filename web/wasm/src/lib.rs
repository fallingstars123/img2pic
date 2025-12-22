use wasm_bindgen::prelude::*;

mod filters;
mod energy;
mod grid;

pub use filters::*;
pub use energy::*;
pub use grid::*;

// 手动初始化函数（替代 #[wasm_bindgen(start)]）
#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}
