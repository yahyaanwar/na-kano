<script>
  import Toggle from "./Toggle.svelte";

  export let todoRef = false;
  export let workspace = "";
  export let tags = [];

  let title = "";
  let description = "";
  let reset = "";
  let hide = true;

  function addTodo() {
    todoRef.add({
      order: 1,
      title,
      description,
      workspace: workspace.toLocaleLowerCase(),
      created_on: new Date().toString(),
      edited_on: new Date().toString(),
      completed_on: false,
      reset: reset.toLowerCase(),
      tags
    });
    hide = true;
  }
</script>

{#if todoRef && !hide}
  <div class="flex">
    <div />
    <Toggle selected={[]} let:lists={tags} bind:lists={tags} edit disabled />
  </div>
  <div class="flex" style="padding: 8px 0">
    <label style="width: 100%">
      <input
        bind:value={title}
        type="text"
        placeholder="add task"
        style="font-size: 1.5rem; font-weight: bold; width: 100%" />
    </label>
  </div>
  <div>
    <textarea
      bind:value={description}
      name="description"
      rows="3"
      style="width: 100%;"
      placeholder="add description" />
  </div>
  <div class="flex" style="flex-flow: wrap;">
    <label>
      Workspace
      <br>
      <input
        bind:value={workspace}
        type="text"
        placeholder="office, home, campus, ..." />
    </label>
    <label>
      Reset
      <br>
      <input
        bind:value={reset}
        type="text"
        placeholder="daily, sunday, monday, ..." />
    </label>
  </div>
<br>
{/if}
<div class="flex">
  <button
    class="box"
    style="width: 100%; margin: 0"
    on:click={() => (hide = !hide)}>
    {hide ? 'New Todo' : 'Cancel'}
  </button>
  {#if !hide}
    <button
      class="box"
      style="width: 100%; margin: 0"
      on:click={addTodo}>
      Save
    </button>
  {/if}
</div>
