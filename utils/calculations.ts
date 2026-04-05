// Financial calculation utilities

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  return balance * (annualRate / 100 / 12);
};

export const calculatePayoffMonths = (balance: number, monthlyPayment: number, annualRate: number): number => {
  if (monthlyPayment <= calculateMonthlyInterest(balance, annualRate)) {
    return Infinity; // Can't pay off if payment is less than interest
  }

  const monthlyRate = annualRate / 100 / 12;
  const months = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
};

export const calculateTotalInterest = (balance: number, monthlyPayment: number, annualRate: number): number => {
  const months = calculatePayoffMonths(balance, monthlyPayment, annualRate);
  if (months === Infinity) return Infinity;
  return monthlyPayment * months - balance;
};

export const calculateDebtPressureScore = (debts: any[]): number => {
  let score = 0;
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const averageRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length : 0;

  // Balance factor (0-40 points)
  if (totalBalance > 0) {
    score += Math.min(40, (totalBalance / 100000) * 40);
  }

  // Interest rate factor (0-30 points)
  score += Math.min(30, (averageRate / 30) * 30);

  // Number of debts factor (0-20 points)
  score += Math.min(20, (debts.length / 10) * 20);

  // Payment-to-income ratio factor (0-10 points)
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  if (totalMinPayment > 0) {
    score += Math.min(10, (totalMinPayment / 10000) * 10);
  }

  return Math.round(score);
};

export const getPressureLevel = (score: number): string => {
  if (score < 20) return 'Low';
  if (score < 40) return 'Moderate';
  if (score < 60) return 'High';
  return 'Critical';
};

export const getPressureColor = (score: number): string => {
  if (score < 20) return 'green';
  if (score < 40) return 'yellow';
  if (score < 60) return 'orange';
  return 'red';
};
