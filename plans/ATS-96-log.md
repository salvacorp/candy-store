- [analyze] Hallazgo fuera del alcance escrito del ticket: `ui-system.html:492` también publica un link viejo de Cognito (no mencionado en la descripción, que solo nombra `login-link.html`). Usuario confirmó incluirlo y eliminar el archivo completo.
- [analyze] `login-link.html` se elimina por completo en vez de actualizar su link — no está enlazado desde ningún HTML, no cumple función.
- [analyze] AC #5 (chequeo de regresión) se resuelve con un step grep/bash en `.github/workflows/lighthouse.yml`, sin sumar package.json/tooling Node — el repo es HTML estático puro y no lo tenía.
- [implement] El grep -l con lista de ~25 archivos como args directos rompe con el grep viejo de macOS (BSD grep 2.6.0-FreeBSD) — da falsos "No such file or directory" mezclados con output. Se resolvió con `git ls-files -z | xargs -0 grep` en vez de `$(git ls-files)` sin comillas — más robusto también en CI (GNU grep/Ubuntu) y con nombres de archivo con espacios.
- [implement] Cometí 3 typos encadenados con Edit en el footer de index.html (borré la "a" de un `</a` y de un `<a` de cierre, corrigiendo mal el segundo). Los detecté re-leyendo el archivo después de cada edit y los corregí. Lección: no asumir el sufijo de una línea sin leerla primero en HTML con `</a\n>` partido en dos líneas.
- [implement] Playwright MCP no conectó esta sesión (CONNECTION_CLOSED) y no hay otra herramienta de browser cargada — verificación visual desktop/mobile de AC #4 queda pendiente, verificado solo estructuralmente (curl server-side + grep).
- [ship] La sesión arrancó parada en `feature/ATS-73-pin-gitleaks` (rama de un ticket ya mergeado, PR #13) en vez de una rama propia de ATS-96. Detectado antes de commitear; se creó `fix/ATS-96-landing-auth-links` desde `main` y se trasladó ahí el trabajo sin commitear, sin arrastrar los 2 commits ajenos.
- [ship] Al separar los commits atómicos, `git rm` (corrido en la implementación) dejó las 2 eliminaciones staged; un `git add index.html && git commit` posterior las arrastró sin querer al commit de fix. Se rehizo la separación verificando `git status --short` después de cada `git add` dirigido.

## Retro

- **Chequeo de rama vs. issue en `/ship`** → agregado a `~/src/salva/claude-flow/commands/ship.md` (paso 1): detener antes de tocar el working tree si la rama actual no coincide con el issue a entregar, y ofrecer crear la rama correcta.
- **Gotcha de `git rm` pre-staged** → agregado a `~/src/salva/claude-flow/commands/ship.md` (paso 4): correr `git status --short` después de cada `git add` dirigido y antes de cada commit.
- **`## Commands` de candy-store** → creado `src/candy-store/CLAUDE.md` (no existía): sin lint/test/build, HTML estático puro, servidor local con `python3 -m http.server`.
- Documentación viva del flujo (`flujo-desarrollo.html`) no se tocó: ambos cambios son detalles tácticos dentro de pasos ya documentados a esa altura, no cambian la forma del flujo.
- PR: [candy-store#14](https://github.com/salvacorp/candy-store/pull/14). CI (link-check, lighthouse, gitleaks) pasó en verde.

## Verificación visual (AC #4) — 2026-09-17

- [verify] Causa del `CONNECTION_CLOSED` de Playwright MCP: el `node` en PATH era v18.17.0 y `@playwright/mcp` usa `net.getDefaultAutoSelectFamilyAttemptTimeout`, que existe recién en Node 20+. Se corrigió con `nvm alias default 22.22.2`. Gotcha: relanzar `claude` desde la misma pestaña de terminal no alcanza — el proceso hereda el PATH viejo; hay que hacer `nvm use default` o abrir una pestaña nueva.
- [verify] Se verificó contra el working tree servido en local (`python3 -m http.server`), no contra `https://candy-store.app` como decía el plan: prod sigue sirviendo los links viejos porque el PR no está mergeado. El PR tampoco tiene preview de Cloudflare.
- [verify] Resultado: los 6 CTAs (2× `/login`, 4× `/register`) apuntan a `admin.candy-store.app`; 0 matches de `candy-store.app/(login|register)` y 0 de `cognito` en el DOM. Ambos destinos responden 200. El footer —donde se habían encadenado los typos de `</a>`— renderiza sus 3 links sanos.
- [verify] Falso positivo descartado: el screenshot `fullPage` en mobile mostraba un hueco en blanco de ~1500px entre features y footer. Es artefacto de captura, no regresión — todas las secciones tienen `opacity: 1`, `visibility: visible` y altura real, y el screenshot del viewport scrolleado las muestra bien. Lección: en mobile, validar con captura de viewport además de `fullPage`.
- [verify] En mobile el "Iniciar sesión" del header está `display: none` por media query (el del footer sí se ve, login sigue alcanzable). Es preexistente, no lo introdujo el ticket: el diff de `index.html` vs `main` son exactamente los 6 `href`, sin tocar markup ni clases.
- Evidencia: `~/.cache/pr-evidence/ATS-96/candy-store-20260917-{desktop-1440,mobile-390,mobile-pricing-viewport}.png`.
