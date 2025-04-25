import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export async function getSecrets() {
  try {
    const client = new SecretsManagerClient({ region: "eu-north-1" });
    const secret_name = "dev/janus-app-secrets/";
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    const secretString = response.SecretString;
    const secrets = JSON.parse(secretString);
    // console.error("secrets fetching secrets:", secrets);
    process.env = { ...process.env, ...secrets };
  } catch (error) {
    console.error("Error fetching secrets:", error);
    throw error;
  }
}
