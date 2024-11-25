let faceCount = 0;
let hairColors = ['#000000', '#4B3621', "#FFD700", "#FF4500", "#0000FF", "#008000", "#FFC0CB", "#800080", "#FFFFFF", "#808080", "#C0C0C0", "#FFA500", "#008080"];

let eyesColors = ["#000000", "#4B3621", "#0000FF", "#008000", "#FF0000", "#FFD700", "#C0C0C0", "#800080", "#FFC0CB", "#808080", "#FFFF00", "#FFA500", "#008080"];
let femaleHairCount = 1;
let femaleBackHairCount = 1;
let maleHairCount = 1;

function initSVG() {
    let svg = document.createElement('svg');
    femaleHairCount = Math.floor(getWidth(getImagePath('character/female.hair')) / 512);
    femaleBackHairCount = Math.floor(getWidth(getImagePath('character/female.backhair')) / 512);
    maleHairCount = Math.floor(getWidth(getImagePath('character/male.hair')) / 512);
    let all = [
        getPattren(getWidth(getImagePath('character/female.face'), 512, 0, 'female-face-img')),
        getPattren(getWidth(getImagePath('character/female.eyes'), 512, 0, 'female-eyes-img')),
        getPattren(getWidth(getImagePath('character/male.face'), 512, 0, 'male-face-img')),
        getPattren(getWidth(getImagePath('character/male.eyes'), 512, 0, 'male-eyes-img'))
    ];
    for (let i = 0; i < femaleHairCount; i++) all.push(getWidth(getImagePath('character/female.hair', 512, i), 'female-hair-img' + i));
    for (let i = 0; i < femaleBackHairCount; i++) all.push(getWidth(getImagePath('character/female.backhair'), 512, i));
    for (let i = 0; i < maleHairCount; i++) all.push(getWidth(getImagePath('character/male.hair'), 512, i));
    svg.innerHTML = `<defs>${all.join()}</defs>`;
}
initSVG();
function getWidth(url) {
    var img = new Image();
    img.src = url;
    img.style.position = "absolute";
    img.style.left = -9999; // Image width must not exceed 9999 pixels
    document.body.appendChild(img);
    var imgHeight = img.height;
    var imgWidth = img.width;
    //alert("image height = " + imgHeight + ", image width = " + imgWidth);
    document.body.removeChild(img);
    return imgWidth;
}

function getImagePath(name) {
    return `https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/${name}.png`;
}

function getPattren(url, size, index, id) {
    let sz = size * index;
    return `<pattern id="${id}" patternUnits="userSpaceOnUse" height="${size}" width="${size}">
          <image x="-${sz}" y="0" height="${size}"  xlink:href="${url}"></image>
        </pattern>`;
}

function getFace(w, h, gender, frontHair, backHair, hairColor, eyesColor) {
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
    const hair = parseColor(hairColors[hairColor]);
    const eyes = parseColor(eyesColors[eyesColor]);
    const hairStyle = 512 * frontHair;
    const backHairStyle = 512 * backHair;

    // Generate unique IDs for filters
    faceCount++;
    const hairFilterId = `hairFilter${faceCount}`;
    const eyesFilterId = `eyesFilter${faceCount}`;


    return `<svg width="${w}" height="${h}" viewBox="0 0 512 512">
            <defs>
                <filter id="${hairFilterId}">
                    <feColorMatrix type="matrix" values="${hair.r} 0 0 0 0
                                                         0 ${hair.g} 0 0 0
                                                         0 0 ${hair.b} 0 0
                                                         0 0 0 1 0"/>
                </filter>
                <filter id="${eyesFilterId}">
                    <feColorMatrix type="matrix" values="${eyes.r} 0 0 0 0
                                                         0 ${eyes.g} 0 0 0
                                                         0 0 ${eyes.b} 0 0
                                                         0 0 0 1 0"/>
                </filter>
            </defs>
            <rect width="512" height="512" fill="url(#${gender}-backhair-img0)" filter="url(#${hairFilterId})"/>
            <rect width="512" height="512" fill="url(#${gender}-eyes-img)" filter="url(#${eyesFilterId})"/>
            <rect width="512" height="512" fill="url(#${gender}-face-img)" />
            <rect width="512" height="512" fill="url(#${gender}-hair-img0)" filter="url(#${hairFilterId})"/>
           </svg>`;
    /* 
                <image x="0" y="0" width="512" height="512" 
                       href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/${gender}.backhair.png"
                       filter="url(#${hairFilterId})"/>
                <image x="0" y="0" width="512" height="512" 
                       href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/${gender}.eyes.png"
                       filter="url(#${eyesFilterId})"/>
                <image x="0" y="0" width="512" height="512" 
                       href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/${gender}.face.png"/>
                <image x="0" y="0" width="512" height="512" 
                       href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/${gender}.hair.png"
                       filter="url(#${hairFilterId})"/>
            </svg>`;*/
}
