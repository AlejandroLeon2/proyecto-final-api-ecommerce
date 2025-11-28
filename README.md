# Proyecto Final API Ecommerce

Este es el backend del sistema de Ecommerce, construido con Node.js, Express y TypeScript.

## Prerrequisitos

- **Node.js**: Asegúrate de tener Node.js instalado en tu sistema.

## Instalación

1. Abrir una terminal en la carpeta `proyecto-final-api-ecommerce/backend-api`.
2. Ejecutar el comando para instalar las dependencias:
   ```bash
   npm install
   ```

## Configuración del Entorno

1. **Variables de Entorno**:
   - Busca el archivo `.env.example` en la raíz del proyecto.
   - Crea una copia de este archivo y nómbrala `.env`.

2. **Configuración Requerida**:
   Edita el archivo `.env` con las siguientes configuraciones:

   - **Firebase Admin**: Necesitas las credenciales de servicio de Firebase. Estas se obtienen desde la consola de Firebase > Configuración del proyecto > Cuentas de servicio.
     - `PROJECT_ID`
     - `PRIVATE_KEY`
     - `CLIENT_EMAIL`
     - etc.

   - **Cloudinary**: Configura las credenciales para el almacenamiento de imágenes.
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

## Ejecución

- **Modo Desarrollo**:
  Compila el código TypeScript y ejecuta el servidor.
  ```bash
  npm run dev
  ```
  *Nota: Si haces cambios, es posible que debas reiniciar el servidor si no está configurado el modo de observación (watch) automático.*

- **Compilación**:
  Compila el código TypeScript a JavaScript en la carpeta `dist/`.
  ```bash
  npm run build
  ```

- **Producción**:
  Ejecuta el servidor desde los archivos compilados en `dist/`.
  ```bash
  npm start
  ```
