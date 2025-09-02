// backend/src/services/chatgptService.js
const axios = require("axios");

async function extractIntent(message) {
  try {
    const prompt = `Extract the specific product category and maximum price from this shopping request: "${message}".
      Rules:
      - For sneakers/running shoes/sports shoes, use category "sneakers"
      - For formal shoes, use category "formal"
      - For sandals/slippers, use category "sandals"
      - Extract the exact maximum price number
      - If no price mentioned, set maxPrice to null
      - If no category is clearly specified, set category to null
      
      Respond with a JSON object exactly in this format:
      {"category": "sneakers", "maxPrice": 40}
      
      Only respond with the JSON, no other text.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a product filter assistant. Extract category and maxPrice from the user request in JSON format: {category, maxPrice}",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/ShopBot",
          "X-Title": "ShopBot",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    console.log("OpenRouter GPT Response:", content);

    try {
      const parsed = JSON.parse(content);
      return {
        category: parsed.category || null,
        maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
      };
    } catch (parseError) {
      console.error("Failed to parse OpenRouter response:", content);
      return { category: null, maxPrice: null };
    }
  } catch (error) {
    console.error(
      "OpenRouter API error:",
      error.response?.data || error.message
    );
    return { category: null, maxPrice: null };
  }
}

module.exports = { extractIntent };
