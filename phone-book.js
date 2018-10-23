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

function checkFallPhoneAndName(phone, name) {
    return phone === undefined || !/^\d\d\d\d\d\d\d\d\d\d$/.test(phone) || name === undefined;
}

function checkContain(phoneNote) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneNote.mPhone === phoneBook[i].mPhone) {
            return true;
        }
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
    if (checkFallPhoneAndName(phone, name)) {
        return false;
    }
    let phoneNote;
    if (email !== undefined) {
        phoneNote = { mPhone: phone, mName: name, mEmail: email };
    } else {
        phoneNote = { mPhone: phone, mName: name, mEmail: '' };
    }
    if (checkContain(phoneNote)) {
        return false;
    }

    return Boolean(phoneBook.push(phoneNote));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function update(phone, name, email) {
    if (checkFallPhoneAndName(phone, name)) {
        return false;
    }
    let newPhoneNote;
    if (email !== undefined) {
        newPhoneNote = { mPhone: phone, mName: name, mEmail: email };
    } else {
        newPhoneNote = { mPhone: phone, mName: name, mEmail: '' };
    }
    if (!checkContain(newPhoneNote)) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].mPhone) {
            phoneBook[i].mName = newPhoneNote.mName;
            phoneBook[i].mEmail = newPhoneNote.mEmail;

            return true;
        }
    }
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
/*
* На вход принимает запрос в виде строки
* Находит (смотри __find__) и удаляет все найденные записи
* Возвращает число удаленных записей
*/
function findAndRemove(query) {
    if (typeof(query) !== 'string') {
        return;
    }
    let finded = find(query);
    for (let i = 0; i < finded.length; i++) {
        let splited = finded[i].split(', ');
        let phoneNote;
        if (splited.length === 2) {
            phoneNote = { mPhone: splited[0], mName: splited[1], mEmail: '' };
        } else {
            phoneNote = { mPhone: splited[0], mName: splited[1], mEmail: splited[2] };
        }
        phoneBook.splice(phoneBook.indexOf(phoneNote), 1);
    }

    return finded.length;
}

function concatPhone(phone) {
    return '+7 ('
        .concat(phone.slice(0, 3))
        .concat(') ')
        .concat(phone.slice(3, 6))
        .concat('-')
        .concat(phone.slice(6, 8))
        .concat('-')
        .concat(phone.slice(8, 10));
}

function concatNote(phone, name, email) {
    let result;
    if (email !== '') {
        result = ''
            .concat(name)
            .concat(', ')
            .concat(phone)
            .concat(', ')
            .concat(email);
    } else {
        result = ''
            .concat(name)
            .concat(', ')
            .concat(phone);
    }

    return result;
}

function isFinded(query, note) {
    return note.mPhone.indexOf(query) !== -1 ||
    note.mName.indexOf(query) !== -1 ||
    note.mEmail !== undefined && note.mEmail.indexOf(query) !== -1;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = [];
    if (typeof(query) !== 'string') {
        return;
    }
    if (query === '*') {
        for (let i = 0; i < phoneBook.length; i++) {
            let newPhone = concatPhone(phoneBook[i].mPhone);
            result.push(concatNote(newPhone, phoneBook[i].mName, phoneBook[i].mEmail));
        }
    }
    for (let i = 0; i < phoneBook.length; i++) {
        let newPhone = concatPhone(phoneBook[i].mPhone);
        if (isFinded(query, phoneBook[i])) {
            result.push(concatNote(newPhone, phoneBook[i].mName, phoneBook[i].mEmail));
        }
    }

    return result.sort();
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
