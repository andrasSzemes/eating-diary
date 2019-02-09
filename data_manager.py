from typing import List, Dict

from psycopg2.extras import RealDictCursor

import connection
from time import strftime
import os
import time


#Currently not used in the application
@connection.connection_handler
def delete_note(cursor, note_id):
    cursor.execute("""
                    DELETE FROM notes
                    WHERE id = %(note_id)s;
                    """,
                   {'note_id' : note_id})


#Currently not used in the application
@connection.connection_handler
def archive_pomodoro(cursor, subtopic):
    cursor.execute("""
                    INSERT INTO pomodoro
                    (subtopic)
                    VALUES (%(subtopic)s)
                    """,
                   {'subtopic': subtopic})


#Currently not used in the application
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
def get_all_notes_for_topic(cursor, topic):
    cursor.execute("""
                    SELECT notes.*, subtopics.subtopic_name
                    FROM notes
                    LEFT JOIN subtopics ON notes.subtopic_id = subtopics.subtopic_id
                    WHERE subtopics.topic_name = %(topic)s
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
    print(time.time())


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
def get_how_many_notes_are(cursor):
    cursor.execute("""
                    SELECT count(id) AS number_of_notes
                    FROM notes
                    """)
    return cursor.fetchone()