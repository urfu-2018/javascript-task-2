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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectPhoneNumber(phone) || !isCorrectName(name) ||
    phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { name, email });

    return true;
}

function isCorrectPhoneNumber(phone) {
    return typeof(phone) === 'string' && phone.length === 10 && /^\d{10}$/.test(phone);
}

function isCorrectName(name) {
    return typeof(name) === 'string' && name !== '';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (phoneBook.has(phone) && name !== undefined && name !== '') {
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
    const keys = findKeysToRemove(query);
    for (let key of keys) {
        phoneBook.delete(key);
    }

    return keys.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const keys = findKeysToRemove(query);

    return keys.sort(compareNames)
        .map(formatRecord);
}

function compareNames(a, b) {
    return phoneBook.get(a).name.localeCompare(phoneBook.get(b).name);
}

function formatRecord(phone) {
    const number = formatPhoneNumber(phone);
    let output = [phoneBook.get(phone).name, number];
    if (phoneBook.get(phone).email !== undefined) {
        output.push(phoneBook.get(phone).email);
    }

    return output.join(', ');
}

function formatPhoneNumber(phone) {
    const p1 = phone.slice(0, 3);
    const p2 = phone.slice(3, 6);
    const p3 = phone.slice(6, 8);
    const p4 = phone.slice(8, 10);

    return `+7 (${p1}) ${p2}-${p3}-${p4}`;
}

function findKeysToRemove(query) {
    if (query === '*') {
        return getAllKeys();
    }
    if (query === '' || query === undefined) {
        return [];
    }

    return getAllKeys().filter(phone =>
        phone.includes(query) ||
        phoneBook.get(phone).name.includes(query) ||
        (phoneBook.get(phone).email !== undefined &&
        phoneBook.get(phone).email.includes(query)));
}

function getAllKeys() {
    let keys = [];
    const iterator = phoneBook.keys();

    for (;;) {
        const result = iterator.next();
        if (result.done) {
            break;
        }
        keys.push(result.value);
    }

    return keys;
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
    // На выходе метод возвращает одно число добавленных/обновленных записей

    if (typeof(csv) !== 'string') {
        return 0;
    }
    let count = 0;
    const records = csv.split('\n');
    records.forEach(record => {
        const data = record.split(';');
        const name = data[0];
        const phone = data[1];
        const email = data[2];
        if (add(phone, name, email)) {
            count++;
        } else if (update(phone, name, email)) {
            count++;
        }
    });

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
