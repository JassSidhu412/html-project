function getScripts(){
  return [
  'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/face-generator.js',
    'https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/name-generator.js'
  ];
}
function test(){
  alert("It works");
}

async function loadStyle(url) {
    const response = await fetch(url);
    const styleContent = await response.text();
    const style = document.createElement('style');
    script.textContent = styleContent;
    document.head.appendChild(style);
}
async function loadAllAssets() {
    const fullPath = "https://raw.githubusercontent.com/JassSidhu412/html-project/main/scripts/dummy.js";

    for (const scriptPath of ["face-generator", "name-generator","input-box"]) {
        await loadScript(fullpath.replace('dummy', scriptPath));
    }
    for (const stylePath of ["input-box"]) {
        await loadStyle(fullpath.replace('scripts/dummy.js', 'styles/' + scriptPath + '.css'));
    }
}
