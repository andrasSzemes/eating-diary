import {changeToTopicsLayout, changeToNotesLayout} from './js_modules/iconFunctions.js'
import {closeOpenedNote, editNote, saveNote} from "./js_modules/noteFunctions.js";
import {getNotesForSubtopic} from "./js_modules/notePlacement.js";
import {makeNewNoteWork} from "./js_modules/newNote.js";
import {showHideLoginModal, handleUserInput, handleLogout} from "./js_modules/authorization.js";


const handleIconClick = function () {
    const iconElements = document.querySelectorAll("[id$='-logo']");

    for (const iconElement of iconElements) {
        iconElement.addEventListener('click', () => {
            let isIconSelected = iconElement.classList.contains('place-icon-top-left');

            if (isIconSelected) {
                changeToTopicsLayout(iconElement, iconElements)
            } else {
                changeToNotesLayout(iconElement, iconElements)
            }
        })
    }
};

const makeNoteFunctionsWork = function() {
    let buttons = document.getElementById('opened-note').getElementsByTagName('img');

    buttons[0].addEventListener('click', closeOpenedNote);

    buttons[1].addEventListener('click', editNote);

    buttons[2].addEventListener('click', () => {
        saveNote.endFunction = getNotesForSubtopic;
        saveNote()
    })
    // TODO inline, add parameter to callback
};

const makeAuthorizationWork = function() {
    showHideLoginModal();
    handleUserInput();
    handleLogout()
};


window.addEventListener('load', function () {
    handleIconClick();
    makeNoteFunctionsWork();
    makeNewNoteWork();
    makeAuthorizationWork()
})