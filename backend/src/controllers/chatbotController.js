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
      const productCategory = product.category.toLowerCase();
      const productPrice = Number(product.price);

      // Category match
      let categoryMatch = true;
      if (intent.category) {
        categoryMatch = productCategory === intent.category.toLowerCase();
      }

      // Price match
      let priceMatch = true;
      if (intent.maxPrice !== undefined && intent.maxPrice !== null) {
        priceMatch = productPrice <= intent.maxPrice;
      }

      const matches = categoryMatch && priceMatch;

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
