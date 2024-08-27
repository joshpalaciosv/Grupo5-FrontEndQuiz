document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const warningElement = document.getElementById('warning-container');
    const submitBtn = document.getElementById('btn');
    const result = document.getElementById('result');
    
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
    
    function cargarPreguntas(url) {
        fetch(url)
        .then(response => response.json())
        .then(quizData => {
            quizContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas preguntas
    
            quizData.forEach((item, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${escapeHTML(item.question)}</p>
                    ${item.options.map((option, i) => `
                        <label>
                            <input type="radio" id="radio${index}-${i}" name="question${index}" value="${escapeHTML(option)}">
                            <span class="label-button" for="radio${index}-${i}">${escapeHTML(option)}</span>
                        </label>
                    `).join('')}
                `;
                quizContainer.appendChild(questionElement);
            });
    
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

document.addEventListener('DOMContentLoaded', () => {
    const themeBtnHeader = document.querySelector('.theme-btn-header');
    const body = document.body;

    // Verificar el tema guardado en localStorage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeBtnHeader.classList.add('active');
    }

    themeBtnHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        body.classList.toggle('light-mode');
        
        // Guardar el tema en localStorage
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });
});
