import React, { useEffect, useState } from 'react';
import { itemsAPI } from '../api/items';
import { Item, CATEGORIES, LOCATIONS } from '../types';
import ItemCard from '../components/common/ItemCard';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Select from '../components/common/Select';

const BrowsePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filters]);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAllItems();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    try {
      const results = await itemsAPI.searchItems(query);
      setFilteredItems(results);
    } catch (err) {
      setError('Search failed');
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      location: '',
    });
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
      <h1 className="text-4xl font-bold text-illini-blue mb-8">Browse Items</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} placeholder="Search by title, description, category..." />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            options={[
              { value: 'lost', label: 'Lost' },
              { value: 'found', label: 'Found' },
            ]}
          />

          <Select
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={CATEGORIES}
          />

          <Select
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            options={LOCATIONS}
          />
        </div>

        {(filters.type || filters.category || filters.location) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-illini-orange hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 text-gray-600">
        Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found matching your criteria</p>
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

export default BrowsePage;
