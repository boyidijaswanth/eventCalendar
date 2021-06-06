const EventsModel = require('./../models/events.js');
const EventDetails = require('./../models/event_details.js')
const config = require('./../settings.json').rest;
const weekday = require('./../settings.json').weekday;
const moment = require('moment');
class Events {
    async createNewEvent(request, response) {
        let recursive_event_start_dates = [];
        let recursive_event_end_dates = [];
        let responseMessage = config.failureMessage;
        let time = null
        let start = null
        let end = null
        let startTime = null
        let endTime = null
        let currentStart = null
        let currentend = null
        let dateDiff = null
        let recuring_day_number = []
        let recursive_event_values = []
        let regex = new RegExp("([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]");
        request.body.recursive_days = request.body.recursive_days || null
        let recuring_day = request.body.recursive_days || []
        request.body.recursion_event_end = request.body.recursion_event_end || null
        if (!request.body.start || !request.body.user_id) {
            responseMessage.message = "start of the event and user_id are required"
            response.status(config.baddataStatus).send(responseMessage)
            return;
        } else {
            if (!(regex.test(request.body.start))) {
                responseMessage.message = "start of the event is not required format"
                response.status(config.baddataStatus).send(responseMessage)
                return;
            }
            startTime = request.body.start.split(" ")[1];
            start = moment(request.body.start, "DD-MM-YYYY hh:mm:ss");
        }
        if (request.body.end) {
            if (!(regex.test(request.body.end))) {
                responseMessage.message = "end of the event is not required format"
                response.status(config.baddataStatus).send(responseMessage)
                return;
            }
            endTime = request.body.start.split(" ")[1];
        }
        if (request.body.is_recursive) {
            if (!request.body.recursion_event_end) request.body.recursion_event_end = moment(start).add('365', "days").format("DD-MM-YYYY 23:59:59");
            end = moment(request.body.recursion_event_end, "DD-MM-YYYY hh:mm:ss");
        }
        if (request.body.recursive_days) {
            if(!request.body.recursive_days instanceof Object){
                responseMessage.message = "recursive_days of the event is not required format"
                response.status(config.baddataStatus).send(responseMessage)
                return;
            } 
            let currentRecursiveDayas = [] 
            request.body.recursive_days.map(record=>currentRecursiveDayas.push("`"+record+"`"))
            request.body.recursive_days = `'{${currentRecursiveDayas.join(",")}}'`
        }
        let newEvent = await EventsModel.createNewEvent(request.body).catch((error) => {
            return error
        });
        if (!newEvent ||newEvent.error|| newEvent instanceof Error) {
            responseMessage.message = "event could not be created"
            response.status(config.baddataStatus).send(responseMessage)
            return;
        } else {
            if (request.body.is_recursive) {
                if (recuring_day.length) {
                    recuring_day.map((record) => {
                        recuring_day_number.push(weekday[record.toLowerCase()])
                    })
                } else {
                    recuring_day_number = [moment().isoWeekday()];
                }
                for (let i = 0; i < recuring_day_number.length; i++) {
                    let time = start.clone().day(recuring_day_number[i]);
                    while (time.isBefore(end)) {
                        if (time.isAfter(start, 'days')) {
                            currentStart = moment(time).format("DD-MM-YYYY " + startTime);
                            if (request.body.end) {
                                dateDiff = moment(request.body.end, "DD-MM-YYYY hh:mm:ss").diff(start, 'days')
                                currentend = `${moment(time).add(dateDiff, "days").format("DD-MM-YYYY " + endTime)}`;
                            }
                            recursive_event_values.push(`(${request.body.user_id },${newEvent.rows[0].id},'["${currentStart}",${currentend||""})')`)
                        }
                        time.add(7, 'days');
                    }
                }
            } else {
                recursive_event_values.push(`(${request.body.user_id },${newEvent.rows[0].id},'["${request.body.start}","${request.body.end}")')`)
            }
            let events = await EventDetails.addEventDates(recursive_event_values.join(",")).catch((error) => {
                return error
            });
            if (!events || events instanceof Error) {
                responseMessage.message = "conflicting dates"
                response.status(config.baddataStatus).send(responseMessage)
                return;
            }
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "a new event is created";
        responseMessage.event_id = newEvent.rows[0].id
        response.send(responseMessage);
    }
}
module.exports = new Events();