// Category-wise spending
export const categoryAnalytics = (transactions) => {
  const map = {};

  transactions.forEach(tx => {
    if(tx.category.type !== 'expense') return;
    const name = tx.category.name;
    map[name] = (map[name] || 0) + Number(tx.amount);
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value
  }));
};

// Payment method breakdown
export const paymentAnalytics = (transactions) => {
  const map = {};

  transactions.forEach(tx => {
    map[tx.payment_method] =
      (map[tx.payment_method] || 0) + Number(tx.amount);
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value
  }));
};

// Monthly trend
export const monthlyAnalytics = (transactions) => {
  const map = {};

  transactions.forEach(tx => {
    const month = tx.transaction_date.slice(0, 7); // YYYY-MM
    map[month] = (map[month] || 0) + Number(tx.amount);
  });

  return Object.entries(map)
    .sort()
    .map(([month, value]) => ({ month, value }));
};

