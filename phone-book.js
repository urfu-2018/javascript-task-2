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

function phoneIsValid(phone) {

    return phone && phone.length === 10 && !phone.match(/[^0-9]/gi) && !isNaN(Number(phone));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!phoneIsValid(phone) || !name || typeof name !== 'string') {
        return false;
    }

    let checkPhoned = phoneBook.some(function (record) {

        return record.phone === phone;
    });

    if (!checkPhoned) {
        phoneBook.push({ 'name': name, 'phone': phone, 'email': email });

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof name !== 'string' || !name) {
        return false;
    }
    let indexPhoned = -1;
    let findPhoned = phoneBook.some(function (record, index) {
        indexPhoned = index;

        return record.phone === phone;
    });
    if (findPhoned && name) {
        phoneBook[indexPhoned].name = name;
        phoneBook[indexPhoned].phone = phone;
        phoneBook[indexPhoned].email = email;

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
    if (query === '*') {
        var res1 = phoneBook.length;
        phoneBook = [];

        return res1;
    }
    if (query === '') {
        return 0;
    }
    var result = phoneBook.filter(function (record) {
        if (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1) {
            return true;
        }
        if (record.email) {
            return record.email.indexOf(query) !== -1;
        }

        return false;
    });
    for (var i = 0; i < result.length; i++) {
        phoneBook.splice(phoneBook.indexOf(result[i]), 1);
    }

    var res = result.length;

    return res;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var result = [];
    if (query === '') {
        return result;
    }
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            result.push(outString(phoneBook[i].name, phoneBook[i].phone, phoneBook[i].email));

        }
    }
    var res = phoneBook.filter(function (record) {
        if (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1) {
            return true;
        }
        if (record.email) {
            return record.email.indexOf(query) !== -1;
        }

        return false;
    });
    for (var j = 0; j < res.length; j++) {
        result.push(outString(res[j].name, res[j].phone, res[j].email));
    }

    return (result.sort());
}

function outString(name, phone, email) {
    let result = name;
    if (phone !== undefined) {
        result = result + ', ' + isFormatPhone(phone);
    }
    if (email !== undefined) {
        result = result + ', ' + email;
    }

    return result;
}

function isFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
     phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    function addRecordInBook(record) {
        let cont = record.split(';');
        let name = cont[0];
        let phone = cont[1];
        let email = cont[2];
        if (add(phone, name, email) ||
            update(phone, name, email)) {
            return true;
        }

        return false;
    }

    let book = csv.split('\n');
    let addRecord = 0;
    for (let i = 0; i < book.length; i++) {
        let record = book[i];
        addRecord += addRecordInBook(record);
    }

    return addRecord;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
