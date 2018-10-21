'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = Map();

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
    if (phoneBook.has(phone)) {
        return false;
    }

    // Составить новую запись
    const phoneBookEntry = {
        name
    };
    if (email !== undefined) {
        phoneBookEntry.email = email;
    }

    // Добавить запись в телефонную книгу
    phoneBook.set(phone, phoneBookEntry);

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

    // Извлечь запись из телефонной книги
    let entry = phoneBook.get(phone);

    // Если записи не существует, обновлять нечего
    if (entry === undefined) {
        return false;
    }

    // Если имя не указано, обновления не происходит - имя удалить нельзя
    if (name === undefined) {
        return false;
    }

    // Обновить данные записи
    entry.name = name;
    if ('email' in entry) {
        if (email === undefined) {
            delete entry.email;
        }
        else {
            entry.email = email;
        }
    }

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
