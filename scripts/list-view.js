let listView, closeButton, backButton, listTitle, listItems;

let history = [];

const ListView = {
    open: function(title, items) {
        this.createListView();
        listViewTitle.textContent = this.getText(title);
        this.renderItems(items);
        listView.classList.add('open');
    },
    close: function() {
        listView.classList.remove('open');
        history = [];
        this.removeListView();
    },
    goBack: function() {
        if (history.length > 0) {
            const prevState = history.pop();
            this.open(prevState.title, prevState.items);
            this.updateBackButton();
        }
    },
    getText: function(text){
        return text;
    },
    createListView: function() {
        if (!listView) {
            listView = document.createElement('div');
            listView.id = 'listView';
            listView.innerHTML = `
                        <div id="listViewHeader">
                            <button id="listViewCloseButton" style="font-size:32px;">×</button>
                            <button id="listViewBackButton" style="display: none;"><div class="triangle-left" style="border-right-color:#eee;"></div></button>
                            <span id="listViewTitle"></span>
                        </div>
                        <div id="listViewItems"></div>
                    `;
            document.body.appendChild(listView);

            closeButton = document.getElementById('listViewCloseButton');
            backButton = document.getElementById('listViewBackButton');
            listTitle = document.getElementById('listViewTitle');
            listItems = document.getElementById('listViewItems');

            closeButton.addEventListener('click', () => ListView.close());
            backButton.addEventListener('click', () => ListView.goBack());
        }
    },
    removeListView: function() {
        if (listView) {
            document.body.removeChild(listView);
            listView = null;
        }
    },
    updateBackButton: function() {
        if (history.length > 0) {
            closeButton.style.display = 'none';
            backButton.style.display = 'flex';
        } else {
            closeButton.style.display = 'flex';
            backButton.style.display = 'none';
        }
    },

    renderItems: function(items) {
        listItems.innerHTML = '';
        items.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'separator';
                separator.textContent = this.getText(item.separator);
                listItems.appendChild(separator);
                return;
            }

            const hide = typeof item.hide === 'function' ? item.hide() : item.hide;
            if (hide) return;

            const disable = typeof item.disable === 'function' ? item.disable() : item.disable;

            const listItem = document.createElement('div');
            listItem.className = 'listItem' + (disable ? ' disabled' : '');
            //let descHTML;
            //if (typeof item.desc === 'object' && item.desc !== null) descHTML = `<div><div class="itemDesc">${item.desc.text}</div><div class="listViewProgress"><div class="listViewProgressBar" style="width:${item.desc.value/item.desc.max*100}%;background-color:${item.desc.color??=''}"></div></div></div>`;
            //else descHTML = `<div class="itemDesc">${item.desc}</div>`;
            let descContent = '';
                if (typeof item.desc === 'object' && item.desc.text && item.desc.value !== undefined) {
                    const max = item.desc.max || 100;
                    const percentage = (item.desc.value / max) * 100;
                    descContent = `
                        <div class="itemDesc">
                            <span class="itemDescText">${this.getText(item.desc.text)}</span>
                            <div class="listViewProgressBar">
                                <div class="listViewProgress" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                } else {
                    descContent = `<div class="itemDesc">${this.getText(item.desc)}</div>`;
                }
            listItem.innerHTML = `
                    <span class="itemIcon">${item.icon}</span>
                    <div class="itemContent">
                        <div class="itemTitle">${this.getText(item.title)}</div>
                        ${descContent}
                    </div>
                    <span class="itemAction">${item.list ? '<div class="triangle-right" style="border-left-color:#4a90e2;"></div>' : item.do ? '⋮' : ''}</span>
                `;//→
            if (!disable) {
                listItem.addEventListener('click', () => {
                    if (item.do) {
                        item.do();
                    } else if (item.list) {
                        history.push({
                            title: listTitle.textContent,
                            items: items
                        });
                        this.updateBackButton();
                        const newItems = typeof item.list === 'function' ? item.list() : item.list;
                        ListView.open(item.title, newItems);
                    }
                });
            }
            listItems.appendChild(listItem);
        });
    }
};
