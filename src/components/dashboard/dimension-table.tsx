'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useRealtimeData } from '@/hooks/use-realtime-data'
import { createDimensionRecord, updateDimensionRecord, deleteDimensionRecord } from '@/actions/dimension-actions'
import type { DimensionTableName } from '@/types/database.types'
import { toast } from 'sonner'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number' | 'date'
}

interface DimensionTableProps<T> {
  tableName: DimensionTableName
  columns: Column[]
  initialData?: T[]
  title: string
}

export function DimensionTable<T extends Record<string, any>>({
  tableName,
  columns,
  initialData = [],
  title,
}: DimensionTableProps<T>) {
  const { data, isLoading } = useRealtimeData<T>(tableName, initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Partial<T> | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setIsEditing(false)
    setCurrentRecord(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  const handleEdit = (record: T) => {
    setIsEditing(true)
    setCurrentRecord(record)
    setFormData(record)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return

    const result = await deleteDimensionRecord(tableName, id)
    if (result.success) {
      toast.success('Registro eliminado correctamente')
    } else {
      toast.error(result.error || 'No se pudo eliminar el registro')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing && currentRecord?.id) {
        const result = await updateDimensionRecord(tableName, currentRecord.id, formData)
        if (result.success) {
          toast.success('Registro actualizado correctamente')
          setIsDialogOpen(false)
        } else {
          throw new Error(result.error)
        }
      } else {
        const result = await createDimensionRecord(tableName, formData)
        if (result.success) {
          toast.success('Registro creado correctamente')
          setIsDialogOpen(false)
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error al guardar')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && data.length === 0) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={handleCreate} className="bg-gradient-to-r from-primary to-secondary">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Registro
        </Button>
      </div>

      <div className="glass-card rounded-lg overflow-hidden border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">
                  No hay registros disponibles. Crea uno nuevo para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              data.map((record: any) => (
                <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.type === 'number'
                        ? record[column.key]?.toLocaleString()
                        : record[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(record)}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      className="hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para Crear/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Registro' : 'Nuevo Registro'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica los campos necesarios.' : 'Completa los campos para crear un nuevo registro.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              {columns
                .filter((col) => col.key !== 'id' && col.key !== 'created_at' && col.key !== 'updated_at')
                .map((column) => (
                  <div key={column.key} className="grid gap-2">
                    <Label htmlFor={column.key}>{column.label}</Label>
                    <Input
                      id={column.key}
                      type={column.type || 'text'}
                      value={formData[column.key] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [column.key]: column.type === 'number' ? Number(e.target.value) : e.target.value,
                        }))
                      }
                      required
                      className="glass"
                    />
                  </div>
                ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="glass">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-secondary">
                {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
