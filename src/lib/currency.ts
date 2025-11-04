/**
 * Currency formatting utilities for IDR (Indonesian Rupiah)
 */

export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('id-ID').format(numValue);
};
