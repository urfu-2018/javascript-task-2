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

    // Проверить валидность входных данных
    if (!validateInput(phone, name, email) || getEntryByPhone(phone) !== undefined) {
        return false;
    }

    // Добавить запись в телефонную книгу
    const phoneBookEntry = createPhoneBookEntry(phone, name, email);
    phoneBook.push(phoneBookEntry);

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

    // Проверить валидность входных данных
    let entry = getEntryByPhone(phone);
    if (!validateInput(phone, name, email) || entry === undefined) {
        return false;
    }

    // Обновить данные записи
    entry.name = name;
    if (email === undefined) {
        delete entry.email;
    } else {
        entry.email = email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {

    // Найти все подходящие записи
    const matchingEntries = findMatchingEntries(query);

    // Удалить каждую из найденных записей из книги
    for (let entry of matchingEntries) {
        phoneBook.splice(phoneBook.indexOf(entry), 1);
    }

    return matchingEntries.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {

    // Найти все подходящие записи
    const matchingEntries = findMatchingEntries(query);

    return matchingEntries.map(toString).sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {

    // Парсим csv и составляем список записей
    const entries = parseCsv(csv);

    return importEntries(entries);
}

/*
 * Проверить валидность входных данных
 */
function validateInput(phone, name, email) {

    if (!validatePhone(phone) || !validateName(name) || !validateEmail(email)) {
        return false;
    }

    return true;
}

/*
 * Проверить валидность номера телефона
 */
function validatePhone(phone) {

    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

/*
 * Проверить валидность имени
 */
function validateName(name) {

    return typeof name === 'string' && name.length !== 0;
}

/*
 * Проверить валидность электронной почты
 */
function validateEmail(email) {

    return email === undefined || typeof email === 'string';
}

/*
 * Создать запись для телефонной книги
 */
function createPhoneBookEntry(phone, name, email) {

    const phoneBookEntry = {
        phone,
        name
    };
    if (email !== undefined) {
        phoneBookEntry.email = email;
    }

    return phoneBookEntry;
}

/*
 * Получить запись из телефонной книги по ключу
 */
function getEntryByPhone(phone) {

    return phoneBook.find((element) => {
        return element.phone === phone;
    });
}

/*
 * Поиск записей-объектов по запросу в телефонной книге
 */
function findMatchingEntries(query) {

    // Пустой запрос не должен ничего находить
    if (query.length === 0) {
        return [];
    }

    // Если запрос состоит из единственного символа '*', подходят все записи
    if (query === '*') {
        return phoneBook.slice();
    }

    // Иначе ищем записи, поля которых содержат запрос в качестве подстроки
    const matchingEntries = [];
    for (let entry of phoneBook) {
        if (contains(entry, query)) {
            matchingEntries.push(entry);
        }
    }

    return matchingEntries;
}

/*
 * Проверяет, содержит ли данная запись запрос в качестве подстроки некоторого поля
 */
function contains(entry, query) {

    for (let field of Object.keys(entry)) {
        if (entry[field].includes(query)) {
            return true;
        }
    }

    return false;
}

/*
 *  Получить строковое представление записи из телефонной книги
 */
function toString(entry) {

    // Преобразовать телефон в нужный формат
    const phoneRegex = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    const phoneFormatted = entry.phone.replace(phoneRegex, '+7 ($1) $2-$3-$4');

    // Составить список полей в нужном порядке
    const entryFields = [entry.name, phoneFormatted];
    if ('email' in entry) {
        entryFields.push(entry.email);
    }

    return entryFields.join(', ');
}

/*
 * Получить записи из формата csv
 */
function parseCsv(csv) {

    const csvEntries = csv.split('\n');
    const entries = [];
    for (let csvEntry of csvEntries) {
        const entryFields = csvEntry.split(';');
        const entry = createPhoneBookEntry(entryFields[1], entryFields[0], entryFields[2]);
        entries.push(entry);
    }

    return entries;
}

/*
 * Импортировать записи в телефонную книгу
 */
function importEntries(entries) {

    let entriesImported = 0; // Счётчик импортированных записей

    // Обновление телефонной книги
    for (let entry of entries) {
        let result;
        // Если такой записи ещё не существует, добавляем её
        result = getEntryByPhone(entry.phone) === undefined
            ? add(entry.phone, entry.name, entry.email)
            : update(entry.phone, entry.name, entry.email);

        // Если операция успешна, увеличить счётчик
        if (result === true) {
            entriesImported++;
        }
    }

    return entriesImported;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
