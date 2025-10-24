# 🌅 Sunset Theme

A warm, orange-themed Discord theme with floating panels and optimized performance.

## Installation

### Vencord

1. Open Discord → **Settings** → **Vencord** → **Themes**
2. Click **"Open Themes Folder"**
3. Create `sunset.theme.css` and paste:

```css
/**
 * @name Sunset Theme
 * @author Mihai
 * @version 1.0.0
 */

@import url('https://raw.githubusercontent.com/MihaiStraculencu/sunset_theme/master/build/sunset.css');
```

4. Enable the theme in Discord

## Development

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

### Run

```bash
npm run dev
```

Edit files in `/src` - changes auto-compile to your themes folder.

### Build

```bash
npm run build
```

---

Made by **Mihai**
