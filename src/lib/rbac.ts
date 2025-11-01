import { Role } from '@prisma/client'

export function canManageMaster(role: Role): boolean {
  return role === 'ADMIN'
}

export function canConfirmOrder(role: Role): boolean {
  return role === 'ADMIN'
}

export function canCreateOrder(role: Role): boolean {
  return true // Both ADMIN and USER can create orders
}

export function canViewDashboard(role: Role): boolean {
  return true // Both ADMIN and USER can view dashboard
}
