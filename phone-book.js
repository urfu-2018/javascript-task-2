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

/**
 *  Шаблон номера
 */
const phonePattern = /^[0-9]{10}$/;

/**
 * Проверка корректности аргументов
 * @param {String} phone
 * @param {String} name
 * @returns {Boolean}
 */
function isCorrect(phone, name) {
    const isValidPhone = typeof phone === 'string' && phonePattern.test(phone);
    const isValidName = typeof name === 'string' && name.trim() !== '';

    return isValidPhone && isValidName;
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
 * Поиск по запросу
 * @param {String} query
 * @returns {Array<Array<String, Object>>}
 */
function search(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }

    const entries = Array.from(phoneBook);

    return (query === '*') ? entries : entries
        .filter(pair => {
            const [phone, entry] = pair;

            return phone.includes(query) ||
                Object.values(entry).some(value => value.includes(query));
        });
}

/**
 * Отформатировать строку для вывода find
 * @param {Array<String, Object>} phoneBookEntry
 * @returns {String}
 */
function prettifyEntry(phoneBookEntry) {
    const [phone, entry] = phoneBookEntry;
    const result = [entry.name, prettifyPhone(phone)];

    if (entry.email) {
        result.push(entry.email);
    }

    return result.join(', ');
}

/**
 * Добавление записи в телефонную книгу, если выполнено условие для номера телефона
 * @param {Function<String, Boolean>} validate
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
function setEntry(validate, phone, name, email) {
    if (!isCorrect(phone, name) || validate()) {
        return false;
    }

    phoneBook.set(phone, {
        name,
        email
    });

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = '', email = '') {
    return setEntry(() => phoneBook.has(phone), phone, name, email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name = '', email = '') {
    return setEntry(() => !phoneBook.has(phone), phone, name, email);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const entries = search(query);
    entries.forEach(([phone]) => phoneBook.delete(phone));

    return entries.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const entries = search(query);

    return entries.sort((firstPair, secondPair) => {
        const firstName = firstPair[1].name;
        const secondName = secondPair[1].name;

        return firstName.localeCompare(secondName);
    }).map(prettifyEntry);
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
        const [name, phone, email] = s.split(';');

        return (add(phone, name, email) || update(phone, name, email)) ? acc + 1 : acc;
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
