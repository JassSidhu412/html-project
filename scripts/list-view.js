let listView, closeButton, backButton, listTitle, listItems;

let history = [];

const ListView = {
    open: function(title, items) {
        this.createListView();
        listViewTitle.textContent = title;
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
                        <div id="listViewHeader">
                            <button id="listViewCloseButton">✕</button>
                            <button id="listViewBackButton" style="display: none;">←</button>
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
