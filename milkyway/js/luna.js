document.addEventListener('DOMContentLoaded', () => {
    // ¡REEMPLAZA ESTO CON TU CLAVE API DE LA NASA!
    const apiKey = 'BqzkoFkZtmwLGqXNWqjSIxMbOkfMtzDP83PmH2Kf'; // La API de imágenes de la NASA no siempre necesita clave para búsquedas básicas, pero es buena práctica mantenerla.

    const mainLunaImg = document.getElementById('luna-main-img');
    const mainLunaCaption = document.getElementById('luna-main-caption');
    const mainLunaLoading = document.getElementById('luna-loading-main');

    const cratersLunaImg = document.getElementById('luna-craters-img');
    const cratersLunaCaption = document.getElementById('luna-craters-caption');
    const cratersLunaLoading = document.getElementById('luna-loading-craters');

    const fasesLunaImg = document.getElementById('luna-fases-img');
    const fasesLunaCaption = document.getElementById('luna-fases-caption');
    const fasesLunaLoading = document.getElementById('luna-loading-fases');


    async function fetchImageAndDisplay(query, imgElement, loadingElement, captionElement, defaultCaption) {
        // Mostrar mensaje de carga y ocultar imagen
        loadingElement.classList.remove('hidden');
        imgElement.classList.add('hidden');
        imgElement.alt = `Cargando imagen de ${query}...`; // Actualizar alt text de carga

        try {
            const response = await fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();

            if (data.collection.items && data.collection.items.length > 0) {
                // Tomamos la primera imagen de los resultados
                const imageUrl = data.collection.items[0].links[0].href;
                const imageTitle = data.collection.items[0].data[0].title;
                const imageDescription = data.collection.items[0].data[0].description || defaultCaption;

                imgElement.src = imageUrl;
                imgElement.alt = imageTitle;
                captionElement.textContent = imageDescription;

                // Cuando la imagen cargue, mostrarla y ocultar el mensaje de carga
                imgElement.onload = () => {
                    loadingElement.classList.add('hidden');
                    imgElement.classList.remove('hidden');
                };
                imgElement.onerror = () => {
                    loadingElement.textContent = 'Error al cargar la imagen.';
                    loadingElement.classList.remove('hidden');
                    imgElement.classList.add('hidden');
                };
            } else {
                loadingElement.textContent = `Imagen no encontrada para "${query}".`;
                imgElement.classList.add('hidden');
                captionElement.textContent = defaultCaption; // Mantener la descripción por defecto
            }
        } catch (error) {
            console.error(`Error al obtener imagen para "${query}":`, error);
            loadingElement.textContent = `Error: ${error.message}. No se pudo cargar la imagen para "${query}".`;
            loadingElement.classList.remove('hidden');
            imgElement.classList.add('hidden');
            captionElement.textContent = defaultCaption; // Mantener la descripción por defecto
        }
    }

    // Cargar la imagen principal de la Luna
    fetchImageAndDisplay('Moon', mainLunaImg, mainLunaLoading, mainLunaCaption, 'La Luna en su fase de luna llena, majestuosa en el cielo nocturno.');

    // Cargar imagen de cráteres lunares
    fetchImageAndDisplay('Moon craters', cratersLunaImg, cratersLunaLoading, cratersLunaCaption, 'Detalle de los cráteres y la superficie rugosa de la Luna.');

    // Cargar imagen de fases de la Luna
    fetchImageAndDisplay('Moon phases', fasesLunaImg, fasesLunaLoading, fasesLunaCaption, 'Representación de las principales fases de la Luna.');
});