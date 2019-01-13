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

    console.log(updateData);

    $.ajax({
          type: "POST",
          url: "/update-positions",
          data: updateData,
          success: null,
          dataType: 'json'
    });
};

dragula(Array.from(document.getElementsByClassName('grid-item'))).on('drop', sendNewPositions);


let loadNotes = function() {
    loadNotes.subtopic = event.target.dataset.subtopicLink;

    $.ajax({
        dataType: "json",
        url: '/subtopic/' + loadNotes.subtopic,
        success: function (response) {
            let notes = response;
            let gridItems = document.getElementsByClassName('grid-item');

            for (let i = 0; i < Object.keys(notes).length; i++) {
                neededGridItem = gridItems[notes['note' + i]['position']];
                neededGridItem.innerHTML = '<div class="note"><p>' + notes['note' + i]['header'] + '</p></div>';
                neededGridItem.firstChild.dataset.header = notes['note' + i]['header'];
                neededGridItem.firstChild.dataset.body = notes['note' + i]['body'];
                neededGridItem.firstChild.addEventListener('click', openNote)
            }
        }
    });
};


let openNote = function() {
    removeEditingNote();
    let clickedNote = event.target.parentElement;
    let clickedNoteText = event.target;

    let openedHeader = document.getElementById('opened-header').getElementsByTagName('p')[0];
    openedHeader.textContent = clickedNote.dataset.header ? clickedNote.dataset.header : clickedNoteText.dataset.header;

    let openedBody = document.getElementById('opened-body').getElementsByTagName('textarea')[0];
    openedBody.value = clickedNote.dataset.body ? clickedNote.dataset.body : clickedNoteText.dataset.body;
    console.log(clickedNote.dataset.body ? clickedNote.dataset.body : clickedNoteText.dataset.body);

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
    removeEditingNote()
};

let inicialisesubtopicButtons = function() {
    let subtopicButtons = document.getElementsByClassName('subtopic');
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


inicialisesubtopicButtons();
inicialiseOpenedNote()