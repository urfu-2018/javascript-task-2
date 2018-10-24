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
function phoneValidation(phone) {
    return isString(phone) && /^\d{10}$/.test(phone);
}

function isString(parameter) {
    return typeof parameter === 'string';
}

function isCorrect(parameter) {
    return isString(parameter) && parameter.trim();
}

function checkDoubles(personPhone) {
    return phoneBook.findIndex(({ phone }) => phone === personPhone);
}

function add(phone, name, email) {
    if (phoneValidation(phone) && checkDoubles(phone) < 0 && isCorrect(name)) {
        phoneBook.push({ phone, name, email: isCorrect(email) || undefined });

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
    const index = checkDoubles(phone);

    if (index !== -1 && isCorrect(name)) {
        phoneBook[index] = { phone, name, email: isCorrect(email) || undefined };

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const initialLength = phoneBook.length;

    if (query === '*') {
        phoneBook.splice(0);

        return initialLength;
    }
    if (isCorrect(query)) {
        phoneBook = phoneBook.filter(
            ({ name, phone, email }) =>
                !(
                    name.search(query) + 1 ||
                    phone.search(query) + 1 ||
                    (email ? email.search(query) + 1 : false)
                )
        );

        return initialLength - phoneBook.length;
    }

    return 0;
}

function transformItem(item) {
    const { phone, name, email } = item;

    return (
        `${name}, ` +
        `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-` +
        `${phone.slice(6, 8)}-${phone.slice(8, 10)}` +
        `${email ? ', ' + email : ''}`
    );
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const clonePhoneBook = phoneBook.slice(0);

    if (query === '*') {
        return clonePhoneBook
            .sort(({ name }, { name: _name }) => name.localeCompare(_name))
            .map(person => transformItem(person));
    }
    if (isCorrect(query)) {
        return clonePhoneBook
            .filter(
                ({ name, phone, email }) =>
                    name.search(query) + 1 ||
                    phone.search(query) + 1 ||
                    (email ? email.search(query) + 1 : false)
            )
            .sort(({ name }, { name: _name }) => name.localeCompare(_name))
            .map(person => transformItem(person));
    }

    return [];
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let counter = 0;

    csv.split('\n').forEach(person => {
        const [name, phone, email] = person.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            counter += 1;
        }
    });

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
