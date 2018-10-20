'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkExistName(name) || !checkPhoneFormat(phone)) {
        return false;
    }
    if (!checkBookOfExist()) {
        phoneBook = {};
    }
    let note = email !== undefined ? {
        name: name,
        phone: phone,
        email: email
    }
        : {
            name: name,
            phone: phone
        };
    if (phone in phoneBook) {
        return false;
    }
    phoneBook[phone] = note;

    return true;
}

function checkPhoneFormat(phone) {
    return phone.search(/^[0-9]{10}$/i) === 0;
}

function checkBookOfExist() {
    return phoneBook !== undefined;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!checkBookOfExist() || !checkExistName(name) || !(phone in phoneBook)) {
        return false;
    }

    phoneBook[phone] = email !== undefined ? {
        name: name,
        phone: phone,
        email: email
    }
        : {
            name: name,
            phone: phone
        };

    return true;
}

function checkExistName(name) {
    return name !== undefined;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!checkBookOfExist() || !checkString(query)) {
        return 0;
    }
    let found = findQueryInSorted(query);
    for (let i = 0; i < found.length; i++) {
        delete(phoneBook[backToBadPhoneFormat(found[i].phone)]);
    }

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!checkBookOfExist() || !checkString(query)) {
        return [];
    }
    if (query === '*') {
        return sortedBook().map(formatForOutput);
    }

    return findQueryInSorted(query)
        .map(formatForOutput);

}

function checkString(query) {
    return typeof query === 'string';
}
function findQueryInSorted(query) {
    return sortedBook()
        .filter(x => {
            return x.name.includes(query) ||
                x.phone.includes(query) ||
                x.email.includes(query);
        });
}

function formatForOutput(note) {
    if (note.email === '' || note.email === undefined) {
        return note.name + ', ' + note.phone;
    }

    return note.name + ', ' + note.phone + ', ' + note.email;
}
function sortedBook() {
    let sorted = Object
        .keys(phoneBook)
        .map(x => phoneBook[x])
        .sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    return sorted
        .map(x => {
            return {
                name: x.name,
                phone: rightFormatForPhone(x.phone),
                email: x.email !== undefined ? x.email : ''
            };
        });
}

function rightFormatForPhone(phone) {
    return '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) +
        '-' + phone.slice(8, 10);
}

function backToBadPhoneFormat(phone) {
    return phone.slice(4, 7) + phone.slice(9, 12) + phone.slice(13, 16) + phone.slice(17, 20);
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
        if (notes[i][1] in phoneBook) {
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
