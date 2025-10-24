# 🌅 Sunset Theme

A warm, orange-themed Discord theme with floating panels, liquid glass effects, and optimized performance.

## 🚀 Installation (Vencord)

### Method 1: Direct Import (Recommended)

1. Open Discord and go to **Settings**
2. Navigate to **Vencord** → **Themes**
3. Click **"Open Themes Folder"**
4. Create a new file called `sunset.theme.css`
5. Paste this into the file:

```css
/**
 * @name Sunset Theme
 * @description A warm, orange-themed Discord theme with floating panels and optimized performance.
 * @author Mihai Straculencu
 * @version 1.0.0
 */

@import url('https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/build/sunset.css');
```

6. Save the file and **enable the theme** in Discord settings

### Method 2: Download Theme File

1. Download [`sunset.theme.css`](https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/themes/sunset.theme.css)
2. Open Discord **Settings** → **Vencord** → **Themes** → **Open Themes Folder**
3. **Drag and drop** the downloaded file into the themes folder
4. **Enable** the theme in Discord settings

### Method 3: Online Theme Link

1. Open Discord **Settings** → **Vencord** → **Themes**
2. Click **"Online Themes"** tab
3. Paste this URL:
```
https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/themes/sunset.theme.css
```
4. Click **"Add Theme"** and enable it

---

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
- Discord with [Vencord](https://vencord.dev/) installed

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/MihaiStraculencu/sunset_theme.git
cd sunset_theme
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** in the project root:
```env
DEV_OUTPUT_PATH=C:\Users\YourName\AppData\Roaming\Vencord\themes\sunset-dev.theme.css
```

Replace `YourName` with your Windows username.

**For other systems:**
- **Windows**: `C:\Users\YourName\AppData\Roaming\Vencord\themes\sunset-dev.theme.css`
- **macOS**: `/Users/YourName/Library/Application Support/Vencord/themes/sunset-dev.theme.css`
- **Linux**: `~/.config/Vencord/themes/sunset-dev.theme.css`

4. **Start development server:**
```bash
npm run dev
```

The dev server will watch for changes in `/src` and automatically compile to your Vencord themes folder.

5. **Enable the theme** in Discord:
   - Go to **Settings** → **Vencord** → **Themes**
   - Enable `sunset-dev.theme.css`

6. **Edit CSS files** in the `/src` directory:
   - Changes will auto-compile and reload in Discord
   - Press `Ctrl+R` in Discord to see updates

### Project Structure

```
sunset_theme/
├── src/                    # Source CSS modules (edit these)
│   ├── main.css           # Core layout & panels
│   ├── colors.css         # Color definitions
│   ├── animations.css     # Transitions & animations
│   ├── chatbar.css        # Liquid glass chat bar
│   ├── dms-button.css     # Home button styling
│   ├── top-bar.css        # Title bar customization
│   ├── window-controls.css # Window buttons
│   ├── custom-icons.css   # Fluent icons
│   ├── friends-list.css   # Friends list styling
│   ├── user-panel.css     # User panel options
│   ├── transparency-blur.css # Blur effects
│   └── background-image.css # Background support
├── themes/
│   └── sunset.theme.css   # Main theme file with variables
├── build/
│   └── sunset.css         # Compiled output (auto-generated)
└── scripts/
    ├── dev.js            # Development watcher
    └── build.js          # Production builder
```

### Build for Production

```bash
npm run build
```

This compiles all `/src` files into `build/sunset.css`.

### Making Changes

1. **Edit files in `/src`** directory
2. Dev server will automatically compile changes
3. **Reload Discord** (`Ctrl+R`) to see updates
4. **Test thoroughly** before committing

### Customization

You can customize the theme by editing variables in `themes/sunset.theme.css`:

```css
body {
    /* Colors */
    --orange-1: oklch(78% 0.15 35);
    --orange-2: oklch(73% 0.15 35);
    
    /* Fonts */
    --font: -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Layout */
    --gap: 18px;
    --border-thickness: 0px;
    
    /* Performance */
    --animations: on;
    --panel-blur: off;
}
```

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

**Author**: Mihai Straculencu  
**Repository**: https://github.com/MihaiStraculencu/sunset_theme
