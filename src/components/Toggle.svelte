<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function toggleSelected(list) {
    if (!disabled) {
      let newSelected = selected;
      if (!single) {
        if (selected.includes(list)) {
          newSelected.splice(newSelected.indexOf(list), 1);
        } else {
          newSelected.push(list);
        }
      } else {
        newSelected = [list];
      }

      selected = newSelected;

      dispatch("toggle", { selected: single ? list : selected });
    }
  }

  export let lists = [];
  export let selected = [];
  export let single = false;
  export let disabled = false;
  export let edit = false;
  export let name = "";
  export let right = false;

  let tag = "";

  function addTag() {
    let cleanTag = tag.replace(/[^\w|\s]/g, "").trim();
    if (
      tag.search(",") != 0 &&
      cleanTag.length &&
      !lists.map(t => t.toLowerCase()).includes(cleanTag.toLowerCase())
    ) {
      lists = [...lists, cleanTag];
      tag = "";
    }
  }

  function removeTag(tag_index) {
    let new_lists = lists;
    new_lists.splice(tag_index, 1);
    lists = new_lists;
  }
</script>

<style>
  .right {
    justify-content: flex-end;
  }
</style>

{#if edit || (lists && lists.length)}
  <div>
    <strong>{name}</strong>
    <div class="tags wrap" class:right>
      {#each lists
        .filter(x => x)
        .reduce((a, i) => (!a.includes(i) ? [...a, i] : a), []) as list, i}
        <span
          class="tag"
          class:active={!disabled && selected.includes(list)}
          on:click={() => {
            toggleSelected(list);
          }}>
          {list}
        </span>
        {#if edit}
          <span
            class="tag"
            on:click={() => removeTag(i)}
            style="color: red; border-left: none">
            x
          </span>
        {/if}
      {/each}
      {#if edit}
        <span class="tag">
          <input
            type="text"
            placeholder="add tags"
            bind:value={tag}
            on:keyup={ev => {
              if (ev.keyCode == 13 || ev.keyCode == 188) addTag();
            }} />
        </span>
        <span class="tag" on:click={addTag}>+</span>
      {/if}
    </div>
  </div>
{:else}
  <div />
{/if}
