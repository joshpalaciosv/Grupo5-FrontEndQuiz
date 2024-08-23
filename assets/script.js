document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submit-btn');
    const result = document.getElementById('result');

    // Fetch quiz data from server
    fetch('http://67.207.95.104:3000/api/quiz')
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
