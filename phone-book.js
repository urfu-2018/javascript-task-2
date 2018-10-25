'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkEmptyString(name)) {
        return false;
    }
    if (checkEmptyString(phone)) {
        return false;
    }
    if (!((/^\d{10}$/).test(phone))) {
        return false;
    }
    if (Object.keys(phoneBook).includes(phone)) {
        return false;
    }
    if (checkEmptyString(email)) {
        phoneBook[phone] = { name: name };
    }
    phoneBook[phone] = { name: name, email: email };

    return true;
}

function checkEmptyString(str) {
    if (str === undefined ||
         typeof(str) !== 'string' || str.length === 0) {
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
    if (checkEmptyString(name)) {
        return false;
    }
    if (checkEmptyString(phone)) {
        return false;
    }
    if (email === undefined) {
        phoneBook[phone].name = name;
        delete phoneBook[phone].email;

        return true;
    }
    phoneBook[phone].name = name;
    phoneBook[phone].email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (checkEmptyString(query)) {
        return 0;
    }
    let count = 0;
    if (query === '*') {
        const res = phoneBook.length;
        deleteAll();

        return res;
    }
    for (let phone in phoneBook) {
        if (phoneBook.hasOwnProperty(phone)) {
            count = count +
             deleteContact(phone, phoneBook[phone].name, phoneBook[phone].email, query);
        }
    }

    return count;
}

function deleteAll() {
    for (let ph in phoneBook) {
        if (phoneBook.hasOwnProperty(ph)) {
            delete phoneBook[ph];
        }
    }
}

function deleteContact(phone, name, email, query) {
    let count = 0;
    if (phone.indexOf(query) > -1) {
        delete phoneBook[phone];
        count = 1;
    } else if (name.indexOf(query) > -1) {
        delete phoneBook[phone];
        count = 1;
    } else if (email !== undefined &&
         email.indexOf(query) > -1) {
        delete phoneBook[phone];
        count = 1;
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (checkEmptyString(query)) {
        return [];
    }
    if (query === '*') {
        return pushAll();
    }

    return findQuery(query);
}

function findQuery(query) {
    let tmpAnswer = [];
    let answer = [];
    for (let phone in phoneBook) {
        if (phoneBook.hasOwnProperty(phone)) {
            tmpAnswer.push(pushContact(phone, query));
        }
    }
    for (let i = 0; i < tmpAnswer.length; i++) {
        if (tmpAnswer[i] !== '') {
            answer.push(tmpAnswer[i]);
        }
    }

    return answer.sort();
}

function pushContact(phone, query) {
    let answer = '';
    if (phone.indexOf(query) > -1) {
        answer = (contactAsString(phoneBook[phone], phone));
    } else if (phoneBook[phone].name.indexOf(query) > -1) {
        answer = (contactAsString(phoneBook[phone], phone));
    } else if (phoneBook[phone].email !== undefined &&
        phoneBook[phone].email.indexOf(query) > -1) {
        answer = (contactAsString(phoneBook[phone], phone));
    }

    return answer;
}

function pushAll() {
    let answer = [];
    for (var ph in phoneBook) {
        if (phoneBook.hasOwnProperty(ph)) {
            answer.push(contactAsString(phoneBook[ph], ph));
        }
    }

    return answer.sort();
}

function changePhoneFormat(phone) {
    let result = '+7 (' + phone.substring(0, 3) +
     ') ' + phone.substring(3, 6) +
      '-' + phone.substring(6, 8) +
       '-' + phone[8] + phone[9];

    return result;
}

function contactAsString(contact, phone) {
    var result = contact.name + ', ' + changePhoneFormat(phone);
    if (contact.email !== undefined) {
        result += ', ' + contact.email;
    }

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (checkCSV(csv) === 0) {
        return 0;
    }
    const arrwithoutN = csv.split('\n');
    let newLength = 0;
    for (let i = 0; i < arrwithoutN.length; i++) {
        const line = arrwithoutN[i].split(';');
        const name = line[0];
        const phone = line[1];
        const email = line[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            newLength++;
        }
    }

    return newLength;
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
}

function checkCSV(csv) {
    if (csv === undefined || typeof(csv) !== 'string' || csv === '') {
        return 0;
    }
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
