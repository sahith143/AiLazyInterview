use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AiResponse {
  pub response: String,
  pub error: Option<String>,
}

#[tauri::command]
pub async fn query_ai(
  transcript: String,
  api_key: String,
  api_provider: Option<String>,
) -> Result<AiResponse, String> {
  let provider = api_provider.unwrap_or_else(|| "gemini".to_string());

  if transcript.trim().is_empty() {
    return Ok(AiResponse {
      response: String::new(),
      error: Some("Transcript cannot be empty".to_string()),
    });
  }

  if api_key.is_empty() {
    return Ok(AiResponse {
      response: String::new(),
      error: Some("API key not configured".to_string()),
    });
  }

  match provider.as_str() {
    "gemini" => query_gemini(transcript, api_key).await,
    "openai" => query_openai(transcript, api_key).await,
    _ => Ok(AiResponse {
      response: String::new(),
      error: Some(format!("Unknown API provider: {}", provider)),
    }),
  }
}

async fn query_gemini(transcript: String, api_key: String) -> Result<AiResponse, String> {
  let client = reqwest::Client::new();
  let url = format!(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}",
    api_key
  );

  let body = serde_json::json!({
    "contents": [{
      "parts": [{
        "text": transcript
      }]
    }]
  });

  match client
    .post(&url)
    .header("Content-Type", "application/json")
    .json(&body)
    .send()
    .await
  {
    Ok(response) => match response.json::<serde_json::Value>().await {
      Ok(data) => {
        if let Some(content) = data
          .get("candidates")
          .and_then(|c| c.get(0))
          .and_then(|c| c.get("content"))
          .and_then(|c| c.get("parts"))
          .and_then(|p| p.get(0))
          .and_then(|p| p.get("text"))
        {
          Ok(AiResponse {
            response: content.as_str().unwrap_or("").to_string(),
            error: None,
          })
        } else if let Some(error) = data.get("error").and_then(|e| e.get("message")) {
          Ok(AiResponse {
            response: String::new(),
            error: Some(error.as_str().unwrap_or("Unknown error").to_string()),
          })
        } else {
          Ok(AiResponse {
            response: String::new(),
            error: Some("Invalid response format".to_string()),
          })
        }
      }
      Err(e) => Ok(AiResponse {
        response: String::new(),
        error: Some(format!("Failed to parse response: {}", e)),
      }),
    },
    Err(e) => Ok(AiResponse {
      response: String::new(),
      error: Some(format!("API request failed: {}", e)),
    }),
  }
}

async fn query_openai(transcript: String, api_key: String) -> Result<AiResponse, String> {
  let client = reqwest::Client::new();
  let url = "https://api.openai.com/v1/chat/completions";

  let body = serde_json::json!({
    "model": "gpt-3.5-turbo",
    "messages": [{
      "role": "user",
      "content": transcript
    }]
  });

  match client
    .post(url)
    .header("Authorization", format!("Bearer {}", api_key))
    .header("Content-Type", "application/json")
    .json(&body)
    .send()
    .await
  {
    Ok(response) => match response.json::<serde_json::Value>().await {
      Ok(data) => {
        if let Some(content) = data
          .get("choices")
          .and_then(|c| c.get(0))
          .and_then(|c| c.get("message"))
          .and_then(|m| m.get("content"))
        {
          Ok(AiResponse {
            response: content.as_str().unwrap_or("").to_string(),
            error: None,
          })
        } else if let Some(error) = data.get("error").and_then(|e| e.get("message")) {
          Ok(AiResponse {
            response: String::new(),
            error: Some(error.as_str().unwrap_or("Unknown error").to_string()),
          })
        } else {
          Ok(AiResponse {
            response: String::new(),
            error: Some("Invalid response format".to_string()),
          })
        }
      }
      Err(e) => Ok(AiResponse {
        response: String::new(),
        error: Some(format!("Failed to parse response: {}", e)),
      }),
    },
    Err(e) => Ok(AiResponse {
      response: String::new(),
      error: Some(format!("API request failed: {}", e)),
    }),
  }
}
