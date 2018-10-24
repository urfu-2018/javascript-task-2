'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = new Map();


const isParamsCorrect = (phone, name) => {
    if (typeof phone !== 'string' || typeof name !== 'string' || name === '') {
        return false;
    }
    let isPhoneCorrect = /^\d{10}$/.test(phone);

    return isPhoneCorrect;
};

const convertAnswer = userInf => {
    return `${userInf.name}, +7 (${
        userInf.phone.slice(0, 3)
    }) ${
        userInf.phone.slice(3, 6)
    }-${userInf.phone.slice(6, 8)}-${userInf.phone.slice(8, 10)}` +
        String(userInf.email !== undefined ? `, ${userInf.email}` : '');
};

const getContacts = () => {
    const res = [];
    phoneBook.forEach((value, key) => {
        let { email, name } = value;
        res.push({ name, phone: key, email });
    });

    return res.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isParamsCorrect(phone, name) || phoneBook.has(phone)) {
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
    if (!(phoneBook.has(phone)) && !isParamsCorrect(phone, name)) {
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
    if (typeof query !== 'string' || query === '') {
        return 0;
    }

    let contactsToDelete = [];
    const queryRegExp = new RegExp(query === '*' ? '' : query);
    getContacts().forEach(item => {
        if (queryRegExp.test(item.name) ||
            queryRegExp.test(item.phone) ||
            queryRegExp.test(item.email) ||
            query === '*'
        ) {
            contactsToDelete.push(item.phone);
        }
    });
    contactsToDelete.forEach(item => phoneBook.delete(item));

    return contactsToDelete.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    let res = [];
    const queryRegExp = new RegExp(query === '*' ? '' : query);
    getContacts().forEach(item => {
        if (queryRegExp.test(item.name) ||
            queryRegExp.test(item.phone) ||
            queryRegExp.test(item.email) ||
            query === '*'
        ) {
            res.push(convertAnswer(item));
        }
    });

    return res;
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
