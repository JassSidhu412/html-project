let inputBoxResult = {};
let allowCloseGlobal = false;

const inputBox = document.createElement('div');
const overlay = document.createElement('div');

function initInputBox() {
    overlay.id = "input-box-overlay";
    overlay.className = "input-box-overlay";
    inputBox.id = "inputBox";
    inputBox.innerHTML = `<h2 id="inputBoxTitle"></h2>
        <p id="inputBoxDesc"></p>
        <div id="inputBoxControls"></div>`
    document.body.appendChild(overlay);
    document.body.appendChild(inputBox);
    /*`<div id="input-box-overlay" class="input-box-overlay"></div>
     <div id="inputBox">
         <h2 id="inputBoxTitle"></h2>
         <p id="inputBoxDesc"></p>
         <div id="inputBoxControls"></div>
     </div>`;*/
}
initInputBox();

function ShowInputBox(title, desc, allowClose, controls) {
    return new Promise((resolve) => {

        const inputBoxTitle = document.getElementById('inputBoxTitle');
        const inputBoxDesc = document.getElementById('inputBoxDesc');
        const inputBoxControls = document.getElementById('inputBoxControls');

        inputBoxTitle.textContent = getNpcText(title);
        inputBoxDesc.textContent = getNpcText(desc);
        inputBoxControls.innerHTML = '';
        inputBoxResult = {};
        allowCloseGlobal = allowClose;

        if (controls == undefined) controls = [];
        if (allowClose === undefined) allowClose = true;

        controls.forEach((control) => {
            switch (control.type) {
                case 'text':
                case 'number':
                    inputBoxControls.innerHTML += `
                                <label for="${control.id}">${getNpcText(control.label)}</label>
                                <input type="${control.type}" id="${control.id}" name="${control.id}" 
                                    value="${control.type === 'number' && (control.default === undefined || control.default === 0) ? 0 : control.default || ''}"
                                    ${control.min !== undefined ? `min="${control.min}"` : ''}
                                    ${control.max !== undefined ? `max="${control.max}"` : ''}
                                    onchange="validateNumberInput(this)">
                            `;
                    break;
                case 'select':
                    const options = control.options.map((option) => `<option value="${option}">${option}</option>`).join('');
                    inputBoxControls.innerHTML += `
                                <label for="${control.id}">${getNpcText(control.label)}</label>
                                <select id="${control.id}" name="${control.id}">
                                    ${options}
                                </select>
                            `;
                    break;
                case 'button':
                    inputBoxControls.innerHTML += `
                                <button onclick="handleButtonClick('${control.id}')">${getNpcText(control.label)}</button>
                            `;
                    break;
                case 'label':
                    inputBoxControls.innerHTML += `
                                <label>${getNpcText(control.label)}: <span style="font-weight: normal;">${control.default}</span></label>
                            `;
                    break;
                case 'progress':
                    inputBoxControls.innerHTML += `
                                <div class="inputBoxProgressContainer">
                                    <label for="${control.id}">${getNpcText(control.label)}</label>
                                    <div id="${control.id}" class="inputBoxProgressBar">
                                        <div class="inputBoxProgressBarFill"></div>
                                    </div>
                                </div>
                            `;
                    updateProgressBar(control.id, control.value, control.max, control.reverse);
                    break;
                case 'slider':
                    inputBoxControls.innerHTML += `
                                <label for="${control.id}">${getNpcText(control.label)}</label>
                                <input style="padding : 0px;" type="range" id="${control.id}" name="${control.id}" 
                                    min="${control.min}" max="${control.max}" value="${control.default}">
                            `;
                    break;
                case 'table':
                    // const isArray = Array.isArray(row[1]);
                    console.log(control.data);
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
                                <button onclick="toggleListSelection('${control.id}', '${option}', ${control.maxSelect})">${option}</button>
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
                    const switchItems = control.options.map((option) => `
                                <button onclick="toggleSwitchSelection('${control.id}', '${option}')">${option}</button>
                            `).join('');
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

                    toggleSwitchSelection(control.id, control.options[num]);
                    const el = document.getElementById(control.id);
                    el.children[num].classList.add('selected');
                    break;
                case 'group':
                    const groupContent = control.controls.map((subControl) => `<div>${renderControl(subControl)}</div>`).join('');
                    inputBoxControls.innerHTML += `
                                <button style="margin-bottom:0px" class="collapsible" onclick="toggleGroup(this);">${control.label}</button>
                                <div style="margin-bottom:10px" class="content">
                                    ${groupContent}
                                </div>
                            `;
                    break;
            }
        });

        inputBox.style.display = 'block';
        overlay.style.display = 'block';

        function getTd(data) {
            if (Array.isArray(data)) {
                let s = '<td>';
                for (item of data) {
                    s += `<span class="data-item">${item}</span>`;
                }
                return `${s}</td>`;
            }
            return `<td>${data}</td>`;
        }

        function closeInputBox() {
            inputBox.scrollTop = 0;
            inputBox.style.display = 'none';
            overlay.style.display = 'none';
            resolve(inputBoxResult);
        }

        overlay.onclick = () => {
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
            inputBoxResult.button = buttonId;
            const inputs = inputBoxControls.querySelectorAll('input, select');
            inputs.forEach((input) => {
                inputBoxResult[input.name] = input.value;
            });

            closeInputBox();
        };
    });

    // inputBox.stop().animate({ scrollTop: 0 }, 500);
    /* window.setTimeout(function() {
          inputBox.scrollTop=0;
      }, 1000); */
}

function renderControl(control) {
    switch (control.type) {
        case 'text':
        case 'number':
            return `
                        <label for="${control.id}">${control.label}</label>
                        <input type="${control.type}" id="${control.id}" name="${control.id}" 
                            value="${control.default || ''}" 
                            ${control.min !== undefined ? `min="${control.min}"` : ''}
                            ${control.max !== undefined ? `max="${control.max}"` : ''}
                            onchange="validateNumberInput(this)">
                    `;
        case 'select':
            const options = control.options.map((option) => `<option value="${option}">${option}</option>`).join('');
            return `
                        <label for="${control.id}">${control.label}</label>
                        <select id="${control.id}" name="${control.id}">
                            ${options}
                        </select>
                    `;
            // Add cases for other control types as needed
    }
}

function updateProgressBar(id, value, max, reverse = false) {
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
}

function validateNumberInput(input) {
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    const value = parseInt(input.value);

    if (value < min) input.value = min;
    if (value > max) input.value = max;
}

function toggleListSelection(listId, option, maxSelect) {
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

    // Update inputBoxResult
    inputBoxResult[listId] = Array.from(container.querySelectorAll('button.selected')).map((btn) => btn.textContent);
}

function toggleSwitchSelection(switchId, option) {
    const button = event.target;
    const container = document.getElementById(switchId);
    const buttons = container.querySelectorAll('button');

    buttons.forEach((btn) => btn.classList.remove('selected'));
    button.classList.add('selected');

    // Update inputBoxResult
    inputBoxResult[switchId] = option;
}

function toggleGroup(element) {
    {
        // console.log("f");
        element.classList.toggle('active');
        const content = element.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = `${content.scrollHeight}px`;
        }
    }
}

async function addCharacter() {
    const result = await ShowInputBox(
        'Add Character',
        'Fill Details',
        true,
        [{
                type: 'text',
                id: 'name',
                label: 'Name',
                default: 'Shinji',
            },
            {
                type: 'text',
                id: 'surname',
                label: 'Surname',
                default: 'Distroyer',
            },
            {
                type: 'select',
                id: 'gender',
                label: 'Gender',
                options: ['Male', 'Female', 'Other'],
            },
            {
                type: 'number',
                id: 'age',
                label: 'Age',
                min: 1,
                default: 15,
            },
            {
                type: 'button',
                id: 'okay',
                label: 'Okay',
            },
            {
                type: 'button',
                id: 'close',
                label: 'Close',
            },
        ],
    );
    console.log('Add Character Result:', result);
}

async function goTo() {
    const result = await ShowInputBox(
        'Go To Somewhere',
        'Choose Which side to go',
        false,
        [{
                type: 'button',
                id: 'north',
                label: 'North',
            },
            {
                type: 'button',
                id: 'south',
                label: 'South',
            },
            {
                type: 'button',
                id: 'east',
                label: 'East',
            },
            {
                type: 'button',
                id: 'west',
                label: 'West',
            },
        ],
    );
    console.log('Go To Result:', result);
    addLog(result);
}
async function Pop(title, desc, log) {
    const result = await ShowInputBox(title, desc, true, []);

    addLog(log);
}
async function battle() {
    const result = await ShowInputBox(
        'Go To Battle',
        'Choose How many men and way to attack',
        true,
        [{
                type: 'label',
                id: 'AName',
                label: 'Army From',
                default: 'Village of Destruction',
            },
            {
                type: 'table',
                data: [
                    ['Staves', '100'],
                    ['Swords', '1000'],
                    ['Katana', '1000'],
                    ['Bows', '500'],
                    ['Catapults', '50'],
                    ['Types', 'Katana, Sphear, Skills, Shields, Bows, Staves, Mines, Nains, Bombs, Kunai, Slaps, Punches'],
                ],
            },
            {
                type: 'text',
                id: 'armyName',
                label: 'Army Name',
                default: 'Army of Destruction',
            },

            {
                type: 'progress',
                id: 'enemyPower',
                label: 'Enemy Power',
                value: 1000,
                max: 1200,
            },
            {
                type: 'progress',
                id: 'alliesFear',
                label: "Allies' Fear",
                value: 90,
                max: 100,
                reverse: true,
            },
            {
                type: 'number',
                id: 'soldiers',
                label: 'Number of soldiers to take',
                min: 100,
                max: 1000,
                default: 500,
            },
            {
                type: 'slider',
                id: 'power',
                label: 'How much power',
                min: 0,
                max: 100,
                default: 50,
            },
            {
                type: 'button',
                id: 'attack',
                label: 'Attack',
            },
            {
                type: 'button',
                id: 'forfeit',
                label: 'Forfeit',
            },
            {
                type: 'button',
                id: 'ditch',
                label: 'Ditch Army',
            },
            {
                type: 'button',
                id: 'ditch',
                label: 'Pretend to be friendly',
            },
            {
                type: 'button',
                id: 'runAway',
                label: 'Run Away',
            },
        ],
    );
    console.log('Battle Results:', result);
    addLog(JSON.stringify(result));
}
async function inventory() {
    const result = await ShowInputBox(
        'Inventory',
        'Manage your inventory',
        true,
        [{
                type: 'group',
                id: 'weapons',
                label: 'Weapons',
                controls: [{
                        type: 'number',
                        id: 'swords',
                        label: 'Swords',
                        min: 0,
                        max: 100,
                        default: 10,
                    },
                    {
                        type: 'number',
                        id: 'bows',
                        label: 'Bows',
                        min: 0,
                        max: 50,
                        default: 5,
                    },
                ],
            },
            {
                type: 'group',
                id: 'armor',
                label: 'Armor',
                controls: [{
                        type: 'number',
                        id: 'helmets',
                        label: 'Helmets',
                        min: 0,
                        max: 50,
                        default: 10,
                    },
                    {
                        type: 'number',
                        id: 'shields',
                        label: 'Shields',
                        min: 0,
                        max: 50,
                        default: 10,
                    },

                ],
            },
            {
                type: 'list',
                id: 'skills',
                label: 'Select Skills',
                options: ['Swordsmanship', 'Archery', 'Tactics', 'Leadership', 'Stealth'],
                maxSelect: 3,
            },
            {
                type: 'switch',
                id: 'class',
                label: 'Choose Class',
                default: 1,
                options: ['Warrior', 'Archer', 'Mage', 'Rogue'],
            },
            {
                type: 'button',
                id: 'save',
                label: 'Save Inventory',
            },
        ],
    );
    console.log('Inventory Result:', result);
    addLog(JSON.stringify(result));
}
