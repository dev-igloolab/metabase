# Portal de dashboards de IglooLab

## Configuración

Un superadministrador configura las interfaces desde **Administración → Personas → Portal de usuarios**.

- `Metabase completo`: conserva la experiencia normal.
- `Portal de dashboards`: muestra `/portal` y únicamente los dashboards permitidos.
- Los administradores siempre conservan Metabase completo.
- Los grupos y permisos de colecciones siguen determinando qué dashboards puede ver cada usuario.

La interfaz no se configura al crear o editar usuarios. Así, los formularios originales de Metabase permanecen intactos y toda la personalización se concentra en una página propia.

## Datos aislados

La migración `063/20260918_igloolab_client_interface.yaml` crea `igloolab_user_portal`, relacionada con `core_user` mediante `user_id`. No se añaden columnas a tablas originales de Metabase.

La ausencia de una fila significa `metabase`. Solo se guarda una fila cuando se asigna el portal. La API propia vive en `/api/igloolab/portal` y solo un superadministrador puede listar o cambiar asignaciones.

## Código propio

- `src/metabase/igloolab`: persistencia y API.
- `frontend/src/metabase/igloolab`: portal, página administrativa y API del portal.
- `test/metabase/igloolab`: pruebas del backend personalizado.
- `resources/migrations/063/20260918_igloolab_client_interface.yaml`: tabla propia.

## Puntos de integración con Metabase

Los archivos originales se modifican únicamente para registrar o aplicar la funcionalidad:

- `src/metabase/api_routes/routes.clj`: registra la API.
- `frontend/src/metabase/routes.tsx`: registra `/portal`.
- `frontend/src/metabase/admin/routes.tsx`: registra la página administrativa.
- `frontend/src/metabase/admin/people/components/PeopleNav.tsx`: añade su acceso al menú de Personas.
- `frontend/src/metabase/AppComponent.tsx`: aplica el layout del portal.
- `frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeader.tsx`: oculta información de edición en el portal.
- `frontend/src/metabase/dashboard/containers/DashboardApp/DashboardApp.tsx`: limita acciones del dashboard en el portal.
- Los dos archivos de configuración de límites de módulos registran el módulo `igloolab`.

Al actualizar Metabase, estos son los únicos puntos de integración que requieren revisión especial.
