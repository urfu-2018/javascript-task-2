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
    if ((/^[0-9]{10}$/).test(phone) && name !== '' && name !== undefined &&
    !phoneBook.some(e => e.phone === phone)) {
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
    let count = 0;
    phoneBook.sort(sortAr);
    if (query === '*') {

        return findAndRemoveAll();
    }
    if (query === '' || query === undefined) {

        return 0;
    }
    count = findAndRemoveOne(query);

    return count;
}

function findAndRemoveOne(query) {
    let count = 0;
    let length = phoneBook.length;
    for (let i = 0; i < length; i++) {
        let { phone, name, email } = phoneBook[i];
        if (findElement(phone, name, email, query)) {
            phoneBook.splice(i, 1);
            length = length - 1;
            count++;
            i--;
        }
    }

    return count;
}

function findAndRemoveAll() {
    let count = 0;
    let length = phoneBook.length;
    for (let i = 0; i < length; i++) {
        phoneBook.splice(i, 1);
        length = length - 1;
        count++;
        i--;
    }

    return count;
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
    let findElements = [];
    phoneBook.sort(sortAr);
    if (query === '*') {
        let str = findAll();

        return str;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        let x = process(i, query);
        if (x !== '') {
            findElements.push(x);
        }
    }

    return findElements;
}

function process(i, query) {
    let x = '';
    if (findElement(phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email, query)) {
        x = phoneBook[i].name + ', +7 (' + phoneBook[i].phone.substring(0, 3) + ') ' +
            phoneBook[i].phone.substring(3, 6) + '-' + phoneBook[i].phone.substring(6, 8) +
             '-' + phoneBook[i].phone.substring(8) + ', ' + phoneBook[i].email;
        if (phoneBook[i].email === undefined) {
            x = x.substring(0, x.length - 11);
        }
        if (phoneBook[i].email === '') {
            x = x.substring(0, x.length - 2);
        }

        return x;
    }

    return '';

}
function sortAr(a, b) {
    return a.name > b.name;
}

function findElement(ph, nm, em, query) {
    if (em === undefined) {
        em = '';
    }
    if (ph.indexOf(query) !== -1 || nm.indexOf(query) !== -1 || em.indexOf(query) !== -1) {
        return true;
    }

    return false;
}

function findAll() {
    let str = [];
    for (let i = 0; i < phoneBook.length; i++) {
        let strg = phoneBook[i].name + ', +7 (' + phoneBook[i].phone.substring(0, 3) + ') ' +
        phoneBook[i].phone.substring(3, 6) + '-' + phoneBook[i].phone.substring(6, 8) + '-' +
        phoneBook[i].phone.substring(8) + ', ' + phoneBook[i].email;
        if (phoneBook[i].email === undefined) {
            strg = strg.substring(0, strg.length - 11);
        }
        if (phoneBook[i].email === '') {
            strg = strg.substring(0, strg.length - 2);
        }
        str.push(strg);
    }

    return str;
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
