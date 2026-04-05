import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiBell, FiLock, FiDatabase } from 'react-icons/fi';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    darkMode: false,
    autoBackup: true,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Customize your Debt Pressure experience</p>
      </motion.div>

      <div className="max-w-2xl">
        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FiBell className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Get alerts for upcoming payments</p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email Reminders</p>
                <p className="text-sm text-gray-600">Get email reminders for due dates</p>
              </div>
              <button
                onClick={() => handleToggle('emailReminders')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.emailReminders ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.emailReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Display Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiLock className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Display</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Enable dark theme (coming soon)</p>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                disabled
                className="relative w-12 h-6 rounded-full bg-gray-300 cursor-not-allowed opacity-50"
              >
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiDatabase className="text-orange-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Data</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto Backup</p>
                <p className="text-sm text-gray-600">Automatically backup your data</p>
              </div>
              <button
                onClick={() => handleToggle('autoBackup')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoBackup ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button className="w-full mt-4 btn btn-secondary">
              Export Data as CSV
            </button>

            <button className="w-full btn btn-secondary">
              Clear All Data
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="btn btn-primary flex-1 gap-2"
          >
            <FiSave size={20} />
            Save Settings
          </button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold"
            >
              ✓ Saved!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
      }
