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

    phoneBook.set(phone, { phone, name, email });

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

    phoneBook.set(phone, { phone, name, email });

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
        const [name, phone, email] = lines[i].split(';');

        const method = phoneBook.has(phone) ? update : add;

        success += Number(method(phone, name, email));
    }

    return success;
}

/**
 * Представление записи в виде строки
 * @param {String} phone
 * @param {String} name
 * @param {String?} email
 * @returns {Boolean}
 */
function formatEntry({ name, email, phone }) {
    const regex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;
    const parts = phone.match(regex);
    const phoneString = `+7 (${parts[1]}) ${parts.slice(2).join('-')}`;

    return email
        ? `${name}, ${phoneString}, ${email}`
        : `${name}, ${phoneString}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Object[]}
 */
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
        .sort((x, y) => x.name.localeCompare(y.name));
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
