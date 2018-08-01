/**
 * Sets up config variables for each environment
 */

const staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

const production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
};

const envs = {
  staging,
  production,
};

const envToExport = envs[process.env.NODE_ENV] || envs.staging;

module.exports = envToExport;
