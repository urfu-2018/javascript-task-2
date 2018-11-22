'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;
var phoneBook = {};

/**
 * Телефонная книга
 */
const phonePattern = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email = '') {
    if (isValidRecord(phone, name) && phoneBook[phone] === undefined) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

        return true;
    }

    return false;
}

function isValidRecord(phone, name) {
    return isValidName(name) && isValidPhone(phone);
}

function isValidName(name) {
    return typeof name === 'string' && name !== '';
}

function isValidPhone(phone) {
    return typeof phone === 'string' && phonePattern.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = '') {
    if (isValidRecord(phone, name) && phoneBook[phone] !== undefined) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

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
    const result = find(query)
        .reduce((count, note) => {
            let phone = getBaseNumber(note.split(', ')[1]);
            delete phoneBook[phone];

            return count + 1;
        }, 0);

    return result;
}

function getBaseNumber(phone) {
    return phone.replace(/[() -]/g, '')
        .replace('+7', '');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query || typeof query !== 'string') {
        return [];
    }
    let matching = getAllMatching(query);

    return Object.keys(matching)
        .map(function (phone) {
            return getRepresentation(phone);
        })
        .sort(function (record1, record2) {
            const nameA = record1.split(',')[0].trim();
            const nameB = record2.split(',')[0].trim();

            return nameA.localeCompare(nameB);
        });
}

function getPhoneRepresentation(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
    phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function getRepresentation(phone) {
    let name = phoneBook[phone].name;
    let email = phoneBook[phone].email;
    let repr = '';
    let phoneRepresentation = getPhoneRepresentation(phone);
    repr = name + ', ' + phoneRepresentation;

    return email ? repr + ', ' + email : repr;
}

function getAllMatching(query) {
    return Object.keys(phoneBook)
        .reduce((result, phone) => {
            if ((query === '*') ||
                phone.includes(query) ||
                phoneBook[phone].name.includes(query) ||
                phoneBook[phone].email.includes(query)) {
                result[phone] = phoneBook[phone];
            }

            return result;
        }, []);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!csv || csv === '') {
        return 0;
    }
    const contacts = csv.split('\n');

    return contacts.reduce((count, contact) => {
        const [name, phone, email] = contact.split(';');
        const isUpdated = update(phone, name, email);
        const isAdded = add(phone, name, email);

        return isUpdated || isAdded ? ++count : count;
    }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
