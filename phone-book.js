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

var em = /^\S+@\S+$/;

function validateEmail(email) {
    return email === undefined || typeof email === 'string' && em.test(email.toLowerCase());
}

function findContactByPhone(phone) {
    return phoneBook.find(function (contact) {
        return contact.phone === phone;
    });
}

function validatePhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/g.test(phone);
}

function canAddPhone(phone) {
    return validatePhone(phone) && !findContactByPhone(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof name !== 'string' || name.length === 0) {
        return false;
    }

    if (!validateEmail(email)) {
        return false;
    }

    if (!canAddPhone(phone)) {
        return false;
    }

    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

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
    if (typeof name !== 'string' || name.length === 0) {
        return false;
    }

    if (!validatePhone(phone)) {
        return false;
    }

    if (!validateEmail(email)) {
        return false;
    }

    const contact = findContactByPhone(phone);

    if (!contact) {
        return false;
    }

    contact.name = name;
    contact.email = email;

    return true;
}

function contactToString(contact) {
    var phone = contact.phone;

    return contact.name +
        `, +7 (${phone.substr(0, 3)})` +
        ` ${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}` +
        (contact.email ? `, ${contact.email}` : '');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query.length === 0) {
        return [];
    }

    var sorted = [];
    phoneBook.forEach(function (contact) {
        sorted.push(contact);
    });

    sorted.sort(function (A, B) {
        var a = A.name.toLowerCase();
        var b = B.name.toLowerCase();

        if (a < b) {
            return -1;
        }

        if (a > b) {
            return 1;
        }

        return 0;
    });

    return sorted.filter(function (contact) {
        return checkContactToQuery(contact, query);
    }).map(contactToString);
}
function checkContactToQuery(contact, query) {
    if (query === '*') {
        return contact;
    }

    if (contact.name.indexOf(query) !== -1) {
        return true;
    }

    if (contact.phone.indexOf(query) !== -1) {
        return true;
    }

    if (contact.email && contact.email.indexOf(query) !== -1) {
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
    var remainingContacts = [];
    var deletedCount = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        var contact = phoneBook[i];

        if (checkContactToQuery(contact, query)) {
            deletedCount++;
        } else {
            remainingContacts.push(contact);
        }
    }

    phoneBook = remainingContacts;

    return deletedCount;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */

function importFromCsv(csv) {
    var strings = csv.split('\n');

    var changesCount = 0;
    for (var i = 0; i < strings.length; i++) {
        var string = strings[i];
        var arr = string.split(';');

        var name = arr[0];
        var phone = arr[1];
        var email = arr[2];

        var success = false;
        if (findContactByPhone(phone)) {
            success = update(phone, name, email);

        } else {
            success = add(phone, name, email);
        }

        if (success === true) {
            changesCount++;
        }
    }

    return changesCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
