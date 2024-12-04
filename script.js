let verbs = [];
let currentVerbIndex = 0;
let results = []; // Tableau pour stocker les résultats des réponses
let incorrectVerbs = []; // Tableau pour stocker les verbes incorrects

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

        // Afficher le verbe en français
        document.getElementById('verb-fr').textContent = verb.fr;

        // Effacer les champs de réponse
        document.getElementById('base-form').value = '';
        document.getElementById('past-form').value = '';
        document.getElementById('past-participle').value = '';
        document.getElementById('result').textContent = '';

        // Mettre à jour le compteur
        document.getElementById('counter').textContent = `Verbes restants: ${verbs.length - currentVerbIndex}`;
    } else {
        // Afficher les résultats à la fin
        displayFinalResults();
    }
}

function checkAnswers() {
    const verb = verbs[currentVerbIndex];
    const base = document.getElementById('base-form').value.trim();
    const past = document.getElementById('past-form').value.trim();
    const pastParticiple = document.getElementById('past-participle').value.trim();

    let resultMessage = '';
    let isCorrect = false;

    // Vérifier si toutes les réponses sont correctes
    if (base === verb.base && past === verb.past && pastParticiple === verb.past_participle) {
        resultMessage = 'Bravo, toutes les réponses sont correctes !';
        isCorrect = true;
    } else {
        resultMessage = `Faux. La bonne réponse était :
                        \nBase verb: ${verb.base}
                        \nPast: ${verb.past}
                        \nPast Participle: ${verb.past_participle}`;
        // Ajouter le verbe incorrect à la liste des erreurs
        incorrectVerbs.push(verb);
    }

    document.getElementById('result').textContent = resultMessage;

    // Stocker le résultat pour affichage final
    results.push({ verb: verb.fr, isCorrect: isCorrect });

    // Passer au verbe suivant
    currentVerbIndex++;

    // Attendre 3 secondes avant de charger le prochain verbe
    setTimeout(loadNextVerb, 3000);
}

function displayFinalResults() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '<h3>Résultats Finaux :</h3>';
    
    // Afficher les réponses correctes
    results.forEach(result => {
        const verbResult = document.createElement('p');
        verbResult.textContent = result.verb;

        // Appliquer la couleur en fonction de la réussite ou non
        if (result.isCorrect) {
            verbResult.style.color = 'green';  // Vert pour réussi
        } else {
            verbResult.style.color = 'red';    // Rouge pour incorrect
        }

        resultContainer.appendChild(verbResult);
    });

    // Afficher les verbes incorrects avec leurs bonnes réponses
    if (incorrectVerbs.length > 0) {
        const incorrectSection = document.createElement('div');
        incorrectSection.innerHTML = '<h3>Vous vous êtes trompé sur les verbes suivants :</h3>';
        
        incorrectVerbs.forEach(verb => {
            const incorrectVerb = document.createElement('p');
            incorrectVerb.textContent = `Verbe: ${verb.fr} - La bonne réponse est:
                                         \nBase verb: ${verb.base}
                                         \nPast: ${verb.past}
                                         \nPast Participle: ${verb.past_participle}`;
            incorrectVerb.style.color = 'red'; // Rouge pour les erreurs
            incorrectSection.appendChild(incorrectVerb);
        });

        resultContainer.appendChild(incorrectSection);
    }

    // Retirer le compteur
    document.getElementById('counter').textContent = '';
}
