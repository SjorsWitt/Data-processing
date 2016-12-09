/* Name: Sjors Witteveen
 * Student number: 10808493 */
window.onload = function() {

    var chart = d3.select(".graph"),
        margin = {top: 20, right: 60, bottom: 30, left: 50},
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom,
        g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        dropDown = d3.select("#drop-down");

    timeParse = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .rangeRound([0, width]);

    var xAxis = d3.svg.axis()
            .orient("bottom")
            .scale(x);

    var y = d3.scale.linear()
        .rangeRound([height, 0])
        .domain([-10, 30]);

    var yAxis = d3.svg.axis()
            .orient("left")
            .scale(y);

    // initialize svg line with x values only
    var line = d3.svg.line()
        .x(function(d) { return x(timeParse(d.Date)); })

    // Load in JSON data file
    d3.json("data.json", function(data) {

        dropDown.on("change", function() {
            var cityData = data.points[dropDown.node().value]; // Update cityData to selected city
            updateLines(cityData); // Update lines with selected city data
        });

        var cityData = data.points[dropDown.node().value]; // Initialize cityData with first selected city

        x.domain(d3.extent(cityData, function(d) { return timeParse(d.Date); }));

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

        updateLines(cityData);
    });

    // Updates lines according to data
    function updateLines(cityData) {
        chart.selectAll(".line").remove();

        // Create 3 lines: minimum, average and maximum temperature
        var list = ["Minimum", "Average", "Maximum"];
        list.forEach(function(entry) {
            line.y(function(d) { return y(d[entry] / 10); }); // Adjust y values of line

            g.append("path")
                .datum(cityData)
                .attr("class", "line " + entry)
                .attr("d", line);
        });

        chart.selectAll(".pop-up").remove();

        // Mouseover listener on all elements of class line
        var lineElem = chart.selectAll(".line")
            .on("mouseover", handleMouseOver);


    }

    // Handle mouse over line
    function handleMouseOver(d, i) {
        var point = d3.mouse(this); // Get mouse coordinates

        chart.selectAll(".pop-up").remove();

        // Create pop-up with circle and text displaying data
        chart.append("circle")
            .attr("class", "pop-up circle")
            .attr("cx", point[0] + margin.left)
            .attr("cy", point[1] + margin.top)
            .attr("r", "5");

        chart.append("text")
            .attr("class", "pop-up text")
            .attr("x", point[0] + margin.left + 10)
            .attr("y", point[1] + margin.top + 5)
            .text(x.invert(point[0]).getDate() + " Nov");

        chart.append("text")
            .attr("class", "pop-up text")
            .attr("x", point[0] + margin.left + 10)
            .attr("y", point[1] + margin.top + 20)
            .text(Math.round(y.invert(point[1])) + "\xB0 C");
    }

}