
async function workersContact() {
    //3. CONTACTS *****************************************************************************//

    function isContactsRequiredFieldsComplete() {
        let isValid = true
        const jsMobileNumber = document.querySelector('.jsMobileNumber');
        if (isNullOrWhiteSpace(jsMobileNumber.value)) {
            jsMobileNumber.classList.add('invalid');
            isValid = false
        } else {
            jsMobileNumber.classList.remove('invalid');
        }
        return isValid;
    }

    function isRegexContactValidationPassed() {
        let isValid = true;

        //mobile number
        const jsMobileNumber = document.querySelector('.jsMobileNumber');
        if (!jsMobileNumber.hasAttribute('disabled')) {
            if (!isNullOrWhiteSpace(jsMobileNumber.value)) {
                if (!regexPatterns.mobileNo.test(jsMobileNumber.value)) {
                    jsMobileNumber.classList.add('invalid');
                    isValid = false
                } else {
                    jsMobileNumber.classList.remove('invalid');
                }
            }
        }


        //landline
        const jsLandLineNumber = document.querySelector('.jsLandLineNumber');
        if (!jsLandLineNumber.hasAttribute('disabled')) {
            if (!isNullOrWhiteSpace(jsLandLineNumber.value)) {
                if (!regexPatterns.landlineNo.test(jsLandLineNumber.value)) {
                    jsLandLineNumber.classList.add('invalid');
                    isValid = false
                } else {
                    jsLandLineNumber.classList.remove('invalid');
                }
            }
        }

        //email address
        const jsEmailAddress = document.querySelector('.jsEmailAddress');
        if (!jsEmailAddress.hasAttribute('disabled')) {
            if (!isNullOrWhiteSpace(jsEmailAddress.value)) {
                if (!regexPatterns.emailAddress.test(jsEmailAddress.value)) {
                    jsEmailAddress.classList.add('invalid');
                    isValid = false
                } else {
                    jsEmailAddress.classList.remove('invalid');
                }
            }
        }
        return isValid
    }

    function collectContactsData() {
        //collecton of data
        let jsContactsInput = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.jsContactsInput');
        let formData = new FormData();

        for (let i = 0; i < jsContactsInput.length; i++) {
            let value = jsContactsInput[i].value
            if (isNullOrWhiteSpace(jsContactsInput[i].value)) {
                value = null;
            }
            formData.append(jsContactsInput[i].getAttribute('name'), value)
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
        const jsContactEditBtns = document.querySelectorAll('.jsContactsEditBtn');
        for (let i = 0; i < jsContactEditBtns.length; i++) {
            jsContactEditBtns[i].classList.add('edit-btn-active');
        }

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
        let jsContactsInputs = document.querySelector('.jsWorkerInfoItemContactMainCont').querySelectorAll('.jsContactsInput');
        for (let i = 0; i < jsContactsInputs.length; i++) {
            jsContactsInputs[i].setAttribute('disabled', true);
            jsContactsInputs[i].classList.add('disable-input');
        }
    }


    //save contacts button*******************************************************
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

        //check if required field is complete
        console.log(isContactsRequiredFieldsComplete())
        if (!isContactsRequiredFieldsComplete()) return

        //check regex
        if (!isRegexContactValidationPassed()) return;

        //spinner on
        jsContactSaveBtn.appendChild(spinnerType01());

        const options = collectContactsData()

        const data = await fetchData.postData('save-contacts', options)

        //spinner off
        jsContactSaveBtn.querySelector('.jsSpinnerCont').remove();

        //validate return data
        if (data) {
            alertCustom.isConfirmedOk(alertContainer.successAlert, alertMessages.saveSuccessfull)
        } else {
            return
        }
        console.log(data)
        //update local data
        localData.contacts.mobileNumber = data.mobileNumber;
        localData.contacts.landLineNumber = data.landLineNumber;
        localData.contacts.emailAddress = data.emailAddress;

        //disable save buttons and enable edit
        disableContactSaveAndEnableEditBtn()

        //edit and update should run only after saved is done, thats why it located in here
        await contactsEditAndUpdate()
    }

    async function contactsEditAndUpdate() {
        //select all edit buttons
        const jsContactsEditBtns = document.querySelectorAll('.jsContactsEditBtn');
        for (let i = 0; i < jsContactsEditBtns.length; i++) {
            jsContactsEditBtns[i].addEventListener('click', clickContactsEditUpdateBtn)
            async function clickContactsEditUpdateBtn(e) {
                if (jsContactsEditBtns[i].classList.contains('jsContactsUpdateBtn')) {
                    await clickContactUpdateBtn(e)
                } else {
                    clickContactEditBtn(e)
                }
            }
        }

        function clickContactEditBtn(e) {

            //enable input
            let jsContactsInput = e.target.closest('.jsInputBtnCont').querySelector('.jsContactsInput');
            console.log(jsContactsInput)
            jsContactsInput.removeAttribute('disabled');
            jsContactsInput.classList.remove('disable-input');

            //change text edit to update
            e.currentTarget.textContent = 'UPDATE'

            //insert class for update
            e.currentTarget.classList.add('jsContactsUpdateBtn');
            e.currentTarget.classList.add('update-btn-active');

            //activate cancel button
            contactCancelBtn()
        }


        async function clickContactUpdateBtn(e) {

            //validation of input data
            if (e.target.getAttribute('name') == 'MobileNumber') {
                if (!isContactsRequiredFieldsComplete()) return;
            }
            
            //check regex
            if (!isRegexContactValidationPassed()) return

            //spinner on
            e.target.appendChild(spinnerType01());

            //update data via fetch api

            const jsContactsInput = e.target.closest('.jsInputBtnCont').querySelector('.jsContactsInput');
            const PropertyName = jsContactsInput.getAttribute('name');
            const PropertyValue = jsContactsInput.value;

            const formData = new FormData();
            formData.append('MasterPersonID', localData.personalInfo.masterPersonID)
            formData.append('PropertyName', PropertyName)
            formData.append('PropertyValue', PropertyValue)

            const options = {
                method: 'POST',
                body: formData
            }

            let data = await fetchData.postData('update-contacts', options)
            
            // remove spinner
            e.target.querySelector('.jsSpinnerCont').remove();

            //validate return data
            if (!data) return

            //update data and change elemenet appearance
            localData.contacts[jsContactsInput.getAttribute('data-name')] = data.propertyValue;

            console.log(localData.contacts)

            //change text update to edit
            e.target.textContent = 'EDIT'
            e.target.classList.remove('jsContactsUpdateBtn');
            e.target.classList.remove('update-btn-active');

            //disable input
            jsContactsInput.setAttribute('disabled', true);
            jsContactsInput.classList.add('disable-input');

            //disable cancel, from closure function
            contactCancelBtn()();
        }


        function contactCancelBtn() {
            const jsContactCancelBtn = document.querySelector('.jsContactCancelBtn');
            jsContactCancelBtn.addEventListener('click', clickContactCancelBtn);

            function clickContactCancelBtn() {
                
                //collect all pers info input
                const jsContactsInputs = document.querySelectorAll('.jsContactsInput');

                //loop through input
                for (let i = 0; i < jsContactsInputs.length; i++) {
                    //find active input by searching disabled attribute
                    if (!jsContactsInputs[i].hasAttribute('disabled')) {
                        console.log(jsContactsInputs[i])

                        //disable inputs
                        jsContactsInputs[i].setAttribute('disabled', true);
                        jsContactsInputs[i].classList.add('disable-input');

                        //change text update to edit
                        const jsContactsEditBtn = jsContactsInputs[i].closest('.jsInputBtnCont').querySelector('.jsContactsEditBtn');
                        jsContactsEditBtn.textContent = 'EDIT';
                        jsContactsEditBtn.classList.remove('jsContactsUpdateBtn');
                        jsContactsEditBtn.classList.remove('update-btn-active');


                        //retrieve records
                        const dataName = jsContactsInputs[i].getAttribute('data-name');
                        jsContactsInputs[i].value = localData.contacts[dataName];
                    }
                }

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
}