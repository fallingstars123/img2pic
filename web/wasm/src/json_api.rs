use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use crate::energy::{rgba_to_gray01, grad_energy, enhance_energy_directional, to_heatmap_u8};
use crate::grid::{detect_pixel_size, detect_grid_lines, interpolate_lines, complete_edges, sample_pixel_art_direct, sample_pixel_art};

/// RGBA 转灰度图的 JSON 参数
#[derive(Deserialize)]
struct RgbaToGray01Params {
    rgba: Vec<u8>,
    width: usize,
    height: usize,
}

/// RGBA 转灰度图的 JSON 返回值
#[derive(Serialize)]
struct RgbaToGray01Result {
    gray: Vec<f32>,
}

/// 梯度能量计算的 JSON 参数
#[derive(Deserialize)]
struct GradEnergyParams {
    gray01: Vec<f32>,
    width: usize,
    height: usize,
    sigma: f64,
}

/// 梯度能量计算的 JSON 返回值
#[derive(Serialize)]
struct GradEnergyResult {
    energy: Vec<f32>,
}

/// 方向性能量增强的 JSON 参数
#[derive(Deserialize)]
struct EnhanceEnergyDirectionalParams {
    energy: Vec<f32>,
    width: usize,
    height: usize,
    horizontal_factor: f32,
    vertical_factor: f32,
}

/// 方向性能量增强的 JSON 返回值
#[derive(Serialize)]
struct EnhanceEnergyDirectionalResult {
    energy: Vec<f32>,
}

/// 能量图转热力图的 JSON 参数
#[derive(Deserialize)]
struct ToHeatmapU8Params {
    energy: Vec<f32>,
}

/// 能量图转热力图的 JSON 返回值
#[derive(Serialize)]
struct ToHeatmapU8Result {
    heatmap: Vec<u8>,
}

/// 像素大小检测的 JSON 参数
#[derive(Deserialize)]
struct DetectPixelSizeParams {
    energy_u8: Vec<u8>,
    width: usize,
    height: usize,
    min_s: usize,
    max_s: usize,
}

/// 像素大小检测的 JSON 返回值
#[derive(Serialize)]
struct DetectPixelSizeResult {
    pixel_size: usize,
}

/// 网格线检测的 JSON 参数
#[derive(Deserialize)]
struct DetectGridLinesParams {
    energy_u8: Vec<u8>,
    width: usize,
    height: usize,
    gap_size: usize,
    gap_tolerance: usize,
    min_energy: f32,
    smooth_win: usize,
    window_size: usize,
}

/// 网格线检测的 JSON 返回值
#[derive(Serialize)]
struct DetectGridLinesResult {
    x_lines: Vec<usize>,
    y_lines: Vec<usize>,
}

/// 线条插值的 JSON 参数
#[derive(Deserialize)]
struct InterpolateLinesParams {
    lines: Vec<usize>,
    limit: usize,
    fallback_gap: usize,
}

/// 线条插值的 JSON 返回值
#[derive(Serialize)]
struct InterpolateLinesResult {
    lines: Vec<usize>,
}

/// 完善边缘的 JSON 参数
#[derive(Deserialize)]
struct CompleteEdgesParams {
    all_lines: Vec<usize>,
    limit: usize,
    typical_gap: usize,
    gap_tolerance: usize,
}

/// 完善边缘的 JSON 返回值
#[derive(Serialize)]
struct CompleteEdgesResult {
    lines: Vec<usize>,
}

/// 直接像素采样的 JSON 参数
#[derive(Deserialize)]
struct SamplePixelArtDirectParams {
    rgb: Vec<u8>,
    width: usize,
    height: usize,
    target_width: usize,
    target_height: usize,
    mode: u32,
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
}

/// 直接像素采样的 JSON 返回值
#[derive(Serialize)]
struct SamplePixelArtDirectResult {
    out_w: usize,
    out_h: usize,
    out_rgb: Vec<u8>,
    out_rgba: Vec<u8>,
}

/// 基于网格的像素采样的 JSON 参数
#[derive(Deserialize)]
struct SamplePixelArtParams {
    rgb: Vec<u8>,
    width: usize,
    height: usize,
    all_x: Vec<usize>,
    all_y: Vec<usize>,
    mode: u32,
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
}

/// 基于网格的像素采样的 JSON 返回值
#[derive(Serialize)]
struct SamplePixelArtResult {
    out_w: usize,
    out_h: usize,
    out_rgb: Vec<u8>,
    out_rgba: Vec<u8>,
}

/// RGBA 转灰度图 - JSON 版本
#[wasm_bindgen]
pub fn rgba_to_gray01_json(params_json: String) -> String {
    web_sys::console::log_1(&"rgba_to_gray01_json called".into());
    web_sys::console::log_1(&format!("params_json length: {}", params_json.len()).into());

    let params: RgbaToGray01Params = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&RgbaToGray01Result { gray: vec![] }).unwrap();
        }
    };

    web_sys::console::log_1(&format!("Parsed params: rgba.len()={}, width={}, height={}",
        params.rgba.len(), params.width, params.height).into());

    let gray = rgba_to_gray01(&params.rgba, params.width, params.height);
    let result = RgbaToGray01Result { gray };
    serde_json::to_string(&result).unwrap()
}

/// 梯度能量计算 - JSON 版本
#[wasm_bindgen]
pub fn grad_energy_json(params_json: String) -> String {
    web_sys::console::log_1(&"grad_energy_json called".into());

    let params: GradEnergyParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&GradEnergyResult { energy: vec![] }).unwrap();
        }
    };

    let energy = grad_energy(&params.gray01, params.width, params.height, params.sigma);
    let result = GradEnergyResult { energy };
    serde_json::to_string(&result).unwrap()
}

/// 方向性能量增强 - JSON 版本
#[wasm_bindgen]
pub fn enhance_energy_directional_json(params_json: String) -> String {
    web_sys::console::log_1(&"enhance_energy_directional_json called".into());

    let params: EnhanceEnergyDirectionalParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&EnhanceEnergyDirectionalResult { energy: vec![] }).unwrap();
        }
    };

    let energy = enhance_energy_directional(
        &params.energy,
        params.width,
        params.height,
        params.horizontal_factor,
        params.vertical_factor,
    );
    let result = EnhanceEnergyDirectionalResult { energy };
    serde_json::to_string(&result).unwrap()
}

/// 能量图转热力图 - JSON 版本
#[wasm_bindgen]
pub fn to_heatmap_u8_json(params_json: String) -> String {
    web_sys::console::log_1(&"to_heatmap_u8_json called".into());

    let params: ToHeatmapU8Params = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&ToHeatmapU8Result { heatmap: vec![] }).unwrap();
        }
    };

    let heatmap = to_heatmap_u8(&params.energy);
    let result = ToHeatmapU8Result { heatmap };
    serde_json::to_string(&result).unwrap()
}

/// 像素大小检测 - JSON 版本
#[wasm_bindgen]
pub fn detect_pixel_size_json(params_json: String) -> String {
    web_sys::console::log_1(&"detect_pixel_size_json called".into());

    let params: DetectPixelSizeParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&DetectPixelSizeResult { pixel_size: 8 }).unwrap();
        }
    };

    web_sys::console::log_1(&format!("Parsed params: energy_u8.len()={}, width={}, height={}",
        params.energy_u8.len(), params.width, params.height).into());

    let pixel_size = detect_pixel_size(&params.energy_u8, params.width, params.height, params.min_s, params.max_s);
    let result = DetectPixelSizeResult { pixel_size };
    serde_json::to_string(&result).unwrap()
}

/// 网格线检测 - JSON 版本
#[wasm_bindgen]
pub fn detect_grid_lines_json(params_json: String) -> String {
    web_sys::console::log_1(&"detect_grid_lines_json called".into());

    let params: DetectGridLinesParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&DetectGridLinesResult { x_lines: vec![], y_lines: vec![] }).unwrap();
        }
    };

    let js_result = detect_grid_lines(
        &params.energy_u8,
        params.width,
        params.height,
        params.gap_size,
        params.gap_tolerance,
        params.min_energy,
        params.smooth_win,
        params.window_size,
    );

    // 解析 JS 结果对象
    let result_obj = js_sys::Object::from(js_result);
    let x_lines_val = js_sys::Reflect::get(&result_obj, &"xLines".into()).unwrap();
    let y_lines_val = js_sys::Reflect::get(&result_obj, &"yLines".into()).unwrap();

    let x_lines_array = js_sys::Uint32Array::from(x_lines_val);
    let y_lines_array = js_sys::Uint32Array::from(y_lines_val);

    let mut x_lines_u32 = vec![0u32; x_lines_array.length() as usize];
    let mut y_lines_u32 = vec![0u32; y_lines_array.length() as usize];
    x_lines_array.copy_to(&mut x_lines_u32);
    y_lines_array.copy_to(&mut y_lines_u32);

    // 转换为 usize
    let x_lines: Vec<usize> = x_lines_u32.into_iter().map(|x| x as usize).collect();
    let y_lines: Vec<usize> = y_lines_u32.into_iter().map(|x| x as usize).collect();

    let result = DetectGridLinesResult { x_lines, y_lines };
    serde_json::to_string(&result).unwrap()
}

/// 线条插值 - JSON 版本
#[wasm_bindgen]
pub fn interpolate_lines_json(params_json: String) -> String {
    web_sys::console::log_1(&"interpolate_lines_json called".into());

    let params: InterpolateLinesParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&InterpolateLinesResult { lines: vec![] }).unwrap();
        }
    };

    let lines = interpolate_lines(&params.lines, params.limit, params.fallback_gap);
    let result = InterpolateLinesResult { lines };
    serde_json::to_string(&result).unwrap()
}

/// 完善边缘 - JSON 版本
#[wasm_bindgen]
pub fn complete_edges_json(params_json: String) -> String {
    web_sys::console::log_1(&"complete_edges_json called".into());

    let params: CompleteEdgesParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&CompleteEdgesResult { lines: vec![] }).unwrap();
        }
    };

    let lines = complete_edges(&params.all_lines, params.limit, params.typical_gap, params.gap_tolerance);
    let result = CompleteEdgesResult { lines };
    serde_json::to_string(&result).unwrap()
}

/// 直接像素采样 - JSON 版本
#[wasm_bindgen]
pub fn sample_pixel_art_direct_json(params_json: String) -> String {
    web_sys::console::log_1(&"sample_pixel_art_direct_json called".into());

    let params: SamplePixelArtDirectParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&SamplePixelArtDirectResult {
                out_w: 0,
                out_h: 0,
                out_rgb: vec![],
                out_rgba: vec![],
            }).unwrap();
        }
    };

    web_sys::console::log_1(&format!("Parsed params: rgb.len()={}, width={}, height={}, target_width={}, target_height={}",
        params.rgb.len(), params.width, params.height, params.target_width, params.target_height).into());

    let js_result = sample_pixel_art_direct(
        &params.rgb,
        params.width,
        params.height,
        params.target_width,
        params.target_height,
        params.mode,
        params.weight_ratio,
        params.upscale_factor,
        params.native_res,
    );

    // 解析 JS 结果对象
    let result_obj = js_sys::Object::from(js_result);
    let out_w_val = js_sys::Reflect::get(&result_obj, &"outW".into()).unwrap();
    let out_h_val = js_sys::Reflect::get(&result_obj, &"outH".into()).unwrap();
    let out_rgb_val = js_sys::Reflect::get(&result_obj, &"outRgb".into()).unwrap();
    let out_rgba_val = js_sys::Reflect::get(&result_obj, &"outRgba".into()).unwrap();

    let out_w = out_w_val.as_f64().unwrap() as usize;
    let out_h = out_h_val.as_f64().unwrap() as usize;

    let out_rgb_array = js_sys::Uint8Array::from(out_rgb_val);
    let out_rgba_array = js_sys::Uint8Array::from(out_rgba_val);

    let mut out_rgb = vec![0u8; out_rgb_array.length() as usize];
    let mut out_rgba = vec![0u8; out_rgba_array.length() as usize];
    out_rgb_array.copy_to(&mut out_rgb);
    out_rgba_array.copy_to(&mut out_rgba);

    let result = SamplePixelArtDirectResult { out_w, out_h, out_rgb, out_rgba };
    serde_json::to_string(&result).unwrap()
}

/// 基于网格的像素采样 - JSON 版本
#[wasm_bindgen]
pub fn sample_pixel_art_json(params_json: String) -> String {
    web_sys::console::log_1(&"sample_pixel_art_json called".into());

    let params: SamplePixelArtParams = match serde_json::from_str(&params_json) {
        Ok(p) => p,
        Err(e) => {
            web_sys::console::error_1(&format!("JSON parse error: {}", e).into());
            return serde_json::to_string(&SamplePixelArtResult {
                out_w: 0,
                out_h: 0,
                out_rgb: vec![],
                out_rgba: vec![],
            }).unwrap();
        }
    };

    let js_result = sample_pixel_art(
        &params.rgb,
        params.width,
        params.height,
        &params.all_x,
        &params.all_y,
        params.mode,
        params.weight_ratio,
        params.upscale_factor,
        params.native_res,
    );

    // 解析 JS 结果对象
    let result_obj = js_sys::Object::from(js_result);
    let out_w_val = js_sys::Reflect::get(&result_obj, &"outW".into()).unwrap();
    let out_h_val = js_sys::Reflect::get(&result_obj, &"outH".into()).unwrap();
    let out_rgb_val = js_sys::Reflect::get(&result_obj, &"outRgb".into()).unwrap();
    let out_rgba_val = js_sys::Reflect::get(&result_obj, &"outRgba".into()).unwrap();

    let out_w = out_w_val.as_f64().unwrap() as usize;
    let out_h = out_h_val.as_f64().unwrap() as usize;

    let out_rgb_array = js_sys::Uint8Array::from(out_rgb_val);
    let out_rgba_array = js_sys::Uint8Array::from(out_rgba_val);

    let mut out_rgb = vec![0u8; out_rgb_array.length() as usize];
    let mut out_rgba = vec![0u8; out_rgba_array.length() as usize];
    out_rgb_array.copy_to(&mut out_rgb);
    out_rgba_array.copy_to(&mut out_rgba);

    let result = SamplePixelArtResult { out_w, out_h, out_rgb, out_rgba };
    serde_json::to_string(&result).unwrap()
}
