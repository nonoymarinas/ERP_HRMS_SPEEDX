async function workersCompensation() {
    //4. COMPENSATION *****************************************************************************//
    

    

    //change rate period events
    //applicable only if data is not yet saved
    const jsRatePeriod = document.querySelector('.jsRatePeriod');
    jsRatePeriod.addEventListener('change', changeSelectedRatePeriod)
    function changeSelectedRatePeriod() {
        if (localData.compensation.isDataSaved == false) {
            const selectedID = jsRatePeriod.selectedOptions[0].getAttribute('data-id');
            if (selectedID == 2) {
                document.querySelector('.jsIsSalaryFixed').removeAttribute('disabled');
                document.querySelector('.jsIsSalaryFixed').classList.remove('disable-input');
            } else {
                document.querySelector('.jsIsSalaryFixed').setAttribute('disabled', true);
                document.querySelector('.jsIsSalaryFixed').classList.add('disable-input');
                document.querySelector('.jsIsSalaryFixed').value = 0;
            }
        }
        
    }

    //save compensation button
    const jsCompensationSaveBtn = document.querySelector('.jsCompensationSaveBtn');
    jsCompensationSaveBtn.addEventListener('click', clickCompensationSaveBtn)
    

    
}

async function clickCompensationSaveBtn() {
    const jsCompensationSaveBtn = document.querySelector('.jsCompensationSaveBtn');
    //check first if personal info is save or active
    if (!localData.personalInfo.isDataSaved) {
        await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
        return;
    }

    if (localData.personalInfo.isActive) {
        await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
        return;
    }

    //validate input
    if (!isCompensationRequiredFieldsComplete()) return;

    //validate regex
    if (!isRegexCompensationValidationPassed()) return;

    //spinner on
    jsCompensationSaveBtn.appendChild(spinnerType01());


    //collecton of data
    const formData = new FormData();

    const basicSalary = parseFloat(parseFloat(document.querySelector('.jsBasicSalary').value).toFixed(2))
    const allowance = parseFloat(parseFloat(document.querySelector('.jsAllowance').value).toFixed(2))
    const ratePeriodID = document.querySelector('.jsRatePeriod').selectedOptions[0].getAttribute('data-id')
    const isSalaryFixed = document.querySelector('.jsIsSalaryFixed').selectedOptions[0].getAttribute('data-id')

    formData.append('MasterPersonID', localData.personalInfo.masterPersonID)
    formData.append('BasicSalary', basicSalary)
    formData.append('Allowance', allowance)
    formData.append('RatePeriodID', ratePeriodID)
    formData.append('IsSalaryFixed', isSalaryFixed)
    formData.append('CurrencyID', 1)
    formData.append('HourPerDay', 8)
    formData.append('DayPerMonth', 26)

    for (const pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }

    let options = {
        method: 'POST',
        body: formData
    }

    //fetch data
    const data = await fetchData.postData('save-compensation', options)

    //spinner off
    jsCompensationSaveBtn.querySelector('.jsSpinnerCont').remove();

    //validate return data
    if (data) {
        alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
    } else {
        return
    }

    //update local data
    localData.compensation.ratePeriodID = data.ratePeriodID;
    localData.compensation.isSalaryFixed = data.isSalaryFixed;
    localData.compensation.currencyID = data.currencyID;
    localData.compensation.hourPerDay = data.hourPerDay;
    localData.compensation.dayPerMonth = data.dayPerMonth;
    localData.compensation.basicSalary = data.basicSalary;
    localData.compensation.allowance = data.allowance;
    localData.compensation.isDataSaved = true;

    console.log(localData.compensation)

    //disable save buttons and enable edit
    disableCompensationSaveAndEnableEditBtn()

    //edit and update should run only after saved is done, thats why it located in here
    await compensationEditAndUpdate()
}

async function compensationEditAndUpdate() {
    //select all edit buttons
    const jsCompensationEditBtns = document.querySelectorAll('.jsCompensationEditBtn');
    for (let i = 0; i < jsCompensationEditBtns.length; i++) {
        jsCompensationEditBtns[i].addEventListener('click', clickCompensationEditUpdateBtn);
        async function clickCompensationEditUpdateBtn(e) {
            if (jsCompensationEditBtns[i].classList.contains('jsCompensationUpdateBtn')) {
                await clickCompensationUpdateBtn(e)
            } else {
                clickCompensationEditBtn(e)
            }
        }
    }


}

function clickCompensationEditBtn(e) {
    //enable input
    let jsCompensation = e.target.closest('.jsInputBtnCont').querySelector('.jsCompensation');

    //this will remain disable if rate period is daily
    const jsRatePeriod = document.querySelector('.jsRatePeriod');
    const selectedID = jsRatePeriod.selectedOptions[0].getAttribute('data-id');
    if (jsCompensation.getAttribute('name') == 'IsSalaryFixed' && selectedID == 1) {
        alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Fixed salary is only applicable for monthly!');
        return;
    }

    jsCompensation.removeAttribute('disabled');
    jsCompensation.classList.remove('disable-input');


    //change text edit to update
    e.currentTarget.textContent = 'UPDATE'

    //insert class for update
    e.currentTarget.classList.add('jsCompensationUpdateBtn');
    e.currentTarget.classList.add('update-btn-active');

    //activate cancel button
    compensationCancelBtn()
}

async function clickCompensationUpdateBtn(e) {

    //validation of input data
    if (e.target.getAttribute('name') == 'BasicSalary') {
        if (!isCompensationRequiredFieldsComplete()) return;
    }
    //validate regex
    if (!isRegexCompensationValidationPassed()) return;

    //spinner on
    e.target.appendChild(spinnerType01());

    //update data via fetch api

    const jsCompensation = e.target.closest('.jsInputBtnCont').querySelector('.jsCompensation');
    const PropertyName = jsCompensation.getAttribute('name');

    let PropertyValue;
    if (PropertyName == 'RatePeriod') {
        PropertyValue = jsCompensation.selectedOptions[0].getAttribute('data-id');
        console.log(PropertyValue)
    } else if (PropertyName == 'IsSalaryFixed') {
        PropertyValue = jsCompensation.selectedOptions[0].getAttribute('data-id');
        console.log(PropertyValue)
    }
    else {
        PropertyValue = jsCompensation.value;
    }


    const formData = new FormData();
    formData.append('MasterPersonID', localData.personalInfo.masterPersonID)
    formData.append('PropertyName', PropertyName)
    formData.append('PropertyValue', PropertyValue)

    const options = {
        method: 'POST',
        body: formData
    }

    let data = await fetchData.postData('update-compensation', options)
    console.log('ok')
    console.log(data)

    // remove spinner
    e.target.querySelector('.jsSpinnerCont').remove();

    //validate return data
    if (!data) {
        return
    } else if (data.hasError) {
        return
    }

    //update data and change elemenet appearance
    localData.compensation[jsCompensation.getAttribute('data-name')] = data.propertyValue;

    //change text update to edit
    e.target.textContent = 'EDIT'
    e.target.classList.remove('jsCompensationUpdateBtn');
    e.target.classList.remove('update-btn-active');

    //disable input
    jsCompensation.setAttribute('disabled', true);
    jsCompensation.classList.add('disable-input');

    //disable cancel, from closure function
    disableCancelBtn();
}

function compensationCancelBtn() {
    const jsCompensationCancelBtn = document.querySelector('.jsCompensationCancelBtn');
    jsCompensationCancelBtn.addEventListener('click', clickCompensationCancelBtn);

    //enable cancel button
    jsCompensationCancelBtn.classList.add('workerinfo-btn');
    jsCompensationCancelBtn.classList.remove('disable-btn');
}

function clickCompensationCancelBtn() {

    //collect all pers info input
    const jsCompensations = document.querySelectorAll('.jsCompensation');

    //loop through input
    for (let i = 0; i < jsCompensations.length; i++) {
        //find active input by searching disabled attribute
        if (!jsCompensations[i].hasAttribute('disabled')) {

            //disable inputs
            jsCompensations[i].setAttribute('disabled', true);
            jsCompensations[i].classList.add('disable-input');

            //change text update to edit
            const jsCompensationEditBtn = jsCompensations[i].closest('.jsInputBtnCont').querySelector('.jsCompensationEditBtn');
            jsCompensationEditBtn.textContent = 'EDIT';
            jsCompensationEditBtn.classList.remove('jsCompensationUpdateBtn');
            jsCompensationEditBtn.classList.remove('update-btn-active');

            //retrieve records
            if (jsCompensations[i].getAttribute('name') == 'RatePeriod') {
                const RatePeriod = localData.compensation.ratePeriodID;
                if (parseInt(RatePeriod) == 1) {
                    jsCompensations[i].options[0].setAttribute('selected', true)
                } else {
                    jsCompensations[i].options[1].setAttribute('selected', true)
                }
            } else if (jsCompensations[i].getAttribute('name') == 'IsSalaryFixed') {
                const isSalaryFixed = localData.compensation.isSalaryFixed;
                if (parseInt(isSalaryFixed) == 0) {
                    jsCompensations[i].options[0].setAttribute('selected', true)
                } else {
                    jsCompensations[i].options[1].setAttribute('selected', true)
                }
            } else {
                const dataName = jsCompensations[i].getAttribute('data-name');
                jsCompensations[i].value = localData.compensation[dataName];
            }
        }
    }

    //disable cancel button
    disableCancelBtn()
}

function disableCancelBtn() {

    const jsCompensationCancelBtn = document.querySelector('.jsCompensationCancelBtn');
    //remove eventListener cancel button
    jsCompensationCancelBtn.removeEventListener('click', clickCompensationCancelBtn);

    //disabled cancel button
    jsCompensationCancelBtn.classList.remove('workerinfo-btn');
    jsCompensationCancelBtn.classList.add('disable-btn');
}

function isCompensationRequiredFieldsComplete() {
    let isValid = true
    const jsBasicSalary = document.querySelector('.jsBasicSalary');
    if (isNullOrWhiteSpace(jsBasicSalary.value)) {
        jsBasicSalary.classList.add('invalid');
        isValid = false
    } else {
        jsBasicSalary.classList.remove('invalid');
    }
    return isValid;
}

function isRegexCompensationValidationPassed() {
    let isValid = true;

    //basic salary
    const jsBasicSalary = document.querySelector('.jsBasicSalary');
    if (!regexPatterns.decimal.test(jsBasicSalary.value)) {
        jsBasicSalary.classList.add('invalid');
        isValid = false
    } else {
        jsBasicSalary.classList.remove('invalid');
    }

    //allowance
    const jsAllowance = document.querySelector('.jsAllowance');
    if (!regexPatterns.decimal.test(jsAllowance.value)) {
        jsAllowance.classList.add('invalid');
        isValid = false
    } else {
        jsAllowance.classList.remove('invalid');
    }

    return isValid
}


function disableCompensationSaveAndEnableEditBtn() {
    //enable edit button
    const jsCompensationEditBtns = document.querySelectorAll('.jsCompensationEditBtn');
    for (let i = 0; i < jsCompensationEditBtns.length; i++) {
        jsCompensationEditBtns[i].classList.add('edit-btn-active');
    }

    //disable save button
    const jsCompensationSaveBtn = document.querySelector('.jsCompensationSaveBtn');
    jsCompensationSaveBtn.classList.remove('workerinfo-btn');
    jsCompensationSaveBtn.classList.add('disable-btn');

    //remove eventlistener
    jsCompensationSaveBtn.removeEventListener('click', clickCompensationSaveBtn)

    //disable input
    disableCompensationInput()
}

function disableCompensationInput() {
    //disable input
    let jsCompensations = document.querySelector('.jsWorkerInfoItemCompensationMainCont').querySelectorAll('.jsCompensation');
    for (let i = 0; i < jsCompensations.length; i++) {
        jsCompensations[i].setAttribute('disabled', true);
        jsCompensations[i].classList.add('disable-input');
    }
}