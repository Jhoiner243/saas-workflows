# Docker Deployment Guide

## 📦 Archivos de Docker Creados

- `docker-compose.yml` - Configuración para desarrollo
- `docker-compose.prod.yml` - Configuración para producción
- `Dockerfile.dev` - Imagen de desarrollo
- `Dockerfile` - Imagen de producción optimizada
- `env.docker.example` - Template de variables de entorno

## 🚀 Inicio Rápido (Desarrollo)

### 1. Iniciar todos los servicios

```bash
docker-compose up -d
```

Esto iniciará:
- **PostgreSQL** en el puerto 5432
- **Redis** en el puerto 6379
- **n8n** en el puerto 5678
- **App Next.js** en el puerto 3003

### 2. Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f n8n
```

### 3. Detener servicios

```bash
docker-compose down

# Detener y eliminar volúmenes (¡cuidado, borra datos!)
docker-compose down -v
```

## 🏭 Despliegue en Producción

### 1. Configurar variables de entorno

```bash
cp env.docker.example .env
```

Edita `.env` con tus valores reales:
- Contraseñas seguras
- Dominio real
- Secretos de NextAuth
- API keys de n8n

### 2. Generar secreto de NextAuth

```bash
openssl rand -base64 32
```

### 3. Iniciar en producción

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Configurar n8n

1. Accede a `http://localhost:5678`
2. Login: admin / admin123 (desarrollo) o tus credenciales (producción)
3. Crea un API key en Settings → API
4. Actualiza `N8N_API_KEY` en tu `.env`

## 🔧 Comandos Útiles

### Reconstruir imágenes

```bash
# Desarrollo
docker-compose build

# Producción
docker-compose -f docker-compose.prod.yml build
```

### Ejecutar comandos en contenedores

```bash
# Prisma migrations
docker-compose exec app pnpx prisma generate
docker-compose exec app pnpx prisma db push

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d saas_chatbot

# Acceder a Redis CLI
docker-compose exec redis redis-cli
```

### Crear usuario admin

```bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d saas_chatbot

# Ejecutar SQL
UPDATE users SET role = 'ADMIN' WHERE email = 'tu-email@example.com';
```

## 📊 Monitoreo

### Health checks

Todos los servicios tienen health checks configurados:

```bash
docker-compose ps
```

### Verificar salud de servicios

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Redis
docker-compose exec redis redis-cli ping

# n8n
curl http://localhost:5678/healthz

# App
curl http://localhost:3003/api/health
```

## 🔒 Seguridad en Producción

### 1. Cambiar contraseñas por defecto

- PostgreSQL: `POSTGRES_PASSWORD`
- Redis: `REDIS_PASSWORD`
- n8n: `N8N_PASSWORD`

### 2. Usar HTTPS

Configura Nginx con certificados SSL:

```bash
# Generar certificados con Let's Encrypt
certbot certonly --standalone -d tu-dominio.com
```

### 3. Firewall

Cierra puertos innecesarios:
- Solo exponer 80 y 443 al público
- PostgreSQL, Redis y n8n solo accesibles internamente

## 🗄️ Backup y Restauración

### Backup de PostgreSQL

```bash
docker-compose exec postgres pg_dump -U postgres saas_chatbot > backup.sql
```

### Restaurar PostgreSQL

```bash
docker-compose exec -T postgres psql -U postgres saas_chatbot < backup.sql
```

### Backup de Redis

```bash
docker-compose exec redis redis-cli SAVE
docker cp saas-chatbot-redis:/data/dump.rdb ./redis-backup.rdb
```

### Backup de n8n

```bash
docker cp saas-chatbot-n8n:/home/node/.n8n ./n8n-backup
```

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3004:3003"  # Usar puerto 3004 en host
```

### Error: Prisma no encuentra la base de datos

```bash
# Esperar a que PostgreSQL esté listo
docker-compose exec app pnpx prisma db push
```

### Error: Redis connection refused

```bash
# Verificar que Redis está corriendo
docker-compose ps redis
docker-compose logs redis
```

### Limpiar todo y empezar de nuevo

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## 📝 Notas Importantes

1. **Desarrollo**: Usa `docker-compose.yml`
2. **Producción**: Usa `docker-compose.prod.yml`
3. **Volúmenes**: Los datos persisten en volúmenes de Docker
4. **Hot reload**: En desarrollo, los cambios se reflejan automáticamente
5. **Networking**: Todos los servicios están en la misma red `saas-network`

## 🌐 URLs de Acceso

- **App**: http://localhost:3003
- **n8n**: http://localhost:5678
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
