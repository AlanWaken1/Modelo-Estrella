'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  DollarSign,
  Factory,
  Users,
  Laptop,
  BarChart3,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Definición de ítems de navegación
const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Análisis IA',
    url: '/analytics',
    icon: Sparkles,
  },
]

// Dimensiones del modelo estrella
const dimensionItems = [
  {
    title: 'Finanzas',
    url: '/dimensions/finanzas',
    icon: DollarSign,
    description: 'Gestión financiera',
  },
  {
    title: 'Producción',
    url: '/dimensions/produccion',
    icon: Factory,
    description: 'Métricas de producción',
  },
  {
    title: 'Recursos Humanos',
    url: '/dimensions/recursos-humanos',
    icon: Users,
    description: 'Gestión de personal',
  },
  {
    title: 'Desarrollo Digital',
    url: '/dimensions/desarrollo-digital',
    icon: Laptop,
    description: 'Inversiones tecnológicas',
  },
]

// Otros ítems
const otherItems = [
  {
    title: 'Reportes',
    url: '/reports',
    icon: FileText,
  },
  {
    title: 'Gráficos',
    url: '/charts',
    icon: BarChart3,
  },
  {
    title: 'Configuración',
    url: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border glass">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">TioSam BI</h1>
            <p className="text-xs text-muted-foreground">Business Intelligence</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navegación Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={isActive ? 'bg-sidebar-accent' : ''}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dimensiones */}
        <SidebarGroup>
          <SidebarGroupLabel>Dimensiones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dimensionItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.description}
                      className={isActive ? 'bg-sidebar-accent' : ''}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Otros */}
        <SidebarGroup>
          <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={isActive ? 'bg-sidebar-accent' : ''}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Sistema activo</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
