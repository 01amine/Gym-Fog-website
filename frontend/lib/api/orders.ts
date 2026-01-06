import apiClient from './client';
import { GuestOrderCreate, OrderResponse } from '../types';

export async function createGuestOrder(orderData: GuestOrderCreate): Promise<OrderResponse> {
  return apiClient<OrderResponse>('/orders/guest', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}
