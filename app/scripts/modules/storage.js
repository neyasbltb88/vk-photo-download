export default class SStorage {
    constructor(params = {}) {
        this.name = params.name;
        this.default = params.default;

        this.init();
    }

    set(key, val) {
        if (val === undefined) return false;
        let tmp = JSON.parse(localStorage.getItem(this.name));
        tmp[key] = val;
        localStorage.setItem(this.name, JSON.stringify(tmp));

        return tmp;
    }

    get(key) {
        let tmp = JSON.parse(localStorage.getItem(this.name));

        return tmp[key];
    }

    getAll() {
        let tmp = JSON.parse(localStorage.getItem(this.name));

        return tmp;
    }

    remove(key) {
        let tmp = JSON.parse(localStorage.getItem(this.name));
        delete tmp[key];
        localStorage.setItem(this.name, JSON.stringify(tmp));

        return tmp;
    }

    clear() {
        localStorage.removeItem(this.name);
    }

    // Метод подготовки
    prepareStorage() {
        if (localStorage.getItem(this.name) == null) {
            localStorage.setItem(this.name, JSON.stringify(this.default));

            return true;
        }

        return false;
    }


    init() {
        this.prepareStorage();
    }
}