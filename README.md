# eventCalendar
events calendar

Prerequisites
1. install Node 14.15.0
2. install npm 6.14.8
3. install postgres 10.17
4. create a database in postgres
5. create tables users,events and events details in the database
7. schema for users
    CREATE TABLE users(
	    id serial PRIMARY KEY,
	    name text NOT NULL,
	    password text NOT NULL,
	    email text UNIQUE NOT NULL,
	    created_at TIMESTAMP default current_timestamp
    );
8. schema for events
    CREATE TABLE events(
        Id serial PRIMARY KEY,
        event_name text NOT NULL,
        Is_recursive text NOT NULL,
        recursive_days text[],
        Description text,
        recursion_event_end timestamp,
        created_at TIMESTAMP default current_timestamp
    );
9. schema for event_details
    CREATE EXTENSION btree_gist;
    CREATE TABLE event_details (
        Id serial PRIMARY KEY,
        user_id bigint,
        event_id bigint,
        event_time tsrange,
        EXCLUDE USING gist (user_id WITH =, event_time WITH &&),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (event_id) REFERENCES events (id)
    );
10. install all node dependencies using `npm i` command

How to run server
1. change database hostname,username,password,database name and port in settings.json
2. run `npm start` for starting server
3. server will be started on 7000 port



