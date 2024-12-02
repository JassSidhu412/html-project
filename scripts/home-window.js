function createHomeWindow() {
    const homeWindow = document.createElement('div');
    homeWindow.id = 'home-window';
    homeWindow.innerHTML = `
                <div class="container">
                    <div class="top-bar">
                        <button class="menu-button" onclick="showMenu()">☰</button>
                        <div class="game-title">Life Simulator</div>
                        <div style="width: 24px;"></div>
                    </div>
                    <div class="player-bar">
                        <div class="player-info" onclick="showPlayerInfo()">
                            <span class="player-icon">${playerIcon}</span>
                            <div>
                                <div class="player-name">${playerName}</div>
                                <div class="player-job">${playerJob}</div>
                            </div>
                        </div>
                        <div class="money">💰 ${formatMoney(money)}</div>
                    </div>
                    <div class="log-area" id="logArea">
                        <!-- Log entries will be added here dynamically -->
                    </div>
                    <div class="stats-bar">
                        <button class="age-up-button" id="ageUpButton">Age Up</button>
                        <div class="stats-content">
                            <div class="stat-bars">
                                ${statBars.map(stat => `
                                    <div class="stat-bar">
                                        <div class="stat-label" style="color: ${stat.color};">${stat.name}</div>
                                        <div class="stat-progress"><div class="stat-fill" style="width: ${stat.value}%; background-color: ${stat.color};"></div></div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="action-buttons">
                                ${actionButtons.map(button => `
                                    <button class="action-button">${button}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
    return homeWindow;
}

function formatMoney(amount) {
    return amount.toLocaleString('en-US');
}

function addLogEntry(entry, isNextYear = false) {
    const logArea = document.getElementById('logArea');
    const logEntry = document.createElement('p');
    logEntry.textContent = entry;
    if (isNextYear) {
        logEntry.classList.add('next-year');
    }
    logArea.appendChild(logEntry);
    logArea.scrollTop = logArea.scrollHeight;

    // Update UI after adding log entry
    updateUI();
}

function updateUI() {
    // Update money
    const moneyElement = document.querySelector('#home-window .money');
    moneyElement.textContent = `💰 ${formatMoney(money)}`;

    // Update player info
    const playerNameElement = document.querySelector('#home-window .player-name');
    const playerJobElement = document.querySelector('#home-window .player-job');
    const playerIconElement = document.querySelector('#home-window .player-icon');
    playerNameElement.textContent = playerName;
    playerJobElement.textContent = playerJob;
    playerIconElement.textContent = playerIcon;

    // Update stat bars
    statBars.forEach((stat, index) => {
        const statFillElement = document.querySelectorAll('#home-window .stat-fill')[index];
        statFillElement.style.width = `${stat.value}%`;
    });
}
