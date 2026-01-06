import { get_order_by_admin, get_order_per_student, make_order_accepted, make_order_declined, delete_order, make_order_delivered, make_order_printed, make_order_ready } from "@/lib/api/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrdersForStudent(studentId: string) {
  return useQuery({
    queryKey: ['orders', studentId],
    queryFn: () => get_order_per_student(studentId),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!studentId,
  })
}

export function useOrdersForAdmin() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => get_order_by_admin(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useMakeOrderAccepted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => make_order_accepted(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useMakeOrderDeclined() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => make_order_declined(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => delete_order(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useMakeOrderPrinted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => make_order_printed(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useMarkOrderReady() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => make_order_ready(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useMakeOrderDelivered() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => make_order_delivered(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}