import { app } from "./app.js";
import { config } from "./config.js";

// Serveur local (npm run dev / npm start). Sur Netlify, c'est netlify/functions/api.js qui sert l'app.
app.listen(config.port, () => {
  console.log(`ILSEBEAUTY API sur http://localhost:${config.port}`);
});
