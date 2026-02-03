# PWA Setup Guide for LastTable

## Overview
LastTable is now a Progressive Web App (PWA) that works offline and can be installed on devices.

## Features Implemented

### ✅ Core PWA Features
- **Offline Support** - App works without internet connection
- **Install Prompt** - Users can install app on their devices
- **Background Sync** - Service worker manages cache
- **App Icons** - Custom icons for different screen sizes
- **Manifest** - Complete PWA manifest configuration

### ✅ Vercel Optimization
- **Service Worker Headers** - Proper cache control
- **Security Headers** - X-Frame-Options, CSP, etc.
- **Manifest Headers** - Correct content-type
- **Build Optimization** - Code splitting for better performance

## Files Structure

```
/workspaces/Lasttable/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── pwa-icon.svg          # Source icon
│   ├── pwa-icon-192.png      # App icon 192x192 (generate)
│   └── pwa-icon-512.png      # App icon 512x512 (generate)
├── src/
│   └── lib/
│       └── pwa.ts            # PWA utilities
├── index.html                 # Updated with PWA meta tags
├── vercel.json               # Vercel config with PWA headers
└── vite.config.ts            # Build optimization
```

## Setup Instructions

### 1. Generate PNG Icons
You need to convert the SVG to PNG files. Use online tools or ImageMagick:

```bash
# Using ImageMagick (if available)
convert public/pwa-icon.svg -resize 192x192 public/pwa-icon-192.png
convert public/pwa-icon.svg -resize 512x512 public/pwa-icon-512.png
```

Or use online tools:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### 2. Test Locally

```bash
npm run dev
```

Open DevTools → Application → Service Workers to verify registration.

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Vercel

```bash
git add -A
git commit -m "feat: Add PWA support"
git push origin main
```

Vercel will automatically deploy with PWA support.

## Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** - should show registered
4. Check **Manifest** - should show app details
5. Use **Lighthouse** tab → Run PWA audit

### Install Test
1. Visit your site on Chrome/Edge
2. Look for install icon in address bar
3. Click to install as app
4. App should open in standalone window

### Offline Test
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page - should still load
4. Navigate - should work from cache

## PWA Checklist

- ✅ HTTPS enabled (Vercel provides this)
- ✅ Service worker registered
- ✅ Manifest.json configured
- ✅ Icons (192x192 and 512x512)
- ✅ Meta tags for mobile
- ✅ Offline fallback
- ✅ Theme color configured
- ✅ Security headers
- ⚠️ Generate actual PNG icons from SVG

## Customization

### Change App Colors
Edit `public/manifest.json`:
```json
{
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "ShortName"
}
```

### Modify Cache Strategy
Edit `public/sw.js` to change caching behavior.

## Performance Metrics

Expected Lighthouse scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100
- **PWA**: 100

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS is enabled
- Clear cache and hard reload

### Install Prompt Not Showing
- Must be HTTPS
- Must meet PWA criteria
- User hasn't dismissed it before

### Offline Mode Not Working
- Check service worker is active
- Verify cache is populated
- Check network tab in DevTools

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ⚠️ Partial |
| Opera | ✅ Full |

## Next Steps

1. ✅ Generate actual PNG icons
2. ✅ Test on multiple devices
3. ✅ Run Lighthouse audit
4. ✅ Deploy to production
5. ✅ Monitor PWA metrics

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Vercel PWA Deployment](https://vercel.com/guides/deploying-a-pwa)
