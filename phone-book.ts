/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
export const isStar = true;

interface IPhoneBook {
    [key: string]: [string, string?]
}
/**
 * Телефонная книга
 */
const phoneBook: IPhoneBook = {
    '89991256123': ['Maxim', 'sssfjnefw@gmail.com'],
};
/**
 * Добавление записи в телефонную книгу
 *
 * @param {String} phone
 * @param {String} [name]
 * @param {String} email
 * @returns {Boolean}
 */
export const add = (phone: string, name: string, email?: string): boolean => {
    const isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    const isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    // TODO Валидация почты
    const isPhoneExist = !!phoneBook[phone];

    if (isValidPhone || isValidName || !isPhoneExist) {
        phoneBook[phone] = [name, email];
        return true;
    }
    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} [email]
 * @returns {Boolean}
 */
export const update = (phone: string, name: string, email?: string): boolean => {
    const isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    const isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    // TODO Валидация почты
    const isPhoneExist = !!phoneBook[phone];

    if (isValidPhone || isValidName || isPhoneExist) {
        phoneBook[phone] = [name, email];
        return true;
    }
    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query   
 * @returns {Number}
 */
// function findAndRemove(query) {
// }

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
// function find(query) {
// }

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
export const importFromCsv = (csv: string) => {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
}
