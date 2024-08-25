document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submit-btn');
    const result = document.getElementById('result');


    //Codigo para Seleccionar el TEMA, dependienco del tema, debera elegir la API ejemplo, selecciona HTML, entonces seleccionara
    // api/html/quiz
    const serverBackEnd = 'http://localhost:3000/';
    let apiUrl = '';
    apiUrl = serverBackEnd + 'api/html/quiz';
    apiUrl = serverBackEnd + 'api/javascript/quiz';
    apiUrl = serverBackEnd + 'api/css/quiz';
    apiUrl = serverBackEnd + 'api/bootstrap/quiz';


    apiUrl = serverBackEnd + 'api/quiz';

    ///  api/javascript/quiz

    // Fetch quiz data from server
    fetch(apiUrl)
        .then(response => response.json())
        .then(quizData => {
            // Render quiz questions
            quizData.forEach((item, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${item.question}</p>
                    ${item.options.map((option, i) => `
                        <label>
                            <input type="radio" name="question${index}" value="${option}">
                            ${option}
                        </label>
                    `).join('')}
                `;
                quizContainer.appendChild(questionElement);
            });

            // Handle form submission
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
        });
});
