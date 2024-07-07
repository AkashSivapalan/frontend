import { parseISO, format } from 'date-fns';

export const formatDate = (isoString) => {
    const date = parseISO(isoString);
    return format(date, 'yyyy-MM-dd'); // Customize the format as needed
};