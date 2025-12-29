# Guía para aplicar las propuestas de normalización

Resumen: los scripts en esta carpeta son propuestas. Siga estos pasos en un entorno de staging antes de aplicar en producción.

Pasos recomendados:

1. Crear un respaldo completo de la base de datos (pg_dump).
2. Restaurar respaldo en un entorno de staging para pruebas.
3. Revisar cada SQL propuesto y ejecutar únicamente las consultas `SELECT`/`PREVIEW` indicadas para verificar que el parsing produce resultados esperados.
4. Ajustar el SQL en caso de diferencias en el tipo de columna actual (`JSONB`, `TEXT[]`, `TEXT`).
5. Ejecutar los INSERTs en transacciones controladas y verificar conteos:
   - Comparar la cantidad de attachments/tags/parts nuevas con el conteo de fuentes.
6. Añadir índices y constraints una vez validado (por ejemplo índices en `ticket_id`, `tag_id`).
7. Actualizar el código de la aplicación para usar las nuevas tablas (APIs, ORM models) y desplegar en staging.
8. Cambiar lecturas/escrituras en la app y probar flujo completo en staging.
9. Cuando todo esté validado, programar ventana de mantenimiento para producción y repetir el proceso en producción.

Notas adicionales:
- Las migraciones propuestas usan `gen_random_uuid()` y `jsonb` específicas de Postgres.
- Si su `tickets.attachments` actual es simplemente una cadena con formato distinto, adapte la lógica de parsing.
- Puedo generar migraciones en formato `Sequelize` si lo prefieres (sólo archivos, sin ejecución).
