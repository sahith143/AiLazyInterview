# Architecture Overview - Angel AI Assistant

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Angel AI Assistant                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Interface Layer (React + TypeScript)          │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Components:                                    │ │  │
│  │  │ • Header (Settings, Always-on-Top toggle)    │ │  │
│  │  │ • TranscriptLog (Speech-to-text display)     │ │  │
│  │  │ • MicrophoneButton (Recording control)       │ │  │
│  │  │ • AIResponse (AI response display)           │ │  │
│  │  │ • Controls (Reset/New conversation)          │ │  │
│  │  │ • SettingsModal (API key configuration)      │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ State Management (Zustand)                     │ │  │
│  │  │ • Recording state, transcripts, API responses │ │  │
│  │  │ • Settings (theme, always-on-top, etc)       │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Custom Hooks (Business Logic)                  │ │  │
│  │  │ • useSpeechRecognition (Web Speech API)       │ │  │
│  │  │ • useAiQuery (Tauri command invocation)       │ │  │
│  │  │ • useGlobalShortcuts (Keyboard events)        │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓ (IPC/Tauri Invoke)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tauri Application Shell                            │  │
│  │  • Window management and control                   │  │
│  │  • IPC bridge between JS and Rust                 │  │
│  │  • System tray integration                        │  │
│  │  • Auto-update mechanism                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Backend Layer (Rust + Tokio)                       │  │
│  │                                                      │  │
│  │  Command Handlers (Tauri Commands):                │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │ Window Commands:                            │  │  │
│  │  │ • set_always_on_top()                      │  │  │
│  │  │ • set_window_opacity()                     │  │  │
│  │  │ • set_ignore_cursor_events()               │  │  │
│  │  │ • set_skip_taskbar()                       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │ AI Commands:                                │  │  │
│  │  │ • query_ai(transcript, api_key, provider)  │  │  │
│  │  │   - Supports Google Gemini API             │  │  │
│  │  │   - Supports OpenAI API                    │  │  │
│  │  │   - Handles API errors gracefully          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │ Settings Commands:                          │  │  │
│  │  │ • save_api_key(provider, api_key)          │  │  │
│  │  │ • load_api_key(provider)                   │  │  │
│  │  │ • clear_api_key(provider)                  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  External Services                                  │  │
│  │  • Google Gemini API (ai.google.dev)               │  │
│  │  • OpenAI API (api.openai.com)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Recording and Transcription Flow

```
User presses Spacebar / Clicks Microphone
    ↓
useGlobalShortcuts / MicrophoneButton
    ↓
useSpeechRecognition hook activates
    ↓
Web Speech API (Browser)
    ↓
Real-time transcript accumulation
    ↓
Zustand store updates (setTranscript)
    ↓
TranscriptLog component re-renders
    ↓
User stops speaking (silence detected)
    ↓
Transcript finalized
    ↓
useAiQuery hook triggered
    ↓
Tauri invoke 'query_ai' command
    ↓
Rust backend processes API request
    ↓
HTTP request to selected AI provider
    ↓
Response processing and error handling
    ↓
Zustand store updates (setAiResponse)
    ↓
AIResponse component displays result
```

### Settings Storage Flow

```
User enters API key in SettingsModal
    ↓
Click "Save" button
    ↓
Tauri invoke 'save_api_key' command
    ↓
Rust backend receives request
    ↓
Create/update settings file in user data directory:
~/.angel-ai-assistant/settings.json
    ↓
JSON file contains: { api_key_gemini: "key..." }
    ↓
On app startup:
    ↓
Tauri invoke 'load_api_key' command
    ↓
Rust reads settings.json
    ↓
Key loaded into React state
```

### Window Control Flow

```
User toggles "Always on Top"
    ↓
Header component checkbox changed
    ↓
Handler invokes set_always_on_top command
    ↓
Rust backend calls Tauri window API
    ↓
Windows native window property updated
    ↓
Window manager reorders windows
```

## Component Hierarchy

```
App (Main Container)
├── Header
│   ├── Settings Icon Button → SettingsModal
│   │   ├── API Provider Select
│   │   ├── API Key Input
│   │   ├── Settings Actions (Save/Clear)
│   │   └── Privacy Notice
│   └── Hide from Sharing Toggle
├── Main Content
│   ├── TranscriptLog (Text display)
│   ├── MicrophoneButton (Central control)
│   ├── AIResponse (Response display)
│   └── Controls (Reset button)
```

## State Management Structure

```
Zustand Store (useAppStore)
├── Recording State
│   ├── isListening: boolean
│   ├── isProcessing: boolean
│   └── [setters]
├── Content State
│   ├── transcript: string
│   ├── aiResponse: string
│   ├── aiError: string | null
│   └── [setters + operations: append, clear]
├── Settings State
│   ├── apiProvider: 'gemini' | 'openai'
│   ├── alwaysOnTop: boolean
│   ├── hideFromScreenSharing: boolean
│   └── [setters]
└── Reset Handler
    └── reset(): Clears all content state
```

## Communication Protocols

### React ↔ Tauri (IPC Bridge)

**Query AI:**
```javascript
await invoke('query_ai', {
  transcript: string,
  apiKey: string,
  apiProvider?: string
})
→ { response: string, error?: string }
```

**Window Commands:**
```javascript
await invoke('set_always_on_top', { alwaysOnTop: boolean })
await invoke('set_window_opacity', { opacity: number })
await invoke('set_skip_taskbar', { skip: boolean })
```

**Settings:**
```javascript
await invoke('save_api_key', { provider: string, apiKey: string })
await invoke('load_api_key', { provider: string })
→ string | null
await invoke('clear_api_key', { provider: string })
```

### Backend ↔ AI APIs

**Google Gemini:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
Authorization: ?key={API_KEY}
Content-Type: application/json

{
  "contents": [{
    "parts": [{ "text": "user message" }]
  }]
}

← {
  candidates: [{
    content: {
      parts: [{ text: "response" }]
    }
  }]
}
```

**OpenAI:**
```
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [{ "role": "user", "content": "message" }]
}

←
{
  choices: [{
    message: { content: "response" }
  }]
}
```

## File Organization

### Frontend Files

- **Components** (`src/components/`): UI components with associated CSS Modules
- **Hooks** (`src/hooks/`): Business logic and browser API integrations
- **Store** (`src/store/`): Zustand state management
- **Styles** (`src/index.css`): Global design system and CSS variables
- **App** (`src/App.tsx`): Main app orchestration

### Backend Files

- **Commands** (`src-tauri/src/commands/`): Tauri command implementations
  - `window.rs`: Window manipulation
  - `ai.rs`: AI API integration
  - `settings.rs`: Settings persistence
- **Main** (`src-tauri/src/main.rs`): Tauri app entry point and handlers

### Configuration Files

- `vite.config.ts`: Vite bundler configuration
- `tsconfig.json`: TypeScript compiler options
- `src-tauri/tauri.conf.json`: Tauri app configuration
- `src-tauri/Cargo.toml`: Rust dependencies
- `package.json`: npm dependencies and scripts

## Technology Choices & Rationale

### Frontend Framework: React
- **Why**: Industry standard, large ecosystem, strong typing with TypeScript
- **Alternative**: Vue, Svelte (more lightweight but smaller ecosystem)

### State Management: Zustand
- **Why**: Lightweight, simple API, minimal boilerplate
- **Alternative**: Redux, Jotai (heavier but more features)

### Desktop Framework: Tauri
- **Why**: Lightweight, secure, smaller bundle than Electron, excellent Rust integration
- **Alternative**: Electron (larger, higher resource usage)

### Speech Recognition: Web Speech API
- **Why**: Native browser API, no additional libraries needed
- **Alternative**: Third-party services (higher latency, requires API keys)

### Styling: CSS Modules
- **Why**: Component scoped, prevents naming conflicts, integrates well with React
- **Alternative**: Styled-components, Tailwind (different approaches)

## Performance Considerations

### Frontend Optimization
- React components use memo for expensive re-renders
- CSS Modules prevent cascading style issues
- Zustand provides minimal re-render triggers
- Vite enables fast hot module replacement

### Backend Optimization
- Async/await for non-blocking operations
- Tokio runtime for concurrent operations
- Minimal memory footprint from Tauri
- Efficient API request handling

### Network Optimization
- AI API calls are async and don't block UI
- Single request per speech end detection
- Response caching can be added if needed
- Error handling prevents retry storms

## Security Considerations

### Data Security
- API keys stored locally in user's data directory
- No telemetry or data collection
- HTTPS for all external API calls
- No transcript persistence

### Window Management
- Frameless window prevents window chrome injection
- Always-on-top only when user enables it
- Opacity changes are local only

### Permission Model
- Microphone access controlled by OS
- Window manipulation limited to own window
- File access limited to user's data directory

## Scalability & Future Enhancements

### Potential Improvements
- Add persistent conversation history (with user consent)
- Support for additional AI providers
- Custom prompt templates
- Voice profile saving
- Multi-language support
- Real-time translation
- Voice command shortcuts

### Architecture Flexibility
- Modular command structure allows easy addition of features
- State management can be extended without refactoring
- Hook-based business logic separates concerns
- CSS custom properties enable theming

## Error Handling Strategy

### Frontend Error Handling
- Try-catch blocks in async operations
- User-friendly error messages in UI
- Graceful fallbacks for missing features
- Console logging for debugging

### Backend Error Handling
- Result types for Rust functions
- Detailed error messages returned to frontend
- API error response parsing
- Network error handling

### User Communication
- Toast notifications for operations
- Error messages in response sections
- Disabled states for unavailable features
- Help text and tooltips
