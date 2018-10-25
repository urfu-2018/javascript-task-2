'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();


function match(phone, name, email) {
    for (let key in phoneBook.keys()) {
        if ((phoneBook[key].username === name &&
            key === phone &&
            phoneBook[key].useremail === email) || key === phone) {

            return true;
        }
    }
}

function add(phone, name, email) {
    if (phone.match(/^\d+$/) !== null &&
        phone.length === 10 &&
        name !== undefined) {
        if (phoneBook === undefined) {
            phoneBook = new Map();
        }
        if (match(phone, name, email)) {

            return false;
        }
        let user = {
            username: name,
            useremail: email
        };
        phoneBook.set(phone, user);

        return true;
    }

    return false;
}

function update(phone, name, email) {
    if (phoneBook.has(phone)) {
        if (name !== undefined) {
            let user = {
                username: name,
                useremail: email
            };
            phoneBook.set(phone, user);
        }
    }
}

function findAndRemove(query) {
    let findres = find(query);
    let val;
    for (val of findres) {
        let key = val[1].replace(/(\d{3})\) (\d{3})-(\d{2})-(\d{2})/, '$1$2$3$4').substring(4);
        phoneBook.delete(key);
    }

    return findres.length;
}

function find(query) {
    if (query === '') {

        return;
    }
    let patt = query;
    if (query === '*') {
        patt = '';
    }
    let sorted = [...phoneBook.entries()]
        .sort((a, b) => a[1].username > b[1].username).map (function (val) {

            return [val[1].username,
                val[0].replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4'),
                val[1].useremail].filter(x => x !== undefined);
        });

    return sorted.filter(x => x.join('').includes(patt));
}

function importFromCsv(csv) {
    let users = csv.split('\n').map (function (val) {
        let arr = val.split(';');

        return [arr[1], arr[0], arr[2]];
    });
    let val;
    let counter = 0;
    for (val of users) {
        if (add(...val)) {
            counter++;
        }
    }

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
