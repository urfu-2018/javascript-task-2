'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Проврека на корректность номера
 * @param {String} phone
 * @returns {Boolean}
 */
function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

/**
 * Индекс номера в phoneBook
 * @param {String} phone
 * @returns {Number}
 */
function getIndexOfPhone(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return i;
        }
    }

    return -1;
}

/**
 * Перевод из общей версии номера в Российский
 * @param {String} phone
 * @returns {String}
 */
function fromGlobToRus(phone) {
    return ('+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10));
}

/**
 * Проверка на входные данные
 * @param {String} phone
 * @param {String} name
 * @returns {Boolean}
 */
function isCorrectInput(phone, name) {

    return isCorrectPhone(phone) && typeof(name) !== 'undefined' && name !== '';
}

/**
 * Создание объекта контакта
 * @param {String} phone
 * @param {String} name
 * @param {String?} email
 * @returns {person}
 */
function createPerson(phone, name, email) {
    return {
        phone,
        name,
        email: (typeof(email) !== 'undefined') ? email : ''
    };
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    // если индекс телефона -1, то его нет в списке
    if (!isCorrectInput(phone, name) || getIndexOfPhone(phone) !== -1) {

        return false;
    }
    phoneBook.push(createPerson(phone, name, email));

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
    const index = getIndexOfPhone(phone);
    if (!isCorrectInput(phone, name) || index === -1) {

        return false;
    }
    phoneBook[index] = createPerson(phone, name, email);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '') {
        return 0;
    }
    if (query === '*') { // т.к. * это все записи, то можно вернуть длину массива, а его обнулить
        const deletions = phoneBook.length;
        phoneBook = [];

        return deletions;
    }
    // если хоть где-то индекс подстроки не -1, то добавить этот элемент в массив для удалений
    const toDelete = phoneBook.filter((person) => (person.phone.indexOf(query) !== -1 ||
    person.name.indexOf(query) !== -1 || person.email.indexOf(query) !== -1));
    // удалить каждый toDelete из phoneBook
    toDelete.forEach(person => phoneBook.splice(getIndexOfPhone(person.phone)));

    return toDelete.length;
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
    if (query === '*') {
        query = ''; // пустая строка везде найдется
    }

    return phoneBook
        .filter((person) => (person.phone.indexOf(query) !== -1 ||
            person.name.indexOf(query) !== -1 || (person.email.indexOf(query) !== -1)))
        .sort((person, nextPers) => person.name.localeCompare(nextPers.name))
        .map(person => {
            return (person.email !== '')
                ? [person.name, fromGlobToRus(person.phone), person.email].join(', ')
                : [person.name, fromGlobToRus(person.phone)].join(', ');
        });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let updated = 0;
    const toUpdate = csv.split('\n');
    toUpdate.forEach(str => {
        const contact = str.split(';');
        const name = contact[0];
        const phone = contact[1];
        const email = contact[2];
        if (getIndexOfPhone(phone) !== -1) {
            if (update(phone, name, email)) {
                updated++;
            }
        } else if (add(phone, name, email)) {
            updated++;
        }
    });

    return updated;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
