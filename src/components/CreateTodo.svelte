<script>
  import Toggle from "./Toggle.svelte";

  export let todoRef = false;
  export let hide = false;
  export let workspace = "";
  export let tags = [];

  let title = "";
  let description = "";
  let reset = "";
  let is_completed = false;

  function addTodo() {
    todoRef.add({
      order: 1,
      title,
      description,
      workspace: workspace.toLocaleLowerCase(),
      created_on: new Date().toString(),
      edited_on: new Date().toString(),
      completed_on: is_completed && new Date().toString(),
      reset: reset.toLowerCase(),
      tags
    });
    hide = true;
  }
</script>

{#if todoRef && !hide}
  <div class="box task-card">
    <div class="flex">
      <div />
      <Toggle selected={[]} let:lists={tags} bind:lists={tags} edit disabled />
    </div>
    <div class="flex" style="padding: 8px 0">
      <label style="width: 100%">
        <input type="checkbox" bind:value={is_completed} />
        <input
          bind:value={title}
          type="text"
          placeholder="add task"
          style="font-size: 1rem; font-weight: bold; width: calc(100% - 23px)" />
      </label>
    </div>
    <div>
      <textarea
        bind:value={description}
        name="description"
        rows="3"
        style="width: calc(100% - 24px); margin-left: 24px;"
        placeholder="add description" />
    </div>
    <div class="flex">
      <label>
        Workspace
        <input
          bind:value={workspace}
          type="text"
          placeholder="Office, Home, Campus, ..." />
      </label>
      <label>
        Reset
        <input
          bind:value={reset}
          type="text"
          placeholder="Daily, Weekly, 3 Days," />
      </label>
      <button on:click={addTodo}>Save</button>
    </div>
  </div>
{/if}
