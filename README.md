<div align="center">
  <h1>RecipeHub 🍳</h1>

  <p align="center">
    <em>Descubre Nuevas Recetas · Comparte tu Pasión · Plataforma Colaborativa</em>
  </p>

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

## 🖥️ Infraestructura del VPS

**Proveedor:** DigitalOcean (crédito GitHub Student Pack)  
**IP:** 159.223.149.208  
**OS:** Ubuntu 24.04 LTS — 2 GB RAM · 1 vCPU · 50 GB SSD

### 📦 Software Instalado

> Base de operaciones configurada en el servidor para el correcto funcionamiento.

| 🧰 Software                                                                                                      |                                  🏷️ Versión                                   | 🎯 Propósito                 |
| :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------: | :--------------------------- |
| <img src="https://img.shields.io/badge/Docker_Engine-2496ED?style=for-the-badge&logo=docker&logoColor=white" />  | <img src="https://img.shields.io/badge/29.5.2-1C1C1C?style=for-the-badge" />  | Contenerización de servicios |
| <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" /> |   <img src="https://img.shields.io/badge/v2-1C1C1C?style=for-the-badge" />    | Orquestación de contenedores |
| <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />           |  <img src="https://img.shields.io/badge/1.24-1C1C1C?style=for-the-badge" />   | Reverse proxy + frontend     |
| <img src="https://img.shields.io/badge/Certbot-FF8A00?style=for-the-badge&logo=letsencrypt&logoColor=white" />   | <img src="https://img.shields.io/badge/Latest-1C1C1C?style=for-the-badge" />  | Certificados SSL automáticos |
| <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />     |  <img src="https://img.shields.io/badge/20.x-1C1C1C?style=for-the-badge" />   | Build del frontend en VPS    |
| <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />               | <img src="https://img.shields.io/badge/Sistema-1C1C1C?style=for-the-badge" /> | Control de versiones         |

### 🛡️ Puertos Abiertos (Firewall)

|                                                 🔌 Puerto                                                  |                               ⚙️ Protocolo                                | 📝 Uso                               |
| :--------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------: | :----------------------------------- |
|     <img src="https://img.shields.io/badge/22-1C1C1C?style=for-the-badge&logo=ssh&logoColor=white" />      | <img src="https://img.shields.io/badge/TCP-0052CC?style=for-the-badge" /> | 🔐 **SSH** — acceso al servidor      |
|     <img src="https://img.shields.io/badge/80-1C1C1C?style=for-the-badge&logo=http&logoColor=white" />     | <img src="https://img.shields.io/badge/TCP-0052CC?style=for-the-badge" /> | 🌐 **HTTP** — redirige a HTTPS (301) |
| <img src="https://img.shields.io/badge/443-1C1C1C?style=for-the-badge&logo=letsencrypt&logoColor=white" /> | <img src="https://img.shields.io/badge/TCP-0052CC?style=for-the-badge" /> | 🔒 **HTTPS** — tráfico seguro        |

### 🐳 Contenedores Docker en Producción

| 📦 Contenedor                                                                                                         | 🖼️ Imagen                                                                                                           |                                   🚪 Puerto                                   | 📋 Descripción        |
| :-------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------: | :-------------------- |
| <img src="https://img.shields.io/badge/recipehub--api--1-F7B731?style=for-the-badge&logo=docker&logoColor=white" />   | <img src="https://img.shields.io/badge/Node_20_Alpine-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> |  <img src="https://img.shields.io/badge/4000-1C1C1C?style=for-the-badge" />   | API REST Express      |
| <img src="https://img.shields.io/badge/recipehub--mongo--1-F7B731?style=for-the-badge&logo=docker&logoColor=white" /> | <img src="https://img.shields.io/badge/mongo:7-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />          | <img src="https://img.shields.io/badge/Privado-FF0000?style=for-the-badge" /> | Base de datos MongoDB |

### 🌍 Dominio y DNS

| 🔗 Subdominio                                                                                                         |                                    🧩 Tipo                                     |                                      🎯 Apunta a                                      |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
| <img src="https://img.shields.io/badge/app.recipehub.me-61DAFB?style=for-the-badge&logo=react&logoColor=white" />     | <img src="https://img.shields.io/badge/A_Record-1C1C1C?style=for-the-badge" /> | <img src="https://img.shields.io/badge/159.223.149.208-0052CC?style=for-the-badge" /> |
| <img src="https://img.shields.io/badge/api.recipehub.me-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> | <img src="https://img.shields.io/badge/A_Record-1C1C1C?style=for-the-badge" /> | <img src="https://img.shields.io/badge/159.223.149.208-0052CC?style=for-the-badge" /> |

> **Registrador:** Namecheap _(dominio `.me` gratis via GitHub Student Pack)_

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

### ⚙️ Variables del `.env` raíz

| 🔑 Variable                                                                                                                                  | 📖 Descripción             | 💡 Ejemplo                  |
| :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------- | :-------------------------- |
| <img src="https://img.shields.io/badge/PORT-4000-000000?style=flat-square&labelColor=2C2C2C" />                                              | Puerto del API             | `4000`                      |
| <img src="https://img.shields.io/badge/MONGO__INITDB__ROOT__USERNAME-mongo__user-4EA94B?style=flat-square&labelColor=2C2C2C&logo=mongodb" /> | Usuario root de MongoDB    | `mongo_user`                |
| <img src="https://img.shields.io/badge/MONGO__INITDB__ROOT__PASSWORD-***-4EA94B?style=flat-square&labelColor=2C2C2C&logo=mongodb" />         | Contraseña root de MongoDB | `password_seguro`           |
| <img src="https://img.shields.io/badge/MONGO__URI-mongodb://...-4EA94B?style=flat-square&labelColor=2C2C2C&logo=mongodb" />                  | URI de conexión MongoDB    | `mongodb://user:pass@mongo` |
| <img src="https://img.shields.io/badge/JWT__SECRET-***-FF0000?style=flat-square&labelColor=2C2C2C&logo=jsonwebtokens" />                     | Secreto para firmar JWT    | `s3cr3t0`                   |
| <img src="https://img.shields.io/badge/FRONTEND__URL-app.recipehub.me-61DAFB?style=flat-square&labelColor=2C2C2C" />                         | URL frontend para CORS     | `https://app.recipehub.me`  |
| <img src="https://img.shields.io/badge/NODE__ENV-production-339933?style=flat-square&labelColor=2C2C2C" />                                   | Entorno de ejecución       | `production`                |
| <img src="https://img.shields.io/badge/CLOUDINARY__CLOUD__NAME-dxsrmgezg-3448C5?style=flat-square&labelColor=2C2C2C&logo=cloudinary" />      | Cloud de Cloudinary        | `dxsrmgezg`                 |
| <img src="https://img.shields.io/badge/CLOUDINARY__API__KEY-396491...-3448C5?style=flat-square&labelColor=2C2C2C&logo=cloudinary" />         | API Key Cloudinary         | `396491...`                 |
| <img src="https://img.shields.io/badge/CLOUDINARY__API__SECRET-***-3448C5?style=flat-square&labelColor=2C2C2C&logo=cloudinary" />            | API Secret Cloudinary      | `tu_api_secret`             |

### 🎨 Variable del `frontend/.env`

| 🔑 Variable                                                                                                                  | 📖 Descripción     | 🛠️ Dev                  | 🚀 Producción              |
| :--------------------------------------------------------------------------------------------------------------------------- | :----------------- | :---------------------- | :------------------------- |
| <img src="https://img.shields.io/badge/VITE__API__URL-app.recipehub-61DAFB?style=flat-square&labelColor=2C2C2C&logo=vite" /> | URL base de la API | `http://localhost:4000` | `https://api.recipehub.me` |

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

### 🤖 10. Configurar GitHub Actions

En **GitHub → Settings → Secrets and variables → Actions → New repository secret**, agregar exactamente estos 6 secrets:

| 🔐 Secret                                                                                                                | 📖 Descripción                 | 🔍 Cómo obtenerlo                      |
| :----------------------------------------------------------------------------------------------------------------------- | :----------------------------- | :------------------------------------- |
| <img src="https://img.shields.io/badge/VPS__HOST-000000?style=for-the-badge&logo=digitalocean&logoColor=white" />        | IP pública del VPS             | Panel de control del proveedor         |
| <img src="https://img.shields.io/badge/VPS__USER-000000?style=for-the-badge&logo=linux&logoColor=white" />               | Usuario SSH del VPS            | Normalmente `root` en un VPS nuevo     |
| <img src="https://img.shields.io/badge/VPS__SSH__KEY-000000?style=for-the-badge&logo=ssh&logoColor=white" />             | Llave privada SSH completa     | Contenido de `~/.ssh/id_ed25519` local |
| <img src="https://img.shields.io/badge/MONGO__URI-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />            | URI de conexión a MongoDB      | `mongodb://mongo_user:pass@mongo`      |
| <img src="https://img.shields.io/badge/JWT__SECRET-FF0000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />     | Secreto para firmar tokens JWT | Generar con: `openssl rand -base64 48` |
| <img src="https://img.shields.io/badge/MONGO__ROOT__PASSWORD-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /> | Contraseña root de MongoDB     | Contraseña elegida                     |

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

<table align="center">
  <tr>
    <td align="center"><img src="https://ui-avatars.com/api/?name=Jefferson+Abarca&background=0D8ABC&color=fff&rounded=true&bold=true" width="80px;" alt="Jefferson"/><br /><b>Jefferson Abarca</b></td>
    <td align="center"><img src="https://ui-avatars.com/api/?name=David+Acuna&background=4CAF50&color=fff&rounded=true&bold=true" width="80px;" alt="David"/><br /><b>David Acuña</b></td>
    <td align="center"><img src="https://ui-avatars.com/api/?name=Brenda+Aguilar&background=E91E63&color=fff&rounded=true&bold=true" width="80px;" alt="Brenda"/><br /><b>Brenda Aguilar</b></td>
    <td align="center"><img src="https://ui-avatars.com/api/?name=Keylor+Pineda&background=FF9800&color=fff&rounded=true&bold=true" width="80px;" alt="Keylor"/><br /><b>Keylor Pineda</b></td>
    <td align="center"><img src="https://ui-avatars.com/api/?name=Jordy+Estrada&background=9C27B0&color=fff&rounded=true&bold=true" width="80px;" alt="Jordy"/><br /><b>Jordy Estrada</b></td>
  </tr>
</table>

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

---

Proyecto académico — **Universidad Nacional, Sede Regional Brunca**, I Semestre 2026
