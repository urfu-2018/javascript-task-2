'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

function isValidPhone(phone) {
    return typeof phone === 'string' && !isNaN(phone) && phone.length === 10;
}

function isValidName(name) {
    return typeof name === 'string' && name !== '';
}

function formatPhoneNumber(num) {
    return `+7 (${num.substr(0, 3)}) ${num.substr(3, 3)}-${num.substr(6, 2)}-${num.substr(8)}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (phoneBook.has(phone) || !isValidPhone(phone) || !isValidName(name)) {
        return false;
    }
    phoneBook.set(phone, [phone, name, email || '']);

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
    if (!phoneBook.has(phone) || !isValidPhone(phone) || !isValidName(name)) {
        return false;
    }
    phoneBook.set(phone, [phone, name, email || '']);

    return true;
}

function findRecords(query) {
    if (query === '') {
        return [];
    }

    return Array.from(phoneBook.values()).filter(record => {
        let matches = false;
        record.forEach(field => {
            if (query === '*' || field.includes(query)) {
                matches = true;
            }
        });

        return matches;
    });
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let result = 0;
    findRecords(query).forEach(record => {
        result++;
        phoneBook.delete(record[0]);
    });

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecords(query)
        .sort()
        .map(record => {
            const [phone, name, email] = record;
            if (email) {
                return `${name}, ${formatPhoneNumber(phone)}, ${email}`;
            }

            return `${name}, ${formatPhoneNumber(phone)}`;
        });
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
    let result = 0;
    csv.split('\n').forEach(line => {
        const [name, phone, email] = line.split(';');
        result += phoneBook.has(phone) ? update(phone, name, email) : add(phone, name, email);
    });

    return result;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
