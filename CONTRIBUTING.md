# Contributing to Angel AI Assistant

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We're building a welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/angel-ai-assistant.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in [SETUP.md](SETUP.md)

## Development Guidelines

### Code Style

#### TypeScript/React
```typescript
// ✓ Preferred
const MyComponent: React.FC = () => {
  const { state, setState } = useAppStore()

  const handleClick = useCallback(() => {
    setState(newValue)
  }, [setState])

  return <div>Content</div>
}

// ✗ Avoid
function MyComponent() {
  const state = useAppStore().state;
  return <div onClick={() => useAppStore().setState(val)}>Content</div>
}
```

Key principles:
- Use functional components with hooks
- Prefer const over let/var
- Use TypeScript types (avoid `any`)
- Keep components focused and simple
- Memoize callbacks with useCallback

#### Rust
```rust
// ✓ Preferred
#[tauri::command]
pub async fn my_command(param: String) -> Result<String, String> {
  do_something(&param).await.map_err(|e| e.to_string())
}

// ✗ Avoid
#[tauri::command]
pub fn my_command(param: String) -> String {
  do_something(&param).unwrap()
}
```

Key principles:
- Use async/await for I/O operations
- Return Result types for errors
- Add meaningful error messages
- Follow Rust naming conventions

#### CSS
```css
/* ✓ Preferred */
.component {
  padding: var(--spacing-md);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.component:hover {
  background-color: var(--color-bg-tertiary);
}

/* ✗ Avoid */
.component {
  padding: 16px;
  color: #e8ecf1;
  transition: 0.3s;
  background: blue; /* hard-coded colors */
}
```

Key principles:
- Use CSS custom properties (variables)
- Use consistent spacing system
- Prefer CSS transitions over animations
- Use CSS Modules to scope styles

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat(recording): add pause functionality`
- `fix(ui): correct button color contrast`
- `docs: update API documentation`
- `refactor(store): simplify state management`

### File Organization

Keep files small and focused:
- Components: 100-200 lines max
- Hooks: 50-150 lines max
- Styles: One .module.css per component
- Utilities: Group related functions

## Making Changes

### Adding a Feature

1. Create a feature branch
2. Make focused, atomic commits
3. Write clear commit messages
4. Test thoroughly before submitting

**Example: Add support for custom prompts**

1. Create component: `src/components/PromptEditor.tsx`
2. Add state: Update `useAppStore.ts`
3. Add command: Create `src-tauri/src/commands/prompts.rs`
4. Add tests and documentation

### Fixing a Bug

1. Create a branch with bug fix name: `fix/describe-issue`
2. Write a test case that reproduces the bug
3. Fix the bug with minimal changes
4. Verify the test passes
5. Submit PR with issue reference

### Writing Tests

Add tests for new features (when testing infrastructure is set up):

```typescript
// Example test structure
describe('useSpeechRecognition', () => {
  it('should start listening when called', () => {
    // Test implementation
  })

  it('should handle errors gracefully', () => {
    // Test implementation
  })
})
```

## Submitting Changes

### Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin your-branch
   ```

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues: `Fixes #123`
   - Describe changes clearly
   - Include before/after screenshots if UI changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update

   ## Testing
   How to test the changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-reviewed code
   - [ ] Comments added for clarity
   - [ ] No new warnings generated
   - [ ] Related issues referenced
   ```

### Code Review

During review, maintainers may:
- Ask for clarifications
- Request changes
- Suggest improvements
- Approve and merge

Please be open to feedback and iterate on suggestions.

## Documentation

Document your changes:

- **Code comments**: Explain WHY, not WHAT
- **Function documentation**: Describe parameters and return values
- **README**: Update if feature affects setup or usage
- **DEVELOPMENT.md**: Update if development process changes
- **ARCHITECTURE.md**: Update if architecture changes

## Testing Checklist

Before submitting PR, verify:

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Code follows style guide
- [ ] Tested on Windows (or describe testing)
- [ ] No performance degradation
- [ ] Handles errors gracefully
- [ ] Works with both API providers (Gemini & OpenAI)

## Reporting Issues

### Bug Reports

Include:
- OS version and build
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if applicable
- System specs (RAM, CPU if relevant)

### Feature Requests

Include:
- Clear description of use case
- Example of desired behavior
- Why it would be valuable
- Any alternative approaches considered

## Development Tips

### Debugging

**Frontend:**
```bash
# Enable debug mode in .env
VITE_DEBUG=true

# Use browser DevTools (Ctrl+Shift+I in dev mode)
# Check Network tab for API calls
```

**Backend:**
```rust
// Use println! for debugging (appears in terminal)
println!("Debug info: {:?}", variable);
eprintln!("Error info: {}", error);
```

### Performance Testing

- Use browser DevTools Performance tab
- Check for unnecessary re-renders
- Monitor Tauri process memory usage
- Profile Rust code if needed

### Cross-Platform Testing

While the app targets Windows, ensure:
- No hardcoded paths (use Tauri's path APIs)
- Use cross-platform compatible APIs
- Test on multiple Windows versions if possible

## Release Process

Maintainers follow this process:

1. Update version in `package.json` and `Cargo.toml`
2. Update CHANGELOG
3. Create release PR
4. After merge, create git tag: `git tag v0.1.0`
5. GitHub Actions builds and publishes MSI installer
6. Create release notes

## Community

- **Issues**: GitHub Issues for bug reports and features
- **Discussions**: GitHub Discussions for ideas and questions
- **Security**: Report security issues privately to maintainers

## Learning Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [React Documentation](https://react.dev/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## Questions?

- Check existing issues and discussions
- Review documentation in README, SETUP, DEVELOPMENT
- Ask in GitHub Discussions

Thank you for contributing! 🎉
