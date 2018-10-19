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
 * Проверка корректности телефонного номера
 * @param {String} phone
 * @returns {Boolean}
 */
function isValidPhone(phone) {
    if (typeof phone !== 'string') {
        return false;
    }
    const PHONE_PATTERN = /^\d{10}$/;

    return PHONE_PATTERN.test(phone);
}

/**
 * Возвращает строкове представление имени
 * @param {String} name
 * @returns {Boolean}
 */
function isValidName(name) {
    if (typeof name !== 'string') {
        return false;
    }

    return name.length > 0;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhone(phone)) {
        return false;
    }
    if (!isValidName(name)) {
        return false;
    }
    if (phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, {
        name: name,
        email: (typeof email === 'string' ? email : '')
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
    if (!isValidPhone(phone)) {
        return false;
    }
    if (!phoneBook.has(phone)) {
        return false;
    }
    let entry = phoneBook.get(phone);
    if (isValidName(name)) {
        entry.name = name;
    }
    entry.email = (typeof email === 'string' ? email : '');
    phoneBook.set(phone, entry);

    return true;
}

/**
 * Возвращает массив объектов с контактными данными из справочника, соответствующих запросу
 * @param {String} query - поисковый запрос
 * @returns {Array}
 */
function findEntries(query) {
    const result = [];
    phoneBook.forEach((personalData, phone) => {
        personalData.phone = phone;
        if (query === '*') {
            result.push(personalData);

            return;
        }
        for (let key in personalData) {
            if (!personalData.hasOwnProperty(key)) {
                continue;
            }
            if (personalData[key].indexOf(query) !== -1) {
                result.push(personalData);

                return;
            }
        }
    });

    return result;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const entries = findEntries(query);
    entries.forEach(entry => {
        phoneBook.delete(entry.phone);
    });

    return entries.length;
}

/**
 * Форматирует номер телефона
 * @param {Object} personalData - данные о контакте: номер телефона, имя и адрес эл. почты
 * @returns {String}
 */
function getTextRepresentation(personalData) {

    function formatPhone(phone) {
        return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 3) + '-' +
            phone.slice(6, 2) + '-' + phone.slice(8, 2);
    }

    return formatPhone(personalData.phone) +
        (personalData.name.length ? ', ' + personalData.name : '') +
        (personalData.email.length ? ', ' + personalData.email : '');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string') {
        return [];
    }
    if (!query.length) {
        return [];
    }
    const entries = findEntries(query);
    entries.map(entry => {
        return getTextRepresentation(entry);
    });

    return entries;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const NEW_LINE_PATTERN = /[\r\n]+/;
    const FIELDS_DELIMITER = ';';
    let successOperationsCount = 0;
    csv.split(NEW_LINE_PATTERN).forEach(line => {
        const values = line.split(FIELDS_DELIMITER);
        const entry = {
            'name': values[0],
            'phone': values[1],
            'email': values[2]
        };
        const method = !phoneBook.has(entry.phone) ? add : update;
        successOperationsCount += method(entry.phone, entry.name, entry.email) ? 1 : 0;
    });

    return successOperationsCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isValidPhone,
    isValidName,
    findEntries,
    getTextRepresentation,

    isStar
};
