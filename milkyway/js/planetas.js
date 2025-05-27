document.addEventListener('DOMContentLoaded', () => {
    // ¡REEMPLAZA ESTO CON TU CLAVE API DE LA NASA! (Aunque la Image and Video Library no la requiere para búsquedas básicas)
    const apiKey = 'BqzkoFkZtmwLGqXNWqjSIxMbOkfMtzDP83PmH2Kf'; // La API de imágenes de la NASA no siempre necesita clave para búsquedas básicas, pero es buena práctica mantenerla.

    const planetCards = document.querySelectorAll('.planeta-card');

    async function fetchPlanetImage(planetName, cardElement) {
        const imgElement = cardElement.querySelector('.planeta-img');
        const loadingMessage = cardElement.querySelector('.loading-message');
        const imageContainer = cardElement.querySelector('.image-container');

        // Mostrar mensaje de carga y ocultar imagen
        loadingMessage.classList.remove('hidden');
        imgElement.classList.add('hidden');
        imgElement.alt = `Cargando imagen de ${planetName}...`; // Actualizar alt text de carga

        try {
            // Usamos la API de imágenes y videos de la NASA
            const response = await fetch(`https://images-api.nasa.gov/search?q=${planetName}&media_type=image`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();

            if (data.collection.items && data.collection.items.length > 0) {
                // Seleccionamos la primera imagen encontrada
                const imageUrl = data.collection.items[0].links[0].href;
                const imageTitle = data.collection.items[0].data[0].title;

                imgElement.src = imageUrl;
                imgElement.alt = imageTitle;

                // Cuando la imagen cargue, mostrarla y ocultar el mensaje de carga
                imgElement.onload = () => {
                    loadingMessage.classList.add('hidden');
                    imgElement.classList.remove('hidden');
                };
                imgElement.onerror = () => {
                    loadingMessage.textContent = 'Error al cargar la imagen.';
                    loadingMessage.classList.remove('hidden');
                    imgElement.classList.add('hidden');
                };
            } else {
                loadingMessage.textContent = 'Imagen no encontrada para ' + planetName;
                imgElement.classList.add('hidden');
            }
        } catch (error) {
            console.error(`Error al obtener imagen para ${planetName}:`, error);
            loadingMessage.textContent = `Error: ${error.message}. No se pudo cargar la imagen de ${planetName}.`;
            loadingMessage.classList.remove('hidden');
            imgElement.classList.add('hidden');
        }
    }

    // Cargar imagen para cada planeta
    planetCards.forEach(card => {
        const planetName = card.dataset.planet; // Usamos el atributo data-planet
        fetchPlanetImage(planetName, card);
    });
});