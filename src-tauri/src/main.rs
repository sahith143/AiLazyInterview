#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use tauri::Manager;

mod commands;

use commands::{window::*, ai::*, settings::*};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      set_always_on_top,
      set_window_opacity,
      set_ignore_cursor_events,
      set_skip_taskbar,
      query_ai,
      save_api_key,
      load_api_key,
      clear_api_key,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
