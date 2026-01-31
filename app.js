// Data Structure for Steps
const stepsData = [
    {
        id: 2,
        title: "",
        description: "",
        visual: "assets/step2_manifold.mp4",
        customTable: {
            headers: ["n", "L1 [mm]", "L2 [mm]"],
            rows: [
                ["2", "214", "155"],
                ["3", "264", "205"],
                ["4", "314", "255"],
                ["5", "364", "305"],
                ["6", "414", "355"],
                ["7", "464", "405"],
                ["8", "514", "455"],
                ["9", "564", "505"],
                ["10", "614", "555"],
                ["11", "664", "605"],
                ["12", "714", "655"],
                ["13", "764", "705"],
                ["14", "814", "755"],
                ["15", "864", "805"],
                ["16", "914", "855"]
            ]
        },
        checklist: [], // Empty checklist as requested
        specs: [
            { icon: "ϑsec = 15 – 60°C.svg", label: "ϑsec", value: "= 15 – 60°C" },
            { icon: "kvs = 0,95.svg", label: "kvs", value: "= 0,95 m³/h" },
            { icon: "Pmax = 6 bar.svg", label: "Pmax", value: "= 6 bar" },
            { icon: "kvs = 2,83.svg", label: "kvs", value: "= 2,83 m³/h" },
            { icon: "Ptest = 10 bar.svg", label: "Ptest", value: "= 10 bar" },
            { icon: "Vmax.svg", label: "V̇max", value: "= 3,6 m³/h (12 loops)" }
        ]
    },
    {
        id: 3,
        category: "installation",
        title: "Pipe Cutting",
        description: "Cut the pipe perpendicularly. Avoid burrs or deformation of the pipe end.",
        visual: "assets/step3_cutting.mp4",
        checklist: [
            "Measure twice, cut once",
            "Cut strictly at 90 degrees",
            "Inspect cut for burrs",
            "Use deburring tool if needed"
        ],
        specs: [
            { label: "Cut Angle", value: "90°" },
            { label: "Max Deviation", value: "2°" },
            { label: "Blade Status", value: "Sharp" }
        ]
    },
    {
        id: 7,
        category: "installation",
        title: "Installation Step 2",
        description: "Second part of the installation process.",
        visual: "assets/step3_part2.mp4",
        checklist: ["Check alignment", "Secure connections"],
        specs: [{ label: "Step", value: "Secondary" }]
    },
    {
        id: 8,
        category: "installation",
        title: "Installation Step 3",
        description: "Third part of the installation process.",
        visual: "assets/step3_part3.mp4",
        checklist: ["Final inspection", "Clean up"],
        specs: [{ label: "Step", value: "Final" }]
    },
    {
        id: 4,
        category: "flushing",
        title: "Pipe Insert & Connection",
        description: "Insert the pipe into the fitting until it hits the stop. Tighten the compression nut.",
        visual: "assets/step4_insert.mp4",
        checklist: [
            "Slide nut and olive onto pipe",
            "Insert support sleeve into pipe",
            "Push pipe fully into manifold outlet",
            "Hand tighten the nut first"
        ],
        specs: [
            { label: "Insertion Depth", value: "Full Stop" },
            { label: "Wrench Size", value: "24mm" },
            { label: "Torque", value: "30-40 Nm" }
        ]
    },
    {
        id: 9,
        category: "flushing",
        title: "Flushing Step 2",
        description: "Second part of the flushing process.",
        visual: "assets/step4_part2.mp4",
        checklist: ["Open drain valve", "Monitor water clarity"],
        specs: [{ label: "Step", value: "Secondary" }]
    },
    {
        id: 10,
        category: "flushing",
        title: "Flushing Step 3",
        description: "Third part of the flushing process.",
        visual: "assets/step4_part3.mp4",
        checklist: ["Close fill valve", "Check for trapped air"],
        specs: [{ label: "Step", value: "Final" }]
    },
    {
        id: 5,
        title: "Pressure Check",
        description: "Pressurize the system to check for leaks before closing the floor/wall.",
        visual: "assets/step5_pressure.mp4",
        checklist: [
            "Close all loop valves",
            "Connect pressure test pump",
            "Pressurize to 1.5x working pressure",
            "Monitor for 30 minutes"
        ],
        specs: [
            { label: "Test Pressure", value: "6 Bar (min)" },
            { label: "Duration", value: "30 Mins" },
            { label: "Medium", value: "Water/Air" }
        ]
    },
    {
        id: 6,
        title: "Setting Levels / Balancing",
        description: "Adjust the flow meters to balance the loops according to the design.",
        visual: "assets/step6_balancing.mp4",
        checklist: [
            "Remove protective cap",
            "Turn flow meter ring to adjust",
            "Verify flow rate on sight glass",
            "Lock the setting"
        ],
        specs: [
            { label: "Flow Range", value: "0 - 5 L/min" },
            { label: "Accuracy", value: "+/- 10%" },
            { label: "Lock Type", value: "Ring Lock" }
        ]
    }
];

// App State Keys
const SAVED_STEP_KEY = 'current-step-index';
const THEME_KEY = 'preferred-theme';

// App State
let currentStepIndex = 0;

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const stepTitle = document.getElementById('current-step-title');
const stepDesc = document.getElementById('current-step-desc');
const visualWrapper = document.querySelector('.video-wrapper');
const mainVideo = document.getElementById('main-video');
const playOverlay = document.getElementById('play-overlay');
const checklistContainer = document.getElementById('checklist-container');
const specsContainer = document.getElementById('specs-container');

// Video Control Elements
const videoProgressBarFill = document.querySelector('.video-controls .progress-bar-fill');
const customPlayBtn = document.querySelector('.control-btn.play');

// Progress Bar Elements
const progressText = document.getElementById('progress-text');
const progressBarFill = document.getElementById('overall-progress-fill');

// Theme Toggle Elements
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const body = document.body;

// Initialization
function init() {
    // Restore state
    const savedIndex = Number(localStorage.getItem(SAVED_STEP_KEY));
    currentStepIndex = isNaN(savedIndex) ? 0 : savedIndex;
    // Bounds check
    if (currentStepIndex < 0 || currentStepIndex >= stepsData.length) {
        currentStepIndex = 0;
    }

    // Restore Theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        setTheme(savedTheme);
        if (themeToggle) themeToggle.checked = savedTheme === 'dark';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        if (themeToggle) themeToggle.checked = true;
    }

    renderStep(currentStepIndex);
    attachEventListeners();
    addNavigationControls();
    updateOverallProgress();
}

// Render Functions
function renderStep(index) {
    // Safety check
    if (!stepsData[index]) return;

    // Save state
    localStorage.setItem(SAVED_STEP_KEY, index);

    const step = stepsData[index];

    // 1. Update Content Header
    const translatedTitle = i18n.t(`step_${step.id}_title`, step.title);
    const translatedDesc = i18n.t(`step_${step.id}_desc`, step.description);

    const stepInfo = document.querySelector('.step-info');

    // Show only the navigation buttons for the "installation" category
    // Hide title and description globally as per previous request
    // Show only the navigation buttons for categorization
    // Hide title and description globally as per previous request
    if (stepInfo) {
        if (step.category) {
            stepInfo.style.display = 'block';
            if (stepTitle) stepTitle.style.display = 'none';
            if (stepDesc) stepDesc.style.display = 'none';
        } else {
            stepInfo.style.display = 'none';
        }
    }

    // 2. Update Visual (Video)
    if (mainVideo) {
        mainVideo.src = step.visual;
        mainVideo.load();
        // Reset overlay visibility on new step
        if (playOverlay) {
            playOverlay.style.opacity = '1';
            playOverlay.style.pointerEvents = 'auto';
            playOverlay.style.display = 'flex';
        }
        // Reset video progress bar
        if (videoProgressBarFill) videoProgressBarFill.style.width = '0%';
    }

    // 3. Update Checklist or Table
    const checklistHeader = document.querySelector('.tool-section:nth-of-type(1) h3');
    if (step.customTable) {
        if (checklistHeader) {
            checklistHeader.style.display = 'block';
            checklistHeader.innerHTML = `<span class="icon">📏</span> ${i18n.t('sidebar_dimensions', 'Dimensions Table')}`;
        }
        renderTable(step.customTable);
        // 4. Update Specs (only for Dimensions)
        renderSpecs(step.specs);
    } else {
        if (checklistHeader) {
            checklistHeader.style.display = 'none';
        }
        // Empty containers instead of rendering items
        if (checklistContainer) checklistContainer.innerHTML = '';
        if (specsContainer) specsContainer.innerHTML = '';
    }

    // 5. Update Navigation State
    updateNavState(index);

    // 6. Update Button States
    updateButtonStates(index);
}

function updateButtonStates(index) {
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    if (!prevBtn || !nextBtn) return;

    const currentStep = stepsData[index];

    if (currentStep.category) {
        const categorySteps = stepsData.filter(s => s.category === currentStep.category);
        const firstCategoryStep = categorySteps[0];
        const lastCategoryStep = categorySteps[categorySteps.length - 1];

        // Disable Previous on first step of category
        prevBtn.disabled = (currentStep.id === firstCategoryStep.id);
        prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
        prevBtn.style.cursor = prevBtn.disabled ? "not-allowed" : "pointer";

        // Disable Next on last step of category
        nextBtn.disabled = (currentStep.id === lastCategoryStep.id);
        nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
        nextBtn.style.cursor = nextBtn.disabled ? "not-allowed" : "pointer";
    } else {
        // Default behavior for other categories if needed
        prevBtn.disabled = (index === 0);
        nextBtn.disabled = (index === stepsData.length - 1);
        prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
        nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
        prevBtn.style.cursor = prevBtn.disabled ? "not-allowed" : "pointer";
        nextBtn.style.cursor = nextBtn.disabled ? "not-allowed" : "pointer";
    }
}

function renderChecklist(items, stepId) {
    if (!checklistContainer) return;
    checklistContainer.innerHTML = '';

    items.forEach((itemText, index) => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';

        const storageKey = `step-${stepId}-item-${index}`;
        const isChecked = localStorage.getItem(storageKey) === 'true';

        label.innerHTML = `
            <input type="checkbox" ${isChecked ? 'checked' : ''} data-index="${index}">
            <span class="checkmark"></span>
            <span class="text">${i18n.t(`step_${stepId}_checklist_${index}`, itemText)}</span>
        `;

        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            localStorage.setItem(storageKey, e.target.checked);
            updateOverallProgress();
        });

        checklistContainer.appendChild(label);
    });
}

function renderTable(tableData) {
    if (!checklistContainer) return;
    checklistContainer.innerHTML = `
        <div class="custom-table-wrapper">
            <table class="dimensions-table">
                <thead>
                    <tr>
                        ${tableData.headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${tableData.rows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
function renderSpecs(items) {
    if (!specsContainer) return;
    specsContainer.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'specs-grid';

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'spec-grid-item';

        // If icon is provided, use it. Otherwise fall back to text label
        if (item.icon) {
            div.innerHTML = `
                <div class="spec-icon-wrapper">
                    <img src="${item.icon}" alt="${item.label}" class="spec-grid-icon">
                </div>
                <div class="spec-text-wrapper">
                    <span class="spec-label">${item.label}</span>
                    <span class="spec-value">${item.value}</span>
                </div>
            `;
        } else {
            div.className = 'spec-item'; // Revert to old style for simple items
            div.innerHTML = `
                <span class="label">${i18n.t(`spec_label_${item.label.toLowerCase().replace(/ /g, '_')}`, item.label)}</span>
                <span class="value">${i18n.t(`spec_value_${item.value.toLowerCase().replace(/ /g, '_')}`, item.value)}</span>
            `;
        }
        grid.appendChild(div);
    });
    specsContainer.appendChild(grid);
}

function updateNavState(index) {
    navItems.forEach(item => item.classList.remove('active'));
    // Find item that matches current step ID (more robust than index match if lists differ)
    // Find item that matches current step ID OR maps to Installation (ID 3)
    const currentStep = stepsData[index];
    let targetNavId = currentStep.id;

    // If it's a sub-step of a category, highlight the main category tab
    if (currentStep.category === "installation") {
        targetNavId = 3;
    } else if (currentStep.category === "flushing") {
        targetNavId = 4;
    }

    const matchingNavItem = Array.from(navItems).find(item => Number(item.dataset.step) === targetNavId);
    if (matchingNavItem) {
        matchingNavItem.classList.add('active');
    }
}

// New: Add Navigation Buttons dynamically
function addNavigationControls() {
    // Only add if not already present
    if (document.querySelector('.step-navigation-btns')) return;

    const stepInfo = document.querySelector('.step-info');
    if (!stepInfo) return; // Defensive check

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'step-navigation-btns';
    controlsDiv.innerHTML = `
        <button id="prev-step" class="control-btn-nav" data-i18n="btn_prev">${i18n.t('btn_prev', '← Previous')}</button>
        <button id="next-step" class="control-btn-nav" data-i18n="btn_next">${i18n.t('btn_next', 'Next Step →')}</button>
    `;
    // Append to step-info container
    stepInfo.appendChild(controlsDiv);

    // Logic
    document.getElementById('prev-step').addEventListener('click', () => {
        const currentStep = stepsData[currentStepIndex];

        if (currentStep.category) {
            const categorySteps = stepsData.filter(s => s.category === currentStep.category);
            const firstCategoryStep = categorySteps[0];
            if (currentStep.id === firstCategoryStep.id) return;
        }

        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(currentStepIndex);
        }
    });

    document.getElementById('next-step').addEventListener('click', () => {
        const currentStep = stepsData[currentStepIndex];

        if (currentStep.category) {
            const categorySteps = stepsData.filter(s => s.category === currentStep.category);
            const lastCategoryStep = categorySteps[categorySteps.length - 1];
            if (currentStep.id === lastCategoryStep.id) return;
        }

        if (currentStepIndex < stepsData.length - 1) {
            currentStepIndex++;
            renderStep(currentStepIndex);
        }
    });
}

// New: Calculate Overall Progress
function updateOverallProgress() {
    let totalItems = 0;
    let checkedItems = 0;

    stepsData.forEach(step => {
        step.checklist.forEach((_, itemIndex) => {
            totalItems++;
            const key = `step-${step.id}-item-${itemIndex}`;
            if (localStorage.getItem(key) === 'true') {
                checkedItems++;
            }
        });
    });

    const percent = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

    // Update DOM
    if (progressText) progressText.textContent = `${percent}%`;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
}


// Theme Logic
function setTheme(mode) {
    localStorage.setItem(THEME_KEY, mode);
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        if (themeLabel) themeLabel.textContent = 'Dark';
    } else {
        body.classList.remove('dark-mode');
        if (themeLabel) themeLabel.textContent = 'Light';
    }
}

// Event Listeners
function attachEventListeners() {
    // Robust Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const stepId = Number(item.dataset.step);
            const index = stepsData.findIndex(s => s.id === stepId);
            if (index !== -1) {
                currentStepIndex = index;
                renderStep(index);
            }
        });
    });

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            setTheme(e.target.checked ? 'dark' : 'light');
        });
    }

    // Video Interactions
    if (mainVideo) {
        // Overlay Click
        if (playOverlay) {
            playOverlay.addEventListener('click', () => {
                const currentSrc = mainVideo.getAttribute('src');
                if (currentSrc && currentSrc !== "") {
                    if (mainVideo.paused) {
                        mainVideo.play().catch(e => console.log("Video play error:", e));
                        playOverlay.style.opacity = '0';
                        playOverlay.style.pointerEvents = 'none';
                    }
                }
            });
        }

        // Show overlay on Pause or End
        mainVideo.addEventListener('pause', () => {
            if (playOverlay) {
                playOverlay.style.opacity = '1';
                playOverlay.style.pointerEvents = 'auto';
            }
        });

        mainVideo.addEventListener('ended', () => {
            if (playOverlay) {
                playOverlay.style.opacity = '1';
                playOverlay.style.pointerEvents = 'auto';
            }
        });

        // Video Progress
        mainVideo.addEventListener('timeupdate', () => {
            if (videoProgressBarFill && mainVideo.duration) {
                const percent = (mainVideo.currentTime / mainVideo.duration) * 100;
                videoProgressBarFill.style.width = `${percent}%`;
            }
        });
    }

    // Custom Control Bar Play Button
    if (customPlayBtn && mainVideo) {
        customPlayBtn.addEventListener('click', () => {
            if (mainVideo.paused) {
                mainVideo.play();
                if (playOverlay) {
                    playOverlay.style.opacity = '0';
                    playOverlay.style.pointerEvents = 'none';
                }
            } else {
                mainVideo.pause();
            }
        });
    }
}

// Start App
init();
