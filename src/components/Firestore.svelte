<script>
  import { FirebaseApp, User } from "sveltefire/src";

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
</script>

<style>
  .text-center {
    text-align: center;
  }
</style>

<FirebaseApp {firebase}>
  <User let:user let:auth>
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
</FirebaseApp>
