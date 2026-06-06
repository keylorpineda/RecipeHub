<div align="center">
  <h1>RecipeHub 🍳</h1>

  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=24&pause=1000&color=F7B731&center=true&vCenter=true&width=600&lines=Descubre+Nuevas+Recetas;Comparte+tu+Pasi%C3%B3n;Plataforma+Colaborativa" alt="Typing SVG" />

  <p align="center">
    <b>Plataforma colaborativa de recetas de cocina</b> desarrollada como proyecto académico para <strong>EIF209 Programación IV</strong>, Universidad Nacional Sede Regional Brunca.
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Status-Activo-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Licencia-Acad%C3%A9mica-blue?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 🛠️ Stack Tecnológico

| Capa                | Tecnologías                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**         | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /> |
| **Frontend**        | <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /> <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />                                                                                                                                            |
| **Infraestructura** | <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" /> <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /> <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />                                                                                                                                                    |
| **CI/CD**           | <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />                                                                                                                                                                                                                                                                                                                                                                     |

## 🌐 URLs de Producción

- 🖥️ **Frontend:** [https://app.recipehub.me](https://app.recipehub.me)
- ⚙️ **Backend:** [https://api.recipehub.me/api/health](https://api.recipehub.me/api/health)

## 🏗️ Diagrama de Arquitectura

<div align="center">
  <img src="./docs/arch_diagram.png" alt="Diagrama de Arquitectura" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>

## 🔐 Variables de Entorno

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

| Variable                     | Descripción                                            | Ejemplo                                                      |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `PORT`                       | Puerto del servidor API                                | `4000`                                                       |
| `MONGO_INITDB_ROOT_USERNAME` | Usuario root de MongoDB                                | `mongo_user`                                                 |
| `MONGO_INITDB_ROOT_PASSWORD` | Contraseña root de MongoDB                             | `password_seguro`                                            |
| `MONGO_URI`                  | URI de conexión MongoDB                                | `mongodb://user:pass@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET`                 | Secreto para firmar JWT, debe ser largo y aleatorio    | `s3cr3t0_muy_l4rg0`                                          |
| `FRONTEND_URL`               | URL del frontend para configurar CORS                  | `https://app.recipehub.me`                                   |
| `NODE_ENV`                   | Entorno de ejecución                                   | `production`                                                 |
| `CLOUDINARY_CLOUD_NAME`      | Nombre del cloud de Cloudinary para subida de imágenes | `dxsrmgezg`                                                  |
| `CLOUDINARY_API_KEY`         | API Key de Cloudinary                                  | `396491736294185`                                            |
| `CLOUDINARY_API_SECRET`      | API Secret de Cloudinary                               | `tu_api_secret`                                              |

### Variable del `frontend/.env`

| Variable       | Descripción        | Dev                     | Producción                 |
| -------------- | ------------------ | ----------------------- | -------------------------- |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000` | `https://api.recipehub.me` |

## 🚀 Guía de Despliegue desde Cero

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
git clone https://github.com/keylorpineda/RecipeHub.git recipehub
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

En **GitHub → Settings → Secrets and variables → Actions → New repository secret**, agregar exactamente estos 6 secrets:

| Secret                | Descripción                          | Cómo obtenerlo                                                            |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `VPS_HOST`            | IP pública del VPS                   | Panel de control del proveedor (DigitalOcean, Hetzner, etc.)              |
| `VPS_USER`            | Usuario SSH del VPS                  | Normalmente `root` en un VPS nuevo                                        |
| `VPS_SSH_KEY`         | Llave privada SSH completa           | Contenido de `~/.ssh/id_ed25519` (o `id_rsa`) en tu máquina local         |
| `MONGO_URI`           | URI de conexión a MongoDB            | `mongodb://mongo_user:TU_PASSWORD@mongo:27017/recipehub?authSource=admin` |
| `JWT_SECRET`          | Secreto para firmar tokens JWT       | Generar con: `openssl rand -base64 48`                                    |
| `MONGO_ROOT_PASSWORD` | Contraseña root de MongoDB en el VPS | Elige una contraseña segura; debe coincidir con la usada en `MONGO_URI`   |

A partir de aquí cada `push` a `main` dispara el pipeline automáticamente: tests → deploy → health check.

## 💻 Desarrollo Local

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

## 📁 Estructura del Proyecto

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

## 👥 Integrantes del Grupo

- Jefferson David Abarca Pérez
- David Esteban Acuña Orozco
- Brenda Valeska Aguilar Fonseca
- Keylor Steven Pineda Álvarez
- Jordy Estrada Ortega

## 🔒 Seguridad

- **JWT en cookie HttpOnly** — el token nunca es accesible desde JavaScript, eliminando riesgo de XSS
- **CORS restringido** — solo acepta peticiones desde `https://app.recipehub.me`
- **MongoDB sin puertos expuestos** — solo accesible dentro de la red interna Docker
- **Variables sensibles en GitHub Secrets** — nunca aparecen en el código fuente ni en los logs
- **SSL calificación A** en SSL Labs con TLS 1.3 soportado
- **Bcrypt** para hasheo de contraseñas (10 rounds)

## 🧪 Tests

```bash
cd backend
npm test                # correr 25+ tests de integración
npm run test:coverage   # con reporte de cobertura de código
```

Los tests cubren todos los endpoints: auth, recetas y comentarios.
Se ejecutan automáticamente en cada push via GitHub Actions con servicio MongoDB.

## 📄 Licencia

Proyecto académico — Universidad Nacional, I Semestre 2026
