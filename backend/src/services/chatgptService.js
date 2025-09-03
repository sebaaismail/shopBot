// backend/src/services/chatgptService.js
const axios = require("axios");

async function extractIntent(message) {
  try {
    const prompt = `Analyze this shopping request: "${message}" and extract detailed product preferences.

      Rules for extraction:
      1. Main Category:
         - sneakers: running shoes, sport shoes, athletic footwear
         - formal: dress shoes, business shoes, oxford, loafers
         - sandals: flip-flops, slides, beach footwear
      
      2. Special Attributes (extract if mentioned):
         - purpose: sport, casual, formal, training, running, etc.
         - age_group: kids, adult, men, women
         - style: comfortable, lightweight, professional, etc.
      
      3. Price Range:
         - Extract maximum price if mentioned
         - Default to null if not specified
      
      Respond with a JSON object exactly in this format:
      {
        "category": "sneakers",
        "maxPrice": 40,
        "filters": {
          "purpose": "sport",
          "age_group": "adult",
          "style": "comfortable"
        }
      }
      
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
        filters: parsed.filters || {
          purpose: null,
          age_group: null,
          style: null,
        },
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
