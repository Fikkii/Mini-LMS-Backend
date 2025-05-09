# Course Markdown API

An Express-based API for serving modular course content written in Markdown files. Courses are organized into modules, and each module contains multiple topics.

## 📁 Directory Structure

```
courses/
├── course1/
│   ├── module-1/
│   │   ├── intro.md
│   │   ├── loops.md
│   │   └── variables.md
│   └── module-2/
│       ├── functions.md
│       └── scope.md
├── course2/
│   └── module-1/
│       └── basics.md
```

Each `.md` file inside a module represents a **topic**. The API reads and serves these as HTML.

---

## 🚀 Setup

```bash
# Install dependencies
npm install

# Ensure marked is correctly imported
npm install marked

# Start server
node index.js
```

---

## 🌐 API Endpoints

### 1. **List Topics in a Module**

* **URL**: `/api/courses/:courseName/module/:moduleName/topics`

* **Method**: `GET`

* **Description**: Returns an array of topic names in the specified module.

* **Example**:

  ```
  GET /api/courses/course1/module/module-1/topics
  ```

* **Response**:

```json
{
  "topics": ["intro", "loops", "variables"]
}
```

---

### 2. **Get Content of a Specific Topic**

* **URL**: `/api/courses/:courseName/module/:moduleName/topic/:topicName`

* **Method**: `GET`

* **Description**: Returns the parsed HTML content of a specific markdown file.

* **Example**:

  ```
  GET /api/courses/course1/module/module-1/topic/loops
  ```

* **Response**:

```json
{
  "topic": "loops",
  "content": "<h1>Loops in Programming</h1><p>...</p>"
}
```

---

## ⚠️ Notes

* The `.md` files must be located inside:
  `courses/<courseName>/<moduleName>/`
* File names must match the `topicName` param (excluding `.md`).
* Make sure the markdown files are UTF-8 encoded and saved properly.

---

## 🛆 Dependencies

* `express`
* `marked`
* `fs` (Node.js built-in)
* `path` (Node.js built-in)

---

## 📄 License

MIT

