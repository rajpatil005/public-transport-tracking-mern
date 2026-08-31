import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  UserCircle,
  LogOut,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null, // This will store base64 string
    joinedDate: new Date().toISOString().split('T')[0]
  });

  // Load user data including image from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('kolhapurUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserData(prev => ({ ...prev, ...user }));
        if (user.profileImage) {
          setProfileImagePreview(user.profileImage);
        }
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    } else {
      // Demo user data
      const demoUser = {
        name: 'Aryan Sharma',
        email: 'aryan.sharma@example.com',
        phone: '+91 98765 43210',
        address: '123, Main Street, Kolhapur, Maharashtra 416001',
        profileImage: null,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setUserData(demoUser);
      localStorage.setItem('kolhapurUser', JSON.stringify(demoUser));
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload and store in localStorage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfileImagePreview(base64Image);
        setUserData(prev => ({ ...prev, profileImage: base64Image }));
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeImage = () => {
    if (window.confirm('Remove profile picture?')) {
      setProfileImagePreview(null);
      setUserData(prev => ({ ...prev, profileImage: null }));
    }
  };

  // Save profile changes with image
  const handleSaveProfile = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate
    if (!userData.name || !userData.email || !userData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Save complete user data including image to localStorage
      const userToSave = {
        ...userData,
        profileImage: userData.profileImage || null
      };
      localStorage.setItem('kolhapurUser', JSON.stringify(userToSave));
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('kolhapurUser');
      localStorage.removeItem('kolhapurUserToken');
      navigate('/login');
    }
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            My Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">View and manage your profile information</p>
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

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-200">
              {/* Avatar with upload */}
              <div className="relative group">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt={userData.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-blue-100">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {getInitials(userData.name)}
                    </span>
                  </div>
                )}
                
                {/* Upload overlay */}
                <label className={`absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={!isEditing}
                  />
                </label>

                {/* Remove image button */}
                {profileImagePreview && isEditing && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">{userData.name || 'User'}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {new Date(userData.joinedDate).toLocaleDateString()}
                </p>
                {profileImagePreview && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Profile picture set
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset image preview if cancelled
                        if (userData.profileImage) {
                          setProfileImagePreview(userData.profileImage);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {userData.name || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {userData.email || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {userData.phone || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      {userData.address || 'Not set'}
                    </p>
                  )}
                </div>
              </div>

              {/* Image storage info */}
              {profileImagePreview && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5" />
                    Profile image is saved in your account
                  </p>
                </div>
              )}

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;