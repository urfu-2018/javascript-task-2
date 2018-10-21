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
    if (!validatePhoneNumber(phone) || !validateName(name) || contactExist(phone)) {
        return false;
    }

    phoneBook[phone] = {
        email: validateEmail(email) ? email : '',
        name
    };

    return true;
}

function contactExist(phone) {
    return Object.keys(phoneBook).some(item => phone === item);
}

function validatePhoneNumber(phone) {
    return phone && typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function validateName(name) {
    return name && typeof name === 'string';
}
function validateEmail(email) {
    return email && typeof email === 'string';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!validatePhoneNumber(phone) || !validateName(name)) {
        return false;
    }

    phoneBook[phone] = {
        name,
        email: validateEmail(email) ? email : ''
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
    return phone.replace('/[()- ]/g', '')
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
    if (!query || typeof query !== 'string') {
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
            const nameA = a.split(',')[0];
            const nameB = b.split(',')[0];

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
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    const contacts = csv.split('\n');

    return contacts.reduce((count, contact) => {
        const [name, phone, email] = contact.split(';');
        const isUpdated = update(phone, name, email);

        return isUpdated ? ++count : count;
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
