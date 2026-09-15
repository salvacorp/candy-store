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
- PR: [candy-store#14](https://github.com/salvacorp/candy-store/pull/14). CI (link-check, lighthouse, gitleaks) pasó en verde. Verificación visual desktop/mobile (AC #4) queda pendiente — Playwright MCP no conectó esta sesión.
