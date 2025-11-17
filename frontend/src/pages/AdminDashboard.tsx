import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import { Item, Claim } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'claims'>('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsData, itemsData, claimsData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllItems(),
        adminAPI.getAllClaims(),
      ]);
      setStats(statsData);
      setItems(itemsData);
      setClaims(claimsData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimAction = async (claimId: string, status: 'approved' | 'rejected') => {
    try {
      await adminAPI.updateClaimStatus(claimId, status);
      fetchAdminData();
      alert(`Claim ${status} successfully`);
    } catch (err) {
      alert('Failed to update claim status');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await adminAPI.deleteItem(itemId);
      fetchAdminData();
      alert('Item deleted successfully');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-illini-blue mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'overview'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'items'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'claims'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Claims ({claims.filter(c => c.status === 'pending').length} pending)
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Items</h3>
            <p className="text-4xl font-bold text-illini-blue">{stats.totalItems}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Lost</h3>
            <p className="text-4xl font-bold text-red-600">{stats.activeLost}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Found</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.activeFound}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Claimed</h3>
            <p className="text-4xl font-bold text-green-600">{stats.claimed}</p>
          </Card>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-illini-blue">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <div className="mt-2 space-x-2">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <Button variant="danger" onClick={() => handleDeleteItem(item._id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim._id}>
              <div className="mb-4">
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded ${
                    claim.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : claim.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {claim.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-illini-blue mb-2">Claim Details</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Description:</span> {claim.description}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Verification:</span> {claim.verificationDetails}
              </p>
              {claim.status === 'pending' && (
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    onClick={() => handleClaimAction(claim._id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleClaimAction(claim._id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
