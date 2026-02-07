import axios from "axios";

const tenantId = process.env.POWERBI_TENANT_ID!;
const clientId = process.env.POWERBI_CLIENT_ID!;
const clientSecret = process.env.POWERBI_CLIENT_SECRET!;

export async function getPowerBIAccessToken(): Promise<string> {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("scope", "https://analysis.windows.net/powerbi/api/.default");

  const response = await axios.post(url, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
}
