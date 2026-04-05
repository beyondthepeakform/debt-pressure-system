// Debt payoff strategy algorithms

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
  dueDate: string;
}

export const snowballStrategy = (debts: DebtItem[]): DebtItem[] => {
  // Sort by balance (smallest first)
  return [...debts].sort((a, b) => a.balance - b.balance);
};

export const avalancheStrategy = (debts: DebtItem[]): DebtItem[] => {
  // Sort by interest rate (highest first)
  return [...debts].sort((a, b) => b.interestRate - a.interestRate);
};

export const calculatePayoffProjection = (
  debts: DebtItem[],
  extraPayment: number,
  strategy: 'snowball' | 'avalanche'
) => {
  const sortedDebts = strategy === 'snowball' ? snowballStrategy(debts) : avalancheStrategy(debts);

  let remainingDebts = JSON.parse(JSON.stringify(sortedDebts));
  let month = 0;
  let totalInterestPaid = 0;
  const projection = [];

  while (remainingDebts.length > 0 && month < 600) {
    month++;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;

    // Calculate interest for all debts
    remainingDebts.forEach((debt: DebtItem) => {
      const interest = debt.balance * (debt.interestRate / 100 / 12);
      monthlyInterest += interest;
      debt.balance += interest;
    });

    // Apply payments (focus on first debt with extra payment)
    let remainingPayment = remainingDebts.reduce((sum: number, d: DebtItem) => sum + d.minimumPayment, 0) + extraPayment;

    for (let i = 0; i < remainingDebts.length && remainingPayment > 0; i++) {
      const debt = remainingDebts[i];
      const payment = Math.min(remainingPayment, debt.balance);
      debt.balance = Math.max(0, debt.balance - payment);
      monthlyPrincipal += payment;
      remainingPayment -= payment;
    }

    totalInterestPaid += monthlyInterest;

    // Remove paid off debts
    remainingDebts = remainingDebts.filter((d: DebtItem) => d.balance > 0);

    if (month % 12 === 0 || remainingDebts.length === 0) {
      projection.push({
        month,
        year: Math.ceil(month / 12),
        totalBalance: remainingDebts.reduce((sum: number, d: DebtItem) => sum + d.balance, 0),
        totalInterestPaid,
        debtsRemaining: remainingDebts.length,
      });
    }
  }

  return {
    payoffMonths: month,
    payoffYears: (month / 12).toFixed(1),
    totalInterestPaid,
    projection,
  };
};
