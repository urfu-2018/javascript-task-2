'use strict';

/**
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
function isCorrectPhone(phone) {
    if (phone !== undefined && typeof(phone) === 'string' && phone.length === 10) {
        return true;
    }

    return false;
}

function isCorrectName(name) {
    if (name !== undefined && typeof(name) === 'string') {
        return true;
    }

    return false;
}

function recordExists(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
    }

    return false;
}

function isAllArgumentsCorrect(phone, name) {
    return isCorrectPhone(phone) && isCorrectName(name);
}

function add(phone, name, email) {
    if (isAllArgumentsCorrect(phone, name) && !recordExists(phone)) {
        phoneBook.push({
            name: name,
            email: email
        });

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
    if (isAllArgumentsCorrect(phone, name) && recordExists(phone)) {
        for (let i = 0; i < phoneBook.length; i++) { if (phoneBook[i].phone === phone) {
            phoneBook[i] = {
                phone: phone,
                name: name,
                email: email
            };
            
            return true;
        }
    }
}

return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    phoneBook.forEach(element => {
        if (element.indexOf(query) !== -1) {
            phoneBook.splice(phoneBook.indexOf(element), 1);
            count++;
        }
    });

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let notes = [];
    if (query === '*') {
        return phoneBook;
    }
    if (arguments.length === 0) {
        return;
    }
    if (arguments.length !== 0) {
        phoneBook.forEach(element => {
            if (element.indexOf(query) !== -1) {
                notes.push(element);
            }
        });
        notes.sort();

        return notes;
    }
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
