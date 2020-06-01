<!-- <div class="box task-card">
  <div class="flex">
    <div>
      <small class="on-detail on-edit">Created: {todo.created_on}</small>
      <small class="on-detail" style="padding-left: 20px">
        Completed: {todo.completed_on}
      </small>
      <input
        style="padding-left: 20px"
        class="on-edit"
        type="datetime-local"
        placeholder="completed date" />
    </div>
    <div>
      <button class="link on-detail">Bump</button>
      <button class="link on-detail">Edit</button>
      <button class="link on-detail on-edit">Delete</button>
    </div>
  </div>
  <div class="flex" style="padding: 8px 0">
    <label>
      <input
        type="checkbox"
        value="Cookies and cream"
        checked={getStatus(todo.completed_on, todo.reset)} />
      <strong class="label on-view" style="font-size: 1rem">
        {todo.title}
      </strong>
      <input class="on-create on-edit" type="text" placeholder="add task" />
    </label>
    <Toggle
      selected={[]}
      lists={todo.tags}
      classList="on-view on-create on-edit"
      disabled />
  </div>
  <div>
    <span class="description on-detail" style="margin-left: 24px;">
      {todo.description}
    </span>
    <textarea
      class="description on-create on-edit"
      name="description"
      rows="3"
      style="width: calc(100% - 24px); margin-left: 24px;"
      placeholder="add description" />
  </div>
  <div class="on-create on-edit" style="text-align: right">
    <button>Save</button>
  </div>
</div> -->
