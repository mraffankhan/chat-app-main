import dotenv from "dotenv";

dotenv.config();

const GENERATIVE_API_KEY = process.env.GENERATIVE_API_KEY;

export const getAIResponse = async (req, res) => {
  try {
    const { message, model } = req.body;
    // console.log("AI request:", message, model);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let response;

    if (model === "gemini") {
      response = await handleGeminiResponse(message);
    } else if (model === "gpt") {
      response = await handleGPTResponse(message);
    } else {
      // Default to Gemini if no model specified
      response = await handleGeminiResponse(message);
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error("AI response error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

const handleGeminiResponse = async (message) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GENERATIVE_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini API response:", data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log("Gemini response:", data.candidates[0].content.parts[0].text);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

const handleGPTResponse = async (message) => {
  try {
    // Define the API endpoint
    const url = "https://chatgpt-42.p.rapidapi.com/gpt4";

    // Make a POST request to the API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY, // Secure API key via environment variable
        "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: message }, // Dynamically passing the user's message
        ],
        web_access: false, // Set to false for this use case
      }),
    });

    // Parse the response
    const data = await response.json();

    // Check for success status
    if (!data.status) {
      throw new Error("API response indicates failure");
    }

    // Return the result content
    return data.result;
  } catch (error) {
    console.error("GPT API error:", error.message || error);
    throw error; // Re-throw error for further handling
  }
};
