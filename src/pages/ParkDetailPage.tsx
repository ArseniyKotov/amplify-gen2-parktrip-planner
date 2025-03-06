/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPark } from '../api/parkApi';
import { createTrip } from '../api/tripApi';
import { Park, CreateTripInput } from '../api/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ParkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripData, setTripData] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week trip
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPark = async () => {
      if (!id) return;

      try {
        const parkData = await getPark(id);
        if (parkData) {
          setPark(parkData);
          setTripData((prev) => ({
            ...prev,
            //@ts-ignore
            title: `Trip to ${parkData.name}`,
          }));
        } else {
          setError(new Error('Park not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load park'));
      } finally {
        setLoading(false);
      }
    };

    loadPark();
  }, [id]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!park) return;

    setIsSubmitting(true);

    try {
      const newTrip: CreateTripInput = {
        //@ts-ignore
        title: tripData.title,
        startDate: tripData.startDate.toISOString(),
        endDate: tripData.endDate.toISOString(),
        notes: tripData.notes,
        //@ts-ignore
        parkId: park.id,
        userId: '', // Will be filled by Amplify with current user's ID
      };

      const createdTrip = await createTrip(newTrip);
      if (createdTrip) {
        //@ts-ignore
        navigate(`/trips/${createdTrip.id}`);
      } else {
        throw new Error('Failed to create trip');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create trip'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (error || !park) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text mb-4">
          Error Loading Park
        </h2>
        <p className="text-text/70 mb-6">
          {error?.message || 'Park not found'}
        </p>
        <button onClick={() => navigate('/parks')} className="btn btn-primary">
          Back to Parks
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        <img
          src={
            //@ts-ignore
            park.imageUrl ||
            'https://images.unsplash.com/photo-1609766856960-58f368778272?q=80&w=1000'
          }
          alt={
            //@ts-ignore
            park.name
          }
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-6 z-20">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
            {
              //@ts-ignore
              park.name
            }
          </h1>
          <p className="text-lg text-text/90">
            {
              //@ts-ignore
              park.location
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">About This Park</h2>
            <p className="text-text/80 mb-6">
              {
                //@ts-ignore
                park.description || 'No description available for this park.'
              }
            </p>

            {
              //@ts-ignore
              park.activities && park.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Available Activities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {
                      //@ts-ignore
                      park.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="bg-primary/20 text-primary-light px-3 py-1 rounded-full"
                        >
                          {activity}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Park Highlights</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Scenic viewpoints with breathtaking vistas</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                <span>Diverse wildlife habitat and viewing opportunities</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Well-maintained trail system for all skill levels</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span>
                  Educational visitor center with interactive exhibits
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Plan Your Visit</h2>

            {!showTripForm ? (
              <div>
                <p className="text-text/80 mb-6">
                  Ready to explore{' '}
                  {
                    //@ts-ignore
                    park.name
                  }
                  ? Create a trip plan to organize your visit.
                </p>
                <button
                  onClick={() => setShowTripForm(true)}
                  className="btn btn-primary w-full"
                >
                  Plan a Trip
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTrip}>
                <div className="mb-4">
                  <label className="label" htmlFor="title">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={tripData.title}
                    onChange={(e) =>
                      setTripData({ ...tripData, title: e.target.value })
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
                        selected={tripData.startDate}
                        onChange={(date) =>
                          date && setTripData({ ...tripData, startDate: date })
                        }
                        className="input w-full"
                        dateFormat="MMM d, yyyy"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block">End</label>
                      <DatePicker
                        selected={tripData.endDate}
                        onChange={(date) =>
                          date && setTripData({ ...tripData, endDate: date })
                        }
                        className="input w-full"
                        dateFormat="MMM d, yyyy"
                        minDate={tripData.startDate}
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
                    value={tripData.notes}
                    onChange={(e) =>
                      setTripData({ ...tripData, notes: e.target.value })
                    }
                    className="input w-full"
                    rows={4}
                    placeholder="Add any notes or ideas for your trip..."
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTripForm(false)}
                    className="btn bg-secondary-dark/50 hover:bg-secondary-dark text-text flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Trip'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkDetailPage;
