# Manual de Usuario — Sistema ERP de Mantenimiento

Versión: 1.0
Fecha: 2025-12-18
Audiencia: Usuarios finales, Técnicos y Administradores
Formato: PDF (se exporta desde este archivo Markdown)

**Nota importante:** Este manual está pensado para uso operativo: incluye flujos, pantallas, roles y procedimientos. No incluye comandos SQL.

---

## Índice

- Introducción
- Requisitos y acceso al sistema
- Primera vez: credenciales y seguridad
- Navegación general y componentes de la interfaz
- Autenticación y recuperación de contraseña
- Gestión de perfil
- Gestión de usuarios
  - Crear usuario
  - Editar usuario
  - Reactivar usuario
  - Eliminar (soft delete)
  - Roles y permisos automáticos
- Gestión de tickets
  - Crear ticket
  - Asignar y aceptar ticket
  - Añadir comentarios y adjuntos
  - Cerrar y reabrir tickets
  - Búsquedas y filtros avanzados
- Gestión de inventario e insumos
  - Añadir insumos
  - Registrar movimientos de inventario
  - Ajustes y reabastecimiento
- Gestión de equipos (equipment)
  - Registrar equipo
  - Asignación y historial
- Sistema de permisos y administración
  - Modelos de roles
  - Asignación manual de permisos
  - Auditoría y logs
- Notificaciones y alertas
- Integraciones y exportación de datos
- Mantenimiento y actualizaciones (operativo)
- Troubleshooting común y FAQ
- Anexos: glosario, rutas y endpoints (abstractos)

---

## Introducción

Este manual proporciona instrucciones detalladas para el uso correcto del Sistema ERP de Mantenimiento. Cubre desde operaciones diarias como crear tickets e insumos, hasta tareas de administración como gestión de usuarios y permisos.

Objetivos:
- Permitir a usuarios y técnicos operar el sistema eficientemente.
- Establecer buenas prácticas para administración y seguridad.
- Documentar flujos y resoluciones para problemas frecuentes.

Alcance:
- Usuarios finales (reportar solicitudes, ver estado)
- Técnicos (gestionar y resolver tickets, manipular inventario)
- Administradores (gestión de usuarios, permisos, revisiones)

---

## Requisitos y acceso al sistema

Requisitos mínimos del usuario:
- Navegador moderno (Chrome, Edge, Firefox) actualizado.
- Conexión a la red donde el backend es accesible.
- Credenciales válidas (usuario y contraseña) proporcionadas por el administrador.

Acceso:
- URL principal del sistema: (proveer URL por el admin)
- El frontend se accede con credenciales que coinciden con los datos en `Correo` y `Usuario`.

Seguridad:
- Las contraseñas deben cumplir la política de longitud (mín. 8 caracteres recomendados).
- No comparta credenciales; use el flujo de recuperación si olvida la contraseña.

---

## Primera vez: credenciales y seguridad

1. Recibirás un correo con tus credenciales iniciales o el administrador te creará el usuario.
2. Inicia sesión con el `Usuario` o `Correo` y la `Contraseña` proporcionada.
3. Al iniciar por primera vez, cambia la contraseña desde tu perfil.
4. Recomendaciones:
   - Utiliza contraseñas únicas y seguras.
   - Habilita autenticación de dos factores si se implementa (si aplica en futuras versiones).

---

## Navegación general y componentes de la interfaz

Barra lateral / menú principal:
- Dashboard: Resumen y métricas.
- Tickets: Crear, ver y gestionar tickets.
- Usuarios: Administración de usuarios (si tu rol lo permite).
- Inventario / Insumos: Gestión de stock y movimientos.
- Equipos: Registro de equipos y su historial.
- Reportes / Exportaciones: Exportar listados a Excel/PDF.

Componentes recurrentes:
- Tablas con paginación y filtros.
- Modales para crear/editar recursos.
- Buscador global en la parte superior del módulo Usuarios/Tickets.

---

## Autenticación y recuperación de contraseña

Login básico:
- Campos: Correo/Usuario + Contraseña.
- Al fallar autenticación se mostrará mensaje claro.

Recuperación de contraseña:
- Hacer clic en "¿Olvidaste tu contraseña?"
- Ingresar correo registrado; se enviará enlace de recuperación.
- El enlace expira según la política del sistema.

Problemas comunes:
- Usuario no encontrado: contactar al administrador.
- No llega correo: revisar SPAM y confirmar el correo con el admin.

---

## Gestión de perfil

1. Ir a Perfil (normalmente en el avatar o menú superior).
2. Campos editables: Nombre completo, Correo, Teléfono/Dependencia, Departamento.
3. Cambiar contraseña: proporciona la antigua y la nueva.
4. Actualizar foto de perfil: opción para cargar imagen (tamaño y formatos permitidos listados en la interfaz).

---

## Gestión de usuarios

Requisitos previos: debe tener permisos para crear/editar usuarios (ver roles abajo).

Flujo: Crear usuario
1. Navegar a `Usuarios` → `Agregar usuario`.
2. Completar formulario: Nombre Completo, Usuario, Correo, Contraseña, Departamento, No. Empleado, Rol.
3. Validaciones en frontend: campos obligatorios y formato de correo.
4. Al enviar, el backend retorna 201 y el usuario aparece en la lista.

Notas:
- Si existe un usuario inactivo con los mismos datos, el sistema puede reactivar y actualizarlo.
- Si hay usuarios activos duplicados, se devolverá un error 409 (duplicado).

Editar usuario
1. Desde la lista, seleccionar `Editar` en el usuario.
2. Cambiar campos según permisos y guardar.
3. Si la contraseña se deja en blanco, se mantiene la actual.

Eliminar (soft delete)
- Eliminar marca `activo=false` y no borra la fila físicamente.
- Para restaurar, usar flujo de reactivación si existe la alternativa.

Roles y permisos automáticos
- Al crear un usuario, el sistema asigna permisos por defecto según el rol seleccionado (e.g., `tecnico`, `inventario`, `admin`, `usuario`).
- Los permisos pueden ajustarse manualmente por el administrador.

Buenas prácticas
- Asignar el rol mínimo necesario.
- Mantener números de empleado y correos actualizados para trazabilidad.

---

## Gestión de tickets

Conceptos:
- Ticket: registro de solicitud o incidente.
- Estado típico: Abierto → En Proceso → Resuelto/Cerrado.
- Comentarios: comunicación entre solicitante y técnico.

Crear ticket
1. Ir a `Tickets` → `Nuevo ticket`.
2. Completar: Título, Descripción, Categoría, Prioridad, Adjuntos.
3. Seleccionar si es anónimo o con datos del solicitante.
4. Enviar; se genera un ID de ticket y se notifica al responsable según reglas.

Asignar ticket
- Manual: un administrador o técnico con permisos puede asignar a un técnico.
- Automático: reglas de negocio (si configuradas) priorizan y asignan.

Comentar y adjuntar
- Añadir comentarios públicos o privados.
- Adjuntar fotos o documentos relevantes.

Cerrar/Reabrir
- El técnico cierra cuando la solución es verificada.
- El solicitante o un admin puede reabrir si el problema persiste.

Filtros y búsquedas
- Buscar por ID, solicitante, prioridad, estado, fecha, categoría.
- Guardar filtros frecuentes (si la funcionalidad existe en UI).

Buenas prácticas en tickets
- Adjuntar evidencias claras.
- Mantener comentarios claros y concisos.
- Cerrar con una nota de resolución detallada.

---

## Gestión de inventario e insumos

Concepto: insumos representan consumibles o piezas con stock.

Añadir insumo
1. Ir a `Insumos` → `Nuevo insumo`.
2. Completar nombre, descripción, unidad, stock inicial, mínimo de reorden.
3. Guardar; se crea registro en catálogo.

Movimientos de inventario
- Tipos: `INITIAL`, `MANUAL`, `TICKET`, `ADJUSTMENT`.
- Registrar entradas/salidas con referencia (p.ej., ID de ticket).
- Los movimientos impactan el stock en tiempo real.

Ajustes y reabastecimiento
- Generar orden de reabastecimiento cuando stock ≤ mínimo.
- Ajustes por pérdida/errores deben registrarse con descripción para auditoría.

Buenas prácticas
- Registrar siempre la razón en la descripción del movimiento.
- Hacer inventarios periódicos y conciliar con movimientos.

---

## Gestión de equipos

Registrar equipo
- Campos: ID, nombre, marca, modelo, número de serie, estado, ubicación, usuario asignado.
- Mantener historial de asignación y mantenimientos.

Asignación y literal historial
- Asignar a usuario para seguimiento y responsabilidad.
- Registrar mantenimiento, fecha, técnico y observaciones.

---

## Sistema de permisos y administración

Modelo de roles
- `admin`: todos los permisos.
- `tecnico`: manejo de tickets e inventario.
- `inventario`: gestión de insumos y stock.
- `usuario`: crear tickets, ver su historial.

Asignación manual de permisos
- Desde `Permisos` (módulo admin) se pueden otorgar permisos granulares a usuarios.
- Se recomienda documentar cambios de permisos con motivo.

Auditoría y logs
- El sistema registra acciones relevantes (creación/edición/eliminación y asignaciones).
- Para auditoría avanzada, exportar los logs o revisar registros del servidor.

---

## Notificaciones y alertas

- Notificaciones por correo para eventos importantes (ticket asignado, resuelto).
- Alertas en la interfaz para tickets críticos o reabastecimiento urgente.

Configuración
- Ajustes de notificaciones se administran por usuario (si disponible).

---

## Integraciones y exportación de datos

Exportaciones
- Listados (Usuarios, Tickets, Insumos) exportables a Excel/PDF desde la interfaz.

Integraciones
- Posibles integraciones SMTP para correo, o APIs externas (dependerá de la instalación).

---

## Mantenimiento y actualizaciones (operativo)

No realice cambios de infraestructura sin coordinación. Para actualizaciones y migraciones:
- Planificar ventana de mantenimiento.
- Hacer backup de la base de datos y archivos.
- Probar actualizaciones en ambiente de staging antes de producción.

---

## Troubleshooting común y FAQ

1. No puedo iniciar sesión
   - Verificar usuario/contraseña.
   - Usar recuperación de contraseña.
   - Verificar que el backend esté en línea.

2. Al crear usuario, recibo error 409 (duplicado)
   - El correo, usuario o número de empleado ya existe. Buscar usuarios inactivos o duplicados.

3. No veo tickets/asignaciones
   - Verificar filtros (estado, fecha, asignado a).
   - Verificar permisos de tu rol.

4. Los cambios no se reflejan
   - Refrescar la página y verificar que no hay caché forzado.
   - Confirmar en registros del servidor si la petición tuvo éxito.

5. Archivos adjuntos no suben
   - Tamaño máximo o tipo no permitido. Revisar mensaje de error.

---

## FAQ adicionales

- ¿Cómo reactivar un usuario eliminado? → Crear un nuevo usuario con los mismos datos hará que el sistema intente reactivar si está diseñado así. Si no, contactar administrador.
- ¿Qué hago si necesito permisos extra? → Solicitar a un administrador con justificación clara.

---

## Anexos

### Glosario breve
- Ticket: incidencia o solicitud.
- Insumo: elemento consumible.
- Inventory Movement: registro de entrada/salida de stock.

### Endpoints (referencia, abstracta)
- `/api/users` — gestión de usuarios (GET/POST/PUT/DELETE).
- `/api/tickets` — gestión de tickets.
- `/api/insumos` — catálogo de insumos.

(El manual evita comandos SQL; para operaciones técnicas consulte al administrador.)

---

## Contacto y soporte

Para soporte técnico o dudas de administración, contactar al equipo de TI o al responsable del proyecto.

---

*Fin del manual* 

