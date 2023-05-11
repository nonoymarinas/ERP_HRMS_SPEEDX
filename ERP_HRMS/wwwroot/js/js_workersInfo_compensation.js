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



    function collectCompensationData() {
        //collecton of data

        let formData = new FormData();

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

        return options;
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
        disableCompensationInputBtn()
    }
    function disableCompensationInputBtn() {
        //disable input
        let jsCompensations = document.querySelector('.jsWorkerInfoItemCompensationMainCont').querySelectorAll('.jsCompensation');
        for (let i = 0; i < jsCompensations.length; i++) {
            jsCompensations[i].setAttribute('disabled', true);
            jsCompensations[i].classList.add('disable-input');
        }
    }

    //change rate period events
    const jsRatePeriod = document.querySelector('.jsRatePeriod');
    jsRatePeriod.addEventListener('change', changeSelectedRatePeriod)
    function changeSelectedRatePeriod() {
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
        console.log(data)
        //validate data
        if (!data) return;

        //update local data
        localData.compensation.ratePeriodID = data.ratePeriodID;
        localData.compensation.isSalaryFixed = data.isSalaryFixed;
        localData.compensation.currencyID = data.currencyID;
        localData.compensation.hourPerDay = data.hourPerDay;
        localData.compensation.dayPerMonth = data.dayPerMonth;
        localData.compensation.basicSalary = data.basicSalary;
        localData.compensation.allowance = data.allowance;

        console.log(localData.compensation)

        //disable save buttons and enable edit
        disableCompensationSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        //await contactsEditAndUpdate()
    }
}