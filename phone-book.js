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

function phoneIsCorrect(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function checkAndCorrect(phone, name, email, include) {
    if (!correctNameAndPhone(name, phone)) {
        return false;
    }
    if (include) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return false;
}
/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    return checkAndCorrect(phone, name, email, !phoneBook[phone]);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    return checkAndCorrect(phone, name, email, phoneBook[phone]);
}

function reformatPhone(formattedPhone) {
    return `${formattedPhone.slice(4, 7)}${formattedPhone.slice(9, 12)}` +
        `${formattedPhone.slice(13, 15)}${formattedPhone.slice(16, 18)}`;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return getProperties(query).map(phone => delete phoneBook[phone]).length;
}

function getProperties(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook)
        .filter(phone => propertiesIncludes(phone, query));
}

function find(query) {
    return getProperties(query)
        .sort(sortByName)
        .map(contactView);
}

function checkSpecialSymbols(query) {
    if (query === '') {
        return '/^[0-9a-z_]+$/i;';
    } 
    return query;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return getProperties(query)
        .sort(sortByName)
        .map(contactView);
}

function contactView(phone) {
    return [phoneBook[phone].name, phoneView(phone),
        phoneBook[phone].email].filter(Boolean).join(', ');
}

function sortByName(x, y) {
    return phoneBook[x].name > phoneBook[y].name;
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
    if (!csv || typeof csv !== 'string') {
        return 0;
    }

    return csv.split('\n')
        .map(contact => {
            const [name, phone, email] = contact.split(';');
            if (phoneBook[phone]) {
                return update(phone, name, email);
            }

            return add(phone, name, email);
        })
        .filter(Boolean)
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
