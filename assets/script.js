
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const warningElement = document.getElementById('warning-container');
    const submitBtn = document.getElementById('btn');
    const result = document.getElementById('result');
    const pantallaPrincipal = document.getElementById('section-principal');
    let contadorPreguntas = 1;
    let contestarPregunta = true;
    
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
                //let contadorPreguntas = 1;
                cargarPreguntas(apiUrl);
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
    let buttonQuiz = null;
    
    function cargarPreguntas(url) {
        fetch(url)
        .then(response => response.json())
        .then(quizData => {

            console.log(contadorPreguntas);
            pantallaPrincipal.style.display = 'none'; //ocultar la pantalla principal
            quizContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas preguntas
            result.textContent = '';
            contestarPregunta = true;
            //submitBtn.removeEventListener('click', ());
            submitBtn.removeEventListener('click', buttonQuiz);

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
            submitBtn.textContent = "Contestar Pregunta"
    

            buttonQuiz = () => {
                if (contestarPregunta) {
                    let Respuesta = false;
                    //quizData.forEach((item, index) => {
                    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                    //console.log(selectedOption);
                    if (selectedOption == null) {
                        Swal.fire({
                            title: 'Debes seleccionar una respuesta.',
                            text: 'continuemos',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                          });
                    }
                    else {
                        if (selectedOption && selectedOption.value === item.answer) {
                            Respuesta = true;
                        }
                        //});
                        //result.textContent = `Your score: ${score}/${quizData.length}`;
                        //utilizando un operador condicional (ternario) se evalua score. 
                        result.textContent = (Respuesta?"Respuesta Correcta":"Respuesta Fallida");
                        console.log(result.textContent);
                        submitBtn.textContent = "Siguiente Pregunta";
                        contestarPregunta = false;
                        console.log(submitBtn.textContent);
                    }

                }
                else
                {
                    cargarPreguntas(url, contadorPreguntas++)
                }
            };
            //submitBtn.removeEventListener
            // Manejar el envío del cuestionario
            submitBtn.addEventListener('click', buttonQuiz);


        })
        .catch(error => {
            console.error('Error al cargar las preguntas:', error);
            warningElement.innerHTML = '<p>Error al cargar las preguntas. Inténtalo de nuevo más tarde.</p>';
        });
    }
    

    const body = document.body;
    // Verificar el tema guardado en localStorage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        document.querySelector('.theme-btn-header').classList.add('active');
    }

    /*para que el boton de cambiar a ligth o a dark funcione y tenga interactividad*/
    document.querySelector('.theme-btn-header').addEventListener('click', function() {
        this.classList.toggle('active');
        body.classList.toggle('light-mode');
        
        // Guardar el tema en localStorage
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);

    });

    
});

