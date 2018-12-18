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
def get_all_notes(cursor):
    cursor.execute("""
                    SELECT id, header, body, submission_time, importance
                    FROM notes
                    ORDER BY submission_time DESC;
                    """)
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