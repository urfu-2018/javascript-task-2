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
    phoneBook.set(phone, { name: name, phone: phone });
    if (email) {
        phoneBook.set(phone, { name: name, phone: phone, email: email });
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
    if (!(isString(query) && query)) {
        return 0;
    }
    if (query === '*') {
        let count = phoneBook.size;
        phoneBook.clear();

        return count;
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
    if (!(isString(query) && query)) {
        return [];
    }
    if (query === '*') {
        return sortedBook()
            .map(x=> formatForOutput(x));
    }

    return findQueryInSorted(query)
        .map(x=>formatForOutput(x));

}


function findQueryInSorted(query) {
    return sortedBook().filter(x => {
        return x.name.indexOf(query) + 1 ||
            x.phone.indexOf(query) + 1 ||
            (x.email && x.email.indexOf(query) + 1);
    });
}

function formatForOutput(note) {
    if (!note.email) {
        return note.name + ', ' + rightFormatForPhone(note.phone);
    }

    return note.name + ', ' + rightFormatForPhone(note.phone) + ', ' + note.email;
}
function sortedBook() {
    return [...phoneBook.values()]
        .sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
}

function rightFormatForPhone(phone) {
    return '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) +
        '-' + phone.slice(8, 10);
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
        .map(x=>x.split(';'));
    let count = 0;
    for (let i = 0; i < notes.length; i++) {
        if (phoneBook.has(notes[i][1])) {
            count = update(notes[i][1], notes[i][0], notes[i][2]) ? count + 1 : count;
        } else {
            count = add(notes[i][1], notes[i][0], notes[i][2]) ? count + 1 : count;
        }
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
