# 🌟 TioSam BI - Business Intelligence Platform

Una aplicación moderna de Business Intelligence construida con Next.js 15, Supabase y Google Gemini AI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Características Principales

### 🎨 Diseño Moderno
- **Dark Mode Glassmorphism**: Interfaz futurista con efectos de cristal y transparencias
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Canvas Animado**: Fondo con partículas interconectadas estilo constelación
- **Responsive Design**: Optimizado para todos los dispositivos

### 🗃️ Arquitectura de Datos (Modelo Estrella)
Implementa un modelo de datos dimensional con:
- **Tabla de Hechos**: `fact_eventos` - Relaciona todas las dimensiones
- **Dimensiones**:
  - `dim_finanzas` - Gestión financiera y contabilidad
  - `dim_produccion` - Métricas de producción y eficiencia
  - `dim_recursos_humanos` - Administración de personal
  - `dim_desarrollo_digital` - Inversiones tecnológicas

### 🔄 Actualización en Tiempo Real
- **Supabase Realtime**: Los cambios en la base de datos se reflejan instantáneamente en la UI
- **No requiere recarga**: La tabla se actualiza automáticamente al detectar cambios

### 📊 CRUD Completo
- **Crear**: Formularios modales con validación
- **Leer**: Tablas interactivas con paginación
- **Actualizar**: Edición inline de registros
- **Eliminar**: Confirmación antes de borrar

### 📁 Importación Masiva
- **Drag & Drop**: Arrastra archivos CSV para importar
- **Parser Inteligente**: Usa Papaparse para procesar archivos
- **Vista Previa**: Muestra los datos antes de importar
- **Validación**: Verifica la estructura del CSV

### 🤖 Análisis con IA
- **Google Gemini Integration**: Análisis inteligente de datos
- **Streaming Responses**: Efecto typewriter en tiempo real
- **Insights Automáticos**: Detecta patrones y tendencias
- **Recomendaciones**: Sugerencias basadas en datos

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **Shadcn/ui** - Componentes UI modernos
- **Framer Motion** - Animaciones declarativas
- **Recharts** - Gráficos y visualizaciones

### Backend & Database
- **Supabase** - PostgreSQL con Realtime
- **Server Actions** - Mutaciones de datos del lado del servidor
- **Row Level Security** - Seguridad a nivel de fila

### IA & Analytics
- **Vercel AI SDK** - Framework para IA
- **Google Gemini** - Modelo de lenguaje para análisis
- **Papaparse** - Parser de CSV

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase
- API Key de Google Gemini

### Paso 1: Clonar el repositorio
```bash
git clone <repository-url>
cd Modelo-Estrella
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_gemini

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 4: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el SQL Editor, ejecuta el script `supabase/schema.sql`
3. Habilita Realtime para todas las tablas en **Database > Replication**
4. Copia las credenciales de **Settings > API**

Ver instrucciones detalladas en [supabase/README.md](./supabase/README.md)

### Paso 5: Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
tiosam-bi/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   └── ai/           # Endpoints de IA
│   │   ├── dimensions/       # Páginas de dimensiones
│   │   │   └── finanzas/    # Dimensión Finanzas
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Dashboard principal
│   ├── components/
│   │   ├── dashboard/        # Componentes del dashboard
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── dimension-table.tsx
│   │   │   ├── csv-import.tsx
│   │   │   └── ai-analyst.tsx
│   │   └── ui/              # Componentes UI (Shadcn)
│   ├── lib/
│   │   ├── supabase/        # Cliente Supabase
│   │   │   ├── client.ts   # Cliente del navegador
│   │   │   └── server.ts   # Cliente del servidor
│   │   ├── ai/
│   │   │   └── gemini-client.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   └── use-realtime-data.ts
│   ├── actions/             # Server Actions
│   │   ├── dimension-actions.ts
│   │   └── ai-actions.ts
│   └── types/
│       └── database.types.ts
├── supabase/
│   ├── schema.sql           # Esquema SQL completo
│   └── README.md           # Instrucciones de configuración
├── components.json          # Configuración Shadcn
├── tailwind.config.ts      # Configuración Tailwind
└── next.config.ts          # Configuración Next.js
```

## 🚀 Uso

### Dashboard Principal
1. Accede a `/` para ver el dashboard principal
2. Visualiza métricas generales de todas las dimensiones
3. Accede rápidamente a cada módulo

### Gestión de Dimensiones
1. Navega a cualquier dimensión desde el sidebar
2. **Crear registro**: Haz clic en "Nuevo Registro"
3. **Editar**: Click en el ícono de lápiz
4. **Eliminar**: Click en el ícono de papelera
5. Los cambios se reflejan instantáneamente gracias a Realtime

### Importación CSV
1. Ve a la dimensión deseada (ej: `/dimensions/finanzas`)
2. Arrastra un archivo CSV o haz clic para seleccionar
3. Revisa la vista previa
4. Haz clic en "Importar"

**Formato CSV requerido:**
```csv
documento,periodo,año,monto,categoria,subcategoria,descripcion
FIN-001,Enero,2024,15000.00,Marketing,Digital,Campaña redes sociales
```

### Análisis con IA
1. En cualquier página de dimensión, localiza "Análisis con IA"
2. Haz clic en "Analizar Datos"
3. Espera mientras Gemini procesa los datos
4. Lee los insights generados automáticamente

## 🎨 Personalización

### Colores y Tema
Los colores se definen en `src/app/globals.css`:
```css
:root {
  --primary: hsl(217 91% 60%);      /* Azul eléctrico */
  --secondary: hsl(271 91% 65%);    /* Púrpura */
  --accent: hsl(189 94% 43%);       /* Cyan */
}
```

### Componentes Glassmorphism
Usa las clases utilitarias:
- `.glass` - Efecto de cristal básico
- `.glass-card` - Card con glassmorphism
- `.glass-strong` - Efecto más pronunciado

## 📊 Modelo de Datos

### Dimensión: Finanzas
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| documento | VARCHAR | Número de documento |
| periodo | VARCHAR | Periodo (Enero, Febrero, etc.) |
| año | INTEGER | Año fiscal |
| monto | DECIMAL | Monto de la transacción |
| categoria | VARCHAR | Categoría financiera |
| subcategoria | VARCHAR | Subcategoría |
| descripcion | TEXT | Descripción detallada |

### Dimensión: Producción
| Campo | Tipo | Descripción |
|-------|------|-------------|
| area_especifica | VARCHAR | Área de producción |
| cantidad_producida | INTEGER | Unidades producidas |
| unidad_medida | VARCHAR | Unidad (kg, unidades, etc.) |
| eficiencia_porcentaje | DECIMAL | % de eficiencia |

### Dimensión: Recursos Humanos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipo_contratacion | VARCHAR | Tipo de contrato |
| numero_empleados | INTEGER | Cantidad de empleados |
| departamento | VARCHAR | Departamento |
| salario_promedio | DECIMAL | Salario promedio |

### Dimensión: Desarrollo Digital
| Campo | Tipo | Descripción |
|-------|------|-------------|
| subdimension | VARCHAR | Área digital |
| inversion | DECIMAL | Monto invertido |
| tecnologia | VARCHAR | Tecnología implementada |
| impacto_negocio | VARCHAR | Impacto en el negocio |

## 🔐 Seguridad

- **Row Level Security (RLS)**: Habilitado en todas las tablas
- **Server-Side Validation**: Validación en Server Actions
- **Type Safety**: TypeScript estricto en todo el proyecto
- **Environment Variables**: Credenciales en variables de entorno

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Build de producción
npm run build
```

## 📝 Próximas Funcionalidades

- [ ] Búsqueda en lenguaje natural
- [ ] Gráficos interactivos con Recharts
- [ ] Exportación de reportes en PDF
- [ ] Filtros avanzados
- [ ] Sistema de autenticación
- [ ] Roles y permisos
- [ ] Multi-tenancy

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Google Gemini](https://ai.google.dev/)

---

**Desarrollado con ❤️ para TioSam BI**
