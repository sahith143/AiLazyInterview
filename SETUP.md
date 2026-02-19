# Setup Guide - Angel AI Assistant

Complete setup instructions for developers and users.

## For Users - Using the Application

### System Requirements
- **Windows**: Windows 10 or later (64-bit)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 100MB for installation
- **Microphone**: Required for speech recognition
- **Internet**: Required for AI API calls

### Installation

1. Download the MSI installer from the [Releases page](https://github.com/yourusername/angel-ai-assistant/releases)
2. Double-click the `.msi` file to start installation
3. Follow the installation wizard
4. Launch the application from Start Menu

### First-Time Setup

1. **Get API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/apikey) or [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key to clipboard

2. **Configure API Key**
   - Open Angel AI Assistant
   - Click the ⚙️ (Settings) icon in the top-right
   - Select your API provider (Google Gemini or OpenAI)
   - Paste your API key in the input field
   - Click "Save"

3. **Allow Microphone Access**
   - Windows may ask for microphone permission
   - Click "Allow" to enable speech recognition

4. **Start Using**
   - Click the microphone button or press **Spacebar** to start talking
   - Speak clearly and naturally
   - Release the microphone when done
   - Wait for AI response to appear

## For Developers - Development Setup

### Prerequisites Installation

#### 1. Install Rust

```bash
# Download and run the Rust installer
# https://rustup.rs/

# Or if on Linux/Mac:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

#### 2. Install Node.js

```bash
# Download from https://nodejs.org/
# Choose LTS version (18+)

# Verify installation
node --version
npm --version
```

#### 3. Install Tauri CLI (Optional)

```bash
npm install -g @tauri-apps/cli
```

### Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/angel-ai-assistant.git
cd angel-ai-assistant

# 2. Install dependencies
npm install

# 3. Configure environment (optional)
# Create .env file if needed for local development
cp .env.example .env

# 4. Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the project root for local development (optional):

```env
# API Configuration (for testing)
VITE_API_PROVIDER=gemini

# Optional: Pre-fill API key for testing (not recommended for production)
VITE_DEFAULT_API_KEY=
```

## Development Workflow

### Starting Development

```bash
# Terminal 1: Start Tauri dev server
npm run dev

# This will:
# - Start Vite dev server (http://localhost:5173)
# - Compile Rust backend
# - Open the Tauri app window
# - Enable hot reload for React changes
```

### Building for Distribution

```bash
# Full production build (requires Rust)
npm run build:windows

# This generates:
# - Optimized frontend in dist/
# - Compiled Rust backend
# - MSI installer in src-tauri/target/release/bundle/msi/
```

### Development Commands

```bash
# Build frontend only (no Rust compilation)
npm run build

# Preview production build
npm run preview

# Run tests (add testing as needed)
npm test

# Format code (add Prettier as needed)
npm run format
```

## Troubleshooting

### Rust Not Installed

**Error**: `rustc: command not found`

**Solution**:
```bash
# Install Rust from https://rustup.rs/
# Or update existing installation:
rustup update
```

### Node Modules Issues

**Error**: `npm ERR! ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Tauri Build Fails

**Error**: `No such file or directory` when building

**Solution**:
```bash
# Ensure Rust toolchain is installed
rustup show

# Clean and rebuild
cargo clean
npm run build:tauri
```

### Speech Recognition Not Working

**Symptoms**: Microphone button doesn't respond

**Solutions**:
1. Check microphone permissions in Windows Settings
2. Verify microphone hardware is working
3. Restart the application
4. Try a different browser/Chromium version

### API Key Errors

**Error**: `API key not configured` or `Invalid API key`

**Solutions**:
1. Verify API key is correct in settings
2. Check API provider matches the key type
3. Ensure API has remaining quota
4. Check internet connection

### Window Not Showing

**Error**: Application window doesn't appear

**Solutions**:
```bash
# Clear cache and rebuild
rm -rf dist src-tauri/target
npm install
npm run dev
```

## Configuration Files

### `tauri.conf.json`
- Configures window properties, permissions, and build settings
- Edit to change window size, title, or allowed APIs

### `vite.config.ts`
- Configures Vite build tool
- Includes React plugin configuration
- Minification and optimization settings

### `tsconfig.json`
- TypeScript compiler configuration
- Type checking rules and output targets

### `package.json`
- npm dependencies and scripts
- Project metadata and version

## Advanced Configuration

### Custom Window Properties

Edit `src-tauri/tauri.conf.json`:
```json
{
  "tauri": {
    "windows": [{
      "width": 1000,
      "height": 700,
      "minWidth": 600,
      "minHeight": 400
    }]
  }
}
```

### Custom Keyboard Shortcuts

Edit `src/hooks/useGlobalShortcuts.ts` to add new shortcuts

### Custom API Providers

Edit `src-tauri/src/commands/ai.rs` to add new AI providers

## Next Steps

1. **Configure API Key**: Get your API key from Google or OpenAI
2. **Start Development**: Run `npm run dev`
3. **Read DEVELOPMENT.md**: For detailed development guide
4. **Join Community**: Check GitHub Issues for discussions

## Support & Resources

- **Documentation**: See README.md and DEVELOPMENT.md
- **Issues**: Report bugs on GitHub Issues
- **Tauri Docs**: https://tauri.app/v1/guides/
- **React Docs**: https://react.dev/
- **Rust Book**: https://doc.rust-lang.org/book/

## License

This project is licensed under the MIT License.
