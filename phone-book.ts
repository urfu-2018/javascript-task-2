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
const phoneBook: IPhoneBook = {};

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

export const importFromCsv = (csv: string) => {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    const csvStringsFormat: string[] | null = csv.match(/.+(?=\n)/g)
    let counter = 0
    if (!(csvStringsFormat === null)) {
        for (let i = 0; i < csvStringsFormat.length; i++) {
            const contact = csvStringsFormat[i].split(';')
            if (typeof contact[2] === 'undefined') {
                if (update(contact[1], contact[0]) || add(contact[1], contact[0])) {
                    counter++
                }
            }
            else {
                if (update(contact[1], contact[0], contact[2]) || add(contact[1], contact[0], contact[2])) {
                    counter++
                }
            }
        }
    }

    return counter;
}