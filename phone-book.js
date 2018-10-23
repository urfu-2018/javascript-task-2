'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

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
    if (!isNameCorrect(name) || !isPhoneCorrect(phone) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { phone, name, email });

    return true;
}

function isNameCorrect(name) {
    return isString(name) && name.length !== 0;
}

function isPhoneCorrect(phone) {
    if (!isString(phone)) {
        return false;
    }
    let correctPhone = /^\d{10}$/;

    return correctPhone.test(phone);
}

function isString(input) {
    return typeof input === 'string';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isNameCorrect(name) || !isPhoneCorrect(phone) || !phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { phone, name, email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let removedNotes = getNotesFromPhoneBookByQuery(query);
    for (let i = 0; i < removedNotes.length; i++) {
        phoneBook.delete(removedNotes.phone);
    }

    return removedNotes.length;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || query.length === 0) {
        return [];
    }
    let result = getNotesFromPhoneBookByQuery(query);

    return result
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(getFormatedNote);
}

function getNotesFromPhoneBookByQuery(query) {
    if (query === '*') {
        return Array.from(phoneBook.values());
    }

    return Array.from(phoneBook.values()).filter(note => noteHasQuery(note, query));
}

function noteHasQuery(note, query) {
    return note.phone.includes(query) || note.name.includes(query) ||
        note.email !== undefined && note.email.includes(query);
}

function getFormatedNote(note) {
    let result = `${note.name}, +7 (${note.phone.slice(0, 3)}) `;
    result += `${note.phone.slice(3, 6)}-${note.phone.slice(6, 8)}-${note.phone.slice(8, 10)}`;
    if (note.email !== undefined) {
        result += `, ${note.email}`;
    }

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!isString(csv)) {
        return 0;
    }

    return csv
        .split('\n')
        .map(line => line.split(';'))
        .filter(note => add(note[1], note[0], note[2]) || update(note[1], note[0], note[2]))
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
