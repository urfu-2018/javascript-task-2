'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = [];

function containsPhone(phone) {
    return phoneBook.some(contact => contact.phone === phone);
}

function validArguments(phone, name) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone) && name;
}

function toNewFormatPhone(phone) {
    return `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 8)}` +
        `-${phone.substring(8)}`;
}

function toFormat(phone, name, email) {
    if (typeof email === 'undefined') {
        return `${phone} ${name}`;
    }

    return `${phone} ${name} ${email}`;
}

function toDefaultFormat(phone) {
    return phone.substring(4).match(/\d/g)
        .join('');
}

function returnAllBook(sortBook) {

    /* const element = [];

    sortBook.map(contact => {
        const newPhone = toNewFormatPhone(contact.phone);

        if (!contact.email) {
            element.push(`${contact.name}, ${newPhone}`);
        } else {
            element.push(`${contact.name}, ${newPhone}, ${contact.email}`);
        }

        return element;
    });

    return element;*/

    return sortBook.map(contact => {
        const newPhone = toNewFormatPhone(contact.phone);
        let element;

        if (!contact.email) {
            element = (`${contact.name}, ${newPhone}`);
        } else {
            element = (`${contact.name}, ${newPhone}, ${contact.email}`);
        }

        return element;
    });
}

function findElement(query, sortBook) {
    return sortBook.map(contact => {
        const newPhone = toNewFormatPhone(contact.phone);
        const formatContact = toFormat(contact.phone, contact.name, contact.email);
        let element;

        if (formatContact.includes(query) && contact.email) {
            element = `${contact.name}, ${newPhone}, ${contact.email}`;
        } else if (formatContact.includes(query)) {
            element = `${contact.name}, ${newPhone}`;
        }

        return element;
    });
}

function removeElements(book) {
    return book.filter(contact => contact);
}

function sort() {
    const temp = phoneBook.slice();

    return temp.sort((contact, anotherContact) => contact.name > anotherContact.name ? 1 : 0);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!validArguments(phone, name) || containsPhone(phone)) {
        return false;
    }

    if (typeof email === 'undefined') {
        phoneBook.push({ phone, name });
    } else {
        phoneBook.push({ phone, name, email });
    }

    return true;
}

function contains(anotherContact) {
    return phoneBook.some(contact => contact.name === anotherContact.name &&
        contact.phone === anotherContact.phone && contact.email === anotherContact.email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!validArguments(phone, name)) {
        return false;
    }

    const newContact = { phone, name, email };

    if (contains(newContact)) {
        return false;
    }

    const index = phoneBook.findIndex(contact => contact.phone === phone);
    phoneBook[index] = newContact;

    return true;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let sortBook = [];

    if (!query) {
        return sortBook;
    }

    sortBook = sort();

    if (query === '*') {
        return removeElements(returnAllBook(sortBook));
    }

    return removeElements(findElement(query, sortBook));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string' || query === '') {
        return 0;
    }

    const contacts = find(query);

    for (let i = 0; i < contacts.length; i++) {
        const phone = toDefaultFormat(contacts[i].split(', ')[1]);
        const index = phoneBook.findIndex(contact => contact.phone === phone);

        if (index > -1) {
            phoneBook.splice(index, 1);
        }
    }

    return contacts.length;
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
    if (typeof csv !== 'string') {
        return 0;
    }

    const contacts = csv.split('\n');
    let count = 0;

    for (let i = 0; i < contacts.length; i++) {
        const data = contacts[i].split(';');
        const contact = {
            phone: data[1],
            name: data[0]
        };

        if (typeof data[2] !== 'undefined') {
            contact.email = data[2];
        }

        if (update(contact.phone, contact.name, contact.email) ||
            add(contact.phone, contact.name, contact.email)) {
            count++;
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
