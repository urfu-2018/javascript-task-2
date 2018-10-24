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
const checkEmail = (email) => typeof email === 'string' && /^[\w,.\-+]+@\w+\.[a-z]+$/.test(email);
const checkPhone = (phone) => typeof phone === 'string' && /^\d{10}$/.test(phone);
const checkName = (name) => typeof name === 'string' && /^[a-zA-Zа-яА-ЯёЁ]+$/.test(name);
const transformePhoneBack = (phone) => phone.replace(/\+7 \(|\) |-/g, '');

function getContactData(contact) {
    let res = [];
    Object.keys(contact).forEach((key) => res.push(contact[key]));
    res[1] = transformPhone(res[1]);

    return res;
}

function transformPhone(phone) {
    let transformedPhone = '+7 (' + phone.slice(0, 3) + ') ';

    return transformedPhone.concat(
        [phone.slice(3, 6), phone.slice(6, 8), phone.slice(8, 10)].join('-'));
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkPhone(phone) || !checkName(name)) {
        return false;
    }
    if (phoneBook === undefined) {
        phoneBook = new Map();
    }
    if (phoneBook.get(phone) !== undefined) {
        return false;
    }
    let contact = {
        name,
        phone
    };
    if (checkEmail(email)) {
        contact.email = email;
    }
    phoneBook.set(phone, contact);

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
    if (phoneBook === undefined || !checkPhone(phone)) {
        return false;
    }
    let contact = phoneBook.get(phone);
    if (contact === undefined) {
        return false;
    }
    if (checkName(name)) {
        contact.name = name;
    }
    if (checkEmail(email)) {
        contact.email = email;
    } else {
        delete contact.email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (phoneBook === undefined) {
        return 0;
    }
    let finded = find(query).map((contact) => contact.split(', '));
    let count = 0;
    finded.forEach(
        (contact) => {
            if (phoneBook.delete(transformePhoneBack(contact[1]))) {
                count++;
            }
        });

    return count;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (phoneBook === undefined || typeof query !== 'string') {
        return [];
    }
    let result;
    if (query === '*') {
        result = Array.from(phoneBook.values())
            .map((contact) => getContactData(contact));
    } else {
        result = Array.from(phoneBook.values())
            .filter((contact) =>
                contact.phone.indexOf(query) !== -1 ||
                contact.name.indexOf(query) !== -1 ||
                (contact.email !== undefined &&
                    contact.email.indexOf(query) !== -1))
            .map((contact) => getContactData(contact));
    }

    return result.map((e) => e.join(', ')).sort();
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
    let count = 0;
    csv.split('\n').forEach((record) => {
        let splitted = record.split(';');
        if (phoneBook.get(splitted[1]) !== undefined) {
            if (update(splitted[1], splitted[0], splitted[2])) {
                count++;
            }
        } else if (add(splitted[1], splitted[0], splitted[2])) {
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
