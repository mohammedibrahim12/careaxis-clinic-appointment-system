export const formatDateTime = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

export const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
}).format(new Date(value));

export const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0);

export const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
