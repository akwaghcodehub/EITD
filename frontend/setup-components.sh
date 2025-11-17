#!/bin/bash

echo "🎨 Creating all React components..."

# Create components directory structure
mkdir -p src/components/common
mkdir -p src/components/forms

# ======================
# COMMON COMPONENTS
# ======================

# Button.tsx
cat > src/components/common/Button.tsx << 'EOF'
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = 'font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-illini-orange hover:bg-illini-orange-light text-white',
    secondary: 'bg-illini-blue hover:bg-illini-blue-light text-white',
    outline: 'border-2 border-illini-orange text-illini-orange hover:bg-illini-orange hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
EOF

# Input.tsx
cat > src/components/common/Input.tsx << 'EOF'
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
EOF

# TextArea.tsx
cat > src/components/common/TextArea.tsx << 'EOF'
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
EOF

# Select.tsx
cat > src/components/common/Select.tsx << 'EOF'
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[] | { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
EOF

# Modal.tsx
cat > src/components/common/Modal.tsx << 'EOF'
import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          {title && <h2 className="text-2xl font-bold text-illini-blue">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <IoClose size={28} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
EOF

# Card.tsx
cat > src/components/common/Card.tsx << 'EOF'
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
EOF

# Navbar.tsx
cat > src/components/common/Navbar.tsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { IoMenu, IoClose } from 'react-icons/io5';
import Button from './Button';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-illini-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-illini-orange">Illini</span>
            <span className="text-2xl font-bold">Lost & Found</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-illini-orange transition">
              Home
            </Link>
            <Link to="/browse" className="hover:text-illini-orange transition">
              Browse Items
            </Link>
            <Link to="/marketplace" className="hover:text-illini-orange transition">
              Marketplace
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/report-lost" className="hover:text-illini-orange transition">
                  Report Lost
                </Link>
                <Link to="/report-found" className="hover:text-illini-orange transition">
                  Report Found
                </Link>
                <Link to="/my-items" className="hover:text-illini-orange transition">
                  My Items
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-illini-orange transition">
                    Admin
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout} className="!py-1 !px-4">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="!py-1 !px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="!py-1 !px-4">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Items
              </Link>
              <Link
                to="/marketplace"
                className="hover:text-illini-orange transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/report-lost"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Report Lost
                  </Link>
                  <Link
                    to="/report-found"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Report Found
                  </Link>
                  <Link
                    to="/my-items"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Items
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="hover:text-illini-orange transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left hover:text-illini-orange transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-illini-orange transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
EOF

# Footer.tsx
cat > src/components/common/Footer.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-illini-blue text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-illini-orange mb-4">
              Illini Lost & Found
            </h3>
            <p className="text-gray-300">
              Helping the University of Illinois community reunite with their lost belongings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-illini-orange transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-illini-orange transition">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-illini-orange transition">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300">
              University of Illinois Urbana-Champaign
              <br />
              Email: support@illinilostfound.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Illini Lost & Found. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
EOF

# ItemCard.tsx
cat > src/components/common/ItemCard.tsx << 'EOF'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types';
import { format } from 'date-fns';
import Card from './Card';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigate = useNavigate();

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
    <Card onClick={() => navigate(`/items/${item._id}`)}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${typeColors[item.type]}`}>
          {item.type.toUpperCase()}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[item.status]}`}>
          {item.status.toUpperCase()}
        </span>
      </div>

      <h3 className="text-xl font-bold text-illini-blue mb-2">{item.title}</h3>
      <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

      <div className="space-y-1 text-sm text-gray-500">
        <p>
          <span className="font-semibold">Category:</span> {item.category}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {item.location}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {format(new Date(item.date), 'MMM d, yyyy')}
        </p>
      </div>
    </Card>
  );
};

export default ItemCard;
EOF

# SearchBar.tsx
cat > src/components/common/SearchBar.tsx << 'EOF'
import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import Button from './Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search items...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10 w-full"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
EOF

# LoadingSpinner.tsx
cat > src/components/common/LoadingSpinner.tsx << 'EOF'
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-4 border-illini-orange border-t-transparent ${sizes[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
EOF

echo "✅ Common components created!"

# ======================
# FORM COMPONENTS
# ======================

# ItemForm.tsx
cat > src/components/forms/ItemForm.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../../api/items';
import { CATEGORIES, LOCATIONS } from '../../types';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';

interface ItemFormProps {
  type: 'lost' | 'found';
}

const ItemForm: React.FC<ItemFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    imageUrl: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await itemsAPI.createItem({
        ...formData,
        type,
      });
      navigate('/my-items');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-illini-blue mb-6">
        Report {type === 'lost' ? 'Lost' : 'Found'} Item
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Input
        label="Item Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="e.g., Blue Backpack"
      />

      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4}
        placeholder="Provide details about the item..."
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={CATEGORIES}
        required
      />

      <Select
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        options={LOCATIONS}
        required
      />

      <Input
        label={type === 'lost' ? 'Date Lost' : 'Date Found'}
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <Input
        label="Image URL (Optional)"
        name="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

      <Input
        label="Contact Email"
        name="contactEmail"
        type="email"
        value={formData.contactEmail}
        onChange={handleChange}
        required
        placeholder="your.email@illinois.edu"
      />

      <Input
        label="Contact Phone (Optional)"
        name="contactPhone"
        type="tel"
        value={formData.contactPhone}
        onChange={handleChange}
        placeholder="(123) 456-7890"
      />

      <div className="flex gap-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          Submit Report
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
EOF

# ClaimForm.tsx
cat > src/components/forms/ClaimForm.tsx << 'EOF'
import React, { useState } from 'react';
import { claimsAPI } from '../../api/claims';
import TextArea from '../common/TextArea';
import Button from '../common/Button';

interface ClaimFormProps {
  itemId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ itemId, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    verificationDetails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      await claimsAPI.createClaim(itemId, formData.description, formData.verificationDetails);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-2xl font-bold text-illini-blue mb-4">Claim This Item</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TextArea
        label="Why do you believe this is your item?"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4}
        placeholder="Describe why you think this item belongs to you..."
      />

      <TextArea
        label="Verification Details"
        name="verificationDetails"
        value={formData.verificationDetails}
        onChange={handleChange}
        required
        rows={4}
        placeholder="Provide specific details that prove ownership (e.g., unique marks, contents, serial numbers)..."
      />

      <div className="flex gap-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          Submit Claim
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ClaimForm;
EOF

echo "✅ Form components created!"
echo ""
echo "🎉 All components created successfully!"
echo ""
echo "Components created:"
echo "  ✅ Button, Input, TextArea, Select"
echo "  ✅ Modal, Card"
echo "  ✅ Navbar, Footer"
echo "  ✅ ItemCard, SearchBar"
echo "  ✅ LoadingSpinner"
echo "  ✅ ItemForm, ClaimForm"
echo ""
echo "Next: Run the pages setup script to create all pages!"