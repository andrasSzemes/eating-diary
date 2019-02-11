from flask import Flask, render_template, request, jsonify, session
import data_manager

app = Flask(__name__)


@app.route('/')
def select_topic():
    return render_template('main.html')


@app.route('/subtopic', methods=['POST'])
def send_subtopics_back():
    topic = request.get_json()
    subtopics_for_topic = data_manager.get_subtopics_for_topic(topic)
    return jsonify(subtopics_for_topic)


@app.route('/subtopic/<subtopic>')
def return_subtopic_notes(subtopic):
    notes_for_subtopic = data_manager.get_notes_for_subtopic(subtopic)
    return jsonify(notes_for_subtopic)


@app.route('/update-body', methods=['POST'])
def update_note_body():
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


@app.route('/authenticate', methods=['POST'])
def authenticate():
    userdata = request.get_json()
    hashed_password = data_manager.get_hashed_password(userdata['username'])
    is_matching = data_manager.verify_password(userdata['password'], hashed_password) if hashed_password else False

    if is_matching:
        return jsonify({'OK': True})
    else:
        return jsonify({'OK': False})


if __name__ == '__main__':
    app.secret_key = 'the_one_to_rule_them_all'
    app.run(host='0.0.0.0',
            port=4000,
            debug=True)


# TODO show which subtopic are you using
# TODO create automatic .sql backup on regular basis
