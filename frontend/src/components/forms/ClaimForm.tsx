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
