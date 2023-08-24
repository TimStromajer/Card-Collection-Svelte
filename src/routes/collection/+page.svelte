<script>
// @ts-nocheck
  import { onMount } from "svelte";

  import { getUsers, addUser } from "../../database/dbService";

  let newUsername;
  let password
  let allUsernames;

  let errorMessage;

  onMount(() => {
    allUsernames = getUsers();
  })

  async function createUser() {
    let response = await addUser(newUsername)
    console.log(response)
  }
  function passwordChange() {
    if (password.length == 0) {
      errorMessage = ""
    }
    else if (password.length < 5) {
      errorMessage = "Password should be at least 5 characters long."
    }
    else if (!/\d/.test(password)) {
      errorMessage = "Password must contains at least one number."
    }
    else if (!password.includes("coin")) {
      errorMessage = "Password must contain the answer to this riddle: What has a head and a tail but no body?"
    }
    else {
      errorMessage = "Password is OK."
    }
  }
</script>

<h3>Active collections</h3>
<ul>
  <li>
    <a href="/collection/slotim">slotim</a>
  </li>
</ul>

<h3>Create your collection</h3>
<form>
  <input bind:value={newUsername} placeholder="username"/>
  <input type="password" bind:value={password} on:keyup={() => passwordChange()} placeholder="password"/>
  <button on:click={() => createUser()}>Create</button>
  {#if errorMessage}
  <p class="error-msg">
    {errorMessage}
  </p>
  {/if}
</form>

<style>
  .error-msg {
    color: rgb(121, 0, 0);
    font-size: 1.3em;
  }
</style>