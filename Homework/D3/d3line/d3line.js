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

    d3.json("data.json", function(data) {
    	data = data.points['380']; // 380 is the city code of Maastricht

        x.domain(d3.extent(data, function(d) { return timeParse(d.Date); }));

        g.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        g.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        var lineElem = chart.select(".line")
            .on("mouseover", handleMouseOver);
    });

    function handleMouseOver(d, i) {
        var point = d3.mouse(this);

        chart.selectAll(".circle").remove();

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