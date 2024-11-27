async function fetchFile(url) {
    const response = await fetch(url);
    return await response.text();
}
async function loadAllAssets() {
    let scriptAssets = ['image-lib',"face-generator", "name-generator", "input-box"];
    let styleAssets = ["style","input-box"];

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
}
function parseColor(color) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return {r, g, b};
}
