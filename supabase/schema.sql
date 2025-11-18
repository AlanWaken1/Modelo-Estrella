-- =====================================================
-- TioSam BI - Modelo Estrella (Star Schema)
-- Base de Datos: Supabase PostgreSQL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DIMENSIONES
-- =====================================================

-- Dimensión: Finanzas
CREATE TABLE dim_finanzas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    año INTEGER NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimensión: Producción
CREATE TABLE dim_produccion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    año INTEGER NOT NULL,
    area_especifica VARCHAR(100) NOT NULL,
    cantidad_producida INTEGER,
    unidad_medida VARCHAR(50),
    eficiencia_porcentaje DECIMAL(5, 2),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimensión: Recursos Humanos
CREATE TABLE dim_recursos_humanos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    año INTEGER NOT NULL,
    tipo_contratacion VARCHAR(100) NOT NULL,
    numero_empleados INTEGER,
    departamento VARCHAR(100),
    salario_promedio DECIMAL(15, 2),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimensión: Desarrollo Digital
CREATE TABLE dim_desarrollo_digital (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    año INTEGER NOT NULL,
    subdimension VARCHAR(100) NOT NULL,
    inversion DECIMAL(15, 2),
    tecnologia VARCHAR(100),
    impacto_negocio VARCHAR(255),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE HECHOS (FACT TABLE)
-- =====================================================

CREATE TABLE fact_eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Foreign Keys a Dimensiones
    finanzas_id UUID REFERENCES dim_finanzas(id) ON DELETE CASCADE,
    produccion_id UUID REFERENCES dim_produccion(id) ON DELETE CASCADE,
    recursos_humanos_id UUID REFERENCES dim_recursos_humanos(id) ON DELETE CASCADE,
    desarrollo_digital_id UUID REFERENCES dim_desarrollo_digital(id) ON DELETE CASCADE,
    -- Métricas del Hecho
    fecha DATE NOT NULL,
    valor_total DECIMAL(15, 2),
    kpi_principal VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'activo',
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE REPORTES
-- =====================================================

CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_archivo VARCHAR(255) NOT NULL,
    dimension VARCHAR(100) NOT NULL,
    tipo_analisis VARCHAR(100),
    resumen_ia TEXT,
    total_registros INTEGER DEFAULT 0,
    archivo_url TEXT,
    fecha_carga TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'procesado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para Dimensión Finanzas
CREATE INDEX idx_finanzas_periodo ON dim_finanzas(periodo);
CREATE INDEX idx_finanzas_año ON dim_finanzas(año);
CREATE INDEX idx_finanzas_categoria ON dim_finanzas(categoria);

-- Índices para Dimensión Producción
CREATE INDEX idx_produccion_periodo ON dim_produccion(periodo);
CREATE INDEX idx_produccion_año ON dim_produccion(año);
CREATE INDEX idx_produccion_area ON dim_produccion(area_especifica);

-- Índices para Dimensión Recursos Humanos
CREATE INDEX idx_rrhh_periodo ON dim_recursos_humanos(periodo);
CREATE INDEX idx_rrhh_año ON dim_recursos_humanos(año);
CREATE INDEX idx_rrhh_tipo ON dim_recursos_humanos(tipo_contratacion);

-- Índices para Dimensión Desarrollo Digital
CREATE INDEX idx_digital_periodo ON dim_desarrollo_digital(periodo);
CREATE INDEX idx_digital_año ON dim_desarrollo_digital(año);
CREATE INDEX idx_digital_subdimension ON dim_desarrollo_digital(subdimension);

-- Índices para Tabla de Hechos
CREATE INDEX idx_fact_fecha ON fact_eventos(fecha);
CREATE INDEX idx_fact_finanzas ON fact_eventos(finanzas_id);
CREATE INDEX idx_fact_produccion ON fact_eventos(produccion_id);
CREATE INDEX idx_fact_rrhh ON fact_eventos(recursos_humanos_id);
CREATE INDEX idx_fact_digital ON fact_eventos(desarrollo_digital_id);

-- Índices para Reportes
CREATE INDEX idx_reportes_dimension ON reportes(dimension);
CREATE INDEX idx_reportes_fecha ON reportes(fecha_carga);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cada tabla
CREATE TRIGGER update_dim_finanzas_updated_at
    BEFORE UPDATE ON dim_finanzas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dim_produccion_updated_at
    BEFORE UPDATE ON dim_produccion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dim_recursos_humanos_updated_at
    BEFORE UPDATE ON dim_recursos_humanos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dim_desarrollo_digital_updated_at
    BEFORE UPDATE ON dim_desarrollo_digital
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fact_eventos_updated_at
    BEFORE UPDATE ON fact_eventos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reportes_updated_at
    BEFORE UPDATE ON reportes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE dim_finanzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_recursos_humanos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_desarrollo_digital ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo (ajustar según necesidades de seguridad)
CREATE POLICY "Permitir todas las operaciones en dim_finanzas" ON dim_finanzas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas las operaciones en dim_produccion" ON dim_produccion FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas las operaciones en dim_recursos_humanos" ON dim_recursos_humanos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas las operaciones en dim_desarrollo_digital" ON dim_desarrollo_digital FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas las operaciones en fact_eventos" ON fact_eventos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas las operaciones en reportes" ON reportes FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- DATOS DE EJEMPLO (SEED DATA)
-- =====================================================

-- Insertar datos de ejemplo en Finanzas
INSERT INTO dim_finanzas (documento, periodo, año, monto, categoria, subcategoria, descripcion) VALUES
('FIN-001', 'Enero', 2024, 15000.00, 'Marketing', 'Publicidad Digital', 'Campaña de redes sociales'),
('FIN-002', 'Enero', 2024, 8500.00, 'Operaciones', 'Materia Prima', 'Compra de harina y levadura'),
('FIN-003', 'Febrero', 2024, 12000.00, 'Marketing', 'SEO', 'Optimización de sitio web'),
('FIN-004', 'Febrero', 2024, 9500.00, 'Operaciones', 'Mantenimiento', 'Reparación de hornos');

-- Insertar datos de ejemplo en Producción
INSERT INTO dim_produccion (documento, periodo, año, area_especifica, cantidad_producida, unidad_medida, eficiencia_porcentaje) VALUES
('PRD-001', 'Enero', 2024, 'Panadería', 5000, 'unidades', 92.5),
('PRD-002', 'Enero', 2024, 'Pastelería', 2500, 'unidades', 88.0),
('PRD-003', 'Febrero', 2024, 'Panadería', 5500, 'unidades', 94.0),
('PRD-004', 'Febrero', 2024, 'Pastelería', 3000, 'unidades', 90.5);

-- Insertar datos de ejemplo en Recursos Humanos
INSERT INTO dim_recursos_humanos (documento, periodo, año, tipo_contratacion, numero_empleados, departamento, salario_promedio) VALUES
('RH-001', 'Enero', 2024, 'Tiempo Completo', 15, 'Producción', 2500.00),
('RH-002', 'Enero', 2024, 'Medio Tiempo', 8, 'Ventas', 1200.00),
('RH-003', 'Febrero', 2024, 'Tiempo Completo', 17, 'Producción', 2600.00),
('RH-004', 'Febrero', 2024, 'Freelance', 3, 'Marketing', 1800.00);

-- Insertar datos de ejemplo en Desarrollo Digital
INSERT INTO dim_desarrollo_digital (documento, periodo, año, subdimension, inversion, tecnologia, impacto_negocio) VALUES
('DD-001', 'Enero', 2024, 'E-commerce', 5000.00, 'Shopify', 'Aumento de ventas online 25%'),
('DD-002', 'Enero', 2024, 'Automatización', 3500.00, 'Sistema POS', 'Reducción de tiempos de venta'),
('DD-003', 'Febrero', 2024, 'CRM', 4200.00, 'HubSpot', 'Mejora en retención de clientes'),
('DD-004', 'Febrero', 2024, 'Analytics', 2800.00, 'Google Analytics', 'Insights de comportamiento');

-- Insertar reportes de ejemplo
INSERT INTO reportes (nombre_archivo, dimension, tipo_analisis, resumen_ia, total_registros) VALUES
('finanzas_q1_2024.csv', 'finanzas', 'Análisis Trimestral', 'El gasto en marketing representa el 45% del total. Oportunidad de optimización en costos operativos.', 4),
('produccion_enero_2024.csv', 'produccion', 'Análisis Mensual', 'La eficiencia promedio es del 90.25%. La panadería supera consistentemente las metas.', 2);

-- =====================================================
-- VISTAS ÚTILES PARA ANÁLISIS
-- =====================================================

-- Vista: Resumen Financiero por Categoría
CREATE VIEW v_resumen_financiero AS
SELECT
    categoria,
    año,
    periodo,
    COUNT(*) as total_transacciones,
    SUM(monto) as total_monto,
    AVG(monto) as promedio_monto
FROM dim_finanzas
GROUP BY categoria, año, periodo
ORDER BY año DESC, periodo;

-- Vista: Eficiencia de Producción
CREATE VIEW v_eficiencia_produccion AS
SELECT
    area_especifica,
    año,
    periodo,
    SUM(cantidad_producida) as total_producido,
    AVG(eficiencia_porcentaje) as eficiencia_promedio
FROM dim_produccion
GROUP BY area_especifica, año, periodo
ORDER BY año DESC, periodo;

-- Vista: Análisis de Recursos Humanos
CREATE VIEW v_analisis_rrhh AS
SELECT
    departamento,
    tipo_contratacion,
    año,
    periodo,
    SUM(numero_empleados) as total_empleados,
    AVG(salario_promedio) as salario_promedio
FROM dim_recursos_humanos
GROUP BY departamento, tipo_contratacion, año, periodo
ORDER BY año DESC, periodo;

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE dim_finanzas IS 'Dimensión que almacena información financiera de la panadería';
COMMENT ON TABLE dim_produccion IS 'Dimensión que registra datos de producción y eficiencia';
COMMENT ON TABLE dim_recursos_humanos IS 'Dimensión que gestiona información de personal';
COMMENT ON TABLE dim_desarrollo_digital IS 'Dimensión que trackea inversiones en tecnología';
COMMENT ON TABLE fact_eventos IS 'Tabla de hechos central que relaciona todas las dimensiones';
COMMENT ON TABLE reportes IS 'Almacena metadatos de archivos CSV y análisis de IA';
