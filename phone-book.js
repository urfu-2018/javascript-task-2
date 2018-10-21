'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

function phoneIsCorrect(phone) {
    return /^[0-9]{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = '', email = '') {
    if (phoneIsCorrect(phone) && phoneBook[phone] === undefined && name.length !== 0) {
        phoneBook[phone] = { 'name': name, 'email': email };

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name = '', email = '') {
    if (phoneBook[phone] !== undefined && name.length !== 0) {
        phoneBook[phone] = { 'name': name, 'email': email };

        return true;
    }

    return false;
}

function reformatPhone(formattedPhone) {
    return `${formattedPhone.slice(4, 7)}${formattedPhone.slice(9, 12)}` +
        `${formattedPhone.slice(13, 15)}${formattedPhone.slice(16, 18)}`;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const stringsToRemove = find(query);
    if (stringsToRemove.length !== 0) {
        for (let i = 0; i < stringsToRemove.length; i++) {
            const firstChar = stringsToRemove[i].indexOf('+');
            delete phoneBook[reformatPhone(stringsToRemove[i].slice(firstChar, firstChar + 18))];
        }
    }

    return stringsToRemove.length;
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(-2)}`;
}

function checkSpecialSymbols(query) {
    if (query === '') {
        return '/^[0-9a-z_]+$/i;';
    } else if (query === '*') {
        return '';
    }

    return query;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const keys = Object.keys(phoneBook);
    let result = [];
    query = checkSpecialSymbols(query);
    let re = new RegExp(query);
    for (let i = 0; i < keys.length; i++) {
        if (re.test(
            keys[i]) || re.test(phoneBook[keys[i]].name) || re.test(phoneBook[keys[i]].email
        )) {
            result.push(
                `${phoneBook[keys[i]].name}, ${formatPhone(keys[i])}` +
                `${phoneBook[keys[i]].email ? ', ' + phoneBook[keys[i]].email : ''}`
            );
        }
    }

    return result.sort();
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
    const records = csv.split('\n');
    let validRecords = 0;
    for (let i = 0; i < records.length; i++) {
        const [name, phone, email] = records[i].split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            validRecords ++;
        }
    }

    return validRecords;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
