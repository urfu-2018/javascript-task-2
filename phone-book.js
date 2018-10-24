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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (email === undefined) {
        email = '';
    }

    if (!dataIsCorrect(phone, name, email) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { 'name': name, 'email': email });

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
    if (email === undefined) {
        email = '';
    }

    if (!dataIsCorrect(phone, name, email)) {
        return false;
    }
    phoneBook.set(phone, { 'name': name, 'email': email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const deletedMap = find(query);

    deletedMap.forEach(key => {
        phoneBook.delete(key);
    });

    return deletedMap.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === undefined || query === '') {
        return null;
    }
    if (query === '*') {
        return correctOutput(new Map(phoneBook));
    }

    const foundUser = new Map();
    phoneBook.forEach((value, key) => {
        if (key.indexOf(query) !== -1 || value.name.indexOf(query) !== -1 ||
                value.email.indexOf(query) !== -1) {
            foundUser.set(key, value);
        }
    });

    return correctOutput(foundUser);
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
    if (typeof csv !== 'string' || csv.length === 0) {
        return 0;
    }

    const records = csv.split('\n').map(record => record.split(';'));
    let importRecord = 0;

    records.forEach(record => {
        let [name, phone, email] = record;
        email = email || '';
        email = email.trim();

        if (add(phone, name, email) || update(phone, name, email)) {
            importRecord++;
        }
    });

    return importRecord;
}

function dataIsCorrect(phone, name, email) {
    const regexp = /^[0-9]{10}$/;

    if (typeof phone !== 'string' || typeof name !== 'string' || typeof email !== 'string') {
        return false;
    }
    if (!name) {
        return false;
    }

    return regexp.test(phone);
}

function correctOutput(record) {
    const resultOutput = [];

    record.forEach((value, key) => {
        const phone = correctPhone(key);
        let correct = value.name + ', ' + phone;

        if (value.email !== '') {
            correct += `, ${value.email}`;
        }

        resultOutput.push(correct);
    });

    return resultOutput.sort();
}

function correctPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
