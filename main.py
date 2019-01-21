from flask import Flask, render_template, request, redirect, url_for, session
import data_manager
import json

app = Flask(__name__)


@app.route('/')
def index():
    session['pomodoro_count'] = data_manager.pomodoro_count_today()
    note_classes = data_manager.get_all_classes()
    all_notes = data_manager.get_all_notes(session['note_class']) if 'note_class' in session else ''
    return render_template('index.html', all_notes=all_notes, note_classes=note_classes)


@app.route('/add-note', methods=['GET', 'POST'])
def add_note():
    if request.method == 'POST':
        new_note = request.form.to_dict()
        new_note['subtopic_id'] = data_manager.get_subtopic_id_by_name(session['note_class'])
        data_manager.save_note(new_note)
        return redirect(url_for("index"))
    else:
        return render_template('add_note.html')
    

@app.route('/delete-note/<note_id>')
def delete_note(note_id):
    data_manager.delete_note(note_id)
    return redirect(url_for("index"))


@app.route('/up-vote/<note_id>')
def up_vote(note_id):
    data_manager.vote(note_id, change=1)
    return redirect(url_for("index"))


@app.route('/down-vote/<note_id>')
def down_vote(note_id):
    data_manager.vote(note_id, change=-1)
    return redirect(url_for("index"))


@app.route('/update-note/<note_id>', methods=['GET', 'POST'])
def update_note(note_id):
    if request.method == 'POST':
        note_to_update = request.form.to_dict()
        data_manager.update_note(note_to_update)
        return redirect(url_for("index"))
    selected_note = data_manager.get_note_by_id(note_id)
    return render_template('add_note.html', selected_note=selected_note)


@app.route('/change-class/<note_class>')
def change_class(note_class):
    session['note_class'] = note_class
    return redirect(url_for("index"))


@app.route('/add-new-class', methods=['GET', 'POST'])
def add_new_class():
    if request.method == 'POST':
        data_manager.save_new_class(request.form['new_class'])
        return redirect(url_for("index"))
    else:
        note_classes = data_manager.get_all_classes()
        return render_template('add_class.html', note_classes=note_classes)


@app.route('/count-pomodoro')
def count_pomodoro():
    subtopic = session['note_class']
    data_manager.archive_pomodoro(subtopic)
    return redirect(url_for("index"))


@app.route('/back-up')
def back_up():
    data_manager.backup()
    return redirect(url_for("index"))


@app.route('/select-topic')
def select_topic():
    return render_template('select_topic.html')


@app.route('/<topic>')
def show_notes_of_topic(topic):
    subtopics_for_topic = data_manager.get_subtopics_for_topic(topic)
    session['all_notes_for_topic'] = data_manager.get_all_notes_for_topic(topic)
    return render_template('topic.html', subtopics_for_topic=subtopics_for_topic, topic=topic)


@app.route('/subtopic/<subtopic>')
def get_subtopic_notes(subtopic):
    notes_for_subtopic = data_manager.get_notes_for_subtopic(subtopic)
    return json.dumps(notes_for_subtopic)


@app.route('/update-positions', methods=['POST'])
def update_positions():
    new_positions = request.form.to_dict()
    data_manager.update_note_position(new_positions)
    return ''


@app.route('/update-body', methods=['POST'])
def update_body():
    new_data = request.form.to_dict()
    print(new_data)
    data_manager.update_note_body(new_data)
    return ''


@app.route('/add-new-note-header', methods=['POST'])
def add_new_note_header():
    new_data = request.form.to_dict()
    subtopic_id = data_manager.get_subtopic_id_by_link_name(new_data['subtopic_name_as_link'])
    new_data['subtopic_id'] = subtopic_id

    data_manager.add_new_note_header(new_data)
    return ''

@app.route('/show-actual-number-of-notes')
def show_actual_number_of_notes():
    number_of_notes_dict = data_manager.get_how_many_notes_are()
    print(number_of_notes_dict)
    return json.dumps(number_of_notes_dict)


if __name__ == '__main__':
    app.secret_key = 'the_one_to_rule_them_all'
    app.run(host='0.0.0.0',
            port=4000,
            debug=True)
