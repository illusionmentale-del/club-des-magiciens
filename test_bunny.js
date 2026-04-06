const crypto = require('crypto');
function getUrl(videoId) {
    const libraryId = "603266";
    const tokenKey = "";
    if (!tokenKey) {
        return `https://player.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true&primaryColor=a855f7`;
    }
}
console.log(getUrl("4ffb5798-7e2d-4c1c-8437-fb0546310468"));
