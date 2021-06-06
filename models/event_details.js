const Udayydb = require('./../database/postgres.js');
const util = require('util');
class EventDetails extends Udayydb {
    async addEventDates(data) {
        let query_string = null
        this.db_client = this.db_client || this.get_db_client()
        if (this.db_client) {
            if (!this.query) {
                this.query = util.promisify(this.db_client.query).bind(this.db_client);
                if (this.query instanceof Error) return console.error(this.query)
            }
            query_string = "insert into event_details (user_id,event_id,event_time) values "+data;
            console.log(query_string)
            try {
                let rows = await this.query(query_string);
                if (rows instanceof Error) {
                    console.log(rows);
                    if (rows.fatal && rows.code === 'PROTOCOL_CONNECTION_LOST') {
                        this.db_client = this.get_db_client()
                    }
                    return rows
                }
                return rows
            } catch (err) {
                console.log("Exception in createNewEvent method ")
                this.exception_message(err)
            }
            return false;
        }
        return false;
    }
}
module.exports = new EventDetails();