# Guía de Despliegue en AWS (Ubuntu)

Esta guía te ayudará a desplegar el Sistema de Mantenimiento ERP en una instancia EC2 de AWS con Ubuntu.

## Prerrequisitos

1.  Una instancia AWS EC2 con **Ubuntu Server 20.04** o **22.04**.
2.  Acceso SSH a la instancia.
3.  Puerto **30001** abierto en el Security Group de AWS (Inbound Rules).

## Pasos de Instalación Rápida

1.  **Conéctate a tu instancia** vía SSH:
    ```bash
    ssh -i "tu-clave.pem" ubuntu@tu-dns-publico.amazonaws.com
    ```

2.  **Descarga el script de despliegue**:
    Copia y pega el siguiente comando en la terminal de tu servidor:

    ```bash
    curl -O https://raw.githubusercontent.com/toruacampaerickfrancisco-a11y/sistema-matenimiento/main/scripts/deploy-ubuntu.sh
    ```
    *(Nota: Si el repositorio es privado, necesitarás clonarlo primero o copiar el contenido del archivo `scripts/deploy-ubuntu.sh` manualmente).*

    **Opción alternativa (Copiar y Pegar):**
    1.  Crea el archivo: `nano deploy.sh`
    2.  Copia el contenido de `scripts/deploy-ubuntu.sh` de tu proyecto local.
    3.  Pégalo en la terminal.
    4.  Guarda con `Ctrl+O`, `Enter`, y sal con `Ctrl+X`.

3.  **Ejecuta el script**:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

4.  **Espera a que termine**. El script instalará Node.js, configurará el proyecto y lanzará el servicio.

## Verificación

Una vez finalizado, abre tu navegador y visita:
`http://<TU_IP_PUBLICA>:30001`

## Solución de Problemas

-   **No carga la página:** Verifica que el puerto 30001 esté abierto en el "Security Group" de tu instancia en la consola de AWS.
-   **Error de permisos:** Asegúrate de ejecutar el script con un usuario con permisos sudo (el usuario `ubuntu` por defecto los tiene).
-   **Base de datos:** Por defecto usa SQLite. Si necesitas PostgreSQL, edita el archivo `.env` en `backend/.env` después del despliegue y reinicia el servicio con `pm2 restart sistema-erp`.

## Actualizaciones Futuras

Para actualizar el sistema con nuevos cambios del repositorio, simplemente vuelve a ejecutar el script `deploy.sh` o ejecuta manualmente:

```bash
cd sistema-matenimiento
git pull
# Repetir pasos de build si es necesario
```
