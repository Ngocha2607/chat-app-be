export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY,
  },
});
