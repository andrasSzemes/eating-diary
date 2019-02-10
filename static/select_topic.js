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

            const subtopicsContainer = document.querySelector('#subtopics-container');
            subtopicsContainer.style.transitionDelay = '0s';
            subtopicsContainer.style.transitionDuration = '0.1s';
            subtopicsContainer.style.transform = 'translate(-100%, 0)';
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

            const topic = iconElement.dataset.topicName;
            postData('/subtopic', topic, placeRelatedSubtopics);
        }
    })
}

function postData(url, data, callback) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then(response => callback(response));
}

const placeRelatedSubtopics = function (subtopics) {
    const subtopicsContainer = document.querySelector('#subtopics-container');
    subtopicsContainer.innerHTML = '';
    subtopicsContainer.style.transitionDelay = '0.2s';
    subtopicsContainer.style.transitionDuration = '0.2s';
    subtopicsContainer.style.transform = 'translate(0, 0)';

    for (const subtopic of subtopics) {
        const subtopicElement = document.createElement('div');
        subtopicElement.classList.add('subtopic');
        subtopicElement.dataset.subtopicLink = subtopic.subtopic_name_as_link;
        subtopicElement.innerText = subtopic.subtopic_name;

        subtopicsContainer.appendChild(subtopicElement)
    }
}