// mock data for list of all sprayers (replace with database)
const allSprayers = [
    { name: 'Nguyen Van B', type: 'Adept', available: true },
    { name: 'Tran Van C', type: 'Expert', available: false },
    { name: 'Le Van D', type: 'Expert', available: true },
    { name: 'Nguyen Van A', type: 'Apprentice', available: true },
    { name: 'Phan Van E', type: 'Apprentice', available: false }
];

const addSprayerButton = document.getElementById('addSprayerButton');
const sprayerSelectContainer = document.getElementById('sprayerSelectContainer');
const sprayerSelect = document.getElementById('sprayerSelect');
const sprayerError = document.getElementById('sprayerError');
const noSprayerMessage = document.getElementById('noSprayerMessage');
const assignedSprayerContainer = document.getElementById('assignedSprayerContainer');

// Initial flag to check if an apprentice is already added
let apprenticeAdded = false;

// Function to update the sprayer select dropdown
function updateSprayerDropdown() {
    sprayerSelect.innerHTML = ''; // Clear current options
    allSprayers.forEach(sprayer => {
        const option = document.createElement('option');
        option.value = `${sprayer.name} (${sprayer.type})`;
        option.textContent = `${sprayer.name} (${sprayer.type})`;

        // If the sprayer is unavailable or if an apprentice is already added, disable apprentice options
        if (!sprayer.available || (apprenticeAdded && sprayer.type === 'Apprentice')) {
            option.disabled = true;
        }

        sprayerSelect.appendChild(option);
    });
}

// Function to handle Add Sprayer Button Click
addSprayerButton.addEventListener('click', function() {
    // If the select container is hidden, show it with animation
    if (sprayerSelectContainer.classList.contains('d-none')) {
        sprayerSelectContainer.classList.remove('d-none');
        sprayerSelectContainer.classList.add('fade-in'); // Add animation
    } 
    // If the select container is visible, and a sprayer is selected, add the sprayer
    else {
        const selectedSprayerText = sprayerSelect.options[sprayerSelect.selectedIndex].text;
        const selectedSprayerValue = sprayerSelect.value;

        if (selectedSprayerValue !== "") {
            // Extract the type of the sprayer (Adept, Expert, Apprentice)
            const sprayerType = selectedSprayerText.split('(')[1].replace(')', '').trim();

            // Add the selected sprayer to the assigned list
            const newSprayerDiv = document.createElement('div');
            newSprayerDiv.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'my-2');
            newSprayerDiv.innerHTML = `
                <h5 class="m-0">${selectedSprayerText.split('(')[0]}</h5>
                <div class="badge bg-secondary">
                    <h6 class="m-0">${selectedSprayerText.split('(')[1].replace(')', '')}</h6>
                </div>
            `;
            assignedSprayerContainer.appendChild(newSprayerDiv);

            // Hide the select container and reset it
            sprayerSelectContainer.classList.add('d-none');
            sprayerSelectContainer.classList.remove('fade-in');
            sprayerSelect.value = ""; // Reset select box
            
            // Logic after adding the first sprayer
            if (sprayerType === 'Apprentice') {
                // If the first sprayer is an apprentice, show the error message and keep button enabled
                sprayerError.classList.remove('d-none');
                sprayerError.textContent = 'An Adept or Expert sprayer is required when assigning an Apprentice.'
                apprenticeAdded = true;
                updateSprayerDropdown(); // Update dropdown to disable apprentice sprayers
            } else {
                // If the first sprayer is adept or expert, hide the button and error message
                sprayerError.classList.add('d-none');
                addSprayerButton.disabled = true;
            }
            noSprayerMessage.classList.add('d-none');
        }
    }
});

// Initial check: if no sprayers assigned, show the error message
if (assignedSprayerContainer.childElementCount === 0) {
    sprayerError.textContent = 'Please assign at least one sprayer to this order.';
    sprayerError.classList.remove('d-none');
    noSprayerMessage.classList.remove('d-none');
}

// Update the dropdown initially
updateSprayerDropdown();


const totalCost = 150000; // example total cost
const receiveAmountInput = document.getElementById('receiveAmount');
const changeContainer = document.getElementById('changeContainer');
const changeAmount = document.getElementById('changeAmount');

// Listen for input changes in the received amount
receiveAmountInput.addEventListener('input', function() {
    const receiveAmount = parseInt(receiveAmountInput.value);
    
    if (isNaN(receiveAmount) || receiveAmount < 0) {
        changeContainer.classList.add('d-none');
        return;
    }
    
    if (receiveAmount >= totalCost) {
        // Calculate the change
        const change = receiveAmount - totalCost;
        changeAmount.textContent = change.toLocaleString() + ' VND';
        changeContainer.classList.remove('d-none');
    } else {
        changeContainer.classList.add('d-none');
    }
});
