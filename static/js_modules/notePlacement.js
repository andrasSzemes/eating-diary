import {openNote} from '/static/js_modules/noteFunctions.js';
import {hide, reveal} from './utility.js';


const appendNotePlace = function(containerToAppend, howManyTimes) {
    for (let i=0; i < howManyTimes; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        hide(gridItem);

        containerToAppend.appendChild(gridItem)
    }
};

const handleSubtopicHighlight = function (subtopicElement) {
    if (document.querySelector('.chosen-subtopic')) {
        document.querySelector('.chosen-subtopic').classList.remove('chosen-subtopic');  //remove highlight from previous subtopic
    }
    subtopicElement.classList.add('chosen-subtopic') //highlight actual subtopic
};

const loadNotesForSubtopic = function(notes) {
    const container = document.querySelector('.grid-container');
    container.innerHTML = '';
    appendNotePlace(container, notes.length);

    const notePlaces = container.querySelectorAll('.grid-item');
    for (let i=0; i < notes.length; i++) {
        notePlaces[i].innerHTML = '<div class="note"><p>' + notes[i]['header'] + '</p></div>';

        const noteDiv = notePlaces[i].firstChild;
        noteDiv.dataset.header = notes[i]['header'];
        noteDiv.dataset.body = notes[i]['body'];
        noteDiv.addEventListener('click', openNote);
        reveal(notePlaces[i])
    }
};

export const getNotesForSubtopic = function(endFunction) {
    getNotesForSubtopic.endFunction = loadNotesForSubtopic;

    if (event) {
        getNotesForSubtopic.subtopic = event.target.dataset.subtopicLink ? event.target.dataset.subtopicLink : getNotesForSubtopic.subtopic;
        handleSubtopicHighlight(event.target)
    }

    fetch('/subtopic/' + getNotesForSubtopic.subtopic)
    .then((response) => response.json())
    .then((response) => {
        reveal(document.querySelector('#right-side'));
        getNotesForSubtopic.endFunction(response);
    });
};

export const makeSubtopicButtonsWork = function() {
    const subtopicButtons = document.querySelectorAll('.subtopic');
    for (const subtopicButton of subtopicButtons) {
        subtopicButton.addEventListener('click', getNotesForSubtopic)
    }
};
