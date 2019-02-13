import {getNotesForSubtopic} from '/static/js_modules/notePlacement.js';
import {postData} from "./utility.js";


const createEmptyHeader = function() {
    const newNotePlace = event.target;
    newNotePlace.removeEventListener('click', createEmptyHeader);

    newNotePlace.innerHTML = `
        <div class="note"><textarea class="new-note-textarea" spellcheck="false"></textarea></div>`;
    newNotePlace.querySelector('textarea').focus();

    newNotePlace.querySelector('textarea').addEventListener('blur', () => {
        newNotePlace.innerHTML = '';
        newNotePlace.addEventListener('click', createEmptyHeader)
    })
};

const numberOfSubtopicNotes = function() {
    const subtopicNotes = document.querySelector('.grid-container').children;

    return subtopicNotes.length
};

const addNewNoteHeader = function(event) {
    if (event.key == 'Enter') {
        const newHeader = event.target.value;
        const sendingData = {};
        sendingData['new_header'] = newHeader;
        sendingData['subtopic_name_as_link'] = getNotesForSubtopic.subtopic;
        sendingData['position'] = numberOfSubtopicNotes() + 1;

        postData("/add-new-note-header", sendingData, (response) => {
            getNotesForSubtopic();
            const newNotePlace = document.querySelector('#new-note-place');
            newNotePlace.innerHTML = '';
            newNotePlace.addEventListener('click', createEmptyHeader);
        });
    }
};

export const makeNewNoteWork = function() {
    const newNotePlace = document.querySelector('#new-note-place');

    newNotePlace.addEventListener('click', createEmptyHeader);
    newNotePlace.addEventListener('keydown', addNewNoteHeader)
};