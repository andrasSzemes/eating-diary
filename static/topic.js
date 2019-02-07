import {closeOpenedNote, editNote, saveNote} from '/static/modules/noteFunctions.js';
import {getNotesForSubtopic, makeSubtopicButtonsWork} from '/static/modules/notePlacement.js';
import {makeNewNoteWork} from '/static/modules/newNote.js';

/*
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
*/

let makeNoteFunctionsWork = function() {
    let buttons = document.getElementById('opened-note').getElementsByTagName('img');

    buttons[0].addEventListener('click', closeOpenedNote);

    buttons[1].addEventListener('click', editNote);

    buttons[2].addEventListener('click', () => {
        saveNote.endFunction = getNotesForSubtopic;
        saveNote()
    })
    // TODO inline, add parameter to callback
};


window.addEventListener('load', function () {

    let logo = document.querySelector('.box');
    //TODO querySelector, canIUse.com
    logo.style.opacity = 1;
    makeNoteFunctionsWork();
    makeSubtopicButtonsWork();
    makeNewNoteWork();
});