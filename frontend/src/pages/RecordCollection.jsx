// frontend/src/pages/RecordCollection.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { WASTE_TYPES } from '../config/constants';
import { toast } from 'react-toastify';

export const RecordCollection = () => {
  const { account } = useAuthStore();
  const { recordCollection } = useDataStore();

  const [formData, setFormData] = useState({
    wasteType: 'Plastic',
    weight: '',
    latitude: '',
    longitude: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsLoading(false);
        toast.success('Location retrieved successfully');
      },
      (error) => {
        toast.error('Failed to get location: ' + error.message);
        setIsLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.weight || !formData.latitude || !formData.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await recordCollection({
        collectorAddress: account,
        ...formData,
        weight: parseFloat(formData.weight),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });

      toast.success('Collection recorded successfully!');
      setFormData({
        wasteType: 'Plastic',
        weight: '',
        latitude: '',
        longitude: '',
        address: '',
      });
    } catch (error) {
      toast.error('Failed to record collection: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Record Waste Collection</h1>

      {!account && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          Please connect your wallet to record a collection.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        {/* Waste Type */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Waste Type
          </label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          >
            {WASTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in kg"
            step="0.1"
            min="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="mb-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {isLoading ? 'Getting Location...' : 'Use Current Location'}
          </button>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
                step="0.000001"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
                step="0.000001"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Address (Optional)
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter collection address"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!account || isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Recording...' : 'Record Collection'}
        </button>
      </form>
    </div>
  );
};
