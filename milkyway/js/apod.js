document.addEventListener('DOMContentLoaded', () => {
    const apodContent = document.getElementById('apod-content');
    const errorMessage = document.getElementById('error-message');
    // ¡REEMPLAZA ESTO CON TU CLAVE API DE LA NASA!
    const apiKey = 'BqzkoFkZtmwLGqXNWqjSIxMbOkfMtzDP83PmH2Kf'; // <- Pon tu clave aquí

    async function getAPOD() {
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Error 403: API Key no válida o no proporcionada. Asegúrate de reemplazar "TU_CLAVE_API_AQUI" con tu clave real de la NASA.');
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            displayAPOD(data);
        } catch (error) {
            console.error('Error al obtener la APOD:', error);
            apodContent.innerHTML = ''; // Limpiar contenido si hay error
            errorMessage.classList.remove('hidden');
            errorMessage.querySelector('p').textContent = `Lo sentimos, no se pudo cargar la imagen del día. ${error.message || 'Inténtalo de nuevo más tarde.'}`;
        }
    }

    function displayAPOD(data) {
        let mediaHtml = '';
        if (data.media_type === 'image') {
            mediaHtml = `<img src="${data.url}" alt="${data.title}">`;
        } else if (data.media_type === 'video') {
            // Nota: Algunos videos de YouTube pueden no incrustarse directamente debido a CORS o permisos.
            // Es mejor usar el atributo 'embed_url' si está disponible o directamente YouTube.
            mediaHtml = `
                <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
                <p><strong>Nota:</strong> Es posible que el video de YouTube no se muestre directamente debido a restricciones de incrustación.</p>
            `;
        }

        apodContent.innerHTML = `
            <h3>${data.title}</h3>
            ${mediaHtml}
            <p><strong>Fecha:</strong> ${data.date}</p>
            <div class="apod-explanation">
                <p>${data.explanation}</p>
            </div>
            ${data.copyright ? `<p><strong>Créditos:</strong> ${data.copyright}</p>` : ''}
        `;
        errorMessage.classList.add('hidden'); // Ocultar mensaje de error si se carga correctamente
    }

    getAPOD();
});