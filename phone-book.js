'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if ((/^[0-9]{10}$/).test(phone) && name && find(phone).length === 0) {
        phoneBook.push(new Phone(phone, name, email));

        return true;
    }

    return false;
}

function Phone(phone, name, email) {
    this.phone = phone;
    this.name = name;
    this.email = email;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    let countUpdateElements = 0;
    if (name === '' || name === undefined) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;
            countUpdateElements++;
        }

    }

    return countUpdateElements >= 1;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {

        return 0;
    }
    let count = 0;
    if (query === '*') {
        count = phoneBook.length;
        phoneBook.splice(0, phoneBook.length);

        return count;
    }
    let arrayIndex = indexRepeatEl(query);
    let ind = 0;
    let arrayResult = [];
    for (let i = 0; i < arrayIndex.length; i++) {
        arrayResult = arrayResult.concat(phoneBook.slice(ind, arrayIndex[i]));
        ind = arrayIndex[i] + 1;
    }
    phoneBook = arrayResult;

    return arrayIndex.length;
}

function indexRepeatEl(query) {
    let arrayIndex = [];
    for (let i = 0; i < phoneBook.length; i++) {
        let element = findElement(phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email, query);
        if ((element) || query === '*') {
            arrayIndex.push(i);
        }
    }

    return arrayIndex;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {

        return [];
    }
    let resultArray = [];
    phoneBook.sort(sortByName);
    let arrayIndex = indexRepeatEl(query);
    for (let i = 0; i < arrayIndex.length; i++) {
        let x = formatElement(arrayIndex[i]);
        if (x !== '') {
            resultArray.push(x);
        }
    }

    return resultArray;
}

function sortByName(a, b) {
    return a.name > b.name;
}

function findElement(ph, nm, em = '', query) {
    if (ph.includes(query) || nm.includes(query) || em.includes(query)) {
        return true;
    }

    return false;
}

function formatElement(i) {
    let strg = phoneBook[i].name + processPhone(i) + phoneBook[i].email;
    if (phoneBook[i].email === undefined) {
        strg = strg.substring(0, strg.length - 11);
    }
    if (phoneBook[i].email === '') {
        strg = strg.substring(0, strg.length - 2);
    }

    return strg;
}

function processPhone(i) {
    return ', +7 (' + phoneBook[i].phone.substring(0, 3) + ') ' +
    phoneBook[i].phone.substring(3, 6) + '-' +
    phoneBook[i].phone.substring(6, 8) + '-' +
    phoneBook[i].phone.substring(8) + ', ';
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let array = csv.split('\n');
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        let array2 = array[i].split(';');
        if (add(array2[1], array2[0], array2[2]) || update(array2[1], array2[0], array2[2])) {
            count++;
        }
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
