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

function correctPhone(phone) {

    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function correctName(name) {

    return name && typeof name === 'string' && name.trim() !== '';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!correctPhone(phone) || !correctName(name) ||
    phoneBook.some(contact => contact.phone === phone)) {

        return false;
    }

    const contact = {
        phone: phone,
        name: name,
        email: email && typeof email === 'string' ? email : ''
    };

    phoneBook.push(contact);

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
    if (!correctName(name) ||
    !phoneBook.some(contact => contact.phone === phone)) {

        return false;
    }

    const index = phoneBook.findIndex(contact => contact.phone === phone);
    phoneBook[index].name = name;
    phoneBook[index].email = email && typeof email === 'string' ? email : '';

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const contactToRemove = queryPhoneBook(query);
    phoneBook.filter(contact => !contactToRemove.includes(contact));

    return contactToRemove.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {

    return formatPhoneBook(queryPhoneBook(query));
}

function queryPhoneBook(query) {

    if (query === '') {
        return [];
    }

    if (query === '*') {
        return phoneBook;
    }

    return phoneBook.filter(contact =>
        contact.name.includes(query) ||
        contact.phone.includes(query) ||
        contact.email.includes(query));
}

function formatPhoneBook(pBook) {
    let newContact = '';

    return pBook.reduce((acc, contact) => {
        newContact = contact.name + ', ' + formatPhoneNumber(contact.phone) +
         ((contact.email) ? ', ' + contact.email : '');

        return acc.concat(newContact);
    }, []).sort();
}

function formatPhoneNumber(phone) {
    const groups = /(\d{3})(\d{3})(\d{2})(\d{2})/.exec(phone);

    return `+7 (${groups[1]}) ${groups[2]}-${groups[3]}-${groups[4]}`;
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

    let count = 0;
    csv.split('\n').forEach(contact => {
        let [name, number, email] = contact.split(';');
        if (add(number, name, email) || update(number, name, email)) {
            count = count + 1;
        }
    });

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
