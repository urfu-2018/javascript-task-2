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

function checkValid(phone, name) {
    let number = phone.replace(/[^0-9]+/, '');
    if (number === phone && number.length === 10 && name !== '' && name !== undefined) {

        return true;
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
    if (checkValid(phone, name) && !(phone in phoneBook)) {
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
    if (checkValid(phone, name) && (phone in phoneBook)) {
        phoneBook[phone][0] = [name];
        phoneBook[phone][1] = [email];

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
    let count = 0;
    if (query === '') {

        return count;
    }
    Object.keys(phoneBook).map(
        function (objectKey) {
            let p = objectKey.indexOf(query);
            let n = phoneBook[objectKey][0].indexOf(query);
            let e = phoneBook[objectKey][1].indexOf(query);
            if (p === -1 || n === -1 || e === -1 || query === '*') {
                delete phoneBook.objectKey;
            }

            return false;
        }
    );
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {

        return false;
    }
    let listQuery = [];
    Object.keys(phoneBook).map(
        function (objectKey) {
            let k = objectKey;
            let p = '+7 (' + k.slice(0, 3) + ') ';
            p += k.slice(3, 6) + '-' + k.slice(6, 8) + '-' + k.slice(8);
            let n = phoneBook[objectKey][0];
            let e = phoneBook[objectKey][1];
            let emailTrue = (e !== undefined) ? ', ' + e : '';
            let item = n + ', ' + p + emailTrue;
            if (item.indexOf(query) !== -1 || query === '*') {
                listQuery.push(item);
            }

            return false;
        }
    );

    return listQuery.sort();
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
