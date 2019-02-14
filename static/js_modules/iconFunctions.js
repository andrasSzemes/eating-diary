import {hide, reveal, postData, show} from "./utility.js";
import {makeSubtopicButtonsWork} from './notePlacement.js';
import {createNewSubtPlace, makeNewSubtEditable, makeNewSubtDisappear, addNewSubtopic} from "./newSubtopic.js";


const placeNewSubtopicPlace = function () {
    const newSubtopicPlace = createNewSubtPlace();

    newSubtopicPlace.addEventListener('click', () => makeNewSubtEditable(newSubtopicPlace));
    newSubtopicPlace.addEventListener('blur', () => makeNewSubtDisappear(newSubtopicPlace));
    newSubtopicPlace.addEventListener('keydown', addNewSubtopic);

    document.querySelector('#subtopics-container').appendChild(newSubtopicPlace)
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

const populateSubtopicsContainer = function (subtopics) {
    placeRelatedSubtopics(subtopics);
    placeNewSubtopicPlace()
};