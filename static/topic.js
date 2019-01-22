import {editNote, openNote, closeOpenedNote, saveNote} from '/static/modules/noteFunctions.js';
import {makeSubtopicButtonsWork, getNotesForSubtopic} from '/static/modules/notePlacement.js';

let sendNewPositions = function() {
    let positionForEachHeader = getPositionForEachHeader();

    $.ajax({
          type: "POST",
          url: "/update-positions",
          data: positionForEachHeader,
          success: null,
          dataType: 'json'
    });
};

let getPositionForEachHeader = function() {
    let gridItems = document.getElementsByClassName('grid-item');

    let updateData = {};
    for (let i=0; i < gridItems.length; i++) {
        if (gridItems[i].firstElementChild) {
            let noteHeader = gridItems[i].firstElementChild.firstElementChild.textContent;
            updateData[noteHeader] = i
        }
    }

    return updateData
};

dragula(Array.from(document.getElementsByClassName('grid-item'))).on('drop', sendNewPositions);

/*
let loadNotes = function() {
    emptyAllPlaces();
    loadNotes.subtopic = event.target.dataset.subtopicLink ? event.target.dataset.subtopicLink : loadNotes.subtopic;

    console.log(Date.now());
    $.ajax({
        dataType: "json",
        url: '/subtopic/' + loadNotes.subtopic,
        success: function (response) {
            let notes = response;
            let gridItems = document.getElementsByClassName('grid-item');

            for (let i = 0; i < Object.keys(notes).length; i++) {
                let neededGridItem = gridItems[notes['note' + i]['position']];
                neededGridItem.innerHTML = '<div class="note"><p>' + notes['note' + i]['header'] + '</p></div>';
                neededGridItem.firstChild.dataset.header = notes['note' + i]['header'];
                neededGridItem.firstChild.dataset.body = notes['note' + i]['body'];
                neededGridItem.firstChild.addEventListener('click', openNote);
                neededGridItem.removeAttribute('hidden')
            }

            hideUnnecessaryGridItems(Object.keys(notes).length, gridItems.length);

            loadNotes.newHeaderPosition = Object.keys(notes).length;
            let nextGridItem = gridItems[loadNotes.newHeaderPosition];
            createNewNotePlace(nextGridItem);
        }
    });
};
*/

let createNewNotePlace = function(GridItem) {
    GridItem.removeAttribute('hidden');
    GridItem.innerHTML = '';

    addClassForHover(GridItem, 'new-note');

    GridItem.addEventListener('click', createEmptyHeader);
    GridItem.addEventListener('keydown', addNewNoteHeader)
};

let createEmptyHeader = function() {
    event.target.innerHTML = '<div class="note"><textarea class="new-note-textarea" spellcheck="false"></textarea></div>';
    let input = event.target.getElementsByTagName('textarea')[0];
    input.focus();
    event.target.removeEventListener('click', createEmptyHeader)
};

// This was the worst part, first time to have problem with time =)
let addNewNoteHeader = function(event) {
    if (event.key == 'Enter') {
        let newHeader = event.target.value;
        let sendingData = {};
        sendingData['new_header'] = newHeader;
        sendingData['subtopic_name_as_link'] = loadNotes.subtopic;
        sendingData['position'] = loadNotes.newHeaderPosition;

        getNumberOfNotes();
        let firstNumber = getNumberOfNotes.number;
        console.log('first', firstNumber);

        $.ajax({
          type: "POST",
          url: "/add-new-note-header",
          data: sendingData,
          success: null,
          dataType: 'string'
        });

        let secondNumber = 0;
        while (secondNumber != firstNumber + 1) {
            getNumberOfNotes();
            secondNumber = getNumberOfNotes.number;
        }
        console.log('second', secondNumber);

        loadNotes();
    }
};

let getNumberOfNotes = function() {
    $.ajax({
        dataType: "json",
        url: '/show-actual-number-of-notes',
        async: false,
        success: function(response) {
            getNumberOfNotes.number = response;
            getNumberOfNotes.number = response['number_of_notes'];
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

let makeNoteFunctionsWork = function() {
    let closeButton = document.getElementById('opened-note').getElementsByTagName('img')[0];
    closeButton.addEventListener('click', closeOpenedNote);

    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.addEventListener('click', editNote);

    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveNote.endFunction = getNotesForSubtopic;
    saveButton.addEventListener('click', saveNote)
};


window.addEventListener('load', function () {
    let logo = document.getElementsByClassName("box")[0];
    logo.style.opacity = 1;
    makeNoteFunctionsWork();
    makeSubtopicButtonsWork()
});