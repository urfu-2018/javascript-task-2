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

function isCorrectPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isCorrectName(name) {
    return typeof name === 'string' && name;
}

function isCorrectQuery(query) {
    return typeof(query) === 'string' && query;
}

function isCorrectPhoneAndName(phone, name) {
    return isCorrectPhone(phone) && isCorrectName(name);
}

function checkQueryContains(field, query) {
    return query === '*' || field !== undefined && field.includes(query);
}

function checkContains(phoneNote) {
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
    if (!isCorrectPhoneAndName(phone, name)) {
        return false;
    }
    const phoneNote = { mPhone: phone, mName: name, mEmail: email };

    if (checkContains(phoneNote)) {
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
    if (!isCorrectPhoneAndName(phone, name)) {
        return false;
    }
    let newPhoneNote = { mPhone: phone, mName: name, mEmail: email };

    if (!checkContains(newPhoneNote)) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].mPhone) {
            phoneBook[i] = newPhoneNote;

            return true;
        }
    }
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isCorrectQuery(query)) {
        return [];
    }
    let finded = find(query).reverse();
    for (let i = 0; i < finded.length; i++) {
        let splited = finded[i].split(', ');
        let phoneNote = { mPhone: splited[0], mName: splited[1], mEmail: splited[2] };

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
    if (email !== undefined) {
        result = [name, phone, email].join(', ');
    } else {
        result = [name, phone].join(', ');
    }

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = [];
    if (!isCorrectQuery(query)) {
        return [];
    }
    for (let i = 0; i < phoneBook.length; i++) {
        let newPhone = concatPhone(phoneBook[i].mPhone);
        if ([phoneBook[i].mPhone, phoneBook[i].mName, phoneBook[i].mEmail]
            .some(field => checkQueryContains(field, query))) {
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
