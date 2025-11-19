# Configuración de Supabase para TioSam BI

## 📋 Pasos para configurar Supabase

### 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Crea un nuevo proyecto
3. Guarda las credenciales que te proporciona Supabase

### 2. Ejecutar el esquema SQL

1. En tu proyecto de Supabase, ve a la sección **SQL Editor**
2. Crea una nueva query
3. Copia todo el contenido del archivo `schema.sql` de este directorio
4. Pégalo en el editor y ejecuta el script
5. Verifica que todas las tablas se hayan creado correctamente en la sección **Table Editor**

### 3. Configurar variables de entorno

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia tu **Project URL** y tu **anon/public key**
3. En la raíz del proyecto, crea un archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

4. Completa las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_gemini
```

### 4. Obtener API Key de Google Gemini

1. Ve a [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key y pégala en `.env.local`

### 5. Verificar Realtime

1. En Supabase, ve a **Database** → **Replication**
2. Asegúrate de que las tablas `dim_finanzas`, `dim_produccion`, `dim_recursos_humanos`, `dim_desarrollo_digital`, `fact_eventos` y `reportes` estén habilitadas para Realtime
3. Si no lo están, habilítalas

## 🗃️ Estructura del Modelo Estrella

### Dimensiones

- **dim_finanzas**: Información financiera (gastos, ingresos, categorías)
- **dim_produccion**: Datos de producción y eficiencia
- **dim_recursos_humanos**: Gestión de personal y salarios
- **dim_desarrollo_digital**: Inversiones en tecnología

### Tabla de Hechos

- **fact_eventos**: Relaciona todas las dimensiones con eventos de negocio

### Reportes

- **reportes**: Metadatos de archivos CSV y análisis de IA

## 🔍 Datos de Ejemplo

El esquema incluye datos de ejemplo (seed data) para que puedas empezar a trabajar inmediatamente. Estos datos simulan el funcionamiento de una panadería durante enero y febrero de 2024.

## 🚀 Próximos pasos

Una vez configurado Supabase:

1. Ejecuta `npm run dev` en la raíz del proyecto
2. La aplicación se conectará automáticamente a tu base de datos
3. Los cambios en la base de datos se reflejarán en tiempo real gracias a Supabase Realtime

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
