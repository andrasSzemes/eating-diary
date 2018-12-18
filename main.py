from flask import Flask, render_template, request, redirect, url_for
import data_manager

app = Flask(__name__)


@app.route('/')
def index():
    all_notes = data_manager.get_all_notes()
    return render_template('index.html', all_notes=all_notes)


@app.route('/add-note', methods=['GET', 'POST'])
def add_note():
    if request.method == 'POST':
        new_note = request.form.to_dict()
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



if __name__ == '__main__':
    app.run(debug=True)
