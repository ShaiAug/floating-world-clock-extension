// --- Create and Inject the Clock HTML ---

// To avoid conflicts with the host page, we use a unique ID.
const clockWindowId = 'clock-window-extension';

// Check if the clock is already on the page to avoid injecting it multiple times
if (!document.getElementById(clockWindowId)) {

    const clockWindow = document.createElement('div');
    clockWindow.id = clockWindowId;
    clockWindow.innerHTML = `
        <div id="clock-header">
            <h2>World Clocks</h2>
            <div id="window-controls" title="Minimize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                </svg>
            </div>
        </div>
        <div id="clocks-container"></div>
        <div id="restore-tab" title="Restore">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>
            <span>Clocks</span>
        </div>
    `;
    document.body.appendChild(clockWindow);


    // --- Clock Logic ---

    const clocksContainer = document.getElementById('clocks-container');
    const minimizeBtn = document.getElementById('window-controls');
    const restoreTab = document.getElementById('restore-tab');

    const dayNightIcons = {
        sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: #f59e0b;"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 011.06.044l1.5 1.5a.75.75 0 01-1.06 1.06l-1.5-1.5a.75.75 0 01.044-1.06zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 1.06l-1.5 1.5a.75.75 0 11-1.06-1.06l1.5-1.5zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM5.106 17.894a.75.75 0 01.044-1.06l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5a.75.75 0 01-1.06 0zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.106 5.106a.75.75 0 011.06-.044l1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5a.75.75 0 01-.044-1.06z"></path></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: #818cf8;"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 004.463-.949a.75.75 0 01.819.162l.805.805a.75.75 0 01-.316.966A11.956 11.956 0 0112 21a11.956 11.956 0 01-8.605-3.712.75.75 0 01.966-.316l.805.805a.75.75 0 01.162-.819z" clip-rule="evenodd"></path></svg>`
    };

    const locations = [
        { name: 'Philippines', timeZone: 'Asia/Manila' },
        { name: 'US East Coast', timeZone: 'America/New_York' },
        { name: 'US West Coast', timeZone: 'America/Los_Angeles' }
    ];

    function initializeClocks() {
        clocksContainer.innerHTML = '';
        locations.forEach((loc, index) => {
            const clockDiv = document.createElement('div');
            clockDiv.className = 'clock-entry';
            clockDiv.innerHTML = `
                <div class="location-info">
                    <p>${loc.name}</p>
                    <p>${loc.timeZone}</p>
                </div>
                <div class="time-display">
                    <div id="day-night-icon-${index}" class="day-night-icon"></div>
                    <p id="time-${index}" class="time-text">00:00:00</p>
                </div>
            `;
            clocksContainer.appendChild(clockDiv);
        });
    }

    function updateClocks() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };

        locations.forEach((loc, index) => {
            const timeElem = document.getElementById(`time-${index}`);
            const dayNightIconElem = document.getElementById(`day-night-icon-${index}`);

            if (timeElem && dayNightIconElem) {
                timeElem.textContent = now.toLocaleTimeString('en-GB', { ...timeOptions, timeZone: loc.timeZone });
                const hour = parseInt(now.toLocaleTimeString('en-GB', { timeZone: loc.timeZone, hour: '2-digit', hourCycle: 'h23' }));
                dayNightIconElem.innerHTML = (hour >= 6 && hour < 18) ? dayNightIcons.sun : dayNightIcons.moon;
            }
        });
    }

    initializeClocks();
    setInterval(updateClocks, 1000);
    updateClocks();

    // --- Window Controls Logic ---
    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the drag event from firing
        clockWindow.classList.add('minimized');
    });

    restoreTab.addEventListener('click', () => {
        clockWindow.classList.remove('minimized');
    });


    // --- Dragging Logic ---
    const clockHeader = document.getElementById('clock-header');
    let isDragging = false;
    let offsetX, offsetY;

    clockHeader.addEventListener('mousedown', (e) => {
        // Only allow dragging if the window is not minimized
        if (clockWindow.classList.contains('minimized')) return;

        isDragging = true;
        offsetX = e.clientX - clockWindow.getBoundingClientRect().left;
        offsetY = e.clientY - clockWindow.getBoundingClientRect().top;
        clockWindow.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const winW = clockWindow.offsetWidth;
        const winH = clockWindow.offsetHeight;
        newX = Math.max(0, Math.min(newX, vw - winW));
        newY = Math.max(0, Math.min(newY, vh - winH));
        clockWindow.style.left = `${newX}px`;
        clockWindow.style.top = `${newY}px`;
        clockWindow.style.right = 'auto';
        clockWindow.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        clockWindow.classList.remove('dragging');
    });
}
