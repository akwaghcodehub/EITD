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
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', type);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      submitData.append('date', formData.date);
      submitData.append('contactEmail', formData.contactEmail);
      submitData.append('contactPhone', formData.contactPhone);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      // Get API URL and token
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create item');
      }

      navigate('/my-items');
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
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

      {/* Image Upload - REPLACED */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-illini-orange focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-illini-orange file:text-white hover:file:bg-illini-orange-dark"
        />
        {imageFile && (
          <p className="text-sm text-green-600 mt-1">
            Selected: {imageFile.name}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Max 5MB - JPG, PNG, GIF, WEBP
        </p>
      </div>

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