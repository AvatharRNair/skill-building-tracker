# SkillStack - My Personal Learning Tracker 

Hey there! Thanks for checking out SkillStack. This project was built to solve a common problem faced by many self-learners—losing track of the various online courses, tutorials, and learning resources started along the way. SkillStack is a simple and clean application designed to organize and track personal skill-building journeys, making it easier to stay focused, motivated, and consistent over time.


It's a full-stack application built from scratch, and it even has a little AI helper to summarize my notes.

---

## What It Does (The Feature List)

* **Add Any Learning Goal**: You can add any course, video, or article you're working on.
* **Track Your Progress**: Keep yourself honest by marking things as `started`, `in-progress`, or that `completed` status.
* **Keep Notes & Details**: Jot down notes, log the hours you've spent, and even rate how difficult you found the material.
* **Get AI Summaries**: A click of a button sends your notes to the Google Gemini AI to get a quick, one-sentence summary.
* **Clean Up**: A simple delete button to remove skills you're no longer pursuing.

---

## The Tech Stack I Used

* **Frontend**: ReactJS (To make the UI feel fast and modern)
* **Backend**: Python with Flask (Lightweight and powerful for the API)
* **Database**: SQLite (Simple and perfect for a project of this size)
* **The AI Brain**: Google's Gemini API

---

## Getting It Running (Setup Steps)

Here’s how to get this running on your own machine.

### You'll Need:
* Node.js & npm
* Python 3 & pip
* A free Google AI API Key

### 1. Get the Backend Running
```bash
# First, navigate into the backend folder
cd backend

# Install all the Python tools it needs
pip install -r requirements.txt

# You'll need to create a .env file in this folder
# and add your Google API key inside it like this:
# GOOGLE_API_KEY='your_key_goes_here'

# Now, start the server!
flask run