import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle,
  Globe,
  Shield
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    emailUpdates: true,
    smsAlerts: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('kolhapurSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  // Save settings
  const saveSettings = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      localStorage.setItem('kolhapurSettings', JSON.stringify(settings));
      
      // Apply theme
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle
  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle select
  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-gray-600 text-sm mt-1">Customize your app preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">×</button>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            {/* Appearance */}
            <div className="pb-4 sm:pb-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Moon className="h-4 w-4 text-blue-600" />
                Appearance
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Dark Mode</p>
                  <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                </div>
                <button
                  onClick={() => handleToggle('theme')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.theme === 'dark' ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="py-4 sm:py-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                Language
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">App Language</p>
                  <p className="text-xs text-gray-500">Choose your preferred language</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => handleSelect('language', e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>

            {/* Notifications */}
            <div className="py-4 sm:py-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive booking updates and alerts</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Email Updates</p>
                    <p className="text-xs text-gray-500">Receive promotional emails and offers</p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailUpdates')}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.emailUpdates ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">SMS Alerts</p>
                    <p className="text-xs text-gray-500">Get SMS notifications for bookings</p>
                  </div>
                  <button
                    onClick={() => handleToggle('smsAlerts')}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      settings.smsAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.smsAlerts ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="pt-4 sm:pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Security
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add extra security to your account</p>
                </div>
                <button className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Enable
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={saveSettings}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;