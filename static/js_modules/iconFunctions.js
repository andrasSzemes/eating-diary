import {hide, reveal, postData, show} from "./utility.js";
import {makeSubtopicButtonsWork, getNotesForSubtopic} from './notePlacement.js';


const makeNewSubtEditable = function (subtPlace) {
    subtPlace.style.backgroundColor = '#8e7e6d';
    subtPlace.setAttribute('contenteditable', 'true');
    subtPlace.focus()
};

const makeNewSubtDisappear = function (subtPlace) {
    subtPlace.textContent = '';
    subtPlace.style.backgroundColor = '';
    subtPlace.removeAttribute('contenteditable');
    subtPlace.blur()
};

const createNewSubtPlace = function () {
    const newSubtopicPlace = document.createElement('div');
    newSubtopicPlace.id = 'new-subtopic-place';
    newSubtopicPlace.setAttribute('spellcheck', 'false');
    newSubtopicPlace.setAttribute('hidden', '');

    return newSubtopicPlace
};

const addNewSubtopic = function(event) {
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

const placeNewSubtopicPlace = function () {
    const newSubtopicPlace = createNewSubtPlace();

    newSubtopicPlace.addEventListener('click', () => makeNewSubtEditable(newSubtopicPlace));
    newSubtopicPlace.addEventListener('blur', () => makeNewSubtDisappear(newSubtopicPlace));
    newSubtopicPlace.addEventListener('keydown', addNewSubtopic);

    document.querySelector('#subtopics-container').appendChild(newSubtopicPlace)
};

const populateSubtopicsContainer = function (subtopics) {
    placeRelatedSubtopics(subtopics);
    placeNewSubtopicPlace()
};

const placeRelatedSubtopics = function(subtopics) {
    const subtopicsContainer = document.querySelector('#subtopics-container');
    subtopicsContainer.innerHTML = '';
    subtopicsContainer.style.transitionDelay = '0.3s';
    subtopicsContainer.style.transitionDuration = '0.2s';
    subtopicsContainer.style.transform = 'translate(40px, 0)';

    for (const subtopic of subtopics) {
        const subtopicElement = document.createElement('div');
        subtopicElement.classList.add('subtopic');
        subtopicElement.dataset.subtopicLink = subtopic.subtopic_name_as_link;
        subtopicElement.innerText = subtopic.subtopic_name;

        subtopicsContainer.appendChild(subtopicElement)
    }

    makeSubtopicButtonsWork()
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

const removeRelatedSubtopics = function() {
    const subtopicsContainer = document.querySelector('#subtopics-container');
    subtopicsContainer.style.transitionDelay = '0s';
    subtopicsContainer.style.transitionDuration = '0.1s';
    subtopicsContainer.style.transform = 'translate(-100%, 0)';
};

export const changeToTopicsLayout = function(iconElement, iconElements) {
    document.querySelector('#right-side').setAttribute('hidden', '');
    const chooseSubjectText = document.querySelector('h1');
    show(chooseSubjectText);

    iconElement.classList.remove('place-icon-top-left');

    for (const iconElementB of iconElements) {
        if (iconElement !== iconElementB) {
            reveal(iconElementB);
            iconElementB.classList.remove('pseudo-remove-logos');
            show(iconElementB, 0.7)
        }
    }

    removeRelatedSubtopics()
};

export const changeToNotesLayout = function(iconElement, iconElements) {
    const chooseSubjectText = document.querySelector('h1');
    show(chooseSubjectText, 0);

    iconElement.classList.add('place-icon-top-left');

    for (const iconElementB of iconElements) {
        if (iconElement !== iconElementB) {
            iconElementB.classList.add('pseudo-remove-logos');
        }
    }

    const chosenTopic = iconElement.dataset.topicName;
    postData('/subtopic', chosenTopic, populateSubtopicsContainer);
};