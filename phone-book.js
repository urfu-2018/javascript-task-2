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
    if (isInvalidNote(phone, name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { phone: phone, name: name, email: email });

    return true;
}

function isInvalidNote(phone, name) {
    return !isStringLineCorrect(name) || !isPhoneCorrect(phone);
}

function isStringLineCorrect(name) {
    return typeof name === 'string' && name.length !== 0;
}

function isPhoneCorrect(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isInvalidNote(phone, name) || !phoneBook.has(phone)) {
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
    removedNotes.forEach(deleteNoteFromPhoneBook);

    return removedNotes.length;
}

function deleteNoteFromPhoneBook(note) {
    phoneBook.delete(note.phone);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = getNotesFromPhoneBookByQuery(query);

    return result
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(noteToString);
}

function getNotesFromPhoneBookByQuery(query) {
    if (!isStringLineCorrect(query)) {
        return [];
    }
    if (query === '*') {
        return Array.from(phoneBook.values());
    }

    return Array.from(phoneBook.values()).filter(note => hasNoteQuery(note, query));
}

function hasNoteQuery(note, query) {
    return note.phone.includes(query) || note.name.includes(query) ||
        note.email !== undefined && note.email !== null && note.email.includes(query);
}

function noteToString(note) {
    let townCode = `${note.phone.slice(0, 3)}`;
    let phone = `${note.phone.slice(3, 6)}-${note.phone.slice(6, 8)}-${note.phone.slice(8, 10)}`;
    const stringPhone = `+7 (${townCode}) ${phone}`;
    const result = [note.name, stringPhone];

    if (note.email) {
        result.push(note.email);
    }

    return result.join(', ');
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
