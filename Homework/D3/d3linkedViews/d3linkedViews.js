/* Name: Sjors Witteveen
 * Student number: 10808493 */

window.onload = function() {

    var id = null, // Code of selected country
        category = "Age", // Selected category of data
        dataset = {};

    var pieChart_width = 280,
        pieChart_height = 280,
        radius = Math.min(pieChart_width, pieChart_height) / 2 - 10;

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(4);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 30)
        .innerRadius(radius - 30);

    var pie = d3.layout.pie()
        .padAngle(0.04)
        .sort(null);

    var dropDown = d3.select("#drop-down")
            .on("change", function() {
                category = dropDown.node().value; // Update data category
                d3.selectAll("#subtitle").text("Click any country to view the " + dropDown.node().value.toLowerCase() + " distribution."); // Change subtitle
                createPieChart(); // Update pie chart
            });


    d3.json("data.json", function(rawdata) {

        // Adapt rawdata to fit datamap expectation
        rawdata.points.forEach(function(item){

            var population = item.Population;

            // Set the right fillKey according to population 
            var key = "UNKNOWN";
            if (population <= 5000000) {
                key = "< 5m";
            } else if (5000000 <= population && population < 10000000) {
                key = "5m - 10m";
            } else if (10000000 <= population && population < 25000000) {
                key = "10m - 25m";
            } else if (25000000 <= population && population < 50000000) {
                key = "25m - 50m";
            } else if (50000000 <= population && population < 75000000) {
                key = "50m - 75m";
            } else if (75000000 <= population && population < 100000000) {
                key = "75m - 100m";
            } else if (100000000 <= population && population < 200000000) {
                key = "100m - 200m";
            } else if (200000000 <= population && population < 1000000000) {
                key = "200m - 1000m";
            } else if (1000000000 <= population) {
                key = "> 1000m";
            };

            // Set item properties to dataset items
            dataset[item['Country Code']] = {
                population: item['Population'],
                low_age: item['0-14'],
                middle_age: item['15-64'],
                high_age: item['65+'],
                male: 100 - item['Female'],
                female: item['Female'],
                name: item['Country Name'],
                fillKey: key
            };
        });

        visualize();
    });


    function visualize() {
        var map = new Datamap({
            element: document.getElementById('map_container'),
            responsive: true,
            aspectRatio: 0.35,

            fills: {
                '< 5m': '#fff5f0',
                '5m - 10m': '#fee0d2',
                '10m - 25m': '#fcbba1',
                '25m - 50m': '#fc9272',
                '50m - 75m': '#fb6a4a',
                '75m - 100m': '#ef3b2c',
                '100m - 200m': '#cb181d',
                '200m - 1000m': '#a50f15',
                '> 1000m': '#67000d',
                defaultFill: 'lightgray'
            },

            data: dataset,

            geographyConfig: {
                borderColor: 'darkgray',
                borderWidth: 0.5,
                highlightFillColor: function(data) {
                    return data['fillKey'] || 'defaultFill';
                },
                highlightBorderWidth: 2,
                highlightBorderColor: 'teal',

                popupTemplate: function(geo, data) {
                    // Show name and Unknown population in tooltip for countries with no data
                    if (!data || data.population == "..") {
                        return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Population: <strong>Unknown</strong>',
                        '</div>'].join('');
                    };
                        
                    // Show name and population in tooltip
                    return ['<div class="hoverinfo">',
                        '<strong>', data.name, '</strong>',
                        '<br>Population: <strong>', data.population.replace(/\B(?=(\d{3})+(?!\d))/g, ","), '</strong>', // add commas to large numbers
                        '</div>'].join('');
                }
            },

            // Create pie chart on country click
            done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                    // If data is available for selected country
                    if (dataset[geo.id] == null || dataset[geo.id].low_age == "..") {
                        alert("No " + category.toLowerCase() + " distribution data available for this country");
                    } else {
                        id = geo.id // Update selected country
                        createPieChart();
                    };
                });
            }

        });

        // Create legend with label for defaultFill
        map.legend({
            defaultFillName: "No data:",
        });

        // Resize according to window size
        d3.select(window).on('resize', function() {
            map.resize();
        });
    };

    function createPieChart() {
        d3.selectAll(".pieChart_container").remove();

        var container = d3.select("body").append("div")
            .attr("class", "pieChart_container")

        container.append("h3")
                .text(category + " distribution in " + dataset[id].name);

        var svg = container.append("svg")
            .attr("width", pieChart_width)
            .attr("height", pieChart_height)
            .attr("class", "pieChart")
            .style("display", "block")
            .style("margin", "auto")
          .append("g")
            .attr("transform", "translate(" + pieChart_width / 2 + "," + pieChart_height / 2 + ")");

        // Use different data depending on chosen category
        if (category == "Age") {
            temp_dataset = [
                { label: "0-14", value: dataset[id].low_age, color: "#84b761" },
                { label: "15-64", value: dataset[id].middle_age, color: "#67b7dc" },
                { label: "65+", value: dataset[id].high_age, color: "#d45859" }
            ];
        } else if (category == "Gender") {
            temp_dataset = [
                { label: "Male", value: dataset[id].male, color: "dodgerblue" },
                { label: "Female", value: dataset[id].female, color: "pink" }
            ];
        }

        pie.value(function(d) { return d.value; })

        var g = svg.selectAll(".arc")
            .data(pie(temp_dataset))
          .enter().append("g")
            .attr("class", "arc")
            .on('mouseover', mouseOver)
            .on('mouseout', mouseOut);

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return d.data.color; });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("id", function(d) { return "cat" + d.data.label.replace("+", "plus") }) // Set id for <text> element
            .text(function(d) { return d.data.label; });
    };

    function mouseOver(d, i) {
        // Adjust <text> element to display percentage
        d3.select("#cat" + d.data.label.replace("+", "plus"))
            .text(function(d) { return String(Math.round( d.value * 10 ) / 10) + "%"})
            .style("fill", "white");
    };

    function mouseOut(d, i) {
        // Restore <text> element to display category
        d3.select("#cat" + d.data.label.replace("+", "plus"))
            .text(function(d) { return d.data.label; })
            .style("fill", "black");
    };
}