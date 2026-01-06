"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Clock, Package, Check, Truck, X, MapPin, Phone, User } from 'lucide-react'
import { useMakeOrderAccepted, useMakeOrderDelivered, useMakeOrderDeclined, useMarkOrderReady } from "@/hooks/queries/useorder"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import OrderDetailsModal from "./order-details-modal"
import { AdmindOrder } from "@/lib/types/order"

interface OrdersTableProps {
  orders: AdmindOrder[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const { mutate: makeOrderAccepted } = useMakeOrderAccepted()
  const { mutate: makeOrderDeclined } = useMakeOrderDeclined()
  const { mutate: makeOrderDelivered } = useMakeOrderDelivered()
  const { mutate: makeOrderReady } = useMarkOrderReady()

  const { toast } = useToast()
  const [selectedOrder, setSelectedOrder] = useState<AdmindOrder | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

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

  const handleAction = (order: AdmindOrder, action: "accept" | "decline" | "ready" | "deliver") => {
    switch (action) {
      case "accept":
        makeOrderAccepted(order._id, {
          onSuccess: () => toast({ title: "Commande acceptée", description: "La commande a été acceptée." }),
          onError: () => toast({ title: "Erreur", description: "Impossible d'accepter la commande.", variant: "destructive" })
        })
        break
      case "decline":
        makeOrderDeclined(order._id, {
          onSuccess: () => toast({ title: "Commande refusée", description: "La commande a été refusée." }),
          onError: () => toast({ title: "Erreur", description: "Impossible de refuser la commande.", variant: "destructive" })
        })
        break
      case "ready":
        makeOrderReady(order._id, {
          onSuccess: () => toast({ title: "Commande prête", description: "La commande est marquée comme prête." }),
          onError: () => toast({ title: "Erreur", description: "Impossible de marquer la commande comme prête.", variant: "destructive" })
        })
        break
      case "deliver":
        makeOrderDelivered(order._id, {
          onSuccess: () => toast({ title: "Commande livrée", description: "La commande a été livrée avec succès." }),
          onError: () => toast({ title: "Erreur", description: "Impossible de marquer la commande comme livrée.", variant: "destructive" })
        })
        break
    }
  }

  const handleViewOrder = (order: AdmindOrder) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const getClientInitials = (order: AdmindOrder) => {
    const name = order.client?.full_name || "Guest"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  const getClientName = (order: AdmindOrder) => {
    return order.client?.full_name || "Client invité"
  }

  const getClientContact = (order: AdmindOrder) => {
    if (order.client?.email) return order.client.email
    if (order.client?.phone) return order.client.phone
    if (order.delivery_phone) return order.delivery_phone
    return "N/A"
  }

  const calculateTotal = (order: AdmindOrder) => {
    return order.item.reduce((total, [product, qty]) => total + (product.price_dzd * qty), 0)
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Livraison</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucune commande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {getClientInitials(order)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{getClientName(order)}</p>
                            {order.is_guest_order && (
                              <Badge variant="outline" className="text-xs">Invité</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{getClientContact(order)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.item.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item[0].title}</span>
                            <span className="text-gray-500"> (x{item[1]})</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{calculateTotal(order)} DA</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{order.wilaya || "N/A"}</span>
                        </div>
                        {order.delivery_phone && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{order.delivery_phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </Badge>
                      {order.zr_tracking_id && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking: {order.zr_tracking_id}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        <p className="text-gray-500 text-xs">
                          {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>

                        {order.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleAction(order, "accept")}
                            >
                              Accepter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleAction(order, "decline")}
                            >
                              Refuser
                            </Button>
                          </>
                        )}

                        {order.status === "accepted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(order, "ready")}
                          >
                            Marquer prêt
                          </Button>
                        )}

                        {(order.status === "ready" || order.status === "out_for_delivery") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(order, "deliver")}
                          >
                            Marquer livré
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
      />
    </>
  )
}
