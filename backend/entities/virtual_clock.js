'use strict';
import { psqlDriver } from '../dbdriver.js';

class SQLVirtualClock {
    constructor(onerow_id, virtual_time) {
        this.onerow_id = onerow_id;
        this.virtual_time = virtual_time;
    }
    toString() {
        return `SQLVirtualClock (${this.onerow_id} - ${this.virtual_time})`;
    }
    static fromRow(row) {
        return new SQLVirtualClock(row.onerow_id, row.virtual_time);
    }
}

class SQLVirtualClockTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const thesisRequestTable = new SQLVirtualClockTable('thesismanagement');
        thesisRequestTable.db = await psqlDriver.openDatabase('thesismanagement');
        return thesisRequestTable;
    }
    async get() {
        const query = `SELECT * FROM virtual_clock`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(SQLVirtualClock.fromRow);
    }
    async exists() {
        const query = `SELECT count(*) FROM virtual_clock`;
        const result = await this.db.executeQueryExpectOne(query);
        return result.count > 0;
    }
    async set(virtual_time) {
        const query = `INSERT INTO virtual_clock (virtual_time) VALUES ($1) ON CONFLICT (onerow_id) DO UPDATE SET virtual_time = $1 RETURNING *`;
        await this.db.executeQueryExpectAny(query, virtual_time);
    }
    async delete() {
        const query = `DELETE FROM virtual_clock`;
        await this.db.executeQueryExpectAny(query);
    }
}



export { SQLVirtualClock, SQLVirtualClockTable };
