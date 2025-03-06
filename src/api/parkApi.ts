import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { CreateParkInput, Park, UpdateParkInput } from "./types";

const client = generateClient<Schema>();

export const getParks = async (): Promise<Park[]> => {
  try {
    const { data, errors } = await client.models.Park.list();
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error fetching parks:", error);
    return [];
  }
};

export const getPark = async (id: string): Promise<Park | null> => {
  try {
    const { data, errors } = await client.models.Park.get({ id });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error fetching park ${id}:`, error);
    return null;
  }
};

export const createPark = async (park: CreateParkInput): Promise<Park | null> => {
  try {
    const { data, errors } = await client.models.Park.create(park);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error creating park:", error);
    return null;
  }
};

export const updatePark = async (park: UpdateParkInput): Promise<Park | null> => {
  try {
    const { data, errors } = await client.models.Park.update(park);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error(`Error updating park ${park.id}:`, error);
    return null;
  }
};

export const deletePark = async (id: string): Promise<boolean> => {
  try {
    const { errors } = await client.models.Park.delete({ id });
    if (errors) throw new Error(errors[0].message);
    return true;
  } catch (error) {
    console.error(`Error deleting park ${id}:`, error);
    return false;
  }
};
