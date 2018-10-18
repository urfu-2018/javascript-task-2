'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Set();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    email = email || '';
    if (!isDataCorrect(phone, name, email)) {
        return false;
    }
    if (searchInBook(phone).length !== 0) {
        return false;
    }
    phoneBook.add(`${name};${phone};${email}`);

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
    email = email || '';
    if (!isDataCorrect(phone, name, email)) {
        return false;
    }
    const founded = searchInBook(phone)[0];
    if (!founded) {
        return false;
    }
    phoneBook.delete(founded);
    phoneBook.add(`${name};${phone};${email}`);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string' || !query) {
        return 0;
    }
    const founded = searchInBook(query);
    founded.forEach(item => phoneBook.delete(item));

    return founded.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }

    if (query === '*') {
        return correctOutput([...phoneBook]);
    }

    return correctOutput(searchInBook(query));
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

    const items = csv.split('\n').map(item => item.split(';'));
    let importedCount = 0;
    items.forEach(item => {
        let [name, phone, email] = item;
        email = email || '';
        if (!add(phone, name, email)) {
            if (update(phone, name, email)) {
                importedCount++;
            }
        } else {
            importedCount++;
        }
    });

    return importedCount;
}

function isDataCorrect(phone, name, email) {
    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
        return false;
    }
    if (!name) {
        return false;
    }

    return /^[0-9]{10}$/.test(phone);
}

function searchInBook(query) {
    const founded = [];
    phoneBook.forEach(value => {
        if (value.indexOf(query) !== -1) {
            founded.push(value);
        }
    });

    return founded;
}

function correctOutput(array) {
    return array.map(item => {
        const data = item.split(';');

        return `${data[0]}, ${getFullPhone(data[1])}${data[2] ? ', ' + data[2] : ''}`;
    }).sort();
}

function getFullPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
