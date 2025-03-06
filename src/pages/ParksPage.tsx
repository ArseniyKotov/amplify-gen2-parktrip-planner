import React, { useState } from 'react';
import { useParks } from '../hooks/useParks';
import ParkCard from '../components/ParkCard';

const ParksPage: React.FC = () => {
  const { parks, loading } = useParks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // Extract all unique activities from parks
  const allActivities = Array.from(
    new Set(
      parks.flatMap(park => park.activities || [])
    )
  ).sort();
  
  // Filter parks based on search term and selected activities
  const filteredParks = parks.filter(park => {
    const matchesSearch = park.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         park.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivities = selectedActivities.length === 0 || 
                             selectedActivities.some(activity => 
                               park.activities && park.activities.includes(activity)
                             );
    
    return matchesSearch && matchesActivities;
  });
  
  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">National Parks</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search parks by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          
          <div className="md:w-1/3">
            <select 
              className="input w-full appearance-none"
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  toggleActivity(value);
                  e.target.value = ''; // Reset select after selection
                }
              }}
            >
              <option value="">Filter by activity...</option>
              {allActivities.map(activity => (
                !selectedActivities.includes(activity) && (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                )
              ))}
            </select>
          </div>
        </div>
        
        {selectedActivities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedActivities.map(activity => (
              <span 
                key={activity} 
                className="bg-primary/20 text-primary-light text-sm px-2 py-1 rounded-full flex items-center"
              >
                {activity}
                <button 
                  onClick={() => toggleActivity(activity)}
                  className="ml-1 text-text/70 hover:text-text"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
            {selectedActivities.length > 0 && (
              <button 
                onClick={() => setSelectedActivities([])}
                className="text-sm text-text/70 hover:text-text underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse">
              <div className="h-40 bg-secondary-light/20 rounded mb-4"></div>
              <div className="h-4 bg-secondary-light/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-secondary-light/20 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-secondary-light/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredParks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredParks.map(park => (
            <ParkCard key={park.id} park={park} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-text/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">No parks found</h3>
          <p className="text-text/70">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ParksPage;
