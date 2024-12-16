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

export const analyzeFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze file");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    toast.error("Failed to analyze file. Please try again.");
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to transcribe audio");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    toast.error("Failed to transcribe audio. Please try again.");
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