/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { Trip, CreateTripInput, UpdateTripInput } from '../api/types';
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../api/tripApi';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await getTrips();
      setTrips(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trips'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTrip = async (id: string) => {
    setLoading(true);
    try {
      const data = await getTrip(id);
      setError(null);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to fetch trip ${id}`)
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (trip: CreateTripInput) => {
    setLoading(true);
    try {
      const newTrip = await createTrip(trip);
      if (newTrip) {
        setTrips([...trips, newTrip]);
      }
      setError(null);
      return newTrip;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create trip'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editTrip = async (trip: UpdateTripInput) => {
    setLoading(true);
    try {
      const updatedTrip = await updateTrip(trip);
      if (updatedTrip) {
        //@ts-ignore
        setTrips(trips.map((t) => (t.id === trip.id ? updatedTrip : t)));
      }
      setError(null);
      return updatedTrip;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to update trip ${trip.id}`)
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeTrip = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteTrip(id);
      if (success) {
        //@ts-ignore
        setTrips(trips.filter((t) => t.id !== id));
      }
      setError(null);
      return success;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to delete trip ${id}`)
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    fetchTrip,
    addTrip,
    editTrip,
    removeTrip,
  };
}
