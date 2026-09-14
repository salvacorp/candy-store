# ATS-96 — Corregir enlaces de registro e inicio de sesión de la landing

## Objective

Los CTA de registro/login de la landing pública apunten a `admin.candy-store.app` (donde viven esas pantallas), y quede un check de CI que impida que vuelvan a apuntar al dominio público o a Cognito.

## Scope

### In Scope
- Actualizar los 6 hrefs de login/register en `index.html` a `https://admin.candy-store.app/{login,register}`.
- Eliminar `login-link.html` y `ui-system.html` (ambos publicados por `wrangler pages deploy .` sin estar enlazados desde ningún HTML; ambos con un link viejo a Cognito).
- Agregar un job de CI (grep, sin dependencias nuevas) en `.github/workflows/lighthouse.yml` que falle el PR si reaparece `https://candy-store.app/(login|register)` o la palabra `cognito` en cualquier `.html` trackeado.
- Verificación visual desktop/mobile de los CTA contra `https://candy-store.app` (AC #4).

### Out of Scope
- Cualquier cambio en `application-frontend` o `administration-service` — las pantallas de `/login` y `/register` ya existen ahí y funcionan; este ticket es solo sobre los links de la landing.
- Mejoras al link-check más allá de grep (ej. link-checker real tipo linkinator) — se descartó en análisis por requerir sumar tooling Node a un repo que hoy no lo tiene.
- Redirects de `candy-store.app/login` → `admin.candy-store.app/login` a nivel Cloudflare (`_redirects`) — no lo pide el ticket; si se quisiera cubrir bookmarks viejos externos, es un ticket aparte.

### Dependencies
Ninguna. Sin issues bloqueantes, sin PRs previos.

## Technical Design

### Data Flow
No hay data flow de aplicación — es un sitio estático. El "flujo" es: usuario en `candy-store.app` → click en CTA → navegador navega a la URL del `href`. Hoy esa URL es `candy-store.app/{login,register}` (404, no existe esa ruta en el sitio estático). Después del fix, navega directo a `admin.candy-store.app/{login,register}`, servido por `application-frontend`.

### Files to Modify
| File | Change |
|------|--------|
| `index.html` | Reemplazar los 6 `href="https://candy-store.app/login"` / `.../register"` (líneas 391, 397, 418, 521, 606, 614) por `https://admin.candy-store.app/login` / `.../register` |
| `login-link.html` | Eliminar (no enlazado, sin función, link a Cognito viejo) |
| `ui-system.html` | Eliminar (demo de template de terceros, no enlazado, mismo link a Cognito viejo) |
| `.github/workflows/lighthouse.yml` | Agregar job `link-check` que corre `git ls-files '*.html'` + `grep` para bloquear regresión de los patrones viejos |

### DB Migration
No aplica.

## Tasks
- [x] 1. Actualizar los 6 hrefs de `index.html` a `admin.candy-store.app`
- [x] 2. Eliminar `login-link.html` y `ui-system.html`
- [x] 3. Agregar job `link-check` (grep) a `.github/workflows/lighthouse.yml`
- [x] 4. Verificar localmente: grep de regresión en 0 (scope `*.html` y whole-repo), YAML del workflow válido, dry-run del job pasa limpio, curl server-side confirma los 6 hrefs correctos. **Pendiente**: verificación visual desktop/mobile — Playwright MCP no conectó esta sesión (`CONNECTION_CLOSED`) y no hay otra herramienta de browser cargada; falta correrla manualmente o retomarla en otra sesión con el MCP disponible.

## Risks

| Risk | Mitigation | Rollback |
|------|-----------|----------|
| `login-link.html` o `ui-system.html` tenían un consumidor externo no visible en el repo (bookmark, doc vieja, otro repo) | Ya se confirmó que no están enlazados desde ningún HTML del repo; son archivos de deploy, no rutas de negocio | `git revert` del commit que los borra — Cloudflare Pages redeploya el estado anterior |
| El grep del `link-check` da falso positivo contra `admin.candy-store.app` | Patrón ancla `https://candy-store\.app/` justo después del protocolo, sin subdominio — `admin.candy-store.app` no matchea porque el string difiere entre `://` y `candy-store.app` | Ajustar el patrón en el mismo PR si el CI lo marca en la revisión |
| Cloudflare Pages/CDN sirve `index.html` cacheado con los links viejos tras el deploy | `_headers` no fija cache largo para HTML (solo para `/assets/*`); si igual persiste, purgar caché de Cloudflare Pages para el dominio | No aplica (no es destructivo, solo esperar invalidación o purgar) |

## Estimate
2-3 horas (incluye verificación visual).
