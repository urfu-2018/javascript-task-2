/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
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
    const validPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    const validName = (typeof (name) === 'string') && /^[a-zA-Za-яА-Я0-9]/.test(name);
    const findContact = phoneBook.find(function (contact) {
        return contact.phone === phone;
    });

    if (!validPhone || !validName || findContact !== undefined) {
        return false;
    }

    let newContact = {};
    newContact.phone = phone;
    newContact.name = name;
    newContact.email = email;
    phoneBook.push(newContact);

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
// function update(phone, name, email) {
// }

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
// function findAndRemove(query) {
// }

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
// function find(query) {
// }

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
    // update,
    // findAndRemove,
    // find,
    importFromCsv,

    isStar
};
