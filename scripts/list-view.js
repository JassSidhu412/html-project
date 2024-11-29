let listView, closeButton, backButton, listTitle, listItems;

let history = [];

const ListView = {
    open: function(title, items) {
        this.createListView();
        listTitle.textContent = title;
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
    createListView: function() {
        if (!listView) {
            listView = document.createElement('div');
            listView.id = 'listView';
            listView.innerHTML = `
                        <div id="listHeader">
                            <button id="closeButton">✕</button>
                            <button id="backButton" style="display: none;">←</button>
                            <span id="listTitle"></span>
                        </div>
                        <div id="listItems"></div>
                    `;
            document.body.appendChild(listView);

            closeButton = document.getElementById('closeButton');
            backButton = document.getElementById('backButton');
            listTitle = document.getElementById('listTitle');
            listItems = document.getElementById('listItems');

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
                separator.textContent = item.separator;
                listItems.appendChild(separator);
                return;
            }

            const hide = typeof item.hide === 'function' ? item.hide() : item.hide;
            if (hide) return;

            const disable = typeof item.disable === 'function' ? item.disable() : item.disable;

            const listItem = document.createElement('div');
            listItem.className = 'listItem' + (disable ? ' disabled' : '');
            listItem.innerHTML = `
                    <span class="itemIcon">${item.icon}</span>
                    <div class="itemContent">
                        <div class="itemTitle">${item.title}</div>
                        <div class="itemDesc">${item.desc}</div>
                    </div>
                    <span class="itemAction">${item.list ? '→' : item.do ? '⋮' : ''}</span>
                `;
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
