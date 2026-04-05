import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { formatCurrency, calculateDebtPressureScore, getPressureLevel, getPressureColor } from '@/utils/calculations';
import { Debt } from '@/store/debtStore';

interface DashboardCardsProps {
  debts: Debt[];
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ debts }) => {
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinimumPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const averageInterestRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length : 0;
  const pressureScore = calculateDebtPressureScore(debts);
  const pressureLevel = getPressureLevel(pressureScore);
  const pressureColor = getPressureColor(pressureScore);

  const cards = [
    {
      title: 'Total Debt',
      value: formatCurrency(totalDebt),
      icon: FiDollarSign,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Monthly Payment',
      value: formatCurrency(totalMinimumPayment),
      icon: FiCalendar,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Avg Interest Rate',
      value: `${averageInterestRate.toFixed(2)}%`,
      icon: FiTrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Pressure Score',
      value: `${pressureScore}/100`,
      subtitle: pressureLevel,
      icon: FiAlertCircle,
      color: pressureColor,
      bgColor: `bg-${pressureColor}-50`,
      borderColor: `border-${pressureColor}-200`,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`card-hover ${card.bgColor} border-2 ${card.borderColor}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs font-semibold text-gray-600 mt-2 uppercase">{card.subtitle}</p>
                )}
              </div>
              <div className={`p-3 bg-${card.color}-100 rounded-lg`}>
                <Icon className={`text-${card.color}-600`} size={24} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
