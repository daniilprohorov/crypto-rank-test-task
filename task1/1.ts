import {cloneDeep} from 'lodash';

type Coin = string
type CoinsStorage = Object
type Coins = Array<Coin>
type ArrayOfCoins = Array<Coins>

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class Parser {
    private regex: RegExp
    private readonly coinTypes: string[]
    constructor(regex: string, storage: CoinsStorage) {
        this.regex = new RegExp(regex)
        this.coinTypes = Object.keys(storage)
    }
    parse(arrayOfCoinsStr: string[]): ArrayOfCoins {
        let arrayOfCoins = cloneDeep(arrayOfCoinsStr)
        return arrayOfCoins.map(coinsStr => {
            // check syntax 'ASDF' + n*'/ASDF' where n = 0, 1, 2...
            if (!this.regex.test(coinsStr)) {
                throw new ValidationError(`Not match declared syntax: ${coinsStr}`)
            }
            // check req contains from coinType values
            const arrayOfCoinsLocal = coinsStr.split('/')
            if (!arrayOfCoinsLocal.every(coin => this.coinTypes.includes(coin))) {
                const msg = `Has coin not declared in coins storage. Available coins: ${this.coinTypes}. Coins: ${coinsStr}`
                throw new ValidationError(msg)
            }
            // check adjacent
            const coinTypesStr = this.coinTypes.join(' ')
            const coinTypesStrReverse = this.coinTypes.reverse().join(' ')
            const coins = arrayOfCoinsLocal.join(' ')
            if (!(coinTypesStr.includes(coins) || coinTypesStrReverse.includes(coins))) {
                throw new ValidationError(`Not adjacent: Available coins: ${this.coinTypes}. Coins:${coinsStr}`)
            }
            return arrayOfCoinsLocal
        })
    }

}
function removeCoin(coin: Coin, coinsStorage: CoinsStorage): CoinsStorage | null {
    const coinsStorageUpdated = cloneDeep(coinsStorage);
    if (coinsStorage[coin] > 0) {
        coinsStorageUpdated[coin] = coinsStorageUpdated[coin] - 1
        return coinsStorageUpdated
    }
    return null
}

// main algorithm function
function calcCoins(reqArray: Array<Array<Coin>>, storage: CoinsStorage): Array<Array<Coin>> {
    const reqLocal = cloneDeep(reqArray)
    if (reqLocal.length === 0) {
        return []
    }
    const coins = reqLocal.pop()
    const resultForAll: Array<Array<Coin>> = [];
    for (let coin of coins) {
        const storageUpdated: CoinsStorage = removeCoin(coin, storage)
        if (storageUpdated === null) {
            continue
        }
        const result = calcCoins(reqLocal, storageUpdated)
        if (result.length === 0) {
            result.push([])
        }
        result.forEach(lst => lst.push(coin))
        resultForAll.push(...result)
    }
    // filter not ended calculations
    return resultForAll.filter(res => res.length === reqArray.length)
}

type SortedMap = number[]
function sortByLength(array: ArrayOfCoins):[ArrayOfCoins, SortedMap] {
    const arrayOfObj: Array<{id: number, value: Coins}> = []
    for (const i in array) {
        arrayOfObj.push({id: Number(i), value: array[i]})
    }
    arrayOfObj.sort((a, b) => a.value.length - b.value.length)
    const ids: SortedMap = []
    const values: ArrayOfCoins = []
    for(const {id, value} of arrayOfObj) {
        ids.push(id)
        values.push(value)
    }
    return [values, ids]
}

function unsortBySortedMap(sortedMap: SortedMap, array: Coins): Coins {
    const unsorted: Coins = new Array<Coin>(array.length)
    for (let i = 0; i < array.length; i++) {
        unsorted[i] = array[sortedMap[i]]
    }
    return unsorted
}

// Here resultUnsorted is Array of Array of String, when I'm looking at descriptions of test task decide that
// have to contain all variants and create this version.
// If we have to had just one appropriate Array of String, better way is sort storage by count of coins, and choose
// for request with multiple coins first coin of this sorted storage, and do it on each cycle
function coinsDistribution(availableCoins , request: Array<Coin>): Array<Coin> | null {
    const parser = new Parser('^[A-Z]+(\/[A-Z]+)*$', availableCoins)
    const coinsReq = parser.parse(request)
    const [sortedArrayOfCoins, sortedMap] = sortByLength(coinsReq)
    const result = calcCoins(sortedArrayOfCoins, availableCoins)
    const resultUnsorted = result.map(coins => unsortBySortedMap(sortedMap, coins))
    if (resultUnsorted.length === 0) {
        return null
    }
    return resultUnsorted[0]
}

const availableCoins = {ETH : 4, TRON: 5, MATIC: 1}
const request = ['ETH', 'ETH', 'ETH/TRON', 'TRON/ETH', 'TRON/MATIC', 'TRON', 'MATIC']
console.log(coinsDistribution(availableCoins, request))
