import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaUpload, FaClock, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';

const FridgeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago

  // Mock fridge ingredients data
  const fridgeItems = [
    { name: 'Spinach', quantity: '1 bunch', freshness: 'fresh', expiryDays: 2, category: 'vegetables' },
    { name: 'Paneer', quantity: '200g', freshness: 'fresh', expiryDays: 5, category: 'dairy' },
    { name: 'Tomatoes', quantity: '4 pieces', freshness: 'good', expiryDays: 3, category: 'vegetables' },
    { name: 'Onions', quantity: '2 large', freshness: 'fresh', expiryDays: 7, category: 'vegetables' },
    { name: 'Rice', quantity: '2kg', freshness: 'fresh', expiryDays: 30, category: 'grains' },
    { name: 'Milk', quantity: '500ml', freshness: 'expiring', expiryDays: 1, category: 'dairy' },
    { name: 'Eggs', quantity: '6 pieces', freshness: 'fresh', expiryDays: 8, category: 'protein' },
    { name: 'Bell Peppers', quantity: '3 pieces', freshness: 'good', expiryDays: 4, category: 'vegetables' }
  ];

  const getFreshnessColor = (freshness) => {
    switch (freshness) {
      case 'fresh': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'expiring': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFreshnessIcon = (freshness) => {
    switch (freshness) {
      case 'fresh': return <FaLeaf className="text-green-600" />;
      case 'good': return <FaClock className="text-yellow-600" />;
      case 'expiring': return <FaExclamationTriangle className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date());
    }, 3000);
  };

  const expiringItems = fridgeItems.filter(item => item.expiryDays <= 2);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaCamera className="text-indigo-600" />
          Fridge Scanner & Ingredients
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Scanning...
              </>
            ) : (
              <>
                <FaCamera className="text-sm" />
                Scan Fridge
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaUpload className="text-sm" />
            Upload Image
          </button>
        </div>
      </div>

      {/* Last Scan Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Last scanned:</strong> {lastScanTime.toLocaleDateString()} at {lastScanTime.toLocaleTimeString()}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Items detected:</strong> {fridgeItems.length} ingredients
        </p>
      </div>

      {/* Expiry Alerts */}
      {expiringItems.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-red-600" />
            <h3 className="font-semibold text-red-800">Expiry Alerts</h3>
          </div>
          <div className="space-y-1">
            {expiringItems.map((item, index) => (
              <p key={index} className="text-sm text-red-700">
                <strong>{item.name}</strong> expires in {item.expiryDays} day{item.expiryDays !== 1 ? 's' : ''}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
        <p className="text-sm text-gray-700 mb-2">
          🍳 You have spinach and paneer - perfect for a protein-rich palak paneer!
        </p>
        <p className="text-sm text-gray-700">
          🥗 Try a fresh vegetable stir-fry with bell peppers, onions, and tomatoes.
        </p>
      </div>

      {/* Ingredients Grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Current Ingredients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fridgeItems.map((item, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-lg border-2 ${getFreshnessColor(item.freshness)}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                {getFreshnessIcon(item.freshness)}
              </div>
              <p className="text-xs opacity-75 mb-1">{item.quantity}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize">{item.category}</span>
                <span>
                  {item.expiryDays <= 2 ? 'Expires soon' : `${item.expiryDays} days left`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Manual Item */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
          + Add ingredient manually
        </button>
      </div>
    </motion.div>
  );
};

export default FridgeScanner;
