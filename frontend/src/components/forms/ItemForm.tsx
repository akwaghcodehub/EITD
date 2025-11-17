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
