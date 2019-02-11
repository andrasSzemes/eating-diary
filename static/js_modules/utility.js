export function postData(url, data, callback) {
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

export function show(domElement, opacity=1) {
    domElement.style.opacity = opacity.toString()
}

export function hide(domElement) {
    domElement.setAttribute('hidden', '')
}

export function reveal(domElement) {
    domElement.removeAttribute('hidden')
}

export function isEnterPressed(key, callback) {
    if (event.key === 'Enter') {
        callback()
    }
}