'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!validationOfParameters(phone, name, email)) {
        return false;
    }

    if (typeof(email) === 'undefined') {
        email = '';
    }

    if (phoneBook.some(record => record.phone === phone)) {
        return false;
    }

    phoneBook.push({
        phone,
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
    if (!validationOfParameters(phone, name)) {
        return false;
    }

    if (typeof(email) === 'undefined') {
        email = '';
    }

    phoneBook.forEach(record => {
        if (record.phone === phone) {
            record.name = name;
            record.email = email;
        }
    });

    return true;
}

function validationOfParameters(phone, name) {
    if (typeof(phone) !== 'string' || typeof(name) !== 'string') {
        return false;
    }

    const regPhone = /^\d{10}$/;

    if (!regPhone.test(phone)) {
        return false;
    }

    if (name.length === 0) {
        return false;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof(query) === 'undefined' || query.length === 0) {
        return 0;
    }

    let countDeleteRecords;

    if (query === '*') {
        countDeleteRecords = phoneBook.length;
        phoneBook.slice(0, phoneBook.length);

        return countDeleteRecords;
    }

    const arrayRecords = find(query);
    countDeleteRecords = arrayRecords.length;

    arrayRecords.forEach(record => {
        phoneBook.slice(phoneBook.indexOf(record), 1);
    });

    return countDeleteRecords;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof(query) === 'undefined' || query.length === 0) {
        return [];
    }

    if (query === '*') {
        return searchRecords(phoneBook);
    }

    return searchRecords(phoneBook
        .filter(note => {
            for (let key in note) {
                if (note[key].includes(query)) {
                    return true;
                }
            }

            return false;
        }));
}

function searchRecords(arrayRecords) {
    return arrayRecords
        .sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        .map(record => {
            if (record.email.length === 0) {
                return `${record.name}, +7 (${record.phone.substr(0, 3)}) ${record.phone.substr(3,
                    3)}-${record.phone.substr(6, 2)}-${record.phone.substr(8, 2)}`;
            }

            return `${record.name}, +7 (${record.phone.substr(0, 3)}) ${record.phone.substr(3,
                3)}-${record.phone.substr(6, 2)}-${record.phone.substr(8, 2)}, ${record.email}`;
        });
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
    if (typeof(csv) !== 'string') {
        return 0;
    }

    const records = csv.split('\n').map(value => value.split(';'));
    let numberOfRecordsAdded = 0;

    records.forEach(value => {
        const [name, phone, email] = value;

        if (add(phone, name, email) || update(phone, name, email)) {
            numberOfRecordsAdded++;
        }
    });

    return numberOfRecordsAdded;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
