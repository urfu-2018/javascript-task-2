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
    if (!/^[0-9]{10}$/.test(phone)) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    if (typeof name === 'undefined') {
        return false;
    }
    let notation = { phone: phone, name: name, email: email };
    phoneBook.push(notation);

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
    if (phoneBook.length === 0) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (tryUpdateNote(phone, name, email, i)) {
            return true;
        }
    }

    return false;
}

function tryUpdateNote(phone, name, email, index) {
    if (phoneBook[index].phone === phone) {
        if (typeof name !== 'undefined') {
            phoneBook[index].name = name;
        }
        phoneBook[index].email = email;

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
    for (let i = phoneBook.length - 1; i >= 0; i--) {
        if (isMatchFound(query, i)) {
            phoneBook.pop();
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let notes = [];
    for (let i = 0; i < phoneBook.length; i++) {
        if (isMatchFound(query, i)) {
            notes.push(getNote(i));
        }
    }

    return notes.sort();
}

function getNote(index) {
    let note;
    if (typeof phoneBook[index].name !== 'undefined') {
        note = `${phoneBook[index].name}, ${getCorrectPhoneFormat(phoneBook[index].phone)}`; }
    else {
        note = `${getCorrectPhoneFormat(phoneBook[index].phone)}`;
    }
    if (typeof phoneBook[index].email !== 'undefined') {
        note += `, ${phoneBook[index].email}`;
    }

    return note;
}

function getCorrectPhoneFormat(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-` +
        `${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
}

function isMatchFound(query, index) {
    if (query === '*') {
        return true;
    }

    return (phoneBook[index].name.indexOf(query) >= 0 ||
        (typeof phoneBook[index].email !== 'undefined' &&
            phoneBook[index].email.indexOf(query) >= 0) ||
        phoneBook[index].phone.indexOf(query) >= 0);
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
    let count = 0;
    csv = csv.split('\n');
    for (let i = 0; i < csv.length; i++) {
        let note = csv[i].split(';');
        if (/^[0-9]{10}$/.test(note[1])) {
            add(note[0], note[1], note[2]);
            count++;
        }
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
