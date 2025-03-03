'use client';

import { useEffect, useState } from "react"
import { BoxTable } from "@/components/admin/boxes/BoxTable"
import { BoxFilters, type BoxFilters as BoxFiltersType } from "@/components/admin/boxes/BoxFilters"
import { Box } from "@/types/box"
import { useRouter } from "next/navigation"
import { BoxForm } from "@/components/admin/boxes/BoxForm"

export default function BoxesAdminPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<BoxFiltersType>({})
  const [boxes, setBoxes] = useState<Box[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchBoxes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.set('status', filters.status)
      if (filters.userId) queryParams.set('userId', filters.userId)
      if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom)
      if (filters.dateTo) queryParams.set('dateTo', filters.dateTo)

      const response = await fetch(`/api/admin/boxes?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar las cajas')
      }

      const data = await response.json()
      setBoxes(data.boxes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las cajas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoxes()
  }, [filters])

  const handleFilterChange = (newFilters: BoxFiltersType) => {
    setFilters(newFilters)
  }

  const handleStatusChange = async (boxId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/boxes/${boxId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la caja')
      }

      // Recargar las cajas después de actualizar el estado
      await fetchBoxes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado')
    }
  }

  const handleViewDetails = (boxId: string) => {
    router.push(`/admin/boxes/${boxId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Cajas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Nueva Caja
        </button>
      </div>
      
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <BoxFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <BoxTable
          boxes={boxes}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onViewDetails={handleViewDetails}
        />
      </div>

      {showCreateForm && (
        <BoxForm
          onClose={() => {
            setShowCreateForm(false)
            fetchBoxes()
          }}
        />
      )}
    </div>
  )
} 