# RecipeHub — Frontend

Interfaz de RecipeHub construida con React 19 + Vite + TypeScript.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Compilación

```bash
npm run build
```

El output se genera en `dist/`.

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta el valor:

```bash
cp .env.example .env.local
```

| Variable       | Descripción                    | Ejemplo local           |
| -------------- | ------------------------------ | ----------------------- |
| `VITE_API_URL` | URL base del backend RecipeHub | `http://localhost:4000` |

> En producción apunta a `https://api.recipehub.me`.

## Seguridad

El JWT de autenticación **nunca se almacena en JavaScript**. El backend lo envía como cookie `HttpOnly` y el navegador lo gestiona automáticamente en cada request. No uses `localStorage` ni `sessionStorage` para tokens.
