let InputBox = {
    Result: {},
    allowCloseGlobal: false,
    inputBox: document.createElement('div'),
    overlay: document.createElement('div'),

    init: function() {
        this.overlay.id = "input-box-overlay";
        this.overlay.className = "input-box-overlay";
        this.inputBox.id = "inputBox";
        this.inputBox.innerHTML = `<h2 id="inputBoxTitle"></h2>
        <p id="inputBoxDesc"></p>
        <div id="inputBoxControls"></div>`;
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.inputBox);
    },


    show: function(title, desc, allowClose, controls, onClose) {
        return new Promise((resolve) => {

            const inputBoxTitle = document.getElementById('inputBoxTitle');
            const inputBoxDesc = document.getElementById('inputBoxDesc');
            const inputBoxControls = document.getElementById('inputBoxControls');

            inputBoxTitle.textContent = this.getText(title);
            inputBoxDesc.textContent = this.getText(desc);
            inputBoxControls.innerHTML = '';
            this.Result = {};
            this.allowCloseGlobal = allowClose;

            if (controls == undefined) controls = [];
            if (allowClose === undefined) allowClose = true;

            controls.forEach((control) => {
                switch (control.type) {
                    case 'text':
                    case 'number':
                        inputBoxControls.innerHTML += `
                                <label for="${control.id}">${this.getText(control.label)}</label>
                                <input type="${control.type}" id="${control.id}" name="${control.id}" 
                                    value="${control.type === 'number' && (control.default === undefined || control.default === 0) ? 0 : control.default || ''}"
                                    ${control.min !== undefined ? `min="${control.min}"` : ''}
                                    ${control.max !== undefined ? `max="${control.max}"` : ''}
                                    onchange="InputBox.validateNumberInput(this)">
                            `;
                        break;
                    case 'select':
                        const options = control.options.map((option) => `<option value="${option}">${option}</option>`).join('');
                        inputBoxControls.innerHTML += `
                                <label for="${control.id}">${this.getText(control.label)}</label>
                                <select id="${control.id}" name="${control.id}">
                                    ${options}
                                </select>
                            `;
                        break;
                    case 'button':
                        inputBoxControls.innerHTML += `
                                <button onclick="handleButtonClick('${control.id}')">${this.getText(control.label)}</button>
                            `;
                        break;
                    case 'label':
                        let val = '';
                        if (control.value) val = `: <span style="font-weight: normal;">${control.value}</span>`;
                        inputBoxControls.innerHTML += `
                                <label>${this.getText(control.text)}${val}</label>
                            `;
                        break;
                    case 'progress':
                        inputBoxControls.innerHTML += `
                                <div class="inputBoxProgressContainer">
                                    <label for="${control.id}">${this.getText(control.label)}</label>
                                    <div id="${control.id}" class="inputBoxProgressBar">
                                        <div class="inputBoxProgressBarFill"></div>
                                    </div>
                                </div>
                            `;
                        this.updateProgressBar(control.id, control.value, control.max, control.reverse);
                        break;
                    case 'slider':
                        inputBoxControls.innerHTML += `
                                <label for="${control.id}">${this.getText(control.label)}</label>
                                <input style="padding : 0px;" type="range" id="${control.id}" name="${control.id}" 
                                    min="${control.min}" max="${control.max}" value="${control.default}">
                            `;
                        break;
                    case 'table':
                        const rows = control.data.map((row) => (row[1] === undefined || (Array.isArray(row[1]) && row[1].length === 0) ? '' : `
                                <tr>
                                    <td>${row[0]}</td>
                                    ${getTd(row[1])}
                                </tr>
                            `)).join('');
                        inputBoxControls.innerHTML += `
                                <div class="inputBoxTableContainer">
                                    <table>
                                        ${rows}
                                    </table>
                                </div>
                            `;
                        // <td class="${Array.isArray(row[1]) ? 'data-item' : ''}">${row[1]}</td>
                        break;
                    case 'list':
                        let mx = ` (Max: ${control.maxSelect})`;
                        if (!control.maxSelect || control.maxSelect == 1000) {
                            mx = '';
                            control.maxSelect = 1000;
                        }

                        const listItems = control.options.map((option) => `
                                <button onclick="InputBox.toggleListSelection('${control.id}', '${option}', ${control.maxSelect})">${option}</button>
                            `).join('');
                        inputBoxControls.innerHTML += `
                                <div class="listContainer">
                                    <label>${control.label}${mx}</label>
                                    <div id="${control.id}">
                                        ${listItems}
                                    </div>
                                </div>
                            `;
                        break;
                    case 'switch':
                        if (!control.default) control.default = 0;
                        const switchItems = control.options.map((option) => this.getSwitchOption(control, option)).join('');
                        inputBoxControls.innerHTML += `
                                <div class="switchContainer">
                                    <label>${control.label}</label>
                                    <div id="${control.id}">
                                        ${switchItems}
                                    </div>
                                </div>
                            `;
                        let num = 0;

                        if (control.default < control.options.length || control.default > 0) num = control.default;

                        this.toggleSwitchSelection(control.id, control.options[num]);
                        const el = document.getElementById(control.id);
                        el.children[num].classList.add('selected');
                        break;
                    case 'custom':
                        inputBoxControls.innerHTML += `<div id="${control.id}" style="margin-bottom: 10px;">${this.getText(control.html)}</div>`;
                        if (typeof(control.callback) === 'function') control.callback();
                        break;
                }
            });

            this.inputBox.style.display = 'block';
            this.overlay.style.display = 'block';

            function getTd(data) {
                if (Array.isArray(data)) {
                    let s = '<td>';
                    for (item of data) {
                        if (typeof item === 'object' && item !== null) {
                            let bg = ';';
                            if (item.color) bg = `background-color:${item.color??=''};`;
                            s += `<span class="data-item" style="${bg}${item.style??=''}">${item.text}</span>`;
                        } else
                            s += `<span class="data-item">${item}</span>`;
                    }
                    return `${s}</td>`;
                } else if (typeof data === 'object' && data !== null) return `<td><div class="tableProgress"><div class="tableProgressBar" style="width:${data.value/data.max*100}%;background-color:${data.color??=''}"></div></div></td>`; //`<td><progress value="${data.value}" max="${data.max}"/></td>`;
                return `<td>${data}</td>`;
            }

            function closeInputBox() {
                this.inputBox.scrollTop = 0;
                this.inputBox.style.display = 'none';
                overlay.style.display = 'none';
                if (typeof onClose == 'function') onClose();
                resolve(this.Result);
            }

            this.overlay.onclick = () => {
                if (allowClose) {
                    const buttons = inputBoxControls.querySelectorAll('button');
                    if (buttons.length > 0) {
                        buttons[buttons.length - 1].click();
                    } else {
                        closeInputBox();
                    }
                }
            };

            window.handleButtonClick = (buttonId) => {
                this.Result.button = buttonId;
                const inputs = inputBoxControls.querySelectorAll('input, select');
                inputs.forEach((input) => {
                    this.Result[input.name] = input.value;
                });

                closeInputBox();
            };
        });
    },

    updateProgressBar: function(id, value, max, reverse = false) {
        const progressBar = document.getElementById(id);
        const progressBarFill = progressBar.querySelector('.inputBoxProgressBarFill');
        const percentage = (value / max) * 100;
        progressBarFill.style.width = `${percentage}%`;

        let color;
        if (reverse) {
            if (percentage >= 80) color = 'red';
            else if (percentage <= 20) color = 'green';
            else color = 'yellow';
        } else {
            if (percentage >= 80) color = 'green';
            else if (percentage <= 20) color = 'red';
            else color = '#4169e1'; // Royal Blue
        }
        progressBarFill.style.backgroundColor = color;
    },

    validateNumberInput: function(input) {
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        const value = parseInt(input.value);

        if (value < min) input.value = min;
        if (value > max) input.value = max;
    },

    toggleListSelection: function(listId, option, maxSelect) {
        const button = event.target;
        const container = document.getElementById(listId);
        const selectedButtons = container.querySelectorAll('button.selected');

        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
        } else if (selectedButtons.length < maxSelect) {
            button.classList.add('selected');
        } else {
            alert(`You can only select up to ${maxSelect} items.`);
        }

        // Update this.Result
        this.Result[listId] = Array.from(container.querySelectorAll('button.selected')).map((btn) => btn.textContent);
    },

    getSwitchOption: function(control, option) {
        let id = '';
        let style = '';
        let text = option;
        let Id = option;
        if (typeof(option) == 'object') {
            if (option.id) {
                id = ` id="${option.id}"`;
                Id = option.id
            }
            if (option.style) style = ` style="${option.style}"`;
            text = option.text;
        }
        return `<button${id+style} onclick="InputBox.toggleSwitchSelection('${control.id}', '${Id}',${control.action})">${text}</button>`;
    },

    toggleSwitchSelection: function(switchId, option, action) {
        const button = event.target;
        const container = document.getElementById(switchId);
        const buttons = container.querySelectorAll('button');
        if (typeof(action) === 'function') action(option);
        buttons.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');

        // Update this.Result
        this.Result[switchId] = typeof option == 'string' ? option : option.id;
    },

    changeSwitch: function(switchId, option, button) {
        if (typeof(button) == 'string') button = document.getElementById(button)
        if (!button) button = document.getElementById(option);
        const container = document.getElementById(switchId);
        const buttons = container.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
        this.Result[switchId] = typeof option == 'string' ? option : option.id;
    },

    getText: function(text) {
        return text;
    }
};
InputBox.init();
