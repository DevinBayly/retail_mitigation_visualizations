import TickEle from "./tickEle.svelte"
let Plot = (data,id)=> ({
  //data needs to be a list of objects that work with the rest of the schema
  // id wil be the element on the page that gets our graph when we finish it
  data,
  id,
  makeSpec() {
    this.vlSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      "title":`Keyterm '${this.id}' Plot`,
      "data":{
        "values":this.data
      },
      "width":"container",
      "mark":"point",
      "encoding":{
        "x":{"field":"date","type":"temporal"},
        "y":{"field":"retailer","type":"ordinal"}
      }

    };

    // Embed the visualization in the container with id `vis`
  },
  graph() {
    vegaEmbed(`#${this.id.replace(/ /g,"-")}`, this.vlSpec);
  },
  create() {
    this.div = document.createElement('div')
    this.div.id = this.id.replace(/ /g,"-")
    this.div.style.width = "100%"
    document.querySelector("#charts").append(this.div)
    this.makeSpec()
    this.graph()
  },
})
// create a transform that spreads the data into individual elements
let dataTransformID=(idgroup)=>{
  let verboseData = []
  for (let name in idgroup) {
    for (let datum of idgroup[name].times){
      verboseData.push({retailer:name,date:datum})
    }
  }
  return verboseData
}
export let RunVega = async ()=> {
  let data = await fetch('./grid_data.json').then(res=>res.json())
  console.log(data,'plotting')
  // create all the tick marks
  let plotGenCallback = (term)=> {
    if (data[term] != undefined) {
      console.log("plotting term",term)
    //trying covid first

    let termData = dataTransformID(data[term]) 
    let plt = Plot(termData,term)
    plt.create()
    } else {
      console.log("term not found",term)
    }
  }
  for (let term in data) {
    let TE = new TickEle({
      target:document.querySelector("#tickBoxes"),
      props:{
        term,
        callback:plotGenCallback
      }
    })
  }
  // create a scatter plot for each with the y as the retailers, and the x as the times
}
