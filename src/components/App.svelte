<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire/src";
  import Toggle from "./Toggle.svelte";
  // import Todos from "./Todos.svelte";
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
  let viewType = "Simple";
  let activeStatus = "All";
  let activeWorkspace = "All";
  let activeTags = ["All"];
  let hideCreate = true;

  function toggleWorkspace(event) {
    activeWorkspace = event.detail.selected;
  }

  function toggleStatus(event) {
    activeStatus = event.detail.selected;
  }

  function toggleTags(event) {
    activeTags = event.detail.selected;
  }

  function currentUserChange(event) {
    user = event.detail.user;
  }

  function stateData(event) {
    if (event.detail.data === null) {
      stateRef.set({
        activeWorkspace: "All",
        activeStatus: "All",
        activeTags: []
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

  @media only screen and (max-width: 600px) {
    .filter,
    .todo {
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
        query={ref => ref.orderBy('order')}
        let:data={todosData}
        let:ref={todosRef}
        log>
        <section
          class="filter can-hide"
          class:hide={hide === 'filters'}
          style="--title: 'filters'">
          <span
            class="hide-btn"
            on:click={() => (hide = hide ? false : 'filters')} />
          <div class="flex">
            <Toggle
              name="Workspaces"
              lists={todosData.flatMap(todo => todo.workspace)}
              on:toggle={toggleWorkspace}
              single />
            <Toggle
              name="Status"
              lists={['All', 'Active', 'Completed']}
              on:toggle={toggleStatus}
              single />
          </div>
          <div class="flex">
            <Toggle
              name="Tags"
              lists={todosData.flatMap(todo => todo.tags)}
              on:toggle={toggleTags} />
            <Toggle
              name="View"
              selected={['Simple']}
              lists={['Simple', 'Detail']}
              on:toggle={ev => (viewType = ev.detail.selected)}
              single />
          </div>
        </section>
        <section class="todo">
          <ViewTodo
            todos={todosData}
            bind:viewType
            bind:activeStatus
            bind:activeWorkspace
            bind:activeTags />
          <CreateTodo
            bind:workspace={activeWorkspace}
            bind:tags={activeTags}
            bind:hide={hideCreate}
            todoRef={todosRef} />
          <button
            class="box"
            style="width: 100%; margin: 0"
            on:click={() => (hideCreate = !hideCreate)}>
            +
          </button>
        </section>
      </Collection>
    </Doc>
  {:else}
    <div
      style="text-align: center; margin-top: calc(50vh - 43px)">
      <h1>Hello, i'm Nakano!</h1>
      <p>Todo app that will make your day organized</p>
    </div>
  {/if}
</FirebaseApp>
