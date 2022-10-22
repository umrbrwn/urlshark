export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: process.env.BASE_URL,
  database: process.env.DATABASE_HOST,
});
