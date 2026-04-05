import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDebtStore } from '@/store/debtStore';
import { DebtForm } from '@/components/DebtForm';
import { formatCurrency } from '@/utils/calculations';

export default function DebtsPage() {
  const debts = useDebtStore((state) => state.debts);
  const deleteDebt = useDebtStore((state) => state.deleteDebt);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);

  const handleEdit = (debt: any) => {
    setEditingDebt(debt);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingDebt(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteDebt(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDebt(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Debts</h1>
          <p className="text-gray-600 mt-2">Manage all your debts in one place</p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn btn-primary gap-2"
        >
          <FiPlus size={20} />
          Add Debt
        </button>
      </motion.div>

      <DebtForm isOpen={isFormOpen} onClose={handleCloseForm} editingDebt={editingDebt} />

      {debts.length > 0 ? (
        <div className="grid gap-4">
          {debts.map((debt, index) => (
            <motion.div
              key={debt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{debt.name}</h3>
                    <span className="badge badge-primary">{debt.interestRate}% APR</span>
                    <span className="badge badge-secondary">{debt.category}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(debt.balance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Minimum Payment</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(debt.minimumPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="text-lg font-semibold text-gray-900">{debt.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(debt.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(debt)}
                    className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={20} className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(debt.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: '45%' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-900">No debts yet</h3>
          <p className="text-gray-600 mt-2">Click "Add Debt" to start tracking your debts</p>
          <button
            onClick={handleAddNew}
            className="btn btn-primary mt-4"
          >
            <FiPlus size={20} />
            Add Your First Debt
          </button>
        </motion.div>
      )}
    </div>
  );
    }
