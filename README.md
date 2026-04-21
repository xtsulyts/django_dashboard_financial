# FinanzasPro — Dashboard Financiero Personal

Aplicación web para la gestión de finanzas personales. Permite registrar ingresos y gastos, visualizar el balance financiero con gráficos interactivos y sincronizar movimientos desde MercadoPago.

🔗 **[Ver demo en producción](https://django-dashboard-financial.vercel.app/)**

---

## Características

- **Autenticación** — Registro e inicio de sesión con JWT
- **Dashboard** — Gráfico de evolución mensual y líneas de ingresos/gastos
- **Inicio** — Saldo, totales y cotización del dólar en tiempo real (Oficial, Blue, MEP)
- **Transacciones** — Crear, editar y eliminar ingresos/gastos con categorías
- **Movimientos** — Historial completo con vista de lista estilo extracto bancario
- **MercadoPago Sync** — Importación automática de pagos desde la API de MP
- **Dark/Light mode** — Toggle persistente con next-themes
- **Perfil y Configuración** — Páginas de usuario

## Stack

**Backend**
- Django + Django REST Framework
- PostgreSQL (Neon) en producción / SQLite en desarrollo
- JWT con SimpleJWT
- Docker — imagen publicada en Docker Hub
- Deploy en Render

**Frontend**
- Next.js 15 + React
- Tailwind CSS
- Chart.js (react-chartjs-2)
- Lucide React
- Inter + DM Mono (next/font)
- Deploy en Vercel

## Instalación local

### Backend

```bash
git clone https://github.com/xtsulyts/django_dashboard_financial
cd django_dashboard_financial

python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Crear `backend/.env`:
```
USE_SQLITE=true
DJANGO_SECRET_KEY=tu_secret_key
```

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Crear `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Disponible en `http://localhost:3000`

## Variables de entorno en producción

| Variable | Descripción |
|---|---|
| `USE_SQLITE` | Omitir o `false` para usar PostgreSQL |
| `DB_ENGINE` | `django.db.backends.postgresql` |
| `DB_NAME` | Nombre de la base de datos Neon |
| `DB_USER` | Usuario Neon |
| `DB_PASSWORD` | Contraseña Neon |
| `DB_HOST` | Host Neon |
| `DB_PORT` | `5432` |
| `DJANGO_SECRET_KEY` | Clave secreta Django |
| `MP_ACCESS_TOKEN` | Token de MercadoPago |
| `NEXT_PUBLIC_API_URL` | URL del backend (Render) |
