const axios = require("axios");

const uploadToZoho = async (records, moduleName, accessToken) => {
  try {
    const response = await axios.post(
      `https://www.zohoapis.com/crm/v2/${moduleName}`,
      { data: records },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading to Zoho:", error);
    throw new Error("Failed to upload data to Zoho CRM");
  }
};

module.exports = { uploadToZoho };
