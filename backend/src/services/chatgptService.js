// backend/src/services/chatgptService.js
/**
 * @fileoverview Service for extracting shopping intents from user messages using OpenRouter API
 * @version 2.0.0
 */
const axios = require("axios");
const { findSimilarProducts } = require("./embeddingService");

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
      1. Main Category (REQUIRED):
         - sneakers: running shoes, sport shoes, athletic footwear, gym shoes
         - formal: dress shoes, business shoes, oxford, loafers, professional footwear
         - sandals: flip-flops, slides, beach footwear, summer shoes, open shoes
      
      2. Price Analysis (ONLY when numbers mentioned):
         - For "between X and Y": set both minPrice and maxPrice
         - For "under/below X": set minPrice to 0 and maxPrice to X
         - For "above/over X": set minPrice to X and maxPrice to null
         - Parse number ranges like "60-75" as minPrice and maxPrice
      
      3. Purpose Detection (ONLY set when EXPLICITLY mentioned):
         - casual: ONLY when "casual" or "everyday" is explicitly mentioned
         - sport: ONLY when "sport", "athletic", "running", "gym" is explicitly mentioned
         - formal: ONLY when "formal", "business", "dress" is explicitly mentioned
         - comfort: ONLY when "comfort" or "comfortable" is explicitly mentioned
      
      4. Additional Attributes (ONLY set when EXPLICITLY mentioned):
         - age_group: ONLY set when "kids", "adult", "men", "women" is explicitly mentioned
         - style: NEVER set for descriptive words like "stylish", "nice", "good"
                 ONLY set for specific style attributes: "lightweight", "professional", "waterproof"
                 When in doubt, leave as null
      
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
              "You are a strict product filter assistant with seasonal awareness. For category selection:\n" +
              "- Summer-related queries (e.g., 'summer shoes', 'beach shoes') -> category='sandals'\n" +
              "- Sport-related queries (e.g., 'running shoes', 'gym shoes') -> category='sneakers'\n" +
              "- Business/formal queries (e.g., 'office shoes', 'dress shoes') -> category='formal'\n\n" +
              "NEVER infer filters, only set them when explicitly mentioned in the query. For example:\n" +
              "- 'stylish summer shoes' -> category='sandals', no purpose or style filters\n" +
              "- 'casual summer shoes' -> category='sandals', purpose='casual'\n" +
              "- 'sport shoes for running' -> category='sneakers', purpose='sport'\n" +
              "- 'formal dress shoes' -> category='formal', purpose='formal'\n" +
              "When in doubt about filters, leave them as null to show more options to the user.",
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

      // Get semantic matches based on the original query
      let semanticMatches = [];
      try {
        semanticMatches = await findSimilarProducts(
          message,
          global.products || [],
          5
        );
      } catch (embeddingError) {
        console.error("Semantic search failed:", embeddingError.message);
        // Continue with basic search even if semantic search fails
      }

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
        semanticMatches: semanticMatches, // Add semantic search results (empty array if failed)
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
