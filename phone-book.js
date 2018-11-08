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
    if (!name ||
        !/^[0-9]{10}$/.test(phone) ||
        phoneBook.some(bookRecord => bookRecord.phone === phone)) {
        return false;
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

    let isFound = false;
    phoneBook = phoneBook.map(bookRecord => {
        if (bookRecord.phone === phone) {
            bookRecord = { phone, name, email };
            isFound = true;
        }

        return bookRecord;
    });

    return isFound;
}

function filterBook(bookRecord, query) {
    return query === '*' || bookRecord.phone.includes(query) ||
        bookRecord.name.includes(query) ||
        bookRecord.email !== undefined && bookRecord.email.includes(query);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let deletedCount = 0;
    if (query === '') {
        return deletedCount;
    }
    const result = phoneBook
        .map((bookRecord, index) => ({ bookRecord, index }))
        .filter(indexedRecord => filterBook(indexedRecord.bookRecord, query));
    for (let i = 0; i < result.length; i++) {
        phoneBook.splice(result[i].index - i, 1);
        deletedCount++;
    }

    return deletedCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {
        return [];
    }

    return phoneBook.filter(bookRecord => filterBook(bookRecord, query))
        .map(bookRecord => {
            let firstPart = bookRecord.phone.slice(0, 3);
            let secondPart = bookRecord.phone.slice(3, 6);
            let thirdPart = bookRecord.phone.slice(6, 8);
            let forthPart = bookRecord.phone.slice(8, 10);
            const phone = `+7 (${firstPart}) ${secondPart}-${thirdPart}-${forthPart}`;

            return { name: bookRecord.name, phone: phone, email: bookRecord.email };
        })
        .sort((firstRecord, secondRecord) => firstRecord.name.localeCompare(secondRecord.name))
        .map(bookRecord => Object.values(bookRecord)
            .filter(recordValue => recordValue !== undefined)
            .join(', '));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let count = 0;
    csv.split('\n').forEach(line => {
        let [name, phone, email] = line.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            count++;
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
