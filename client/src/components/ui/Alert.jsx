// client/src/components/ui/Alert.jsx
import React, { useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle, 
  X 
} from 'lucide-react';

const Alert = ({
  type = 'info',
  message,
  description,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  showIcon = true,
  className = '',
  ...props
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-400'
    }
  };

  const currentType = types[type] || types.info;

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const Icon = currentType.icon;

  return (
    <div
      className={`
        rounded-lg border p-4 ${currentType.bg} ${currentType.border}
        ${className}
      `}
      role="alert"
      {...props}
    >
      <div className="flex items-start">
        {showIcon && Icon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${currentType.iconColor}`} aria-hidden="true" />
          </div>
        )}
        
        <div className={`flex-1 ${showIcon ? 'ml-3' : ''}`}>
          {message && (
            <h3 className={`text-sm font-medium ${currentType.text}`}>
              {message}
            </h3>
          )}
          
          {description && (
            <div className={`mt-2 text-sm ${currentType.text}`}>
              <p>{description}</p>
            </div>
          )}
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`
                  inline-flex rounded-md p-1.5 ${currentType.bg} ${currentType.text}
                  hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-offset-${type}-50 focus:ring-${type}-600
                `}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Alert Component (for floating notifications)
export const ToastAlert = ({
  type = 'info',
  message,
  onClose,
  position = 'top-right',
  ...props
}) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`fixed ${positions[position]} z-50 max-w-sm w-full`}>
      <Alert
        type={type}
        message={message}
        onClose={onClose}
        autoClose={true}
        {...props}
      />
    </div>
  );
};

// Alert Banner Component (full width)
export const AlertBanner = ({
  type = 'info',
  message,
  onClose,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Alert
        type={type}
        message={message}
        onClose={onClose}
        className="rounded-none border-x-0 border-t-0"
        {...props}
      />
    </div>
  );
};

// Confirmation Alert Component
export const ConfirmAlert = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
  ...props
}) => {
  const types = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${type === 'danger' ? 'bg-red-100' : 'bg-blue-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                {type === 'danger' ? (
                  <XCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${types[type]}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;