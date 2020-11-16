<script>
	export let name;
  let ID = "COVID"
  import {RunVega} from './vga.js'
  RunVega()
</script>

<style>
.holder {
  width:100%;
  display:flex;

}
#tickBoxes {
width:100%;
display:flex;
flex-wrap:wrap;
align-items:center;
}
</style>
<div id="tickBoxes"></div>
<div id="charts" class="holder"></div>
