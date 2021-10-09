
//variable to store data later
var cData;

const margin = ({top: 20, right: 20, bottom: 40, left: 50});
const width = 650 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
var svg = d3.selectAll(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        

var ordScale = d3.scaleBand()
    .rangeRound([0,width])
    .paddingInner(0.1)

var yScale = d3.scaleLinear()
    .range([height,0])
        
const xAxis = d3.axisBottom()
    .scale(ordScale);
            
const yAxis = d3.axisLeft()
    .scale(yScale);
            
var xAxisDisplay = svg.append("g")
    .attr('class', 'axis x-axis')
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

var yAxisDisplay = svg.append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis);
    
var yLabel = svg.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'grey');
            
// passed in to update the chart        
let type = d3.select('#group-by').node().value
let sort_direction = 1; 

var key = function(d) {
    return d.company;
};

//function to update the chart
function update(data, type){
    data = data.sort((a,b)=>(a[type] -b[type]) *sort_direction )
    ordScale.domain(data.map(d=>key(d)));
    yScale.domain([0, d3.max(data,d=>d[type])]);

    var bars = svg.selectAll('rect')
        .data(data, key);

    bars.enter()
        .append('rect')
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('x', d=>ordScale(key(d)))
        .attr('y', d=>yScale(d[type]))
        .attr('width', d=> ordScale.bandwidth())
        .attr('height', d=>(height-yScale(d[type])))
        .attr('fill','purple');
    bars.exit()
        .transition()
        .duration(100)
        .remove();

    svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    svg.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
            
    yLabel.text(type.toUpperCase());
}


d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    cData = data;
    update(data,type); 
});

//Change the order for how the data is sorted            
d3.select('#sort')
    .on('click', (event,d)=>{
        sort_direction = -1 * sort_direction  
        update(cData, type) 
    })
//When the group by is changed
d3.select('#group-by')
    .on('change', (event,d)=>{
        type = event.target.value;
        update(cData, type);
    })
        
  