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
 * Приводит по конкретному индексу контакта в строку
 * @param {String?} phone
 * @returns {String}
 */
function toString(phone) {

    return phoneBook[phone][0] + ', ' + phone + ', ' + phoneBook[phone][1];
}

function isContainsContact(phone) {
    if (phoneBook.length === 0) {
        return false;
    }

    return phoneBook[phone] !== undefined;
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrect(phone, name)) {
        return false;
    }
    if (!isContainsContact(phone)) {
        var temp = [];
        temp[0] = name;
        temp[1] = email;
        phoneBook[phone] = temp;

        return true;
    }

    return false;
}

function isCorrect(phone, name) {
    if (phone.length !== 10 || name === undefined || name === '') {
        return false;
    }
    if (typeof(name) !== 'string') {
        return false;
    }

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
    if (!isCorrect(phone, name)) {
        return false;
    }
    if (isContainsContact(phone)) {
        var temp = [];
        temp[0] = name;
        temp[1] = email;
        phoneBook[phone] = temp;

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
    if (checkQuery(query)) {

        return 0;
    }
    var count = 0;
    var delContact = find(query);
    for (var item of delContact) {
        var delPhone = item.split(', ')[1].replace(/(\D)/ig, '').slice(1, 11);
        var del = delete phoneBook[delPhone];
        if (del) {
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
    if (checkQuery(query)) {

        return [];
    }
    var result = [];
    for (var contact in phoneBook) {
        if (phoneBook.hasOwnProperty(contact)) {
            result = makeArray(contact, result, query);
        }
    }

    return result.sort(function (a, b) {
        var a1 = a.slice(0, a.indexOf(', '));
        var b1 = b.slice(0, b.indexOf(', '));

        return a1.localeCompare(b1);
    });
}

function makeArray(contact, result, query) {
    var tmpStr = toString(contact);
    if (query === '*' || tmpStr.includes(query)) {
        var str = tmpStr.split(', ');
        var checkEmail = str[2] === 'undefined' ? '' : ', ' + str[2];
        var tel = str[0] + ', +7 (' + str[1].slice(0, 3) + ') ' + str[1].slice(3, 6) + '-' +
        str[1].slice(6, 8) + '-' + str[1].slice(8, 10) + checkEmail;
        result[result.length] = tel;
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
    if (typeof(csv) !== 'string' || csv === '') {
        return 0;
    }
    var tempContact = csv.split('\n');
    var count = 0;
    for (var i = 0; i < tempContact.length; i++) {
        var tmp = tempContact[i].split(';');
        var name = tmp[0];
        var phone = tmp[1];
        var email = tmp[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            count++;
        }
    }

    return count;
}

function checkQuery(query) {
    if (phoneBook.length === 0 || query === undefined || query === '') {

        return true;
    }

    return false;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
