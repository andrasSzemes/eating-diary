import {postData} from "./utility.js";
import {getNotesForSubtopic} from "./notePlacement.js";

export const makeNewSubtEditable = function (subtPlace) {
    subtPlace.style.backgroundColor = '#8e7e6d';
    subtPlace.setAttribute('contenteditable', 'true');
    subtPlace.focus()
};

export const makeNewSubtDisappear = function (subtPlace) {
    subtPlace.textContent = '';
    subtPlace.style.backgroundColor = '';
    subtPlace.removeAttribute('contenteditable');
    subtPlace.blur()
};

export const createNewSubtPlace = function () {
    const newSubtopicPlace = document.createElement('div');
    newSubtopicPlace.id = 'new-subtopic-place';
    newSubtopicPlace.setAttribute('spellcheck', 'false');
    newSubtopicPlace.setAttribute('hidden', '');

    return newSubtopicPlace
};

export const addNewSubtopic = function(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        const newSubtopicName = event.target.textContent;
        const sendingData = {};
        sendingData['subtopic_name'] = newSubtopicName;
        sendingData['topic_name'] = document.querySelector('.place-icon-top-left').dataset.topicName;
        sendingData['subtopic_name_as_link'] = newSubtopicName.toLowerCase().replace(' ', '-');

        postData('/add-new-subtopic', sendingData, (response) => {
            if (response.OK) {
                placeNewSubtopic(sendingData);
                makeNewSubtDisappear(event.target)
            }
        });
    }
};

const placeNewSubtopic = function (subtopicData) {
    const subtopicElement = document.createElement('div');
    subtopicElement.classList.add('subtopic');
    subtopicElement.dataset.subtopicLink = subtopicData.subtopic_name_as_link;
    subtopicElement.innerText = subtopicData.subtopic_name;
    subtopicElement.addEventListener('click', getNotesForSubtopic);

    const subtopicsContainer = document.querySelector('#subtopics-container');
    const newSubtopicPlace = document.querySelector('#new-subtopic-place');
    subtopicsContainer.insertBefore(subtopicElement, newSubtopicPlace);
};