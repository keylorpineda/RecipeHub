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

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```
