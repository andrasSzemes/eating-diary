from typing import List, Dict

from psycopg2.extras import RealDictCursor

import connection
from time import strftime
import os

@connection.connection_handler
def save_note(cursor, new_note):
    cursor.execute("""
                    INSERT INTO notes
                    (header, body, class_id)
                    VALUES (%(header)s, %(body)s, %(class_id)s);
                    """,
                    new_note)


@connection.connection_handler
def get_all_notes(cursor, note_class):
    cursor.execute("""
                    SELECT notes.id, notes.header, notes.body, notes.submission_time, notes.importance, classes.class_id
                    FROM notes
                    JOIN classes
                        ON notes.class_id = classes.class_id
                    WHERE classes.class_name = %(note_class)s
                    ORDER BY submission_time DESC;
                    """,
                   {'note_class': note_class})
    return cursor.fetchall()


@connection.connection_handler
def delete_note(cursor, note_id):
    cursor.execute("""
                    DELETE FROM notes
                    WHERE id = %(note_id)s;
                    """,
                   {'note_id' : note_id})


@connection.connection_handler
def vote(cursor, note_id, change):
    cursor.execute("""
                    UPDATE notes
                    SET importance = importance + %(change)s
                    WHERE id = %(note_id)s
                    """,
                   {'change': change, 'note_id': note_id})


@connection.connection_handler
def update_note(cursor, note_to_update):
    cursor.execute("""
                    UPDATE notes
                    SET body = %(body)s, header = %(header)s
                    WHERE id = %(note_id)s
                    """,
                   note_to_update)


@connection.connection_handler
def get_note_by_id(cursor, note_id):
    cursor.execute("""
                    SELECT id, header, body, importance
                    FROM notes
                    WHERE id = %(note_id)s
                    """,
                   {'note_id': note_id})
    return cursor.fetchone()


@connection.connection_handler
def get_all_classes(cursor):
    cursor.execute("""
                    SELECT class_name
                    FROM classes
                    ORDER BY class_id DESC
                    """)
    classes = []
    for fetched_dict in cursor.fetchall():
        classes.append(fetched_dict['class_name'])

    return classes


@connection.connection_handler
def save_new_class(cursor, new_class):
    cursor.execute("""
                    INSERT INTO classes
                    (class_name)
                    VALUES (%(new_class)s)
                    """,
                   {'new_class': new_class})


@connection.connection_handler
def get_class_id_by_name(cursor, class_name):
    cursor.execute("""
                    SELECT class_id
                    FROM classes
                    WHERE class_name = %(class_name)s
                    """,
                   {'class_name': class_name})
    return cursor.fetchone()['class_id']


@connection.connection_handler
def backup(cursor):
    #get a list of all currently available table in the database
    cursor.execute("""
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema='public'
                    """)
    tables = []
    for fetched_dict in cursor.fetchall():
        tables.append(fetched_dict['table_name'])

    #save all table separately in csv files with actual date
    PATH = os.getcwd()

    try:
        os.mkdir(PATH + '/back_up')
    except FileExistsError:
        pass

    for table in tables:
        cursor.execute(f"""
                        COPY {table}
                        TO '{PATH}/back_up/{table}{strftime(" %a, %d %b %Y %H:%M:%S")}.csv'
                        DELIMITER ','
                        CSV HEADER;
                        """)


@connection.connection_handler
def archive_pomodoro(cursor, topic):
    cursor.execute("""
                    INSERT INTO pomodoro
                    (topic)
                    VALUES (%(topic)s)
                    """,
                   {'topic': topic})


@connection.connection_handler
def pomodoro_count_today(cursor):
    cursor.execute("""
                    SELECT count(*) AS pomodoros_today
                    FROM pomodoro
                    WHERE EXTRACT(YEAR FROM done_date) = EXTRACT(YEAR FROM now()) AND
                          EXTRACT(MONTH FROM done_date) = EXTRACT(MONTH FROM now()) AND
                          EXTRACT(DAY FROM done_date) = EXTRACT(DAY FROM now())
                    """)

    return cursor.fetchone()['pomodoros_today']