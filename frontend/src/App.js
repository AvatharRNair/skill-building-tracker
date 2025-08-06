import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ skill_name: '', resource_type: '', platform: '', notes: '' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const response = await axios.get(`${API_URL}/skills`);
    setSkills(response.data);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/skills`, form);
    setForm({ skill_name: '', resource_type: '', platform: '', notes: '' });
    fetchSkills();
  };

  const handleUpdate = async (id, field, value) => {
    const skill = skills.find(s => s.id === id);
    await axios.put(`${API_URL}/skills/${id}`, { ...skill, [field]: value });
    if (field === 'notes' || field === 'hours_spent') {
      fetchSkills();
    }
  };

  const handleSummarize = async (notes) => {
    if (!notes || !notes.trim()) return alert("No notes to summarize.");
    const response = await axios.post(`${API_URL}/summarize-notes`, { notes });
    alert(`AI Summary:\n\n${response.data.summary}`);
  };


  const handleDelete = async (id) => {
    // Show a confirmation dialog to prevent accidental deletion
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await axios.delete(`${API_URL}/skills/${id}`);
        fetchSkills(); // Refresh the list to remove the skill
      } catch (error) {
        console.error("Failed to delete skill:", error);
      }
    }
  };

  return (
    <div className="container">
      <header>
        <h1>SkillStack </h1>
        <p>Your Personal Skill-Building Tracker</p>
      </header>

      <div className="card">
        <h2>Add a New Learning Goal</h2>
        <form onSubmit={handleFormSubmit} className="skill-form">
          <input name="skill_name" value={form.skill_name} onChange={handleFormChange} placeholder="Skill / Course Name" required />
          <input name="resource_type" value={form.resource_type} onChange={handleFormChange} placeholder="Resource Type (e.g., video, course, article)" required />
          <input name="platform" value={form.platform} onChange={handleFormChange} placeholder="Platform (e.g., Udemy, Youtube, Coursera, etc.)" required />
          <textarea name="notes" value={form.notes} onChange={handleFormChange} placeholder="Initial notes..."></textarea>
          <button type="submit" className="btn-primary">Add Skill</button>
        </form>
      </div>

      <div className="card">
        <h2>Current Learning Activities</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Progress</th>
                <th>Hours</th>
                <th>Difficulty</th>
                <th>Notes & Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.id}>
                  <td>{skill.skill_name}<small>{skill.platform}</small></td>
                  <td>
                    <select defaultValue={skill.progress} onChange={(e) => handleUpdate(skill.id, 'progress', e.target.value)}>
                      <option>started</option>
                      <option>in-progress</option>
                      <option>completed</option>
                    </select>
                  </td>
                  <td><input type="number" defaultValue={skill.hours_spent} onBlur={(e) => handleUpdate(skill.id, 'hours_spent', parseFloat(e.target.value) || 0)} className="hours-input" /></td>
                  <td><input type="range" min="1" max="5" defaultValue={skill.difficulty} onChange={(e) => handleUpdate(skill.id, 'difficulty', parseInt(e.target.value))} /></td>
                  <td className="notes-cell">
                    <textarea placeholder="Add notes..." defaultValue={skill.notes || ''} onBlur={(e) => handleUpdate(skill.id, 'notes', e.target.value)} />
                    <div className="actions-group">
                      <button onClick={() => handleSummarize(skill.notes)} className="btn-secondary">Summarize</button>
                      {/* --- THIS IS THE NEW DELETE BUTTON --- */}
                      <button onClick={() => handleDelete(skill.id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
