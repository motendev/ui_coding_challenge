export default function getJsonViaUrl(url)
{
    if(typeof(url) !== typeof(''))
        return;

    return fetch(url).then(res => res.json())
}