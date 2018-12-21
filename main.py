from flask import Flask, render_template, request, redirect, url_for, session
import data_manager

app = Flask(__name__)


@app.route('/')
def index():
    note_classes = data_manager.get_all_classes()
    all_notes = data_manager.get_all_notes(session['note_class'])
    return render_template('index.html', all_notes=all_notes, note_classes=note_classes)


@app.route('/add-note', methods=['GET', 'POST'])
def add_note():
    if request.method == 'POST':
        new_note = request.form.to_dict()
        new_note['class_id'] = data_manager.get_class_id_by_name(session['note_class'])
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
    else:
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


@app.route('/back-up')
def back_up():
    data_manager.backup()
    return redirect(url_for("index"))


if __name__ == '__main__':
    app.secret_key = 'the_one_to_rule_them_all'
    app.run(debug=True)
