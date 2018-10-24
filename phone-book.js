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

function checkString(string) {
    return typeof string === 'string' && string !== '';
}

function validatePhone(phone) {
    const PHONE_PATTERN = /^\d{10}$/;

    return checkString(phone) && PHONE_PATTERN.test(phone);
}

function validateEmail(email) {
    return email === undefined || checkString(email);
}

function checkArgs(phone, name, email) {
    return validatePhone(phone) &&
        checkString(name) &&
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

function entryContainsQuery(entry, query) {
    const values = Object.values(entry);
    query = (query === '*' ? '' : query);

    return values.some(value => value !== undefined && value.includes(query));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!checkString(query)) {
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
    if (!checkString(query)) {
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

        const success = add(phone, name, email) || update(phone, name, email);

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
