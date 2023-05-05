const regExpValidationPatterns = {
    emailAddress: /^([a-z\d\.-]+)@([a-z\d-]+).([a-z]{2,8})(\.[a-z]{2,8})$/,
    iStillLoveYou: /^([\w@-]{8,20})$/,
    confirmPassword: /^([\w@-]{8,20})$/,
    mobileNo: /^(\+?\(?)([0-9\)-]{6,20})$/,
    landlineNo: /^(\+?\(?)([0-9\)-]{6,20})$/,
    latitude: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
    longitude: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
    containerNo: /^(?:\s*[a-zA-Z0-9,_\.\077\0100\*\+\&\#\'\~\;\-\!\@\;]{1,}\s*)*$/,
    weigth: /^[+-]?\d+(\.\d+)?$/,
    quantity: /^[+-]?\d+(\.\d+)?$/
}

function validate(targetElement, regex) {
    return regex.test(targetElement.value)
}

function isNullOrWhiteSpace(str) {
    return str == null || str.toString().replace(/\s/g, '').length < 1;
}

const alertMessages = {
    saveSuccessfull: 'Save Successfull!',
    updateSuccessfull: 'Update Successfull!',
    deleteSuccessfull: 'Successfully Deleted!',
    inputFormat: `Invalid input character!`,
    databaseError: `Database Error!`,
    duplicateError: `File already exist in database!\n Modify file name!`,
    serverError: `Server Error!`,
    delDatabaseItem: `Are you sure? \n This will be permanently deleted!`,
    createProjectFirst: `Create and save Project Name first!`,
    itemHidden: `Items are hidden! \n Click arrow to show items!`,
    nothingToHide: `Nothing to hide!`,
    failedToLoadHeader: 'Save successfully \n But failed to load header!',
    passwordDonotMatch: 'Confirm password did not match!\nPlease check..',
    usernamePasswordNotFound: 'Username or Password do not match or don\'t exist!',
    areYouSureYouWantToClose: 'Are you sure you want to close?'
}

const alertContainer = {

    successAlert: {
        iconClassName: 'alert-header-icon-success',
        colorClassName: 'color-success',
        headerText: 'Success..',
        imageSrc: "/icon/alert/check-solid.svg"
    },

    errorAlert: {
        iconImageClassName: 'alert-header-icon-error',
        colorClassName: 'color-error',
        headerText: 'Error message..',
        imageSrc: "/icon/alert/xmark-solid.svg"
    },

    warningAlert: {
        iconImageClassName: 'alert-header-icon-warning',
        colorClassName: 'color-warning',
        headerText: 'Warning..',
        imageSrc: "/icon/alert/triangle-exclamation-solid.svg"
    },

    criticalAlert: {
        iconImageClassName: 'alert-header-icon-critical',
        colorClassName: 'color-critical',
        headerText: 'Critical..',
        imageSrc: "/icon/alert/triangle-exclamation-solid.svg"
    },

    infolAlert: {
        iconImageClassName: 'alert-header-icon-info',
        colorClassName: 'color-info',
        headerText: 'Information...',
        imageSrc: "/icon/alert/info-circle-light.svg"
    }
}



const alertCustom = {
    isConfirmedOk: async function (alertContainerType, alertMessage) {
        //const jsAlertMainExpandableContOk = (await fetchData.viewData('/Alert/ConfirmedOk')).querySelector('.jsAlertMainExpandableContOk');

        const htmlString = `<div class="alert-main-expandable-cont jsAlertMainExpandableContOk">
                                <div class="alert-cont-type-ok">
                                    <div class="alert-header-cont-ok jsAlertHeaderContOk">
                                        <div class="alert-img-cont-ok ">
                                            <img class="alert-img-ok jsAlertImgOk"/>
                                        </div>
                                        <label class="alert-header-label-ok jsAlertHeaderLabelOk"></label>
                                    </div>
                                    <div class="alert-content-cont-ok">
                                        <p class="alert-paragraph-ok jsAlertParagraphOk"></p>
                                    </div>
                                    <div class="alert-footer-cont-ok">
                                        <button class="alert-button-ok jsAlertButtonOk">OK</button>
                                    </div>
                                </div>
                            </div>`;
        const jsAlertMainExpandableContOk = new DOMParser().parseFromString(htmlString, 'text/html').querySelector('.jsAlertMainExpandableContOk');
        jsAlertMainExpandableContOk.querySelector('.jsAlertParagraphOk').innerHTML = alertMessage;
        jsAlertMainExpandableContOk.querySelector('.jsAlertHeaderContOk').classList.add(alertContainerType.colorClassName);
        jsAlertMainExpandableContOk.querySelector('.jsAlertHeaderLabelOk').innerHTML = alertContainerType.headerText;
        jsAlertMainExpandableContOk.querySelector('.jsAlertImgOk').src = alertContainerType.imageSrc;

        jsAlertMainExpandableContOk.querySelector('.jsAlertButtonOk').addEventListener('click', (e) => {
            e.target.closest('.jsAlertMainExpandableContOk').remove();
        })

        document.querySelector('body').appendChild(jsAlertMainExpandableContOk);
    },

    confirmedYesOrNo: async function () {
        const jsAlertMainExpandableCont = (await fetchData.viewData('/Alert/IsYesOrNo')).querySelector('.jsAlertMainExpandableCont')
        document.querySelector('body').appendChild(jsAlertMainExpandableCont);

        return new Promise(function (resolve, reject) {
            document.querySelector('.jsAlertHeaderClose').addEventListener('click', function (e) {
                reject('No');
                e.target.closest('.jsAlertMainExpandableCont').remove();
            })
            document.querySelector('.jsAlertFooterTextYes').addEventListener('click', function (e) {
                resolve('Yes');
                e.target.closest('.jsAlertMainExpandableCont').remove();
            })
            document.querySelector('.jsAlertFooterTextNo').addEventListener('click', function (e) {
                reject('No');
                e.target.closest('.jsAlertMainExpandableCont').remove();
            })
        })
    }
}

const fetchData = {
    viewData: async function (url) {
        return await fetch(url).then(function (res) {
            if (res.ok) return res.text()
        }).then(function (data) {
            return new DOMParser().parseFromString(data, 'text/html')
        })
    },

    getData: async function (dataUrl) {
        let dataResult;
        await fetch(dataUrl).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw alertMessages.serverError;
            }

        }).then((data) => {
            if (data.statusCodeNumber == 1) {
                dataResult = data
            } else {
                throw alertMessages.databaseError
            }
        }).catch((error) => {
            alertCustom.isConfirmedOk(alertContainer.errorAlert, error)
        })

        return dataResult
    },
    postData: async function (dataUrl, options) {
        let dataResult;
        await fetch(dataUrl, options).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw alertMessages.serverError;
            }

        }).then((data) => {
            dataResult = data
            if (data.statusCodeNumber == 1) {
                dataResult = data
            } else {
                throw alertMessages.databaseError
            }
        }).catch((error) => {
            alertCustom.isConfirmedOk(alertContainer.errorAlert, error)
        })

        return dataResult
    },
    postViewData: async function (url, options) {
        return await fetch(url, options).then(function (res) {
            if (res.ok) {
                return res.text()
            } else {
                throw alertMessages.serverError;
            }
        }).then(function (data) {
            return new DOMParser().parseFromString(data, 'text/html')
        })
    },
}


class SelectCustom01 extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="selectCustomMainCont">
                            <div class="selectCustomCont">
                                <input class="jsSelectInput selectCustomInput"/>
                                <div class="selectCustomIconCont">
                                    <svg class="selectCustomIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="18px" fill="#555"><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg>
                                </div>
                            </div>

                            <ul class="select-custom-ul selectCustomUl display-none">
                                
                            </ul>
                        </div>`

    }
}

customElements.define('select-element', SelectCustom01);

class LinkedList_Node {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class LinkedList {
    constructor(value) {
        const newNode = new LinkedList_Node(value)
        this.head = newNode
        this.tail = this.head
        this.length = 1
    }

    push(value) {
        const newNode = new LinkedList_Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.next = newNode
            this.tail = newNode
        }
        this.length++
        return this
    }

    pop() {
        if (!this.head) return undefined
        let temp = this.head
        let pre = this.head
        while (temp.next) {
            pre = temp
            temp = temp.next
        }
        this.tail = pre
        this.tail.next = null
        this.length--
        if (this.length === 0) {
            this.head = null
            this.tail = null
        }
        return temp
    }

    unshift(value) {
        const newNode = new LinkedList_Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            newNode.next = this.head
            this.head = newNode
        }
        this.length++
        return this
    }

    shift() {
        if (!this.head) return undefined
        let temp = this.head
        this.head = this.head.next
        this.length--
        if (this.length === 0) {
            this.tail = null
        }
        temp.next = null
        return temp
    }

    get(index) {
        if (index < 0 || index >= this.length) return undefined
        let temp = this.head
        for (let i = 0; i < index; i++) {
            temp = temp.next
        }
        return temp
    }

    set(index, value) {
        let nodeToUpdate = this.get(index)
        if (nodeToUpdate) {
            nodeToUpdate.value = value
            return true
        }
        return false
    }

    setByPropertyNameValue(propertyName, propertyValue, value) {
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[propertyName] === propertyValue) {
                temp.value = value
                return true
            } else {
                temp = temp.next
            }
        }
        return false
    }

    insert(index, value) {
        if (index < 0 || index > this.length) return false
        if (index === this.length) return this.push(value)
        if (index === 0) return this.unshift(value)

        const newNode = new Node(value)
        const temp = this.get(index - 1)
        newNode.next = temp.next
        temp.next = newNode
        this.length++
        return true
    }

    remove(index) {
        if (index < 0 || index >= this.length) return undefined
        if (index === 0) return this.shift()
        if (index === this.length - 1) return this.pop()

        const before = this.get(index - 1)
        const temp = before.next

        before.next = temp.next
        temp.next = null
        this.length--
        return temp
    }

    reverse() {
        let temp = this.head
        this.head = this.tail
        this.tail = temp
        let next = temp.next
        let prev = null
        for (let i = 0; i < this.length; i++) {
            next = temp.next
            temp.next = prev
            prev = temp
            temp = next
        }
        return this
    }

    linkedListIndexOf(PropertyName, SearchString) {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[PropertyName].toLowerCase().indexOf(SearchString.toLowerCase()) !== -1) results.push(temp.value)
            temp = temp.next
        }
        return results
    }

    linkedListIndexOfReturnObject(PropertyName, SearchString) {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[PropertyName].toLowerCase().indexOf(SearchString.toLowerCase()) !== -1) results.push(temp)
            temp = temp.next
        }
        return results
    }

    getByPropertyNameAndValue(propertyName, value) {
        let result
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[propertyName] == value) {
                break
            } else {
                temp = temp.next
            }
        }
        result = temp.value
        return result
    }

    getAll() {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            results.push(temp.value)
            temp = temp.next
        }
        return results
    }
}

const dateFormat = {
    monthStringName: function (monthNumber) {
        switch (monthNumber) {
            case 1:
                return 'Jan'
                break
            case 2:
                return 'Feb'
                break
            case 3:
                return 'Mar'
                break
            case 4:
                return 'Apr'
                break
            case 5:
                return 'May'
                break
            case 6:
                return 'Jun'
                break
            case 7:
                return 'Jul'
                break
            case 8:
                return 'Aug'
                break
            case 9:
                return 'Sep'
                break
            case 10:
                return 'Oct'
                break
            case 11:
                return 'Nov'
                break
            default:
                return 'Dec'
        }

    },

    mmddyyDashed: function (dateString) {
        const date = new Date(dateString)
        const yyyy = date.getFullYear().toString();
        let mm = date.getMonth() + 1; // Months start at 0!

        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        //let formattedDateNow = dd + '/' + mm + '/' + yyyy;
        let formattedDate = `${mm}-${dd}-${yyyy.substring(2, 4)}`;
        return formattedDate
    },

    ddmmyyDashedMonthStringName: function (dateString) {
        const date = new Date(dateString)
        const yyyy = date.getFullYear().toString();
        let mmNumber = parseInt(date.getMonth() + 1); // Months start at 0!
        let mm = dateFormat.monthStringName(mmNumber)
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        //if (mm < 10) mm = '0' + mm;


        //let formattedDateNow = dd + '/' + mm + '/' + yyyy;
        let formattedDate = `${dd}-${mm}-${yyyy.substring(2, 4)}`;
        return formattedDate
    }

}

let cssSpinner = {
    spinnerType1Html: function () {
        const htmlString = `<div class="spinner-main-cont spinnerType1MainCont"><div class="lds-roller jsLdsRollerSpinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
        const spinnerType1MainCont = new DOMParser().parseFromString(htmlString, 'text/html').querySelector('.spinnerType1MainCont');
        return spinnerType1MainCont;
    }
}

function formatDateTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getFullYear() + "/" + date.getMonth() + 1) + "/" + date.getDate() + "/" + "  " + strTime;
}

function formatDate(date) {
    let day = date.getDate();
    let month = parseInt(date.getMonth()) + 1
    if (day <= 9) {
        day = '0' + day
    }
    if (month <= 9) {
        month = '0' + month
    }

    return (date.getFullYear() + "-" + month + "-" + day)
}
