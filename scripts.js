// Tooltip text for each step in the workflow
const stepTooltips = {
    1: 'Creates a new workspace with the specified subsystem deployment artifacts at home directory. Then navigate to workspace directory to pull 2 basic packages (VulcanStowconfig & Deployment Artifacts).',
    2: 'Pull additional service packages if specified.',
    3: 'Navigate to VulcanStowConfig directory for cherry pick if specified.',
    4: 'Navigate to different service package directory to apply Cherry Pick CR if specified, otherwise just build the local environment for specified station then navigate to workspace directory.',
    5: 'Navigate to the deployment artifacts directory and apply cherry pick if specified.',
    6: 'Modify docker-compose.yaml for image tag if needed.',
    7: 'Build the workflow using Deployment Artifacts package.',
    8: 'Rsync builded artifacts to the target deployment workflow directory.',
    9: 'Navigate to the workflow directory.',
    10: 'Execute the launch script to start the workflow.'
};

function stepHeader(stepNum) {
    return `<strong>Step ${stepNum}:</strong>`;
}
function toolTips(stepNum) {
    return `<span class="tooltip-btn">?<span class="tooltip-content">${stepTooltips[stepNum]}</span></span>`;
}

// Step functions for modular step generation
function step1(section, stepNum, workspace, eventId, mainlineValue) {
    let artifact = section === 'stow' ? 'VulcanReorientStowDeploymentArtifacts' : section === 'buffer' ? 'VulcanStowBufferDeploymentArtifacts' : 'VulcanInductTransferDeploymentArtifacts';
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(1)}
<code id="${section}Step${stepNum}">cd
brazil ws create --versionset VulcanStowUnifiedDeploymentArtifacts/development --name workspace-${workspace} ${eventId}
cd workspace-${workspace}
brazil ws --use --platform AL2_x86_64
brazil setup platform-support --force
brazil ws --use -p VulcanStowConfig -p ${artifact} ${mainlineValue}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step2(section, stepNum, packageNames) {
    let step2Packages = packageNames.length > 0 
        ? 'brazil ws --use ' + packageNames.map(pkg => `-p ${pkg}`).join(' ')
        : '';
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(2)}
<code id="${section}Step${stepNum}">${step2Packages}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step3(section, stepNum, vsconfig) {
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(3)}
<code id="${section}Step${stepNum}">cd src/VulcanStowConfig
${vsconfig}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step4(section, stepNum, packageNames, gitCommands, workcellId) {
    let step4Commands = packageNames.length > 0 
        ? packageNames.map((pkg, index) => `cd ../${pkg}\n${gitCommands[index]}\n`).join('\n') + `cd ../..\nbrazil-recursive-cmd --allPackages brazil-build`
        : `brazil-build local beta NAFulfillment Atlas Lab ${workcellId}\ncd ../..`;
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(4)}
<code id="${section}Step${stepNum}">${step4Commands}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step5(section, stepNum, deployArtifacts) {
    let artifact = section === 'stow' ? 'VulcanReorientStowDeploymentArtifacts' : section === 'buffer' ? 'VulcanStowBufferDeploymentArtifacts' : 'VulcanInductTransferDeploymentArtifacts';
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(5)}
<code id="${section}Step${stepNum}">cd src/${artifact}
${deployArtifacts}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step6(section, stepNum, imageTag) {
    let step6Command = `nano docker-compose.yaml\nTag image below:<br>\n${imageTag}`;
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(6)}
<code id="${section}Step${stepNum}">${step6Command}</code>
</div>`
    };
}
function step7(section, stepNum) {
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(7)}
<code id="${section}Step${stepNum}">brazil-build</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step8(section, stepNum, workspace) {
    let dir = section === 'stow' ? 'stow' : section === 'buffer' ? 'buffer' : 'induct_transfer';
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(8)}
<code id="${section}Step${stepNum}">sudo rsync -avzh -O --no-perms --no-owner --no-group --delete --stats --copy-links --exclude /build/private ./build/ /opt/carbon/${dir}/workflow-${workspace}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step9(section, stepNum, workspace) {
    let dir = section === 'stow' ? 'stow' : section === 'buffer' ? 'buffer' : 'induct_transfer';
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(9)}
<code id="${section}Step${stepNum}">cd /opt/carbon/${dir}/workflow-${workspace}</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}
function step10(section, stepNum) {
    return {
        html: `<div class="step">${stepHeader(stepNum)}${toolTips(10)}
<code id="${section}Step${stepNum}">./launch</code>
<button class="copy-btn" onclick="copyToClipboard('${section}Step${stepNum}')">Copy</button>
</div>`
    };
}

// Copy to clipboard utility for code blocks
function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text);
}

// Update workspace title as user types date/title
function updateWorkspaceTitle() {
    const testTitle = document.getElementById('testTitle').value || '[testTitle]';
    const testDate = document.getElementById('testDate').value || '[date]';
    const workspaceTitle = `${testDate}-${testTitle}`;
    document.getElementById('workspaceTitle').value = workspaceTitle;
}

// Ensure the generate button is bound to generateSteps

function generateSteps() {
    try {
        // Clear previous steps
        document.getElementById('stowSteps').innerHTML = '';
        document.getElementById('bufferSteps').innerHTML = '';
        document.getElementById('transferSteps').innerHTML = '';
        // Get general values from inputs
        const testTitle = document.getElementById('testTitle').value || '[testTitle]';
        const testDate = document.getElementById('testDate').value || '[date]';
        const workspace = document.getElementById('workspaceTitle').value || `${testDate}-${testTitle}`;
        // get mainline value
        const mainlineValues = toggleMainline();
        const stowMainlineValue = mainlineValues.stow;
        const bufferMainlineValue = mainlineValues.buffer;
        const transferMainlineValue = mainlineValues.transfer;
        //get event ID
        const eventIdValue = document.getElementById('stowEventId').value;
        const eventId = eventIdValue ? `--eventId ${eventIdValue}` : '';
        const bufferEventIdValue = document.getElementById('bufferEventId').value;
        const bufferEventId = bufferEventIdValue ? `--eventId ${bufferEventIdValue}` : '';
        const transferEventIdValue = document.getElementById('transferEventId').value;
        const transferEventId = transferEventIdValue ? `--eventId ${transferEventIdValue}` : '';
        //get workcell ID
        const stowWorkcellId = document.getElementById('stowWorkcellId').value || '[workcellId]'; 
        const bufferWorkcellId = document.getElementById('bufferWorkcellId').value || '[workcellId]'; 
        const transferWorkcellId = document.getElementById('transferWorkcellId').value || '[workcellId]';

        // Reset tab visibility
        document.getElementById('stowTabBtn').style.display = 'none';
        document.getElementById('transferTabBtn').style.display = 'none';
        document.getElementById('bufferTabBtn').style.display = 'none';

        let anySection = false;

        // Defensive: ensure global vsconfig variables exist
        if (typeof window.stowVsconfig === 'undefined') window.stowVsconfig = '';
        if (typeof window.bufferVsconfig === 'undefined') window.bufferVsconfig = '';
        if (typeof window.transferVsconfig === 'undefined') window.transferVsconfig = '';

        // Generate steps for Stow Section
        if (document.getElementById('stowCheckbox').checked) {
            anySection = true;
            const sectionID = 'stow';
            document.getElementById(`${sectionID}TabBtn`).style.display = 'inline-block';
            toggleVulcanStowConfig(sectionID, `${sectionID}VsConfigPickInput`, `${sectionID}Vsconfig`);
            const { packageNames, gitCommands } = getDynamicInputs(`${sectionID}DynamicInputs`);
            const imageTag = getImageTagInput(sectionID, `${sectionID}ImageTagInput`);
            const imageTagChecked = document.getElementById(`${sectionID}ImageTag`).checked;
            const deployArtifacts = getDeployArtifactsInput(sectionID, `${sectionID}DeployArtifactsPickInput`);
            let steps = [];
            let stepNum = 1;
            steps.push(step1(sectionID, stepNum++, workspace, eventId, stowMainlineValue).html);
            if (packageNames.length > 0) {
                steps.push(step2(sectionID, stepNum++, packageNames).html);
            }
            steps.push(step3(sectionID, stepNum++, window.stowVsconfig).html);
            steps.push(step4(sectionID, stepNum++, packageNames, gitCommands, stowWorkcellId).html);
            steps.push(step5(sectionID, stepNum++, deployArtifacts).html);
            if (imageTagChecked) {
                steps.push(step6(sectionID, stepNum++, imageTag).html);
            }
            steps.push(step7(sectionID, stepNum++).html);
            steps.push(step8(sectionID, stepNum++, workspace).html);
            steps.push(step9(sectionID, stepNum++, workspace).html);
            steps.push(step10(sectionID, stepNum++).html);
            document.getElementById('stowSteps').innerHTML = steps.join('');
        }
        // Generate steps for Buffer Section
        if (document.getElementById('bufferCheckbox').checked) {
            anySection = true;
            const sectionID = 'buffer';
            document.getElementById(`${sectionID}TabBtn`).style.display = 'inline-block';
            toggleVulcanStowConfig(sectionID, `${sectionID}VsConfigPickInput`, `${sectionID}Vsconfig`);
            const { packageNames, gitCommands } = getDynamicInputs(`${sectionID}DynamicInputs`);
            const imageTag = getImageTagInput(sectionID, `${sectionID}ImageTagInput`);
            const imageTagChecked = document.getElementById(`${sectionID}ImageTag`).checked;
            const deployArtifacts = getDeployArtifactsInput(sectionID, `${sectionID}DeployArtifactsPickInput`);
            let steps = [];
            let stepNum = 1;
            steps.push(step1(sectionID, stepNum++, workspace, bufferEventId, bufferMainlineValue).html);
            if (packageNames.length > 0) {
                steps.push(step2(sectionID, stepNum++, packageNames).html);
            }
            steps.push(step3(sectionID, stepNum++, window.bufferVsconfig).html);
            steps.push(step4(sectionID, stepNum++, packageNames, gitCommands, bufferWorkcellId).html);
            steps.push(step5(sectionID, stepNum++, deployArtifacts).html);
            if (imageTagChecked) {
                steps.push(step6(sectionID, stepNum++, imageTag).html);
            }
            steps.push(step7(sectionID, stepNum++).html);
            steps.push(step8(sectionID, stepNum++, workspace).html);
            steps.push(step9(sectionID, stepNum++, workspace).html);
            steps.push(step10(sectionID, stepNum++).html);
            document.getElementById('bufferSteps').innerHTML = steps.join('');
        }
        // Generate steps for Transfer Section
        if (document.getElementById('transferCheckbox').checked) {
            anySection = true;
            const sectionID = 'transfer';
            document.getElementById(`${sectionID}TabBtn`).style.display = 'inline-block';
            toggleVulcanStowConfig(sectionID, `${sectionID}VsConfigPickInput`, `${sectionID}Vsconfig`);
            const { packageNames, gitCommands } = getDynamicInputs(`${sectionID}DynamicInputs`);
            const imageTag = getImageTagInput(sectionID, `${sectionID}ImageTagInput`);
            const imageTagChecked = document.getElementById(`${sectionID}ImageTag`).checked;
            const deployArtifacts = getDeployArtifactsInput(sectionID, `${sectionID}DeployArtifactsPickInput`);
            let steps = [];
            let stepNum = 1;
            steps.push(step1(sectionID, stepNum++, workspace, transferEventId, transferMainlineValue).html);
            if (packageNames.length > 0) {
                steps.push(step2(sectionID, stepNum++, packageNames).html);
            }
            steps.push(step3(sectionID, stepNum++, window.transferVsconfig).html);
            steps.push(step4(sectionID, stepNum++, packageNames, gitCommands, transferWorkcellId).html);
            steps.push(step5(sectionID, stepNum++, deployArtifacts).html);
            if (imageTagChecked) {
                steps.push(step6(sectionID, stepNum++, imageTag).html);
            }
            steps.push(step7(sectionID, stepNum++).html);
            steps.push(step8(sectionID, stepNum++, workspace).html);
            steps.push(step9(sectionID, stepNum++, workspace).html);
            steps.push(step10(sectionID, stepNum++).html);
            document.getElementById('transferSteps').innerHTML = steps.join('');
        }
        // Show the steps guide and update button visibility
        document.getElementById('stepsGuide').style.display = anySection ? 'block' : 'none';
        document.getElementById('generateBtn').style.display = anySection ? 'none' : 'inline-block';
        document.getElementById('regenerateBtn').style.display = anySection ? 'inline-block' : 'none';
        document.getElementById('downloadBtn').style.display = anySection ? 'inline-block' : 'none';
        // Automatically open the first visible tab
        const firstVisibleTab = document.querySelector('.tab button[style*="inline-block"]');
        if (firstVisibleTab) {
            firstVisibleTab.click();
        }
        if (!anySection) {
            alert('Please select at least one section (Stow, Buffer, or Transfer) to generate steps.');
        }
    } catch (e) {
        console.error('Error generating steps:', e);
        alert('An error occurred while generating steps. Please check your input and try again.\n' + e);
    }
}

function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Remove active class from all tab links
    const tabLinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(' active', '');
    }

    // Show the current tab and add active class
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

function resetForm() {
    // Hide steps and show form
    document.getElementById('stepsGuide').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'inline-block';
    document.getElementById('regenerateBtn').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';
    // Reset all form fields
    document.getElementById('testTitle').value = '';
    document.getElementById('testDate').value = '';
    document.getElementById('workspaceTitle').value = '';

    // Reset all sections
    ['stow', 'buffer', 'transfer'].forEach(section => {
        // Reset checkboxes
        document.getElementById(`${section}Checkbox`).checked = false;
        document.getElementById(`${section}Section`).style.display = 'none';
        document.getElementById(`${section}Mainline`).checked = false;
        document.getElementById(`${section}VsConfigPick`).checked = false;
        document.getElementById(`${section}ImageTag`).checked = false;
        document.getElementById(`${section}CherryPick`).checked = false;
        document.getElementById(`${section}DeployArtifactsPick`).checked = false;

        // Reset input values
        document.getElementById(`${section}EventId`).value = '';
        document.getElementById(`${section}WorkcellId`).value = '';
        document.getElementById(`${section}VsConfigPickValue`).value = '';
        document.getElementById(`${section}ImageTagValue`).value = '';
        document.getElementById(`${section}DeployArtifactsPickValue`).value = '';

        // Reset input boxes display
        document.getElementById(`${section}VsConfigPickInput`).style.display = 'none';
        document.getElementById(`${section}ImageTagInput`).style.display = 'none';
        document.getElementById(`${section}DeployArtifactsPickInput`).style.display = 'none';
        document.getElementById(`${section}CherryPickSection`).style.display = 'none';
        document.getElementById(`${section}AddBtn`).style.display = 'none';

        // Clear dynamic inputs
        const dynamicInputsContainer = document.getElementById(`${section}DynamicInputs`);
        while (dynamicInputsContainer.firstChild) {
            dynamicInputsContainer.removeChild(dynamicInputsContainer.firstChild);
        }

        // Clear steps content
        document.getElementById(`${section}Steps`).innerHTML = '';
        document.getElementById(`${section}TabBtn`).style.display = 'none';
    });

    // Clear any global variables used for configs
    window.stowVsconfig = '';
    window.bufferVsconfig = '';
    window.transferVsconfig = '';
}

// Show/hide cherry-pick section and add button
function toggleCherryPickSection(sectionId, buttonId) {
    const section = document.getElementById(sectionId);
    const button = document.getElementById(buttonId);
    const isVisible = section.style.display === 'block';
    section.style.display = isVisible ? 'none' : 'block';
    button.style.display = isVisible ? 'none' : 'inline-block';
}

// Add dynamic cherry-pick input fields
function addDynamicInputs(sectionId) {
    const section = document.getElementById(sectionId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'form-group dynamic-input-group';
    inputGroup.innerHTML = `
        <label>Enter Package Name:</label>
        <input type="text" placeholder="Beware case sensitive">
        <label>Cherry Pick Command:</label>
        <textarea placeholder="Paste Cherry Pick here"></textarea>
        <button class="delete-btn" onclick="deleteDynamicInput(this)" style="background-color: #f44336; color: white; border: none; border-radius: 4px; padding: 3px 8px; font-size: 12px; cursor: pointer;">Delete</button>
    `;
    section.appendChild(inputGroup);
}

function deleteDynamicInput(button) {
    const inputGroup = button.parentElement;
    inputGroup.remove();
}

// Show/hide add button for cherry-pick
function toggleAddButton(checkboxId, buttonId) {
    const checkbox = document.getElementById(checkboxId);
    const button = document.getElementById(buttonId);
    button.style.display = checkbox.checked ? 'inline-block' : 'none';
}

// Show/hide section (stow, buffer, transfer) based on checkbox
function toggleSection(sectionId) {
    const checkbox = document.getElementById(sectionId.replace('Section', 'Checkbox'));
    const section = document.getElementById(sectionId);
    if (checkbox && section) {
        section.style.display = checkbox.checked ? 'block' : 'none';
    }
}

// Show/hide troubleshooting panel
function toggleTroubleshoot() {
    const panel = document.getElementById('troubleshootPanel');
    const currentVersion = document.getElementById('version');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        currentVersion.style.display = 'none';
        
    } else {
        panel.style.display = 'none';
        currentVersion.style.display = 'block';
    }
}

// Regenerate steps (reset tabs, rerun generateSteps)
function regenerate() {
    const stowTabBtn = document.getElementById('stowTabBtn');
    const bufferTabBtn = document.getElementById('bufferTabBtn');
    const transferTabBtn = document.getElementById('transferTabBtn');
    
    stowTabBtn.style.display = 'none';
    bufferTabBtn.style.display = 'none';
    transferTabBtn.style.display = 'none';
    
    generateSteps();
}

// Download configuration function
function downloadConfig() {
    // Get mainline values for each section
    const mainlineValues = toggleMainline();
    
    // Create configuration object
    const config = {
        workspaceTitle: document.getElementById('workspaceTitle').value,
        sections: {}
    };
    
    // Only add sections that are checked
    if (document.getElementById('stowCheckbox').checked) {
        config.sections.stow = {
            workcellId: document.getElementById('stowWorkcellId').value,
            eventId: document.getElementById('stowEventId').value,
            mainline: mainlineValues.stow,
            imageTag: document.getElementById('stowImageTagValue').value,
            vsConfigCR: document.getElementById('stowVsConfigPickValue').value,
            deployArtifactsCR: document.getElementById('stowDeployArtifactsPickValue').value,
            additionalPackages: getDynamicInputs('stowDynamicInputs').packageNames.map(pkg => `-p ${pkg}`)
        };
    }
    
    if (document.getElementById('bufferCheckbox').checked) {
        config.sections.buffer = {
            workcellId: document.getElementById('bufferWorkcellId').value,
            eventId: document.getElementById('bufferEventId').value,
            mainline: document.getElementById('bufferMainline').checked,
            imageTag: document.getElementById('bufferImageTagValue').value,
            vsConfigCR: document.getElementById('bufferVsConfigPickValue').value,
            deployArtifactsCR: document.getElementById('bufferDeployArtifactsPickValue').value,
            additionalPackages: getDynamicInputs('bufferDynamicInputs').packageNames.map(pkg => `-p ${pkg}`)
        };
    }
    
    if (document.getElementById('transferCheckbox').checked) {
        config.sections.transfer = {
            workcellId: document.getElementById('transferWorkcellId').value,
            eventId: document.getElementById('transferEventId').value,
            mainline: document.getElementById('transferMainline').checked,
            imageTag: document.getElementById('transferImageTagValue').value,
            vsConfigCR: document.getElementById('transferVsConfigPickValue').value,
            deployArtifactsCR: document.getElementById('transferDeployArtifactsPickValue').value,
            additionalPackages: getDynamicInputs('transferDynamicInputs').packageNames.map(pkg => `-p ${pkg}`)
        };
    }

    // Convert to JSON string with pretty formatting
    const configJson = JSON.stringify(config, null, 2);
    
    // Create blob and download
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show/hide input boxes for cherry-pick, image tag, etc.
function toggleInput(inputId) {
    const inputBox = document.getElementById(inputId);
    const checkboxId = inputId.replace('Input', '');
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && inputBox) {
        inputBox.style.display = checkbox.checked ? 'block' : 'none';
    }
}

// Mainline toggle: returns mainline/branch flags for each section
function toggleMainline() {
    const stowMainlineCheckbox = document.getElementById('stowMainline');
    const bufferMainlineCheckbox = document.getElementById('bufferMainline');
    const transferMainlineCheckbox = document.getElementById('transferMainline');
    const mainlineValues = {
        stow: stowMainlineCheckbox && stowMainlineCheckbox.checked ? '--branch mainline' : '--latest',
        buffer: bufferMainlineCheckbox && bufferMainlineCheckbox.checked ? '--branch mainline' : '--latest',
        transfer: transferMainlineCheckbox && transferMainlineCheckbox.checked ? '--branch mainline' : '--latest'
    };
    return mainlineValues;
}

document.addEventListener('DOMContentLoaded', function() {
    // Set the version text in the UI
    const ver = "v7.0";
    document.getElementById("version").innerHTML = ver;

    // Set build tracking links for Event ID fields
    const eventIdUrl = 'https://quip-amazon.com/mDNJApkofexx/Vulcan-Stow-Daily-QA-Build-Tracking#temp:C:aIT0dcbc4e1e1544ad1be71c2d3c'
    const links = document.querySelectorAll('.build-tracking');
    links.forEach(link => {
        link.href = eventIdUrl;
        link.target = 'tracking';
    });

    // Bind add button toggles for cherry-pick checkboxes
    document.getElementById('stowCherryPick').addEventListener('change', () => toggleAddButton('stowCherryPick', 'stowAddBtn'));
    document.getElementById('bufferCherryPick').addEventListener('change', () => toggleAddButton('bufferCherryPick', 'bufferAddBtn'));
    document.getElementById('transferCherryPick').addEventListener('change', () => toggleAddButton('transferCherryPick', 'transferAddBtn'));

    // Ensure add buttons are hidden on page load
    document.getElementById('stowAddBtn').style.display = 'none';
    document.getElementById('bufferAddBtn').style.display = 'none';
    document.getElementById('transferAddBtn').style.display = 'none';

    // Bind add dynamic input buttons
    document.getElementById('stowAddBtn').onclick = () => addDynamicInputs('stowDynamicInputs');
    document.getElementById('bufferAddBtn').onclick = () => addDynamicInputs('bufferDynamicInputs');
    document.getElementById('transferAddBtn').onclick = () => addDynamicInputs('transferDynamicInputs');

    // Bind checkbox change events to toggleSection for each section
    document.getElementById('stowCheckbox').addEventListener('change', function() {
        toggleSection('stowSection');
    });
    document.getElementById('bufferCheckbox').addEventListener('change', function() {
        toggleSection('bufferSection');
    });
    document.getElementById('transferCheckbox').addEventListener('change', function() {
        toggleSection('transferSection');
    });

    // Bind checkbox change events for image tag, Vulcan Stow Config, and Deployment Artifacts
    ['stow', 'buffer', 'transfer'].forEach(section => {
        document.getElementById(`${section}ImageTag`).addEventListener('change', function() {
            toggleInput(`${section}ImageTagInput`);
        });
        document.getElementById(`${section}VsConfigPick`).addEventListener('change', function() {
            toggleInput(`${section}VsConfigPickInput`);
        });
        document.getElementById(`${section}DeployArtifactsPick`).addEventListener('change', function() {
            toggleInput(`${section}DeployArtifactsPickInput`);
        });
    });
});

function toggleVulcanStowConfig(sectionId, inputBoxId, variableName) {
    const checkbox = document.getElementById(`${sectionId}VsConfigPick`);
    const inputBox = document.getElementById(inputBoxId);
    let vsconfig = '';

    if (checkbox && checkbox.checked) {
        inputBox.style.display = 'block';
        vsconfig = document.getElementById(`${sectionId}VsConfigPickValue`).value.trim();
    } else if (inputBox) {
        inputBox.style.display = 'none';
        vsconfig = '';
    }

    window[variableName] = vsconfig; // Store the value in a global variable dynamically
}

// Add missing getDynamicInputs function
function getDynamicInputs(sectionId) {
    const packageNames = [];
    const gitCommands = [];
    const inputGroups = document.querySelectorAll(`#${sectionId} .dynamic-input-group`);
    inputGroups.forEach(group => {
        const packageName = group.querySelector('input[type="text"]').value.trim();
        const gitCommand = group.querySelector('textarea').value.trim();
        if (packageName && gitCommand) {
            packageNames.push(packageName);
            gitCommands.push(gitCommand);
        }
    });
    return { packageNames, gitCommands };
}

// Add missing getImageTagInput function
function getImageTagInput(sectionId, inputBoxId) {
    const checkbox = document.getElementById(`${sectionId}ImageTag`);
    let imageTag = '';
    if (checkbox && checkbox.checked) {
        const valueEl = document.getElementById(`${sectionId}ImageTagValue`);
        if (valueEl) {
            imageTag = valueEl.value.trim();
        }
    }
    return imageTag;
}

// Add missing getDeployArtifactsInput function
function getDeployArtifactsInput(sectionId, inputBoxId) {
    const checkbox = document.getElementById(`${sectionId}DeployArtifactsPick`);
    let deployArtifacts = '';
    if (checkbox && checkbox.checked) {
        const valueEl = document.getElementById(`${sectionId}DeployArtifactsPickValue`);
        if (valueEl) {
            deployArtifacts = valueEl.value.trim();
        }
    }
    return deployArtifacts;
}
