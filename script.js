// in this section of code we access HTML elements and save them as objects
// if necessary we add an eventListener to the elements
const alert = document.getElementsByClassName("alert")[0];

const submitButton = document.getElementsByClassName("submit-button")[0];
submitButton.addEventListener('click', handleSubmit);

const saveButton = document.getElementsByClassName("save-button")[0];
saveButton.addEventListener('click', handleSave);

const clearButton = document.getElementsByClassName("clear-button")[0];
clearButton.addEventListener('click', handleClear);

const nameInput = document.getElementById("input-text");
nameInput.addEventListener('input', handleInputChange);

const maleCheck = document.getElementById("male-check");
const femaleCheck = document.getElementById("female-check");

const resultGender = document.getElementsByClassName("result-gender")[0];
const resultProbability = document.getElementsByClassName("result-probability")[0];
const storageValue = document.getElementsByClassName("storage-value")[0];

// this function is called when the submit button is clicked
function handleSubmit(event){
    // preventing the default behaviour of a submit button
    event.preventDefault();
    // checking if the input is filled
    if (!nameInput.value){
        alert.innerHTML = "You must enter a name";
        alert.style = "display: flex";
        return;
    }
    // checking if the input value matches the space-or-character pattern
    if(!/^[a-zA-Z_ ]*$/.test(nameInput.value)){
        alert.innerHTML = "The name must contain only english characters and space";
        alert.style = "display: flex";
        return;
    }
    sendRequest();
}

// this function is called when the clear button is clicked
function handleClear(event) {
    event.preventDefault();
    // removing the saved key from the local storage
    localStorage.removeItem(nameInput.value);
    // setting the page state (no saved value => we don't display anything)
    storageValue.innerHTML = '';
}

// this function is called whenever the input's character changes
function handleInputChange(){
    // if the input matches any saved value we display that
    storageValue.innerHTML = JSON.parse(localStorage.getItem(nameInput.value)) || '';
    // resetting the page to an initial state
    resultGender.innerHTML = '';
    resultProbability.innerHTML = '';
    femaleCheck.checked = false;
    maleCheck.checked = false;
    // hiding the alert box
    alert.innerHTML = 'alert message'
    alert.style = "display: none";
}

function handleSave(event){
    // preventing the default behaviour of a submit button
    event.preventDefault();
    const key = nameInput.value;
    // checking if the input value contains any characters
    if (!key.replace(/ /g, "")){
        // display a suitable alert
        alert.innerHTML = "name is missing";
        alert.style = "display: flex";
        return;
    }
    // checking if the input value matches the space-or-character pattern
    if(!/^[a-zA-Z_ ]*$/.test(key)){
        // display a suitable alert
        alert.innerHTML = "The name must contain only english characters and space";
        alert.style = "display: flex";
        return;
    }
    // accessing the checked value (which gender is selected?)
    const gender = maleCheck.checked ? 'male' : (femaleCheck.checked ? 'female' : '');
    // checking if the radio button is checked
    if (!gender){
        // display a suitable alert
        alert.innerHTML = "You must choose a gender";
        alert.style = "display: flex";
        return;
    }
    // save the checked value in the storage
    localStorage.setItem(key, JSON.stringify(gender));
    // displaying the saved value on the page
    storageValue.innerHTML = gender;
}

function sendRequest(){
    fetch(`https://api.genderize.io/?name=${nameInput.value}`).then(response => {
        if(response.ok){
            // parsing the response body
            response.json().then(data => {
                // the gender field is empty in the response body
                if (!data.gender){
                    // display suitable alert
                    alert.innerHTML = `"${nameInput.value}" doesn't have any assigned gender`
                    alert.style = "display: flex";
                    return;
                }
                // display the result on the page
                resultGender.innerHTML = data.gender;
                resultProbability.innerHTML =`%${data.probability * 100}`;
                displaySavedItem();
            }).catch(error => {
                // error on parsing the response
                console.error(error);
            })
        }else {
            // the response doesn't have an OK state
            response.json().then(error => {
                // display suitable alert
                alert.innerHTML = `status code ${response.status}: ${error.error}`
                alert.style = "display: flex";
            });
        }
    }).catch(() => {
        //the server didn't send any response back
        // display suitable alert
        alert.innerHTML = `Connection Error`
        alert.style = "display: flex";
    });
}

// this function is called when we receive a response
// and displays the saved gender
// (actually this function is unnecessary cause we display the saved gender on each input change)
function displaySavedItem(){
    const savedGender = JSON.parse(localStorage.getItem(nameInput.value));
    if(!savedGender){
        storageValue.innerHTML = '';
    }else {
        storageValue.innerHTML = savedGender;
    }
}

