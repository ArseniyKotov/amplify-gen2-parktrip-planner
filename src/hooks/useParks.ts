import { useState, useEffect } from "react";
import { Park, CreateParkInput, UpdateParkInput } from "../api/types";
import { getParks, getPark, createPark, updatePark, deletePark } from "../api/parkApi";

export function useParks() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchParks = async () => {
    setLoading(true);
    try {
      const data = await getParks();
      setParks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch parks"));
    } finally {
      setLoading(false);
    }
  };

  const fetchPark = async (id: string) => {
    setLoading(true);
    try {
      const data = await getPark(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch park ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addPark = async (park: CreateParkInput) => {
    setLoading(true);
    try {
      const newPark = await createPark(park);
      if (newPark) {
        setParks([...parks, newPark]);
      }
      setError(null);
      return newPark;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create park"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editPark = async (park: UpdateParkInput) => {
    setLoading(true);
    try {
      const updatedPark = await updatePark(park);
      if (updatedPark) {
        setParks(parks.map(p => p.id === park.id ? updatedPark : p));
      }
      setError(null);
      return updatedPark;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update park ${park.id}`));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removePark = async (id: string) => {
    setLoading(true);
    try {
      const success = await deletePark(id);
      if (success) {
        setParks(parks.filter(p => p.id !== id));
      }
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete park ${id}`));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParks();
  }, []);

  return {
    parks,
    loading,
    error,
    fetchParks,
    fetchPark,
    addPark,
    editPark,
    removePark
  };
}
