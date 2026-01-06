"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, RefreshCw, Plus } from "lucide-react"
import AddMaterialModal from "@/components/materials/add-material-modal"

interface MaterialsHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  onRefresh: () => void
  onExport: () => void
}

export default function MaterialsHeader({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  onRefresh,
  onExport,
}: MaterialsHeaderProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des supports</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un support
          </Button>
        </div>
            </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par titre ou description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="livre">Livre</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="polycopie">Polycopié</SelectItem>
                </SelectContent>
              </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
            <SelectItem value="title">Titre (A→Z)</SelectItem>
            <SelectItem value="price_asc">Prix (croissant)</SelectItem>
            <SelectItem value="price_desc">Prix (décroissant)</SelectItem>
            <SelectItem value="date_desc">Date (récent d'abord)</SelectItem>
            <SelectItem value="date_asc">Date (ancien d'abord)</SelectItem>
                </SelectContent>
              </Select>
            </div>

      <AddMaterialModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}  />
            </div>
  )
}