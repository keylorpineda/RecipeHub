# RecipeHub API

Backend REST de RecipeHub. Construido con Node.js, Express, MongoDB y TypeScript.

## Requisitos

- Node.js 20+
- MongoDB 6+ (local o vía Docker)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable                     | Descripción                                                                      | Valor por defecto                                                        |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `PORT`                       | Puerto donde escucha la API                                                      | `4000`                                                                   |
| `MONGO_URI`                  | URI de conexión a MongoDB                                                        | `mongodb://mongo_user:mongo_pass@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET`                 | Secreto para firmar los tokens JWT. Usa un valor largo y aleatorio en producción | `supersecretkey_cambiame_en_produccion`                                  |
| `MONGO_INITDB_ROOT_USERNAME` | Usuario root de MongoDB (usado por Docker Compose)                               | `mongo_user`                                                             |
| `MONGO_INITDB_ROOT_PASSWORD` | Contraseña root de MongoDB (usado por Docker Compose)                            | `mongo_pass`                                                             |

## Desarrollo

Arranca el servidor con recarga automática al guardar cambios en `src/`:

```bash
npm run dev
```

La API queda disponible en `http://localhost:4000`.

## Compilación

Compila TypeScript a JavaScript en `dist/`:

```bash
npm run build
```

## Producción

Primero compila, luego arranca el servidor desde el código compilado:

```bash
npm run build
npm start
```

## Tests

Ejecuta los tests unitarios con Jest y ts-jest:

```bash
npm test
```

Los tests usan una base de datos separada (`recipehub_test`). Puedes sobreescribir la URI con la variable `MONGO_URI_TEST` en tu `.env`.

## Endpoints principales

| Método   | Ruta                           | Auth | Descripción                                                 |
| -------- | ------------------------------ | ---- | ----------------------------------------------------------- |
| `GET`    | `/api/health`                  | No   | Estado de la API                                            |
| `POST`   | `/api/auth/register`           | No   | Registro de usuario                                         |
| `POST`   | `/api/auth/login`              | No   | Login, retorna JWT                                          |
| `GET`    | `/api/auth/me`                 | Sí   | Perfil del usuario autenticado                              |
| `GET`    | `/api/recetas`                 | No   | Listar recetas (filtros: `categoria`, `dificultad`, `tags`) |
| `POST`   | `/api/recetas`                 | Sí   | Crear receta                                                |
| `GET`    | `/api/recetas/:id`             | No   | Obtener receta por ID                                       |
| `PUT`    | `/api/recetas/:id`             | Sí   | Editar receta (solo el autor)                               |
| `DELETE` | `/api/recetas/:id`             | Sí   | Eliminar receta (solo el autor)                             |
| `GET`    | `/api/recetas/:id/comentarios` | No   | Listar comentarios de una receta                            |
| `POST`   | `/api/recetas/:id/comentarios` | Sí   | Agregar comentario                                          |
| `DELETE` | `/api/comentarios/:id`         | Sí   | Eliminar comentario (solo el autor)                         |

### Método primario — Cookie HttpOnly (navegador / producción)

El backend establece automáticamente una cookie `token` con `HttpOnly: true` al hacer login o registro. El navegador la reenvía en cada request sin que el frontend toque el token.

El frontend configura `withCredentials: true` en axios para que esto funcione:

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // envía la cookie automáticamente
});
```

**Nunca uses `localStorage` ni `sessionStorage` para guardar el JWT.**

### Método alternativo — Header Authorization (Postman / tests)

Para pruebas con Postman o en los tests de integración, el middleware también acepta el header como fallback. Primero hace login para obtener el token del body de respuesta, luego úsalo así:

```
Authorization: Bearer <token>
```

En Postman:

1. `POST /api/auth/login` → copia el valor de `token` de la respuesta (o activa "Save cookies" para que Postman gestione la cookie automáticamente).
2. En la pestaña **Authorization** selecciona **Bearer Token** y pega el valor.
3. Envía el request a la ruta protegida.
