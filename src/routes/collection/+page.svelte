<script>
// @ts-nocheck
  import { onMount } from "svelte";

  import { getUsers, addUser } from "../../database/dbService";

  let newUsername;
  let password
  let allUsernames;

  let errorMessage;

  onMount(() => {
    refreshUsers()
  })

  function refreshUsers() {
    getUsers().then(users => allUsernames = users);
  }

  async function createUser() {
    let response = await addUser(newUsername)
    refreshUsers()
  }
  function passwordChange() {
    let numbers = extractIntegersFromString(password)
    let numbersSum = 0
    numbers.forEach(n => {
      numbersSum += n
    });
    let firstHalf = password.substring(0, password.length/2)
    let secondHalf = password.split("").reverse().join("").substring(0, password.length/2)
    if (password.length == 0) {
      errorMessage = ""
    }
    else if (password.length < 5) {
      errorMessage = "Password must be at least 5 characters long."
    }
    else if (!/\d/.test(password)) {
      errorMessage = "Password must contains at least one number."
    }
    else if (!password.includes("coin")) {
      errorMessage = "Password must contain the answer to this riddle: What has a head and a tail but no body?"
    }
    else if (numbersSum != 33) {
      errorMessage = "Digits in your password must add up to 33"
    }
    else if (!password.startsWith("|") || !password.endsWith("|")) {
      errorMessage = "Your password must be enclosed with a wall."
    }
    else if (firstHalf != secondHalf) {
      errorMessage = "Your password must be balanced."
    }
    else {
      errorMessage = "Password is OK."
    }
  }
  function extractIntegersFromString(inputString) {
    const regex = /\d/g; // Regular expression to match integers
    const matches = inputString.match(regex);
    
    if (matches) {
      return matches.map(match => parseInt(match));
    } else {
      return [];
    }
  }
</script>

<h3>Active collections</h3>
{#if allUsernames}
  <ul>
    {#each allUsernames as user}
    <li>
      <a href="/collection/{user.username}">{user.username}</a>
    </li>
    {/each}
  </ul>
{:else}
  <div>Loading...</div>
{/if}


<h3>Create your collection</h3>
<form>
  <input bind:value={newUsername} placeholder="username"/>
  <input type="text" bind:value={password} on:keyup={() => passwordChange()} placeholder="password"/>
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