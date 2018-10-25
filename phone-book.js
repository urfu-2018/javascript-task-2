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

/**
 * Проверка параметров
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function trueParam(phone, name, email) {
    var tel = /(^[0-9]{10}$)/;

    return (typeof phone === 'string') && (tel.test(phone)) && (name !== '') &&
        (name !== undefined) && (email === undefined || typeof email === 'string');
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (find(phone) || !trueParam(phone, name, email)) {
        return false;
    }
    phoneBook[phone] = { name: name, email: email };

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
    if (find(phone).length > 0 && (trueParam(phone, name, email))) {
        phoneBook[phone] = { name: name, email: email };

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
    var count = 0;
    for (var [key] of Object.entries(phoneBook)) {
        delete phoneBook[key];
        count++;
    }

    return count;
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
        query = '';
    }
    const result = [];
    var res = '';
    for (var [key, value] of Object.entries(phoneBook)) {
        var newPhone = newNumber(key);
        res = value.name + ',' + newPhone;
        if (value.email !== undefined) {
            res += ',' + value.email;
        }
    }
    result.push(res);

    return result.sort();
}

function newNumber(phone) {

    return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
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
    if (csv === undefined || typeof (csv) !== 'string' || csv === '') {
        return 0;
    }
    const newCsv = csv.split('\n');
    var count = 0;
    var text = newCsv.split(';');
    var name = text[0];
    var phone = text[1];
    var email = text[2];
    if (add(phone, name, email) || update(phone, name, email)) {
        count++;
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
