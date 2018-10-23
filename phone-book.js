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
    if (!isCorrectPhoneNumber(phone) || !isCorrectName(name) || isAlreadyExist(phone)) {
        return false;
    }
    phoneBook.push({ phone: phone, name: name, email: email || '' });

    return true;
}

function isCorrectPhoneNumber(phone) {
    return typeof(phone) === 'string' && phone.length === 10 && /^\d{10}$/.test(phone);
}

function isCorrectName(name) {
    return typeof(name) === 'string' && name !== '';
}

function isAlreadyExist(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
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
    if (!isCorrectPhoneNumber || !isCorrectName) {
        return false;
    }
    var index = getIndex(phone);
    if (index !== -1) {
        phoneBook[index].name = name;
        phoneBook[index].email = email || '';

        return true;
    }

    return false;
}

function getIndex(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    var foundRecords = find(query);


    foundRecords.forEach(record => {
        var phone = reformatPhoneNumber(record.split(', ')[1]);
        phoneBook.forEach(element => {
            if (element.phone === phone) {
                phoneBook.pop(element);
            }
        });
    });

    return foundRecords.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '*') {
        return phoneBook.sort(compareRecordNames).map(formatRecord);
    }
    if (query === '' || query === undefined) {
        return [];
    }

    return phoneBook.sort(compareRecordNames)
        .filter(record =>
            record.name.includes(query) || record.phone.includes(query) ||
            record.email.includes(query))
        .map(formatRecord);
}

function compareRecordNames(a, b) {
    return a.name.localeCompare(b.name);
}

function formatRecord(record) {
    var number = formatPhoneNumber(record.phone);
    var output = [record.name, number];
    if (record.email !== '') {
        output.push(record.email);
    }

    return output.join(', ');
}

function formatPhoneNumber(phone) {
    // var arr = /^(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
    // return format: +7 (555) 333-00-33
    const p1 = phone.slice(0, 3);
    const p2 = phone.slice(3, 6);
    const p3 = phone.slice(6, 8);
    const p4 = phone.slice(8, 10);

    return `+7 (${p1}) ${p2}-${p3}-${p4}`;
}

function reformatPhoneNumber(phone) {
    // return format: 5553330033

    return `${phone.slice(4, 7)}${phone.slice(9, 12)}${phone.slice(13, 15)}${phone.slice(16, 18)}`;
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
    // На выходе метод возвращает одно число добавленных/обновленных записей

    if (typeof(csv) !== 'string') {
        return 0;
    }
    var count = 0;
    var records = csv.split('\n');
    records.forEach(record => {
        var data = record.split(';');
        var name = data[0];
        var phone = data[1];
        var email = data[2];
        if (add(phone, name, email)) {
            count++;
        } else if (update(phone, name, email)) {
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
