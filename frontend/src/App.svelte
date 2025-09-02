<script>
  import Chat from './lib/Chat.svelte';
</script>

<main>
  <h1>ShopBot: E-commerce Product Finder</h1>
  <div class="container">
    <Chat />
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    font-size: 2em;
    margin-bottom: 1em;
  }

  .container {
    background: white;
    padding: 2em;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }
</style>
