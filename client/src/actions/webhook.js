"use server";

import axios from "axios";

export const registerWebhook = async () => {
  const webhookURL = `http://localhost:3000/api/webhooks/streamix`;

  const requestData = {
    webhookURL: webhookURL,
  };

  try {
    const response = await axios.post(
      `${process.env.STREAMIX_API_URL}registerWebhook`,
      requestData
    );

    if (!response.status === 200) {
      console.error("Failed to register webhook");
    }
  } catch (error) {
    console.error("Failed to register webhook: ", error);
  }
};
