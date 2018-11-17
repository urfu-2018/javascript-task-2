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


function findData(phone, data, query) {
    const email = data.email;
    const hasPhoneQuery = phone.includes(query);
    const hasNameQuery = data.name.includes(query);
    const hasEmailQuery = email && email.includes(query);

    const filterPredicate = hasPhoneQuery || hasNameQuery || hasEmailQuery;

    return filterPredicate;
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isNameValid = name && name.length > 0;
    const isNameInPhoneBook = phoneBook.get(phone);

    if (isPhoneValid && isNameValid && !isNameInPhoneBook) {
        phoneBook.set(phone, { name, email });

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
    if (phoneBook.get(phone)) {
        phoneBook.set(phone, { name, email });

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
    // let phoneArray = ;
    const oldPhoneBookLength = Array.from(phoneBook.keys()).length;

    if (!query) {
        return 0;
    }

    if (query === '*') {
        phoneBook.clear();

        return oldPhoneBookLength;
    }

    let count = 0;

    for (var [phone, data] of phoneBook.entries()) {
        if (query === '*' || findData(phone, data, query)) {
            phoneBook.delete(phone);
            count++;
        }
    }

    // phoneArray = phoneArray.filter(phone => {
    // const email = phoneBook.get(phone).email;
    // const hasPhoneQuery = phone.includes(query);
    // const hasNameQuery = phoneBook.get(phone).name.includes(query);
    // const hasEmailQuery = email && email.includes(query);

    // const filterPredicate = hasPhoneQuery || hasNameQuery || hasEmailQuery;

    // if (filterPredicate) {
    //     phoneBook.delete(phone);
    // }

    // return !filterPredicate;
    // });

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let phoneArray = Array.from(phoneBook.keys());
    const formatLog = phone => {
        const phoneFormatted = phone
            .replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
        const name = phoneBook.get(phone).name;
        const email = phoneBook.get(phone).email;

        if (!email) {
            return [name, phoneFormatted].join(', ');
        }

        return [name, phoneFormatted, email].join(', ');
    };

    if (!query) {
        return [];
    }

    if (query === '*') {
        return phoneArray
            .sort((phoneOne, phoneTwo) => (phoneBook.get(phoneOne).name
                .localeCompare(phoneBook.get(phoneTwo).name))
            ).map(formatLog);
    }

    let phoneBookQuerySet = phoneArray.filter(phone => {
        const email = phoneBook.get(phone).email;
        const hasPhoneQuery = phone.includes(query);
        const hasNameQuery = phoneBook.get(phone).name.includes(query);
        const hasEmailQuery = email && email.includes(query);

        return hasPhoneQuery || hasNameQuery || hasEmailQuery;
    });

    return phoneBookQuerySet
        .sort((phoneOne, phoneTwo) => (phoneBook.get(phoneOne).name
            .localeCompare(phoneBook.get(phoneTwo).name))
        ).map(formatLog);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    if (typeof(csv) !== 'string' || !csv) {
        return 0;
    }

    const listOfPhoneLogs = csv.split('\n');
    const result = listOfPhoneLogs.filter(log => {
        const [name, phone, email] = log.split(';');

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
