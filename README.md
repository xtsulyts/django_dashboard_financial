# django_dashboard_financial

Este proyecto es una aplicación web para la gestión de finanzas personales. Permite a los usuarios registrar sus ingresos y gastos, visualizar su balance financiero y realizar análisis mediante gráficos interactivos. Los usuarios pueden gestionar sus transacciones, categorizarlas y exportar los datos a formatos CSV o Excel.

## Características

- **Autenticación de usuarios**:
  - Registro e inicio de sesión con JWT.
  - Roles de usuario (Admin y Usuario).
  
- **Gestión de transacciones**:
  - CRUD de ingresos y gastos.
  - Categorización de las transacciones (comida, transporte, entretenimiento, etc.).
  - Descripción opcional de cada transacción.

- **Visualización interactiva**:
  - Gráficos de barras o líneas mostrando los ingresos y gastos por mes.
  - Gráfico de "Balance total" entre ingresos y gastos.
  
- **Filtros y búsqueda**:
  - Filtros por fecha (última semana, mes, trimestre, etc.).
  - Búsqueda de transacciones por descripción o categoría.
  
- **Exportación de datos**:
  - Exporta tus transacciones a formatos CSV o Excel.

## Tecnologías

- **Backend**:
  - **Django** con **Django REST Framework**.
  - Base de datos **PosgreSQL**.

- **Frontend**:
  - **React, Next.js**.
  - **Tailwind CSS** 

- **Autenticación**:
  - JSON Web Tokens (JWT) para autenticación y autorización.

- **Visualización**:
  - Gráficos interactivos usando **Recharts** o **Chart.js**.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local.

### Backend (Django)

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/dashboard-financiero.git
   cd dashboard-financiero
2. Crea un entorno virtual e instala las dependencias de Python:
   
  python3 -m venv venv
  source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
  pip install -r requirements.txt

3. Configura las variables de entorno:

   DJANGO_SECRET_KEY: La clave secreta de Django.
   DATABASE_URL: La URL de conexión a tu base de datos MySQL.

4. Ejecuta las migraciones:
   python manage.py migrate

5. Inicia el servidor de desarrollo:
   python manage.py runserver

Frontend (React/Next.js)

1. Navega a la carpeta del frontend:
cd frontend

2. Instala las dependencias de Node.js:
npm install

3. Inicia el servidor de desarrollo:
npm run dev

El proyecto debería estar disponible en http://localhost:3000.

Uso
Autenticación:

Los usuarios deben registrarse o iniciar sesión para acceder a sus datos financieros.
Gestión de Transacciones:

Los usuarios pueden agregar, editar o eliminar transacciones.
Pueden categorizar sus transacciones según categorías predefinidas o personalizadas.
Gráficos:

Se generan gráficos dinámicos que muestran el balance entre ingresos y gastos a lo largo del tiempo.
Los usuarios pueden elegir el período de análisis (diario, mensual, anual).
Exportación:

Los datos pueden ser exportados a CSV o Excel para su análisis externo.
Contribuciones
Si deseas contribuir a este proyecto, por favor sigue estos pasos:

Forkea el repositorio.
Crea una rama para tus cambios (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y realiza un commit (git commit -m 'Agregada nueva funcionalidad').
Empuja tus cambios (git push origin feature/nueva-funcionalidad).
Crea un pull request.
Licencia
Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo LICENSE.


