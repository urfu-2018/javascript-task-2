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
// exports.phoneBook = phoneBook;

function test(phone, name) {
    if (name !== '' && name !== undefined && typeof(name) === 'string') {
        if (phone !== undefined && /^\d{10}$/.test(phone)) {
            return true;
        }
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (test(phone, name) && !(phone in phoneBook)) {
        phoneBook[phone] = (email === undefined) ? [phone, name] : [phone, name, email];

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
    if (test(phone, name) && phone in phoneBook) {
        phoneBook[phone] = (email === undefined) ? [phone, name] : [phone, name, email];

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
    let countDelete = 0;
    if (typeof(query) !== 'string' || query.length === 0) {
        return 0;
    }
    for (let phone of Object.keys(phoneBook)) {
        let value = search(phoneBook[phone], query);
        if (value !== undefined) {
            delete phoneBook[phone];
            countDelete++;
        }
    }

    return countDelete;

}


function search(dictionary, query) {
    if (query === '*') {
        return dictionary;
    }
    for (let element in dictionary) {
        if (dictionary[element].includes(query)) {

            return dictionary;
        }
    }
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

function sorts(intermediateList) {
    let finalStrings = [];
    for (let entry of intermediateList) {
        if (entry[2] !== undefined) {
            finalStrings.push(entry[1] + ', ' + formatPhone(entry[0]) + ', ' + entry[2]);
        } else {
            finalStrings.push(entry[1] + ', ' + formatPhone(entry[0]));
        }
    }

    return finalStrings.sort();
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof(query) !== 'string' || query.length === 0) {

        return [];
    }
    var value;
    let intermediateList = [];
    for (let phone of Object.keys(phoneBook)) {
        value = search(phoneBook[phone], query);
        intermediateList.push(value);
    }
    let finalList = sorts(intermediateList);

    return finalList;
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
    let data = csv.split('\n');
    let countCsv = 0;
    for (let value of data) {
        let contact = value.split(';');
        if (add(contact[1], contact[0], contact[2]) || update(contact[1], contact[0], contact[2])) {
            countCsv++;
        }
    }

    return countCsv;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
