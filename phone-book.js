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

function checkNameFormat(name) {
    return (!(name === undefined || name === ''));
}

function convertPhone(phone) {
    phone = '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) +
    '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);

    return phone;
}

function isInclude(t1, t2, t3, query) {
    return (t1.includes(query) || t2.includes(query) || t3.includes(query));
}

function leadStr(phone, name, email) {
    return (email === '') ? name + ', ' + phone : name + ', ' + phone + ', ' + email;
}

function checkQuery(query) {
    return (query === '' || query === undefined);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkPhoneFormat(phone) || phoneBook.has(phone) || !checkNameFormat(name)) {
        return false;
    }
    email = (email === undefined) ? '' : email;
    phoneBook.set(phone, [name, email]);

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
    if (!phoneBook.has(phone) || !checkNameFormat(name)) {
        return false;
    }
    email = (email === undefined) ? '' : email;
    phoneBook.set(phone, [name, email]);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (checkQuery(query)) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    let i = 0;
    for (var phone of phoneBook.keys()) {
        let name = phoneBook.get(phone)[0].toString();
        let email = phoneBook.get(phone)[1].toString();
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
    let i = 0;
    if (checkQuery(query)) {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    for (var phone of phoneBook.keys()) {
        let name = phoneBook.get(phone)[0].toString();
        let email = phoneBook.get(phone)[1].toString();
        phone = convertPhone(phone);
        if (isInclude(phone, name, email, query)) {
            array[i] = leadStr(phone, name, email);
            i++;
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
    var arr = csv.split('\n');
    var count = 0;
    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        let name = str.substring(0, str.indexOf(';'));
        let phone = str.substring(str.indexOf(';') + 1, str.lastIndexOf(';'));
        let email = str.substring(str.lastIndexOf(';') + 1);
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
