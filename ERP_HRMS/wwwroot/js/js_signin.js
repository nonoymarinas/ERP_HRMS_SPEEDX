(async function signIn() {
    const jsSiginLoginBtn = document.querySelector('.jsSiginLoginBtn');
    jsSiginLoginBtn.addEventListener('click', clickSignBtn)

    async function clickSignBtn() {
        const jsMainLayoutCont = document.querySelector('.jsMainLayoutCont');
        jsMainLayoutCont.innerHTML = '';

        const view = await fetchData.viewData('DashBoard/MainPage');
        const jsSublayout01MainCont = view.querySelector('.jsSublayout01MainCont');
        jsMainLayoutCont.appendChild(jsSublayout01MainCont);

        await subLayout01()
    }
})();

