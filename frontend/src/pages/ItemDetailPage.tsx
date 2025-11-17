import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../api/items';
import { Item } from '../types';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import ClaimForm from '../components/forms/ClaimForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const data = await itemsAPI.getItemById(id!);
      setItem(data);
    } catch (err) {
      setError('Failed to load item details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimSuccess = () => {
    setShowClaimModal(false);
    alert('Claim submitted successfully! You will be notified once reviewed.');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Item not found'}
        </div>
      </div>
    );
  }

  const isOwner = user && user._id === item.userId;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    claimed: 'bg-blue-100 text-blue-800',
    expired: 'bg-gray-100 text-gray-800',
  };

  const typeColors = {
    lost: 'bg-red-100 text-red-800',
    found: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded ${typeColors[item.type]}`}>
              {item.type.toUpperCase()}
            </span>
            <span className={`text-sm font-semibold px-3 py-1 rounded ${statusColors[item.status]}`}>
              {item.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-illini-blue mb-4">{item.title}</h1>

          <Card className="mb-6">
            <h2 className="text-xl font-bold text-illini-blue mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-xl font-bold text-illini-blue mb-3">Details</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Category:</span> {item.category}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {item.location}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {format(new Date(item.date), 'MMMM d, yyyy')}
              </p>
              <p>
                <span className="font-semibold">Posted:</span> {format(new Date(item.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-illini-blue mb-3">Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                <a href={`mailto:${item.contactEmail}`} className="text-illini-orange hover:underline">
                  {item.contactEmail}
                </a>
              </p>
              {item.contactPhone && (
                <p>
                  <span className="font-semibold">Phone:</span>{' '}
                  <a href={`tel:${item.contactPhone}`} className="text-illini-orange hover:underline">
                    {item.contactPhone}
                  </a>
                </p>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          {isAuthenticated && !isOwner && item.status === 'active' && (
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => setShowClaimModal(true)}
                className="w-full"
              >
                Claim This Item
              </Button>
            </div>
          )}

          {isOwner && (
            <div className="mt-6 flex gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate(`/items/${item._id}/edit`)}
                className="flex-1"
              >
                Edit Item
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    await itemsAPI.deleteItem(item._id);
                    navigate('/my-items');
                  }
                }}
                className="flex-1"
              >
                Delete Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)}>
        <ClaimForm
          itemId={item._id}
          onSuccess={handleClaimSuccess}
          onCancel={() => setShowClaimModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ItemDetailPage;
