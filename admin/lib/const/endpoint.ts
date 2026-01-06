export const API_ENDPOINTS = {
  AUTH: {
    ROOT: '/users/',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    ME: '/users/me',
    GET_USER: (userId: string) => `/users/get-user/${userId}`,
    ALL_STUDENTS: '/users/all-students',
    ALL_USERS: '/users/all-users',
    GET_USER_BY_NAME: (name: string) => `/users/get_userby_name/${name}`,
    ADD_ADMIN: (userId: string) => `/users/add-admin/${userId}`,
    ADD_USER: () => `/users/register`,
    REMOVE_ADMIN: (userId: string) => `/users/remove-admin/${userId}`,
    BLOCK_USER: (userId: string) => `/users/block/${userId}`,
    UNBLOCK_USER: (userId: string) => `/users/unblock/${userId}`,
  },
  CATEGORIES: {
    ROOT: '/categories/',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  PRODUCTS: {
    ROOT: '/products/',
    BY_ID: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    ROOT: '/orders',
    GET_ADMIN_ORDERS: 'orders/get_admin_orders',
    ACCEPT_ORDER: (id: string) => `/orders/admin/${id}/accept`,
    DECLINE_ORDER: (id: string) => `/orders/admin/${id}/decline`,
    DELETE_ORDER: (id: string) => `/orders/admin/${id}`,
    DELIVER_ORDER: (id: string) => `/orders/admin/${id}/delivered`,
    PRINT_ORDER: (id: string) => `/orders/admin/${id}/make_printing`,
    MARK_ORDER_READY: (id: string) => `/orders/admin/${id}/ready`,
    BY_ID: (id: string) => `/orders/${id}`,
  },
  Dashboard: {
    ROOT: '/dashboard/analytics',
  },
  NOTIF: {
    ROOT: '/notifications/',
  },
} as const;


