document.addEventListener("DOMContentLoaded", function() {
    const publisherSelect = document.getElementById('publisher-select');
    const chartContainer = document.getElementById('chart-container');
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    // Function to fetch data from the API
    function fetchData() {
        fetch(proxyUrl + 'https://www.freetogame.com/api/games')
            .then(response => response.json())
            .then(data => {
                // Extract unique publishers
                const publishers = [...new Set(data.map(game => game.publisher))];
                // Populate the filter select
                publishers.forEach(publisher => {
                    const option = document.createElement('option');
                    option.textContent = publisher;
                    option.value = publisher;
                    publisherSelect.appendChild(option);
                });
                // Add event listener for filter change
                publisherSelect.addEventListener('change', updateChart.bind(null, data));
                // Initialize chart with all data
                updateChart(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to update the chart based on selected publisher
    function updateChart(data) {
        const selectedPublisher = publisherSelect.value;
        const filteredData = filterData(data, selectedPublisher);
        
        drawChart(filteredData);
    }

    // Function to filter data based on the selected publisher
    function filterData(data, selectedPublisher) {
        if (!selectedPublisher) return data;
        return data.filter(game => game.publisher === selectedPublisher);
    }

// Function to draw the Donut chart
function drawChart(data) {
    const platformsData = d3.rollup(data, v => v.length, d => d.platform);
    
    // Convert rollup result to an array of objects
    const formattedData = Array.from(platformsData, ([name, value]) => ({ name, value }));

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .domain(formattedData.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), formattedData.length));

    const arc = d3.arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);

    const pie = d3.pie()
        .padAngle(1 / radius)
        .sort(null)
        .value(d => d.value);

    // Remove any existing chart
    d3.select("#chart-container").selectAll("*").remove();

    const svg = d3.select("#chart-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;")
        .append("g")
        .attr("transform", "translate(" + width / 20 + "," + height / 100 + ")");

    const arcs = pie(formattedData);

    svg.selectAll("path")
        .data(arcs)
        .enter().append("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    // Add percentage labels
    svg.selectAll("text")
        .data(arcs)
        .enter().append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => {
            const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
            return `${percent.toFixed(1)}%`;
        });

    const legend = svg.selectAll(".legend")
        .data(formattedData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(" + (-width / 20) + "," + (i * 20 - height / 100 + 20) + ")");

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d.name));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d.name);
}




    // Fetch data and initialize the dashboard
    fetchData();
});
