let logo = document.getElementsByClassName("box")[0];
logo.style.opacity = 1;

let sendNewPositions = function() {
    let gridItems = document.getElementsByClassName('grid-item');

    let updateData = {};
    for (let i=0; i < gridItems.length; i++) {
        if (gridItems[i].firstElementChild) {
            updateData[gridItems[i].firstElementChild.firstElementChild.textContent] = i
        }
    }

    $.ajax({
          type: "POST",
          url: "/update-positions",
          data: updateData,
          success: null,
          dataType: 'json'
    });
};

dragula(Array.from(document.getElementsByClassName('grid-item'))).on('drop', sendNewPositions);

let emptyAllPlaces = function() {
    let gridItems = document.getElementsByClassName('grid-item');

    let gridItem = '';
    for (gridItem of gridItems) {
        gridItem.innerHTML = '';
    }
};

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

let createNewNotePlace = function(GridItem) {
    GridItem.removeAttribute('hidden');
    GridItem.innerHTML = '';

    addClassForHover(GridItem, 'new-note');

    GridItem.addEventListener('click', showEmptyHeader);
    GridItem.addEventListener('keydown', addNewNoteHeader)
};

let showEmptyHeader = function() {
    event.target.innerHTML = '<div class="note"><textarea class="new-note-textarea" spellcheck="false"></textarea></div>';
    let input = event.target.getElementsByTagName('textarea')[0];
    input.focus();
    event.target.removeEventListener('click', showEmptyHeader)
};

// This was the worst part, first time to have problem with time =)
let addNewNoteHeader = function(event) {
    if (event.key == 'Enter') {
        let newHeader = event.target.value;
        sendingData = {};
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

let hideUnnecessaryGridItems = function(startIndex, endIndex) {
    let gridItems = document.getElementsByClassName('grid-item');
    for (let i=startIndex; i < endIndex; i++) {
        gridItems[i].setAttribute('hidden', '')
    }
};

let openNote = function() {
    removeEditingNote();
    let clickedNote = event.target.parentElement;
    let clickedNoteText = event.target;

    let openedHeader = document.getElementById('opened-header').getElementsByTagName('p')[0];
    openedHeader.textContent = clickedNote.dataset.header ? clickedNote.dataset.header : clickedNoteText.dataset.header;

    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.value = clickedNote.dataset.body ? clickedNote.dataset.body : clickedNoteText.dataset.body;

    let openedNote = document.getElementById('opened-note');
    openedNote.removeAttribute('hidden')
};

let closeOpenedNote = function() {
    let openedNote = document.getElementById('opened-note');
    openedNote.setAttribute('hidden', '');
    removeEditingNote()
};

let removeEditingNote = function() {
    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.style.boxShadow = '';
    openedBody.setAttribute('readonly', '');
    openedBody.blur();

    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveButton.setAttribute('hidden', '');

    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.removeAttribute('hidden')
};

let editNote = function() {
    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.removeAttribute('readonly');
    openedBody.style.boxShadow = '0px 0px 74px -7px #a89582';

    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.setAttribute('hidden', '');

    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveButton.removeAttribute('hidden')
};

let saveNote = function() {
    removeEditingNote();

    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    let newBody = openedBody.value;
    let openedHeader = document.getElementById('opened-header').getElementsByTagName('p')[0];
    let referenceHeader = openedHeader.textContent;

    let updatedNote = {};
    updatedNote[referenceHeader] = newBody;

    $.ajax({
          type: "POST",
          url: "/update-body",
          data: updatedNote,
          success: null,
          dataType: 'json'
    });

    loadNotes()
};

let inicialisesubtopicButtons = function() {
    let subtopicButtons = document.getElementsByClassName('subtopic');
    let subtopicButton = '';
    for (subtopicButton of subtopicButtons) {
        subtopicButton.addEventListener('click', loadNotes)
    }
};

let inicialiseOpenedNote = function() {
    let closeButton = document.getElementById('opened-note').getElementsByTagName('img')[0];
    closeButton.addEventListener('click', closeOpenedNote);

    let editButton = document.getElementById('opened-note').getElementsByTagName('img')[1];
    editButton.addEventListener('click', editNote);

    let saveButton = document.getElementById('opened-note').getElementsByTagName('img')[2];
    saveButton.addEventListener('click', saveNote)
};


window.addEventListener('load', function () {
    inicialisesubtopicButtons();
    inicialiseOpenedNote();
});