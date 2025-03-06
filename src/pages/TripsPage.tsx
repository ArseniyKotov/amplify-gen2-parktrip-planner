/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';

const TripsPage: React.FC = () => {
  const { trips, loading, error } = useTrips();
  const upcomingTrips = trips.filter(
    //@ts-ignore
    (trip) => new Date(trip.startDate) > new Date()
  );
  //@ts-ignore
  const pastTrips = trips.filter((trip) => new Date(trip.endDate) < new Date());
  const currentTrips = trips.filter((trip) => {
    const now = new Date();
    //@ts-ignore
    return new Date(trip.startDate) <= now && new Date(trip.endDate) >= now;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link to="/parks" className="btn btn-primary">
          Plan New Trip
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32 animate-pulse">
              <div className="h-6 bg-secondary-light/20 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-secondary-light/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-secondary-light/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-6 text-center">
          <p className="text-text/80 mb-4">
            There was an error loading your trips.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : trips.length === 0 ? (
        <div className="card p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-text/30 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-xl font-medium mb-2">No trips planned yet</h3>
          <p className="text-text/70 mb-6">
            Start planning your national park adventure!
          </p>
          <Link to="/parks" className="btn btn-primary">
            Explore Parks
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {currentTrips.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-primary-light rounded-full mr-2"></span>
                Current Trips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTrips.map((trip) => (
                  //@ts-ignore
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {upcomingTrips.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-secondary-light rounded-full mr-2"></span>
                Upcoming Trips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTrips.map((trip) => (
                  //@ts-ignore
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {pastTrips.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-text/30 rounded-full mr-2"></span>
                Past Trips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastTrips.map((trip) => (
                  //@ts-ignore
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default TripsPage;
