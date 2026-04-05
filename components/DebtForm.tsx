import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useDebtStore, Debt } from '@/store/debtStore';

interface DebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingDebt?: Debt | null;
}

export const DebtForm: React.FC<DebtFormProps> = ({ isOpen, onClose, editingDebt }) => {
  const { addDebt, updateDebt } = useDebtStore();
  const [formData, setFormData] = useState({
    name: editingDebt?.name || '',
    balance: editingDebt?.balance || 0,
    minimumPayment: editingDebt?.minimumPayment || 0,
    interestRate: editingDebt?.interestRate || 0,
    dueDate: editingDebt?.dueDate || '',
    category: (editingDebt?.category || 'credit-card') as Debt['category'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('name') || name === 'category' ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDebt) {
      updateDebt(editingDebt.id, formData);
    } else {
      addDebt(formData);
    }
    setFormData({
      name: '',
      balance: 0,
      minimumPayment: 0,
      interestRate: 0,
      dueDate: '',
      category: 'credit-card',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingDebt ? 'Edit Debt' : 'Add New Debt'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Debt Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Chase Credit Card"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Balance ($)</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="input"
                placeholder="5000"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                className="input"
                placeholder="18.99"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Payment ($)</label>
              <input
                type="number"
                name="minimumPayment"
                value={formData.minimumPayment}
                onChange={handleChange}
                className="input"
                placeholder="150"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input">
              <option value="credit-card">Credit Card</option>
              <option value="personal-loan">Personal Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="student-loan">Student Loan</option>
              <option value="auto-loan">Auto Loan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              {editingDebt ? 'Update' : 'Add'} Debt
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
