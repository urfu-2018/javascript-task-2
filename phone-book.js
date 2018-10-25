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
const phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isValidName(name) &&
        isValidPhone(phone, phoneRegex) &&
        !phoneBook.has(phone)) {
        phoneBook.set(phone, { name, email });

        return true;
    }

    return false;
}

function isValidName(name) {
    return typeof name === 'string' && name.trim().length !== 0;
}

function isValidPhone(phone, regexPhone) {
    return regexPhone.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isValidName(name) &&
        isValidPhone(phone, phoneRegex) &&
        phoneBook.has(phone)) {
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
    let phoneArray = Array.from(phoneBook);

    return filterEntriesPhoneBooks(phoneArray, query).length;

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let phoneArray = Array.from(phoneBook);
    if (query !== '*') {
        phoneArray = filterEntriesPhoneBooks(phoneArray, query);
    }
    if (query === ' ') {
        return [];
    }
    phoneArray.sort(
        (entriesFirst, entriesSecond) => entriesFirst[1].name.localeCompare(entriesSecond[1].name),
    );

    return phoneArray.map(
        entries => formatContact(entries[0], entries[1].name, entries[1].email)
    );
}


function filterEntriesPhoneBooks(phoneArray, query) {
    return phoneArray.filter(
        (entries) => {
            if (matchCheckField(entries[0], query)) {
                return true;
            }
            if (Object.keys(entries[1]).some(key => matchCheckField(entries[1][key], query))) {
                return true;
            }

            return false;
        }
    );
}

function formatContact(phone, name, email) {
    const match = phone.match(phoneRegex);
    const newFormatPhone = `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    const newFormatEmail = email ? `, ${email}` : '';

    return `${name}, ${newFormatPhone}${newFormatEmail}`;
}

function matchCheckField(field, query) {
    if (field) {
        return field.includes(query);
    }

    return false;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
