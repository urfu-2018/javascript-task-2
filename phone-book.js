'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

/* Хелперы */
/**
 * Валидирование номера телефона
 * @param {String} phone
 * @returns {Boolean}
 */
function validatePhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Валидирование имени
 * @param {String} name
 * @returns {Boolean}
 */
function validateName(name) {
    return typeof name === 'string' && name !== '';
}

/**
 * Получение отфильтрованной по запросу телефонной книги
 * @param {String} query
 * @returns {String[]}
 */
function getFilteredPhones(query) {
    if (query === '') {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook)
        .filter(phone => phone.includes(query) || phoneBook[phone].name.includes(query) ||
            (phoneBook[phone].email && phoneBook[phone].email.includes(query))
        );
}

/**
 * Получение отформатированного телефонного номера
 * @param {String} phone
 * @returns {String}
 */
function getFormattedPhone(phone) {
    var groups = /(\d{3})(\d{3})(\d{2})(\d{2})/.exec(phone);

    return `+7 (${groups[1]}) ${groups[2]}-${groups[3]}-${groups[4]}`;
}

/**
 * Получение отформатированной строки данных
 * @param {String} phone
 * @returns {String}
 */
function getFormattedEntry(phone) {
    var data = phoneBook[phone];

    var entry = `${data.name}, ${getFormattedPhone(phone)}`;

    if (data.email) {
        entry = entry + `, ${data.email}`;
    }

    return entry;
}

function compare(a, b) {
    return phoneBook[a].name.localeCompare(phoneBook[b].name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!validatePhone(phone) || !validateName(name) || phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = { name, email };

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
    if (!validatePhone(phone) || !validateName(name) || !phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    var phones = getFilteredPhones(query);

    phones.forEach(phone => {
        delete phoneBook[phone];
    });

    return phones.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return getFilteredPhones(query).sort(compare)
        .map(getFormattedEntry);
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
        .map(entry => {
            var [name, phone, email] = entry.split(';');

            return phoneBook[phone] ? update(phone, name, email) : add(phone, name, email);
        })
        .reduce((total, imported) => total + imported);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
