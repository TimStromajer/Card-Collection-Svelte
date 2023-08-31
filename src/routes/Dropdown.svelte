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
  function focusOut() {
    dropDowmOpen = false;
  }
</script>

{#if type == "checkbox"}
  <div class="dropdown" on:focusout={() => focusOut()}>
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
  <div class="dropdown" on:focusout={() => focusOut()}>
    <button on:click="{() => dropDownClick()}" class="dropbtn">{dropDownBtnName}</button>
    {#if dropDowmOpen}
      <div class="dropdown-content">
        {#each items as item, i}
          <div>
            <button class="select-btn" on:click={() => rowClick(item, i)}>{item}</button>
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
    min-width: 100px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    padding: 0;
  }
  .dropbtn {
    background-color: #1d241d;
    color: white;
    padding: 4px;
    border: none;
    cursor: pointer;
    border-radius: 0.2em;
    min-width: 5em;
  }
  .select-btn {
    width: 100%;
    height: 100%;
    text-align: start;
    border-radius: 0;
    border-width: 0;
    padding-bottom: 0.2em;
    padding-top: 0.2em;
  }
  .select-btn:hover {background-color: #a5a5a5}
</style>

