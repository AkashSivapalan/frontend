import { parseISO, isValid } from 'date-fns';

export const aggregateTransactionByMonth = (transactions) => {
  const aggregatedData = {};

  transactions.forEach(transaction => {
    const { datetime, price } = transaction;

    // Validate datetime before parsing
    if (!datetime) {
      console.warn('Undefined datetime:', transaction);
      return;
    }

    const parsedDate = parseISO(datetime);

    if (!isValid(parsedDate)) {
      console.warn('Invalid date:', datetime);
      return;
    }

    const monthYear = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;

    if (!aggregatedData[monthYear]) {
      aggregatedData[monthYear] = 0;
    }

    aggregatedData[monthYear] += price;
  });

  return aggregatedData;
};