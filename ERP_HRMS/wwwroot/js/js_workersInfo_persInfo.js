async function personalInfo() {
 
    //save personal info button
    const jsWorkerInfoSaveBtn = document.querySelector('.jsWorkerInfoSaveBtn');
    jsWorkerInfoSaveBtn.addEventListener('click', clickPersInfoSaveBtn)
    
    //edit and update personal info button
}

function isPersonalInfoFieldsComplete() {
    //--check if data empty or not
    let jsPersInfoInput = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.jsPersInfoInput');
    let isValid = true;
    for (let i = 0; i < jsPersInfoInput.length; i++) {
        if (isNullOrWhiteSpace(jsPersInfoInput[i].value)) {
            jsPersInfoInput[i].classList.add('invalid');
            isValid = false;
        } else {
            jsPersInfoInput[i].classList.remove('invalid');
        }
    }
    return isValid;
}



async function clickPersInfoSaveBtn(e) {
    const jsWorkerInfoSaveBtn = document.querySelector('.jsWorkerInfoSaveBtn')
    //validation of input data
    if (!isPersonalInfoFieldsComplete()) return;

    //spinner
    jsWorkerInfoSaveBtn.appendChild(spinnerType01());

    //collecton of data
    let jsPersInfoInputs = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.jsPersInfoInput');
    let formData = new FormData();

    for (let i = 0; i < jsPersInfoInputs.length; i++) {
        formData.append(`${jsPersInfoInputs[i].getAttribute('name')}`, jsPersInfoInputs[i].value)
    }

    const options = {
        method: 'POST',
        body: formData
    }

    let data = await fetchData.postData('save-personal-information', options)

    //remove spinner
    jsWorkerInfoSaveBtn.querySelector('.jsSpinnerCont').remove();

    //validate return data
    if (data) {
        alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
    } else {
        return
    }

    //update data and change elemenet appearance
    localData.personalInfo.masterPersonID = data.masterPersonID;
    localData.personalInfo.employeeNumber = data.employeeNumber;
    localData.personalInfo.firstName = data.firstName;
    localData.personalInfo.middleName = data.middleName;
    localData.personalInfo.lastName = data.lastName;
    localData.personalInfo.dateOfBirth = dateFormat.yyyymmddDashed(data.dateOfBirth);

    //confirmed data is saved
    localData.personalInfo.isDataSaved = true;

    //display employee number
    const jsEmployeeNumberText = document.querySelector('.jsEmployeeNumberText');
    jsEmployeeNumberText.textContent = localData.personalInfo.employeeNumber;

    //disable save and enable edit
    disablePersInfoSaveAndEnableEditBtn();

    //disable input
    disablePersInfoInputBtn()

    //edit and update should run only after saved is done, thats why it located in here
    await personalInfoEditAndUpdate()

    jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

}

async function personalInfoEditAndUpdate() {
    const jsWorkerInfoEditBtns = document.querySelectorAll('.jsWorkerInfoEditBtn');
    for (let i = 0; i < jsWorkerInfoEditBtns.length; i++) {
        jsWorkerInfoEditBtns[i].addEventListener('click', clickEditUpdateBtn)
        async function clickEditUpdateBtn(e) {
            if (jsWorkerInfoEditBtns[i].classList.contains('jsWorkerInfoUpdateBtn')) {
                await clickPersInfoUpdateBtn(e)
            } else {
                clickPersInfoEditBtn(e)
            }
        }
    }
}


function clickPersInfoEditBtn(e) {
    //enable input
    let jsPersInfoInput = e.target.closest('.jsInputBtnCont').querySelector('.jsPersInfoInput')
    jsPersInfoInput.removeAttribute('disabled');
    jsPersInfoInput.classList.remove('disable-input');

    //change text edit to update
    e.currentTarget.textContent = 'UPDATE'

    //insert class for update
    e.currentTarget.classList.add('jsWorkerInfoUpdateBtn');
    e.currentTarget.classList.add('update-btn-active');

    //change local data isActive to true
    localData.personalInfo.isActive = true;

    //activate cancel button
    personalInfoCancelBtn()
}

async function clickPersInfoUpdateBtn(e) {

    const input = e.target.closest('.jsInputBtnCont').querySelector('.jsPersInfoInput');

    if (isNullOrWhiteSpace(input.value)) {
        input.classList.add('invalid');
        return;
    } else {
        input.classList.remove('invalid');
    }

    e.target.appendChild(spinnerType01());

    //update data via fetch api
    let formData = new FormData()
    formData.append('MasterPersonID', localData.personalInfo.masterPersonID);
    formData.append('PropertyName', input.getAttribute('name'));
    formData.append('PropertyValue', input.value);

    const options = {
        method: 'POST',
        body: formData
    }

    let data = await fetchData.postData('update-personal-information', options)

    // remove spinner
    e.target.querySelector('.jsSpinnerCont').remove();

    //validate return data
    if (!data) return


    //update data and change elemenet appearance
    localData.personalInfo[input.getAttribute('data-name')] = data.propertyValue;
    localData.personalInfo.isActive = false;

    console.log(localData.personalInfo)

    //change text update to edit
    e.target.textContent = 'EDIT'
    e.target.classList.remove('jsWorkerInfoUpdateBtn');
    e.target.classList.remove('update-btn-active');

    //disable input
    input.setAttribute('disabled', true);
    input.classList.add('disable-input');

   //disable cancel
    disableCancelBtn();
}

function personalInfoCancelBtn() {
    const jsWorkerInfoCancelBtn = document.querySelector('.jsWorkerInfoCancelBtn');
    jsWorkerInfoCancelBtn.addEventListener('click', clickPersonalInfoCancelBtn);
    //enable cancel button
    jsWorkerInfoCancelBtn.classList.remove('disable-btn');
    jsWorkerInfoCancelBtn.classList.add('workerinfo-btn');
}

function clickPersonalInfoCancelBtn() {

    //collect all pers info input
    const jsPersInfoInputs = document.querySelectorAll('.jsPersInfoInput');

    //loop through input
    for (let i = 0; i < jsPersInfoInputs.length; i++) {
        //find active input by searching disabled attribute
        if (!jsPersInfoInputs[i].hasAttribute('disabled')) {
            //disable inputs
            jsPersInfoInputs[i].setAttribute('disabled', true);
            jsPersInfoInputs[i].classList.add('disable-input');

            //change text update to edit
            const jsWorkerInfoEditBtn = jsPersInfoInputs[i].closest('.jsInputBtnCont').querySelector('.jsWorkerInfoEditBtn');
            jsWorkerInfoEditBtn.textContent = 'EDIT';
            jsWorkerInfoEditBtn.classList.remove('jsWorkerInfoUpdateBtn');
            jsWorkerInfoEditBtn.classList.remove('update-btn-active');

            //change local data isActive to true
            localData.personalInfo.isActive = false;

            //retrieve records
            const dataName = jsPersInfoInputs[i].getAttribute('data-name');

            jsPersInfoInputs[i].value = localData.personalInfo[dataName];
        }
    }

    disableCancelBtn()
}
function disableCancelBtn() {
    const jsWorkerInfoCancelBtn = document.querySelector('.jsWorkerInfoCancelBtn');

    //remove event listener
    jsWorkerInfoCancelBtn.removeEventListener('click', clickPersonalInfoCancelBtn);

    //disable cancel button
    jsWorkerInfoCancelBtn.classList.remove('workerinfo-btn');
    jsWorkerInfoCancelBtn.classList.add('disable-btn');
}

function disablePersInfoSaveAndEnableEditBtn() {

    //enable edit button
    const jsWorkerInfoEditBtns = document.querySelectorAll('.jsWorkerInfoEditBtn');
    for (let i = 0; i < jsWorkerInfoEditBtns.length; i++) {
        jsWorkerInfoEditBtns[i].classList.add('edit-btn-active');
    }

    //disable save button
    const jsWorkerInfoSaveBtn = document.querySelector('.jsWorkerInfoSaveBtn');
    jsWorkerInfoSaveBtn.classList.remove('workerinfo-btn');
    jsWorkerInfoSaveBtn.classList.add('disable-btn');

    //remove eventlistener
    jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)
}

function disablePersInfoInputBtn() {
    //disable input
    let jsPersInfoInputs = document.querySelectorAll('.jsPersInfoInput');
    for (let i = 0; i < jsPersInfoInputs.length; i++) {
        jsPersInfoInputs[i].setAttribute('disabled', true);
        jsPersInfoInputs[i].classList.add('disable-input');
    }
}

