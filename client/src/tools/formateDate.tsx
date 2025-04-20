import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  return format(newDate, 'd MMMM yyyy', { locale: ru });
};
