document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const warningElement = document.getElementById('warning-container');
    const submitBtn = document.getElementById('btn');
    const result = document.getElementById('result');
    const pantallaPrincipal = document.getElementById('section-principal');
    
    let contadorPreguntas = 1;
    let contestarPregunta = true;
    let respuestasCorrectas = 0;
    let totalPreguntas = 0;
    
    
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
            totalPreguntas = quizData.length;
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
                <div id="question-container" class= "row"> 
                        <article class="col-md-6">
                            <p >Pregunta ${contadorPreguntas}  de ${totalPreguntas}</p>
                            <h6>${escapeHTML(item.question)}</h6>
                            <div class="progress-bar" col-md-6>
                                <div class="progress"></div>
                            </div>
                        </article>
                        <article id="quiz-container question-list" class=" col-md-5">
                            ${item.options.map((option, i) => `
                                <label class="question-label col-md-12">
                                    <input type="radio" id="radio${index}-${i}" name="question${index}" value="${escapeHTML(option)}">
                                    <span  class= "label-button"  for="radio${index}-${i}">${escapeHTML(option)}</span>
                                </label>
                                <ul></ul>
                            `).join('')}
                        </article>

                </div>
                `;
                quizContainer.appendChild(questionElement);
            //});
            
            function updateProgressBar(currentQuestion) {
                const progressBar = document.querySelector('.progress');
                const progressPercentage = (currentQuestion / totalPreguntas) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
            
            // Llama a esta función cada vez que cambies de pregunta
            updateProgressBar(contadorPreguntas);

            submitBtn.style.display = 'block'; // Mostrar el botón como bloque
            submitBtn.style.margin = '-6.5% 52%'; // Eliminar margen para alineación correcta
            submitBtn.style.width = '42%'; // Eliminar margen para alineación correcta
            submitBtn.textContent = "Contestar Pregunta"
            questionElement.appendChild(submitBtn);    

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
                            respuestasCorrectas++;
                        }

                        mostrarRespuestaCorrecta(item.answer)
                        
                        //});
                        //result.textContent = `Your score: ${score}/${quizData.length}`;
                        //utilizando un operador condicional (ternario) se evalua score. 
                        result.textContent = (Respuesta?"Respuesta Correcta":"Respuesta Fallida");
                        console.log(result.textContent);
                        //submitBtn.textContent = "Siguiente Pregunta";

                        submitBtn.textContent = (totalPreguntas==contadorPreguntas?"Finalizar Quiz":"Siguiente Pregunta");
                        contestarPregunta = false;
                        console.log(submitBtn.textContent);

                        // Apartado para deshabilitar todas las opciones después de haber seleccionado una anteriormente
                        const options = document.querySelectorAll(`input[name="question${index}"]`);
                        options.forEach(option => option.disabled = true);
                    }

                }
                else
                {
                    (totalPreguntas==contadorPreguntas?finalizarQuiz(respuestasCorrectas):cargarPreguntas(url, contadorPreguntas++));
                    
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


    function finalizarQuiz(respuestasCorrectas) {
        quizContainer.innerHTML = '';
        result.textContent = '';
        const pantallaFinal = document.createElement('div');
        pantallaFinal.classList.add('question');

        pantallaFinal.innerHTML = `
        <div id="question-container" class= "row"> 
                <article class="col-md-6">
                    <p></p>
                    <h6>De ${totalPreguntas} Preguntas has Respondido correctamente ${respuestasCorrectas}</h6>
                    
                </article>
                <article id="quiz-container question-list" class=" col-md-5">
                </article>
        </div>
        <button onClick="window.location.reload();">Iniciar Nuevamente</button>
        `;

        quizContainer.appendChild(pantallaFinal);

    } 
    
    function mostrarRespuestaCorrecta(respuestaCorrecta) {
        const allPosibleAnswer = document.querySelectorAll(`input[name^="question"]`);
        allPosibleAnswer.forEach((posibleAnswer) => {
            if (posibleAnswer.value === respuestaCorrecta) {
                console.log(posibleAnswer);
                posibleAnswer.classList.add('correctAnswer');
            }
            else
            {
                //posibleAnswer.add.classList('');
                posibleAnswer.classList.add('incorrectAnswer');
            }
        }
        );
        console.log(allPosibleAnswer);
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

