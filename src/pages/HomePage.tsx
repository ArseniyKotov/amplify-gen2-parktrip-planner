/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Link } from 'react-router-dom';
import { useParks } from '../hooks/useParks';
import ParkCard from '../components/ParkCard';

const HomePage: React.FC = () => {
  const { parks, loading } = useParks();

  return (
    <div>
      <section className="relative h-96 mb-12 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-secondary/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
          alt="National Park"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Discover America's{' '}
            <span className="text-primary-light">Natural Wonders</span>
          </h1>
          <p className="text-lg md:text-xl text-text/90 mb-8 max-w-2xl">
            Plan your perfect national park adventure with TrailQuest. Explore
            iconic landscapes, create personalized itineraries, and make
            unforgettable memories.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/parks" className="btn btn-primary">
              Explore Parks
            </Link>
            <Link
              to="/trips"
              className="btn bg-secondary/70 hover:bg-secondary text-text"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Parks</h2>
          <Link to="/parks" className="text-primary-light hover:underline">
            View All Parks →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse">
                <div className="h-40 bg-secondary-light/20 rounded mb-4"></div>
                <div className="h-4 bg-secondary-light/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary-light/20 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-secondary-light/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {parks.slice(0, 3).map((park) => (
              //@ts-ignore
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Why Choose TrailQuest?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Comprehensive information on all 63 national parks</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Personalized trip planning tools</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Activity suggestions based on park features</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-primary-light mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure cloud storage for your trip plans</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Get Started Today</h3>
            <p className="mb-4">
              Create an account to start planning your national park adventures.
              It's free and takes less than a minute.
            </p>
            <div className="space-y-4">
              <Link to="/signup" className="btn btn-primary w-full text-center">
                Sign Up
              </Link>
              <p className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-light hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
