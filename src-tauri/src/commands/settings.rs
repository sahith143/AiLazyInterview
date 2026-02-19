use std::path::PathBuf;
use tauri::api::path::data_dir;

fn get_settings_path() -> Result<PathBuf, String> {
  data_dir()
    .ok_or_else(|| "Could not determine data directory".to_string())
    .map(|mut dir| {
      dir.push("angel-ai-assistant");
      dir.push("settings.json");
      dir
    })
}

#[tauri::command]
pub async fn save_api_key(provider: String, api_key: String) -> Result<(), String> {
  let path = get_settings_path()?;

  if let Some(parent) = path.parent() {
    std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
  }

  let mut settings = if path.exists() {
    let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).unwrap_or_else(|_| serde_json::json!({}))
  } else {
    serde_json::json!({})
  };

  settings[format!("api_key_{}", provider)] = serde_json::json!(api_key);

  let json_str = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
  std::fs::write(path, json_str).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_api_key(provider: String) -> Result<Option<String>, String> {
  let path = get_settings_path()?;

  if !path.exists() {
    return Ok(None);
  }

  let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
  let settings: serde_json::Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

  Ok(settings[format!("api_key_{}", provider)]
    .as_str()
    .map(|s| s.to_string()))
}

#[tauri::command]
pub async fn clear_api_key(provider: String) -> Result<(), String> {
  let path = get_settings_path()?;

  if !path.exists() {
    return Ok(());
  }

  let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
  let mut settings: serde_json::Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

  if let Some(obj) = settings.as_object_mut() {
    obj.remove(&format!("api_key_{}", provider));
  }

  let json_str = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
  std::fs::write(path, json_str).map_err(|e| e.to_string())
}
