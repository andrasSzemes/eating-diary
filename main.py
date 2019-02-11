from flask import Flask, render_template, request, session, jsonify
import data_manager
import json

app = Flask(__name__)


@app.route('/')
def select_topic():
    return render_template('select_topic.html')


@app.route('/<topic>')
def render_notes_of_topic(topic):
    subtopics_for_topic = data_manager.get_subtopics_for_topic(topic)
    return render_template('topic.html', subtopics_for_topic=subtopics_for_topic, topic=topic)


@app.route('/subtopic', methods=['POST'])
def send_subtopics_back():
    topic = request.get_json()
    subtopics_for_topic = data_manager.get_subtopics_for_topic(topic)
    return jsonify(subtopics_for_topic)


@app.route('/subtopic/<subtopic>')
def return_subtopic_notes(subtopic):
    notes_for_subtopic = data_manager.get_notes_for_subtopic(subtopic)
    return json.dumps(notes_for_subtopic)


# @app.route('/update-positions', methods=['POST'])
# def update_positions():
#     new_positions = request.form.to_dict()
#     data_manager.update_note_position(new_positions)
#     return jsonify(status='OK')
#     #TODO status='OK'


@app.route('/update-body', methods=['POST'])
def update_body():
    new_data = request.get_json()
    data_manager.update_note_body(new_data)
    return jsonify({'OK': True})


@app.route('/add-new-note-header', methods=['POST'])
def add_new_note_header():
    new_data = request.get_json()
    subtopic_id = data_manager.get_subtopic_id_by_link_name(new_data['subtopic_name_as_link'])
    new_data['subtopic_id'] = subtopic_id

    data_manager.add_new_note_header(new_data)
    return jsonify({'OK': True})


@app.route('/show-actual-number-of-notes')
def return_actual_number_of_notes():
    number_of_notes_dict = data_manager.get_how_many_notes_are()
    print(number_of_notes_dict)
    return jsonify(number_of_notes_dict)
    #TODO jsonify


# #TODO pomodoro need new logic to work
# @app.route('/count-pomodoro')
# def count_pomodoro():
#     """Here comes the new logic"""
#     return ''


# #TODO .sql is greater than csv, it should be used instead
# @app.route('/back-up')
# def back_up():
#     """Here comes new logic"""
#     return ''


if __name__ == '__main__':
    app.secret_key = 'the_one_to_rule_them_all'
    app.run(host='0.0.0.0',
            port=4000,
            debug=True)
