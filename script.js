let verbs = [];
let currentVerbIndex = 0;
let results = [];
let incorrectVerbs = [];

fetch('verbs.json')
    .then(response => response.json())
    .then(data => {
        verbs = data;
        loadNextVerb();
    })
    .catch(error => console.error('Erreur de chargement du fichier JSON', error));

function loadNextVerb() {
    if (currentVerbIndex < verbs.length) {
        const verb = verbs[currentVerbIndex];
        document.getElementById('verb-fr').textContent = verb.fr;
        document.getElementById('base-form').value = '';
        document.getElementById('past-form').value = '';
        document.getElementById('past-participle').value = '';
        document.getElementById('result').textContent = '';
        document.getElementById('counter').textContent = `Verbes restants: ${verbs.length - currentVerbIndex}`;
    } else {
        displayFinalResults();
    }
}

function checkAnswers() {
    const verb = verbs[currentVerbIndex];
    const base = document.getElementById('base-form').value.trim().toLowerCase();
    const past = document.getElementById('past-form').value.trim().toLowerCase();
    const pastParticiple = document.getElementById('past-participle').value.trim().toLowerCase();

    let resultMessage = '';
    let isCorrect = false;

    if (
        base === verb.base.toLowerCase() &&
        past === verb.past.toLowerCase() &&
        pastParticiple === verb.past_participle.toLowerCase()
    ) {
        resultMessage = 'Bravo, toutes les réponses sont correctes !';
        isCorrect = true;
    } else {
        resultMessage = `Faux. La bonne réponse était :
                        \nBase verb: ${verb.base}
                        \nPast: ${verb.past}
                        \nPast Participle: ${verb.past_participle}`;
        incorrectVerbs.push(verb);
    }

    document.getElementById('result').textContent = resultMessage;
    results.push({ verb: verb.fr, isCorrect: isCorrect });
    currentVerbIndex++;
    setTimeout(loadNextVerb, 3000);
}

function displayFinalResults() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '<h3>Résultats Finaux :</h3>';
    
    results.forEach(result => {
        const verbResult = document.createElement('p');
        verbResult.textContent = result.verb;
        verbResult.style.color = result.isCorrect ? 'green' : 'red';
        resultContainer.appendChild(verbResult);
    });

    if (incorrectVerbs.length > 0) {
        const incorrectSection = document.createElement('div');
        incorrectSection.innerHTML = '<h3>Vous vous êtes trompé sur les verbes suivants :</h3>';
        
        incorrectVerbs.forEach(verb => {
            const incorrectVerb = document.createElement('p');
            incorrectVerb.textContent = `Verbe: ${verb.fr} - La bonne réponse est:
                                         \nBase verb: ${verb.base}
                                         \nPast: ${verb.past}
                                         \nPast Participle: ${verb.past_participle}`;
            incorrectVerb.style.color = 'red';
            incorrectSection.appendChild(incorrectVerb);
        });

        resultContainer.appendChild(incorrectSection);
    }

    document.getElementById('counter').textContent = '';
}
