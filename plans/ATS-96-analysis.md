# ATS-96 — Corregir enlaces de registro e inicio de sesión de la landing

## Objetivo

Los CTA de registro/login de `candy-store.app` (landing pública) apuntan a `https://candy-store.app/register` y `https://candy-store.app/login`, rutas que no existen en este sitio estático (404). Los flujos reales viven en `https://admin.candy-store.app/{register,login}`. Esto rompe el recorrido principal de adquisición y acceso.

## Contexto Jira

- **Tipo**: Bug · **Prioridad**: Medium · **Estado**: Backlog · **Asignado**: sin asignar
- **Componente**: Frontend · **Labels**: audit-sol, conversion, landing, product-audit
- **Reporter**: salva (2026-09-11)
- **Sin** epic, sin subtareas, sin issues vinculados, sin PRs/branches asociados (`jira_get_issue_development_info` vacío), sin remote links.
- **Origen**: hallazgo F-01 de la auditoría de producto de Sol, verificado en producción y contra código.

## Issues relacionados

Ninguno — issue standalone, sin `issuelinks`. No se hizo búsqueda ampliada (modo express: ticket de un solo repo, AC claros, sin relaciones).

## Confluence

No hay remote links en el issue.

## Desarrollo

Sin PRs, branches ni commits previos asociados a ATS-96.

## Código afectado

Todo en `src/candy-store` (repo estático, deploy vía `wrangler pages deploy .` — sube el directorio completo, así que un archivo no enlazado igual queda publicado):

- `index.html` — 6 enlaces a actualizar:
  - `:391` nav superior — login
  - `:397` nav superior — register
  - `:418` CTA hero — register
  - `:521` CTA card inferior — register
  - `:606` footer — register
  - `:614` footer — login
- `login-link.html` — no enlazado desde ningún HTML, pero publicado igual; contiene un link directo a Cognito (`client_id=1f5e0uo1qf53te31oo2vfksmbg`, redirect a un CloudFront viejo).
- `ui-system.html:492` — **hallazgo no mencionado en el ticket**: demo de un UI kit de terceros (Themesberg), tampoco enlazado desde ningún HTML, pero también publicado, y también contiene el mismo link de Cognito viejo.
- No existe `_redirects` ni páginas locales `/login` o `/register` — confirma que hoy esas rutas caen en 404 de Cloudflare Pages.
- CI relevante: `.github/workflows/lighthouse.yml` corre en PRs contra `main` (buen lugar para un gate de regresión); `deploy.yml` corre post-merge a producción. No hay `package.json` ni tooling Node en el repo — es HTML puro + vendor assets + un Cloudflare Worker de wildcard routing (`worker/worker.js`, no relacionado con este fix).

## Cobertura de tests

No existe testing automatizado en este repo (sin `package.json`, sin specs). AC #5 pide agregarlo — no hay nada previo que cubra ningún AC.

## Decisiones (resueltas con el usuario)

1. **ui-system.html** → eliminar el archivo completo (no solo el link). Contradice AC #3 por su sola presencia pública; es un demo de template sin uso real.
2. **login-link.html** → eliminar el archivo completo (no está enlazado, no cumple función, y garantiza AC #3).
3. **Mecanismo de regresión (AC #5)** → step de CI grep/bash agregado al workflow de Lighthouse (corre en PRs contra `main`), sin sumar dependencias Node nuevas. Debe fallar si:
   - algún `.html` trackeado contiene `candy-store.app/login` o `candy-store.app/register` (el patrón viejo, sin `admin.`);
   - algún `.html` trackeado contiene `cognito` (case-insensitive).

## Alcance final

- Actualizar los 6 hrefs de `index.html` a `https://admin.candy-store.app/{login,register}`.
- Eliminar `login-link.html` y `ui-system.html`.
- Agregar step de CI (grep) en `.github/workflows/lighthouse.yml` que falle ante regresión de estos patrones.
- Verificar visualmente desktop y mobile contra `https://candy-store.app` (AC #4) — pendiente de verificación post-deploy o vía preview de Cloudflare Pages en el PR.
