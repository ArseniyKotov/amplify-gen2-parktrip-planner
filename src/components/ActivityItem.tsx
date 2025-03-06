import React, { useState } from 'react';
import { Activity, UpdateActivityInput } from '../api/types';

interface ActivityItemProps {
  activity: Activity;
  onUpdate: (activity: UpdateActivityInput) => Promise<Activity | null>;
  onDelete: (id: string) => Promise<boolean>;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: activity.name,
    date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : '',
    location: activity.location || '',
    notes: activity.notes || '',
    completed: activity.completed || false
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleComplete = async () => {
    await onUpdate({
      id: activity.id,
      completed: !activity.completed
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedActivity = await onUpdate({
      id: activity.id,
      name: formData.name,
      date: new Date(formData.date).toISOString(),
      location: formData.location,
      notes: formData.notes,
      completed: formData.completed
    });
    
    if (updatedActivity) {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="card mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="label">Activity Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input w-full"
              rows={3}
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id={`completed-${activity.id}`}
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor={`completed-${activity.id}`}>Completed</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn bg-secondary-dark/50 hover:bg-secondary-dark text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`card mb-4 border-l-4 ${activity.completed ? 'border-l-primary-light' : 'border-l-secondary-light'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={activity.completed}
            onChange={handleToggleComplete}
            className="mr-3 h-5 w-5 accent-primary-light"
          />
          <div>
            <h4 className={`font-medium ${activity.completed ? 'line-through text-text/70' : 'text-text'}`}>
              {activity.name}
            </h4>
            <p className="text-xs text-text/60 mt-1">
              {formatDate(activity.date)}
              {activity.location && ` • ${activity.location}`}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-text/70 hover:text-primary-light"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1 text-text/70 hover:text-accent-light"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {activity.notes && (
        <div className="mt-3 pl-8">
          <p className="text-sm text-text/70 italic">{activity.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
