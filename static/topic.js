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
                neededGridItem.dataset.header = notes['note' + i]['header'];
                neededGridItem.dataset.gridItem = notes['note' + i]['grid-item'];
            }
        }
    });
};


let subtopicButtons = document.getElementsByClassName('subtopic');
for (subtopicButton of subtopicButtons) {
    subtopicButton.addEventListener('click', loadNotes)
}