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

class Contact {
    constructor(phone, name, email) {
        this.phone = phone;
        this.name = name;
        this.email = email;
    }

    toString() {
        const number = [];
        number.push(this.phone.slice(0, 3));
        number.push(this.phone.slice(3, 6));
        number.push(this.phone.slice(6, 8));
        number.push(this.phone.slice(8, 10));
        const phone = `+7 (${number[0]}) ${number[1]}-${number[2]}-${number[3]}`;
        const email = ((typeof this.email === 'undefined') ||
            this.email === '') ? '' : `, ${this.email}`;

        return `${this.name}, ${phone}${email}`;
    }
}

const sortNamesLexicographical = (l, r) => {
    return l.name.localeCompare(r.name);
};

function checkPhone(phone) {
    return (typeof phone === 'string') && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!((typeof name === 'string') &&
        (name.length > 0) && checkPhone(phone))) {
        return false;
    }
    if (phoneBook.some(e => e.phone === phone)) {
        return false;
    }
    phoneBook.push(new Contact(phone, name, email));

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
    if (!checkPhone(phone)) {
        return false;
    }
    const found = phoneBook.filter(e => e.phone === phone);
    if (found.length === 0) {
        return false;
    }
    found.forEach(e => {
        if (typeof email === 'string' && email.length === 0) {
            e.email = undefined;
        } else {
            e.email = email;
        }
        if ((typeof name === 'string') && name.length > 0) {
            e.name = name;
        }
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!((typeof query === 'string') && query.length > 0)) {
        return 0;
    }
    const found = search(query);
    for (let i = 0; i < phoneBook.length; i++) {
        if (found.includes(phoneBook[i])) {
            phoneBook.splice(i, 1);
        }
    }

    return found.length;
}

function search(query) {
    if (query === '*') {
        return phoneBook.slice();
    }
    if (!(typeof query === 'string') || (query.length === 0)) {
        return [];
    }

    return phoneBook.filter(e => e.phone.includes(query) ||
            e.name.includes(query) ||
            (typeof e.email === 'undefined' ? false : e.email.includes(query)));
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!((typeof query === 'string') && query.length > 0)) {
        return [];
    }

    return search(query)
        .sort(sortNamesLexicographical)
        .map(_ => _.toString());
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!(typeof csv === 'string' && csv.length > 0)) {
        return 0;
    }
    const contacts = csv.split('\n');
    const fields = [];
    contacts.forEach(e => fields.push(e.split(';')));
    let count = 0;
    fields.forEach(e => {
        if (update(e[1], e[0], e[2]) || add(e[1], e[0], e[2])) {
            count += 1;
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
