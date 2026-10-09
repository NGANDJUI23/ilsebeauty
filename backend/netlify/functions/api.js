import serverless from "serverless-http";
import { connectLambda } from "@netlify/blobs";
import { app } from "../../src/app.js";

const run = serverless(app);

// Netlify Function : toute l'API Express derrière /api/* (voir netlify.toml)
export const handler = async (event, context) => {
  // donne accès à Netlify Blobs (stockage des demandes de réservation)
  if (event.blobs) connectLambda(event);
  return run(event, context);
};
