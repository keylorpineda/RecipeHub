# Configuración Nginx

## Instalación en el VPS

1. Copiar la configuración:

   ```bash
   sudo cp nginx/recipehub.conf /etc/nginx/sites-available/recipehub
   ```

2. Activar el sitio:

   ```bash
   sudo ln -s /etc/nginx/sites-available/recipehub /etc/nginx/sites-enabled/recipehub
   ```

3. Desactivar el sitio default si existe:

   ```bash
   sudo rm -f /etc/nginx/sites-enabled/default
   ```

4. Verificar la configuración:

   ```bash
   sudo nginx -t
   ```

5. Obtener certificado SSL con Certbot:

   ```bash
   sudo certbot --nginx -d api.recipehub.me -d app.recipehub.me
   ```

6. Recargar Nginx:

   ```bash
   sudo systemctl reload nginx
   ```

7. Verificar que funciona:
   ```bash
   curl -I https://api.recipehub.me/api/health
   ```

## Renovación automática SSL

Certbot configura la renovación automática. Para verificar:

```bash
sudo systemctl status certbot.timer
```
