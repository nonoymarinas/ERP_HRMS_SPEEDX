function spinnerType01() {
    htmlString = `<div class="spinner-cont jsSpinnerCont">
                        <div class="lds-dual-ring"></div>
                    </div>`
    const htmlDoc = new DOMParser().parseFromString(htmlString, 'text/html');
    const jsSpinnerCont = htmlDoc.querySelector('.jsSpinnerCont');
    return jsSpinnerCont;
}