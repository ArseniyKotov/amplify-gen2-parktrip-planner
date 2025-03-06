import React from 'react';
import { Link } from 'react-router-dom';
import { Park } from '../api/types';

interface ParkCardProps {
  park: Park;
}

const ParkCard: React.FC<ParkCardProps> = ({ park }) => {
  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={park.imageUrl || 'https://images.unsplash.com/photo-1609766856960-58f368778272?q=80&w=1000'} 
          alt={park.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-text">{park.name}</h3>
        <p className="text-sm text-text/80 mb-3">{park.location}</p>
        
        {park.activities && park.activities.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {park.activities.slice(0, 3).map((activity, index) => (
              <span key={index} className="inline-block bg-primary/20 text-primary-light text-xs px-2 py-1 rounded">
                {activity}
              </span>
            ))}
            {park.activities.length > 3 && (
              <span className="inline-block bg-primary/20 text-primary-light text-xs px-2 py-1 rounded">
                +{park.activities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <p className="text-sm text-text/70 mb-4 line-clamp-3 flex-grow">
          {park.description || "Explore this beautiful national park and discover its natural wonders."}
        </p>
        
        <Link 
          to={`/parks/${park.id}`}
          className="btn btn-primary text-center mt-auto"
        >
          Plan a Trip
        </Link>
      </div>
    </div>
  );
};

export default ParkCard;
