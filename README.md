# Mini-LMS Quiz API

A backend API designed to help students prepare for upcoming tests and exams. The application is structured into various courses, each containing quizzes to support effective learning and assessment.

## 📁 Project Structure

```
courses/
├── mathematics/
│   ├── quiz-1.json
│   └── quiz-2.json
├── physics/
│   └── quiz-1.json
└── chemistry/
    └── quiz-1.json
```

Each `.json` file represents a quiz for a specific course. The API reads these files and serves quiz data to the frontend.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mini-lms-backend.git
   cd mini-lms-backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   ```bash
   python app.py
   ```

---

## 🌐 API Endpoints

### 1. List Quizzes for a Course

- **Endpoint:** `/api/courses/<courseName>/quizzes`
- **Method:** `GET`
- **Description:** Returns a list of available quizzes for the specified course.

**Example Request:**
```
GET /api/courses/mathematics/quizzes
```

**Sample Response:**
```json
{
  "quizzes": ["quiz-1", "quiz-2"]
}
```

---

### 2. Get Quiz Questions

- **Endpoint:** `/api/courses/<courseName>/quiz/<quizName>`
- **Method:** `GET`
- **Description:** Returns the questions and options for the specified quiz.

**Example Request:**
```
GET /api/courses/mathematics/quiz/quiz-1
```

**Sample Response:**
```json
{
  "quiz": "quiz-1",
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "answer": "4"
    }
  ]
}
```

---

## ⚠️ Notes

- Quiz files must be located in: `courses/<courseName>/`
- File names should match the `quizName` parameter (without `.json`).
- Ensure all JSON files are UTF-8 encoded.

---

## 🖥️ Frontend

The frontend for this project is available at:  
[https://github.com/Fikkii/Mini-LMS-Frontend](https://github.com/Fikkii/Mini-LMS-Frontend)

For a complete setup, please install and run both the backend and frontend.

---

## 📄 License

MIT
