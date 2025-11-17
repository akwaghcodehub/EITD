import React, { useEffect, useState } from 'react';
import { marketplaceAPI } from '../api/marketplace';
import { MarketplaceItem } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      const data = await marketplaceAPI.getAllItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load marketplace items');
    } finally {
      setIsLoading(false);
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-illini-blue mb-2">Marketplace</h1>
        <p className="text-gray-600">Unclaimed items available for purchase</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items available in the marketplace yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((marketplaceItem) => (
            <Card key={marketplaceItem._id} onClick={() => navigate(`/items/${marketplaceItem.itemId._id}`)}>
              {marketplaceItem.itemId.imageUrl && (
                <img
                  src={marketplaceItem.itemId.imageUrl}
                  alt={marketplaceItem.itemId.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-illini-orange">
                  ${marketplaceItem.price}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
                  AVAILABLE
                </span>
              </div>

              <h3 className="text-xl font-bold text-illini-blue mb-2">
                {marketplaceItem.itemId.title}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {marketplaceItem.itemId.description}
              </p>

              <div className="space-y-1 text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Category:</span> {marketplaceItem.itemId.category}
                </p>
                <p>
                  <span className="font-semibold">Listed:</span>{' '}
                  {format(new Date(marketplaceItem.listedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
