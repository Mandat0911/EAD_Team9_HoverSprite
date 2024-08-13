// Function to handle dropdown selection
function setupDropdown(dropdownId, iconId) {
    document.querySelectorAll(`#${dropdownId} .dropdown-item`).forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            // Get the selected value and icon class
            const selectedText = this.innerText.trim();
            const selectedIconClass = this.getAttribute('data-icon');

            // Update the dropdown button text and icon
            const dropdownButton = document.querySelector(`#${dropdownId} .dropdown-toggle`);
            const icon = document.getElementById(iconId);

            dropdownButton.innerHTML = `<i class="${selectedIconClass}"></i> ${selectedText}`;
            icon.className = `${selectedIconClass}`; // Update the icon class
            
            // Optionally, log the selected value
            console.log(`Selected Value: ${this.getAttribute('data-value')}`);
        });
    });
}

// Setup dropdowns
setupDropdown('priorityDropdown', 'priorityIcon');
setupDropdown('statusDropdown', 'statusIcon');
