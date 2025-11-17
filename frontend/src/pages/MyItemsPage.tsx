import React, { useEffect, useState } from 'react';
import { itemsAPI } from '../api/items';
import { Item } from '../types';
import ItemCard from '../components/common/ItemCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const MyItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const data = await itemsAPI.getMyItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load your items');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-illini-blue">My Items</h1>
        <div className="flex gap-4">
          <Link to="/report-lost">
            <Button variant="primary">Report Lost</Button>
          </Link>
          <Link to="/report-found">
            <Button variant="secondary">Report Found</Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'all'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({items.length})
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'lost'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Lost ({items.filter(i => i.type === 'lost').length})
        </button>
        <button
          onClick={() => setFilter('found')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'found'
              ? 'bg-illini-orange text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Found ({items.filter(i => i.type === 'found').length})
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            You haven't reported any {filter === 'all' ? '' : filter} items yet
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/report-lost">
              <Button variant="primary">Report Lost Item</Button>
            </Link>
            <Link to="/report-found">
              <Button variant="secondary">Report Found Item</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;
