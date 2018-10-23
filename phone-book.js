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

function checkFallPhone(phone) {
    return phone === undefined || !/^\d\d\d\d\d\d\d\d\d\d$/.test(phone);
}

function checkFallEmail(email) {
    return email !== undefined && !/\w+@\w+\.\w+/.test(email);
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
    if (checkFallPhone(phone) || name === undefined || checkFallEmail(email)){ return false;}
    const phoneNote = {mPhone:phone, mName:name, mEmail:email};
    if (checkContain(phoneNote)) {return false;}

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
    if (checkFallPhone(phone) || name === undefined || checkFallEmail(email)) { return false;}
    if (!checkContain({mPhone:phone, mName:name, mEmail:email})) {return false;}
    for (let i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].mPhone) {
            phoneBook[i].mName = name;
            phoneBook[i].mEmail = email;
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
    if (typeof(query) !== 'string') {return;}
    let finded = find(query);
    for (let i = 0; i < finded.length; i++) {
        const splited = finded[i].split(', ');
        const phoneNote
        if (splited.length === 2) {
            phoneNote = {mPhone:splited[0], mName:splited[1], mEmail: undefined};
        }
        else {
            phoneNote = {mPhone:splited[0], mName:splited[1], mEmail: splited[2]};
        }
        phoneBook.splice(phoneBook.indexOf(phoneNote), 1);
    }
    return finded.length;
}

function concatPhone(phone) {
    return '+7 ('.concat(phone.slice(0, 3))
    .concat(') ').concat(phone.slice(3, 6))
    .concat('-').concat(phone.slice(6, 8))
    .concat('-').concat(phone.slice(8, 10)); 
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = [];
    if (typeof(query) !== 'string') {return;}
    if (query.length === 0) {return;}
    if (query === '*') {
        for (let i = 0; i < phoneBook.length; i++) {
            let newPhone = concatPhone(phoneBook[i].mPhone);
                result.push('' + phoneBook[i].mName + ', ' + newPhone + ', ' + phoneBook[i].mEmail)
        }
    }
    for (let i = 0; i < phoneBook.length; i++) {
        let newPhone = concatPhone(phoneBook[i].mPhone);
        if (phoneBook[i].mPhone.indexOf(query) !== -1 || phoneBook[i].mName.indexOf(query) !== -1 || phoneBook[i].mEmail !== undefined && phoneBook[i].mEmail.indexOf(query) !== -1) {
            result.push('' + phoneBook[i].mName + ', ' + newPhone + ', ' + phoneBook[i].mEmail)
        }
    }
    return result.sort(function (a, b) {
        if (a.mName > b.mName) {
          return 1;
        }
        if (a.mName < b.mName) {
          return -1;
        }
        return 0
    });
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
