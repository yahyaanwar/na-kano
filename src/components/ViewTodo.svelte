<script>
  import Toggle from "./Toggle.svelte";

  function getStatus(completed_on, reset) {
    if (!reset || reset == "once") {
      return Date.parse(completed_on) < Date.now();
    }

    if (reset.includes("day")) {
      return (
        Date.parse(completed_on) + 1000 * 60 * 60 * 24 * parseInt(reset) >
        Date.now()
      );
    }

    const completed_date = new Date(completed_on);
    completed_date.setMonth(completed_date.getMonth() + 1);

    const resetTime = {
      daily: Date.parse(completed_on) + 1000 * 60 * 60 * 24 > Date.now(),
      weekly: Date.parse(completed_on) + 1000 * 60 * 60 * 24 * 7 > Date.now(),
      monthly: completed_date.getTime() > Date.now()
    };

    return resetTime[reset];
  }

  export let todos = [];
  export let activeStatus = "All";
  export let activeWorkspace = "All";
  export let activeTags = ["All"];
  export let viewType = "Simple";
  let filteredTodos = todos;

  $: {
    filteredTodos = todos.filter(todo => {
      let result =
        activeWorkspace == "All" || activeWorkspace == todo.workspace;
      result &= activeTags.reduce((a, i) => todo.tags.includes(i) || a, false);
      result &=
        (result && activeStatus == "All") ||
        (activeStatus == "Completed") ==
          getStatus(todo.completed_on, todo.reset);
      result |= activeWorkspace == todo.workspace && todo.tags.length == 0;
      return result;
    });
  }

  function checkboxChange(ref, state, created_on) {
    ref.update({
      completed_on: state ? new Date().toString() : false
    });
  }
</script>

<div class="flex">
  <span>
    Showing
    <strong>{filteredTodos.length}</strong>
    of
    <strong>{todos.length}</strong>
    items
  </span>
</div>
{#if filteredTodos.length == 0}
  <div class="box task-card">
    <h1 style="text-align: center">Todo Not Found</h1>
  </div>
{/if}
{#each filteredTodos as todo}
  <div class="box task-card">
    <div class="flex">
      {#if viewType == 'Detail'}
        <div class="on-detail">
          {#if todo.edited_on && todo.edited_on != todo.created_on}
            <small>Edited: {todo.edited_on.replace(/:\d{2} .*/, '')}</small>
          {:else}
            <small>Created: {todo.created_on.replace(/:\d{2} .*/, '')}</small>
          {/if}
          {#if todo.completed_on}
            <small style="padding-left: 20px">
              Last Completed: {todo.completed_on.replace(/:\d{2} .*/, '')}
            </small>
          {/if}
        </div>
        <div>
          <!-- <button class="link on-detail">Edit</button> -->
          <button class="link on-detail" on:click={() => todo.ref.delete()}>
            Delete
          </button>
        </div>
      {/if}
    </div>
    <div class="flex" style="padding: 8px 0">
      <label>
        <input
          type="checkbox"
          checked={getStatus(todo.completed_on, todo.reset)}
          on:click={ev => checkboxChange(todo.ref, ev.target.checked, todo.created_on)} />
        <strong class="label on-view" style="font-size: 1.8rem">
          {todo.title}
        </strong>
      </label>
      <Toggle selected={[]} lists={todo.tags} classList="on-view" disabled />
    </div>
    <div class="flex">
      <p class="description on-detail" style="margin-left: 24px;">
        {todo.description}
      </p>
      {#if viewType == 'Simple'}
        <div>
          <!-- <button class="link on-detail">Edit</button> -->
          <button class="link on-detail" on:click={() => todo.ref.delete()}>
            Delete
          </button>
        </div>
      {/if}
    </div>
    {#if viewType == 'Detail'}
      <div>
        <small>{todo.workspace && 'On ' + todo.workspace}</small>
        <small style="padding-left: 20px">{todo.reset && 'Reset ' + todo.reset}</small>
      </div>
    {/if}
  </div>
{/each}
