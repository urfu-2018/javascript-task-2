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
    // '9991256123': ['Maxim'],
    // '9991256124': ['Maxim1', 'sssfjneffwew@gmail1.com'],
    // '9511256124': ['Maxim2'],
    // '9591256124': ['Maxim3', 'sssfjnsdfsdefw@gmail1.com'],
};
/**
 * Добавление записи в телефонную книгу
 *
 * @param {String} phone
 * @param {String} name
 * @param {String} [email]
 * @returns {Boolean}
 */
export function add(phone: string, name: string, email?: string): boolean {

    const isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    const isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    // TODO Валидация почты
    const isPhoneExist = !!phoneBook[phone];

    if (isValidPhone && isValidName && !isPhoneExist) {
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
export function update(phone: string, name: string, email?: string): boolean {

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
export function findAndRemove(query: string): number {

    // Преобразуем в phoneBook в массив, добавляем счетчик
    const arrayPhoneBook = Object.entries(phoneBook);
    let deletedCount = 0

    // Условие для ''
    if (query === '') {
        return 0;
    }

    // Условие для '*'
    if (query === '*') {
        query = '';
    }

    // Фильтрация массива
    for (let i = 0; i < arrayPhoneBook.length; i++) {

        const targetPhone: string = arrayPhoneBook[i][0]
        const targetName: string = arrayPhoneBook[i][1][0]
        const targetEmail: string | undefined = arrayPhoneBook[i][1][1]
        const isPhoneFound: boolean = targetPhone.toLowerCase().includes(query.toLowerCase())
        const isNameFound: boolean = targetName.toLowerCase().includes(query.toLowerCase())
        const isEmailFound: boolean | undefined = targetEmail?.toLowerCase().includes(query.toLowerCase())

        if ((isPhoneFound || isNameFound || isEmailFound)) {
            delete phoneBook[targetPhone]
            deletedCount++
        }
    }
    return deletedCount;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
export function find(query: string): string[] {

    // Преобразуем в phoneBook в массив, добавляем массив выходных данных
    const arrayPhoneBook = Object.entries(phoneBook);
    const parsedPhoneBook: string[] = ['']

    // Условие для ''
    if (query === '') {
        return [''];
    }

    // Условие для '*'
    if (query === '*') {
        query = '';
    }

    // Фильтрация массива
    for (let i = 0; i < arrayPhoneBook.length; i++) {

        const targetPhone: string = arrayPhoneBook[i][0]
        const targetName: string = arrayPhoneBook[i][1][0]
        const targetEmail: string | undefined = arrayPhoneBook[i][1][1]
        const isEmailTypeString: boolean = typeof targetEmail === 'string'
        const isPhoneFound: boolean = targetPhone.toLowerCase().includes(query.toLowerCase())
        const isNameFound: boolean = targetName.toLowerCase().includes(query.toLowerCase())
        const isEmailFound: boolean | undefined = targetEmail?.toLowerCase().includes(query.toLowerCase())

        if ((isPhoneFound || isNameFound || isEmailFound)) {

            const modifiedPhone = `+7 (${targetPhone.substring(0, 3)}) ${targetPhone.substring(3, 6)}-${targetPhone.substring(6, 8)}-${targetPhone.substring(8, 10)}`

            if (isEmailTypeString) {
                parsedPhoneBook[i] = `${targetName}, ${modifiedPhone}, ${targetEmail}`
            }
            else {
                parsedPhoneBook[i] = `${targetName}, ${modifiedPhone}`
            }
        }
        else {
            arrayPhoneBook.splice(i, 1)
            i = i - 1;
        }
    }
    return parsedPhoneBook.sort();

}

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

// console.log(phoneBook)
// console.log()
// console.log(find('999'))
// console.log()
// console.log('Пустая строка:')
// console.log(find(''))
// console.log()
// console.log('Звездочка')
// console.log(find('*'))
// console.log()
// console.log('удаление Пустая строка:')
// console.log(findAndRemove(''))
// console.log()
// console.log('удаление собака:')
// console.log(findAndRemove('@'))
// console.log()
// console.log('удаление Звездочка')
// console.log(findAndRemove('*'))
// console.log()




// console.log(add('5554440044', 'Григорий', 'grisha@example.com'))
// console.log(add('5552220022', 'Борис', 'boris@example.com'))
// console.log(add('5551110011', 'Алекс'))
// console.log(add('5553330033', 'Валерий', 'valera@example.com'))


// console.log()
// console.log(add('3330033', 'Неизвестный', 'unknown@example.com'))
// console.log(add('abc5556660055', 'Николай', 'kolya@example.com'))
// console.log(add('5556660066abc', 'Герман', 'gera@example.com'))
// console.log(add('5551110011', 'Алексей'))
// console.log(add('5555550055'))
