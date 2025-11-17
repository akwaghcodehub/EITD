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
