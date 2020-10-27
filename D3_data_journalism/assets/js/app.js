var svgWidth = 825;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";  


// function used for updating x-scale var upon click on x axis labels
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on y axis labels
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis]) * 0.6,
      d3.max(Data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height,0]);

  return yLinearScale;

}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var xLabel;
  var yLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "poverty:";
  } else if (chosenXAxis === "age") {
    xLabel = "Age Median:";
  }
  else {
    xLabel = "Household Income (Median)";
  }

  if (chosenYAxis === "healthcare") {
    yLabel = "Lacks Healthcare (%):";
  } else if (chosenYAxis === "obese") {
    yLabel = "Obese (%):";
  }
  else {
    yLabel = "Smokes:";
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr} <br> ${xLabel}  ${d[chosenXAxis]} <br> ${yLabel}  ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(Data) {
  

  // parse data into Int
    Data.forEach(function(data) {
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
  });



  // xLinearScale function above csv import
  var xLinearScale = xScale(Data, chosenXAxis);
  var yLinearScale = yScale(Data, chosenYAxis);
  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

  // Append initial circles
  var circlesGroup = chartGroup.selectAll(".circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 16)
    .attr("class", "circle")
    .attr("fill", "blue")
    .attr("opacity", ".5");


  // Append Text to Circles
  var textGroup = chartGroup.selectAll(".stateText")
    .data(Data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis] * .97))
    .text(d => (d.abbr))
    .attr("class", "stateText");

  // xAxis Labels
  var xLabel = svg.append("g")
    .attr("class", "x aText")
    .style("font-size", "16")
    .attr("transform", `translate(${svgWidth / 2},${height})`);
  xLabel
    .append("text")
    .text("Household Income (Median)")
    .attr("dataValue", "income")
    .attr("class", "inactive")
    .attr("y", height * .17);
  xLabel
    .append("text")
    .text("Age (Median)")
    .attr("dataValue", "age")
    .attr("class", "inactive")
    .attr("y", height * .22);
  xLabel
    .append("text")
    .text("Poverty (%)")
    .attr("dataValue", "poverty")
    .attr("class", "active")
    .attr("y", height * .12);

  // yAxis Labels
  var yLabel = svg.append("g")
    .attr("class", "y aText")
    .style("font-size", "16")
    .attr("transform", `translate(0, ${height / 2}) rotate(-90)`);
  yLabel
    .append("text")
    .text("Obese (%)")
    .attr("dataValue", "obesity")
    .attr("class", "inactive")
    .attr("y", height * .05);
  yLabel
    .append("text")
    .text("Smokes (%)")
    .attr("dataValue", "smokes")
    .attr("class", "inactive")
    .attr("y", height * .10);
  yLabel
    .append("text")
    .text("Lacks Healthcare (%)")
    .attr("dataValue", "healthcare")
    .attr("class", "active")
    .attr("y", height * .15);


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

});

