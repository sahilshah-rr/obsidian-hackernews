<script lang="ts">
  import { onDestroy } from 'svelte';
  import type APIManager from "src/apiManager";
  import type { HNItem } from "src/integrations/types";

  export let manager: APIManager;
  export let refreshInterval: number;

  let dataHN: HNItem[];
  let lastFetchedAt: number = 0;

  export async function fetchTopHN() {
    console.log('fetching top story from HackerNews');
    dataHN = await manager.requestTopStories();
    lastFetchedAt = Date.now();
  }

  export async function saveHNItem(index: number) {
    console.log(`saving story ${dataHN[index].title}`);
    await manager.saveHNItem(dataHN[index]);
  }

  addEventListener("obsidian-hackernews-fetchTopHN", fetchTopHN);

  onDestroy(() => {
    removeEventListener('obsidian-hackernews-fetchTopHN', fetchTopHN)
  })
</script>

<div class="main">
  {#if dataHN}
    <div class="results">
      { #each dataHN as storyHN, index }
        <div class="container">
          <a href="{ storyHN.url }" target="_blank" class="hn-link">{ storyHN.title }</a>
          <p class="hn-actions">
            <a href="{ storyHN.url }" target="_blank">Read</a>
            •
            <a href="https://news.ycombinator.com/item?id={ storyHN.id }" target="_blank">Discuss</a>
            •
            <a href="/" on:click|once|preventDefault={() => saveHNItem(index)}>Save</a>
          </p>
        </div>
      {/each}
      {#if lastFetchedAt !== 0}
        <p class="hn-meta">Last fetched at { new Date(lastFetchedAt).toLocaleTimeString() }.</p>
      {/if}
    </div>
  {/if}
  <p class="hn-meta">Refreshes every { refreshInterval } seconds.</p>
</div>

<style lang="scss">
  .hn-link {
    color: var(--text-normal);
    font-size: var(--font-small);
    text-decoration: none;
  }

  .hn-actions {
    font-size: var(--font-smallest);
    margin: 1.2em 0 0;
    text-align: right;
  }

  .hn-meta {
    color: var(--text-muted);
    font-size: var(--font-smallest);
  }

  .results {
    display: flex;
    flex-direction: column;
  }

  .container {
    background-color: var(--background-primary-alt);
    border-radius: 0.3rem;
    font-size: var(--font-ui-medium);
    margin: 0.5rem auto;
    padding: 0.5rem 1rem;
    width: 100%;
  }
</style>
