'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга {
 *      phoneNumber1 : {"name" : ... , "email": ...},
 *      phoneNumber2 : {"name" : ... , "email": ...},
 *  }
 */
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!/\d{10}/.test(phone)) {
        return false;
    }

    if (name === undefined) {
        return false;
    }

    if (!(phone in phoneBook)) {
        phoneBook[phone] = {'name': name, 'email': email};

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
    if (!/\d{10}/.test(phone)) {
        return false;
    }

    if (phone in phoneBook) {
        if (name !== undefined) {
            phoneBook[phone].name = name;
        }

        phoneBook[phone].email = email;

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

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {
        return '';
    }

    if (query === '*') {
        const result = [];
        for (const phone in phoneBook) {
            result.push(phoneBook[phone].name
            + ', +7 (' + phone.slice(0, 3) + ') '
            + phone.slice(3,6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10)
            + (phoneBook[phone].email ? ', ' + phoneBook[phone].email : '')); // todo: переписать красиво, взм вынести в функцию
        }
        return result.sort();
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
