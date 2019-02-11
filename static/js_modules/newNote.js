import {getNotesForSubtopic} from '/static/js_modules/notePlacement.js';
import {postData} from "./utility.js";

let createEmptyHeader = function() {
    event.target.innerHTML = '<div class="note"><textarea class="new-note-textarea" spellcheck="false"></textarea></div>';
    let input = event.target.getElementsByTagName('textarea')[0];
    input.focus();
    event.target.removeEventListener('click', createEmptyHeader)
};

let numberOfSubtopicNotes = function() {
    let notesContainer = document.getElementsByClassName('grid-container')[0];
    let notes = notesContainer.children;
    let numberOfNotes = notes.length;

    return numberOfNotes
};

let addNewNoteHeader = function(event) {
    if (event.key == 'Enter') {
        let newHeader = event.target.value;
        let sendingData = {};
        sendingData['new_header'] = newHeader;
        sendingData['subtopic_name_as_link'] = getNotesForSubtopic.subtopic;
        sendingData['position'] = numberOfSubtopicNotes() + 1;

        postData("/add-new-note-header", sendingData, (response) => {
            getNotesForSubtopic();
            let newNoteContainer = document.getElementsByClassName('new-note-container')[0];
            let newNotePlace = newNoteContainer.getElementsByClassName('grid-item')[0];
            newNotePlace.innerHTML = '';
            newNotePlace.addEventListener('click', createEmptyHeader);
        });
    }
};

let getNumberOfNotes = function() {
    $.ajax({
        dataType: "json",
        url: '/show-actual-number-of-notes',
        async: false,
        success: function(response) {
            getNumberOfNotes.number = response['number_of_notes'];
            console.log(getNumberOfNotes.number);
        }
    });
};

let addClassForHover = function(element, classToAdd) {
    element.addEventListener('mouseenter', function() {
        element.classList.add(classToAdd)
    });
    element.addEventListener('mouseleave', function() {
        element.classList.remove(classToAdd)
    });
};

export let makeNewNoteWork = function() {
    let newNoteContainer = document.getElementsByClassName('new-note-container')[0];
    let newNotePlace = newNoteContainer.getElementsByClassName('grid-item')[0];

    addClassForHover(newNotePlace, 'new-note');

    newNotePlace.addEventListener('click', createEmptyHeader);
    newNotePlace.addEventListener('keydown', addNewNoteHeader)
};