# jardiapp

App de reservas de jardineros por proximidad (cliente) usando React Native, Expo, TypeScript y Supabase.

## Configuración inicial

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Copia la URL y la clave anónima (anon/public key) de tu proyecto Supabase.
3. Rellena el archivo `.env` con tus credenciales:
   ```env
   SUPABASE_URL=tu_url_supabase
   SUPABASE_ANON_KEY=tu_anon_key
   ```
4. Instala las dependencias:
   ```sh
   npm install
   ```
5. Inicia la app:
   ```sh
   npm start
   ```

## Estructura inicial

- `App.tsx`: punto de entrada de la app.
- `lib/supabase.ts`: inicialización del cliente Supabase.
- `.env`: variables de entorno para Supabase.

## Recursos útiles

- [Documentación Expo](https://docs.expo.dev/)
- [Documentación Supabase](https://supabase.com/docs/guides/with-expo)
