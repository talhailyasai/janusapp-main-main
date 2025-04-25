const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { execSync } = require("child_process");

const fetchSecretsAndBuild = async () => {
  try {
    const client = new SecretsManagerClient({ region: "eu-north-1" });
    const secretName = "dev/janus-app/frontend";

    const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
    const secrets = JSON.parse(response.SecretString);

    // ✅ Set secrets directly in process.env (No need for cross-env or .env file)
    Object.entries(secrets).forEach(([key, value]) => {
      const formattedKey = key.startsWith("REACT_APP_") ? key : `REACT_APP_${key}`;
      process.env[formattedKey] = value;
    });

    console.log("✅ AWS Secrets injected into process.env",secrets);

    // ✅ Run React build command in the same process where secrets are set
    execSync("react-scripts build", { stdio: "inherit" });

  } catch (error) {
    console.error("❌ Error fetching secrets:", error);
    process.exit(1);
  }
};

// Run the script
fetchSecretsAndBuild();


