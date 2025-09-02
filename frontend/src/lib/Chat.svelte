<script>
  import { onMount } from 'svelte';
  let input = '';
  let products = [];
  let loading = false;
  let error = null;

  async function sendMessage() {
    if (!input.trim()) return;
    
    loading = true;
    error = null;
    
    try {
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process request');
      }
      
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        products = data.products;
        if (products.length === 0) {
          error = "No products found matching your criteria.";
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error:', err);
      error = err.message || 'Something went wrong. Please try again.';
      products = [];
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !loading) {
      sendMessage();
    }
  }
</script>

<div class="chat-container">
  <div class="input-group">
    <input 
      bind:value={input} 
      on:keypress={handleKeyPress}
      placeholder="Describe what you want (e.g., 'sneakers under $60')" 
      disabled={loading}
    />
    <button on:click={sendMessage} disabled={loading}>
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  {#if products.length > 0}
    <ul class="product-list">
      {#each products as p}
        <li class="product-item">
          <span class="product-name">{p.name}</span>
          <span class="product-price">${p.price}</span>
          <a href={p.url} target="_blank" rel="noopener noreferrer" class="buy-button">
            Buy Now
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error {
    color: #dc3545;
    padding: 10px;
    margin: 10px 0;
    background-color: #f8d7da;
    border-radius: 4px;
  }

  .product-list {
    list-style: none;
    padding: 0;
  }

  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 10px 0;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .product-name {
    flex: 1;
    font-weight: bold;
  }

  .product-price {
    margin: 0 20px;
    color: #28a745;
    font-weight: bold;
  }

  .buy-button {
    background-color: #007bff;
    color: white;
    padding: 5px 15px;
    border-radius: 4px;
    text-decoration: none;
  }

  .buy-button:hover {
    background-color: #0056b3;
  }
</style>
