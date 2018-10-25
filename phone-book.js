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

function check(phone, name) {
    const regextel = /^\d{10}$/;

    return typeof phone !== 'string' || !phone.match(regextel) ||
    name === undefined ||
    name === '' ||
    phoneBook.some((rec)=>rec.tel === phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    let record;
    if (check(phone, name)) {
        return false;
    }
    if (email !== undefined) {
        record = { name: name, tel: phone, email: email };
    } else {
        record = { name: name, tel: phone };
    }
    phoneBook.push(record);

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
    const regextel = /^\d{10}$/;
    let ind = phoneBook.findIndex(x => x.tel === phone);
    if (ind === -1 || name === undefined || name === '' || !phone.match(regextel)) {
        return false;
    }
    if (email !== undefined) {
        phoneBook[ind] = { name: name, tel: phone, email: email };
    } else {
        phoneBook[ind] = { name: name, tel: phone };
        delete phoneBook[ind].email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let stroka = query;
    if (stroka === undefined || stroka === '') {
        return [];
    }
    if (stroka === '*') {
        stroka = '';
    }
    let itt = 0;
    let search = phoneBook.filter(function (rec) {
        if (rec.hasOwnProperty('email')) {
            return (rec.tel.indexOf(stroka)) !== -1 ||
            (rec.name.indexOf(stroka)) !== -1 ||
            (rec.email.indexOf(stroka) !== -1);
        }

        return ((rec.tel.indexOf(stroka)) !== -1 ||
    (rec.name.indexOf(stroka) !== -1));
    });
    phoneBook = phoneBook.filter(function (rec) {
        return !search.some(function (recsearch) {
            if (rec === recsearch) {
                itt++;

                return true;
            }

            return false;
        });
    });

    return itt;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let stroka = query;
    if (stroka === undefined || stroka === '') {
        return [];
    }
    if (stroka === '*') {
        stroka = '';
    }
    let search = phoneBook.filter(function (rec) {
        if (rec.hasOwnProperty('email')) {
            return (rec.tel.indexOf(stroka)) !== -1 ||
        (rec.name.indexOf(stroka)) !== -1 ||
        (rec.email.indexOf(stroka) !== -1);
        }

        return ((rec.tel.indexOf(stroka)) !== -1 ||
        (rec.name.indexOf(stroka) !== -1));
    }).sort(function (a, b) {
        return a.name.localeCompare(b.name);

    });
    let resultat = search.map(function (rec) {
        let telprob = '+7 (' + rec.tel.slice(0, 3) + ') ' +
    rec.tel.slice(3, 6) + '-' + rec.tel.slice(6, 8) +
    '-' + rec.tel.slice(8, 10);
        let resulstr = [rec.name, telprob];
        if (rec.email !== undefined) {
            resulstr.push(rec.email);

            return (resulstr.join(', '));
        }

        return resulstr.join(', ');
    });

    return resultat;
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
    let recs = csv.split('\n');
    let count = 0;
    for (let i = 0; i < recs.length; i++) {
        let rec = recs[i].split(';');
        if (add(rec[1], rec[0], rec[2]) || update(rec[1], rec[0], rec[2])) {
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
