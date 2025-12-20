function createKanjiSVG(character) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="500" height="500" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g id="layer1">
    <text
       xml:space="preserve"
       style="font-size:525.415px;font-family:Impact;-inkscape-font-specification:Impact;text-align:start;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#a72dd1;fill-opacity:1;stroke-width:1.50001;stroke-linecap:round;stroke-miterlimit:12"
       x="-11.68123"
       y="444.84726">
      <tspan x="-11.68123" y="444.84726" style="stroke-width:1.50001">${character}</tspan>
    </text>
  </g>
</svg>`;
  }

  // Existing function, now works with SVG data URL
  async function getPieces(svgDataUrl) {
    const img = new Image();
    img.src = svgDataUrl;

    return new Promise((resolve) => {
      img.onload = () => {
        const width = 500;
        const height = 500;
        const pieceSize = width / 3;

        const pieces = [];

        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
              img,
              col * pieceSize, row * pieceSize, pieceSize, pieceSize,
              0, 0, pieceSize, pieceSize
            );

            const pieceImg = new Image();
            pieceImg.src = canvas.toDataURL('image/png');
            pieceImg.className = 'piece';
            pieces.push(pieceImg);
          }
        }

        resolve(pieces);
      };
    });
  }
