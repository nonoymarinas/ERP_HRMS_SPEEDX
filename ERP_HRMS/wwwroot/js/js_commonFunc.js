const persInfoFuncs = {
    disablePersInfoInputBtn: function () {
        //disable input
        let jsPersInfoInputs = document.querySelectorAll('.jsPersInfoInput');
        for (let i = 0; i < jsPersInfoInputs.length; i++) {
            jsPersInfoInputs[i].setAttribute('disabled', true);
            jsPersInfoInputs[i].classList.add('disable-input');
        }
    },
    disableSaveAndEnableEditBtn: function () {
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
        const jsWorkerInfoSaveBtn = document.querySelector('.jsWorkerInfoSaveBtn');
        jsWorkerInfoSaveBtn.classList.remove('workerinfo-btn');
        jsWorkerInfoSaveBtn.classList.add('disable-btn');

        //remove eventlistener
        jsWorkerInfoSaveBtn.removeEventListener('click', clickPersInfoSaveBtn)

        //disable input
        persInfoFuncs.disablePersInfoInputBtn()
    },

}