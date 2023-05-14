//2. WORKERS BENIFITS *****************************************************************************//
async function workersBenifits() {

    //save benifits button*******************************************************
    const jsBenifitsSaveBtn = document.querySelector('.jsBenifitsSaveBtn');
    jsBenifitsSaveBtn.addEventListener('click', clickBenifitsSaveBtn)
    
    
}

//save benifits
async function clickBenifitsSaveBtn(e) {
    //check first if personal info is save or active
    if (!localData.personalInfo.isDataSaved) {
        await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
        return;
    }

    if (localData.personalInfo.isActive) {
        await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
        return;
    }

    //validate input if valid
    //****it is ok if empty**/

    //regex validate
    if (!isRegexBenifitsValidationPassed()) return;


    //fetch data
    //collecton of data
    const jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
    const formData = new FormData();

    for (let i = 0; i < jsBenifitsInputs.length; i++) {
        let value = jsBenifitsInputs[i].value
        if (isNullOrWhiteSpace(jsBenifitsInputs[i].value)) {
            value = null;
        }
        formData.append(jsBenifitsInputs[i].getAttribute('name'), value)
    }

    formData.append('MasterPersonID', localData.personalInfo.masterPersonID)


    const options = {
        method: 'POST',
        body: formData
    }

    //fetch api
    const data = await fetchData.postData('save-benifits', options)

    if (data) {
        alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
    } else {
        return
    }

    //update local data

    localData.benifits.umidNumber = (data.umidNumber == 'null') ? '' : data.umidNumber;
    localData.benifits.sssNumber = (data.sssNumber == 'null') ? '' : data.sssNumber;
    localData.benifits.pagIbigNumber = (data.pagIbigNumber == 'null') ? '' : data.pagIbigNumber;
    localData.benifits.philHealthNumber = (data.philHealthNumber == 'null') ? '' : data.philHealthNumber;

    //disable save buttons and enable edit
    disableBeniftsSaveAndEnableEditBtn()

    //disable input
    disableBenifitsInput()

    //edit and update should run only after saved is done, thats why it located in here
    await benifitsEditAndUpdate()
}

//benifits and updates
async function benifitsEditAndUpdate() {
    const jsBenifitsEditBtns = document.querySelectorAll('.jsBenifitsEditBtn');
    for (let i = 0; i < jsBenifitsEditBtns.length; i++) {
        jsBenifitsEditBtns[i].addEventListener('click', clickBenifitsEditUpdateBtn)

        async function clickBenifitsEditUpdateBtn(e) {
            if (jsBenifitsEditBtns[i].classList.contains('jsBenifitsUpdateBtn')) {
                await clickBenifitsUpdateBtn(e)
            } else {
                clickBenifitsEditBtn(e)
            }
        }
    }
}

function clickBenifitsEditBtn(e) {

    //enable input
    let jsBenifitsInput = e.target.closest('.jsInputBtnCont').querySelector('.jsBenifitsInput');
    console.log(jsBenifitsInput)
    jsBenifitsInput.removeAttribute('disabled');
    jsBenifitsInput.classList.remove('disable-input');

    //change text edit to update
    e.currentTarget.textContent = 'UPDATE'

    //insert class for update
    e.currentTarget.classList.add('jsBenifitsUpdateBtn');
    e.currentTarget.classList.add('update-btn-active');

    //activate cancel button
    benifitsCancelBtn()
}

async function clickBenifitsUpdateBtn(e) {

    //check input if emppty
    //**ok if empty

    //regex
    if (!isRegexBenifitsValidationPassed()) return;


    //update data via fetch api
    e.target.appendChild(spinnerType01());

    const jsBenifitsInput = e.target.closest('.jsInputBtnCont').querySelector('.jsBenifitsInput');
    const PropertyName = jsBenifitsInput.getAttribute('name');
    const PropertyValue = jsBenifitsInput.value;

    const formData = new FormData();
    formData.append('MasterPersonID', localData.personalInfo.masterPersonID)
    formData.append('PropertyName', PropertyName)
    formData.append('PropertyValue', PropertyValue)


    for (const pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }


    const options = {
        method: 'POST',
        body: formData
    }
    let data = await fetchData.postData('update-benifits', options)
    console.log(data)

    // remove spinner
    e.target.querySelector('.jsSpinnerCont').remove();

    if (!data) return;

    //update data and change elemenet appearance
    localData.benifits[jsBenifitsInput.getAttribute('data-name')] = data.propertyValue;

    console.log(localData.benifits)

    //change text update to edit
    e.target.textContent = 'EDIT'
    e.target.classList.remove('jsBenifitsUpdateBtn');
    e.target.classList.remove('update-btn-active');

    //disable input
    jsBenifitsInput.setAttribute('disabled', true);
    jsBenifitsInput.classList.add('disable-input');

    //disable cancel, from closure function
    disableCancelBtn();
}


function benifitsCancelBtn() {
    const jsBenifitsCancelBtn = document.querySelector('.jsBenifitsCancelBtn');
    jsBenifitsCancelBtn.addEventListener('click', clickBenifitsCancelBtn);

    //enable cancel button
    jsBenifitsCancelBtn.classList.add('workerinfo-btn');
    jsBenifitsCancelBtn.classList.remove('disable-btn');
}

function clickBenifitsCancelBtn() {

    //collect all pers info input
    const jsBenifitsInputs = document.querySelectorAll('.jsBenifitsInput');

    //loop through input
    for (let i = 0; i < jsBenifitsInputs.length; i++) {
        //find active input by searching disabled attribute
        if (!jsBenifitsInputs[i].hasAttribute('disabled')) {
            console.log(jsBenifitsInputs[i])

            //disable inputs
            jsBenifitsInputs[i].setAttribute('disabled', true);
            jsBenifitsInputs[i].classList.add('disable-input');

            //change text update to edit
            const jsWorkerInfoEditBtn = jsBenifitsInputs[i].closest('.jsInputBtnCont').querySelector('.jsBenifitsEditBtn');
            jsWorkerInfoEditBtn.textContent = 'EDIT';
            jsWorkerInfoEditBtn.classList.remove('jsBenifitsUpdateBtn');
            jsWorkerInfoEditBtn.classList.remove('update-btn-active');


            //retrieve records
            const dataName = jsBenifitsInputs[i].getAttribute('data-name');
            jsBenifitsInputs[i].value = localData.benifits[dataName];
        }
    }

    //disable cancel button
    disableCancelBtn()
}

function disableCancelBtn() {
    const jsBenifitsCancelBtn = document.querySelector('.jsBenifitsCancelBtn');
    //remove eventListener cancel button
    jsBenifitsCancelBtn.removeEventListener('click', clickBenifitsCancelBtn);
    //disabled cancel button
    jsBenifitsCancelBtn.classList.remove('workerinfo-btn');
    jsBenifitsCancelBtn.classList.add('disable-btn');
}

function isRegexBenifitsValidationPassed() {
    let isValid = true;

    //umid number
    const jsUMIDNumber = document.querySelector('.jsUMIDNumber');
    if (!jsUMIDNumber.hasAttribute('disabled')) {
        if (!isNullOrWhiteSpace(jsUMIDNumber.value)) {
            console.log(regexPatterns.umidNumber.test(jsUMIDNumber.value))
            if (!regexPatterns.umidNumber.test(jsUMIDNumber.value)) {
                console.log('UMIDNumber')
                jsUMIDNumber.classList.add('invalid');
                isValid = false
            } else {
                jsUMIDNumber.classList.remove('invalid');
            }
        }
    }
    //sss number
    const jsSSSNumber = document.querySelector('.jsSSSNumber');
    if (!jsSSSNumber.hasAttribute('disabled')) {
        if (!isNullOrWhiteSpace(jsSSSNumber.value)) {
            if (!regexPatterns.sssNumber.test(jsSSSNumber.value)) {
                console.log('SSSNumber')
                jsSSSNumber.classList.add('invalid');
                isValid = false
            } else {
                jsSSSNumber.classList.remove('invalid');
            }
        }
    }

    //pag-ibig
    const jsPagIbigNumber = document.querySelector('.jsPagIbigNumber');
    if (!jsPagIbigNumber.hasAttribute('disabled')) {
        if (!isNullOrWhiteSpace(jsPagIbigNumber.value)) {
            if (!regexPatterns.pagibigNumber.test(jsPagIbigNumber.value)) {
                console.log('PagIbigNumber')
                jsPagIbigNumber.classList.add('invalid');
                isValid = false
            } else {
                jsPagIbigNumber.classList.remove('invalid');
            }
        }
    }

    //philhealth
    const jsPhilHealthNumber = document.querySelector('.jsPhilHealthNumber');
    if (!jsPagIbigNumber.hasAttribute('disabled')) {
        if (!isNullOrWhiteSpace(jsPhilHealthNumber.value)) {
            if (!regexPatterns.philihealthNumber.test(jsPhilHealthNumber.value)) {
                console.log('PhilHealthNumber')
                jsPhilHealthNumber.classList.add('invalid');
                isValid = false
            } else {
                jsPhilHealthNumber.classList.remove('invalid');
            }
        }
    }
    return isValid
}

function collectBenifitsData() {
    //collecton of data
    let jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
    let formData = new FormData();

    for (let i = 0; i < jsBenifitsInputs.length; i++) {
        let value = jsBenifitsInputs[i].value
        if (isNullOrWhiteSpace(jsBenifitsInputs[i].value)) {
            value = null;
        }
        formData.append(jsBenifitsInputs[i].getAttribute('name'), value)
    }

    const options = {
        method: 'POST',
        body: formData
    }

    return options;
}


function disableBeniftsSaveAndEnableEditBtn() {

    //enable edit button
    const jsBenifitsEditBtns = document.querySelectorAll('.jsBenifitsEditBtn');
    for (let i = 0; i < jsBenifitsEditBtns.length; i++) {
        jsBenifitsEditBtns[i].classList.add('edit-btn-active');
    }

    //disable save button
    const jsBenifitsSaveBtn = document.querySelector('.jsBenifitsSaveBtn');
    jsBenifitsSaveBtn.classList.remove('workerinfo-btn');
    jsBenifitsSaveBtn.classList.add('disable-btn');

    //remove eventlistener
    jsBenifitsSaveBtn.removeEventListener('click', clickBenifitsSaveBtn)

}

function disableBenifitsInput() {
    //disable input
    let jsBenifitsInputs = document.querySelectorAll('.jsBenifitsInput');
    for (let i = 0; i < jsBenifitsInputs.length; i++) {
        jsBenifitsInputs[i].setAttribute('disabled', true);
        jsBenifitsInputs[i].classList.add('disable-input');
    }
}