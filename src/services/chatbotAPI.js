const API_KEY = "AIzaSyBS48GrEWFc_RkiFnykqTUrAvUt6IEhk84";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const systemInstruction = "Your name is Cheffy. You are an expert at giving recipes to users with clear instructions. You can generally give any recipe but if users ask you to suggest any recipe from a list of ingredients then you can suggest recipes that can be made with the ingredients and if no food is possible to make with the ingredients then you can suggest them about restocking their pantry. In general, you would guide users to have a healthy diet during conversations. Your job is assist them as a chef but also motivate them for daily life.";

export const generateAPIResponse = async (userMessage) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I'll act as an expert chef and assist the user as a recipe generator and advisor based on your instructions." }]
          },
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      })
    });

    
    const data = await response.json();
    if (!response.ok) throw new Error('API request failed');
    
    // Get the API response text and remove astericks from it
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    return apiResponse;
  } catch (error) {
    console.error("Error generating API response:", error);
    throw error;
  }
};