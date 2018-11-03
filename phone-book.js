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

function buildPhoneBookRecord(phone, name, email) {
    return {
        phone: phone,
        name: name,
        email: email
    };
}

function findIndexOfPhone(phone) {
    return phoneBook
        .findIndex(record => record.phone === phone);
}

function containsInRecord(query, record) {
    return query === '*' ||
        record.phone.includes(query) ||
        record.name.includes(query) ||
        (record.email &&
        record.email.includes(query));
}

function isBadNameOrPhone(phone, name) {
    return !name || !isValidPhone(phone);
}

function isValidPhone(phone) {
    if (!phone) {
        return false;
    }
    const PHONE_REGEX = /^\d{10}$/;

    return PHONE_REGEX.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isBadNameOrPhone(phone, name)) {
        return false;
    }

    const indexOfRecord = findIndexOfPhone(phone);

    if (indexOfRecord !== -1) {
        return false;
    }

    phoneBook.push(buildPhoneBookRecord(phone, name, email));

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
    if (isBadNameOrPhone(phone, name)) {
        return false;
    }

    const indexOfRecord = findIndexOfPhone(phone);

    if (indexOfRecord === -1) {
        return false;
    }

    phoneBook[indexOfRecord] = buildPhoneBookRecord(phone, name, email);

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

    const prevLength = phoneBook.length;
    phoneBook = phoneBook
        .filter(record => !containsInRecord(query, record));

    return prevLength - phoneBook.length;
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

    const PHONE_REGEX = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

    return phoneBook
        .filter(record => containsInRecord(query, record))
        .sort((a, b) => {
            return a.name > b.name;
        })
        .map((record) => {
            const parts = record.phone.match(PHONE_REGEX);
            const phone = `+7 (${parts[1]}) ${parts[2]}-${parts[3]}-${parts[4]}`;
            let string = `${record.name}, ${phone}`;

            if (record.email) {
                string = string + `, ${record.email}`;
            }

            return string;
        });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let counter = 0;

    const records = csv.split(/[\r\n]+/);
    records.forEach(record => {
        const values = record.split(';');
        const [name, phone, email] = values;

        const result = add(phone, name, email) ||
            update(phone, name, email);

        if (result) {
            counter++;
        }
    });

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
