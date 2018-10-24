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
    if (phoneBook.has(phone) || !name || !/^[0-9]{10}$/.test(phone)) {
        return false;
    }

    phoneBook.set(phone, {
        phone: phone,
        name: name,
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
    if (!phoneBook.has(phone) || !name) {
        return false;
    }

    phoneBook.set(phone, {
        phone: phone,
        name: name,
        email: email
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const entries = findEntries(query);

    entries.forEach(x => phoneBook.delete(x.phone));

    return entries.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findEntries(query).map(formatEntry);
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
    const lines = csv.split('\n');
    let success = 0;
    for (let i = 0; i < lines.length; ++i) {
        const parts = lines[i].split(';');
        const entry = {
            name: parts[0],
            phone: parts[1],
            email: parts.length > 2 ? parts[2] : undefined
        };

        const method = phoneBook.has(entry.phone)
            ? update
            : add;

        success += method(entry.phone, entry.name, entry.email);
    }

    return success;
}

function formatEntry(entry) {
    const phone = entry.phone;
    const phoneCode = phone.slice(0, 3);
    const parts = [phone.slice(3, 6), phone.slice(6, 8), phone.slice(8, 10)];
    const phoneString = `+7 (${phoneCode}) ${parts.join('-')}`;

    return entry.email
        ? `${entry.name}, ${phoneString}, ${entry.email}`
        : `${entry.name}, ${phoneString}`;
}

function compare(x, y) {
    if (x < y) {
        return -1;
    }

    if (x > y) {
        return 1;
    }

    return 0;
}

function findEntries(query) {
    if (!query) {
        return [];
    }

    const filter = query === '*'
        ? () => true
        : e => e.name.includes(query) ||
            e.phone.includes(query) ||
            (e.email && e.email.includes(query));

    return Array.from(phoneBook.values())
        .filter(filter)
        .sort((x, y) => compare(x.name, y.name));
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
