
import { API_BASE_URL } from "./api";

export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    console.log("API Connection:", data);

    return data;
  } catch (error) {
    console.log("API Connection Failed:", error.message);
    return null;
  }
};
