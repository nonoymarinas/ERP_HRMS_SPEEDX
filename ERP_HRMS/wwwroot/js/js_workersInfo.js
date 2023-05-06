async function newEmployee() {
    //global-local data
    const localData = {
        personalInfo: {
            masterPersonID: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            isActive: false,
            dateOfBirthFormatted: function () {
                if (localData.personalInfo.dateOfBirth != '') {
                    return formatDate(new Date(localData.personalInfo.dateOfBirth))
                }
            }
        },
        benifits: {
            sssNumber: '',
            pagibigNumber: '',
            philhealthNumber: ''
        },

        contacts: {
            mobileNumber: '',
            landlineNumber: '',
            emailAddress:''
        },
        compensation: {
            ratePeriodID:'',
            isSalaryFixedID:'',
            currencyID:'',
            hourPerDay:'',
            dayPerMonth:'',
            basicSalary:'',
            allowance:''
        }
    }

    //global-local variables
    let isPersonInfoSave = false;

    //helper function
    function isPersonalInfoValid() {
        //--check if data empty or not
        let validate = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.validate');
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

    function collectPersonalData() {
        //collecton of data
        let input = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('INPUT');
        let formData = new FormData();

        for (let i = 0; i < input.length; i++) {
            formData.append(`${input[i].getAttribute('name')}`, input[i].value)
        }

        formData.append('MasterPersonID', localData.personalInfo.masterPersonID)

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        let options = {
            method: 'POST',
            body: formData
        }

        return options;
    }

    function disableSaveAndEnableEditBtn() {
        //enable edit button
        const jsWorkerInfoEditBtn = document.querySelector('.jsWorkerInfoEditBtn');
        jsWorkerInfoEditBtn.classList.add('workerinfo-btn');
        jsWorkerInfoEditBtn.classList.remove('disable-btn');

        //disable save button
        jsWorkerInfoSaveBtn.classList.remove('workerinfo-btn');
        jsWorkerInfoSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

        //disable input
        disablePersonalInputBtn()
    }

    function disablePersonalInputBtn() {
        //disable input
        let validate = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.validate');
        for (let i = 0; i < validate.length; i++) {
            validate[i].setAttribute('disabled', true);
            validate[i].classList.add('disable-input');
        }
    }



    //1. PERSONAL INFORMATION *****************************************************************************//
    //save personal info button
    const jsWorkerInfoSaveBtn = document.querySelector('.jsWorkerInfoSaveBtn');
    jsWorkerInfoSaveBtn.addEventListener('click', clickPersInfoSaveBtn)
    async function clickPersInfoSaveBtn() {
        //validation of input data
        if (!isPersonalInfoValid()) return;


        //save data via fetch api
        const options = collectPersonalData()
        let data = await fetchData.postData('save-personal-information', options)
        console.log(data)
        //validate return data
        if (!data) return

        //update data and change elemenet appearance
        localData.personalInfo.masterPersonID = data.masterPersonID;
        localData.personalInfo.firstName = data.firstName;
        localData.personalInfo.middleName = data.middleName;
        localData.personalInfo.lastName = data.lastName;
        localData.personalInfo.dateOfBirth = data.dateOfBirth;

        //confirmed data is saved
        isPersonInfoSave = true;

        //disable save button
        disableSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        await personalInfoEditAndUpdate()
    }

    //edit and update personal info button
    async function personalInfoEditAndUpdate() {
        const jsWorkerInfoEditBtn = document.querySelector('.jsWorkerInfoEditBtn');
        jsWorkerInfoEditBtn.addEventListener('click', clickEditUpdateBtn)
        async function clickEditUpdateBtn() {
            if (jsWorkerInfoEditBtn.classList.contains('jsWorkerInfoUpdateBtn')) {
                await clickPersInfoUpdateBtn()
            } else {
                clickPersInfoEditBtn()
            }
        }

        function clickPersInfoEditBtn() {

            //enable input
            let validate = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.validate');
            for (let i = 0; i < validate.length; i++) {
                validate[i].removeAttribute('disabled');
                validate[i].classList.remove('disable-input');
            }

            //change text edit to update
            jsWorkerInfoEditBtn.textContent = 'Update'

            //insert class for update
            jsWorkerInfoEditBtn.classList.add('jsWorkerInfoUpdateBtn');

            //change local data isActive to true
            localData.personalInfo.isActive = true;

            //activate cancel button
            personalInfoCancelBtn()
        }


        async function clickPersInfoUpdateBtn() {
            //validation of input data
            if (!isPersonalInfoValid()) return;

            //update data via fetch api
            const options = collectPersonalData()
            let data = await fetchData.postData('update-personal-information', options)
            console.log(data)

            //validate return data
            if (!data) return

            //update local data
            localData.personalInfo.firstName = data.firstName;
            localData.personalInfo.middleName = data.middleName;
            localData.personalInfo.lastName = data.lastName;
            localData.personalInfo.dateOfBirth = data.dateOfBirth;
            localData.personalInfo.isActive = false;

            //change text update to edit
            jsWorkerInfoEditBtn.textContent = 'Edit'
            jsWorkerInfoEditBtn.classList.remove('jsWorkerInfoUpdateBtn');

            //disable personal info input
            disablePersonalInputBtn()

            //disable cancel, from closure function
            personalInfoCancelBtn()();
        }

        function personalInfoCancelBtn() {
            const jsWorkerInfoCancelBtn = document.querySelector('.jsWorkerInfoCancelBtn');
            jsWorkerInfoCancelBtn.addEventListener('click', clickPersonalInfoCancelBtn);

            function clickPersonalInfoCancelBtn() {
                //disable input
                let validate = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.validate');
                for (let i = 0; i < validate.length; i++) {
                    validate[i].setAttribute('disabled', true);
                    validate[i].classList.add('disable-input');
                }

                //change text update to edit
                jsWorkerInfoEditBtn.textContent = 'Edit'

                //insert class for update
                jsWorkerInfoEditBtn.classList.remove('jsWorkerInfoUpdateBtn');

                //change local data isActive to true
                localData.personalInfo.isActive = false;

                //reverse input value
                const jsWorkerInfoItemPersInfoMainCont = document.querySelector('.jsWorkerInfoItemPersInfoMainCont');
                jsWorkerInfoItemPersInfoMainCont.querySelector('.jsFirstName').value = localData.personalInfo.firstName;
                jsWorkerInfoItemPersInfoMainCont.querySelector('.jsMiddleName').value = localData.personalInfo.middleName;
                jsWorkerInfoItemPersInfoMainCont.querySelector('.jsLastName').value = localData.personalInfo.lastName;
                jsWorkerInfoItemPersInfoMainCont.querySelector('.jsDateOfBirth').value = localData.personalInfo.dateOfBirthFormatted();

                disableCancelBtn()
            }

            function disableCancelBtn() {
                //remove event listener
                jsWorkerInfoCancelBtn.removeEventListener('click', clickPersonalInfoCancelBtn);

                //disable cancel button
                jsWorkerInfoCancelBtn.classList.remove('workerinfo-btn');
                jsWorkerInfoCancelBtn.classList.add('disable-btn');
            }

            //enable cancel button
            jsWorkerInfoCancelBtn.classList.remove('disable-btn');
            jsWorkerInfoCancelBtn.classList.add('workerinfo-btn');

            return disableCancelBtn;

        }
    }




    //2. WORKERS BENIFITS *****************************************************************************//
    function isBenifitsInputValid() {
        //--check if data empty or not
        let validate = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.validate');
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

    function collectBenifitsData() {
        //collecton of data
        let input = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('INPUT');
        let formData = new FormData();

        for (let i = 0; i < input.length; i++) {
            formData.append(`${input[i].getAttribute('name')}`, input[i].value)
        }

        formData.append('MasterPersonID', localData.personalInfo.masterPersonID)

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        let options = {
            method: 'POST',
            body: formData
        }

        return options;
    }

    function disableBeniftsSaveAndEnableEditBtn() {
        //enable edit button
        const jsBenifitsEditBtn = document.querySelector('.jsBenifitsEditBtn');
        jsBenifitsEditBtn.classList.add('workerinfo-btn');
        jsBenifitsEditBtn.classList.remove('disable-btn');

        //disable save button
        const jsBenifitsSaveBtn = document.querySelector('.jsBenifitsSaveBtn');
        jsBenifitsSaveBtn.classList.remove('workerinfo-btn');
        jsBenifitsSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsBenifitsSaveBtn.removeEventListener('click', clickBenifitsSaveBtn)

        //disable input
        disableBenifitsInputBtn()
    }
    function disableBenifitsInputBtn() {
        //disable input
        let validate = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.validate');
        for (let i = 0; i < validate.length; i++) {
            validate[i].setAttribute('disabled', true);
            validate[i].classList.add('disable-input');
        }
    }
    //save benifits button
    const jsBenifitsSaveBtn = document.querySelector('.jsBenifitsSaveBtn');
    jsBenifitsSaveBtn.addEventListener('click', clickBenifitsSaveBtn)
    async function clickBenifitsSaveBtn() {
        //check first if personal info is save or active
        if (!isPersonInfoSave) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
            return;
        }

        if (localData.personalInfo.isActive) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
            return;
        }

        //validate input if valid
        if(!isBenifitsInputValid()) return;


        const options = collectBenifitsData()

        const data = await fetchData.postData('save-benifits', options)
        if (!data) return;
        console.log(data)

        //update local data
        localData.benifits.sssNumber = data.sssNumber;
        localData.benifits.pagibigNumber = data.pagibigNumber;
        localData.benifits.philhealthNumber = data.philhealthNumber;

        //disable save buttons and enable edit
        disableBeniftsSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        await benifitsEditAndUpdate()
    }

    async function benifitsEditAndUpdate() {
        const jsBenifitsEditBtn = document.querySelector('.jsBenifitsEditBtn');
        jsBenifitsEditBtn.addEventListener('click', clickBenifitsEditUpdateBtn)
        async function clickBenifitsEditUpdateBtn() {
            if (jsBenifitsEditBtn.classList.contains('jsBenifitsUpdateBtn')) {
                await clickBenifitsUpdateBtn()
            } else {
                clickBenifitsEditBtn()
            }
        }

        function clickBenifitsEditBtn() {

            //enable input
            let validate = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.validate');
            for (let i = 0; i < validate.length; i++) {
                validate[i].removeAttribute('disabled');
                validate[i].classList.remove('disable-input');
            }

            //change text edit to update
            jsBenifitsEditBtn.textContent = 'Update'

            //insert class for update
            jsBenifitsEditBtn.classList.add('jsBenifitsUpdateBtn');

            //activate cancel button
            benifitsCancelBtn()
        }


        async function clickBenifitsUpdateBtn() {

            //validation of input data
            if (!isBenifitsInputValid()) return;

            //update data via fetch api
            const options = collectBenifitsData();
            let data = await fetchData.postData('update-benifits', options)
            console.log(data)

            //validate return data
            if (!data) return

            //update local data
            localData.benifits.sssNumber = data.sssNumber;
            localData.benifits.pagibigNumber = data.pagibigNumber;
            localData.benifits.philhealthNumber = data.philhealthNumber;

            //change text update to edit
            jsBenifitsEditBtn.textContent = 'Edit'
            jsBenifitsEditBtn.classList.remove('jsBenifitsUpdateBtn');

            //disable personal info input
            disableBenifitsInputBtn()

            //disable cancel, from closure function
            benifitsCancelBtn()();
        }


        function benifitsCancelBtn() {
            const jsBenifitsCancelBtn = document.querySelector('.jsBenifitsCancelBtn');
            jsBenifitsCancelBtn.addEventListener('click', clickBenifitsCancelBtn);

            function clickBenifitsCancelBtn() {
                //disable input
                let validate = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.validate');
                for (let i = 0; i < validate.length; i++) {
                    validate[i].setAttribute('disabled', true);
                    validate[i].classList.add('disable-input');
                }

                //change text update to edit
                jsBenifitsEditBtn.textContent = 'Edit'

                //remove class for update
                jsBenifitsEditBtn.classList.remove('jsBenifitsUpdateBtn');

                //retrieve previous input value
                const jsWorkerInfoItemBenifitsMainCont = document.querySelector('.jsWorkerInfoItemBenifitsMainCont');
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsSSSNumber').value = localData.benifits.sssNumber;
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsPagIbigNumber').value = localData.benifits.pagibigNumber;
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsPhilHealthNumber').value = localData.benifits.philhealthNumber;

                //disable cancel button
                disableCancelBtn()
            }

            function disableCancelBtn() {
                //remove eventListener cancel button
                jsBenifitsCancelBtn.removeEventListener('click', clickBenifitsCancelBtn);
                //disabled cancel button
                jsBenifitsCancelBtn.classList.remove('workerinfo-btn');
                jsBenifitsCancelBtn.classList.add('disable-btn');
            }

            //enable cancel button
            jsBenifitsCancelBtn.classList.add('workerinfo-btn');
            jsBenifitsCancelBtn.classList.remove('disable-btn');

            return disableCancelBtn;

        }
    }


    //3. CONTACTS *****************************************************************************//
    function isContactsInputValid() {
        //--check if data empty or not
        let validate = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.validate');
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
    function collectContactsData() {
        //collecton of data
        let input = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('INPUT');
        let formData = new FormData();

        for (let i = 0; i < input.length; i++) {
            formData.append(`${input[i].getAttribute('name')}`, input[i].value)
        }

        formData.append('MasterPersonID', localData.personalInfo.masterPersonID)

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        let options = {
            method: 'POST',
            body: formData
        }

        return options;
    }

    function disableContactSaveAndEnableEditBtn() {
        //enable edit button
        const jsContactEditBtn = document.querySelector('.jsContactEditBtn');
        jsContactEditBtn.classList.add('workerinfo-btn');
        jsContactEditBtn.classList.remove('disable-btn');

        //disable save button
        const jsContactSaveBtn = document.querySelector('.jsContactSaveBtn');
        jsContactSaveBtn.classList.remove('workerinfo-btn');
        jsContactSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsContactSaveBtn.removeEventListener('click', clickContactsSaveBtn)

        //disable input
        disableContactsInputBtn()
    }
    function disableContactsInputBtn() {
        //disable input
        let validate = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.validate');
        for (let i = 0; i < validate.length; i++) {
            validate[i].setAttribute('disabled', true);
            validate[i].classList.add('disable-input');
        }
    }




    //save contacts button
    const jsContactSaveBtn = document.querySelector('.jsContactSaveBtn');
    jsContactSaveBtn.addEventListener('click', clickContactsSaveBtn)
    async function clickContactsSaveBtn() {
        //check first if personal info is save or active
        if (!isPersonInfoSave) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
            return;
        }

        if (localData.personalInfo.isActive) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
            return;
        }

        const options = collectContactsData()

        const data = await fetchData.postData('save-contacts', options)
        if (!data) return;
        console.log(data)

        //update local data
        localData.contacts.mobileNumber = data.mobileNumber;
        localData.contacts.landlineNumber = data.landlineNumber;
        localData.contacts.emailAddress = data.emailAddress;

        //disable save buttons and enable edit
        disableContactSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        await contactsEditAndUpdate()
    }



    async function contactsEditAndUpdate() {
        const jsContactEditBtn = document.querySelector('.jsContactEditBtn');
        jsContactEditBtn.addEventListener('click', clickContactsEditUpdateBtn)
        async function clickContactsEditUpdateBtn() {
            if (jsContactEditBtn.classList.contains('jsContactUpdateBtn')) {
                await clickContactUpdateBtn()
            } else {
                clickContactEditBtn()
            }
        }

        function clickContactEditBtn() {

            //enable input
            let validate = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.validate');
            for (let i = 0; i < validate.length; i++) {
                validate[i].removeAttribute('disabled');
                validate[i].classList.remove('disable-input');
            }

            //change text edit to update
            jsContactEditBtn.textContent = 'Update'

            //insert class for update
            jsContactEditBtn.classList.add('jsContactUpdateBtn');

            //activate cancel button
            contactCancelBtn()
        }


        async function clickContactUpdateBtn() {

            //validation of input data
            if (!isContactsInputValid()) return;

            //update data via fetch api
            const options = collectContactsData();
            let data = await fetchData.postData('update-contacts', options)
            console.log(data)

            //validate return data
            if (!data) return

            //update local data
            localData.contacts.mobileNumber = data.mobileNumber;
            localData.contacts.landlineNumber = data.landlineNumber;
            localData.contacts.emailAddress = data.emailAddress;

            //change text update to edit
            jsContactEditBtn.textContent = 'Edit'
            jsContactEditBtn.classList.remove('jsContactUpdateBtn');

            //disable input
            disableContactsInputBtn()

            //disable cancel, from closure function
            contactCancelBtn()();
        }


        function contactCancelBtn() {
            const jsContactCancelBtn = document.querySelector('.jsContactCancelBtn');
            jsContactCancelBtn.addEventListener('click', clickContactCancelBtn);

            function clickContactCancelBtn() {
                //disable input
                let validate = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.validate');
                for (let i = 0; i < validate.length; i++) {
                    validate[i].setAttribute('disabled', true);
                    validate[i].classList.add('disable-input');
                }

                //change text update to edit
                jsContactEditBtn.textContent = 'Edit'

                //remove class for update
                jsContactEditBtn.classList.remove('jsContactUpdateBtn');

                //retrieve previous input value
                const jsWorkerInfoItemContactMainCont = document.querySelector('.jsWorkerInfoItemContactMainCont');
                jsWorkerInfoItemContactMainCont.querySelector('.jsMobileNumber').value = localData.contacts.mobileNumber;
                jsWorkerInfoItemContactMainCont.querySelector('.jsLandlineNumber').value = localData.contacts.landlineNumber;
                jsWorkerInfoItemContactMainCont.querySelector('.jsEmailAddress').value = localData.contacts.emailAddress;

                //disable cancel button
                disableCancelBtn()
            }

            function disableCancelBtn() {
                //remove eventListener cancel button
                jsContactCancelBtn.removeEventListener('click', clickContactCancelBtn);
                //disabled cancel button
                jsContactCancelBtn.classList.remove('workerinfo-btn');
                jsContactCancelBtn.classList.add('disable-btn');
            }

            //enable cancel button
            jsContactCancelBtn.classList.add('workerinfo-btn');
            jsContactCancelBtn.classList.remove('disable-btn');

            return disableCancelBtn;

        }
    }

    //4. COMPENSATION *****************************************************************************//
    function isContactsInputValid() {
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

    function collectCompensationData() {
        //collecton of data
        let input = document.querySelector('.jsWorkerInfoItemCompensationMainCont').querySelectorAll('INPUT');
        let formData = new FormData();

        for (let i = 0; i < input.length; i++) {
            formData.append(`${input[i].getAttribute('name')}`, parseFloat(input[i].value))
        }

        const ratePeriodID = document.querySelector('.jsRatePeriodSelect').selectedOptions[0].getAttribute('data-id')
        const isSalaryFixedID = document.querySelector('.jsIsSalaryFixedSelect').selectedOptions[0].getAttribute('data-id')

        formData.append('MasterPersonID', localData.personalInfo.masterPersonID)
        formData.append('RatePeriodID', ratePeriodID)
        formData.append('IsSalaryFixedID', isSalaryFixedID)
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

        const options = collectCompensationData()

        const data = await fetchData.postData('save-compensation', options)
        if (!data) return;
        console.log(data)

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