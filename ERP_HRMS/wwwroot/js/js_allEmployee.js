async function allEmployee() {
    //load reference data
    const linkedList = await allEmployeeRefData.getMasterPersonData()
    console.log(linkedList)

    const jsSearchInput = document.querySelector('.jsSearchInput');
    jsSearchInput.addEventListener('input', inputSearchName)
    let jsSearchCont = document.querySelector('.jsSearchCont');
    function inputSearchName(e) {
        if (e.target.value == '') {
            jsSearchCont.classList.add('display-none');
        } else if (jsSearchCont.classList.contains('display-none')) {
            jsSearchCont.classList.remove('display-none');
        }

        jsSearchCont.innerHTML = '';
        let searchDataArray = linkedList.linkedListIndexOf('fullName', e.target.value)
        for (let i = 0; i < searchDataArray.length; i++) {
            let htmlString = `<li class="search-item-result-li jsSearchResultLi" data-id=${searchDataArray[i].masterPersonID}>${searchDataArray[i].fullName}</li>`
            let jsSearchResultLi = new DOMParser().parseFromString(htmlString, 'text/html').querySelector('.jsSearchResultLi');

            jsSearchResultLi.addEventListener('click',clickSearchResultLi)

            function clickSearchResultLi(e) {
                jsSearchInput.setAttribute('data-id', e.target.getAttribute('data-id'));
                jsSearchInput.value = e.target.textContent;
                jsSearchCont.classList.add('display-none');
            }

            jsSearchCont.appendChild(jsSearchResultLi);
        }
       
    }

    const jsAllEmpSearchBtn = document.querySelector('.jsAllEmpSearchBtn');
    jsAllEmpSearchBtn.addEventListener('click', clickSearchBtn);
    async function clickSearchBtn(e) {
        const MasterPersonID = document.querySelector('.jsSearchInput').getAttribute('data-id');
        const formData = new FormData();
        formData.append('MasterPersonID', MasterPersonID)

        const options = {
            method: 'POST',
            body: formData
        }
        console.log(MasterPersonID)
        const data = await fetchData.postData('single-employee-data', options)

        console.log(data)

        if (!data) return;

        //save data to employee local data
        localData.personalInfo.masterPersonID = data.personalInfo.masterPersonID;
        localData.personalInfo.employeeNumber = data.personalInfo.employeeNumber;
        localData.personalInfo.firstName = data.personalInfo.firstName;
        localData.personalInfo.middleName = data.personalInfo.middleName;
        localData.personalInfo.lastName = data.personalInfo.lastName;
        localData.personalInfo.dateOfBirth = dateFormat.yyyymmddDashed(data.personalInfo.dateOfBirth);
        localData.personalInfo.isActive = false;
        localData.personalInfo.isDataSaved = true;

        console.log(dateFormat.yyyymmddDashed(data.personalInfo.dateOfBirth))

        localData.benifits.umidNumber = data.benifits.umidNumber;
        localData.benifits.sssNumber = data.benifits.sssNumber;
        localData.benifits.pagIbigNumber = data.benifits.pagIbigNumber;
        localData.benifits.philHealthNumber = data.benifits.philHealthNumber;
        localData.benifits.isDataSaved = true;

        localData.contacts.mobileNumber = data.contacts.mobileNumber;
        localData.contacts.landLineNumber = data.contacts.landLineNumber;
        localData.contacts.emailAddress = data.contacts.emailAddress;
        localData.contacts.isDataSaved = true;

        localData.compensation.basicSalary = data.compensation.basicSalary;
        localData.compensation.allowance = data.compensation.allowance;
        localData.compensation.currencyID = data.compensation.currencyID;
        localData.compensation.ratePeriodID = data.compensation.ratePeriodID;
        localData.compensation.hourPerDay = data.compensation.hourPerDay;
        localData.compensation.dayPerMonth = data.compensation.dayPerMonth;
        localData.compensation.isSalaryFixed = data.compensation.isSalaryFixed;
        localData.compensation.isDataSaved = true;

        await employeeDetailsView();

        
    }

    async function employeeDetailsView() {
        //fetch view for display
        const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');
        const view = await fetchData.viewData('employee-detail-page');

        const jsWorkersInfoMainCont = view.querySelector('.jsWorkersInfoMainCont');
        jsSublayout01ContentSubCont.innerHTML = '';
        jsSublayout01ContentSubCont.appendChild(jsWorkersInfoMainCont);

        await newEmployee();

        persInfoAfterSaved();
        benifitsAfterSaved();
        contactsAfterSaved();
        compensationAfterSaved();

        modifiyUIDisplay();

    }
    async function persInfoAfterSaved() {
        //personal information
        document.querySelector('.jsEmployeeNumberText').textContent = localData.personalInfo.employeeNumber;
        document.querySelector('.jsFirstName').value = localData.personalInfo.firstName;
        document.querySelector('.jsMiddleName').value = localData.personalInfo.middleName;
        document.querySelector('.jsLastName').value = localData.personalInfo.lastName;
        document.querySelector('.jsDateOfBirth').value = localData.personalInfo.dateOfBirth;

        //disable save button
        disablePersInfoSaveAndEnableEditBtn();
        disablePersInfoInputBtn();
        
        //this function should run manually because save button is disabled without clicking, so this function is not activated
        await personalInfoEditAndUpdate()
    }

    async function benifitsAfterSaved()  {
        //benifits information
        document.querySelector('.jsUMIDNumber').value = localData.benifits.umidNumber;
        document.querySelector('.jsSSSNumber').value = localData.benifits.sssNumber;
        document.querySelector('.jsPagIbigNumber').value = localData.benifits.pagIbigNumber;
        document.querySelector('.jsPhilHealthNumber').value = localData.benifits.philHealthNumber;

        //disable save button
        disableBeniftsSaveAndEnableEditBtn();
        disableBenifitsInput();

        //this function should run manually because save button is disabled without clicking, so this function is not activated
        await benifitsEditAndUpdate()
    }

    async function contactsAfterSaved() {
        //contacts information
        document.querySelector('.jsMobileNumber').value = localData.contacts.mobileNumber;
        document.querySelector('.jsLandLineNumber').value = localData.contacts.landLineNumber;
        document.querySelector('.jsEmailAddress').value = localData.contacts.emailAddress;

        //disable save button
        disableContactSaveAndEnableEditBtn();
        disableContactsInput();

        //this function should run manually because save button is disabled without clicking, so this function is not activated
        await contactsEditAndUpdate()
    }

    async function compensationAfterSaved() {
        //compensation information
        document.querySelector('.jsBasicSalary').value = localData.compensation.basicSalary;
        document.querySelector('.jsAllowance').value = localData.compensation.allowance;

        const jsRatePeriod = document.querySelector('.jsRatePeriod');
        const ratePeriod = localData.compensation.ratePeriodID;
        if (parseInt(ratePeriod) == 1) {
            jsRatePeriod.options[0].setAttribute('selected', true)
        } else {
            jsRatePeriod.options[1].setAttribute('selected', true)
        }

        const jsIsSalaryFixed = document.querySelector('.jsIsSalaryFixed');
        const isSalaryFixed = localData.compensation.isSalaryFixed;
        if (parseInt(isSalaryFixed) == 0) {
            jsIsSalaryFixed.options[0].setAttribute('selected', true)
        } else {
            jsIsSalaryFixed.options[1].setAttribute('selected', true)
        }

        //disable save button
        disableCompensationSaveAndEnableEditBtn();
        disableCompensationInput();

        //this function should run manually because save button is disabled without clicking, so this function is not activated
        await compensationEditAndUpdate()
    }

    function modifiyUIDisplay() {
        //hide save button
        const jsWorkersSaveBtns = document.querySelectorAll('.jsWorkersSaveBtn');
        for (let i = 0; i < jsWorkersSaveBtns.length; i++) {
            jsWorkersSaveBtns[i].classList.add('display-none');
        }

        //change grid of header
        const jsWorkerHeaderTitleConts = document.querySelectorAll('.jsWorkerHeaderTitleCont');
        for (let i = 0; i < jsWorkerHeaderTitleConts.length; i++) {
            jsWorkerHeaderTitleConts[i].classList.add('display-grid-col-1fr-60px');
        }


        //insert picture container
        let htmlString = `<div class="worker-imageid-main-cont jsWorkerImageIDMainCont">
                            <div class="worker-imageid-sub-cont">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="worker-image-svg-cont">
                                    <path  class="worker-image-svg-path" d="M336 128a112 112 0 1 0 -224 0 112 112 0 1 0 224 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM16 482.3c0 7.6 6.1 13.7 13.7 13.7H418.3c7.6 0 13.7-6.1 13.7-13.7C432 392.7 359.3 320 269.7 320H178.3C88.7 320 16 392.7 16 482.3zm-16 0C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                                </svg>
                            </div>
                        </div>`

        let jsWorkerImageIDMainCont = new DOMParser().parseFromString(htmlString, 'text/html').querySelector('.jsWorkerImageIDMainCont');

        const jsWorkerInfoSubCont = document.querySelector('.jsWorkerInfoSubCont');
        const jsPersInfoHeaderTitleCont = document.querySelector('.jsPersInfoHeaderTitleCont');

        //insert
        jsWorkerInfoSubCont.insertBefore(jsWorkerImageIDMainCont, jsPersInfoHeaderTitleCont);

        //change bottom border
        const jsWorkerInfoTitleCont = document.querySelector('.jsWorkerInfoTitleCont');
        jsWorkerInfoTitleCont.classList.add('border-bottom-1px-808080');

        //change title text
        const jsWorkerInfoTitleText = document.querySelector('.jsWorkerInfoTitleText');
        jsWorkerInfoTitleText.textContent = 'Employee Information'
    }


}