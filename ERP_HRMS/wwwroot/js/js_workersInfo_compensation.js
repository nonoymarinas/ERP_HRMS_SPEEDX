async function workersCompensation() {
    //4. COMPENSATION *****************************************************************************//
    function isCompensationInputValid() {
        //--check if data empty or not
        let validate = document.querySelector('.jsWorkerInfoItemCompensationMainCont').querySelectorAll('.validate');
        let isValid = true;
        for (let i = 0; i < validate.length; i++) {
            if (isNullOrWhiteSpace(validate[i].value)) {
                validate[i].classList.add('invalid');
                isValid = false;
            } else {
                validate[i].classList.remove('invalid');
            }
        }
        return isValid;
    }


    function isRegexCompensationValidationPassed() {
        let isValid = true;

        //basic salary
        const jsBasicSalaryInput = document.querySelector('.jsBasicSalaryInput');
        if (!regexPatterns.decimal.test(jsBasicSalaryInput.value)) {
            jsBasicSalaryInput.classList.add('invalid');
            isValid = false
        } else {
            jsBasicSalaryInput.classList.remove('invalid');
        }

        //allowance
        const jsAllowanceInput = document.querySelector('.jsAllowanceInput');
        if (!regexPatterns.decimal.test(jsAllowanceInput.value)) {
            jsAllowanceInput.classList.add('invalid');
            isValid = false
        } else {
            jsAllowanceInput.classList.remove('invalid');
        }

        return isValid
    }



    function collectCompensationData() {
        //collecton of data

        let formData = new FormData();

        const basicSalary = parseFloat(parseFloat(document.querySelector('.jsBasicSalaryInput').value).toFixed(2))
        const allowance = parseFloat(parseFloat(document.querySelector('.jsAllowanceInput').value).toFixed(2))
        const ratePeriodID = document.querySelector('.jsRatePeriodSelect').selectedOptions[0].getAttribute('data-id')
        const isSalaryFixed = document.querySelector('.jsIsSalaryFixedSelect').selectedOptions[0].getAttribute('data-id')

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

        return options;
    }

    function disableCompensationSaveAndEnableEditBtn() {
        //enable edit button
        const jsCompensationEditBtn = document.querySelector('.jsCompensationEditBtn');
        jsCompensationEditBtn.classList.add('workerinfo-btn');
        jsCompensationEditBtn.classList.remove('disable-btn');

        //disable save button
        const jsCompensationSaveBtn = document.querySelector('.jsCompensationSaveBtn');
        jsCompensationSaveBtn.classList.remove('workerinfo-btn');
        jsCompensationSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsCompensationSaveBtn.removeEventListener('click', clickCompensationSaveBtn)

        //disable input
        disableCompensationInputBtn()
    }
    function disableCompensationInputBtn() {
        //disable input
        let validate = document.querySelector('.jsWorkerInfoItemCompensationMainCont').querySelectorAll('.validate');
        for (let i = 0; i < validate.length; i++) {
            validate[i].setAttribute('disabled', true);
            validate[i].classList.add('disable-input');
        }

        document.querySelector('.jsRatePeriodSelect').setAttribute('disabled', true)
        document.querySelector('.jsRatePeriodSelect').classList.add('disable-input')

        document.querySelector('.jsIsSalaryFixedSelect').setAttribute('disabled', true)
        document.querySelector('.jsIsSalaryFixedSelect').classList.add('disable-input')

    }

    //change rate period events
    const jsRatePeriodSelect = document.querySelector('.jsRatePeriodSelect');
    jsRatePeriodSelect.addEventListener('change', changeSelectedRatePeriod)
    function changeSelectedRatePeriod() {
        const selectedID = jsRatePeriodSelect.selectedOptions[0].getAttribute('data-id');
        if (selectedID == 2) {
            document.querySelector('.jsIsSalaryFixedSelect').removeAttribute('disabled');
            document.querySelector('.jsIsSalaryFixedSelect').classList.remove('disable-input');
        } else {
            document.querySelector('.jsIsSalaryFixedSelect').setAttribute('disabled', true);
            document.querySelector('.jsIsSalaryFixedSelect').classList.add('disable-input');
            document.querySelector('.jsIsSalaryFixedSelect').value = 0;
        }
    }

    //save compensation button
    const jsCompensationSaveBtn = document.querySelector('.jsCompensationSaveBtn');
    jsCompensationSaveBtn.addEventListener('click', clickCompensationSaveBtn)
    async function clickCompensationSaveBtn() {
        //check first if personal info is save or active
        if (!isPersonInfoSave) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
            return;
        }

        if (localData.personalInfo.isActive) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
            return;
        }

        //validate input
        if (!isCompensationInputValid()) return;

        //validate regex
        if (!isRegexCompensationValidationPassed()) return;


        //fetch data
        const options = collectCompensationData()
        const data = await fetchData.postData('save-compensation', options)

        //validate data
        if (!data) return;

        //update local data
        localData.compensation.ratePeriodID = data.ratePeriodID;
        localData.compensation.isSalaryFixedID = data;
        localData.compensation.currencyID = data.currencyID;
        localData.compensation.hourPerDay = data.hourPerDay;
        localData.compensation.dayPerMonth = data.dayPerMonth;
        localData.compensation.basicSalary = data.basicSalary;
        localData.compensation.allowance = data.allowance;

        //disable save buttons and enable edit
        disableCompensationSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        //await contactsEditAndUpdate()
    }
}