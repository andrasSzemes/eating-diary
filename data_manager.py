from typing import List, Dict

from psycopg2.extras import RealDictCursor

import connection
from time import strftime
import os
import time
import bcrypt


#Currently not used in the application
@connection.connection_handler
def delete_note(cursor, note_id):
    cursor.execute("""
                    DELETE FROM notes
                    WHERE id = %(note_id)s;
                    """,
                   {'note_id' : note_id})


@connection.connection_handler
def get_subtopics_for_topic(cursor, topic):
    cursor.execute("""
                    SELECT subtopic_name, subtopic_name_as_link
                    FROM subtopics
                    WHERE topic_name = %(topic)s
                    """,
                   {'topic': topic})

    return cursor.fetchall()


@connection.connection_handler
def get_notes_for_subtopic(cursor, subtopic):
    cursor.execute("""
                    SELECT notes.header, notes.body, notes.importance, notes.position, subtopics.subtopic_name_as_link
                    FROM notes
                    JOIN subtopics ON notes.subtopic_id=subtopics.subtopic_id
                    WHERE subtopics.subtopic_name_as_link = %(subtopic)s
                    ORDER BY notes.position ASC
                    """,
                   {'subtopic': subtopic})

    return cursor.fetchall()


@connection.connection_handler
def update_note_position(cursor, new_positions):
    for header, position in new_positions.items():
        cursor.execute("""
                        UPDATE notes
                        SET position = %(position)s
                        WHERE header = %(header)s
                        """,
                       {'header': header, 'position': position})


@connection.connection_handler
def update_note_body(cursor, new_data):
    for reference_header, new_body in new_data.items():
        cursor.execute("""
                        UPDATE notes
                        SET body = %(new_body)s
                        WHERE header = %(reference_header)s
                        """,
                       {'new_body': new_body, 'reference_header': reference_header})


@connection.connection_handler
def add_new_note_header(cursor, new_data):
    cursor.execute("""
                    INSERT INTO notes
                    (header, subtopic_id, position)
                    VALUES (%(new_header)s, %(subtopic_id)s, %(position)s);
                    """,
                   new_data)


@connection.connection_handler
def add_new_subtopic(cursor, new_data):
    new_data['next_id'] = get_last_subtopic_id() + 1
    cursor.execute("""
                    INSERT INTO subtopics
                    (subtopic_id, subtopic_name, topic_name, subtopic_name_as_link)
                    VALUES (%(next_id)s, %(subtopic_name)s, %(topic_name)s, %(subtopic_name_as_link)s)
                    """,
                   new_data)


@connection.connection_handler
def get_last_subtopic_id(cursor):
    cursor.execute("""
                    SELECT MAX(subtopic_id) AS max
                    FROM subtopics
                    """)

    return cursor.fetchone()['max']


@connection.connection_handler
def get_subtopic_id_by_link_name(cursor, subtopicNameAsLink):
    cursor.execute("""
                    SELECT subtopic_id
                    FROM subtopics
                    WHERE subtopic_name_as_link = %(subtopic_name_as_link)s
                    """,
                   {'subtopic_name_as_link': subtopicNameAsLink})
    return cursor.fetchone()['subtopic_id']


@connection.connection_handler
def get_hashed_password(cursor, username):
    cursor.execute("""
                    SELECT hashed_password
                    FROM users_data
                    WHERE username = %(username)s
                    """,
                   {'username': username})

    result = cursor.fetchone()
    return result['hashed_password'] if result else None


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


@connection.connection_handler
def set_authorization_hash(cursor):
    new_hash = bcrypt.gensalt().decode("utf-8")

    cursor.execute("""
                    INSERT INTO authorize
                    (hash)
                    VALUES (%(new_hash)s)
                    """,
                   {'new_hash': new_hash})

    return new_hash


@connection.connection_handler
def is_authorized(cursor, try_hash):
    cursor.execute("""
                    SELECT hash
                    FROM authorize
                    """)

    all_hash = [dictionary['hash'] for dictionary in cursor.fetchall()]
    return try_hash in all_hash
