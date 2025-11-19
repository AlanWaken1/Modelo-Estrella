import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Factory, Users, Laptop, TrendingUp, Activity } from 'lucide-react'

export default function HomePage() {
  const stats = [
    {
      title: 'Ingresos Totales',
      value: '$124,500',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Producción',
      value: '18,500 unidades',
      change: '+8.2%',
      icon: Factory,
      trend: 'up',
    },
    {
      title: 'Empleados',
      value: '43',
      change: '+5',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Inversión Digital',
      value: '$15,500',
      change: '+25.3%',
      icon: Laptop,
      trend: 'up',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Bienvenido a TioSam BI
            </h1>
            <p className="text-muted-foreground">
              Sistema de Business Intelligence con análisis impulsado por IA
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass">
              <Activity className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analizar con IA
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} vs mes anterior
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Dimensiones del Modelo Estrella</CardTitle>
              <CardDescription>
                Accede a los diferentes módulos de análisis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start glass" asChild>
                <a href="/dimensions/finanzas">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Finanzas
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start glass" asChild>
                <a href="/dimensions/produccion">
                  <Factory className="mr-2 h-4 w-4" />
                  Producción
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start glass" asChild>
                <a href="/dimensions/recursos-humanos">
                  <Users className="mr-2 h-4 w-4" />
                  Recursos Humanos
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start glass" asChild>
                <a href="/dimensions/desarrollo-digital">
                  <Laptop className="mr-2 h-4 w-4" />
                  Desarrollo Digital
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Análisis Recientes</CardTitle>
              <CardDescription>
                Últimos insights generados por IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Análisis de Gastos Q1</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      El marketing representa el 45% del gasto total. Oportunidad de optimización detectada.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Eficiencia de Producción</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Eficiencia promedio del 90.25%. La panadería supera las metas consistentemente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="glass-strong border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">Base de datos: Conectada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">Realtime: Activo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">IA: Disponible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
