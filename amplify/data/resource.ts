import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Park: a.model({
    id: a.id(),
    name: a.string().required(),
    location: a.string().required(),
    description: a.string(),
    activities: a.string().array(),
    imageUrl: a.string(),
    trips: a.hasMany("Trip", "parkId"),
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Trip: a.model({
    id: a.id(),
    title: a.string().required(),
    startDate: a.date().required(),
    endDate: a.date().required(),
    notes: a.string(),
    userId: a.string(),
    parkId: a.id().required(),
    park: a.belongsTo("Park", "parkId"),
    activities: a.hasMany("Activity", "tripId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Activity: a.model({
    id: a.id(),
    name: a.string().required(),
    date: a.date().required(),
    location: a.string(),
    notes: a.string(),
    completed: a.boolean().default(false),
    tripId: a.id().required(),
    trip: a.belongsTo("Trip", "tripId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
