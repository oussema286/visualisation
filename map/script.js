// Fonction pour initialiser la carte
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
function initMap() {
    // Créer la carte centrée sur une position par défaut
    const map = L.map('map').setView([0, 0], 2);

    // Ajouter une couche de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Appeler l'API pour obtenir les données des jeux
    fetch(proxyUrl + 'https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            // Créer un ensemble pour stocker les éditeurs uniques
            const uniquePublishers = new Set();

            // Récupérer les éditeurs uniques des jeux
            data.forEach(game => {
                uniquePublishers.add(game.publisher);
            });

            // Convertir l'ensemble en tableau pour itérer
            const publishersArray = Array.from(uniquePublishers);

            // Coordonnées géographiques pour les éditeurs
            const publishersCoordinates = {
                "Activision Blizzard": [37.7749, -122.4194],
                "Amazon Games": [47.6062, -122.3321],
                "KRAFTON, Inc.": [37.5665, 126.9780],
                "Gaijin Entertainment": [55.7558, 37.6173],
                "miHoYo": [31.2304, 121.4737],
                "Xbox Game Studios": [47.6062, -122.3321], // Ajout des coordonnées pour Xbox Game Studios
                "Targem": [55.7558, 37.6173], // Ajout des coordonnées pour Targem
                "Electronic Arts": [37.7749, -122.4194], // Ajout des coordonnées pour Electronic Arts
                "Level Infinite": [37.7749, -122.4194], // Ajout des coordonnées pour Level Infinite
                "NCSoft": [37.5665, 126.9780], // Ajout des coordonnées pour NCSoft
                "Hi-Rez Studios": [33.7490, -84.3880], // Ajout des coordonnées pour Hi-Rez Studios
                "NetEase Games": [31.2304, 121.4737], // Ajout des coordonnées pour NetEase Games
                "Coke And Code": [51.5074, -0.1278], // Ajout des coordonnées pour Coke And Code
                "PressA": [47.6062, -122.3321], // Ajout des coordonnées pour PressA
                "Hidden Leaf Games": [37.7749, -122.4194], // Ajout des coordonnées pour Hidden Leaf Games
                "Nuverse": [37.5665, 126.9780], // Ajout des coordonnées pour Nuverse
                "Bandai Namco": [35.6895, 139.6917] // Ajout des coordonnées pour Bandai Namco
            };

            // Ajouter des marqueurs pour chaque éditeur
            publishersArray.forEach(publisher => {
                const latlng = publishersCoordinates[publisher];
                if (latlng) {
                    L.marker(latlng).addTo(map)
                        .bindPopup(`<b>${publisher}</b>`)
                        .openPopup();
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
}

// Appeler la fonction d'initialisation de la carte lorsque la page est chargée
window.onload = initMap;
