// Fonction pour récupérer les données de l'API
// Fonction pour récupérer les données de l'API
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
function fetchData() {
    fetch(proxyUrl + 'https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            // Extraire les éditeurs uniques
            const publishers = [...new Set(data.map(game => game.publisher))];
            // Populer le sélecteur de filtre
            const publisherSelect = document.getElementById('publisher-select');
            publishers.forEach(publisher => {
                const option = document.createElement('option');
                option.textContent = publisher;
                option.value = publisher;
                publisherSelect.appendChild(option);
            });
            // Ajouter un écouteur d'événements pour le changement de filtre
            publisherSelect.addEventListener('change', () => {
                const selectedPublisher = publisherSelect.value;
                const filteredData = filterData(data, selectedPublisher);
                drawChart(filteredData);
            });
            // Initialiser le graphique avec toutes les données
            drawChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fonction pour filtrer les données en fonction de l'éditeur sélectionné
function filterData(data, selectedPublisher) {
    if (!selectedPublisher) {
        return data; // Retourner toutes les données si aucun éditeur n'est sélectionné
    }
    return data.filter(game => game.publisher === selectedPublisher);
}

// Fonction pour dessiner le graphique
// Fonction pour dessiner le graphique
function drawChart(data) {
    // Supprimer le contenu précédent du conteneur du graphique
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = '';

    // Définir les dimensions du graphique
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Créer le conteneur SVG
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Convertir les dates en objets Date
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.release_date = parseDate(d.release_date);
    });

    // Echelles pour les axes
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.release_date))
        .range([0, width]);

    const yScale = d3.scalePoint()
        .domain(data.map(d => d.genre))
        .range([0, height])
        .padding(0.5);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Ajouter les axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Ajouter les points
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.release_date))
        .attr("cy", d => yScale(d.genre))
        .attr("r", 5);
}


// Appel de la fonction fetchData au chargement du document
document.addEventListener("DOMContentLoaded", fetchData);
