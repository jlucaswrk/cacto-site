const inputText = document.getElementById('inputText');
const cactusContainer = document.getElementById('cactusContainer');
const clearBtn = document.getElementById('clearBtn');

// Array com diferentes tipos de cactos
const cactusEmojis = ['🌵', '🌵', '🌵', '🌴', '🪴'];

// Função para contar ocorrências de "cacto" (case-insensitive)
function countCactusWords() {
    const text = inputText.value.toLowerCase();
    const regex = /cacto/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

// Função para atualizar os cactos
function updateCactuses() {
    const cactusCount = countCactusWords();
    const currentCactusCount = cactusContainer.children.length;

    // Se aumentou o número de "cactos", adiciona novos cactos
    if (cactusCount > currentCactusCount) {
        const newCactusCount = cactusCount - currentCactusCount;
        for (let i = 0; i < newCactusCount; i++) {
            const cactusEl = document.createElement('div');
            cactusEl.className = 'cactus';
            cactusEl.textContent = cactusEmojis[Math.floor(Math.random() * cactusEmojis.length)];
            cactusContainer.appendChild(cactusEl);

            // Click para remover um cacto individual
            cactusEl.addEventListener('click', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'popIn 0.5s ease-out reverse';
                }, 10);
                setTimeout(() => {
                    this.remove();
                }, 500);
            });
        }
    }
    // Se diminuiu, remove os cactos do final
    else if (cactusCount < currentCactusCount) {
        const removeCount = currentCactusCount - cactusCount;
        for (let i = 0; i < removeCount; i++) {
            const lastCactus = cactusContainer.lastChild;
            if (lastCactus) {
                lastCactus.style.animation = 'popIn 0.5s ease-out reverse';
                setTimeout(() => {
                    lastCactus.remove();
                }, 500);
            }
        }
    }
}

// Eventos
inputText.addEventListener('input', updateCactuses);

clearBtn.addEventListener('click', function() {
    inputText.value = '';
    cactusContainer.innerHTML = '';
});

// Focar no textarea ao carregar a página
inputText.focus();
