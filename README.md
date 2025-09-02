# ShopBot - E-commerce Product Finder Chatbot

A smart chatbot that helps users find products based on natural language queries. Built with Node.js, Express, and Svelte, powered by OpenRouter AI.

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

You can ask the chatbot for products using natural language queries like:

- "Show me sneakers under $40"
- "I want formal shoes between $50 and $100"
- "Find me comfortable sandals under $30"

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
