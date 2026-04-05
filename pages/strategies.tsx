import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiCheck } from 'react-icons/fi';
import { useDebtStore } from '@/store/debtStore';
import { formatCurrency, calculateMonthlyInterest } from '@/utils/calculations';

export default function StrategiesPage() {
  const debts = useDebtStore((state) => state.debts);
  const [selectedStrategy, setSelectedStrategy] = useState<'snowball' | 'avalanche'>('snowball');

  const snowballPlan = useMemo(() => {
    const sorted = [...debts].sort((a, b) => a.balance - b.balance);
    return sorted;
  }, [debts]);

  const avalanchePlan = useMemo(() => {
    const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    return sorted;
  }, [debts]);

  const calculateStrategy = (plan: typeof debts) => {
    let remainingBalance = plan.reduce((sum, d) => sum + d.balance, 0);
    const totalMinimumPayment = plan.reduce((sum, d) => sum + d.minimumPayment, 0);
    let totalInterest = 0;
    let months = 0;

    while (remainingBalance > 0 && months < 600) {
      months++;
      let interest = 0;
      plan.forEach((debt) => {
        const monthlyInterest = calculateMonthlyInterest(debt.balance, debt.interestRate);
        interest += monthlyInterest;
      });
      totalInterest += interest;
      remainingBalance -= totalMinimumPayment;
    }

    return {
      months,
      years: (months / 12).toFixed(1),
      totalInterest,
      totalPaid: plan.reduce((sum, d) => sum + d.balance, 0) + totalInterest,
    };
  };

  const snowballStats = calculateStrategy(snowballPlan);
  const avalancheStats = calculateStrategy(avalanchePlan);

  const activePlan = selectedStrategy === 'snowball' ? snowballPlan : avalanchePlan;
  const activeStats = selectedStrategy === 'snowball' ? snowballStats : avalancheStats;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Payoff Strategies</h1>
        <p className="text-gray-600 mt-2">Choose the best strategy for your financial goals</p>
      </motion.div>

      {debts.length > 0 ? (
        <>
          {/* Strategy Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Snowball Strategy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedStrategy('snowball')}
              className={`card-hover cursor-pointer transition-all ${
                selectedStrategy === 'snowball' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FiTarget className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Snowball Method</h3>
                  <p className="text-sm text-gray-600">Pay smallest debts first</p>
                </div>
              </div>

              <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Payoff Time</p>
                  <p className="text-2xl font-bold text-indigo-600">{snowballStats.years} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(snowballStats.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount Paid</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(snowballStats.totalPaid)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                💡 Best for motivation. Quickly win by eliminating small debts first.
              </p>
            </motion.div>

            {/* Avalanche Strategy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedStrategy('avalanche')}
              className={`card-hover cursor-pointer transition-all ${
                selectedStrategy === 'avalanche' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiTarget className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Avalanche Method</h3>
                  <p className="text-sm text-gray-600">Pay highest interest first</p>
                </div>
              </div>

              <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Payoff Time</p>
                  <p className="text-2xl font-bold text-purple-600">{avalancheStats.years} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(avalancheStats.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount Paid</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(avalancheStats.totalPaid)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                💰 Best for saving. Minimize total interest paid over time.
              </p>
            </motion.div>
          </div>

          {/* Recommended Payoff Order */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recommended Payoff Order ({selectedStrategy === 'snowball' ? 'Snowball' : 'Avalanche'})
            </h3>

            <div className="space-y-4">
              {activePlan.map((debt, index) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                      <span className="badge badge-primary">{debt.interestRate}% APR</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Balance: {formatCurrency(debt.balance)} • Minimum: {formatCurrency(debt.minimumPayment)}/mo
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(debt.balance)}</p>
                    <p className="text-xs text-gray-600 mt-1">Priority #{index + 1}</p>
                  </div>

                  {index === 0 && (
                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                      <FiCheck className="text-green-600" size={24} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-gray-900 mb-2">Strategy Summary</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Target debt #1 first: Focus all extra payments here</li>
                <li>✓ Make minimum payments on other debts</li>
                <li>✓ Once paid off, move to debt #2</li>
                <li>✓ Estimated payoff: {activeStats.years} years</li>
                <li>✓ Total interest: {formatCurrency(activeStats.totalInterest)}</li>
              </ul>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-900">No debts yet</h3>
          <p className="text-gray-600 mt-2">Add debts to see payoff strategies</p>
        </motion.div>
      )}
    </div>
  );
}
