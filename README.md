# Money Conversion SPA
*shiro — where style meets function*

**Category: Finance Live Project**  
**Live:** [https://trading-bot-sh1r00-332.netlify.app](https://trading-bot-sh1r00-332.netlify.app)  
**GitHub:** [TradingBot](https://github.com/sh1r00/TradingBot)  

## About This Project

Curated money-making resources and income calculator. Trading tools, financial calculators, and resource aggregation.

**Tech:** 
Nuxt 4, Vue 3, Pinia, Tailwind CSS, PWA, Dark Mode, M3 Design

[![shiro](https://img.shields.io/badge/shiro-where_style_meets_function-6C5CE7)](https://shiro-portfolio-sh1r00.netlify.app)

## Deployment

```bash
npx nuxi generate
```bash
Deploy .output/public to Netlify via: npx netlify deploy --prod --dir=.output/public
```

## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run generate
   ```

4. Preview production build:
   ```bash
   npx serve .output/public
   ```

## Notes

- Built with Nuxt 4 (compatibilityVersion 4) and Vue 3 Composition API
- All projects use atomic design: atoms/ → molecules/ → organisms/
- Dark mode is SSR-safe via Pinia store with useCookie() persistence
- PWA configured with service worker for offline access
- CSP headers configured via nuxt-security module (production only)
- i18n supports 3 locales: English, Español, አማርኛ

---

*Made with ❤️ by shiro — rasisg@gmail.com — github.com/sh1r00*

---

## 📚 Documentation & Pitfalls

Full documentation (steps, functionality, pitfalls & fixes): [DOCUMENTATION.md](DOCUMENTATION.md)
