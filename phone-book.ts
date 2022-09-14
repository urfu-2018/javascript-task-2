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

function filterPhoneBook(query: string): string[] {

    if (query === '') {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook);
    }

    const filterResult = Object.keys(phoneBook).filter((phone) => {

        const isPhoneFound: boolean = phone.toLowerCase().includes(query.toLowerCase())
        const isNameFound: boolean = phoneBook[phone][0].toLowerCase().includes(query.toLowerCase())
        const isEmailFound: boolean | undefined = phoneBook[phone][1]?.toLowerCase().includes(query.toLowerCase())

        if ((isPhoneFound || isNameFound || isEmailFound)) {
            return true
        } else {
            return false
        }

    })

    return filterResult

}


/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query   
 * @returns {Number}
 */
export function findAndRemove(query: string): number {
    let deletedCount = 0
    const fiteredContacts = filterPhoneBook(query)

    fiteredContacts.forEach((element) => {
        delete phoneBook[element]
        deletedCount++
    })

    return deletedCount;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
export function find(query: string): string[] {

    const fiteredContacts = filterPhoneBook(query)

    const parsedPhoneBook = fiteredContacts.map((phone) => {

        const name: string = phoneBook[phone][0]
        const email: string | undefined = phoneBook[phone][1]
        const modifiedPhone = `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 8)}-${phone.substring(8, 10)}`

        if (email) {
            return `${name}, ${modifiedPhone}, ${email}`
        }
        else {
            return `${name}, ${modifiedPhone}`
        }
    })

    return parsedPhoneBook.sort()
}

export const importFromCsv = (csv: string): number => {

    const csvStringsFormat: string[] | null = csv.match(/.+(?=\n)/g)
    let counter = 0

    if (!csvStringsFormat) {
        return 0;
    }

    csvStringsFormat.forEach((element, i) => {
        const contact = csvStringsFormat[i].split(';')
        if (contact[2]) {
            if (update(contact[1], contact[0], contact[2]) || add(contact[1], contact[0], contact[2])) {
                counter++
            }
        }
        else {
            if (update(contact[1], contact[0]) || add(contact[1], contact[0])) {
                counter++
            }
        }
    })

    return counter;
}