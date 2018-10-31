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

function isString(value) {
    return typeof (value) === 'string';
}

function isCorrectPhone(value) {
    return isString(value) && /^\d{10}$/.test(value);
}

function isCorrectName(value) {
    return isString(value) && value !== '';
}

function isCorrectInput(phone, name) {
    return isCorrectPhone(phone) &&
        isCorrectName(name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (isCorrectInput(phone, name) &&
        !phoneBook[phone]) {
        phoneBook[phone] = [name, email];

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
function update(phone, name, email = '') {
    if (isCorrectInput(phone, name) &&
        phoneBook[phone]) {
        phoneBook[phone] = [name, email];

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '') {
        return 0;
    }
    const dataToDelete = find(query);
    for (const data of dataToDelete) {
        // приведём номер к простому виду и избавимся в начале строки от 7
        const phone = data.split(', ')[1].replace(/[- +()]/g, '').substring(1);
        delete phoneBook[phone];
    }

    return dataToDelete.length;
}

function getAllFrom(array) {
    let result = [];
    for (const key of Object.keys(array)) {
        let element = `${array[key][0]}, +7 (${key.substring(0, 3)}) ` +
            `${key.substring(3, 6)}-${key.substring(6, 8)}-${key.substring(8, 10)}`;
        if (array[key][1] !== '') {
            element = `${element}, ${array[key][1]}`;
        }
        result.push(element);
    }
    result.sort();

    return result;
}

function getAllBy(query) {
    let result = {};
    for (const key of Object.keys(phoneBook)) {
        if (phoneBook[key][0].includes(query) || key.includes(query) ||
            phoneBook[key][1].includes(query)) {
            result[key] = [phoneBook[key][0], phoneBook[key][1]];
        }
    }

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {
        return {};
    }
    if (query === '*') {
        return getAllFrom(phoneBook);
    }
    const allRecords = getAllBy(query);

    return getAllFrom(allRecords);
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
    const contacts = csv.split('\n');
    let passed = 0;
    for (const contact of contacts) {
        const [name, phone, email = ''] = contact.split(';');
        const data = {
            name: name,
            phone: phone,
            email: email
        };
        passed = update(data.phone, data.name, data.email) ||
            add(data.phone, data.name, data.email) ? passed + 1 : passed;
    }

    return passed;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
