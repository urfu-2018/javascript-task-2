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
    const initialPhoneBookLen = phoneBook.size;
    phoneBook.forEach(({ name, email }, phone) => {
        if (checkIfQueryInRecord(phone, name, email, query)) {
            phoneBook.delete(phone);
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
    const result = [];
    phoneBook.forEach(({ name, email }, phone) => {
        if (checkIfQueryInRecord(phone, name, email, query)) {
            const formatedPhone =
                `+7 (${phone.substr(0, 3)}) ${phone.substr(3, 3)}-` +
                `${phone.substr(6, 2)}-${phone.substr(8, 2)}`;
            result.push(`${name}, ${formatedPhone}` + (email ? `, ${email}` : ''));
        }
    });

    return result.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String[]} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let n = 0;
    for (const line of csv.split('\n')) {
        const [name, phone, email] = line.split(';');
        if (phoneBook.has(phone)) {
            n += update(phone, name, email) ? 1 : 0;
        } else {
            n += add(phone, name, email) ? 1 : 0;
        }
    }

    return n;
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

/**
 * Проверяет на то что query содержиться хотя бы в одном поле
 * @param {String} phone
 * @param {String} name
 * @param {String?} email
 * @param {String?} query
 * @returns {Boolean}
 */
function checkIfQueryInRecord(phone, name, email, query) {
    return (
        query &&
        (query === '*' ||
            phone.includes(query) ||
            name.includes(query) ||
            (email && email.includes(query)))
    );
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
