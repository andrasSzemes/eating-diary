import {editNote, openNote, closeOpenedNote, saveNote} from '/static/modules/noteFunctions.js';
import {makeSubtopicButtonsWork, getNotesForSubtopic} from '/static/modules/notePlacement.js';
import {makeNewNoteWork} from '/static/modules/newNote.js';

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
    makeSubtopicButtonsWork();
    makeNewNoteWork();
});