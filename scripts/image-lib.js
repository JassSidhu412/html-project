let IconGen = {
    dir: 'https://raw.githubusercontent.com/JassSidhu412/html-project/main/images/',
    overlayId: 0,
    create: function(size, id, images, style, bg) {
        let def = '';
        let imgs = '';
        for (let image of images) {
            if (typeof(image) == 'string') imgs += `<image width="512" height="512" href="${IconGen.dir+image}"/>`;
            else {
                let img = IconGen.dir + image.url;
                if (image.overlay) {
                    IconGen.overlayId++;
                    let c = parseColor(image.overlay);
                    def += `<filter id="overlay${IconGen.overlayId}">
                    <feColorMatrix type="matrix" values="${c.r} 0 0 0 0 0 ${c.g} 0 0 0 0 0 ${c.b} 0 0 0 0 0 1 0"/>
                </filter>`;
                    imgs += `<image width="512" height="512" href="${img}" filter="url(#overlay${IconGen.overlayId})"/>`;
                } else imgs += `<image width="512" height="512" href="${img}"/>`;
                imgs += `<image width="512" height="512" href="${image.url}"/>`;
            }
        }
        let background = '';
        if (def != '') def = '<def>' + def + '</def>';
        if (bg) background = `<rect width="512" height="512" fill="${bg}" />`;
        return `<svg id="${id}" width="${size}" height="${size}" style="${style ??= ''}" viewBox="0 0 512 512">${def+imgs+background}</svg>`;
    }
}
