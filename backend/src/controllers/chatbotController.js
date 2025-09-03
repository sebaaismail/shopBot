// backend/src/controllers/chatbotController.js
const products = require("../data/products.json");
const { extractIntent } = require("../services/chatgptService");

async function handleChat(req, res) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("💬 Incoming message:", message);

    const intent = await extractIntent(message);
    console.log("🧠 Extracted intent:", JSON.stringify(intent, null, 2));

    // Define category mappings
    const categoryMap = {
      sneakers: ["sneakers", "running shoes", "sports shoes"],
      sandals: ["sandals", "slippers"],
      formal: ["formal shoes", "dress shoes"],
    };

    const filtered = products.filter((product) => {
      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productPrice = Number(product.price);

      // Category match
      let categoryMatch = true;
      if (intent.category) {
        categoryMatch = productCategory === intent.category.toLowerCase();
      }

      // Price range match
      let priceMatch = true;
      if (intent.priceRange) {
        const { min, max } = intent.priceRange;
        if (min !== null && max !== null) {
          // Both min and max specified
          priceMatch = productPrice >= min && productPrice <= max;
        } else if (min !== null) {
          // Only min specified
          priceMatch = productPrice >= min;
        } else if (max !== null) {
          // Only max specified
          priceMatch = productPrice <= max;
        }
      }

      // Smart filtering based on name and intent filters
      let purposeMatch = true;
      let ageMatch = true;
      let styleMatch = true;

      if (intent.filters) {
        const { purpose, age_group, style } = intent.filters;

        // Check purpose (sport, casual, formal, etc.)
        if (purpose) {
          // Only apply purpose filtering if it was explicitly specified
          const purposeKeywords = {
            sport: ["sport", "training", "running", "athletic", "gym"],
            casual: ["casual", "daily", "walking"],
            formal: ["formal", "dress", "business"],
            comfort: ["comfort", "comfortable"],
          };

          const keywords = purposeKeywords[purpose.toLowerCase()] || [
            purpose.toLowerCase(),
          ];
          purposeMatch = keywords.some(
            (keyword) =>
              productName.toLowerCase().includes(keyword) ||
              product.category.toLowerCase().includes(keyword)
          );
        } else {
          // If no purpose specified, show all products that match other criteria
          purposeMatch = true;
        }

        // Check age group
        if (age_group) {
          const ageKeywords = {
            kids: ["kids", "children", "youth"],
            adult: ["adult", "men", "women"],
            men: ["men"],
            women: ["women"],
          };

          const keywords = ageKeywords[age_group.toLowerCase()] || [
            age_group.toLowerCase(),
          ];
          ageMatch = keywords.some((keyword) => productName.includes(keyword));
        }

        // Check style
        if (style) {
          const styleKeywords = {
            comfortable: ["comfort", "comfortable", "soft"],
            lightweight: ["lightweight", "light"],
            professional: ["professional", "business", "formal"],
          };

          const keywords = styleKeywords[style.toLowerCase()] || [
            style.toLowerCase(),
          ];
          styleMatch = keywords.some((keyword) =>
            productName.includes(keyword)
          );
        }
      }

      const matches =
        categoryMatch && priceMatch && purposeMatch && ageMatch && styleMatch;

      console.log(
        `🔍 Checking: ${product.name} ($${productPrice}) | Category: ${productCategory} | categoryMatch=${categoryMatch} | priceMatch=${priceMatch} | FINAL=${matches}`
      );

      return matches;
    });

    console.log("✅ Filtered products:", filtered);

    res.json({
      products: filtered,
      intent,
      debug: {
        originalMessage: message,
        extractedIntent: intent,
        totalProducts: products.length,
        filteredCount: filtered.length,
      },
    });
  } catch (err) {
    console.error("❌ Error processing chat:", err);
    res.status(500).json({
      error: "Failed to process message",
      details: err.message,
    });
  }
}

module.exports = { handleChat };
