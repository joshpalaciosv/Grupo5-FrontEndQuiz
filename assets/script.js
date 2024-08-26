document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const warningElement = document.getElementById('warning-container');
    const submitBtn = document.getElementById('btn');
    const result = document.getElementById('result');
    const pantallaPrincipal = document.getElementById('section-principal');
    
    const serverBackEnd = 'http://localhost:3000/';
    let apiUrl = serverBackEnd + 'api/quiz';

    // Llama a la función principal
    mainScreen();

    function mainScreen() {
        // Define el mecanismo para seleccionar un tema usando botones
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', () => {
                const temaSeleccionado = button.getAttribute('data-theme');
                apiUrl = serverBackEnd + `api/${temaSeleccionado}/quiz`;
                let contadorPreguntas = 1;
                cargarPreguntas(apiUrl, contadorPreguntas);
            });
        });
    }

  /*esta funcion es para que no de problemas al leer etiquetas y no las procese*/
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');
    }
    
    function cargarPreguntas(url, contadorPreguntas) {
        fetch(url)
        .then(response => response.json())
        .then(quizData => {

            pantallaPrincipal.style.display = 'none'; //
            quizContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas preguntas


            var item = quizData[contadorPreguntas-1];
            var index = contadorPreguntas;
            //quizData.forEach((item, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                //<p>${escapeHTML(item.question)}</p>
                questionElement.innerHTML = `
                    <article>
                        <h6>${escapeHTML(item.question)}</h6>
                    </article>
                    <article>
                        ${item.options.map((option, i) => `
                            <label>
                                <input type="radio" id="radio${index}-${i}" name="question${index}" value="${escapeHTML(option)}">
                                <span class="label-button" for="radio${index}-${i}">${escapeHTML(option)}</span>
                            </label>
                        `).join('')}
                    </article>
                `;
                quizContainer.appendChild(questionElement);
            //});
    
            submitBtn.style.display = 'block'; // Mostrar el botón de enviar
    
            // Manejar el envío del cuestionario
            submitBtn.addEventListener('click', () => {
                let score = 0;
                quizData.forEach((item, index) => {
                    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                    if (selectedOption && selectedOption.value === item.answer) {
                        score++;
                    }
                });
                result.textContent = `Your score: ${score}/${quizData.length}`;
            });

        })
        .catch(error => {
            console.error('Error al cargar las preguntas:', error);
            warningElement.innerHTML = '<p>Error al cargar las preguntas. Inténtalo de nuevo más tarde.</p>';
        });
    }
    

    /*para que el boton de cambiar a ligth o a dark funcione y tenga interactividad*/
    document.querySelector('.theme-btn-header').addEventListener('click', function() {
        this.classList.toggle('active');
    });
});
