import * as d3 from "d3"
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
      "transform":[
        {"filter":"datum.time > datetime('2020')"}
      ],
      "width":"container",
      "mark":"point",
      "encoding":{
        "x":{"field":"time","type":"temporal","title":"Date"},
        "y":{"field":"name","type":"ordinal","title":"Retailers"},
        "color":{"field":"term","type":"nominal"}
      }

    };

    // Embed the visualization in the container with id `vis`
  },
  graph() {
    vegaEmbed(`#-${this.id.replace(/[\s\d]/g,"-")}`, this.vlSpec);
  },
  create() {
    console.log("data" , data)
    this.div = document.createElement('div')
    this.div.id = "-"+this.id.replace(/[\s\d]/g,"-")
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
  let data = await fetch('./complete_data.csv').then(res=>res.text())
  data = d3.csvParse(data)
  // 
  // this tells us what dates approximately we actually hit, when no term and no count were collected in the original process
  let justScrapeDates = data.filter(e=> e.term == "" && e.count == "")
  //// create all the tick marks
  let plotGenCallback = (term)=> {
    let termData = data.filter(e=> e.term == term || e.term== "").map(e=> {
    if (e.term== "") {
      e.name = e.name + "_scrapes"
    } else {
      e.name = e.name + "_term_hits"
    }
      return e
  }
  )
    if (termData.length != 0) {
      let plt = Plot(termData,term)
      plt.create()
    }
  }
  // all terms
  let sortedKeys =data.reduce((acc,cur)=> {
    if (cur.term == "") {
      return acc
    }
    if (acc.indexOf(cur.term) == -1) {
      acc.push(cur.term)
    }
    return acc
  },[]).sort()
  for (let term of sortedKeys) {
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
