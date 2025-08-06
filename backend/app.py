# --- Imports ---
import os
import requests
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# --- App & Database Setup ---
load_dotenv()
app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'skills.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
os.makedirs(os.path.join(basedir, 'instance'), exist_ok=True)

# --- Database Model ---
class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50))
    platform = db.Column(db.String(50))
    progress = db.Column(db.String(20), default='started')
    hours_spent = db.Column(db.Float, default=0)
    difficulty = db.Column(db.Integer, default=1)
    notes = db.Column(db.Text)

    def to_dict(self):
        return {key: getattr(self, key) for key in self.__table__.c.keys()}

# --- API Endpoints ---
@app.before_request
def create_all_tables():
    db.create_all()

@app.route('/skills', methods=['GET', 'POST'])
def handle_skills():
    """Handles getting all skills and adding a new one."""
    if request.method == 'POST':
        data = request.json
        new_skill = Skill(
            skill_name=data['skill_name'],
            resource_type=data['resource_type'],
            platform=data['platform'],
            notes=data.get('notes')
        )
        db.session.add(new_skill)
        db.session.commit()
        return jsonify(new_skill.to_dict()), 201
    
    # This is the GET request
    skills = Skill.query.all()
    return jsonify([skill.to_dict() for skill in skills])

# --- THIS IS THE CORRECTED ROUTE ---
@app.route('/skills/<int:id>', methods=['PUT', 'DELETE'])
def handle_single_skill(id):
    """Handles updating or deleting a single skill."""
    skill = db.session.get(Skill, id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(skill, key, value)
        db.session.commit()
        return jsonify(skill.to_dict())

    if request.method == 'DELETE':
        db.session.delete(skill)
        db.session.commit()
        return "", 204

@app.route('/summarize-notes', methods=['POST'])
def summarize_skill_notes():
    """Uses the Google Gemini API for free summarization."""
    notes = request.json.get('notes', '')
    if not notes.strip():
        return jsonify({"summary": "No notes to summarize."})

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Summarize the following learning notes in one concise sentence: '{notes}'"
        response = model.generate_content(prompt)
        return jsonify({"summary": response.text})
    except Exception as e:
        print(f"Google AI API error: {e}")
        return jsonify({"error": "Failed to generate summary from AI."}), 500

if __name__ == '__main__':
    app.run(debug=True)