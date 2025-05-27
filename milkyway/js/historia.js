document.addEventListener('DOMContentLoaded', () => {
    const apodHistoryForm = document.getElementById('apod-history-form');
    const apodDateInput = document.getElementById('apod-date');
    const apodHistoryContent = document.getElementById('apod-history-content');
    const historyErrorMessage = document.getElementById('history-error-message');
    // ¡REEMPLAZA ESTO CON TU CLAVE API DE LA NASA!
    const apiKey = 'BqzkoFkZtmwLGqXNWqjSIxMbOkfMtzDP83PmH2Kf'; // <- Pon tu clave aquí

    // Establecer la fecha máxima permitida en el input date (hoy)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
    const day = String(today.getDate()).padStart(2, '0');
    apodDateInput.setAttribute('max', `${year}-${month}-${day}`);

    apodHistoryForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el envío tradicional del formulario

        const selectedDate = apodDateInput.value;
        if (!selectedDate) {
            historyErrorMessage.classList.remove('hidden');
            historyErrorMessage.querySelector('p').textContent = 'Por favor, selecciona una fecha.';
            apodHistoryContent.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`);
            if (!response.ok) {
                if (response.status === 403) {
                     throw new Error('Error 403: API Key no válida o no proporcionada.');
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            displayHistoryAPOD(data);
        } catch (error) {
            console.error('Error al obtener la APOD histórica:', error);
            apodHistoryContent.innerHTML = '';
            historyErrorMessage.classList.remove('hidden');
            historyErrorMessage.querySelector('p').textContent = `No se pudo cargar la imagen para la fecha seleccionada. ${error.message || 'Inténtalo de nuevo más tarde.'}`;
        }
    });

    function displayHistoryAPOD(data) {
        let mediaHtml = '';
        if (data.media_type === 'image') {
            mediaHtml = `<img src="${data.url}" alt="${data.title}">`;
        } else if (data.media_type === 'video') {
            mediaHtml = `
                <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
                <p><strong>Nota:</strong> Es posible que el video de YouTube no se muestre directamente debido a restricciones de incrustación.</p>
            `;
        }

        apodHistoryContent.innerHTML = `
            <h3>${data.title}</h3>
            ${mediaHtml}
            <p><strong>Fecha:</strong> ${data.date}</p>
            <div class="apod-explanation">
                <p>${data.explanation}</p>
            </div>
            ${data.copyright ? `<p><strong>Créditos:</strong> ${data.copyright}</p>` : ''}
        `;
        historyErrorMessage.classList.add('hidden'); // Ocultar mensaje de error
    }
});