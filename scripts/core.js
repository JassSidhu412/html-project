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
    const scriptTag = document.createElement('script');
    let st = '';
    for (let scriptPath of scriptAssets) {

        st += await fetchFile(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
    }
    scriptTag.textContent = st;
    scriptTag.id = "hello";

    document.body.appendChild(scriptTag);

    for (let stylePath of styleAssets) {
        await loadStyle(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${scriptPath}.css`);
    }
}
