import { useState } from "react";
import { Activity, CreateActivityInput, UpdateActivityInput } from "../api/types";
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from "../api/activityApi";

export function useActivities(tripId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities(tripId);
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch activities for trip ${tripId}`));
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (id: string) => {
    setLoading(true);
    try {
      const data = await getActivity(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch activity ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: CreateActivityInput) => {
    setLoading(true);
    try {
      const newActivity = await createActivity(activity);
      if (newActivity) {
        setActivities([...activities, newActivity]);
      }
      setError(null);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create activity"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editActivity = async (activity: UpdateActivityInput) => {
    setLoading(true);
    try {
      const updatedActivity = await updateActivity(activity);
      if (updatedActivity) {
        setActivities(activities.map(a => a.id === activity.id ? updatedActivity : a));
      }
      setError(null);
      return updatedActivity;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update activity ${activity.id}`));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeActivity = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteActivity(id);
      if (success) {
        setActivities(activities.filter(a => a.id !== id));
      }
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete activity ${id}`));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivity,
    addActivity,
    editActivity,
    removeActivity
  };
}
