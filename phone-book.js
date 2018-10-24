'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectArgs(phone, name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { name, email });

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
    if (!isCorrectArgs(phone, name) || !phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {
        return 0;
    }
    const initialPhoneBookLen = phoneBook.size;
    phoneBook.forEach(({ name, email }, key) => {
        if (
            key.includes(query) ||
            name.includes(query) ||
            (email && email.includes(query)) ||
            query === '*'
        ) {
            phoneBook.delete(key);
        }
    });

    return initialPhoneBookLen - phoneBook.size;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }
    const result = [];
    phoneBook.forEach(({ name, email }, key) => {
        if (query === '*' || key.includes(query) || name.includes(query) || email.includes(query)) {
            const phone =
                `+7 (${key.substr(0, 3)}) ${key.substr(3, 3)}-` +
                `${key.substr(6, 2)}-${key.substr(8, 2)}`;
            result.push(`${name}, ${phone}` + (email ? `, ${email}` : ''));
        }
    });

    return result.sort();
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

/**
 * Проверка на то что все агрументы правильные
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function isCorrectArgs(phone, name) {
    return /^\d{10}$/.test(phone) && typeof name === 'string' && name;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
