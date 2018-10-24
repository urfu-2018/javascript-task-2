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
    const phoneCheck = /^(\d{3}){2}(\d{2}){2}$/.test(phone);
    const nameCheck = typeof name !== 'undefined';
    let nameInPhoneBookCheck = phoneBook.filter(acc => acc.phone === phone);

    if (phoneCheck && nameCheck && nameInPhoneBookCheck.length === 0) {
        phoneBook.push({
            phone: phone,
            name: name,
            email: email
        });
        if (!email) {
            delete phoneBook[phoneBook.length - 1].email;
        }

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
        if (!email) {
            delete phoneBook[phoneLogIndex].email;
        } else {
            phoneBook[phoneLogIndex].email = email;
        }

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
        const phoneBookLength = phoneBook.length;
        phoneBook.length = 0;

        return phoneBookLength;
    }

    if (!query) {
        return 0;
    }

    let phoneBookQuerySet = phoneBook.map((acc, index) => {
        const phoneCheck = acc.phone.includes(query);
        const nameCheck = acc.name.includes(query);
        if (!acc.email) {
            return phoneCheck || nameCheck;
        }
        const emailCheck = acc.email.includes(query);

        return [phoneCheck || nameCheck || emailCheck, index];
    });
    let phoneBookIndexList = phoneBookQuerySet.filter((acc) => (acc[0]))
        .map((acc) => (acc[1]));

    phoneBookIndexList.forEach((index) => (phoneBook.splice(index, 1)));

    return phoneBookIndexList.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const func = (acc) => {
        const phone = '+7 (' +
            acc.phone.substring(0, 3) + ') ' +
            acc.phone.substring(3, 6) + '-' +
            acc.phone.substring(6, 8) + '-' +
            acc.phone.substring(8, 10);
        if (!acc.email) {
            return [acc.name, phone].join(', ');
        }

        return [acc.name, phone, acc.email].join(', ');
    };

    if (!query) {
        return [];
    }

    if (query === '*') {
        return phoneBook
            .sort((logOne, logTwo) => (logOne.name.localeCompare(logTwo.name)))
            .map(func);
    }

    let phoneBookQuerySet = phoneBook.filter((acc) => {
        const phoneCheck = acc.phone.includes(query);
        const nameCheck = acc.name.includes(query);
        if (!acc.email) {
            return phoneCheck || nameCheck;
        }
        const emailCheck = acc.email.includes(query);

        return phoneCheck || nameCheck || emailCheck;
    });

    return phoneBookQuerySet
        .sort((logOne, logTwo) => (logOne.name.localeCompare(logTwo.name)))
        .map(func);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const listOfPhoneLogs = csv.split('\n');
    const result = listOfPhoneLogs.filter((log) => {
        const logData = log.split(';');
        const name = logData[0];
        const phone = logData[1];
        const email = logData[2];

        return add(phone, name, email) || update(phone, name, email);
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
