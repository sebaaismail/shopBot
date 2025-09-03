# ShopBot - E-commerce Product Finder Chatbot

A smart chatbot that helps users find products based on natural language queries. Built with Node.js, Express, and Svelte, powered by OpenRouter AI and featuring STEM (Semantic Token Embedding Matching) v2.0.

## Version History

### v2.0.0 - Semantic Search Update (Current)
- ✨ Implemented STEM (Semantic Token Embedding Matching)
- 🔍 Added semantic search using embeddings for smarter product matching
- 🌞 Enhanced category detection with seasonal awareness
- 🎯 Improved filter handling to prevent over-filtering
- 📝 Better handling of descriptive terms vs. specific attributes

### v1.0.0 - Initial Release
- 🤖 Basic intent extraction using HKMS
- 💰 Price-based filtering
- 👟 Category-based filtering
- 🎯 Purpose-based filtering (casual, sport, formal, comfort)

## Technical Architecture

### Current Implementation: HKMS v1.0 (Hierarchical Keyword-Match System)
The current version implements a hierarchical pattern matching system that processes natural language queries through multiple layers of analysis.

## Technical Architecture: STEM v2.0

STEM (Semantic Token Embedding Matching) v2.0 is our current implementation that combines natural language understanding with semantic search for more intelligent product matching.

### Key Components

1. **Intent Extraction**
   ```javascript
   {
     "category": "sandals",        // Product category
     "priceRange": {              // Price constraints
       "min": 30,
       "max": 60
     },
     "filters": {                 // Additional filters
       "purpose": null,          // e.g., casual, sport, formal
       "age_group": null,        // e.g., kids, adult
       "style": null            // specific attributes only
     }
   }
   ```

2. **Semantic Search**
   ```javascript
   // Using OpenRouter's text-embedding-ada-002 model
   const embeddings = await getEmbeddings(productDescription);
   const similarities = computeCosineSimilarity(queryEmbedding, embeddings);
   ```

3. **Smart Filtering**
   - Category detection with seasonal awareness
   - Explicit vs. descriptive term handling
   - Price range analysis
   - Purpose-based filtering

### Key Concepts

1. **Intent Analysis**
   - Query understanding based on context
   - Seasonal awareness (e.g., "summer shoes" → sandals)
   - Price range interpretation
   - Purpose detection

2. **Semantic Matching**
   - Vector embeddings for text similarity
   - Cosine similarity scoring
   - Smart ranking of results
   - Handling of vague queries

## Chatbot Technical Terminology

### Core Concepts

1. **Intent**
   - The underlying meaning and goal of a user's message
   - Components:
     - Primary Action (find, show, search)
     - Target Category (sneakers, sandals, formal)
     - Constraints (price, purpose, style)
   - Example: "show me running shoes under $50"
     ```javascript
     {
       action: "find",
       category: "sneakers",
       constraints: {
         price: { max: 50 },
         purpose: "sport"
       }
     }
     ```

2. **Semantic Understanding**
   - Converting text to numerical vectors (embeddings)
   - Measuring similarity between concepts
   - Understanding context and relationships
   - Example: "stylish summer shoes" semantically close to "fashionable beach sandals"

3. **Entity Recognition**
   - Identifying specific elements in text:
     - Product Types: "sneakers", "sandals"
     - Price Points: "under $50", "between 30 and 60"
     - Purposes: "for running", "for work"
     - Attributes: "comfortable", "lightweight"

4. **Context Awareness**
   - Seasonal Understanding: summer → sandals
   - Activity Context: gym → sneakers
   - Professional Context: office → formal
   - Example: "professional shoes for meetings" → formal category

5. **Filter Types**
   - **Explicit Filters**
     - Directly mentioned in query
     - Example: "casual shoes" → purpose="casual"
   - **Implicit Understanding**
     - Derived from context
     - Example: "summer shoes" → category="sandals"
   - **Null Filters**
     - When attributes aren't specified
     - Prevents over-filtering

### Query Processing
- **Token**: Individual words or phrases extracted from user input
- **Entity**: Recognized objects (products, categories, prices)
- **Attribute**: Product characteristics (price, style, purpose)
- **Context**: Additional information that affects interpretation

### Matching Systems

#### HKMS v1.0 (Current)
- **Hierarchical**: Multi-level classification system
- **Keyword-based**: Pattern matching using predefined vocabularies
- **Rule-based**: Explicit matching rules for different query types

#### STEM v2.0 (Planned)
- **Semantic**: Understanding meaning beyond exact matches
- **Token**: Breaking down text into meaningful units
- **Embedding**: Converting text to numerical vectors
- **Matching**: Using vector similarity for results

The SmartMatch™ algorithm is an intelligent product matching system that understands natural language queries without requiring complex database schemas. It works through:

### 1. HKMS Components

#### a. Intent Parser
```javascript
{
  action: "find",           // Search intent
  category: "sneakers",     // Product category
  constraints: {            // Limiting factors
    price: { max: 50 },
    attributes: ["comfortable", "sport"]
  }
}
```

#### b. Hierarchical Classification
- Level 1: Main Category (sneakers, formal, sandals)
- Level 2: Sub-type (running, casual, dress)
- Level 3: Attributes (comfortable, lightweight)

#### c. Pattern Matching System
```javascript
{
  "sport": ["sport", "training", "running", "athletic", "gym"],
  "casual": ["casual", "daily", "walking"],
  "formal": ["formal", "dress", "business"],
  "comfort": ["comfort", "comfortable", "soft"]
}
```

### 3. Contextual Understanding
- Processes compound queries ("comfortable sport shoes under $50")
- Handles implicit meanings ("professional shoes" → formal category)
- Manages multiple constraints simultaneously

### 4. Natural Language Processing Flow
1. Query Analysis → Extract user intent
2. Intent Transformation → Convert to searchable attributes
3. Smart Filtering → Apply multi-dimensional matching
4. Result Ranking → Sort by relevance

### 5. Adaptive Matching
- Fuzzy matching for product names
- Contextual synonym handling
- Flexible price range interpretation
- Category association mapping

## Features

- 🤖 Natural language product search
- 💰 Price-based filtering
- 👟 Category-based filtering
- 🎯 Accurate product matching
- 💡 Smart intent extraction using AI
- 🌐 Modern web interface

## Project Structure

```
svelte-product-finder/
│── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── services/       # External services (AI)
│   │   ├── data/          # Mock product database
│   │   └── app.js         # Express app entry point
│   ├── package.json
│   └── .env
│
│── frontend/               # Svelte frontend
│   ├── src/
│   │   ├── lib/           # Reusable components
│   │   └── routes/        # Page components
│   └── package.json
```

## Prerequisites

- Node.js 14+ installed
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=5000
   ```

4. Start the server:
   ```bash
   node src/app.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Examples

SmartMatch™ understands complex natural language queries. Here are some examples:

### Basic Queries
- "Show me sneakers under $40"
- "I want formal shoes between $50 and $100"
- "Find me comfortable sandals under $30"

### Advanced Queries (SmartMatch™ Features)
- Purpose-Specific: "I need professional shoes for work meetings"
- Activity-Based: "Looking for lightweight running shoes"
- Age-Targeted: "Kids sport shoes under $35"
- Style-Focused: "Comfortable casual sneakers for daily wear"
- Multi-Constraint: "Women's comfortable athletic shoes under $70"

### Query Processing Pipeline

Example Query: "comfortable sport shoes under $50"

1. Intent Parsing (HKMS v1.0):
```javascript
{
  "action": "find",
  "category": "sneakers",
  "constraints": {
    "price": {
      "max": 50,
      "currency": "USD"
    },
    "attributes": ["comfortable", "sport"]
  }
}
```

2. Future Processing (STEM v2.0):
```javascript
// 1. Convert query to embedding
const queryEmbedding = await encoder.encode(
  "comfortable sport shoes under $50"
);

// 2. Compare with product embeddings
const productEmbeddings = products.map(p => ({
  id: p.id,
  embedding: p.precomputedEmbedding
}));

// 3. Find similar products using cosine similarity
const results = findSimilarProducts(
  queryEmbedding, 
  productEmbeddings,
  0.7 // similarity threshold
);
```

2. Smart Filtering:
- Matches "sport" against ["sport", "training", "athletic", "gym"]
- Matches "comfortable" against ["comfort", "comfortable", "soft"]
- Applies price constraint ($50)
- Ranks results by relevance

## Product Categories

The chatbot understands these main categories:

1. Sneakers
   - Running shoes
   - Sport sneakers
   - Training shoes
   - Casual sneakers

2. Formal Shoes
   - Oxford shoes
   - Dress shoes
   - Loafers
   - Derby shoes

3. Sandals
   - Comfort sandals
   - Sport sandals
   - Beach sandals
   - Casual sandals

## Technical Details

### Backend

- **Express.js**: Web server framework
- **OpenRouter AI**: For natural language processing
- **Axios**: HTTP client for API requests
- **Dotenv**: Environment configuration

### Frontend

- **Svelte**: UI framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API requests

### API Endpoints

- `POST /api/chatbot`
  - Request body: `{ "message": "your search query" }`
  - Response: `{ "products": [...], "intent": { "category": "...", "maxPrice": ... } }`

## Error Handling

The application includes comprehensive error handling:

- AI service failures
- Invalid user inputs
- Network issues
- JSON parsing errors

## Development

### Adding New Products

Add new products to `backend/src/data/products.json`:

```json
{
  "id": "unique_id",
  "name": "Product Name",
  "category": "sneakers|formal|sandals",
  "price": 99.99,
  "url": "https://shop.com/buy/product-id"
}
```

### Modifying AI Behavior

Adjust the prompt in `backend/src/services/chatgptService.js` to modify how the AI interprets user queries.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing the AI capabilities
- Svelte team for the excellent frontend framework
- Express.js team for the backend framework
