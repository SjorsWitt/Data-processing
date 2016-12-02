/* Name: Sjors Witteveen
 * Student number: 10808493 */

window.onload = function() {

    d3.json("data.json", function(rawdata) {

        // adapt rawdata to fit datamap expectation
        dataset = {}
        rawdata.points.forEach(function(item){

            var population = item.Population;

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

            dataset[item['Country Code']] = {
                numberOfThings: item['Population'],
                name: item['Country Name'],
                fillKey: key
            };
        });

        visualize(dataset);
    });


    function visualize(dataset) {
        var map = new Datamap({
            element: document.getElementById('container'),
            responsive: true,
            aspectRatio: 0.45,

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

                // show desired information in tooltip
                popupTemplate: function(geo, data) {
                    // Show name and Unknown population in tooltip for countries with no data
                    if (!data) { 
                        return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Population: <strong>Unknown</strong>',
                        '</div>'].join('');
                    };
                    // Show name and population in tooltip
                    return ['<div class="hoverinfo">',
                        '<strong>', data.name, '</strong>',
                        '<br>Population: <strong>', data.numberOfThings.replace(/\B(?=(\d{3})+(?!\d))/g, ","), '</strong>', // add commas to large numbers
                        '</div>'].join('');
                }
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
}