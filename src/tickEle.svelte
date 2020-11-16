<script>
export let term
export let callback
</script>

<style>
.holder {
margin :2px;
border-radius:10px;
background:#80808057;
padding:2px;
display:flex;
align-items:center;
}
input {
margin:revert;
}
</style>

<div class="holder">
  <div>
  <label>{term}</label>
  </div>
  <div>
<input type="checkbox" on:change={()=> {callback(term)}}>
</div>
</div>
