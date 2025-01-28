const config = {
  API_URL: "https://www.routinest.com/api",
};

if (process.env.NODE_ENV === "development") {
  config.API_URL = "http://localhost:3000";
}

export default config;
