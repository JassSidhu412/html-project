let faceCount=0;
let hairColors = [
    "#000000", // Black
    "#4B3621", // Brown
    "#FFD700", // Blonde
    "#FF4500", // Red
    "#0000FF", // Blue
    "#008000", // Green
    "#FFC0CB", // Pink
    "#800080", // Purple
    "#FFFFFF", // White
    "#808080", // Gray
    "#C0C0C0", // Silver
    "#FFA500", // Orange
    "#008080", // Teal
    "#FF99CC"  // Multicolor (example: pink-dominant)
];

let eyesColors = [
    "#000000", // Black
    "#4B3621", // Brown
    "#0000FF", // Blue
    "#008000", // Green
    "#FF0000", // Red
    "#FFD700", // Gold
    "#C0C0C0", // Silver
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#808080", // Gray
    "#FFFF00", // Yellow
    "#FFA500", // Orange
    "#008080", // Teal
    "#FF99CC"  // Multicolor (example: pink-dominant)
];

function getFace(w, h,gender, hair,backhair, hairColor, eyesColor) {
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

    // Parse hair and eyes colors
    const hair = parseColor(hairColors[hairColor]);
    const eyes = parseColor(eyesColors[eyesColor]);

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
            <image id="layer3" x="0" y="0" width="512" height="512" 
                   href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/ChLayers0003.png"/>
            <image id="layer2" x="0" y="0" width="512" height="512" 
                   href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/ChLayers0002.png"
                   filter="url(#${eyesFilterId})"/>
            <image id="layer1" x="0" y="0" width="512" height="512" 
                   href="https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/character/ChLayers0001.png"
                   filter="url(#${hairFilterId})"/>
        </svg>`;
}
