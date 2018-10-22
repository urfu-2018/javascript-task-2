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
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
    }

    return false;
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
    phoneBook.filter(note => note.phone === phone);
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
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

    return getNotesSortedByName(result).map(getFormatedNote);
}

function getNotesFromPhoneBookByQuery(query) {
    if (query === '*') {
        return phoneBook;
    }

    return phoneBook.filter(note => noteHasQuery(note, query));
}

function noteHasQuery(note, query) {
    return note.phone.includes(query) || note.name.includes(query) ||
        note.email !== undefined && note.email.includes(query);
}

function getNotesSortedByName(notes) {
    return notes.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
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
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    let inputNotes = csv.split('\n').map(line => line.split(';'));
    let addedOrUpdatedNotesCount = 0;
    for (let i = 0; i < inputNotes.length; i++) {
        let phone = inputNotes[i][1];
        let name = inputNotes[i][0];
        let email = inputNotes[i][2];
        if (add(phone, name, email) || update(phone, name, email)) {
            addedOrUpdatedNotesCount++;
        }
    }

    return addedOrUpdatedNotesCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
