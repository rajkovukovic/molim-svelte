<script lang="ts">
  import { molim } from './state';
  import { rxify } from './lib/transformers/rxjs';
  import Table from './Table.svelte';

  const productStream = rxify<any[]>(molim.products as any);
  const userStream = rxify<any[]>(molim.users as any);
  const todoStream = rxify<any[]>(molim.todos as any);
</script>

<main>
  <Table data={$productStream} title="Products" />
  <Table data={$userStream} title="Users" />
  <Table data={$todoStream} title="Todos" />
</main>

<style>
  main {
    padding: 1em;
    margin: 0 auto;
  }
</style>
