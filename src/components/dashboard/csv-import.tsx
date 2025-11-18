'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { bulkImportRecords } from '@/actions/dimension-actions'
import type { DimensionTableName } from '@/types/database.types'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

interface CSVImportProps {
  tableName: DimensionTableName
  onImportComplete?: () => void
}

export function CSVImport({ tableName, onImportComplete }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsedData, setParsedData] = useState<any[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFile(file)
    setUploadProgress(25)

    // Parsear el archivo CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data)
        setUploadProgress(50)
        toast.success(`Archivo parseado: ${results.data.length} registros encontrados`)
      },
      error: (error) => {
        toast.error(`Error al parsear el archivo: ${error.message}`)
        setUploadProgress(0)
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  })

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('No hay datos para importar')
      return
    }

    setIsUploading(true)
    setUploadProgress(75)

    try {
      const result = await bulkImportRecords(tableName, parsedData)

      if (result.success) {
        toast.success(`¡Importación exitosa! ${result.count} registros agregados`)
        setUploadProgress(100)
        setFile(null)
        setParsedData([])

        // Resetear después de 2 segundos
        setTimeout(() => {
          setUploadProgress(0)
          onImportComplete?.()
        }, 2000)
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error: any) {
      toast.error(`Error al importar: ${error.message}`)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar desde CSV
        </CardTitle>
        <CardDescription>
          Arrastra y suelta un archivo CSV o haz clic para seleccionar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {file ? (
              <>
                <FileText className="h-12 w-12 text-primary" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {parsedData.length} registros listos para importar
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {isDragActive
                    ? 'Suelta el archivo aquí'
                    : 'Arrastra un archivo CSV o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Solo archivos .csv
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Preview */}
        {parsedData.length > 0 && (
          <div className="glass rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Vista previa</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {parsedData.length} registros
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Columnas detectadas: {Object.keys(parsedData[0] || {}).join(', ')}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleImport}
            disabled={parsedData.length === 0 || isUploading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            {isUploading ? 'Importando...' : `Importar ${parsedData.length} registros`}
          </Button>
          {file && (
            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setParsedData([])
                setUploadProgress(0)
              }}
              className="glass"
            >
              Cancelar
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground glass rounded-lg p-3">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <p>
            Asegúrate de que las columnas del CSV coincidan con los campos de la base de datos.
            Los campos requeridos son: documento, periodo, año, y los campos específicos de cada dimensión.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
