import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DimensionTable } from '@/components/dashboard/dimension-table'
import { CSVImport } from '@/components/dashboard/csv-import'
import { AIAnalyst } from '@/components/dashboard/ai-analyst'
import { getDimensionRecords } from '@/actions/dimension-actions'
import type { DimFinanzas } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

const columns = [
  { key: 'documento', label: 'Documento', type: 'text' as const },
  { key: 'periodo', label: 'Periodo', type: 'text' as const },
  { key: 'año', label: 'Año', type: 'number' as const },
  { key: 'monto', label: 'Monto', type: 'number' as const },
  { key: 'categoria', label: 'Categoría', type: 'text' as const },
  { key: 'subcategoria', label: 'Subcategoría', type: 'text' as const },
  { key: 'descripcion', label: 'Descripción', type: 'text' as const },
]

export default async function FinanzasPage() {
  const result = await getDimensionRecords('dim_finanzas')
  const data = result.success ? result.data as DimFinanzas[] : []

  // Calcular métricas
  const totalMonto = data.reduce((sum, record) => sum + (Number(record.monto) || 0), 0)
  const categorias = [...new Set(data.map(r => r.categoria))].length
  const registrosRecientes = data.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Finanzas</h1>
          <p className="text-muted-foreground">
            Gestión y análisis de datos financieros de la organización
          </p>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monto Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalMonto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Suma total de registros
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categorías
              </CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categorias}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tipos diferentes de gastos/ingresos
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Registros
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Transacciones registradas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Importación CSV */}
        <CSVImport tableName="dim_finanzas" />

        {/* Tabla Interactiva */}
        <DimensionTable<DimFinanzas>
          tableName="dim_finanzas"
          columns={columns}
          initialData={data}
          title="Registros Financieros"
        />

        {/* Análisis con IA */}
        <AIAnalyst tableName="dim_finanzas" title="Análisis Financiero con IA" />

        {/* Insights */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Insights y Recomendaciones</CardTitle>
            <CardDescription>Análisis automático de tus datos financieros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Monto Total Registrado</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Has registrado ${totalMonto.toLocaleString('es-ES')} en transacciones.
                      Utiliza el análisis de IA para obtener insights más profundos.
                    </p>
                  </div>
                </div>
                {categorias > 3 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                    <DollarSign className="h-5 w-5 text-secondary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Diversificación de Categorías</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tienes {categorias} categorías diferentes. Considera consolidar categorías similares para un mejor análisis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay suficientes datos para generar insights. Agrega más registros para comenzar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
