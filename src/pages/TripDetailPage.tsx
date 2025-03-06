/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTrip, updateTrip, deleteTrip } from '../api/tripApi';
import { Trip, UpdateTripInput, CreateActivityInput } from '../api/types';
import { useActivities } from '../hooks/useActivities';
import ActivityItem from '../components/ActivityItem';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [tripForm, setTripForm] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    notes: '',
  });
  const [activityForm, setActivityForm] = useState<CreateActivityInput>({
    //@ts-ignore
    name: '',
    date: new Date().toISOString(),
    location: '',
    notes: '',
    completed: false,
    tripId: id || '',
  });

  const {
    activities,
    loading: activitiesLoading,
    fetchActivities,
    addActivity,
    editActivity,
    removeActivity,
  } = useActivities(id || '');

  useEffect(() => {
    const loadTrip = async () => {
      if (!id) return;

      try {
        const tripData = await getTrip(id);
        if (tripData) {
          setTrip(tripData);
          setTripForm({
            //@ts-ignore
            title: tripData.title,
            //@ts-ignore
            startDate: new Date(tripData.startDate),
            //@ts-ignore
            endDate: new Date(tripData.endDate),
            //@ts-ignore
            notes: tripData.notes || '',
          });
          fetchActivities();
        } else {
          setError(new Error('Trip not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load trip'));
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, fetchActivities]);

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    try {
      const updatedTripData: UpdateTripInput = {
        //@ts-ignore
        id: trip.id,
        //@ts-ignore
        title: tripForm.title,
        startDate: tripForm.startDate.toISOString(),
        endDate: tripForm.endDate.toISOString(),
        notes: tripForm.notes,
      };

      const updatedTrip = await updateTrip(updatedTripData);
      if (updatedTrip) {
        setTrip(updatedTrip);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update trip'));
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;

    try {
      //@ts-ignore
      const success = await deleteTrip(trip.id);
      if (success) {
        navigate('/trips');
      } else {
        throw new Error('Failed to delete trip');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete trip'));
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    try {
      await addActivity(activityForm);
      setActivityForm({
        //@ts-ignore
        name: '',
        date: new Date().toISOString(),
        location: '',
        notes: '',
        completed: false,
        //@ts-ignore
        tripId: trip.id,
      });
      setShowActivityForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to add activity')
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text mb-4">
          Error Loading Trip
        </h2>
        <p className="text-text/70 mb-6">
          {error?.message || 'Trip not found'}
        </p>
        <button onClick={() => navigate('/trips')} className="btn btn-primary">
          Back to Trips
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/trips"
          className="text-primary-light hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Trips
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn bg-secondary/70 hover:bg-secondary text-text"
          >
            {isEditing ? 'Cancel' : 'Edit Trip'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn bg-accent/70 hover:bg-accent text-text"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Edit Trip</h2>
          <form onSubmit={handleUpdateTrip}>
            <div className="mb-4">
              <label className="label" htmlFor="title">
                Trip Name
              </label>
              <input
                type="text"
                id="title"
                value={tripForm.title}
                onChange={(e) =>
                  setTripForm({ ...tripForm, title: e.target.value })
                }
                className="input w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="label">Trip Dates</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block">Start</label>
                  <DatePicker
                    selected={tripForm.startDate}
                    onChange={(date) =>
                      date && setTripForm({ ...tripForm, startDate: date })
                    }
                    className="input w-full"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block">End</label>
                  <DatePicker
                    selected={tripForm.endDate}
                    onChange={(date) =>
                      date && setTripForm({ ...tripForm, endDate: date })
                    }
                    className="input w-full"
                    dateFormat="MMM d, yyyy"
                    minDate={tripForm.startDate}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                value={tripForm.notes}
                onChange={(e) =>
                  setTripForm({ ...tripForm, notes: e.target.value })
                }
                className="input w-full"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {
              //@ts-ignore
              trip.title
            }
          </h1>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-text/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {
                //@ts-ignore
                formatDate(trip.startDate)
              }{' '}
              -{' '}
              {
                //@ts-ignore
                formatDate(trip.endDate)
              }
            </div>

            <div className="flex items-center text-text/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {
                //@ts-ignore
                trip.park?.name || 'Loading park...'
              }
            </div>
          </div>

          {
            //@ts-ignore
            trip.notes && (
              <div className="bg-secondary/10 p-4 rounded-md">
                <p className="text-text/80">
                  {
                    //@ts-ignore
                    trip.notes
                  }
                </p>
              </div>
            )
          }
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Activities</h2>
          <button
            onClick={() => setShowActivityForm(!showActivityForm)}
            className="btn btn-primary text-sm"
          >
            {showActivityForm ? 'Cancel' : 'Add Activity'}
          </button>
        </div>

        {showActivityForm && (
          <div className="card mb-6">
            <h3 className="text-lg font-medium mb-4">New Activity</h3>
            <form onSubmit={handleAddActivity}>
              <div className="mb-3">
                <label className="label" htmlFor="name">
                  Activity Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={
                    //@ts-ignore
                    activityForm.name
                  }
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      //@ts-ignore
                      name: e.target.value,
                    })
                  }
                  className="input w-full"
                  required
                  placeholder="e.g., Hiking Old Faithful Trail"
                />
              </div>

              <div className="mb-3">
                <label className="label" htmlFor="date">
                  Date
                </label>
                <DatePicker
                  selected={
                    //@ts-ignore
                    new Date(activityForm.date)
                  }
                  onChange={(date) =>
                    date &&
                    setActivityForm({
                      ...activityForm,
                      //@ts-ignore
                      date: date.toISOString(),
                    })
                  }
                  className="input w-full"
                  dateFormat="MMM d, yyyy"
                  //@ts-ignore
                  minDate={new Date(trip.startDate)}
                  //@ts-ignore
                  maxDate={new Date(trip.endDate)}
                />
              </div>

              <div className="mb-3">
                <label className="label" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  //@ts-ignore
                  value={activityForm.location}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      //@ts-ignore
                      location: e.target.value,
                    })
                  }
                  className="input w-full"
                  placeholder="e.g., North Entrance"
                />
              </div>

              <div className="mb-4">
                <label className="label" htmlFor="activityNotes">
                  Notes
                </label>
                <textarea
                  id="activityNotes"
                  value={
                    //@ts-ignore
                    activityForm.notes
                  }
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      //@ts-ignore
                      notes: e.target.value,
                    })
                  }
                  className="input w-full"
                  rows={3}
                  placeholder="Any details about this activity..."
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        )}

        {activitiesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-24 animate-pulse">
                <div className="h-4 bg-secondary-light/20 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-secondary-light/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-text/80 mb-2">No activities planned yet.</p>
            <p className="text-text/60 text-sm">
              Add activities to make the most of your trip to{' '}
              {
                //@ts-ignore
                trip.park?.name || 'the park'
              }
              .
            </p>
          </div>
        ) : (
          <div>
            {activities
              .sort(
                (a, b) =>
                  //@ts-ignore
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((activity) => (
                <ActivityItem
                  //@ts-ignore
                  key={activity.id}
                  activity={activity}
                  onUpdate={editActivity}
                  onDelete={removeActivity}
                />
              ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Trip</h3>
            <p className="text-text/80 mb-6">
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn bg-secondary/70 hover:bg-secondary text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTrip}
                className="btn bg-accent hover:bg-accent-light text-text"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailPage;
