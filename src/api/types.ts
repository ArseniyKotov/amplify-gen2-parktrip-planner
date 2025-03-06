import { Schema } from "../../amplify/data/resource";

export type Park = Schema["Park"];
export type Trip = Schema["Trip"];
export type Activity = Schema["Activity"];

export type CreateParkInput = Omit<Park, "id" | "trips" | "createdAt" | "updatedAt">;
export type UpdateParkInput = Partial<CreateParkInput> & { id: string };

export type CreateTripInput = Omit<Trip, "id" | "activities" | "park" | "createdAt" | "updatedAt">;
export type UpdateTripInput = Partial<Omit<CreateTripInput, "parkId">> & { id: string };

export type CreateActivityInput = Omit<Activity, "id" | "trip" | "createdAt" | "updatedAt">;
export type UpdateActivityInput = Partial<Omit<CreateActivityInput, "tripId">> & { id: string };
