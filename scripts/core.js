async function fetchFile(url) {
    const response = await fetch(url);
    return await response.text();
}
window.onbeforeunload = function() {
    return 'Want to leave?';
}

function getRandom(max, min) {
    if (!min) min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseColor(color) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return {
        r,
        g,
        b
    };
}
let uniqueIdCounter = 0;

function getUniqueID() {
    uniqueIdCounter++;
    return 'id-' + uniqueIdCounter;
}
async function loadAllAssets() {
    let scriptAssets = ['image-lib', 'home-window', "face-generator", "name-generator", "input-box", "list-view"];
    let styleAssets = ["style", 'home-window', "input-box", "list-view"];
    let gameAssets = ['isekai/main.js'];

    for (let scriptPath of scriptAssets) {
        const script = document.createElement('script');
        script.textContent = await fetchFile(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
        document.body.appendChild(script);
    }

    for (let stylePath of styleAssets) {
        const style = document.createElement('style');
        style.textContent = await fetchFile(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${stylePath}.css`);
        document.head.appendChild(style);
    }
    for (let scriptPath of gameAssets) {
        const script = document.createElement('script');
        script.textContent = await fetchFile(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/games/${scriptPath}`);
        document.body.appendChild(script);
    }
}
