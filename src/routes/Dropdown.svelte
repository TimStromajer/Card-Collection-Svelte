<script>
// @ts-nocheck

  export let items
  export let dropDownBtnName;
  export let checked = [];
  export let type;

  let dropDowmOpen = false;

  function dropDownClick() {
    dropDowmOpen = !dropDowmOpen
  }
  function rowClick(item, i) {
    checked = item
    dropDownClick()
  }
</script>

{#if type == "checkbox"}
  <div class="dropdown">
    <button on:click="{() => dropDownClick()}" class="dropbtn">{dropDownBtnName}</button>
    {#if dropDowmOpen}
      <div class="dropdown-content">
        {#each items as item, i}
          <div>
            <input type="checkbox" bind:checked={checked[i]}/>
            {item}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

{#if type == "select"}
  <div class="dropdown">
    <button on:click="{() => dropDownClick()}" class="dropbtn">{dropDownBtnName}</button>
    {#if dropDowmOpen}
      <div class="dropdown-content">
        {#each items as item, i}
          <div>
            <button on:click={() => rowClick(item, i)}>{item}</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-content {
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 2;
  }
  .dropbtn {
    background-color: #1d241d;
    color: white;
    padding: 4px;
    border: none;
    cursor: pointer;
    border-radius: 0.2em;
  }
</style>

