const iconRefs = ['#JS-logo', '#git-logo', '#UIUX-logo', '#security-logo', '#note-logo', '#algorithm-logo', '#sql-logo'];

const iconElements = [];
for (const iconRef of iconRefs) {
    iconElements.push(document.querySelector(iconRef))
}

const chooseSubjectText = document.querySelector('h1');

for (const iconElement of iconElements) {
    iconElement.addEventListener('click', () => {
        if (iconElement.classList.contains('place-icon-top-left')) {
            iconElement.classList.remove('place-icon-top-left');
            chooseSubjectText.style.opacity = 1;

            for (const iconElem of iconElements) {
                if (iconElement !== iconElem) {
                    iconElem.removeAttribute('hidden');
                    iconElem.classList.remove('inicial-icon-height');
                    setTimeout(() => {
                        iconElem.style.opacity=0.7
                    }, 50)
                }
            }
        } else {
            iconElement.classList.add('place-icon-top-left');
            chooseSubjectText.style.opacity = 0;

            for (const iconElem of iconElements) {
                if (iconElement !== iconElem) {
                    iconElem.style.opacity=0;
                    iconElem.classList.add('inicial-icon-height');
                    setTimeout(() => {
                        iconElem.setAttribute('hidden', '')
                    }, 400)
                }
            }
        }
    })
}