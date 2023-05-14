async function subLayout01() {
    //insert padding to body
    document.querySelector('body').classList.add('body-padding-top-bottom')

    //toogle menu
    const jsMainMenuLiCont = document.querySelectorAll('.jsMenuToogleDisplay');
    jsMainMenuLiCont.forEach((item) => {
        item.addEventListener('click', clickMainMenuLiToogleDisplay)
    })

    //click burger menu
    const jsMainBurgerMenu = document.querySelector('.jsMainBurgerMenu');
    jsMainBurgerMenu.addEventListener('click', clickBurgerMenu)

        
    //click user profile main menu
    const jsMainMenuUserProfileLi = document.querySelector('.jsMainMenuUserProfileLi');
    jsMainMenuUserProfileLi.addEventListener('click', clickMainMenuUserProfile)

    //click dashboard main menu
    const jsMainMenuDashboardLi = document.querySelector('.jsMainMenuDashboardLi');
    jsMainMenuDashboardLi.addEventListener('click', clickMainMenuDashboard)

    //click home main menu
    const jsMainMenuHomeLi = document.querySelector('.jsMainMenuHomeLi');
    jsMainMenuHomeLi.addEventListener('click', clickMenuHomeIcon)

   
    //click new employee main menu
    const jsMainMenuNewEmployeeSubLi = document.querySelector('.jsMainMenuNewEmployeeSubLi');
    jsMainMenuNewEmployeeSubLi.addEventListener('click', clickMainMenuNewEmployee)

    //click all employee main menu
    const jsMainMenuAllEmployeeSubLi = document.querySelector('.jsMainMenuAllEmployeeSubLi');
    jsMainMenuAllEmployeeSubLi.addEventListener('click', clickMainMenuAllEmployee)

    //click user profile footer icon
    const jsUserProfileFooterMenuIcon = document.querySelector('.jsUserProfileFooterMenuIcon');
    jsUserProfileFooterMenuIcon.addEventListener('click', clickMainMenuUserProfile)

    //click home footer menu
    const jsHomeFooterMenuIcon = document.querySelector('.jsHomeFooterMenuIcon');
    jsHomeFooterMenuIcon.addEventListener('click', await clickMenuHomeIcon)

};
function clickBurgerMenu() {
    const jsSubLayout01MenuSubCont = document.querySelector('.jsSubLayout01MenuSubCont');
    if (jsSubLayout01MenuSubCont.classList.contains('display-none')) {
        jsSubLayout01MenuSubCont.classList.remove('display-none')
    } else {
        jsSubLayout01MenuSubCont.classList.toggle('menu-animate-open')
        jsSubLayout01MenuSubCont.classList.toggle('menu-animate-close')
    }
}

async function clickMainMenuUserProfile(){
    const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');
    
    const view = await fetchData.viewData('/UsersProfile/UserProfileMainPage');

    const jsUserProfileMainCont = view.querySelector('.jsUserProfileMainCont');
    jsSublayout01ContentSubCont.innerHTML = '';
    jsSublayout01ContentSubCont.appendChild(jsUserProfileMainCont);

    //User profile function
    await userProfileMainPage();
}

async function clickMainMenuDashboard(){
    const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');

    const view = await fetchData.viewData('/DashBoard/MainPage');

    const jsDashboardMainCont = view.querySelector('.jsDashboardMainCont');
    jsSublayout01ContentSubCont.innerHTML = '';
    jsSublayout01ContentSubCont.appendChild(jsDashboardMainCont);

}

async function clickMenuHomeIcon() {
    const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');
    const view = await fetchData.viewData('/Home/MainPage');

    const jsHomeMainCont = view.querySelector('.jsHomeMainCont');
    console.log(jsHomeMainCont)
    jsSublayout01ContentSubCont.innerHTML = '';
    jsSublayout01ContentSubCont.appendChild(jsHomeMainCont);

    await homePage();
}

async function clickMainMenuNewEmployee() {
    const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');
    const view = await fetchData.viewData('employee-detail-page');

    const jsWorkersInfoMainCont = view.querySelector('.jsWorkersInfoMainCont');
    jsSublayout01ContentSubCont.innerHTML = '';
    jsSublayout01ContentSubCont.appendChild(jsWorkersInfoMainCont);

    await newEmployee();
}

async function clickMainMenuAllEmployee() {
    const jsSublayout01ContentSubCont = document.querySelector('.jsSublayout01ContentSubCont');
    const view = await fetchData.viewData('/AllEmployee/MainPage');

    const jsAllEmployeeMainCont = view.querySelector('.jsAllEmployeeMainCont');
    jsSublayout01ContentSubCont.innerHTML = '';
    jsSublayout01ContentSubCont.appendChild(jsAllEmployeeMainCont);

    await allEmployee();
}

function clickMainMenuLiToogleDisplay(e) {
    const jsSubLayout01MenuSubCont = document.querySelector('.jsSubLayout01MenuSubCont');

    if (e.currentTarget.classList.contains('jsSublayout01ContentSubCont')) {
        //this is main content container
        if (jsSubLayout01MenuSubCont.classList.contains('menu-animate-open')) {
            jsSubLayout01MenuSubCont.classList.toggle('menu-animate-open')
            jsSubLayout01MenuSubCont.classList.toggle('menu-animate-close')
        }
    } else {
        //this is for menu li container
        jsSubLayout01MenuSubCont.classList.toggle('menu-animate-open')
        jsSubLayout01MenuSubCont.classList.toggle('menu-animate-close')
    }
}
