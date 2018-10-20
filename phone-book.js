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
 *  Шаблон номера
 */
const phonePattern = /^[0-9]{10}$/;

/**
 *  Шаблон отформатированного номера с группами
 */
const prettyPhonePattern = /\+7 \(([0-9]{3})\) ([0-9]{3})-([0-9]{2})-([0-9]{2})/;

/**
 * Проверка корректности аргументов
 * @param {String} phone
 * @param {String?} name
 * @returns {Boolean}
 */
function isCorrect(phone, name) {
    if (typeof phone !== 'string' ||
        typeof name !== 'string') {
        return false;
    }

    if (!name || name.trim() === '') {
        return false;
    }

    if (!phonePattern.test(phone)) {
        return false;
    }

    return true;
}

/**
 * Форматирует номер телефона
 * @param {String} phone
 * @returns {String}
 */
function prettifyPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 * Вырезать обычный номер (ключ) из форматированной строки
 * @param {String} prettyEntry
 * @returns {String}
 */
function getPhone(prettyEntry) {
    return prettyEntry.match(prettyPhonePattern)
        .slice(1)
        .join('');
}

/**
 * Отформатировать строку для вывода find
 * @param {Any[]} phoneBookEntry
 * @returns {String}
 */
function prettifyEntry(phoneBookEntry) {
    return (phoneBookEntry[1].email) ? [
        phoneBookEntry[1].name,
        prettifyPhone(phoneBookEntry[0]),
        phoneBookEntry[1].email
    ].join(', ') : [
        phoneBookEntry[1].name,
        prettifyPhone(phoneBookEntry[0])
    ].join(', ');
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrect(phone, name)) {
        return false;
    }

    if (phoneBook.has(phone)) {
        return false;
    }

    email = typeof email === 'string' && email ? email : '';
    phoneBook.set(phone, {
        name,
        email
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
    if (!isCorrect(phone, name)) {
        return false;
    }

    if (!phoneBook.has(phone)) {
        return false;
    }

    email = typeof email === 'string' && email ? email : '';
    phoneBook.set(phone, {
        name,
        email
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '*') {
        const length = phoneBook.size;
        phoneBook.clear();

        return length;
    }

    const records = find(query);
    records.forEach(prettyEntry => phoneBook.delete(getPhone(prettyEntry)));

    return records.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }

    const prettyEntries = Array.from(phoneBook, entry => prettifyEntry(entry)).sort();

    return (query === '*')
        ? prettyEntries
        : prettyEntries
            .filter(v => v.includes(query) || getPhone(v).includes(query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (typeof csv !== 'string' || !csv) {
        return 0;
    }

    return csv.split('\n').reduce((acc, s) => {
        let [name, phone, email] = s.split(';');

        return (add(phone, name, email) || update(phone, name, email))
            ? acc + 1 : acc;
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
