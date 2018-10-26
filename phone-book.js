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
    if (isValidString(name) &&
        isValidPhone(phone) &&
        !phoneBook.has(phone)) {
        phoneBook.set(phone, { name, email });

        return true;
    }

    return false;
}

function isValidString(string) {
    return typeof string === 'string' && Boolean(string.trim());
}

function isValidPhone(phone) {
    return phoneRegex.test(phone) && typeof phone === 'string';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isValidString(name) &&
        isValidPhone(phone) &&
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
    if (!isValidString(query)) {
        return 0;
    }
    if (query === '*') {
        const sizePhoneBook = phoneBook.size;
        phoneBook = new Map();

        return sizePhoneBook;
    }
    let phoneArray = Array.from(phoneBook);
    const filteredPhoneBook = filterPhoneBookEntries(phoneArray, query).forEach(
        entries => phoneBook.delete(entries[0])
    );

    return filteredPhoneBook.length;

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let phoneArray = Array.from(phoneBook);
    if (!isValidString(query)) {
        return [];
    }
    if (query !== '*') {
        phoneArray = filterPhoneBookEntries(phoneArray, query);
    }
    phoneArray.sort(
        (entriesFirst, entriesSecond) => entriesFirst[1].name.localeCompare(entriesSecond[1].name),
    );

    return phoneArray.map(
        entries => formatContact(entries[0], entries[1].name, entries[1].email)
    );
}


function filterPhoneBookEntries(phoneArray, query) {
    return phoneArray.filter(
        entries => matchCheckField(entries[0], query) ||
            Object.keys(entries[1]).some(
                key => matchCheckField(entries[1][key], query)
            ));
}

function formatContact(phone, name, email) {
    const match = phone.match(phoneRegex);
    const formattedPhone = `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    const formattedEmail = email ? `, ${email}` : '';

    return `${name}, ${formattedPhone}${formattedEmail}`;
}

function matchCheckField(field, query) {
    return Boolean(field) && field.includes(query);
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
    return csv.split('\n')
        .map(record => {
            let [name, phone, email] = record.split(';');

            return { phone, name, email };
        })
        .filter(record =>
            update(record.phone, record.name, record.email) ||
            add(record.phone, record.name, record.email)
        ).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
