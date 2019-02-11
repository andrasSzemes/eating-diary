import {postData} from "./utility.js";

export let editNote = function() {
    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.removeAttribute('readonly');
    openedBody.style.boxShadow = '0px 0px 74px -7px #a89582';

    //hide edit button
    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.setAttribute('hidden', '');
    //show save button
    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveButton.removeAttribute('hidden')
};

export let removeUnfinishedEdit = function() {
    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.style.boxShadow = '';
    openedBody.setAttribute('readonly', '');
    openedBody.blur();

    //show edit button
    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.removeAttribute('hidden');

    //hide save button
    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveButton.setAttribute('hidden', '');
};

export let openNote = function() {
    removeUnfinishedEdit();
    let clickedNote = event.target.parentElement;
    let clickedNoteText = event.target;

    let openedHeader = document.getElementById('opened-header').getElementsByTagName('p')[0];
    openedHeader.textContent = clickedNote.dataset.header ? clickedNote.dataset.header : clickedNoteText.dataset.header;

    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.value = clickedNote.dataset.body ? clickedNote.dataset.body : clickedNoteText.dataset.body;

    let openedNote = document.getElementById('opened-note');
    openedNote.removeAttribute('hidden')
};

export let closeOpenedNote = function() {
    let openedNote = document.getElementById('opened-note');
    openedNote.setAttribute('hidden', '');
    removeUnfinishedEdit()
};

export let saveNote = function() {
    removeUnfinishedEdit();

    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    let newBody = openedBody.value;
    let openedHeader = document.getElementById('opened-header').getElementsByTagName('p')[0];
    let referenceHeader = openedHeader.textContent;

    let updatedNote = {};
    updatedNote[referenceHeader] = newBody;

    postData("/update-body", updatedNote, () => {});

    saveNote.endFunction()
};