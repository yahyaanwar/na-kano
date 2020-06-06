<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire/src";
  import Toggle from "./Toggle.svelte";
  import CreateTodo from "./CreateTodo.svelte";
  import ViewTodo from "./ViewTodo.svelte";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";

  let firebaseConfig = {
    apiKey: "AIzaSyB_DBf1HA71YB1ZGI4CLEsUSzPnK0B1Zls",
    authDomain: "na-kano.firebaseapp.com",
    databaseURL: "https://na-kano.firebaseio.com",
    projectId: "na-kano",
    storageBucket: "na-kano.appspot.com",
    messagingSenderId: "762866961019",
    appId: "1:762866961019:web:9a818f2b316be48ddcb0de",
    measurementId: "G-ELQ4SFKJW6",
    clientId:
      "921600335197-a8r08lqemg774tlsa6v758c73bjsar5k.apps.googleusercontent.com",
    scopes: ["email", "profile"]
  };

  let provider = new firebase.auth.GoogleAuthProvider();

  let signInWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        window.alert(errorCode, errorMessage);
      });
  };

  firebase.initializeApp(firebaseConfig);

  let hide = false;

  let user = sessionStorage.sveltefire_user;
  let stateRef = null;
  let activeView = "Simple";
  let activeStatus = "All";
  let activeWorkspace = "All";
  let activeTags = [];
  let isFilterHidden = false;
  let filteredTodos = [];
  let createHide = true;

  function toggleWorkspace(event) {
    activeWorkspace = event.detail.selected;
    activeTags = [];
    saveFilterState();
  }

  function toggleStatus(event) {
    activeStatus = event.detail.selected;
    saveFilterState();
  }

  function toggleTags(event) {
    activeTags = event.detail.selected;
    saveFilterState();
  }

  function toggleView(event) {
    activeView = event.detail.selected;
    saveFilterState();
  }

  function currentUserChange(event) {
    user = event.detail.user;
  }

  function stateData(event) {
    const data = event.detail.data;
    if (data === null) {
      stateRef.set({
        activeWorkspace,
        activeStatus,
        activeTags,
        activeView,
        isFilterHidden
      });
    } else if (data) {
      activeStatus = data.activeStatus || activeStatus;
      activeWorkspace = data.activeWorkspace || activeWorkspace;
      activeTags = data.activeTags || activeTags;
      activeView = data.activeView || activeView;
      isFilterHidden = data.isFilterHidden || isFilterHidden;
    }
  }

  function saveFilterState() {
    if (stateRef && filteredTodos.length > 0) {
      stateRef.set({
        activeWorkspace,
        activeStatus,
        activeTags,
        activeView,
        isFilterHidden
      });
    }
  }

  function getList(data, name) {
    return data
      .flatMap(x => x[name])
      .reduce((a, i) => (a.includes && !a.includes(i) ? [a, i] : []));
  }

  export let name;
</script>

<style>
  #add-task-input {
    width: 100%;
    padding: 8px;
  }

  .header {
    background: #333;
    color: white;
    display: flex;
    justify-content: space-between;
  }

  .title {
    border: 1px solid white;
    padding: 3px;
    padding-left: 10px;
  }

  section.todo {
    margin-bottom: 240px;
  }

  section.todo.createHide {
    margin-bottom: 50px;
  }

  .add-task {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }

  .add-task .box {
    border: 1px solid #ddd;
    display: inline-block;
    padding: 8px;
  }

  @media only screen and (max-width: 450px) {
    .title {
      display: none;
    }
    .header {
      text-align: center;
    }
    .account {
      width: 100%;
    }
  }

  @media only screen and (max-width: 600px) {
    .filter,
    .todo,
    .add_todo {
      padding: 8px;
    }
  }
</style>

<FirebaseApp {firebase}>
  <section class="header">
    <div class="title">{name}</div>
    <div class="account">
      <User
        let:user
        let:auth
        persist={sessionStorage}
        on:user={currentUserChange}>
        <div class="text-center">
          Howdy 😀!
          <em>{user.displayName || 'User'}</em>
          <button on:click={() => auth.signOut()}>Sign Out</button>
        </div>

        <div class="text-center" slot="signed-out">
          <button on:click={() => auth.signInAnonymously()}>
            Sign In Anonymously
          </button>
          <button on:click={signInWithGoogle}>Sign In With Google</button>
        </div>
      </User>
    </div>
  </section>
  {#if user}
    <Doc
      path={`todos/${user.uid}`}
      let:data={currentState}
      let:ref={stateRef}
      on:data={stateData}
      on:ref={ev => (stateRef = ev.detail.ref)}
      log>
      <Collection
        path={stateRef.collection('todo')}
        query={ref => ref.orderBy('created_on')}
        let:data={todosData}
        let:ref={todosRef}
        log>
        <section class="filter">
          <div
            style="color: #931550; text-align: center"
            on:click={() => {
              isFilterHidden = !isFilterHidden;
              saveFilterState();
            }}>
            {#if isFilterHidden}
              <strong class="capitalize">{activeView}</strong>
              view of
              <strong class="capitalize">{activeStatus}</strong>
              todo at
              <strong class="capitalize">{activeWorkspace}</strong>
              workspace
              {#if activeTags.length}
                with tag{(activeTags.length > 1 && 's') || ''}:
                {#each activeTags as tag, i}
                  {(i != 0 && i == activeTags.length - 1 && ' and') || (i && ',') || ''}
                  <strong class="capitalize">{tag}</strong>
                {/each}
              {/if}
            {:else}
              <div style="border: 1px solid #931550">Hide Filter</div>
            {/if}
          </div>
          {#if !isFilterHidden}
            <div class="flex">
              <Toggle
                name="Workspaces"
                lists={todosData.flatMap(todo => todo.workspace)}
                bind:selected={activeWorkspace}
                on:toggle={toggleWorkspace}
                single />
              <Toggle
                name="Status"
                lists={['All', 'Active', 'Completed']}
                bind:selected={activeStatus}
                on:toggle={toggleStatus}
                single
                right />
            </div>
            <div class="flex">
              <Toggle
                name="Tags"
                bind:selected={activeTags}
                lists={todosData
                  .filter(todo => todo.workspace == activeWorkspace && activeTags.reduce((all, tags) => all && todo.tags.includes(tags), true))
                  .flatMap(todo => todo.tags)}
                on:toggle={toggleTags} />
              <Toggle
                name="View"
                lists={['Simple', 'Detail']}
                bind:selected={activeView}
                on:toggle={toggleView}
                single
                right />
            </div>
          {/if}
        </section>
        <section class="todo" class:createHide>
          <ViewTodo
            todos={todosData}
            bind:activeView
            bind:activeStatus
            bind:activeWorkspace
            bind:activeTags
            bind:filteredTodos />
        </section>
        <section
          class="add_todo"
          style="position: fixed; bottom: 0; width: 100%; background: white;
          box-shadow: 0 0 2px black;">
          <CreateTodo
            bind:workspace={activeWorkspace}
            bind:tags={activeTags}
            bind:hide={createHide}
            todoRef={todosRef} />
        </section>
      </Collection>
    </Doc>
  {:else}
    <div style="text-align: center; margin-top: calc(50vh - 43px)">
      <h1>Hello, i'm Nakano!</h1>
      <p>Todo app that will make your day organized</p>
    </div>
  {/if}
</FirebaseApp>
