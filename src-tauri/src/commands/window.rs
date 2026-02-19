use tauri::Window;

#[tauri::command]
pub async fn set_always_on_top(window: Window, always_on_top: bool) -> Result<(), String> {
  window
    .set_always_on_top(always_on_top)
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_window_opacity(_window: Window, _opacity: f64) -> Result<(), String> {
  Ok(())
}

#[tauri::command]
pub async fn set_ignore_cursor_events(_window: Window, _ignore: bool) -> Result<(), String> {
  Ok(())
}

#[tauri::command]
pub async fn set_skip_taskbar(window: Window, skip: bool) -> Result<(), String> {
  window.set_skip_taskbar(skip).map_err(|e| e.to_string())
}
