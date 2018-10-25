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

function isString(value) {
    return typeof(value) === 'string';
}

function isCorrectPhone(value) {
    return isString(value) && /^\d{10}$/.test(value);
}

function isCorrectName(value) {
    return isString(value) && value !== '';
}

function checkInput(phone, name) {
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
function add(phone, name, email) {
    if (checkInput(phone, name) &&
        typeof(phoneBook[phone]) === 'undefined') {
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
function update(phone, name, email) {
    if (checkInput(phone, name) &&
        typeof(phoneBook[phone]) !== 'undefined') {
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
    let dataToDelete = find(query);
    for (let data of dataToDelete) {
        // приведём номер к простому виду и избавимся в начале строки от 7
        let phone = data.split(', ')[1].replace(/[- +()]/g, '').slice(1);
        delete phoneBook[phone];
    }

    return dataToDelete.length;
}

function everythingFrom(array) {
    let result = [];
    for (let key of Object.keys(array)) {
        let element = `${array[key][0]}, +7 (${key.slice(0, 3)}) ` +
        `${key.slice(3, 6)}-${key.slice(6, 8)}-${key.slice(8, 10)}`;
        if (array[key][1] !== undefined) {
            element = `${element}, ${array[key][1]}`;
        }
        result.push(element);
    }
    result.sort();

    return result;
}

function getAllBy(element) {
    let result = [];
    for (let key of Object.keys(phoneBook)) {
        if (phoneBook[key][0].search(element) !== -1 || key.search(element) !== -1 ||
        (phoneBook[key][1] !== undefined && phoneBook[key][1].search(element) !== -1)) {
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
        return [];
    }
    if (query === '*') {
        return everythingFrom(phoneBook);
    }

    return everythingFrom(getAllBy(query));
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
    let kills = 0;
    for (let contact of contacts) {
        contact = contact.split(';');
        let data = {
            name: contact[0],
            phone: contact[1],
            email: contact[2]
        };
        kills = update(data.phone, data.name, data.email) ||
        add(data.phone, data.name, data.email) ? kills + 1 : kills;
    }

    return kills;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
