import {postData, hide, reveal} from "./utility.js";


export const editNote = function() {
    const noteBody = document.querySelector('#note-body');
    noteBody.removeAttribute('readonly');
    noteBody.style.boxShadow = '0px 0px 74px -7px #a89582';

    hide(document.querySelector('#edit-note-icon'));
    reveal(document.querySelector('#save-note-icon'))
};

export const removeUnfinishedEdit = function() {
    const noteBody = document.querySelector('#note-body');
    noteBody.style.boxShadow = '';
    noteBody.setAttribute('readonly', '');
    noteBody.blur();

    if (! document.querySelector('#save-note-icon').hasAttribute('hidden')) {
        reveal(document.querySelector('#edit-note-icon'));
        hide(document.querySelector('#save-note-icon'))
    }
};

export const openNote = function() {
    removeUnfinishedEdit();
    const clickedNote = event.target.parentElement;
    const clickedNoteText = event.target;

    const openedHeader = document.getElementById('opened-header').querySelector('p');
    openedHeader.textContent = clickedNote.dataset.header ? clickedNote.dataset.header : clickedNoteText.dataset.header;

    const noteBody = document.querySelector('#note-body');
    noteBody.value = clickedNote.dataset.body ? clickedNote.dataset.body : clickedNoteText.dataset.body;

    reveal(document.querySelector('#opened-note'))
};

export const closeOpenedNote = function() {
    hide(document.querySelector('#opened-note'));
    removeUnfinishedEdit()
};

export const saveNote = function() {
    removeUnfinishedEdit();

    const newBody = document.querySelector('#note-body').value;
    const referenceHeader = document.getElementById('opened-header').querySelector('p').textContent;

    const updatedNote = {};
    updatedNote[referenceHeader] = newBody;

    postData("/update-body", updatedNote, () => {});

    const noteElement = document.querySelector("[data-header='" + referenceHeader + "']");
    noteElement.dataset.body = newBody
};