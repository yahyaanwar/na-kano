<script>
  function getStatus(completed_on, reset) {
    const completed_date = new Date(completed_on);
    completed_date.setMonth(completed_date.getMonth() + 1);
    const midNight = new Date().setHours(24, 0, 0, 0);
    const dayOfWeek = new Date().getDay();

    const resetTime = {
      daily: Date.parse(completed_on) + 86400000 > midNight,
      sunday: dayOfWeek !== 0,
      monday: dayOfWeek !== 1,
      tuesday: dayOfWeek !== 2,
      wednesday: dayOfWeek !== 3,
      thursday: dayOfWeek !== 4,
      friday: dayOfWeek !== 5,
      saturday: dayOfWeek !== 6
    };

    if (reset.includes("day")) {
      return Date.parse(completed_on) + 86400000 * parseInt(reset) > midNight;
    }

    if (!reset || !Object.keys(resetTime).includes(reset)) {
      return Date.parse(completed_on) < Date.now();
    }

    return resetTime[reset];
  }

  export let todos = [];
  export let activeStatus = false;
  export let activeWorkspace = false;
  export let activeTags = [];
  export let activeView = "Simple";
  export let filteredTodos = todos;

  $: {
    filteredTodos = todos.filter(todo => {
      let result =
        activeStatus == "All" ||
        (activeStatus == "Completed") ==
          getStatus(todo.completed_on, todo.reset);
      result &= activeWorkspace == todo.workspace;
      result &= activeTags.reduce((a, i) => todo.tags.includes(i) && a, true);
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
    Found
    <strong>{filteredTodos.length}</strong>
    from
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
    {#if activeView == 'Detail'}
      <div class="flex">
        <small>
          {(todo.workspace && 'On ' + todo.workspace + ' workspace') || ''}
        </small>
        <small style="padding-left: 20px">
          {todo.reset && 'Reset ' + todo.reset}
        </small>
        <small>
          {#if todo.tags.length}
            With tag{(todo.tags.length > 1 && 's') || ''}:
            {#each todo.tags as tag, i}
              {(i != 0 && i == todo.tags.length - 1 && ' and') || (i && ',') || ''}
              <strong class="capitalize">{tag}</strong>
            {/each}
          {/if}
        </small>
      </div>
    {/if}
    <div class="flex" style="padding: 8px 0">
      <label>
        <input
          type="checkbox"
          checked={getStatus(todo.completed_on, todo.reset)}
          on:click={ev => checkboxChange(todo.ref, ev.target.checked, todo.created_on)} />
        <strong class="label on-view" style="font-size: 1.5rem">
          {todo.title}
        </strong>
      </label>
      {#if activeView == 'Simple'}
        <small>{todo.tags.join(', ')}</small>
      {/if}
    </div>
    <div class="flex" style="align-items: flex-end">
      {#if todo.description}
        <p
          class="description on-detail"
          style="margin-left: 24px; white-space: pre-line;">
          {todo.description}
        </p>
      {:else}
        <span />
      {/if}
      {#if activeView == 'Simple'}
        <div>
          <!-- <button class="link on-detail">Edit</button> -->
          <button class="link on-detail" on:click={() => todo.ref.delete()}>
            Delete
          </button>
        </div>
      {/if}
    </div>
    {#if activeView == 'Detail'}
      <div class="flex" style="align-items: flex-end">
        <small class="flex" style="width: auto">
          {#if todo.edited_on && todo.edited_on != todo.created_on}
            <div>
              Edited:
              <br />
              {todo.edited_on.replace(/:\d{2} .*/, '')}
            </div>
          {:else}
            <div>
              Created:
              <br />
              {todo.created_on.replace(/:\d{2} .*/, '')}
            </div>
          {/if}
          {#if todo.completed_on}
            <div style="padding-left: 20px">
              Last Completed:
              <br />
              {todo.completed_on.replace(/:\d{2} .*/, '')}
            </div>
          {/if}
        </small>
        <div>
          <!-- <button class="link on-detail">Edit</button> -->
          <button class="link on-detail" on:click={() => todo.ref.delete()}>
            Delete
          </button>
        </div>
      </div>
    {/if}
  </div>
{/each}
