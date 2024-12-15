import { toast } from "sonner";

const API_URL = "http://localhost:8000";

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to get response");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    toast.error("Failed to get AI response. Please try again.");
    throw error;
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data.status === "healthy";
  } catch (error) {
    return false;
  }
};