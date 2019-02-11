import {openNote} from '/static/js_modules/noteFunctions.js';


let appendNotePlace = function(containerToAppend, howManyTimes) {
    for (let i=0; i < howManyTimes; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.setAttribute('hidden', '');

        let container = document.getElementsByClassName('grid-container')[0];
        containerToAppend.appendChild(gridItem)
    }
};

let loadNotesForSubtopic = function(notes) {
    let container = document.getElementsByClassName('grid-container')[0];
    container.innerHTML = '';
    appendNotePlace(container, notes.length);

    const notePlaces = document.getElementsByClassName('grid-item');
    for (let i=0; i < notes.length; i++) {
        notePlaces[i].innerHTML = '<div class="note"><p>' + notes[i]['header'] + '</p></div>';

        let noteDiv = notePlaces[i].firstChild;
        noteDiv.dataset.header = notes[i]['header'];
        noteDiv.dataset.body = notes[i]['body'];
        noteDiv.addEventListener('click', openNote);
        notePlaces[i].removeAttribute('hidden')
    }
};

let showNewNotePlace = function() {
    let newNoteContainer = document.getElementsByClassName('new-note-container')[0];
    let newNotePlace = newNoteContainer.getElementsByClassName('grid-item')[0];

    newNotePlace.removeAttribute('hidden')
};

export let getNotesForSubtopic = function(endFunction) {
    getNotesForSubtopic.endFunction = loadNotesForSubtopic;

    getNotesForSubtopic.subtopic = event.target.dataset.subtopicLink ? event.target.dataset.subtopicLink : getNotesForSubtopic.subtopic;

    fetch('/subtopic/' + getNotesForSubtopic.subtopic)
    .then((response) => response.json())
    .then((response) => {
        document.querySelector('#right-side').removeAttribute('hidden');
        getNotesForSubtopic.endFunction(response);
        showNewNotePlace()
    });
};

export let makeSubtopicButtonsWork = function() {
    let subtopicButtons = document.getElementsByClassName('subtopic');
    for (const subtopicButton of subtopicButtons) {
        subtopicButton.addEventListener('click', getNotesForSubtopic)
    }
};

