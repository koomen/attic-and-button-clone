//Setup default project for www.atticandbutton.us
const COOKIE_EXPIRATION = 365,
    PROJECT_COOKIE_NAME = 'optimizelyProjectId',
    PROJECT_PARAMETER = 'pid',
    DEFAULT_PROJECT = '22138931278',
    SDKKEY_PARAMETER = 'sdkkey',
    DEFAULT_SDKKEY = '3DHbmsE3z3y3Fb1qmexbA',
    SDKKEY_COOKIE_NAME = 'optimizelySdkKey',
    USERID_PARAMETER = 'userid',
    USERID_COOKIE_NAME = 'optimizelyUserId',
    DEFAULT_USERID = 'user123';


//Helper to get cookie value
function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

//Helper to get query param value
function getParameterByName(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
}

//Helper to return snippet url
function getSnippetURL(projectId) {
    var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';

    return protocol + '//cdn.optimizely.com/js/' + projectId + '.js';
}

//Helper to set cookie
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
}

// Initialize Optimizely Web
function initOptimizelyWeb() {
    var projectIdParam = getParameterByName(PROJECT_PARAMETER);

    if (projectIdParam) {
        setCookie(PROJECT_COOKIE_NAME, projectIdParam, COOKIE_EXPIRATION);
    }

    var projectId = getCookie(PROJECT_COOKIE_NAME) || DEFAULT_PROJECT;

    var snippetURL = getSnippetURL(projectId);

    //Dynamically writing snippet
    document.write('<scr' + 'ipt src="' + snippetURL + '"></scr' + 'ipt>');

    // Set log level to verbose
    window['optimizely'] = window['optimizely'] || [];
    window['optimizely'].push({ type: 'log', level: 'info' });

    window["optimizely"].push({
        "type": "addListener",
        "filter": {
            "type": "lifecycle",
            "name": "initialized"
        },
        "handler": function (event) {
            var loadedProjectId = window["optimizely"].get("data").projectId;
            console.log(`Optimizely Web client with projectId ${loadedProjectId} is initialized`);
        }
    });
}

// Initialize Optimizely User Context
function initOptimizelyUserContext(optimizelyClient) {
    var userIdParam = getParameterByName(USERID_PARAMETER);

    if (userIdParam) {
        setCookie(USERID_COOKIE_NAME, userIdParam, COOKIE_EXPIRATION);
    }

    var userId = getCookie(USERID_COOKIE_NAME) || DEFAULT_USERID;
    var attrs = {};

    window.userContext = optimizelyClient.createUserContext(userId, attrs);
}

// Initialize Optimizely Full Stack
function initOptimizelyFullStack() {
    var sdkKeyParam = getParameterByName(SDKKEY_PARAMETER);

    if (sdkKeyParam) {
        setCookie(SDKKEY_COOKIE_NAME, sdkKeyParam, COOKIE_EXPIRATION);
    }

    var sdkKey = getCookie(SDKKEY_COOKIE_NAME) || DEFAULT_SDKKEY;
    window.optimizelyClient = optimizelySdk.createInstance({
        sdkKey: sdkKey
    });

    window.optimizelyClient.onReady().then(() => {
        var loadedSdkKey = window.optimizelyClient.getOptimizelyConfig().sdkKey;
        console.log(`Optimizely Full Stack client with sdkKey ${loadedSdkKey} is initialized`);

        initOptimizelyUserContext(window.optimizelyClient);

        if (window.fullStackOnReady) {
            window.fullStackOnReady();
        } else {
            console.error("window.fullStackOnReady should be called but assets/custom.js hasn't loaded yet");
        }
    })
}

initOptimizelyWeb();
initOptimizelyFullStack();
