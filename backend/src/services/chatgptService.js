// backend/src/services/chatgptService.js
/**
 * @fileoverview Service for extracting shopping intents from user messages using OpenRouter API
 * @version 1.0.0
 */
const axios = require("axios");

/**
 * Extracts shopping intent from a user message
 * @param {string} message - The user's shopping request message
 * @returns {Object} Parsed intent with category, price range, and filters
 *
 * Response format:
 * {
 *   category: string | null,    // Product category (sneakers, formal, sandals)
 *   priceRange: {
 *     min: number | null,       // Minimum price, null if not specified
 *     max: number | null        // Maximum price, null if not specified
 *   },
 *   filters: {
 *     purpose: string | null,   // Only set when explicitly mentioned (casual, sport, formal, comfort)
 *     age_group: string | null, // Target demographic when specified
 *     style: string | null      // Style preferences when mentioned
 *   }
 * }
 */
async function extractIntent(message) {
  try {
    const prompt = `Analyze this shopping request: "${message}" and extract detailed product preferences.

      Rules for extraction:
      1. Main Category:
         - sneakers: running shoes, sport shoes, athletic footwear
         - formal: dress shoes, business shoes, oxford, loafers
         - sandals: flip-flops, slides, beach footwear
      
      2. Price Analysis:
         - For "between X and Y": set both minPrice and maxPrice
         - For "under/below X": set minPrice to 0 and maxPrice to X
         - For "above/over X": set minPrice to X and maxPrice to null
         - Parse number ranges like "60-75" as minPrice and maxPrice
      
      3. Purpose Detection:
         - casual: everyday wear, regular use, casual style, basic shoes
         - sport: athletic, training, running, gym, sports activities
         - formal: business, dress, professional, office wear
         - comfort: focus on comfort, walking, daily use
      
      4. Additional Attributes:
         - age_group: kids, adult, men, women
         - style: comfortable, lightweight, professional
      
      Respond with a JSON object exactly in this format:
      {
        "category": "sneakers",
        "priceRange": {
          "min": 60,
          "max": 75
        },
        "filters": {
          "purpose": null,  // Only set if explicitly mentioned in query
          "age_group": null,  // Only set if explicitly mentioned in query
          "style": null  // Only set if explicitly mentioned in query
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
              "You are a product filter assistant. When no specific purpose is mentioned, do not set any purpose filter to show all matching products. Only set purpose when explicitly mentioned (e.g., 'sport shoes', 'formal shoes', 'casual shoes').",
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
        priceRange: {
          min: parsed.priceRange?.min || null,
          max: parsed.priceRange?.max || null,
        },
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
