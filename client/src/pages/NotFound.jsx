// client/src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <div className="inline-flex p-4 bg-red-100 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate('/')} fullWidth>
            Go to Homepage
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} fullWidth>
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;