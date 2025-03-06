/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../api/types';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-text">
          {
            //@ts-ignore
            trip.title
          }
        </h3>
        <div className="bg-secondary/40 text-text/90 text-xs px-2 py-1 rounded">
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
      </div>

      <div className="mb-4">
        <p className="text-sm text-text/80">
          <span className="font-medium">Park:</span>{' '}
          {
            //@ts-ignore
            trip.park?.name || 'Loading...'
          }
        </p>
      </div>

      {
        //@ts-ignore
        trip.notes && (
          <div className="mb-4">
            <p className="text-sm text-text/70 line-clamp-2">
              {
                //@ts-ignore
                trip.notes
              }
            </p>
          </div>
        )
      }

      <div className="flex justify-between items-center mt-4">
        <Link
          to={
            //@ts-ignore
            `/trips/${trip.id}`
          }
          className="btn btn-secondary text-sm"
        >
          View Details
        </Link>

        <div className="text-xs text-text/60">
          {
            //@ts-ignore
            trip.activities && trip.activities.length > 0 ? (
              <span>
                {
                  //@ts-ignore
                  trip.activities.length
                }{' '}
                activities planned
              </span>
            ) : (
              <span>No activities yet</span>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default TripCard;
