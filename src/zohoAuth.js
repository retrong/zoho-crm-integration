const axios = require("axios");

const zohoAuth = async () => {
  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          grant_type: "refresh_token",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Zoho access token:", error);
    throw new Error("Failed to authenticate with Zoho");
  }
};

module.exports = { zohoAuth };
