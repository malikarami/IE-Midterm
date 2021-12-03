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

function handleSubmit(event){
    event.preventDefault();
    sendRequest();
}

function handleClear(event) {
    event.preventDefault();
    localStorage.removeItem(nameInput.value);
    storageValue.innerHTML = '';
}

function handleInputChange(){
    console.log(nameInput.value);
    storageValue.innerHTML = JSON.parse(localStorage.getItem(nameInput.value)) || '';
    resultGender.innerHTML = '';
    resultProbability.innerHTML = '';
    femaleCheck.checked = false;
    maleCheck.checked = false;
}

function handleSave(event){
    event.preventDefault();
    const key = nameInput.value;
    if (!key){
        window.alert("You must enter a name");
        return;
    }
    if(!/^[a-zA-Z_ ]*$/.test(key)){
        window.alert("The name must contain only name and space");
        return;
    }
    const gender = maleCheck.checked ? 'male' : (femaleCheck.checked ? 'female' : '');
    if (!gender){
        window.alert("You must choose a gender");
        return;
    }
    localStorage.setItem(key, JSON.stringify(gender));
    storageValue.innerHTML = gender;
}

function displaySavedItem(){
    const savedGender = JSON.parse(localStorage.getItem(nameInput.value));
    if(!savedGender){
        storageValue.innerHTML = '';
    }else {
        storageValue.innerHTML = savedGender;
    }
}

function sendRequest(){
    fetch(`https://api.genderize.io/?name=${nameInput.value}`).then(response => {
        if(response.ok){
            response.json().then(data => {
                resultGender.innerHTML = data.gender;
                resultProbability.innerHTML = `%${data.probability * 100}`;
                displaySavedItem();
            }).catch(error => {
                // error on parsing the response
                console.error(error);
            })
        }else{
            // the response has not met 200 status
            const status = response.status;
            console.log('status', status);
        }
    }).catch(error => console.error(error)); //the server didn't send any response back
}


