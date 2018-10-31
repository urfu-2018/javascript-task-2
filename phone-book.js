'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();
let phoneRegExp = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isValidInput(name, phone, email) &&
        !phoneBook.has(phone)) {
        addNote(name, phone, email);

        return true;
    }

    return false;
}


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isValidInput(name, phone, email) &&
        phoneBook.has(phone)) {
        addNote(name, phone, email);

        return true;
    }

    return false;
}

function addNote(name, phone, email) {
    if (email) {
        phoneBook.set(phone, { name, phone, email });
    } else {
        phoneBook.set(phone, { name, phone });
    }
}

function isValidInput(name, phone, email) {
    return isCorrectPhone(phone) && isCorrectEmail(email) && isCorrectName(name);
}

function isCorrectName(name) {
    return name && isString(name);
}

function isCorrectEmail(email) {
    return typeof email === 'string' || email === undefined;
}

function isCorrectPhone(phone) {
    return phone && isString(phone) && (phoneRegExp).test(phone);
}

function isString(query) {
    return typeof query === 'string' && query !== '';
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isString(query) || !query) {
        return 0;
    }

    let found = findQueryInSorted(query);
    for (let i = 0; i < found.length; i++) {
        phoneBook.delete(found[i].phone);
    }

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || !query) {
        return [];
    }

    return findQueryInSorted(query)
        .map(formatNote);

}


function findQueryInSorted(query) {
    let isAll = query === '*';

    return sortedBook().filter(x => {
        return isAll ||
            x.name.includes(query) ||
            x.phone.includes(query) ||
            (x.email && x.email.includes(query));
    });
}

function formatNote(note) {
    if (note.email) {
        return `${note.name}, ${formatPhone(note.phone)}, ${note.email}`;
    }

    return `${note.name}, ${formatPhone(note.phone)}`;
}
function sortedBook() {
    return Array.from(phoneBook.values())
        .sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}` +
        `-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
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
    let notes = csv
        .split('\n')
        .map(x => x.split(';'));
    let _notes = notes.filter(x => {
        return update(x[1], x[0], x[2]) ||
            add(x[1], x[0], x[2]);
    });

    return _notes.length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
