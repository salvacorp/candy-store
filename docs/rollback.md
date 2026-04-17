# Rollback — candy-store

## Desde el dashboard de Vercel (recomendado)

1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard) → proyecto `candy-store`
2. Tab **Deployments**
3. Buscar el deployment anterior (estado "Ready")
4. Click en los tres puntos → **Promote to Production**

## Desde el CLI de Vercel

```bash
# Listar deployments recientes
vercel ls --prod

# Promover un deployment anterior a producción
vercel rollback <deployment-url>
# Ejemplo:
vercel rollback https://candy-store-abc123.vercel.app
```

## Verificar

Abrir `https://home.candy-store.app` y confirmar que la versión anterior está activa.

## Tiempo estimado

< 1 minuto (Vercel solo cambia el alias, no re-buildea).
