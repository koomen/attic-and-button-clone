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

    const dialogDecision = window.userContext.decide('dummy_modal_dialog');

    if (dialogDecision['enabled']) {
        let modal = new FancyModal({
            modalType: dialogDecision.variables['modalType'],
            overlay: dialogDecision.variables['overlay'],
            className: dialogDecision.variables['className'],
            imageSrc: dialogDecision.variables['imageSrc'],
            okBtnTxt: dialogDecision.variables['okBtnTxt'],
            koBtnTxt: dialogDecision.variables['koBtnTxt'],
        });
        modal.open();
    }



}