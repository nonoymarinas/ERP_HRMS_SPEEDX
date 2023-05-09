async function newEmployee() {
    //0. GLOBAL *****************************************************************************//
    //global-local data
    const localData = {
        personalInfo: {
            masterPersonID: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            isActive: false
        },
        benifits: {
            umidNumber: '',
            sssNumber: '',
            pagIbigNumber: '',
            philHealthNumber: ''
        },

        contacts: {
            mobileNumber: '',
            landlineNumber: '',
            emailAddress: ''
        },
        compensation: {
            ratePeriodID: '',
            isSalaryFixedID: '',
            currencyID: '',
            hourPerDay: '',
            dayPerMonth: '',
            basicSalary: '',
            allowance: ''
        }
    }

    //global-local variables
    let isPersonInfoSave = false;


    //1. PERSONAL INFORMATION *****************************************************************************//
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

        //****enable all pers info edit button by loop
        //****disable save button
        //****remove eventlistener
        //****disable input

        //enable edit button
        const jsWorkerInfoEditBtns = document.querySelectorAll('.jsWorkerInfoEditBtn');
        for (let i = 0; i < jsWorkerInfoEditBtns.length; i++) {
            jsWorkerInfoEditBtns[i].classList.add('workerinfo-btn');
            jsWorkerInfoEditBtns[i].classList.remove('disable-btn');
        }

        //disable save button
        jsWorkerInfoSaveBtn.classList.remove('workerinfo-btn');
        jsWorkerInfoSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

        //disable input
        disablePersInfoInputBtn()
    }

    function disablePersInfoInputBtn() {
        //disable input
        let jsPersInfoInputs = document.querySelectorAll('.jsPersInfoInput');
        for (let i = 0; i < jsPersInfoInputs.length; i++) {
            jsPersInfoInputs[i].setAttribute('disabled', true);
            jsPersInfoInputs[i].classList.add('disable-input');
        }
    }

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
        if (data) {
            alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
        } else {
            return
        }

        //update data and change elemenet appearance
        localData.personalInfo.masterPersonID = data.masterPersonID;
        localData.personalInfo.firstName = data.firstName;
        localData.personalInfo.middleName = data.middleName;
        localData.personalInfo.lastName = data.lastName;
        localData.personalInfo.dateOfBirth = formatDate(new Date(data.dateOfBirth));

        //confirmed data is saved
        isPersonInfoSave = true;

        //disable save button
        disableSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        await personalInfoEditAndUpdate()

        jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

        console.log(localData.personalInfo)
    }

    //edit and update personal info button
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

        function clickPersInfoEditBtn(e) {
            //**** enable input
            //**** change text to update
            //**** insert update class
            //**** change local data isActive to true
            //**** activate cancel button


            //enable input
            let input = e.target.closest('.jsInputBtnCont').querySelector('INPUT')
            input.removeAttribute('disabled');
            input.classList.remove('disable-input');

            //change text edit to update
            e.currentTarget.textContent = 'update'

            //insert class for update
            e.currentTarget.classList.add('jsWorkerInfoUpdateBtn');

            //change local data isActive to true
            localData.personalInfo.isActive = true;

            //activate cancel button
            personalInfoCancelBtn()
        }


        async function clickPersInfoUpdateBtn(e) {

            const input = e.target.closest('.jsInputBtnCont').querySelector('.jsPersInfoInput');

            if (!isNullOrWhiteSpace(input.value)) {
                input.classList.add('invalid');
                return;
            } else {
                input.classList.remove('invalid');
            }

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
            console.log(data)

            //validate return data
            if (!data) return


            //update data and change elemenet appearance
            localData.personalInfo[input.getAttribute('data-name')] = data.propertyValue;
            localData.personalInfo.isActive = false;

            console.log(localData.personalInfo)

            //change text update to edit
            e.target.textContent = 'edit'
            e.target.classList.remove('jsWorkerInfoUpdateBtn');

            //disable input
            input.setAttribute('disabled', true);
            input.classList.add('disable-input');

            //disable cancel, from closure function
            personalInfoCancelBtn()();
        }

        function personalInfoCancelBtn() {
            const jsWorkerInfoCancelBtn = document.querySelector('.jsWorkerInfoCancelBtn');
            jsWorkerInfoCancelBtn.addEventListener('click', clickPersonalInfoCancelBtn);

            function clickPersonalInfoCancelBtn() {
                //****collect all pers info input
                //****loop through input

                //collect all pers info input
                const jsPersInfoInputs = document.querySelectorAll('.jsPersInfoInput');

                //loop through input
                for (let i = 0; i < jsPersInfoInputs.length; i++) {
                    //find active input by searching disabled attribute
                    if (!jsPersInfoInputs[i].hasAttribute('disabled')) {
                        console.log(jsPersInfoInputs[i])
                        //disable inputs
                        jsPersInfoInputs[i].setAttribute('disabled', true);
                        jsPersInfoInputs[i].classList.add('disable-input');

                        //change text update to edit
                        const jsWorkerInfoEditBtn = jsPersInfoInputs[i].closest('.jsInputBtnCont').querySelector('.jsWorkerInfoEditBtn');
                        jsWorkerInfoEditBtn.textContent = 'edit';
                        jsWorkerInfoEditBtn.classList.remove('jsWorkerInfoUpdateBtn');

                        //change local data isActive to true
                        localData.personalInfo.isActive = false;

                        //retrieve records
                        const dataName = jsPersInfoInputs[i].getAttribute('data-name');
                        console.log(dataName)
                        jsPersInfoInputs[i].value = localData.personalInfo[dataName];
                    }
                }



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
        let jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
        let isValid = true;
        for (let i = 0; i < jsBenifitsInputs.length; i++) {
            if (isNullOrWhiteSpace(jsBenifitsInputs[i].value)) {
                jsBenifitsInputs[i].classList.add('invalid');
                isValid = false;
            } else {
                jsBenifitsInputs[i].classList.remove('invalid');
            }
        }

        return isValid;
    }

    function isRegexBenifitsValidationPassed() {
        let isValid = true;

        //umid number
        const jsUMIDNumber = document.querySelector('.jsUMIDNumber');
        if (!isNullOrWhiteSpace(jsUMIDNumber.value)) {
            if (!regexPatterns.umidNumber.test(jsUMIDNumber.value)) {
                console.log('UMIDNumber')
                jsUMIDNumber.classList.add('invalid');
                isValid = false
            } else {
                jsUMIDNumber.classList.remove('invalid');
            }
        }
        //sss number
        const jsSSSNumber = document.querySelector('.jsSSSNumber');
        if (!isNullOrWhiteSpace(jsSSSNumber.value)) {
            if (!regexPatterns.sssNumber.test(jsSSSNumber.value)) {
                console.log('SSSNumber')
                jsSSSNumber.classList.add('invalid');
                isValid = false
            } else {
                jsSSSNumber.classList.remove('invalid');
            }
        }

        //pag-ibig
        const jsPagIbigNumber = document.querySelector('.jsPagIbigNumber');
        if (!isNullOrWhiteSpace(jsPagIbigNumber.value)) {
            if (!regexPatterns.pagibigNumber.test(jsPagIbigNumber.value)) {
                console.log('PagIbigNumber')
                jsPagIbigNumber.classList.add('invalid');
                isValid = false
            } else {
                jsPagIbigNumber.classList.remove('invalid');
            }
        }

        //philhealth
        const jsPhilHealthNumber = document.querySelector('.jsPhilHealthNumber');
        if (!isNullOrWhiteSpace(jsPhilHealthNumber.value)) {
            if (!regexPatterns.philihealthNumber.test(jsPhilHealthNumber.value)) {
                console.log('PhilHealthNumber')
                jsPhilHealthNumber.classList.add('invalid');
                isValid = false
            } else {
                jsPhilHealthNumber.classList.remove('invalid');
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
            formData.append(`${jsBenifitsInputs[i].getAttribute('name')}`, value)
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
        const jsBenifitsEditBtns = document.querySelectorAll('.jsBenifitsEditBtn');
        for (let i = 0; i < jsBenifitsEditBtns.length; i++) {
            jsBenifitsEditBtns[i].classList.add('workerinfo-btn');
            jsBenifitsEditBtns[i].classList.remove('disable-btn');
        }

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
        let jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
        for (let i = 0; i < jsBenifitsInputs.length; i++) {
            jsBenifitsInputs[i].setAttribute('disabled', true);
            jsBenifitsInputs[i].classList.add('disable-input');
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
        //****it is ok if empty**/

        //regex validate
        if (!isRegexBenifitsValidationPassed()) return;


        //fetch data
        const options = collectBenifitsData()

        const data = await fetchData.postData('save-benifits', options)

        if (data) {
            alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
        } else {
            return
        }
        
        //update local data
        localData.benifits.umidNumber = data.umidNumber;
        localData.benifits.sssNumber = data.sssNumber;
        localData.benifits.pagIbigNumber = data.pagIbigNumber;
        localData.benifits.philHealthNumber = data.philHealthNumber;

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
            let jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
            for (let i = 0; i < jsBenifitsInputs.length; i++) {
                jsBenifitsInputs[i].removeAttribute('disabled');
                jsBenifitsInputs[i].classList.remove('disable-input');
            }

            //change text edit to update
            jsBenifitsEditBtn.textContent = 'update'

            //insert class for update
            jsBenifitsEditBtn.classList.add('jsBenifitsUpdateBtn');

            //activate cancel button
            benifitsCancelBtn()
        }


        async function clickBenifitsUpdateBtn() {

            //validation of input data
            if (!isBenifitsInputValid()) return;

            //regex
            if (!isRegexBenifitsValidationPassed()) return;


            //update data via fetch api
            const options = collectBenifitsData();
            let data = await fetchData.postData('update-benifits', options)
            console.log(data)

            //validate return data
            if (data) {
                alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.updateSuccessfull)
            } else {
                return
            }

            //update local data
            localData.benifits.umidNumber = data.umidNumber;
            localData.benifits.sssNumber = data.sssNumber;
            localData.benifits.pagibigNumber = data.pagIbigNumber;
            localData.benifits.philhealthNumber = data.philHealthNumber;

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
                let jsBenifitsInputs = document.querySelector('.jsWorkerInfoItemBenifitsMainCont').querySelectorAll('.jsBenifitsInput');
                for (let i = 0; i < jsBenifitsInputs.length; i++) {
                    jsBenifitsInputs[i].setAttribute('disabled', true);
                    jsBenifitsInputs[i].classList.add('disable-input');
                }

                //change text update to edit
                jsBenifitsEditBtn.textContent = 'Edit'

                //remove class for update
                jsBenifitsEditBtn.classList.remove('jsBenifitsUpdateBtn');

                //retrieve previous input value
                const jsWorkerInfoItemBenifitsMainCont = document.querySelector('.jsWorkerInfoItemBenifitsMainCont');
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsUMIDNumber').value = localData.benifits.umidNumber;
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsSSSNumber').value = localData.benifits.sssNumber;
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsPagIbigNumber').value = localData.benifits.pagIbigNumber;
                jsWorkerInfoItemBenifitsMainCont.querySelector('.jsPhilHealthNumber').value = localData.benifits.philHealthNumber;

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

    function isRegexContactValidationPassed() {
        let isValid = true;

        //mobile number
        const jsMobileNumber = document.querySelector('.jsMobileNumber');
        if (!regexPatterns.mobileNo.test(jsMobileNumber.value)) {
            jsMobileNumber.classList.add('invalid');
            isValid = false
        } else {
            jsMobileNumber.classList.remove('invalid');
        }

        //landline
        const jsLandlineNumber = document.querySelector('.jsLandlineNumber');
        if (!regexPatterns.landlineNo.test(jsLandlineNumber.value)) {
            jsLandlineNumber.classList.add('invalid');
            isValid = false
        } else {
            jsLandlineNumber.classList.remove('invalid');
        }

        //email address
        const jsEmailAddress = document.querySelector('.jsEmailAddress');
        if (!regexPatterns.emailAddress.test(jsEmailAddress.value)) {
            jsEmailAddress.classList.add('invalid');
            isValid = false
        } else {
            jsEmailAddress.classList.remove('invalid');
        }
        return isValid
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

        //check input validation
        if (!isContactsInputValid()) return;

        //check regex
        if (!isRegexContactValidationPassed()) return;


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

            //check regex
            if (!isRegexContactValidationPassed()) return

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