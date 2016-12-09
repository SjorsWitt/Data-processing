/* Name: Sjors Witteveen
 * Student number: 10808493 */
window.onload = function() {

    var chart = d3.select(".graph"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom,
        g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        timeParse = d3.time.format("%Y%m%d").parse;

        var x = d3.time.scale()
            .rangeRound([0, width]);

        var xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(x);

        var y = d3.scale.linear()
            .rangeRound([height, 0])
            .domain([-5, 20]);

        var yAxis = d3.svg.axis()
                .orient("left")
                .scale(y);

        var line = d3.svg.line()
            .x(function(d) { return x(timeParse(d.Date)); })
            .y(function(d) { return y(d.Average / 10); });

    // Load in JSON data file
    d3.json("data.json", function(data) {
    	data = data.points['380']; // 380 is the city code of Maastricht

        x.domain(d3.extent(data, function(d) { return timeParse(d.Date); }));

        // Create X axis
        g.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Create Y axis
        g.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text("Temperature (\xB0 C)");

        // Create path element (line)
        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // Mouseover listener on line
        var lineElem = chart.select(".line")
            .on("mouseover", handleMouseOver);
    });

    // Handle mouse over line
    function handleMouseOver(d, i) {
        var point = d3.mouse(this); // Get mouse coordinates

        chart.selectAll(".circle").remove();

        // Create pop-up with circle and text displaying data
        chart.append("circle")
            .attr("class", "circle")
            .attr("cx", point[0] + margin.left)
            .attr("cy", point[1] + margin.top)
            .attr("r", "5");

        chart.selectAll(".pop-up").remove();

        chart.append("text")
            .attr("class", "pop-up")
            .attr("x", point[0] + margin.left + 10)
            .attr("y", point[1] + margin.top + 5)
            .text(x.invert(point[0]).getDate() + " Nov");

        chart.append("text")
            .attr("class", "pop-up")
            .attr("x", point[0] + margin.left + 10)
            .attr("y", point[1] + margin.top + 20)
            .text(Math.round(y.invert(point[1])) + "\xB0 C");

    }

}