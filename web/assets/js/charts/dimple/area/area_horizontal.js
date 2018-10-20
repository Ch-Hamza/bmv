/* ------------------------------------------------------------------------------
 *
 *  # Dimple.js - horizontal area
 *
 *  Demo of area chart. Data stored in .tsv file format
 *
 *  Version: 1.0
 *  Latest update: August 1, 2015
 *
 * ---------------------------------------------------------------------------- */

$(function () {

    // Construct chart
    var svg = dimple.newSvg("#dimple-area-horizontal", "100%", 500);


    // Chart setup
    // ------------------------------

    d3.tsv("assets/demo_data/dimple/demo_data.tsv", function (data) {

        // Filter data
        //data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
        data = [
            { "Date":"30/04/2018", "Number of Users":12 },
            { "Date":"29/04/2018", "Number of Users":22 },
            { "Date":"28/04/2018", "Number of Users":20 },
            { "Date":"27/04/2018", "Number of Users":15 },
            { "Date":"26/04/2018", "Number of Users":11 },
            { "Date":"25/04/2018", "Number of Users":12 },
            { "Date":"24/04/2018", "Number of Users":10 },
        ];

        // Create chart
        // ------------------------------

        // Define chart
        var myChart = new dimple.chart(svg, data);

        // Set bounds
        //myChart.setBounds(0, 0, "100%", "100%");

        // Set margins
        myChart.setMargins(55, 10, 10, 50);


        // Create axes
        // ------------------------------

        // Horizontal
        var x = myChart.addCategoryAxis("x", "Date");

        // Vertical
        var y = myChart.addMeasureAxis("y", "Number of Users");


        // Construct layout
        // ------------------------------

        // Add area
        var s = myChart
            .addSeries(null, dimple.plot.area)
            .interpolation = "basis";


        // Add styles
        // ------------------------------

        // Font size
        x.fontSize = "12";
        y.fontSize = "12";

        // Font family
        x.fontFamily = "Roboto";
        y.fontFamily = "Roboto";


        //
        // Draw chart
        //

        // Draw
        myChart.draw();

        // Remove axis titles
        x.titleShape.remove();


        // Resize chart
        // ------------------------------

        // Add a method to draw the chart on resize of the window
        $(window).on('resize', resize);
        $('.sidebar-control').on('click', resize);

        // Resize function
        function resize() {

            // Redraw chart
            myChart.draw(0, true);

            // Remove axis titles
            x.titleShape.remove();
        }
    });
});