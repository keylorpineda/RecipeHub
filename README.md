# RecipeHub 🍳

Plataforma colaborativa de recetas de cocina desarrollada como proyecto académico para **EIF209 Programación IV**, Universidad Nacional Sede Regional Brunca.

## Stack Tecnológico

| Capa                | Tecnologías                                               |
| ------------------- | --------------------------------------------------------- |
| **Backend**         | Node.js · Express · TypeScript · MongoDB                  |
| **Frontend**        | React · Vite · TypeScript                                 |
| **Infraestructura** | VPS Ubuntu 24.04 · Docker Compose · Nginx · Let's Encrypt |
| **CI/CD**           | GitHub Actions                                            |

## URLs de Producción

- **Frontend:** https://app.recipehub.me
- **Backend:** https://api.recipehub.me/api/health

## Diagrama de Arquitectura

```
                          Internet
                              │
                        HTTPS (443)
                              ▼
              ┌─────────────────────────────────┐
              │             Nginx               │
              │  ┌──────────────────────────┐   │
              │  │     app.recipehub.me     │   │
              │  │  → /var/www/recipehub/   │   │
              │  │    frontend/dist/ (SPA)  │   │
              │  └──────────────────────────┘   │
              │  ┌──────────────────────────┐   │
              │  │     api.recipehub.me     │   │
              │  │  → proxy_pass :4000      │   │
              │  └──────────────────────────┘   │
              └─────────────────────────────────┘
                    HTTP (80) → 301 HTTPS
                              │
              ┌───────────────▼─────────────────┐
              │         Docker Compose          │
              │   ┌──────────────────────┐      │
              │   │   api  (Node:4000)   │      │
              │   └──────────┬───────────┘      │
              │              │  red interna      │
              │   ┌──────────▼───────────┐      │
              │   │   mongo  (27017)     │      │
              │   │   sin puerto         │      │
              │   │   expuesto al host   │      │
              │   └──────────────────────┘      │
              │   volumen: recipehub_data        │
              └─────────────────────────────────┘
```

## Variables de Entorno

El proyecto usa **dos archivos `.env`**, ambos ignorados por git:

| Archivo         | Quién lo lee              | Contenido                    |
| --------------- | ------------------------- | ---------------------------- |
| `.env` (raíz)   | Docker Compose + backend  | MongoDB, JWT, CORS, NODE_ENV |
| `frontend/.env` | Vite (build del frontend) | Solo `VITE_API_URL`          |

### Configuración inicial

```bash
# Variables del backend y Docker Compose
cp .env.example .env
nano .env   # editar contraseñas y JWT_SECRET

# Variable del frontend
echo "VITE_API_URL=http://localhost:4000" > frontend/.env
```

### Variables del `.env` raíz

| Variable                     | Descripción                                         | Ejemplo                                                      |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `PORT`                       | Puerto del servidor API                             | `4000`                                                       |
| `MONGO_INITDB_ROOT_USERNAME` | Usuario root de MongoDB                             | `mongo_user`                                                 |
| `MONGO_INITDB_ROOT_PASSWORD` | Contraseña root de MongoDB                          | `password_seguro`                                            |
| `MONGO_URI`                  | URI de conexión MongoDB                             | `mongodb://user:pass@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET`                 | Secreto para firmar JWT, debe ser largo y aleatorio | `s3cr3t0_muy_l4rg0`                                          |
| `FRONTEND_URL`               | URL del frontend para configurar CORS               | `https://app.recipehub.me`                                   |
| `NODE_ENV`                   | Entorno de ejecución                                | `production`                                                 |

### Variable del `frontend/.env`

| Variable       | Descripción        | Dev                     | Producción                 |
| -------------- | ------------------ | ----------------------- | -------------------------- |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000` | `https://api.recipehub.me` |

## Guía de Despliegue desde Cero

### 1. Requisitos previos

- VPS con Ubuntu 24.04
- Dominio con subdominios `api.` y `app.` apuntando a la IP del VPS
- Cuenta de GitHub con el repositorio

### 2. Configurar el VPS

```bash
# Conectarse por SSH
ssh root@159.223.149.208

# Actualizar el sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Instalar Nginx y Certbot
apt install nginx certbot python3-certbot-nginx -y
```

### 3. Clonar el repositorio

```bash
mkdir -p /root/recipehub
cd /root/recipehub
git clone https://github.com/TU_USUARIO/recipehub.git .
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
# Editar con los valores reales de producción
```

### 5. Configurar Nginx

```bash
cp nginx/recipehub.conf /etc/nginx/sites-available/recipehub
ln -s /etc/nginx/sites-available/recipehub /etc/nginx/sites-enabled/recipehub
rm -f /etc/nginx/sites-enabled/default
nginx -t
```

### 6. Obtener certificado SSL

```bash
certbot --nginx -d api.recipehub.me -d app.recipehub.me
```

### 7. Construir el frontend

```bash
cd /root/recipehub/frontend
npm ci
npm run build
mkdir -p /var/www/recipehub/frontend
cp -r dist /var/www/recipehub/frontend/
```

### 8. Levantar los contenedores

```bash
cd /root/recipehub
docker compose up -d --build
```

### 9. Verificar el deploy

```bash
curl https://api.recipehub.me/api/health
# Respuesta esperada: {"status":"ok","timestamp":"..."}
```

### 10. Configurar GitHub Actions

En **GitHub → Settings → Secrets and variables → Actions → New repository secret**, agregar exactamente estos 5 secrets:

| Secret        | Descripción                    | Cómo obtenerlo                                                            |
| ------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `VPS_HOST`    | IP pública del VPS             | Panel de control del proveedor (DigitalOcean, Hetzner, etc.)              |
| `VPS_USER`    | Usuario SSH del VPS            | Normalmente `root` en un VPS nuevo                                        |
| `VPS_SSH_KEY` | Llave privada SSH completa     | Contenido de `~/.ssh/id_ed25519` (o `id_rsa`) en tu máquina local         |
| `MONGO_URI`   | URI de conexión a MongoDB      | `mongodb://mongo_user:TU_PASSWORD@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET`  | Secreto para firmar tokens JWT | Generar con: `openssl rand -base64 48`                                    |

> **Importante:** `MONGO_ROOT_PASSWORD` ya **no** es un secret de GitHub — su valor está fijo en el script del workflow (`mongo_pass_seguro`). Solo los datos verdaderamente sensibles van como secrets.

A partir de aquí cada `push` a `main` dispara el pipeline automáticamente: tests → deploy → health check.

## Desarrollo Local

### Backend

```bash
# El backend lee automáticamente el .env de la raíz del monorepo
cp .env.example .env          # desde la raíz del proyecto
# Editar MONGO_URI, JWT_SECRET y FRONTEND_URL=http://localhost:5173

cd backend
npm install
npm run dev
```

### Frontend

```bash
# El .env del frontend solo necesita VITE_API_URL
echo "VITE_API_URL=http://localhost:4000" > frontend/.env

cd frontend
npm install
npm run dev
```

## Estructura del Proyecto

```
recipehub/
├── backend/          # API Node.js + Express + TypeScript
├── frontend/         # React + Vite + TypeScript
├── nginx/            # Configuración de Nginx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docker-compose.yml
├── .env.example
└── README.md
```

## Integrantes del Grupo

- [Nombre 1]
- [Nombre 2]
- [Nombre 3]
- [Nombre 4]
- [Nombre 5]

## Licencia

Proyecto académico — Universidad Nacional, I Semestre 2026
