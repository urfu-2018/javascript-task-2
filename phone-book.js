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
    if (!isNameCorrect(name) || !isPhoneCorrect(phone) || phoneBookHasPhone(phone)) {
        return false;
    }
    phoneBook.push({ phone: phone, name: name, email: email });

    return true;
}

function isNameCorrect(name) {
    return isString(name) && name.length !== 0;
}

function phoneBookHasPhone(phone) {
    return phoneBook.some(note => note.phone === phone);
}

function isPhoneCorrect(phone) {
    if (!isString(phone)) {
        return false;
    }
    let correctPhone = /^[0-9]{10}$/;

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
    if (!isNameCorrect(name) || !isPhoneCorrect(phone)) {
        return false;
    }
    let notesForUpdate = phoneBook.filter(note => note.phone === phone);
    notesForUpdate.forEach(note => {
        note.name = name;
        note.email = email;
    });

    return notesForUpdate.length !== 0;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let removedNotes = getNotesFromPhoneBookByQuery(query);
    for (let i = 0; i < removedNotes.length; i++) {
        phoneBook.splice(phoneBook.indexOf(removedNotes[i]), 1);
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
        return phoneBook.slice(0);
    }

    return phoneBook.filter(note => noteHasQuery(note, query));
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
