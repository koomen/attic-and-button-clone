// Lifted from Yong Wang's answer on 
// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

window.fullStackOnReady = () => {
    /*waitForElm(".btn.hero__cta").then((elm) => {
        elm.style.backgroundColor = "red";
    });*/

    let modal = new FancyModal({
        modalType: 'info',
        overlay: 'dark',
        className: 'fade-and-zoom',
        content: 'Check out this modal dialog',
        okBtnTxt: 'Ok',
        koBtnTxt: 'Cancel'
    });
    modal.open();
}