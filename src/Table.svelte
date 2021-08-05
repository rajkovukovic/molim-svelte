<script lang="ts">
  export let title: string;
  export let data: Record<string, any>[];
  export let uniqueFieldName: string = 'id';

  $: fields = data?.length > 0 ? Array.from(Object.keys(data[0])) : ['loading'];
</script>

{#if title}
  <h2>{title}</h2>
{/if}

<table>
  <thead>
    <tr>
      {#each fields as field (field)}
        <th>
          {field}
        </th>
      {/each}
    </tr>
  </thead>

  <tbody>
    {#if data}
      {#each data as user (user[uniqueFieldName])}
        <tr>
          {#each fields as field (field)}
            <td>
              {user[field]}
            </td>
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<style>
  thead {
    background-color: #ccc;
  }

  tbody > tr {
    background-color: #ddd;
  }

  tbody > tr:nth-child(2n) {
    background-color: #eee;
  }
</style>
