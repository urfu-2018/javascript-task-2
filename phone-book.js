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
    const a = /^\d{10}$/.test(phone);
    if (!a || phoneBook.hasOwnProperty(phone) || !name) {
        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

function isCorrectPhoneNumber(phone) {
    return typeof(phone) === 'string' && phone.length === 10 && /^\d{10}$/.test(phone);
    // return /^\d{10}$/.test(phone);
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
    if (Object.keys(phoneBook).includes(phone) && isCorrectName) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

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
    var foundRecordKeys = find(query);
    for (let key of foundRecordKeys) {
        phoneBook.delete(key);
    }

    return foundRecordKeys.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const foundKeys = findKeysToRemove(query);

    return foundKeys.sort(compareNames)
        .map(formatRecord);
}

function compareNames(a, b) {
    return phoneBook[a].name.localeCompare(phoneBook[b].name);
}

function formatRecord(phone) {
    var number = formatPhoneNumber(phone);
    var output = [phoneBook[phone].name, number];
    if (phoneBook[phone].email !== undefined) {
        output.push(phoneBook[phone].email);
    }

    return output.join(', ');
}

function formatPhoneNumber(phone) {
    // var arr = /^(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
    // return format: +7 (555) 333-00-33
    const p1 = phone.slice(0, 3);
    const p2 = phone.slice(3, 6);
    const p3 = phone.slice(6, 8);
    const p4 = phone.slice(8, 10);

    return `+7 (${p1}) ${p2}-${p3}-${p4}`;
}

function findKeysToRemove(query) {
    if (query === '*') {
        return Object.keys(phoneBook);
    }
    if (query === '' || query === undefined) {
        return [];
    }

    return Object.keys(phoneBook)
        .filter(phone =>
            phone.includes(query) ||
            phoneBook[phone].name.includes(query) ||
            (phoneBook[phone].email !== undefined && phoneBook[phone].email.includes(query)));
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
    var count = 0;
    var records = csv.split('\n');
    records.forEach(record => {
        var data = record.split(';');
        var name = data[0];
        var phone = data[1];
        var email = data[2];
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
