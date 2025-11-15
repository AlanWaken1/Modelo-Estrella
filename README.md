# ⭐ Modelo Estrella - Dashboard de Análisis Empresarial con IA

Sistema completo de análisis empresarial basado en el Modelo Estrella con **sincronización en tiempo real**, integración con **IA**, y visualizaciones interactivas.

## 🚀 Funcionalidades Principales

### ✅ Ya Implementado

- ✨ **Sincronización en Tiempo Real (SSE)** - Los datos se sincronizan automáticamente después de agregar/editar
- 🤖 **Integración Completa con IA** (OpenAI)
  - Búsqueda inteligente
  - Resúmenes ejecutivos automáticos
  - Análisis predictivo
  - Detección de anomalías
- 📊 **4 Dimensiones del Modelo Estrella**
  - 📦 Producción
  - 💰 Finanzas
  - 👥 Recursos Humanos
  - 💻 Desarrollo Digital
- 🔄 **CRUD Completo** con paginación, filtros y búsqueda
- 📈 **Visualizaciones Interactivas** con gráficas animadas
- 🔔 **Sistema de Notificaciones** en tiempo real
- 📁 **Upload de Archivos** con validación (PDF, Excel, Word)
- 🎨 **UI Moderna** con animaciones y degradados
- 🔍 **Búsqueda con IA** en lenguaje natural
- 📱 **Responsive Design** - Funciona en todos los dispositivos

## 📋 Requisitos

- Node.js 20+
- PostgreSQL 14+
- OpenAI API Key

## ⚡ Instalación Rápida

1. **Clonar e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita `.env` y configura:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/modelo_estrella"
OPENAI_API_KEY="sk-tu-api-key-aqui"
```

3. **Configurar base de datos:**
```bash
npm run db:setup
```

Este comando ejecuta:
- `prisma generate` - Genera el cliente de Prisma
- `prisma db push` - Crea las tablas en la base de datos
- `prisma db seed` - Inserta datos de ejemplo

4. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

## 🏗️ Arquitectura

### Backend (API Routes)

```
/api
├── /dimensions/[slug]     - CRUD por dimensión (GET, POST)
├── /records/[id]          - Operaciones individuales (GET, PUT, DELETE)
├── /stats                 - Estadísticas del dashboard
├── /sync                  - Server-Sent Events para sincronización
├── /notifications         - Sistema de notificaciones
├── /ai
│   ├── /search           - Búsqueda inteligente
│   └── /summarize        - Resúmenes y análisis con IA
└── /reports
    └── /upload           - Upload de archivos
```

### Frontend (Components)

```
/components
├── /dashboard
│   ├── DashboardClient    - Dashboard principal
│   ├── AddDataForm        - Formulario con auto-sync
│   ├── SearchBar          - Búsqueda con IA
│   └── AISummaryCard      - Resumen inteligente
├── /charts
│   └── SimpleBarChart     - Gráficas interactivas
└── /ui
    └── crystal-background - Fondo animado
```

### Hooks Personalizados

- `useRealtimeSync` - Hook para sincronización en tiempo real usando SSE

## 🔄 Sincronización Automática

El sistema usa **Server-Sent Events (SSE)** para sincronización en tiempo real:

1. **Cliente se conecta** al endpoint `/api/sync`
2. **Mantiene conexión persistente** con heartbeat cada 30s
3. **Cuando se crean/editan datos**, se notifica a todos los clientes conectados
4. **Todos los dashboards se actualizan automáticamente**

```typescript
// Ejemplo de uso
const { connected, events } = useRealtimeSync()

// Notificar evento de sincronización
await notifySyncEvent({
  type: 'create',
  dimension: 'produccion',
  data: newRecord
})
```

## 🤖 IA Features

### 1. Búsqueda Inteligente
```bash
POST /api/ai/search
{
  "query": "analiza la eficiencia del último mes",
  "dimension": "produccion"
}
```

### 2. Resúmenes Ejecutivos
```bash
POST /api/ai/summarize
{
  "dimension": "finanzas",
  "tipo": "completo",
  "fechaInicio": "2025-01-01",
  "fechaFin": "2025-01-31"
}
```

Tipos disponibles:
- `resumen` - Resumen ejecutivo
- `predictivo` - Análisis predictivo
- `anomalias` - Detección de anomalías
- `completo` - Todo lo anterior

## 📊 Dimensiones y Modelos de Datos

### Producción
- Unidades producidas, defectos, eficiencia
- Control por turno, línea y operador
- Métricas de tiempo y costos

### Finanzas
- Ingresos, egresos, inversiones
- Categorización por departamento
- Control de facturas y métodos de pago

### Recursos Humanos
- Asistencia, horas trabajadas
- Capacitación y evaluaciones
- Gestión de nómina y bonos

### Desarrollo Digital
- Proyectos activos, sprints
- Tareas completadas, bugs
- Stack tecnológico por proyecto

## 🎨 Personalización

### Colores y Temas
Edita `src/app/globals.css` para cambiar colores y animaciones.

### Añadir Nueva Dimensión

1. **Actualiza el schema de Prisma:**
```prisma
// prisma/schema.prisma
model NuevaDimension {
  id        String   @id @default(cuid())
  // ... tus campos
}
```

2. **Actualiza tipos TypeScript:**
```typescript
// src/types/types.ts
export interface NuevaDimensionData {
  // ... tus tipos
}
```

3. **Genera el cliente:**
```bash
npm run prisma:generate
npm run prisma:push
```

## 📦 Scripts Disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:push      # Push schema a DB
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:seed      # Insertar datos de ejemplo
npm run db:setup         # Setup completo de DB
```

## 🔒 Variables de Entorno

```env
# Base de Datos
DATABASE_URL="postgresql://..."

# IA / OpenAI
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4-turbo-preview"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR="./public/uploads"

# Sync
ENABLE_REALTIME_SYNC=true
SYNC_INTERVAL=5000
```

## 🚧 Próximas Funcionalidades

- [ ] Exportación a Excel, CSV, PDF
- [ ] Páginas detalladas por dimensión
- [ ] Sistema de autenticación
- [ ] Tabla de datos con filtros avanzados
- [ ] Reportes programados automáticos
- [ ] Webhooks para integraciones externas
- [ ] Dashboard personalizable por usuario
- [ ] Modo offline con sincronización posterior

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🎯 Stack Tecnológico

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de Datos:** PostgreSQL
- **IA:** OpenAI GPT-4
- **Real-time:** Server-Sent Events (SSE)
- **Validación:** TypeScript estricto

## 📞 Soporte

¿Problemas o preguntas? Abre un issue en GitHub.

---

**Hecho con ❤️ para mejorar el análisis empresarial**
