from typing import List, Dict

from psycopg2.extras import RealDictCursor

import connection

@connection.connection_handler
def save_note(cursor, new_note):
    cursor.execute("""
                    INSERT INTO notes
                    (header, body)
                    VALUES (%(header)s, %(body)s);
                    """,
                    new_note)


@connection.connection_handler
def get_all_notes(cursor, note_class):
    cursor.execute("""
                    SELECT id, header, body, submission_time, importance
                    FROM notes
                    WHERE class = %(note_class)s
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
                    SELECT DISTINCT class
                    FROM notes
                    """)
    classes = []
    for fetched_dict in cursor.fetchall():
        classes.append(fetched_dict['class'])

    return classes