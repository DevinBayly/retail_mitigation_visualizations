<script>
export let RunVega = async ()=> {
  let data = await fetch('./grid_data.json').then(res=>res.json())
  console.log(data)
}
</script>
