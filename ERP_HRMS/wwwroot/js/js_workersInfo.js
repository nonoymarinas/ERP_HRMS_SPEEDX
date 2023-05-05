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
    }

    //global-local variables
    let isPersonInfoSave = false;

    //helper function
    function isPersonalInfoValid() {
        //--check if data empty or not
        let required = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.required');
        let isValid = true;
        for (let i = 0; i < required.length; i++) {
            if (isNullOrWhiteSpace(required[i].value)) {
                required[i].classList.add('invalid');
                isValid = false;
            } else {
                required[i].classList.remove('invalid');
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
        jsWorkerInfoEditBtn.classList.add('workerinfo-edit-btn');
        jsWorkerInfoEditBtn.classList.remove('disable-btn');

        //disable save button
        jsWorkerInfoSaveBtn.classList.remove('workerinfo-save-btn');
        jsWorkerInfoSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

        //disable input
        disablePersonalInputBtn()
    }
    function disablePersonalInputBtn() {
        //disable input
        let required = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.required');
        for (let i = 0; i < required.length; i++) {
            required[i].setAttribute('disabled', true);
            required[i].classList.add('disable-input');
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
        await editAndUpdate()
    }

    async function editAndUpdate() {
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
            let required = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.required');
            for (let i = 0; i < required.length; i++) {
                required[i].removeAttribute('disabled');
                required[i].classList.remove('disable-input');
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
        }

        function personalInfoCancelBtn() {
            const jsWorkerInfoCancelBtn = document.querySelector('.jsWorkerInfoCancelBtn');
            jsWorkerInfoCancelBtn.addEventListener('click', clickPersonalInfoCancelBtn);

            function clickPersonalInfoCancelBtn() {
                //disable input
                let required = document.querySelector('.jsWorkerInfoItemPersInfoMainCont').querySelectorAll('.required');
                for (let i = 0; i < required.length; i++) {
                    required[i].setAttribute('disabled',true);
                    required[i].classList.add('disable-input');
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
                console.log(jsWorkerInfoItemPersInfoMainCont.querySelector('.jsDateOfBirth').value = localData.personalInfo.dateOfBirthFormatted())
                jsWorkerInfoItemPersInfoMainCont.querySelector('.jsDateOfBirth').value = localData.personalInfo.dateOfBirthFormatted();

            }

            //enable cancel button
            jsWorkerInfoCancelBtn.classList.remove('disable-btn');

        }
    }
    
    
    //save benifits button
    const jsWorkerBenifitsSaveBtn = document.querySelector('.jsWorkerBenifitsSaveBtn');
    jsWorkerBenifitsSaveBtn.addEventListener('click', clickBenifitsSaveBtn)

    async function clickBenifitsSaveBtn() {
        if (!isPersonInfoSave) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Save Personal Info First!')
            return;
        }

        if (localData.personalInfo.isActive) {
            await alertCustom.isConfirmedOk(alertContainer.warningAlert, 'Finish Personal Info First!')
            return;
        }

    }


}