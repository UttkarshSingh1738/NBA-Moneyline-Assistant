-- noinspection SqlNoDataSourceInspectionForFile

# --- !Ups

create table people (
                        id                            bigint auto_increment not null,
                        username                      varchar(255) not null unique,
                        password                      varchar(255) not null,
                        created_time                  datetime(6) not null,
                        updated_time                  datetime(6) not null,
                        constraint pk_people primary key (id)
);

create table chat (
                      id                            bigint auto_increment not null,
                      user_id                       bigint not null,
                      message                       varchar(255),
                      created_time                  datetime(6) not null,
                      updated_time                  datetime(6) not null,
                      constraint pk_chat primary key (id),
                      constraint fk_chat_user foreign key (user_id) references people(id)
);

-- !Downs

drop table if exists chat;

drop table if exists people;
