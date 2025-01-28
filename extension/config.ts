const config = {
  API_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://www.routinest.com/api",
};

export default config;
