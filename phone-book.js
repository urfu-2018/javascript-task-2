'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Названия методов - глаголы
 * Проверки теперь состоят из 1 строки
 */
function validateName(name) {
    return typeof name === 'string' && name.length;
}

function verifyNumber(phone) {
    return typeof phone === 'string' && /^555\d{7}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!verifyNumber(phone) || !validateName(name) ||
        phoneBook[parseInt(phone)]) {
        return false;
    }
    if (arguments.length < 3) {
        email = '';
    }
    phone = parseInt(phone);
    phoneBook[phone] = [name, email];

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
    if (!validateName(name) || !verifyNumber(phone) ||
        !phoneBook[parseInt(phone)]) {
        return false;
    }
    if (arguments.length === 2) {
        email = '';
    }
    phone = parseInt(phone);
    phoneBook[phone] = [name, email];

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let deleted = find(query);
    for (let d of deleted) {
        let array = d.split(', ');
        let key = array[1].substring(4, 7) +
            array[1].substring(9, 12) +
            array[1].substring(13, 15) +
            array[1].substring(16, 19);
        delete phoneBook[key];
    }

    return deleted.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return formatPhoneBook(phoneBook);
    }
    let map = searchByQuery(query);

    return formatPhoneBook(map);
}

function searchByQuery(query) {
    const array = [];
    for (let key of Object.keys(phoneBook)) {
        if (phoneBook[key][1].indexOf(query) !== -1 ||
            phoneBook[key][0].indexOf(query) !== -1 ||
            key.indexOf(query) !== -1) {
            array[key] = [phoneBook[key][0], phoneBook[key][1]];
        }
    }

    return array;
}

function formatPhoneBook(Book) {
    const array = [];
    for (let key of Object.keys(Book)) {
        let str = Book[key][0] + ', ' +
            '+7 (' + key.substring(0, 3) + ') ' +
            key.substring(3, 6) + '-' + key.substring(6, 8) + '-' + key.substring(8, 10);
        if (Book[key][1].length !== 0) {
            str = str + ', ' + Book[key][1];
        }
        array.push(str);
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
