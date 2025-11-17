#!/bin/bash

echo "📄 Creating all React pages..."

# Create pages directory
mkdir -p src/pages

# ======================
# AUTH PAGES
# ======================

# LoginPage.tsx
cat > src/pages/LoginPage.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-illini-blue">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@illinois.edu"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-illini-orange font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
EOF

# RegisterPage.tsx
cat > src/pages/RegisterPage.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-illini-blue">Join Us!</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@illinois.edu"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-illini-orange font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
EOF

# ======================
# MAIN PAGES
# ======================

# HomePage.tsx
cat > src/pages/HomePage.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import { IoSearchOutline, IoPricetagOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

const HomePage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-illini-blue to-illini-blue-light text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Lost Something? Found Something?
          </h1>
          <p className="text-xl mb-8">
            The official lost and found platform for the University of Illinois community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/report-lost">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Report Lost Item
                  </Button>
                </Link>
                <Link to="/report-found">
                  <Button variant="outline" className="w-full sm:w-auto !border-white !text-white hover:!bg-white hover:!text-illini-blue">
                    Report Found Item
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" className="w-full sm:w-auto !border-white !text-white hover:!bg-white hover:!text-illini-blue">
                    Browse Items
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-illini-blue mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoSearchOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Report & Search</h3>
              <p className="text-gray-600">
                Report lost or found items and search our extensive database to find matches
              </p>
            </div>

            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoShieldCheckmarkOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Verify & Claim</h3>
              <p className="text-gray-600">
                Submit claims with verification details to prove ownership of items
              </p>
            </div>

            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoPricetagOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Marketplace</h3>
              <p className="text-gray-600">
                Unclaimed items are listed in our marketplace for the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-illini-cloud">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-illini-orange mb-2">500+</h3>
              <p className="text-gray-600">Items Reported</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-illini-orange mb-2">200+</h3>
              <p className="text-gray-600">Items Returned</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-illini-orange mb-2">1000+</h3>
              <p className="text-gray-600">Happy Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-illini-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8">
            Join the Illini community in reuniting with lost belongings
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button variant="secondary" className="!bg-white !text-illini-orange hover:!bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
EOF

# BrowsePage.tsx
cat > src/pages/BrowsePage.tsx << 'EOF'
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
EOF

# ItemDetailPage.tsx
cat > src/pages/ItemDetailPage.tsx << 'EOF'
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
EOF

# ReportLostPage.tsx
cat > src/pages/ReportLostPage.tsx << 'EOF'
import React from 'react';
import ItemForm from '../components/forms/ItemForm';

const ReportLostPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ItemForm type="lost" />
    </div>
  );
};

export default ReportLostPage;
EOF

# ReportFoundPage.tsx
cat > src/pages/ReportFoundPage.tsx << 'EOF'
import React from 'react';
import ItemForm from '../components/forms/ItemForm';

const ReportFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ItemForm type="found" />
    </div>
  );
};

export default ReportFoundPage;
EOF

# MyItemsPage.tsx
cat > src/pages/MyItemsPage.tsx << 'EOF'
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
EOF

# MarketplacePage.tsx
cat > src/pages/MarketplacePage.tsx << 'EOF'
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
EOF

# AdminDashboard.tsx
cat > src/pages/AdminDashboard.tsx << 'EOF'
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
EOF

echo "✅ All pages created!"
echo ""
echo "🎉 Pages setup complete!"
echo ""
echo "Pages created:"
echo "  ✅ LoginPage, RegisterPage"
echo "  ✅ HomePage, BrowsePage"
echo "  ✅ ItemDetailPage"
echo "  ✅ ReportLostPage, ReportFoundPage"
echo "  ✅ MyItemsPage"
echo "  ✅ MarketplacePage"
echo "  ✅ AdminDashboard"
echo ""
echo "Next: Update App.tsx with routing!"