// Fonction pour récupérer les données de l'API
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
function fetchData() {
    fetch(proxyUrl + 'https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            // Compter le nombre de jeux dans chaque genre
            const genreCounts = {};
            data.forEach(game => {
                const genre = game.genre;
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });

            // Transformer les données en tableau d'objets {genre, count}
            const genreData = Object.keys(genreCounts).map(genre => ({
                genre: genre,
                count: genreCounts[genre]
            }));

            // Dessiner le graphique
            drawChart(genreData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fonction pour dessiner le graphique
function drawChart(data) {
    // Définir les dimensions du graphique
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Créer le conteneur SVG
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Echelles pour les axes
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.genre))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // Axe des x
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Axe des y
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(10));

    // Titre du graphique
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Nombre de jeux par genre");

    // Palette de couleurs
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Ajouter les barres avec des couleurs
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.genre))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.count))
        .attr("height", d => height - yScale(d.count))
        .attr("fill", (d, i) => color(i));
}



// Appel de la fonction fetchData au chargement du document
document.addEventListener("DOMContentLoaded", fetchData);
