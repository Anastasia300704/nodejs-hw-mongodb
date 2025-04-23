const getEnvVar = (varName) => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
  return value;
};

module.exports = getEnvVar;
