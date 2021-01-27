export default function getJsonViaUrl(url) {
    if (typeof (url) !== typeof (''))
        return;

    return fetch(url).then(res => res.json()).then(sleep(1000));
}

function sleep(ms) {
    return function (func) { return new Promise(resolve => setTimeout(() => resolve(func), ms)); };
}