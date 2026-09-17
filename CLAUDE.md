# candy-store (landing estática)

Sitio estático — HTML/CSS/JS puro, sin build step. Deploy vía Cloudflare Pages (`wrangler pages deploy .` en `.github/workflows/deploy.yml`, sube el directorio completo tal cual).

## Commands

Sin lint, test, format ni dev server — no hay `package.json` ni ningún ecosistema de build. Para probar cambios localmente: `python3 -m http.server` (o cualquier server estático) desde la raíz del repo.

CI existente: `security.yml` (gitleaks), `lighthouse.yml` (Lighthouse audit + job `link-check` de regresión de enlaces), `deploy.yml` (deploy a producción en push a `main`).
