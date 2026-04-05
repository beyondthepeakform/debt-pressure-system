import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDebtStore } from '@/store/debtStore';
import { formatCurrency } from '@/utils/calculations';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';

export default function AnalyticsPage() {
  const debts = useDebtStore((state) => state.debts);

  // Category breakdown
  const categoryData = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    debts.forEach((debt) => {
      grouped[debt.category] = (grouped[debt.category] || 0) + debt.balance;
    });
    return Object.entries(grouped).map(([category, balance]) => ({
      name: category.replace('-', ' ').toUpperCase(),
      value: balance,
    }));
  }, [debts]);

  // Interest rate vs balance scatter
  const scatterData = debts.map((debt) => ({
    balance: debt.balance,
    interestRate: debt.interestRate,
    name: debt.name,
  }));

  // Monthly payment comparison
  const paymentData = debts.map((debt) => ({
    name: debt.name,
    payment: debt.minimumPayment,
    interest: (debt.balance * (debt.interestRate / 100)) / 12,
  }));

  // 24-month projection
  const projectionData = useMemo(() => {
    const data = [];
    const totalMinPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
    let remainingBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    let totalInterestPaid = 0;

    for (let month = 0; month <= 24; month++) {
      totalInterestPaid += remainingBalance * 0.15 / 12; // Rough estimate
      remainingBalance = Math.max(0, remainingBalance - totalMinPayment);
      data.push({
        month,
        balance: remainingBalance,
        interestPaid: totalInterestPaid,
      });
    }
    return data;
  }, [debts]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const avgInterestRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length : 0;
  const monthlyInterestCost = debts.reduce((sum, d) => sum + (d.balance * d.interestRate / 100 / 12), 0);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Deep dive into your debt analytics</p>
      </motion.div>

      {debts.length > 0 ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200"
            >
              <p className="text-sm text-indigo-700 font-medium">Total Debt</p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">{formatCurrency(totalDebt)}</p>
              <p className="text-xs text-indigo-600 mt-2">Across {debts.length} debts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            >
              <p className="text-sm text-purple-700 font-medium">Avg Interest Rate</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{avgInterestRate.toFixed(2)}%</p>
              <p className="text-xs text-purple-600 mt-2">Weighted average</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            >
              <p className="text-sm text-orange-700 font-medium">Monthly Interest</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{formatCurrency(monthlyInterestCost)}</p>
              <p className="text-xs text-orange-600 mt-2">Interest charges per month</p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </motion.div>

            {/* Payment Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="payment" stackId="a" fill="#6366f1" name="Min Payment" />
                  <Bar dataKey="interest" stackId="a" fill="#ec4899" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Interest Rate vs Balance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Rate vs Balance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="balance" name="Balance" />
                  <YAxis dataKey="interestRate" name="Interest Rate %" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Debts" data={scatterData} fill="#a855f7" />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* 24-Month Projection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Month Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    fill="#6366f1"
                    stroke="#6366f1"
                    fillOpacity={0.6}
                    name="Remaining Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Debt Details Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Debt Name</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Balance</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">APR</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Monthly Interest</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Min Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt) => (
                    <tr key={debt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{debt.name}</td>
                      <td className="text-right py-3 px-4 text-gray-900">{formatCurrency(debt.balance)}</td>
                      <td className="text-right py-3 px-4 text-gray-900">{debt.interestRate}%</td>
                      <td className="text-right py-3 px-4 text-red-600 font-semibold">
                        {formatCurrency((debt.balance * debt.interestRate) / 100 / 12)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900">{formatCurrency(debt.minimumPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-900">No data yet</h3>
          <p className="text-gray-600 mt-2">Add debts to see detailed analytics</p>
        </motion.div>
      )}
    </div>
  );
                               }
