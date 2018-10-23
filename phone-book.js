'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    function checkArgs(phone, name, email) {
        if (email !== undefined && typeof(email) !== 'string' ||
            [phone, name].some(e=>typeof(e) !== 'string')) {
            throw new TypeError('');
    }

    if (name === undefined) {
        return false;
    }
    checkArgs(phone, name, email);
    if (!(/[0-9]{10}/.test(phone))) {
        return false;
    } else if (phoneBook === undefined) {
        phoneBook = {};
    } else if (phoneBook[phone]) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

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
    function checkArgs(phone, name, email) {
        if (email !== undefined && typeof(email) !== 'string' ||
            [phone, name].some(e=>typeof(e) !== 'string')) {
            throw new TypeError('');
    }

    if (name === undefined) {
        return false;
    }
    checkArgs(phone, name, email);
    if (phoneBook === undefined) {
        phoneBook = {};
    } else if (!(/[0-9]{10}/.test(phone)) || phoneBook[phone] === undefined) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let allRecords;
    if (typeof(query) !== 'string') {
        throw new TypeError('');
    }
    let searchStr = /.?/;
    if (query !== '*') {
        searchStr = new RegExp(query);
    }
    allRecords = Object.keys(phoneBook)
        .filter((record)=>[record].concat(Object.values(phoneBook[record]))
            .some((rec)=>searchStr.test(rec)));
    allRecords
        .forEach((item)=>delete(phoneBook[item]));

    return allRecords.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let formatPhone = (phone)=>
        `+7 (${phone
            .slice(0, 3)}) ${phone
            .slice(3, 6)}-${phone
            .slice(6, 8)}-${phone
            .slice(8, 10)}`;
    let allRecords;
    if (typeof(query) !== 'string') {
        throw new TypeError('');
    }
    let searchStr = /.?/;
    if (query !== '*') {
        searchStr = new RegExp(query);
    }
    allRecords = Object.keys(phoneBook)
        .filter((record)=>[record].concat(Object.values(phoneBook[record]))
            .some((rec)=>searchStr.test(rec)));

    return allRecords
        .sort((a, b)=>phoneBook[a].name > phoneBook[b].name)
        .map((record)=>[phoneBook[record].name, formatPhone(record), phoneBook[record].email]
            .reduce((a, b)=>b === undefined ? `${a}` : `${a} ${b}`));
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
    isStar};
    
    
