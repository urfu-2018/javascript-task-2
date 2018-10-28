'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!name || !phone ||
         !((/^\d{10}$/).test(phone)) ||
          (phoneBook.hasOwnProperty(phone))) {
        return false;
    }
    phoneBook[phone] = { name, email };

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
    if (!name) {
        return false;
    }
    if (!(phone in phoneBook)) {
        return false;
    }
    phoneBook[phone].name = name;
    phoneBook[phone].email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {
        return 0;
    }
    let count = 0;
    if (query === '*') {
        const res = Object.keys(phoneBook).length;
        phoneBook = {};

        return res;
    }
    for (const phone of Object.keys(phoneBook)) {
        count += deleteContact(phone, query);
    }

    return count;
}

function deleteContact(phone, query) {
    if (findContacts(phone, query)) {
        delete phoneBook[phone];

        return 1;
    }

    return 0;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return pushAll();
    }

    return findQuery(query);
}

function findQuery(query) {
    let tmpAnswer = [];
    let answer = [];
    for (const phone of Object.keys(phoneBook)) {
        tmpAnswer.push(pushContact(phone, query));
    }
    for (let i = 0; i < tmpAnswer.length; i++) {
        if (tmpAnswer[i] !== '') {
            answer.push(tmpAnswer[i]);
        }
    }

    return answer.sort();
}

function pushContact(phone, query) {
    if (findContacts(phone, query)) {
        return (contactAsString(phoneBook[phone], phone));
    }

    return '';
}

function findContacts(phone, query) {
    if (phone.includes(query)) {
        return true;
    } else if (phoneBook[phone].name.includes(query)) {
        return true;
    } else if (phoneBook[phone].email !== undefined &&
        phoneBook[phone].email.includes(query)) {
        return true;
    }
}

function pushAll() {
    let answer = [];
    for (const ph of Object.keys(phoneBook)) {
        answer.push(contactAsString(phoneBook[ph], ph));
    }

    return answer.sort();
}

function formatPhone(phone) {
    let result = '+7 (' + phone.substring(0, 3) +
     ') ' + phone.substring(3, 6) +
      '-' + phone.substring(6, 8) +
       '-' + phone[8] + phone[9];

    return result;
}

function contactAsString(contact, phone) {
    var result = contact.name + ', ' + formatPhone(phone);
    if (contact.email !== undefined) {
        result += ', ' + contact.email;
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
    if (!csv) {
        return 0;
    }
    const csvLine = csv.split('\n');
    let fromCsvLength = 0;
    for (let i = 0; i < csvLine.length; i++) {
        const [name, phone, email] = csvLine[i].split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            fromCsvLength++;
        }
    }

    return fromCsvLength;
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
