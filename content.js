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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
            </svg>
        </div>
        <div id="clocks-container"></div>
    `;
    document.body.appendChild(clockWindow);


    // --- Clock Logic (same as before, but adapted for the extension) ---

    const clocksContainer = document.getElementById('clocks-container');

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

    const clockHeader = document.getElementById('clock-header');
    let isDragging = false;
    let offsetX, offsetY;

    clockHeader.addEventListener('mousedown', (e) => {
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
