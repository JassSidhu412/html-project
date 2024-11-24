function getScripts() {
    return [
        'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/face-generator.js',
        'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/name-generator.js'
    ];
}

function test() {
    alert("It works");
}

async function loadStyle(url) {
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
    const script = document.createElement('script');
    let st ='';
    let scripts=["face-generator", "name-generator", "input-box"];
    for (let scriptPath of scripts) {
        
        st += await getScript(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
    }
    script.textContent += st;

    document.body.appendChild(script);
    let styles =["input-box"];
    for (let stylePath of styles) {
        await loadStyle(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${scriptPath}.css`);
    }
}
