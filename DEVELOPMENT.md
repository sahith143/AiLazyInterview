# Development Guide

## Project Structure

```
angel-ai-assistant/
├── src/                          # React Frontend
│   ├── components/              # React components
│   │   ├── Header.tsx
│   │   ├── MicrophoneButton.tsx
│   │   ├── TranscriptLog.tsx
│   │   ├── AIResponse.tsx
│   │   ├── SettingsModal.tsx
│   │   └── Controls.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useSpeechRecognition.ts
│   │   ├── useGlobalShortcuts.ts
│   │   └── useAiQuery.ts
│   ├── store/                   # Zustand state management
│   │   └── useAppStore.ts
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   └── main.tsx                 # Entry point
│
├── src-tauri/                   # Tauri Rust Backend
│   ├── src/
│   │   ├── commands/            # Tauri commands
│   │   │   ├── mod.rs
│   │   │   ├── window.rs        # Window management
│   │   │   ├── ai.rs            # AI API integration
│   │   │   └── settings.rs      # Settings storage
│   │   └── main.rs              # App entry point
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri config
│   └── build.rs                 # Build script
│
├── .github/
│   └── workflows/
│       └── build.yml            # GitHub Actions CI/CD
│
├── package.json                 # Node dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
└── README.md                    # Documentation
```

## Key Technologies

### Frontend
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Zustand**: Lightweight state management
- **Web Speech API**: Browser-native speech recognition
- **CSS Modules**: Component-scoped styling

### Backend
- **Tauri 1.5**: Desktop app framework
- **Rust**: System-level operations
- **Tokio**: Async runtime
- **Reqwest**: HTTP client for API calls

### Build Tools
- **Vite**: Fast build tool and dev server
- **Cargo**: Rust package manager

## Development Workflow

### 1. Starting Development Server

```bash
npm run dev
```

This launches:
- Vite dev server on `http://localhost:5173`
- Tauri app window with hot reload
- Rust backend compilation

### 2. Making Changes

#### React Components
- Edit files in `src/components/`
- Changes hot-reload automatically
- No need to restart the app

#### Rust Backend
- Edit files in `src-tauri/src/`
- Requires restarting the dev server
- Changes will recompile automatically on save

#### Styles
- Edit `.module.css` files alongside components
- Changes hot-reload automatically
- Follow the CSS custom properties system

#### State Management
- Modify `src/store/useAppStore.ts` for global state
- Use hooks in components: `const { state, setter } = useAppStore()`

### 3. Testing Locally

#### Testing Settings Storage
```typescript
// Clear stored settings
await invoke('clear_api_key', { provider: 'gemini' })

// Load settings
const key = await invoke('load_api_key', { provider: 'gemini' })
```

#### Testing Window Commands
```typescript
// Toggle always-on-top
await invoke('set_always_on_top', { alwaysOnTop: true })

// Change opacity
await invoke('set_window_opacity', { opacity: 0.5 })

// Ignore cursor events
await invoke('set_ignore_cursor_events', { ignore: true })
```

#### Testing Speech Recognition
1. Enable microphone in browser
2. Click microphone button or press spacebar
3. Speak clearly for best results
4. Wait for processing to complete

## Adding New Features

### Adding a New Component

1. Create the component file in `src/components/`
2. Create a `ComponentName.module.css` for styles
3. Import and use in parent component
4. Export from component index if needed

Example:
```typescript
// src/components/NewFeature.tsx
import React from 'react'
import styles from './NewFeature.module.css'

export const NewFeature: React.FC = () => {
  return <div className={styles.container}>Feature</div>
}
```

### Adding State to Zustand Store

1. Edit `src/store/useAppStore.ts`
2. Add new state properties and setters
3. Import in components: `const { prop, setProp } = useAppStore()`

```typescript
// Add to AppState interface
myNewState: string
setMyNewState: (value: string) => void

// Add to create hook
myNewState: '',
setMyNewState: (value) => set({ myNewState: value }),
```

### Adding a Tauri Command

1. Create a new file in `src-tauri/src/commands/`
2. Implement the command function with `#[tauri::command]`
3. Add to `mod.rs` exports
4. Add to handler in `main.rs`

Example:
```rust
// src-tauri/src/commands/example.rs
#[tauri::command]
pub async fn my_command(param: String) -> Result<String, String> {
  Ok(format!("Result: {}", param))
}

// In main.rs invoke handler
.invoke_handler(tauri::generate_handler![my_command])

// In React component
const result = await invoke('my_command', { param: 'value' })
```

### Adding a Custom Hook

1. Create file in `src/hooks/`
2. Follow naming convention: `useFeatureName.ts`
3. Import and use in components

```typescript
// src/hooks/useNewHook.ts
import { useCallback } from 'react'

export const useNewHook = () => {
  const doSomething = useCallback(() => {
    // Implementation
  }, [])

  return { doSomething }
}
```

## Building

### Development Build
```bash
npm run build
```

Creates optimized frontend build in `dist/`

### Production Build
```bash
npm run build:windows
```

Creates Windows MSI installer in `src-tauri/target/release/bundle/msi/`

## Debugging

### Frontend Debugging
- Press `Ctrl+Shift+I` to open DevTools in dev mode
- Use browser console for debugging
- Check Network tab for API calls

### Rust Debugging
- Use `println!` macros for logging
- Logs appear in terminal running `npm run dev`
- Use `eprintln!` for error logging

### Speech Recognition Debugging
Add debugging to `useSpeechRecognition.ts`:
```typescript
recognitionRef.current.onresult = (event: any) => {
  console.log('Recognition event:', event)
  // ... rest of logic
}
```

## Performance Optimization

### Frontend
- Use `React.memo` for components that receive same props
- Use `useCallback` for stable function references
- Implement virtualization for large lists if needed

### Backend
- Use async/await for non-blocking operations
- Cache API responses when appropriate
- Minimize window state changes

## Testing Checklist

Before submitting changes:

- [ ] Frontend builds without errors
- [ ] React components render correctly
- [ ] State updates work as expected
- [ ] API calls complete successfully
- [ ] Speech recognition captures audio
- [ ] Settings are saved and loaded
- [ ] Window controls work (always-on-top, opacity)
- [ ] No console errors

## Common Issues

### Rust Compilation Errors
- Run `cargo clean` in `src-tauri/`
- Ensure Rust toolchain is up to date: `rustup update`
- Check for syntax errors

### Speech Recognition Not Working
- Ensure microphone permissions are granted
- Check that browser supports Web Speech API
- Verify internet connection for cloud API

### Build Fails on Windows
- Install Windows SDK
- Run as Administrator if permission issues
- Check available disk space

## Code Style Guidelines

### TypeScript/React
- Use functional components with hooks
- Prefer const over let/var
- Use strict TypeScript types
- Keep components focused and single-responsibility

### Rust
- Follow Rust naming conventions (snake_case)
- Use type annotations for clarity
- Handle errors with Result types
- Add comments for complex logic

### CSS
- Use CSS custom properties for theming
- Follow BEM naming for classes
- Use CSS Modules to avoid conflicts
- Keep responsive design in mind

## Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [React Documentation](https://react.dev/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
