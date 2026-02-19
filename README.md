# Angel AI Assistant

A lightweight, privacy-focused Windows desktop application that provides real-time speech-to-text transcription and AI-powered responses. Built with Tauri, React, and Rust for optimal performance and security.

## Features

- **Real-time Speech-to-Text**: Live transcription using the Web Speech API
- **AI-Powered Responses**: Integrates with Google Gemini or OpenAI APIs
- **Always-On-Top Window**: Keep the app visible while working
- **Screen Sharing Mode**: Hide the app from screen recordings and captures
- **Global Hotkeys**: Press spacebar anywhere to start/stop recording
- **Local Privacy**: All audio processing is done locally, transcripts are not stored permanently
- **Minimalist Design**: Clean, distraction-free interface
- **Frameless Window**: Modern, customizable window interface

## System Requirements

- **OS**: Windows 10 or later (64-bit)
- **RAM**: 2GB minimum, 4GB recommended
- **Microphone**: Required for speech recognition
- **Internet**: Required for AI API calls
- **Browser**: Modern Chromium-based browser for Web Speech API support

## Getting Started

### Development Setup

#### Prerequisites

1. **Rust** (latest stable)
   - Download from https://rustup.rs/
   - Run the installer and follow the prompts

2. **Node.js** (v16 or later)
   - Download from https://nodejs.org/
   - Install the LTS version

3. **Tauri CLI** (optional but recommended)
   ```bash
   npm install -g @tauri-apps/cli
   ```

#### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd angel-ai-assistant
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure API Keys
   - Run the development server (see below)
   - Click the Settings icon in the app
   - Enter your API key for Google Gemini or OpenAI

#### Running Development Server

```bash
npm run dev
```

This will start the Tauri development server with hot-reload enabled for the React frontend.

### Building for Production

#### Prerequisites

- Windows SDK for building Windows MSI installer

#### Build Process

1. Create a production build
   ```bash
   npm run build
   ```

   This will:
   - Build the React frontend optimized for production
   - Compile the Rust backend
   - Generate the Windows MSI installer in `src-tauri/target/release/bundle/msi/`

2. The MSI installer can be distributed and installed on other Windows machines

## Configuration

### API Keys

The app requires an API key for AI functionality:

#### Google Gemini API
1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Add it in the app's Settings

#### OpenAI API
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it in the app's Settings

### Keyboard Shortcuts

- **Spacebar**: Start/stop recording (works globally)
- **Escape**: Close settings modal
- **Settings Button**: Click the gear icon to access settings

## Architecture

### Frontend (React + TypeScript)
- **State Management**: Zustand for global state
- **Components**: Modular, CSS Modules for styling
- **Hooks**: Custom hooks for speech recognition and AI queries

### Backend (Rust + Tauri)
- **Window Management**: Control window properties (always-on-top, opacity, etc.)
- **Settings Storage**: Secure storage for API keys in the user's local data directory
- **API Integration**: Handles requests to Google Gemini and OpenAI APIs

## Privacy & Security

- **Local Processing**: All audio transcription happens locally using Web Speech API
- **Secure Storage**: API keys are stored in encrypted format in the user's local directory
- **No Data Retention**: Transcripts are not stored after processing
- **Transparent Communication**: Only communicates with configured AI APIs when needed

## Troubleshooting

### Microphone Access Denied
- Check Windows microphone permissions
- Go to Settings > Privacy & Security > Microphone
- Ensure the app has permission to access the microphone

### Speech Recognition Not Working
- Ensure you're using a Chromium-based browser engine
- Check internet connection
- Try refreshing the app

### API Key Errors
- Verify the API key is correct
- Check that the selected API provider matches your key
- Ensure you have remaining API quota

### Screen Sharing Toggle Not Working
- The feature may be limited on some Windows versions
- Try running the app as Administrator
- Use "Hide from Sharing" as a visual indicator that the app is in privacy mode

## Building Custom Installers

For deployment, you can configure:

1. **Code Signing** (for production releases)
   - Edit `src-tauri/tauri.conf.json` to add signing configuration

2. **Auto-Updates**
   - Configure update endpoint in `src-tauri/tauri.conf.json`
   - Implement update server or use Tauri's updater

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please visit the GitHub repository issues page.

## CI/CD Pipeline

### GitHub Actions

The project includes automated builds and releases using GitHub Actions. On each release:

1. **Trigger**: Push to main branch with a version tag (e.g., `v0.1.0`)
2. **Build**: Automatically builds Windows MSI installer
3. **Artifact**: Uploads the installer as a release artifact

See `.github/workflows/build.yml` for the complete workflow configuration.

## Development Tips

- **Hot Reload**: Changes to React components automatically reload during development
- **DevTools**: Press `Ctrl+Shift+I` to open developer tools in dev mode
- **Rust Changes**: Restart the dev server when modifying Rust backend code

## Version History

- **0.1.0** (Initial Release)
  - Real-time speech-to-text transcription
  - AI-powered responses
  - Always-on-top window
  - Screen sharing hide mode
  - Global spacebar hotkey
  - Settings page with API key configuration
