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
    const phoneCheck = /^\d{10}$/.test(phone);
    const nameCheck = name && name.length > 0;
    const nameInPhoneBookCheck = phoneBook.filter(acc => acc.phone === phone);

    if (phoneCheck && nameCheck && nameInPhoneBookCheck.length === 0) {
        phoneBook.push({
            phone: phone,
            name: name,
            email: email
        });

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
    let phoneLogIndex = -1;
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneLogIndex = i;
            break;
        }
    }

    if (name && phoneLogIndex !== -1) {
        phoneBook[phoneLogIndex].name = name;
        phoneBook[phoneLogIndex].email = email;

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
    if (!query) {
        return 0;
    }

    const phoneBookLength = phoneBook.length;

    if (query === '*') {
        phoneBook = [];

        return phoneBookLength;
    }

    phoneBook = phoneBook.filter((log) => {
        const phoneCheck = log.phone.includes(query);
        const nameCheck = log.name.includes(query);
        const emailCheck = log.email && log.email.includes(query);

        return !(phoneCheck || nameCheck || emailCheck);
    });

    return phoneBookLength - phoneBook.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const formatLog = log => {
        const phone = '+7 (' +
            log.phone.substring(0, 3) + ') ' +
            log.phone.substring(3, 6) + '-' +
            log.phone.substring(6, 8) + '-' +
            log.phone.substring(8, 10);
        if (!log.email) {
            return [log.name, phone].join(', ');
        }

        return [log.name, phone, log.email].join(', ');
    };

    if (!query) {
        return [];
    }

    if (query === '*') {
        return phoneBook.map(formatLog).sort();
    }

    let phoneBookQuerySet = phoneBook.filter(log => {
        const phoneCheck = log.phone.includes(query);
        const nameCheck = log.name.includes(query);
        const emailCheck = log.email && log.email.includes(query);

        return phoneCheck || nameCheck || emailCheck;
    });

    return phoneBookQuerySet.map(formatLog).sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (typeof(csv) !== 'string' || !csv) {
        return 0;
    }

    const listOfPhoneLogs = csv.split('\n');
    const result = listOfPhoneLogs.filter((log) => {
        const logData = log.split(';');
        const name = logData[0];
        const phone = logData[1];
        const email = logData[2];

        return logData.length > 1 && (add(phone, name, email) || update(phone, name, email));
    });

    return result.length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
