async function personalInfo() {
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
            jsWorkerInfoEditBtns[i].classList.add('edit-btn-active');
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
    async function clickPersInfoSaveBtn(e) {
        //validation of input data
        if (!isPersonalInfoValid()) return;

        //spinner
        jsWorkerInfoSaveBtn.appendChild(spinnerType01());

        //save data via fetch api
        const options = collectPersonalData()
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
}