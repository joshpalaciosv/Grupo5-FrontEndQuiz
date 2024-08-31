document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const warningElement = document.getElementById('warning-container');
    const submitBtn = document.getElementById('btn');
    const result = document.getElementById('result');
    const pantallaPrincipal = document.getElementById('section-principal');
    
    //banderas que se utilizan en el codigo
    let contadorPreguntas = 1; //para contar las preguntas e incrementar al avanzar en el quiz
    let contestarPregunta = true; //bandera utilizada para conocer si la pregunta ya fue respondida
    let respuestasCorrectas = 0; //contador de preguntas correctas
    let totalPreguntas = 0; //contador de preguntas totales en el quiz por si llegasen a cambiar en el backend
    
    
    const serverBackEnd = 'http://localhost:3000/'; //se utiliza otro proyecto para leer las preguntas.
    let apiUrl = ""; 

    // Llama a la función principal
    mainScreen();

    function mainScreen() {
        // Define el mecanismo para seleccionar un tema usando botones
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', () => {
                const temaSeleccionado = button.getAttribute('data-theme');
                apiUrl = serverBackEnd + `api/${temaSeleccionado}/quiz`;

                cargarPreguntas(apiUrl); //funcion para cargar las preguntas del tema seleccionado
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
    

    //Funcion que muestra las preguntas en el contenedor quiz-container y que permite que se muestren las preguntas una a una.
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

            //en cada llamada de cargarPreguntas tambien definimos un EventListener dinamico el cual debemos reiniciar.
            //en este caso, utilizamos el remoteEventListener para remover el EventListener el click del boton que se utiliza en cada pregunta.
            submitBtn.removeEventListener('click', buttonQuiz);

            var item = quizData[contadorPreguntas-1]; //cargarmos la data de la pregunta.
            var index = contadorPreguntas;

                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                
                //cargamos las opciones correspondientes a la pregunta.
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

            //Funcion de Progress Bar.
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

            //esta variable contiene el EventListener que se carga en cada iteraccion de la pregunta.
            buttonQuiz = () => {
                if (contestarPregunta) {
                    let Respuesta = false; //inicializamos que la respuesta a la pregunta es falsa
                    // guardamos la seleccion del usuario.
                    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                    
                    //validamos que el usuario seleccione una opcion.
                    if (selectedOption == null) {
                        Swal.fire({
                            title: 'Debes seleccionar una respuesta.',
                            text: 'continuemos',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                          });
                    }
                    else {
                        //si la opcion seleccionada es igual a la respuesta entonces cambiamos la bandera Respuesta=true
                        if (selectedOption && selectedOption.value === item.answer) {
                            Respuesta = true;
                            respuestasCorrectas++; //incrementamos el contador de respuestas correctas
                        }

                        //Funcion para mostrarle al usuario la respuesta correcta.
                        mostrarRespuestaCorrecta(item.answer) 
                        
                        
                        //utilizando un operador condicional (ternario) se evalua score. 
                        result.textContent = (Respuesta?"Respuesta Correcta":"Respuesta Fallida");
                        console.log(result.textContent);

                        submitBtn.textContent = (totalPreguntas==contadorPreguntas?"Finalizar Quiz":"Siguiente Pregunta");
                        contestarPregunta = false; //cambiamos la bandera de contestarPregunta a False, para indicar que lo que se necesita es pasar a la siguiente pregunta
                        console.log(submitBtn.textContent);

                        // Apartado para deshabilitar todas las opciones después de haber seleccionado una anteriormente
                        const options = document.querySelectorAll(`input[name^="question"]`);
                        options.forEach(option => option.disabled = true);
                    }

                }
                else
                {
                    //cuando el usuario ya respondio la pregunta la siguiente opcion es avanzar a la siguiente pregunta.
                    //si el totalPreguntas es igual al contadorPreguntas ya se llego al final y se mostrara la pantalla de finalizacion del Quiz.
                    (totalPreguntas==contadorPreguntas?finalizarQuiz(respuestasCorrectas):cargarPreguntas(url, contadorPreguntas++));
                    
                }
            };
            
            // se agrega al Event Click del boton la variable buttonQuiz.
            submitBtn.addEventListener('click', buttonQuiz);


        })
        .catch(error => {
            console.error('Error al cargar las preguntas:', error);
            warningElement.innerHTML = '<p>Error al cargar las preguntas. Inténtalo de nuevo más tarde.</p>';
        });
    }

    //Funcion que muestra la pantalla final del Quiz, indicando el numero de preguntas acertadas.
    //asi tambien muestra la opcion para comenzar de nuevo.
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
        <button class="startAgain" onClick="window.location.reload();">Iniciar Nuevamente</button>
        `;

        quizContainer.appendChild(pantallaFinal);

    } 
    
    //Funcion para marcar la respuesta correcta en un color diferente.
    function mostrarRespuestaCorrecta(respuestaCorrecta) {
        const allPosibleAnswer = document.querySelectorAll(`input[name^="question"]`);
        allPosibleAnswer.forEach((posibleAnswer) => {
            if (posibleAnswer.value === respuestaCorrecta) {
                posibleAnswer.classList.add('correctAnswer');  //agregamos la clase a la respuesta correcta
            }
            else
            {
                posibleAnswer.classList.add('incorrectAnswer'); //agregamos la clase a la respuesta incorrecta
            }
        }
        );
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

