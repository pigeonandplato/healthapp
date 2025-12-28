# PWA Icons

## Required Icons

The app needs the following icon sizes for full PWA support:

- `icon-192x192.png` - Standard icon for Android
- `icon-512x512.png` - Large icon for Android splash screen

## Creating Icons

You can convert the `icon.svg` to PNG using:

```bash
# Using ImageMagick (if installed)
convert -background none -resize 192x192 icon.svg icon-192x192.png
convert -background none -resize 512x512 icon.svg icon-512x512.png

# Or use an online converter like:
# - https://cloudconvert.com/svg-to-png
# - https://convertio.co/svg-png/
```

## Temporary Solution

For development, the app will fall back to the SVG icon if PNGs are not available. For production, generate proper PNG icons using the methods above.



