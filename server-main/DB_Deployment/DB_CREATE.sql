CREATE TABLE IF NOT EXISTS APP_USER (
	user_id int auto_increment not null,
    email varchar(225) not null,
    user_name varchar(225) not null,
    avatar varchar(225) not null,
    phone varchar(225) not null,
    user_password varchar(225) not null,
    created_at timestamp default current_timestamp,
    modified_at timestamp default current_timestamp ON UPDATE current_timestamp,
    modified_by int not null,
    constraint USER_PK primary key (user_id),
    constraint USER_CK1 unique(email)
);
CREATE TABLE IF NOT EXISTS CONTACT (
    contact_id int auto_increment not null,
	storer_id int not null,
    stored_id int not null,
    created_at timestamp default current_timestamp,
    constraint CONTACT_PK primary key (contact_id),
    constraint CONTACT_CK1 unique(storer_id, stored_id),
    constraint CONTACT_FK1 foreign key (storer_id) references APP_USER(user_id),
    constraint CONTACT_FK2 foreign key (stored_id) references APP_USER(user_id)
);
CREATE TABLE IF NOT EXISTS CALL_HISTORY (
    history_id int auto_increment not null,
	sender int not null,
    receiver int not null,
    call_date date not null,
    call_status varchar(255) not null,
    deepfake boolean not null,
    room_id varchar(255) not null,
    created_at timestamp default current_timestamp,
    modified_at timestamp default current_timestamp ON UPDATE current_timestamp,
    modified_by int not null,
    constraint CALL_HISTORY_PK primary key (history_id),
    constraint CALL_HISTORY_FK1 foreign key (sender) references APP_USER(user_id),
    constraint CALL_HISTORY_FK2 foreign key (receiver) references APP_USER(user_id)
);
CREATE TABLE IF NOT EXISTS EDUCATION (
    education_id int auto_increment not null,
	title varchar(100) not null,
    content varchar(10000) not null,
    created_at timestamp default current_timestamp,
    modified_at timestamp default current_timestamp ON UPDATE current_timestamp,
    constraint EDUCATION_PK primary key (education_id)
);
CREATE TABLE IF NOT EXISTS BLOCK_LOG (
    log_id int auto_increment not null,
    blocked_id int not null,
    created_by int not null,
    created_at timestamp default current_timestamp,
    modified_at timestamp default current_timestamp ON UPDATE current_timestamp,
    modified_by int not null,
    CONSTRAINT BLOCK_LOG_PK primary key (log_id),
    CONSTRAINT BLOCK_LOG_CK unique (blocked_id, created_by),
    CONSTRAINT BLOCK_LOG_FK1 foreign key (blocked_id) REFERENCES APP_USER(user_id)
);
CREATE TABLE IF NOT EXISTS REPORT_LOG (
    log_id int auto_increment not null,
    reported_id int not null,
    created_by int not null,
    created_at timestamp default current_timestamp,
    modified_at timestamp default current_timestamp ON UPDATE current_timestamp,
    modified_by int not null,
    CONSTRAINT REPORT_LOG_PK primary key (log_id),
    CONSTRAINT REPORT_LOG_CK unique (reported_id, created_by),
    CONSTRAINT REPORT_LOG_FK1 foreign key (reported_id) REFERENCES APP_USER(user_id)
);