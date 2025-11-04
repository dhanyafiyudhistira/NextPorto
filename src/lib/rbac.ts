import { Role } from '@prisma/client';

/**
 * Role-Based Access Control (RBAC) helpers
 */

export const canManageMaster = (role: Role): boolean => {
  return role === Role.ADMIN;
};

export const canConfirmOrder = (role: Role): boolean => {
  return role === Role.ADMIN;
};

export const canCreateOrder = (role: Role): boolean => {
  // Both ADMIN and USER can create orders
  return role === Role.ADMIN || role === Role.USER;
};

export const canViewOrders = (role: Role): boolean => {
  // Both can view orders
  return role === Role.ADMIN || role === Role.USER;
};

export const canManagePurchases = (role: Role): boolean => {
  return role === Role.ADMIN;
};

export const isAdmin = (role: Role): boolean => {
  return role === Role.ADMIN;
};

export const isUser = (role: Role): boolean => {
  return role === Role.USER;
};
