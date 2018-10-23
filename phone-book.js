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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhone(phone) || !isValidContactParam(name) || phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = {
        email: isValidContactParam(email) ? email : '',
        name
    };

    return true;
}

function isValidPhone(phone) {
    return phone && typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isValidContactParam(param) {
    return param && typeof param === 'string' && param !== '';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isValidPhone(phone) || !isValidContactParam(name) || !phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = {
        email: isValidContactParam(email) ? email : '',
        name
    };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const items = find(query);

    return items.reduce((count, item) => {
        const phone = getBaseFormatPhone(item.split(', ')[1]);
        delete phoneBook[phone];

        return ++count;
    }, 0);
}

function getBaseFormatPhone(phone) {
    return phone.replace(/[() -]/g, '')
        .replace('+7', '');
}

function getFormatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isValidContactParam(query)) {
        return [];
    }

    return Object.keys(phoneBook)
        .reduce((result, phone) => {
            const { email, name } = phoneBook[phone];
            if (query === '*' ||
                phone.includes(query) ||
                name.includes(query) ||
                email.includes(query)
            ) {
                result.push(`${name}, ${getFormatPhone(phone)}${email ? ', ' + email : ''}`);
            }

            return result;
        }, [])
        .sort((a, b) => {
            const nameA = a.split(',')[0].trim();
            const nameB = b.split(',')[0].trim();

            return nameA.localeCompare(nameB);
        });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!isValidContactParam(csv)) {
        return 0;
    }
    const contacts = csv.split('\n');

    return contacts.reduce((count, contact) => {
        const [name, phone, email] = contact.split(';');
        const isUpdated = update(phone, name, email);
        const isAdded = add(phone, name, email);

        return isUpdated || isAdded ? ++count : count;
    }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
