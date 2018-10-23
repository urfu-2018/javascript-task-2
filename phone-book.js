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
    if (!name || name.trim() === '' || !/^[0-9]{10}$/.test(phone)) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    phoneBook.push({ phone: phone, name: name, email: email });

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
    if (!name || name.trim() === '') {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = { phone: phone, name: name, email: email };

            return true;
        }
    }

    return false;
}

function filterBook(query) {
    return x => query !== '' && (query === '*' || x.phone.includes(query) ||
        x.name.includes(query) ||
        x.email !== undefined && x.email.includes(query));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const result = phoneBook.filter(filterBook(query)).map((x, i) => i);
    for (let i = 0; i < result.length; i++) {
        phoneBook.splice(i, 1);
    }

    return result.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const result = phoneBook.filter(filterBook(query))
        .map(x => {
            const phone = `+7 (${x.phone.slice(0, 3)}) ${x.phone.slice(3, 6)}-` +
                `${x.phone.slice(6, 8)}-${x.phone.slice(8, 10)}`;

            return { name: x.name, phone: phone, email: x.email };
        })
        .sort((x, y) => x.name.localeCompare(y.name))
        .map(x => Object.values(x).filter(y => y !== undefined)
            .join(', ')
        );

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let count = 0;
    const lines = csv.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const strings = lines[i].split(';');
        let email = strings[2];
        let phone = strings[1];
        let name = strings[0];
        if (!add(phone, name, email) &&
            !update(phone, name, email)) {
            continue;
        }
        count++;
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
