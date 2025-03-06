/* eslint-disable @typescript-eslint/ban-ts-comment */
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { CreateTripInput, Trip, UpdateTripInput } from './types';

const client = generateClient<Schema>();

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const { data, errors } = await client.models.Trip.list();
    if (errors) throw new Error(errors[0].message);
    //@ts-ignore
    return data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

export const getTrip = async (id: string): Promise<Trip | null> => {
  try {
    const { data, errors } = await client.models.Trip.get({ id });
    if (errors) throw new Error(errors[0].message);
    //@ts-ignore
    return data;
  } catch (error) {
    console.error(`Error fetching trip ${id}:`, error);
    return null;
  }
};

export const createTrip = async (
  trip: CreateTripInput
): Promise<Trip | null> => {
  try {
    //@ts-ignore
    const { data, errors } = await client.models.Trip.create(trip);
    if (errors) throw new Error(errors[0].message);
    //@ts-ignore
    return data;
  } catch (error) {
    console.error('Error creating trip:', error);
    return null;
  }
};

export const updateTrip = async (
  trip: UpdateTripInput
): Promise<Trip | null> => {
  try {
    const { data, errors } = await client.models.Trip.update(trip);
    if (errors) throw new Error(errors[0].message);
    //@ts-ignore
    return data;
  } catch (error) {
    console.error(`Error updating trip ${trip.id}:`, error);
    return null;
  }
};

export const deleteTrip = async (id: string): Promise<boolean> => {
  try {
    const { errors } = await client.models.Trip.delete({ id });
    if (errors) throw new Error(errors[0].message);
    return true;
  } catch (error) {
    console.error(`Error deleting trip ${id}:`, error);
    return false;
  }
};
