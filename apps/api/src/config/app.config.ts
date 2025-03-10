export const appConfig = {
  port: process.env.PORT || 3001,
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  swaggerPath: process.env.SWAGGER_PATH || 'docs',
};
