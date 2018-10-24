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

function changePhoneFormat(str) {
    return '+7 (' + str.slice(0, 3) + ') ' +
        str.slice(3, 6) + '-' + str.slice(6, 8) + '-' + str.slice(8);
}

function contains(phone, name, email, query) {
    return query && (query === '*' ||
        phone.indexOf(query) !== -1 ||
        name.indexOf(query) !== -1 ||
        email && email.indexOf(query) !== -1);
}

function revertPhoneFormat(record) {
    const phone = record.split(', ')[1];

    return phone.slice(4, 7) + phone.slice(9, 12) + phone.slice(13, 15) + phone.slice(16, 18);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!/^\d{10}$/.test(phone) || phoneBook.hasOwnProperty(phone) || !name) {
        return false;
    }
    phoneBook[phone] = email ? { name, email } : { name };

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
    if (!name) {
        return false;
    }
    if (!phoneBook.hasOwnProperty(phone)) {
        return false;
    }
    phoneBook[phone] = email ? { name, email } : { name };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const found = find(query);
    for (let i = 0; i < found.length; ++i) {
        let phone = revertPhoneFormat(found[i]);
        delete phoneBook[phone];
    }

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const keys = Object.keys(phoneBook);
    const result = {};
    for (let i = 0; i < keys.length; ++i) {
        const phone = keys[i];
        const value = phoneBook[phone];
        if (contains(phone, value.name, value.email, query)) {
            result[value.name] = value.name + ', ' +
                changePhoneFormat(phone) + (value.email ? ', ' + value.email : '');
        }
    }
    const ans = Object.keys(result).sort()
        .map(function (key) {
            return result[key];
        });

    return ans;
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
    return csv
        .split('\n')
        .map(function (record) {
            return record.split(';');
        })
        .filter(function (record) {
            return add(record[1], record[0], record[2]) ||
                update(record[1], record[0], record[2]);
        }).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
