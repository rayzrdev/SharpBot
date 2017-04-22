class Stats {
    constructor() {
        this._stats = {};
    }

    get(key) {
        return this._stats[key];
    }

    set(key, value) {
        this._stats[key] = value;
    }

    increment(key, amount) {
        this.set(key, (this.get(key) || 0) + (amount || 1));
    }
}

module.exports = Stats;
