/**
 * @fileoverview Service for handling text embeddings and semantic search
 * @version 2.0.0
 */
const axios = require("axios");
const cosineSimilarity = require("compute-cosine-similarity");

// Cache for product embeddings to avoid recomputing
let productEmbeddingsCache = null;

/**
 * Get embedding vector for a text using OpenRouter's embedding model
 * @param {string} text - Text to get embedding for
 * @returns {Promise<number[]>} Embedding vector
 */
async function getEmbedding(text) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      {
        model: "text-embedding-ada-002", // OpenAI's embedding model through OpenRouter
        input: text,
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

    // Handle the OpenRouter embeddings response format
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      const embedding = response.data.data[0]?.embedding;
      if (embedding && Array.isArray(embedding)) {
        return embedding;
      }
    }

    console.error(
      "Unexpected response format:",
      JSON.stringify(response.data, null, 2)
    );
    throw new Error("Unexpected embedding response format from OpenRouter");
  } catch (error) {
    console.error("Failed to get embedding:", error.message);
    throw error;
  }
}

/**
 * Precompute embeddings for all products
 * @param {Array<Object>} products - List of products to compute embeddings for
 */
async function precomputeProductEmbeddings(products) {
  if (productEmbeddingsCache) {
    return; // Already computed
  }

  productEmbeddingsCache = [];

  for (const product of products) {
    // Combine name and description for richer semantic understanding
    const text = `${product.name} ${product.description}`;
    try {
      const embedding = await getEmbedding(text);
      productEmbeddingsCache.push({
        productId: product.id,
        embedding,
      });
    } catch (error) {
      console.error(
        `Failed to compute embedding for product ${product.id}:`,
        error.message
      );
    }
  }
}

/**
 * Find semantically similar products based on query
 * @param {string} query - User's search query
 * @param {Array<Object>} products - List of all products
 * @param {number} topK - Number of top results to return
 * @returns {Promise<Array<Object>>} Sorted list of products with similarity scores
 */
async function findSimilarProducts(query, products, topK = 5) {
  if (!productEmbeddingsCache) {
    await precomputeProductEmbeddings(products);
  }

  const queryEmbedding = await getEmbedding(query);

  // Calculate similarities
  const similarities = productEmbeddingsCache.map(
    ({ productId, embedding }) => ({
      productId,
      similarity: cosineSimilarity(queryEmbedding, embedding),
    })
  );

  // Sort by similarity and get top K
  similarities.sort((a, b) => b.similarity - a.similarity);
  const topResults = similarities.slice(0, topK);

  // Map back to full product objects and add similarity scores
  return topResults.map((result) => ({
    ...products.find((p) => p.id === result.productId),
    similarityScore: result.similarity,
  }));
}

/**
 * Clear the embeddings cache
 * Useful when products are updated
 */
function clearCache() {
  productEmbeddingsCache = null;
}

module.exports = {
  precomputeProductEmbeddings,
  findSimilarProducts,
  clearCache,
};
