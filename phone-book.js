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

function validatePhone(phone) {
    const PHONE_PATTERN = /^\d{10}$/;

    if (typeof phone !== 'string') {
        return false;
    }

    return PHONE_PATTERN.test(phone);
}

function validateName(name) {
    if (typeof name !== 'string' || name === '') {
        return false;
    }

    return true;
}

function validateEmail(email) {
    if (email === undefined) {
        return true;
    }

    return typeof email === 'string' && email !== '';
}

function checkArgs(phone, name, email) {
    return validatePhone(phone) &&
        validateName(name) &&
        validateEmail(email);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkArgs(phone, name, email)) {
        return false;
    }

    if (phoneBook.some(element => element.phone === phone)) {
        return false;
    }

    phoneBook.push({
        name: name,
        phone: phone,
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
    if (!checkArgs(phone, name, email)) {
        return false;
    }

    const match = phoneBook.find(element => element.phone === phone);

    if (match) {
        match.name = name;
        match.email = email;

        return true;
    }

    return false;
}

function checkQuery(query) {
    return typeof query === 'string' || query !== '';
}

function entryContainsQuery(entry, query) {
    const values = Object.values(entry);
    const pattern = query === '*' ? /.*/ : new RegExp(query);

    const match = values
        .find(value => value !== undefined && pattern.test(value));

    if (match) {
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
    if (!checkQuery(query)) {
        return 0;
    }

    let removedCount = 0;

    phoneBook = phoneBook.filter(element => {
        if (entryContainsQuery(element, query)) {
            removedCount++;

            return false;
        }

        return true;
    });

    return removedCount;
}

function formatPhoneString(phone) {
    const formattedPhone = `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-` +
        `${phone.substring(6, 8)}-${phone.substring(8, 10)}`;

    return formattedPhone;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!checkQuery(query)) {
        return [];
    }

    const result = phoneBook
        .reduce((acc, entry) => {
            if (entryContainsQuery(entry, query)) {
                const formattedPhone = formatPhoneString(entry.phone);

                if (entry.email !== undefined) {
                    acc.push(`${entry.name}, ${formattedPhone}, ${entry.email}`);
                } else {
                    acc.push(`${entry.name}, ${formattedPhone}`);
                }
            }

            return acc;
        }, [])

        .sort();

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let addedCount = 0;

    csv.split('\n').forEach(element => {
        const tokens = element.split(';');

        const name = tokens[0];
        const phone = tokens[1];
        const email = tokens[2];

        let success = false;

        success = add(phone, name, email);

        if (!success) {
            success = update(phone, name, email);
        }

        if (success) {
            addedCount++;
        }
    });

    return addedCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
