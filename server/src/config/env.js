import 'dotenv/config';

// Single source of truth for environment config.
// Read process.env only here; the rest of the app imports `env`.
export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
};
