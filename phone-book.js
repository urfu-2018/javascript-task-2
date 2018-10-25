'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;
const tuple = (...args) => Object.freeze(args);

function createRecord(name, phone, email) {
    if (validatePhone(phone) && validateName(name)) {
        return tuple(name, phone, email);
    }

    function validatePhone(arg) {
        return typeof arg === 'string' && /^\d{10}$/.test(arg);
    }

    function validateName(arg) {
        return typeof arg === 'string' && arg !== '';
    }
}

function isRecordContainsQuery(record, query) {
    return record[0].indexOf(query) >= 0 || record[1].indexOf(query) >= 0 ||
        record[2] !== undefined && record[2].indexOf(query) >= 0;
}

function formatPhoneNumber(phone) {
    var secondPart = [phone.slice(3, 6), phone.slice(6, 8), phone.slice(8, 10)];

    return `+7 (${phone.slice(0, 3)}) ${secondPart.join('-')}`;
}

function getPrettyRecord(record) {
    const name = record[0];
    const phone = formatPhoneNumber(record[1]);
    const email = record[2];

    return [name, phone, email].filter(value => typeof value === 'string').join(', ');
}


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
    const newRecord = createRecord(name, phone, email);
    if (newRecord === undefined || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, newRecord);

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
    const newRecord = createRecord(name, phone, email);

    if (phoneBook.has(phone) && newRecord !== undefined) {
        phoneBook.set(phone, newRecord);

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
    return findRecords(query)
        .map(value => phoneBook.delete(value[1]))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecords(query).map(value => getPrettyRecord(value));
}

/**
 * Возвращает массив объектов с контактными данными из справочника, соответствующих запросу
 * @param {String} query - поисковый запрос
 * @returns {Array}
 */
function findRecords(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    let entries = Array.from(phoneBook.values());
    entries.sort((first, second) => first[0] > second[0]);

    return entries.filter(value => query === '*' || isRecordContainsQuery(value, query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    var recordsCount = 0;

    csv.split('\n').forEach(line => {
        const [name, phone, email] = line.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            recordsCount += 1;
        }
    });

    return recordsCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
