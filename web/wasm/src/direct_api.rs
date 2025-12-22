use wasm_bindgen::prelude::*;
use crate::energy::{rgba_to_gray01, grad_energy, enhance_energy_directional, to_heatmap_u8};
use crate::grid::{detect_pixel_size, detect_grid_lines, interpolate_lines, complete_edges, sample_pixel_art_direct, sample_pixel_art};

/// RGBA 转灰度图 - 直接内存指针版本
/// 接受指向 u8 数组的指针和长度，避免 JSON 序列化
#[wasm_bindgen]
pub fn rgba_to_gray01_direct(rgba_ptr: *const u8, rgba_len: usize, width: usize, height: usize) -> *const f32 {
    web_sys::console::log_1(&"rgba_to_gray01_direct called".into());

    // 安全地创建 slice
    let rgba_slice = unsafe { std::slice::from_raw_parts(rgba_ptr, rgba_len) };

    web_sys::console::log_1(&format!("Received: rgba_len={}, width={}, height={}", rgba_len, width, height).into());

    let gray = rgba_to_gray01(rgba_slice, width, height);

    // 将结果 leaked 到堆上，返回指针
    let boxed = gray.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 释放 rgba_to_gray01_direct 返回的内存
#[wasm_bindgen]
pub fn free_float32_array(ptr: *mut f32, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, len, len);
    }
}

/// 梯度能量计算 - 直接内存指针版本
#[wasm_bindgen]
pub fn grad_energy_direct(gray_ptr: *const f32, gray_len: usize, width: usize, height: usize, sigma: f64) -> *const f32 {
    web_sys::console::log_1(&"grad_energy_direct called".into());

    let gray_slice = unsafe { std::slice::from_raw_parts(gray_ptr, gray_len) };
    let energy = grad_energy(gray_slice, width, height, sigma);

    let boxed = energy.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 方向性能量增强 - 直接内存指针版本
#[wasm_bindgen]
pub fn enhance_energy_directional_direct(
    energy_ptr: *const f32,
    energy_len: usize,
    width: usize,
    height: usize,
    horizontal_factor: f32,
    vertical_factor: f32,
) -> *const f32 {
    web_sys::console::log_1(&"enhance_energy_directional_direct called".into());

    let energy_slice = unsafe { std::slice::from_raw_parts(energy_ptr, energy_len) };
    let result = enhance_energy_directional(energy_slice, width, height, horizontal_factor, vertical_factor);

    let boxed = result.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 能量图转热力图 - 直接内存指针版本
#[wasm_bindgen]
pub fn to_heatmap_u8_direct(energy_ptr: *const f32, energy_len: usize) -> *const u8 {
    web_sys::console::log_1(&"to_heatmap_u8_direct called".into());

    let energy_slice = unsafe { std::slice::from_raw_parts(energy_ptr, energy_len) };
    let heatmap = to_heatmap_u8(energy_slice);

    let boxed = heatmap.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 释放 to_heatmap_u8_direct 返回的内存
#[wasm_bindgen]
pub fn free_uint8_array(ptr: *mut u8, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, len, len);
    }
}

/// 像素大小检测 - 直接内存指针版本
#[wasm_bindgen]
pub fn detect_pixel_size_direct(energy_u8_ptr: *const u8, energy_u8_len: usize, width: usize, height: usize, min_s: usize, max_s: usize) -> usize {
    web_sys::console::log_1(&"detect_pixel_size_direct called".into());

    let energy_u8_slice = unsafe { std::slice::from_raw_parts(energy_u8_ptr, energy_u8_len) };
    web_sys::console::log_1(&format!("Received: energy_u8_len={}, width={}, height={}", energy_u8_len, width, height).into());

    detect_pixel_size(energy_u8_slice, width, height, min_s, max_s)
}

/// 网格线检测 - 直接内存指针版本
#[wasm_bindgen]
pub fn detect_grid_lines_direct(
    energy_u8_ptr: *const u8,
    energy_u8_len: usize,
    width: usize,
    height: usize,
    gap_size: usize,
    gap_tolerance: usize,
    min_energy: f32,
    smooth_win: usize,
    window_size: usize,
) -> JsValue {
    web_sys::console::log_1(&"detect_grid_lines_direct called".into());

    let energy_u8_slice = unsafe { std::slice::from_raw_parts(energy_u8_ptr, energy_u8_len) };
    detect_grid_lines(energy_u8_slice, width, height, gap_size, gap_tolerance, min_energy, smooth_win, window_size)
}

/// 线条插值 - 直接内存指针版本
#[wasm_bindgen]
pub fn interpolate_lines_direct(lines_ptr: *const usize, lines_len: usize, limit: usize, fallback_gap: usize) -> *const usize {
    web_sys::console::log_1(&"interpolate_lines_direct called".into());

    let lines_slice = unsafe { std::slice::from_raw_parts(lines_ptr, lines_len) };
    let result = interpolate_lines(lines_slice, limit, fallback_gap);

    let boxed = result.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 释放 interpolate_lines_direct 返回的内存
#[wasm_bindgen]
pub fn free_usize_array(ptr: *mut usize, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, len, len);
    }
}

/// 完善边缘 - 直接内存指针版本
#[wasm_bindgen]
pub fn complete_edges_direct(all_lines_ptr: *const usize, all_lines_len: usize, limit: usize, typical_gap: usize, gap_tolerance: usize) -> *const usize {
    web_sys::console::log_1(&"complete_edges_direct called".into());

    let all_lines_slice = unsafe { std::slice::from_raw_parts(all_lines_ptr, all_lines_len) };
    let result = complete_edges(all_lines_slice, limit, typical_gap, gap_tolerance);

    let boxed = result.into_boxed_slice();
    Box::leak(boxed).as_ptr()
}

/// 直接像素采样 - 直接内存指针版本
#[wasm_bindgen]
pub fn sample_pixel_art_direct_wrapper(
    rgb_ptr: *const u8,
    rgb_len: usize,
    width: usize,
    height: usize,
    target_width: usize,
    target_height: usize,
    mode: u32,
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
) -> JsValue {
    web_sys::console::log_1(&"sample_pixel_art_direct_wrapper called".into());

    let rgb_slice = unsafe { std::slice::from_raw_parts(rgb_ptr, rgb_len) };
    sample_pixel_art_direct(rgb_slice, width, height, target_width, target_height, mode, weight_ratio, upscale_factor, native_res)
}

/// 基于网格的像素采样 - 直接内存指针版本
#[wasm_bindgen]
pub fn sample_pixel_art_wrapper(
    rgb_ptr: *const u8,
    rgb_len: usize,
    width: usize,
    height: usize,
    all_x_ptr: *const usize,
    all_x_len: usize,
    all_y_ptr: *const usize,
    all_y_len: usize,
    mode: u32,
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
) -> JsValue {
    web_sys::console::log_1(&"sample_pixel_art_wrapper called".into());

    let rgb_slice = unsafe { std::slice::from_raw_parts(rgb_ptr, rgb_len) );
    let all_x_slice = unsafe { std::slice::from_raw_parts(all_x_ptr, all_x_len) };
    let all_y_slice = unsafe { std::slice::from_raw_parts(all_y_ptr, all_y_len) };

    sample_pixel_art(rgb_slice, width, height, all_x_slice, all_y_slice, mode, weight_ratio, upscale_factor, native_res)
}
