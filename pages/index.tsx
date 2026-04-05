import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDebtStore } from '@/store/debtStore';
import { DashboardCards } from '@/components/DashboardCards';
import { formatCurrency } from '@/utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const debts = useDebtStore((state) => state.debts);
  const totalDebt = useDebtStore((state) => state.getTotalDebt());
  const totalMinPayment = useDebtStore((state) => state.getTotalMinimumPayment());

  // Prepare data for pie chart
  const pieData = debts.map((debt) => ({
    name: debt.name,
    value: debt.balance,
  }));

  // Prepare data for line chart (12-month projection)
  const projectionData = useMemo(() => {
    const data = [];
    let currentBalance = totalDebt;
    for (let i = 0; i <= 12; i++) {
      data.push({
        month: i,
        balance: Math.max(0, currentBalance - totalMinPayment * i),
      });
    }
    return data;
  }, [totalDebt, totalMinPayment]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your debt overview.</p>
      </motion.div>

      {/* Dashboard Cards */}
      <DashboardCards debts={debts} />

      {/* Charts Section */}
      {debts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Debt Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Debt Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 12-Month Projection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">12-Month Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  dot={false}
                  strokeWidth={3}
                  name="Remaining Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mt-8 text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-900">No debts yet</h3>
          <p className="text-gray-600 mt-2">Start by adding your first debt to see insights and projections.</p>
        </motion.div>
      )}
    </div>
  );
                  }
