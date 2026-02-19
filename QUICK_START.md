# Quick Start Guide - Angel AI Assistant

Get up and running in 5 minutes.

## For Users

### Installation
1. Download `angel-ai-assistant.msi` from [Releases](https://github.com/yourusername/angel-ai-assistant/releases)
2. Double-click and follow installer
3. Launch from Start Menu

### First Use
1. Open the app
2. Click ⚙️ Settings button (top-right)
3. Get API key from [Google AI Studio](https://aistudio.google.com/apikey) or [OpenAI](https://platform.openai.com/api-keys)
4. Paste key and click "Save"
5. Press **Spacebar** to talk
6. Watch the magic happen! ✨

## For Developers

### Setup (5 minutes)

```bash
# 1. Install prerequisites (one time)
# Download Node.js from https://nodejs.org/
# Download Rust from https://rustup.rs/

# 2. Clone and setup
git clone https://github.com/yourusername/angel-ai-assistant.git
cd angel-ai-assistant
npm install

# 3. Start developing
npm run dev
```

### Daily Workflow

```bash
# Start dev server (hot reload enabled)
npm run dev

# Make changes to React components - instant reload!
# Edit src/components/Header.tsx and see changes immediately

# When happy, create production build
npm run build

# Build full Tauri app (requires Rust)
npm run build:tauri
```

## Project Layout

```
src/                 ← React code (edit here!)
├── components/      ← UI Components
├── hooks/           ← Business logic
└── store/           ← State management

src-tauri/          ← Rust code (backend)
├── src/commands/   ← Tauri commands
└── tauri.conf.json ← App config
```

## Common Tasks

### Add a new button
```typescript
// src/components/MyComponent.tsx
export const MyComponent = () => (
  <button onClick={() => console.log('Clicked!')}>
    Click me
  </button>
)

// Use in App.tsx
import MyComponent from './components/MyComponent'
```

### Style a component
```typescript
// src/components/MyComponent.tsx
import styles from './MyComponent.module.css'

export const MyComponent = () => (
  <div className={styles.container}>Content</div>
)
```

```css
/* src/components/MyComponent.module.css */
.container {
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
}
```

### Add global state
```typescript
// In src/store/useAppStore.ts
myNewState: string
setMyNewState: (value: string) => void

// In component
const { myNewState, setMyNewState } = useAppStore()
```

### Call Tauri backend
```typescript
// In component
import { invoke } from '@tauri-apps/api/tauri'

const result = await invoke('my_command', { param: 'value' })
```

```rust
// src-tauri/src/commands/my_command.rs
#[tauri::command]
pub async fn my_command(param: String) -> Result<String, String> {
  Ok(format!("Received: {}", param))
}
```

## Keyboard Shortcuts

- **Spacebar**: Start/stop recording
- **Escape**: Close settings
- **Ctrl+Shift+I**: Open DevTools (dev mode only)

## Debugging

### See console logs
- Press `Ctrl+Shift+I` in dev mode
- Check "Console" tab
- Rust logs appear in terminal

### Check API calls
- Open DevTools Network tab
- Look for `generativelanguage.googleapis.com` or `api.openai.com`

### Test microphone
- Click microphone button
- Speak clearly
- Check console for errors

## API Configuration

### Google Gemini (Free!)
1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy and paste in settings

### OpenAI (Paid)
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and paste in settings

## Build for Release

```bash
# Build Windows MSI installer
npm run build:windows

# Output: src-tauri/target/release/bundle/msi/
# Share the .msi file!
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Microphone not working | Check Windows Settings > Privacy > Microphone |
| API key error | Verify key is correct and has quota |
| App won't start | Check `npm run dev` for errors |
| Build fails | Run `npm install` again |

## File Structure Quick Reference

```
angel-ai-assistant/
├── src/
│   ├── components/          ← Add new UI here
│   ├── hooks/              ← Add business logic here
│   ├── store/              ← Global state
│   └── App.tsx             ← Main app
├── src-tauri/
│   └── src/commands/        ← Add Rust code here
├── README.md               ← User docs
├── DEVELOPMENT.md          ← Dev details
├── ARCHITECTURE.md         ← System design
└── package.json            ← Dependencies
```

## Learn More

- **README.md**: Full feature list and documentation
- **SETUP.md**: Detailed setup and troubleshooting
- **DEVELOPMENT.md**: Development guide and best practices
- **ARCHITECTURE.md**: System design and how it works

## Next Steps

1. ✅ You have the code
2. 🏃 Run `npm run dev`
3. 💬 Make a change
4. 🚀 See it instantly
5. 📦 Build for release with `npm run build:windows`

## Need Help?

- Check GitHub Issues
- Read the full docs (README.md)
- Review DEVELOPMENT.md for detailed guides

---

**Happy coding!** 🎉

Questions? Open an issue or check the docs!
