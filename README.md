# 🌅 Sunset Theme

A warm, orange-themed Discord theme with floating panels and optimized performance.

## Installation

### Method 1: Online Themes (Easiest)

1. Open Discord → **Settings** → **Vencord** → **Themes**
2. Click **"Online Themes"** tab
3. Paste this URL:
```
https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/themes/sunset.theme.css
```
4. Click **"Add Theme"** and enable it

### Method 2: Download File

1. Download [`sunset.theme.css`](https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/themes/sunset.theme.css)
2. Open Discord → **Settings** → **Vencord** → **Themes** → **"Open Themes Folder"**
3. Drag and drop the downloaded file into the folder
4. Enable the theme in Discord

## ⚡ Performance

This theme is highly optimized for performance:
- **42% smaller** in production builds (63KB vs 110KB)
- **Smart caching** prevents unnecessary rebuilds
- **Autoprefixer** ensures cross-browser compatibility
- **CSS optimization** with automatic minification

See [PERFORMANCE.md](PERFORMANCE.md) for detailed information.

## 🛠️ Development

### Setup

```bash
git clone https://github.com/MihaiStraculencu/sunset_theme.git
cd sunset_theme
npm install
```

### Create `.env`

```env
DEV_OUTPUT_PATH=C:\Users\YourName\AppData\Roaming\Vencord\themes\sunset-dev.theme.css
```

### Available Commands

#### Development Mode (Hot Reload)
```bash
npm run dev
```
Watches for file changes and automatically rebuilds to your themes folder.

#### Development Build
```bash
npm run build
```
Creates an unminified build with autoprefixer (~110KB).

#### Production Build
```bash
npm run build:production
```
Creates an optimized, minified build for distribution (~63KB, 42% smaller).

#### Analyze Bundle
```bash
npm run analyze
```
Shows detailed statistics about your CSS (rules, selectors, colors, etc.).

### Project Structure

```
src/
├── main.css              # Core theme styles
├── colors.css            # Color variables
├── animations.css        # Animation definitions
├── chatbar.css          # Chat input styling
├── top-bar.css          # Top bar styling
├── user-panel.css       # User panel styling
└── ...                  # Other modular CSS files

scripts/
├── build.js             # Production build script
├── dev.js               # Development watch script
└── utils.js             # Shared utilities

build/
└── sunset.css           # Generated output file
```

### Build System Features

- **PostCSS Processing**: Automatic vendor prefixing and optimization
- **Smart Caching**: Skips rebuilds when files haven't changed
- **Debounced Watching**: Groups rapid changes to prevent build spam
- **CSS Minification**: Production builds are 42% smaller
- **Performance Metrics**: Track build times and file sizes
- **Error Handling**: Clear error messages and graceful failures

