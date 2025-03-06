import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { Activity, CreateActivityInput, UpdateActivityInput } from "./types";

const client = generateClient<Schema>();

export const getActivities = async (tripId: string): Promise<Activity[]> => {
  try {
    const { data, errors } = await client.models.Activity.list({
      filter: { tripId: { eq: tripId } }
    });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error fetching activities for trip ${tripId}:`, error);
    return [];
  }
};

export const getActivity = async (id: string): Promise<Activity | null> => {
  try {
    const { data, errors } = await client.models.Activity.get({ id });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error fetching activity ${id}:`, error);
    return null;
  }
};

export const createActivity = async (activity: CreateActivityInput): Promise<Activity | null> => {
  try {
    const { data, errors } = await client.models.Activity.create(activity);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error creating activity:", error);
    return null;
  }
};

export const updateActivity = async (activity: UpdateActivityInput): Promise<Activity | null> => {
  try {
    const { data, errors } = await client.models.Activity.update(activity);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error updating activity ${activity.id}:`, error);
    return null;
  }
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  try {
    const { errors } = await client.models.Activity.delete({ id });
    if (errors) throw new Error(errors[0].message);
    return true;
  } catch (error) {
    console.error(`Error deleting activity ${id}:`, error);
    return false;
  }
};
