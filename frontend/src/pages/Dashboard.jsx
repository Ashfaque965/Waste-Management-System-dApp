// frontend/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

export const Dashboard = () => {
  const { account } = useAuthStore();
  const {
    collectionStats,
    recyclingStats,
    statsLoading,
    fetchStatistics,
    collectorProfile,
    fetchCollectorProfile,
  } = useDataStore();

  useEffect(() => {
    fetchStatistics();
    if (account) {
      fetchCollectorProfile(account);
    }
  }, [account, fetchStatistics, fetchCollectorProfile]);

  if (statsLoading) {
    return <div className="text-center py-10">Loading statistics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Collector Profile Card */}
      {collectorProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{collectorProfile.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Waste Collected</p>
              <p className="text-2xl font-bold">{collectorProfile.totalWasteCollected} kg</p>
            </div>
            <div>
              <p className="text-gray-600">Total Rewards</p>
              <p className="text-2xl font-bold">{collectorProfile.totalRewards} WMT</p>
            </div>
            <div>
              <p className="text-gray-600">Collections</p>
              <p className="text-2xl font-bold">{collectorProfile.collectionCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Verification Score</p>
              <p className="text-2xl font-bold">{collectorProfile.verificationScore}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Collections Statistics */}
        {collectionStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Collections</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Weight Collected</span>
                <span className="font-bold">
                  {collectionStats.overall?.totalWeight || 0} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Collections</span>
                <span className="font-bold">
                  {collectionStats.overall?.totalCollections || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Weight</span>
                <span className="font-bold">
                  {(collectionStats.overall?.averageWeight || 0).toFixed(2)} kg
                </span>
              </div>
            </div>

            {/* By Waste Type */}
            <h4 className="text-lg font-bold mt-6 mb-3">By Waste Type</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collectionStats.byWasteType?.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span>{item.totalWeight} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recycling Statistics */}
        {recyclingStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Recycling</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Material Recycled</span>
                <span className="font-bold">
                  {recyclingStats.overall?.totalQuantity || 0} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Records</span>
                <span className="font-bold">
                  {recyclingStats.overall?.totalRecords || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Quantity</span>
                <span className="font-bold">
                  {(recyclingStats.overall?.averageQuantity || 0).toFixed(2)} kg
                </span>
              </div>
            </div>

            {/* By Material Type */}
            <h4 className="text-lg font-bold mt-6 mb-3">By Material Type</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recyclingStats.byMaterialType?.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span>{item.totalQuantity} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
