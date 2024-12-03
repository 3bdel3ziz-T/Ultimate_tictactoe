export class GameAlert {
    constructor() {
        this.createAlertContainer();
    }

    createAlertContainer() {
        if (!document.getElementById('alert-container')) {
            const container = document.createElement('div');
            container.id = 'alert-container';
            container.className = 'modal';
            document.body.appendChild(container);
        }
    }

    showRules() {
        const rules = [
            "The game consists of 9 small tic-tac-toe boards arranged in a 3x3 grid",
            "First move must be played in the center board",
            "Your move in a small board determines which board your opponent must play in next",
            "Win three small boards in a row to win the game",
            "If sent to a completed board, you can play in any available board"
        ];

        this.showAlert("Game Rules", rules);
    }

    showGameOver(winner) {
        this.showAlert("Game Over!", [`Player ${winner} wins!`], "Play Again");
    }

    showAlert(title, messages, buttonText = "Got it!") {
        const container = document.getElementById('alert-container');
        const rulesList = messages.map((rule, index) => `
            <li>
                <span class="rule-number">${index + 1}</span>
                <span>${rule}</span>
            </li>
        `).join('');

        container.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                </div>
                <div class="modal-body">
                    <ul class="rules-list">
                        ${rulesList}
                    </ul>
                </div>
                <div class="modal-footer">
                    <button class="modal-button" onclick="document.getElementById('alert-container').classList.remove('show')">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        
        // Force reflow to ensure animation plays
        container.offsetHeight;
        
        // Show modal with animation
        container.classList.add('show');

        // Add click outside to close
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.hideAlert();
            }
        });

        // Add escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAlert();
            }
        });
    }

    hideAlert() {
        const container = document.getElementById('alert-container');
        container.classList.remove('show');
    }
}
