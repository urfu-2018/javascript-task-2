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
function add(phone = '', name = '', email = '') {
    const validPhone = /^(\d)\1\1(\d)\2\2(\d)\3(\d)\4$/.test(phone);
    const contact = phoneBook[phone];

    if (!validPhone || !name || contact) {
        return false;
    }

    phoneBook[phone] = {
        phone,
        name,
        email
    };

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone = '', name = '', email = '') {
    const contact = phoneBook[phone];

    if (!contact || !name) {
        return false;
    }

    contact.name = name;
    contact.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const result = findAll(query);
    result.forEach(r => delete phoneBook[r.phone]);

    return result.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const result = findAll(query);

    return result.map(c => {
        let r = `${c.name}, ${toFullPhone(c.phone)}`;

        if (c.email) {
            r += `, ${c.email}`;
        }

        return r;
    });
}

function findAll(query) {
    if (!query) {
        return [];
    }

    let allContacts = Object.keys(phoneBook).map(p => phoneBook[p]);

    if (query !== '*') {
        const regEx = new RegExp(query);

        allContacts = allContacts.filter(c =>
            regEx.test(c.name) ||
            regEx.test(c.phone) ||
            regEx.test(c.email)
        );
    }

    allContacts.sort((a, b) => b.name > a.name ? -1 : 1);

    return allContacts;
}

function toFullPhone(phone) {
    const code = phone.substr(0, 3);

    return `+7 (${code}) ${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}`;
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
    csv.split('\n')
        .forEach(str => {
            const contactArray = str.split(';');
            const obj = {
                name: contactArray[0],
                phone: contactArray[1],
                email: contactArray[2]
            };

            phoneBook[obj.phone] = obj;
        });

    return csv.split('\n').length - 1;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
