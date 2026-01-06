"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Package, Check, Truck, User, ShoppingCart, FileText, MapPin, Phone, Mail, X } from "lucide-react"
import { AdmindOrder } from "@/lib/types/order"

interface OrderDetailsModalProps {
  order: AdmindOrder | null
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "accepted": return <Package className="w-4 h-4" />
      case "declined": return <X className="w-4 h-4" />
      case "ready": return <Check className="w-4 h-4" />
      case "out_for_delivery": return <Truck className="w-4 h-4" />
      case "delivered": return <Check className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "accepted": return "bg-blue-100 text-blue-800"
      case "declined": return "bg-red-100 text-red-800"
      case "ready": return "bg-green-100 text-green-800"
      case "out_for_delivery": return "bg-purple-100 text-purple-800"
      case "delivered": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "accepted": return "Accepté"
      case "declined": return "Refusé"
      case "ready": return "Prêt"
      case "out_for_delivery": return "En livraison"
      case "delivered": return "Livré"
      default: return status
    }
  }

  const calculateTotal = () => {
    return order.item.reduce((total, item) => {
      return total + (item[0].price_dzd * item[1])
    }, 0)
  }

  const getClientInitials = () => {
    const name = order.client?.full_name || "Guest"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  const getClientName = () => {
    return order.client?.full_name || "Client invité"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Détails de la commande #{order._id.slice(-8)}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la commande et le client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Statut de la commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${getStatusColor(order.status)} text-sm`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getStatusLabel(order.status)}</span>
                </Badge>
                {order.is_guest_order && (
                  <Badge variant="outline">Commande invité</Badge>
                )}
                <Badge variant="secondary">
                  {order.delivery_type === "delivery" ? "Livraison" : "Retrait"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Créée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {order.zr_tracking_id && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Numéro de suivi: <span className="font-mono">{order.zr_tracking_id}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations du client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">
                    {getClientInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-semibold">{getClientName()}</h3>
                  {order.client?.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{order.client.email}</span>
                    </div>
                  )}
                  {(order.client?.phone || order.delivery_phone) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{order.client?.phone || order.delivery_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {order.delivery_type === "delivery" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.wilaya && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Wilaya:</span>
                    <span>{order.wilaya}</span>
                  </div>
                )}
                {order.delivery_address && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Adresse:</span>
                    <span>{order.delivery_address}</span>
                  </div>
                )}
                {order.delivery_phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Téléphone:</span>
                    <span>{order.delivery_phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.item.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item[0].title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Catégorie: {item[0].category} | Quantité: {item[1]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item[0].price_dzd} DA</p>
                      <p className="text-sm text-muted-foreground">
                        Total: {item[0].price_dzd * item[1]} DA
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total de la commande</span>
                  <span>{calculateTotal()} DA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
