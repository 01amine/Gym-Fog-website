"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/const/endpoint"
import { UserBase } from "@/lib/types/auth"
import { useCreateUser } from "@/hooks/queries/useAuth"

// Debug import
console.log('API_ENDPOINTS imported:', API_ENDPOINTS);

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}



export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState<UserBase>({
    email: "",
    full_name: "",
    phone_number: "",
    password: "",
    era :""

  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const {mutate}= useCreateUser()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  mutate(formData, {
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      })
      setIsLoading(false)
      onSuccess()
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.message || "Échec de la création de l’utilisateur",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  })
}


  const handleChange = (field: keyof UserBase, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel utilisateur.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Nom et prénom"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Téléphone *</Label>
              <Input
                id="phone_number"
                required
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="+213 123 456 789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Mot de passe"
              />
            </div>
          </div>

          
            
            <div className="space-y-2">
              <Label htmlFor="era">ERA *</Label>
              <Select value={formData.era} onValueChange={(value) => handleChange("era", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'ERA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alger">Alger</SelectItem>
                  <SelectItem value="Tipaza">Tipaza</SelectItem>
                  <SelectItem value="Tiziouzou">Tiziouzou</SelectItem>
                  <SelectItem value="Oran">Oran</SelectItem>
                  <SelectItem value="SidiBelAbbes">SidiBelAbbes</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'utilisateur"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
