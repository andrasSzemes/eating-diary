import {hide, reveal, isEnterPressed, postData} from "./utility.js";

export const showHideLoginModal = function() {
    document.querySelector('#sign-in-icon').addEventListener('click', () => {
        reveal(document.querySelector('#login-modal-container'));
    });
    document.querySelector('#filter').addEventListener('click', () => {
        hide(document.querySelector('#login-modal-container'))
    })
};

export const handleUserInput = function () {
    const inputField = document.querySelector('#authorization-input');

    inputField.addEventListener('keydown', () => {
        isEnterPressed(event.key, () => {
            if (inputField.dataset.username) {
                inputField.blur();
                const userData = {'username' : inputField.dataset.username,
                                  'password' : inputField.value};
                restoreInputField(inputField);
                inputField.placeholder = 'A moment please';
                delete inputField.dataset.username;

                postData('/authenticate', userData, handleServerResponse);
            } else {
                inputField.dataset.username = inputField.value;
                askForPassword(inputField)
            }
        })
    })
};

const handleServerResponse = function(response) {
    const inputField = document.querySelector('#authorization-input');

    if (response.OK) {
        inputField.placeholder = 'Welcome back!';
        setTimeout(() => {
            hide(document.querySelector('#login-modal-container'));
            hide(document.querySelector('#sign-in-icon'))
        }, 2000)
    } else {
        inputField.placeholder = 'I do not recognise you';
        setTimeout(() => inputField.placeholder = 'Who are you?', 2000);
    }
};

const askForPassword = function(inputField) {
    inputField.value = '';
    inputField.type = 'password';
    inputField.placeholder = 'Password please';
};

const restoreInputField = function(inputField) {
    inputField.value = '';
    inputField.type = '';
}