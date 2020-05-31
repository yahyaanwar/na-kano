<script>
  import Firestore from "./Firestore.svelte";
  export let name;
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<h1>Hello, i'm {name}!</h1>
<Firestore />
