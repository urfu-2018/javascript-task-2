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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (arguments.length === 2) {
        phoneBook.push(phone + ';' + name);
        return true;
    }
    if (phone.length!==10 && arguments.length!==3) return false;
    phoneBook.push(phone + ';' + name + ';' + email);
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
    this.forEach(element => {
        if (this[element].substring(0,10)===phone && name!==null) {
            element = phone + ";" + name + ";" + email;
            return true;
        }
    });
    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    this.forEach(element => {
        if (element.indexOf(query)!==-1){
            this.splice(indexOf(element), 1);
            count++;
        }
    });
    this.sort();
    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let notes = [];
    if (query==="*") {
        return this;
    }
    if (arguments.length === 0){
        return;
    }
    if (arguments.length!==0) {
        this.forEach(element => {
            if(element.indexOf(query)!==-1) {
                notes.push(element);
            };
        });
        notes.sort();
        return notes;
    }
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};

