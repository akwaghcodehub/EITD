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
