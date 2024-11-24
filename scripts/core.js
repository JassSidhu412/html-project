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
    for (const scriptPath of ["face-generator", "name-generator", "input-box"]) {
        script.textContent += await getScript(fullPath.replace('dummy', `${scriptPath}`));
    }

    document.body.appendChild(script);
    for (const stylePath of ["input-box"]) {
        await loadStyle(fullPath.replace(`scripts/dummy.js', 'styles/${scriptPath}.css`));
    }
}
