let scriptAssets = ["face-generator", "name-generator", "input-box"];
let styleAssets = ["input-box"];

function getScripts() {
    return [
        'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/face-generator.js',
        'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/name-generator.js'
    ];
}

function test() {
    alert("It works");
}

async function loadStyles(url) {
    const response = await fetch(url);
    const styleContent = await response.text();
    const style = document.createElement('style');
    script.textContent = styleContent;
    document.head.appendChild(style);
}
async function getScript(url) {
    const response = await fetch(url);
    const scriptContent = await response.text();
    return scriptContent;
}
async function loadAllAssets() {
    const scriptTag = document.createElement('div');
    let st ='';
    for (let scriptPath of scriptAssets) {
        
        st += await getScript(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
    }
    scriptTag.textContent = st;
scriptTag.id="hello";

    document.body.appendChild(scriptTag);
    
    for (let stylePath of styleAssets) {
        await loadStyle(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${scriptPath}.css`);
    }
}
