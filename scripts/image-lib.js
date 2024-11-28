let IconGen = {
    dir: 'https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/'
};
   IconGen.create= function(size, id, images, style, bg) {
        let def = '';
        let imgs = '';
        for (let image of images) {
            if (typeof(image) == 'string') imgs += `<image width="512" height="512" href="${IconGen.dir+image}"/>`;
            else {
                let img = IconGen.dir + image.url;
                if (image.overlay) {
                    overlayId = getUniqueID();
                    let c = parseColor(image.overlay);
                    def += `<filter id="overlay${overlayId}">
                    <feColorMatrix type="matrix" values="${c.r} 0 0 0 0 0 ${c.g} 0 0 0 0 0 ${c.b} 0 0 0 0 0 1 0"/>
                </filter>`;
                    imgs += `<image width="512" height="512" href="${img}" filter="url(#overlay${overlayId})"/>`;
                } else imgs += `<image width="512" height="512" href="${img}"/>`;
            }
        }
        let background = '';
        if (def != '') def = '<def>' + def + '</def>';
        if (bg) background = `<rect width="512" height="512" fill="${bg}" />`;
        let Id='';
        if(id) Id=`id="${id}" `;
        return `<svg ${Id}width="${size}" height="${size}" style="${style ??= ''}" viewBox="0 0 512 512">${def+imgs+background}</svg>`;
    }
IconGen.createAnim = function(w, h, fps, images, end) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", w);
            svg.setAttribute("height", h);
            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

            const frameCount = images.length;
            const frameDuration = 1000 / fps;

            // Create and append image elements
            images.forEach((src, index) => {
                const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                img.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
                img.setAttribute("width", w);
                img.setAttribute("height", h);
                img.setAttribute("opacity", index === 0 ? "1" : "0");
                svg.appendChild(img);
            });

            // Animation function
            let currentFrame = 0;
            let intervalId;

            function animate() {
                const frames = svg.children;
                frames[currentFrame].setAttribute("opacity", "0");
                currentFrame = (currentFrame + 1) % frameCount;
                frames[currentFrame].setAttribute("opacity", "1");

                if (end === true && currentFrame === frameCount - 1) {
                    clearInterval(intervalId);
                } else if (typeof end === 'function' && currentFrame === frameCount - 1) {
                    clearInterval(intervalId);
                    end();
                }
            }

            // Start animation
            intervalId = setInterval(animate, frameDuration);

            return svg;
        }
