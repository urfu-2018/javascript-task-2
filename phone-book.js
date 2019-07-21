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
let phoneNotes = [];
let noteEmail = '';

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    let isNoteNew = true;
    phoneBook.forEach(function (note) {
        if (note.name === name || note.phone === phone) {
            isNoteNew = false;
        }
    });
    if (name !== undefined && isNoteNew && phone.length === 10 && !isNaN(phone)) {
        let newName = {};
        newName.name = name;
        newName.phone = phone;
        newName.email = email;
        phoneBook.push(newName);

        return (true);
    }

    return (false);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    let isUpdated = false;
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone && name !== undefined) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;
            isUpdated = true;
            
            return(isUpdated);
        }
    }

    return (isUpdated);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let deletedNotesCount = 0;
    for (let i = 0; i < phoneBook.length; i++) {
        if (isNoteFound(query, i)) {
            phoneNotes.splice(i, 1);
            deletedNotesCount++;
        }
    }

    return deletedNotesCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    phoneNotes = [];
    if (query.length === 0 || query === undefined) {

        return;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (isNoteFound(query, i)) {
            phoneNotes.push(phoneBook[i].name + ', +7 (' + phoneBook[i].phone.substr(0, 3) + ') ' +
                phoneBook[i].phone.substr(3, 3) + '-' + phoneBook[i].phone.substr(6, 2) + '-' +
                phoneBook[i].phone.substr(8, 2) + ', ' + noteEmail);
        }
    }

    return phoneNotes.sort();
}

function isNoteFound(query, i) {
    noteEmail = '';
    if (phoneBook[i].email === undefined) {
        noteEmail = '';
    } else {
        noteEmail = phoneBook[i].email;
    }
    if (phoneBook[i].name.indexOf(query) >= 0 || phoneBook[i].phone.indexOf(query) >= 0 ||
        noteEmail.indexOf(query) >= 0 || query === '*') {

        return true;
    }

    return false;
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
