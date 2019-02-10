import {changeToTopicsLayout, changeToNotesLayout} from './js_modules/iconFunctions.js'

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

handleIconClick()
