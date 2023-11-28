// Global variable for the API base URL
const baseURL = "http://numbersapi.com/";

/**
 * Makes a generic AJAX request to the Numbers API.
 *
 * @param {Object} queryParams - Parameters for the API request.
 * @param {string} endpoint - API endpoint for the request.
 * @returns {Promise<string>} - A Promise that resolves with the API response.
 */
async function makeAPIRequest(queryParams, endpoint) {
    try {
        // Construct the complete URL for the API request
        const url = new URL(`${baseURL}${queryParams.number}/${endpoint}`);

        // Use the Fetch API to make an asynchronous request
        const response = await fetch(url);

        // Check if the response is successful; otherwise, throw an error
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        // Extract and return the response data as text
        const data = await response.text();
        return data;
    } catch (error) {
        // Handle and log errors that may occur during the API request
        console.error("Error in the API request:", error);
        throw error;
    }
}

/**
 * Adds double-click event listener to li elements for copying.
 *
 * @param {HTMLLIElement} liElement - The li element to which the event listener will be added.
 */
function addCopyEvent(liElement) {
    liElement.addEventListener("dblclick", function (event) {
        // Create a div element for the "Copied" message
        const copiedMessage = document.createElement("div");
        copiedMessage.textContent = "Copied!";
        copiedMessage.classList.add("copied-message");

        // Calculate the center position relative to the li element
        const liRect = liElement.getBoundingClientRect();
        const liCenterX = liRect.left + liRect.width / 2;
        const messageWidth = copiedMessage.offsetWidth;
        copiedMessage.style.left = `${liCenterX - messageWidth / 2}px`;
        copiedMessage.style.top = `${liRect.top - 20}px`;

        // Append the message to the document
        document.body.appendChild(copiedMessage);

        // Remove the message after a short delay
        setTimeout(() => {
            document.body.removeChild(copiedMessage);
        }, 1000); // Adjust the delay (in milliseconds) as needed

        // Create a textarea element to hold the text
        const textarea = document.createElement("textarea");
        textarea.value = liElement.textContent;

        // Append the textarea to the document
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text to the clipboard
        document.execCommand("copy");

        // Remove the textarea from the document
        document.body.removeChild(textarea);
    });
}

/**
 * Updates the DOM with the provided element.
 *
 * @param {Object|string} element - Element to be added to the DOM.
 * @param {string} endpoint - API endpoint associated with the element.
 */
function addDOM(element, endpoint) {
    const outputDiv = document.getElementById("output");
    const content = element;
    const paragraph = document.createElement("li");

    if (content.number !== undefined) {
        // Extract numeric part from the key and remove it from the endpoint
        const keyWithoutNumber = `${content.number}:`.replace(/\D/g, '');
        endpoint = endpoint.replace(keyWithoutNumber, '').trim();
        paragraph.textContent = `${content.number}: ${endpoint}`;
    } else {
        paragraph.textContent = `${element}: ${endpoint}`;
    }

    // Insert the new paragraph at the beginning of the output div
    outputDiv.insertBefore(paragraph, outputDiv.firstChild);

    // Add double-click event listener for copying
    addCopyEvent(paragraph);
}

/**
 * Clears the information displayed on the DOM.
 */
function clearInfo() {
    const outputDiv = document.getElementById("output");
    // Remove all child elements from the output div
    outputDiv.innerHTML = "";
}

/**
 * Displays number data for a specific endpoint.
 *
 * @param {Object} queryParams - Parameters for the API request.
 * @param {string} endpoint - API endpoint for the request.
 */
async function displayNumberData(queryParams, endpoint) {
    try {
        // Make an API request and get the response data
        const data = await makeAPIRequest(queryParams, endpoint);
        // Add the data to the DOM for display
        addDOM(queryParams, data);
    } catch (error) {
        // Handle and log errors that may occur during data display
        console.error("Error in displaying number data:", error);
    }
}

/**
 * Gets the input number from the input field.
 *
 * @returns {Object|null} - An object with the number property, or null if input is invalid.
 */
function getInputNumber() {
    // Get the value from the input field
    const inputNumber = document.getElementById("numberInput").value;

    // Get the error message element
    const errorMsg = document.getElementById("errorMsg");

    // Check if the input is empty or not a number; show an error message if invalid
    if (inputNumber === "" || isNaN(inputNumber)) {
        errorMsg.textContent = "Please enter a number.";
        errorMsg.style.display = "block";
        return null; // Return null for invalid input and stop further execution
    }

    // Check if the input number is negative; show an error message if invalid
    if (inputNumber < 0) {
        errorMsg.textContent = "Please enter a positive number.";
        errorMsg.style.display = "block";
        return null; // Return null for invalid input and stop further execution
    }

    // Clear the error message if input is valid
    errorMsg.textContent = "";
    errorMsg.style.display = "none";

    // Return an object with the input number
    return { number: inputNumber };
}


/**
 * Clears the input field when the "Escape" key is pressed.
 *
 * @param {Event} event - The keyboard event object.
 */
function clearOnEscape(event) {
    // Get the input field element
    const inputField = document.getElementById("numberInput");

    // Check if the "Escape" key is pressed
    if (event.key === "Escape") {
        // Clear the input field value
        inputField.value = "";
    }
}

// Event listener for the "Escape" key
document.addEventListener("keydown", clearOnEscape);

/**
 * Gets and displays trivia information for a number.
 */
function trivia() {
    // Get the input number from the user
    const inputNumber = getInputNumber();

    // If input is invalid, stop further execution
    if (inputNumber === null) {
        return;
    }

    // Display trivia information for the input number
    displayNumberData(inputNumber, "trivia?fragment");
}

/**
 * Gets and displays math information for a number.
 */
function math() {
    // Get the input number from the user
    const inputNumber = getInputNumber();

    // If input is invalid, stop further execution
    if (inputNumber === null) {
        return;
    }

    // Display math information for the input number
    displayNumberData(inputNumber, "math?write");
}

/**
 * Gets and displays date information for a number.
 */
function date() {
    // Get the input number from the user
    const inputNumber = getInputNumber();

    // If input is invalid, stop further execution
    if (inputNumber === null) {
        return;
    }

    // Display date information for the input number
    displayNumberData(inputNumber, "year");
}

/**
 * Gets and displays random information for a number based on user choice.
 *
 * @param {string} choice - User choice for random information (1 for trivia, 2 for math, 3 for date).
 */
function random(choice) {
    // Generate a random input number between 0 and 999
    const inputNumber = { number: Math.floor(Math.random() * 1000) };

    // Display random information based on the user's choice
    if (choice == "1") {
        displayNumberData(inputNumber, "trivia");
    }
    if (choice == "2") {
        displayNumberData(inputNumber, "math");
    }
    if (choice == "3") {
        displayNumberData(inputNumber, "date");
    }
}

/**
 * Adds a listener for the "Ctrl + Alt + C" key combination to clear information on the page.
 */
function addClearButtonListener() {
    document.addEventListener('keydown', function (event) {
        // Check if the "Ctrl + Alt + C" key combination is pressed
        if (event.ctrlKey && event.altKey && event.code === 'KeyC') {
            // Call the function to clear information on the page
            clearInfo();
        }
    });
}

// Call the function to activate the listener for clearing information
addClearButtonListener();
