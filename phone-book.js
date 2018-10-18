'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

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
    if (typeof phone !== 'string' || typeof name !== 'string') {
        console.log('FALSE1');
        return false;
    }
    if (/^[0-9]{10}$/.test(phone) && name) {
        phoneBook.push(`${phone}, ${name}${email ? `, ${email}` : ''}`)
        console.log(`${phone}, ${name}${email ? `, ${email}` : ''}`)
        return true;
    }
    console.log('FALSE2');
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
    if (typeof phone !== 'string' || typeof name !== 'string') {
        console.log('FALSE1');
        return false;
    }
    if (/^[0-9]{10}$/.test(phone) && name) {
        phoneBook.push(`${phone}, ${name}${email ? `, ${email}` : ''}`)
        console.log(`${phone}, ${name}${email ? `, ${email}` : ''}`)
        return true;
    }
    console.log('FALSE2');
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
    if (typeof query !== 'string') {
        throw new TypeError();
    }
    return query === '*' ? phoneBook :
    phoneBook.filter(x => -1 < x.indexOf(query));
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
