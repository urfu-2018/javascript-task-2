'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

function checkPhoneFormat(phone) {
    return /^\d{10}$/.test(phone);
}

function checkStrFormat(str) {
    return (typeof(str) !== 'string' || str.trim() === '');
}

function convertPhone(phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) +
    '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);
}

function isInclude(phone, name, email, query) {
    return (phone.includes(query) || name.includes(query) || email.includes(query));
}

function leadStr(phone, name, email) {
    return (checkStrFormat(email))
        ? name + ', ' + phone : name + ', ' + phone + ', ' + email;
}

function justAdd(phone, name, email) {
    if (checkStrFormat(email)) {
        phoneBook.set(phone, [name]);
    } else {
        phoneBook.set(phone, [name, email]);
    }
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkPhoneFormat(phone) || phoneBook.has(phone) || checkStrFormat(name)) {
        return false;
    }
    justAdd(phone, name, email);

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!checkPhoneFormat(phone) || !phoneBook.has(phone) || checkStrFormat(name)) {
        return false;
    }
    justAdd(phone, name, email);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (checkStrFormat(query)) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    let i = 0;
    for (let phone of phoneBook.keys()) {
        let name = phoneBook.get(phone)[0];
        let email = (phoneBook.get(phone)[1])
            ? phoneBook.get(phone)[1] : '';
        if (isInclude(phone, name, email, query)) {
            phoneBook.delete(phone);
            i++;
        }
    }

    return i;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let array = [];
    if (checkStrFormat(query)) {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    for (let phone of phoneBook.keys()) {
        let name = phoneBook.get(phone)[0];
        let email = (phoneBook.get(phone)[1])
            ? phoneBook.get(phone)[1] : '';
        if (isInclude(phone, name, email, query)) {
            array.push(leadStr(convertPhone(phone), name, email));
        }
    }

    return array.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    if (checkStrFormat(csv)) {
        return 0;
    }
    let arr = csv.split('\n');
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        let strArr = arr[i].split(';');
        let name = strArr[0];
        let phone = strArr[1];
        let email = strArr[2];
        if (update(phone, name, email) || add(phone, name, email)) {
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
