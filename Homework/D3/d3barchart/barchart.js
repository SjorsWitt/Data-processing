/* Name: Sjors Witteveen
 * Student number: 10808493 */

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		rainfallsum = (Number(d.RAINFALLSUM) * 0.1).toPrecision(d.RAINFALLSUM.length)
		return "<strong>Neerslag:</strong> <span style='color:dodgerblue'>" + rainfallsum + "mm" + "</span>";
	});

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

d3.json("data.json", function(data) {
	data = data.points

  x.domain(data.map(function(d) { return d.MONTH; }));
  y.domain([0, d3.max(data, function(d) { return Number(d.RAINFALLSUM); })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.MONTH); })
      .attr("y", function(d) { return y(d.RAINFALLSUM); })
      .attr("height", function(d) { return height - y(d.RAINFALLSUM); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

});