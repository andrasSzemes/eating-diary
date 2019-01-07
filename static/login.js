let messageAppear = function() {
    let message = document.getElementsByTagName(messageAppear.tag)[messageAppear.index];
    let letters = message.getElementsByTagName("span");
    for (let i = 0; i < letters.length; i++) {
        letters[i].style.transitionDelay = (messageAppear.prevDelay + messageAppear.revealSpeed * i).toString() + 's';
        letters[i].style.opacity = '1';
    }
    messageAppear.prevDelay += letters.length * messageAppear.revealSpeed
};

let pageAppear = function() {
    messageAppear.revealSpeed = 0.05;
    messageAppear.prevDelay=0;
    messageAppear.tag = 'h1'; messageAppear.index = 0;
    messageAppear();
    messageAppear.tag = 'p'; messageAppear.index = 0; messageAppear.revealSpeed = 0.03;
    messageAppear();
    messageAppear.tag = 'p'; messageAppear.index = 1;
    messageAppear();

    setTimeout(function() {document.getElementsByTagName('input')[0].select()},3000);
};

messageAppear.tag = 'h1'; messageAppear.index = 0;
window.addEventListener('load', pageAppear);

