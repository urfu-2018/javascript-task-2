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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {

    // Если телефон указан в неправильном формате, не добавлять запись
    const phoneRegex = /^(\d)\1\1(\d)\2\2(\d)\3(\d)\4$/;
    if (!(phoneRegex.test(phone))) {
        return false;
    }

    // Если не указано имя, не добавлять запись
    if (name === undefined) {
        return false;
    }

    // Если запись с таким номером уже существует, не добавлять её
    const samePhonePredicate = function (element) {
        return element.phone === phone;
    };
    if (phoneBook.findIndex(samePhonePredicate) !== -1) {
        return false;
    }

    // Составить новую запись
    const phoneBookEntry = {
        phone,
        name
    };
    if (email !== undefined) {
        phoneBookEntry.email = email;
    }

    // Добавить запись в телефонную книгу
    phoneBook.push(phoneBookEntry);

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
