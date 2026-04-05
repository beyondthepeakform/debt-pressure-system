import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
  dueDate: string;
  category: 'credit-card' | 'personal-loan' | 'mortgage' | 'student-loan' | 'auto-loan' | 'other';
  createdAt: string;
}

interface DebtStore {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  recordPayment: (id: string, amount: number) => void;
  getTotalDebt: () => number;
  getTotalMinimumPayment: () => number;
  getAverageInterestRate: () => number;
}

export const useDebtStore = create<DebtStore>(
  persist(
    (set, get) => ({
      debts: [],
      addDebt: (debt) =>
        set((state) => ({
          debts: [
            ...state.debts,
            {
              ...debt,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateDebt: (id, updates) =>
        set((state) => ({
          debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id),
        })),
      recordPayment: (id, amount) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? { ...d, balance: Math.max(0, d.balance - amount) } : d
          ),
        })),
      getTotalDebt: () => get().debts.reduce((sum, d) => sum + d.balance, 0),
      getTotalMinimumPayment: () => get().debts.reduce((sum, d) => sum + d.minimumPayment, 0),
      getAverageInterestRate: () => {
        const debts = get().debts;
        if (debts.length === 0) return 0;
        return debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length;
      },
    }),
    {
      name: 'debt-store',
    }
  )
);
