'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;
const tuple = (...args) => Object.freeze(args);

function createRecord(name, phone, email) {
    if (validatePhone(phone) && validateName(name) && validateEmail(email)) {
        return tuple(name, phone, email);
    }

    function validatePhone(phone) {
        return /\d{10}/.test(phone);
    }

    function validateName(name) {
        return typeof name === 'string' || name !== '';
    }

    function validateEmail(email) {
        return true;
    }
}

function recordsAreEqual(first, second) {
    if (!Array.isArray(first) || !Array.isArray(second) || 
    first.length !== second.length || first.length !== 3) {
        return TypeError();
    }

    return first[0] === second[0] && first[1] === second[1] && first[2] === second[2];
}



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
    const newRecord = createRecord(name, phone, email);
    const record = phoneBook[phone];
    if (newRecord === undefined || record !== undefined) {
        return false;
    }
    phoneBook[phone] = newRecord;
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
    // email может быть undefined.
    const record = phoneBook[phone];
    const newRecord = createRecord(name, phone, email);
    if (record === undefined || newRecord === undefined) {
        return false;
    }
    phoneBook[phone] = newRecord;
    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query.length === 0) {
        return;
    }
    var result = [];

    Object.keys(map).forEach(function(key) {
        var record = phoneBook[key];
        if ()
        console.log(value);
    });


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
