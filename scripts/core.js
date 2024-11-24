async function loadStyle(url) {
    const response = await fetch(url);
    const styleContent = await response.text();
    const style = document.createElement('style');
    script.textContent = styleContent;
    document.head.appendChild(style);
}
async function fetchFile(url) {
    const response = await fetch(url);
    return await response.text();
}
async function loadAllAssets() {
    let scriptAssets = ["face-generator", "name-generator", "input-box"];
    let styleAssets = ["input-box"];
    for (let scriptPath of scriptAssets) {
        const script = document.createElement('script');
        script.textContent = await fetchFile(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
        document.body.appendChild(script);
    }
    for (let stylePath of styleAssets) {
        await loadStyle(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${stylePath}.css`);
    }
}
