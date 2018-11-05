'use strict';

class Record {
    constructor(name, phone, email) {
        this._name = name;
        this._convertedPhone = convertPhoneNumber(phone);
        this._email = email || '';
        this._phone = phone;
    }

    toString() {
        let result = this._name + ', ' + this._convertedPhone;
        if (this._email !== '') {
            result += ', ' + this._email;
        }

        return result;
    }

    contains(query) {
        return this._name.includes(query) ||
                this._phone.includes(query) ||
                this._email.includes(query);
    }
}

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    if (checkInputInfo(phone, name, email) && !phoneBook.has(phone)) {
        phoneBook.set(phone, new Record(name, phone, email));

        return true;
    }

    return false;
}

function checkInputInfo(phone, name, email) {
    const correctPhone = phoneIsCorrect(phone);

    return isName(name) && correctPhone && isEmail(email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (checkInputInfo(phone, name, email) && phoneBook.has(phone)) {
        // const newPerson = new Record(name, phone, email);
        // const oldPerson = phoneBook.get(phone);
        // if (personsEqual(newPerson, oldPerson)) {
        //     return false;
        // }
        phoneBook.set(phone, new Record(name, phone, email));

        return true;
    }

    return false;
}

// function personsEqual(per1, per2) {
//     if (per1._name === per2._name &&
//         per1._phone === per2._phone &&
//         per1._email === per2._email) {

//         return false;
//     }
// }

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const foundPersons = findPerson(query);
    foundPersons.map(person => phoneBook.delete(person._phone));

    return foundPersons.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const persons = findPerson(query);

    return persons.map(person => person.toString());
}

function findPerson(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }
    let persons = Array.from(phoneBook.values());
    persons.sort((a, b) => a._name > b._name);
    if (query === '*') {

        return persons;
    }

    return persons.filter((person) => person.contains(query));
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
function isEmail(email) {
    return typeof email === 'undefined' || typeof email === 'string';
}

function phoneIsCorrect(phone) {
    if (typeof phone !== 'string' || phone.length !== 10) {
        return false;
    }

    const correctPhone = /^(\d{3})(\d{3})(\d{2})(\d{2})$/; // 5556667788
    const match = phone.match(correctPhone);
    if (!match) {

        return false;
    }

    return true;
}

function convertPhoneNumber(phone) {
    const correctPhone = /^(\d{3})(\d{3})(\d{2})(\d{2})$/; // 5556667788
    const match = phone.match(correctPhone);

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`; // +7 (555) 666-77-88
}
function isName(name) {
    return typeof name === 'string' && name !== '';
}
module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
