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
    const fullPath = "https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/dummy.js";
    const script = document.createElement('script');
    let st ='';
    for (let scriptPath of ["face-generator", "name-generator", "input-box"]) {
        
        st += await getScript(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/${scriptPath}.js`);
    }
    script.textContent += st;

    document.body.appendChild(script);
    for (let stylePath of ["input-box"]) {
        await loadStyle(`https://raw.githubusercontent.com/JassSidhu412/html-project/main/styles/${scriptPath}.css`);
    }
}
