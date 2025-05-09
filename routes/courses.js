const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { marked } = require('marked')

// Path to the 'courses' directory
const coursesDir = path.join(__dirname, '../courses');  // Adjust path based on actual structure

// @route   GET /api/courses
// @desc    Get list of course directories
// @access  Public
router.get('/', (req, res) => {
    fs.readdir(coursesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory', error: err });
        }

        // Filter directories only (ignores files)
        const directories = files.filter(file => fs.statSync(path.join(coursesDir, file)).isDirectory());

        res.json({ courses: directories });
    });
});

router.get('/:courseName', (req, res) => {
    const { courseName } = req.params;

    // Path to the course directory
    const coursePath = path.join(coursesDir, courseName);

    // Check if the course directory exists
    fs.exists(coursePath, (exists) => {
        if (!exists) {
            return res.status(404).json({ message: `Course ${courseName} not found` });
        }

        // Read the directories inside the course directory (modules)
        fs.readdir(coursePath, (err, modules) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading course directory', error: err });
            }

            // Filter only directories (modules)
            const modulesList = modules.filter(module =>
                fs.statSync(path.join(coursePath, module)).isDirectory()
            );

            const courseStructure = [];

            // Loop through each module to create the structure
            modulesList.forEach(module => {
                // Get topics (markdown files) inside the module
                const modulePath = path.join(coursePath, module);
                const topics = [];

                // Read all files in the module
                const files = fs.readdirSync(modulePath);

                // Loop through files and add markdown files as topics
                files.forEach(file => {
                    const filePath = path.join(modulePath, file);
                    const fileStats = fs.statSync(filePath);

                    // Only add markdown files as topics
                    if (fileStats.isFile() && file.endsWith('.md')) {
                        topics.push({
                            name: file.replace('.md', ''),  // Name of the topic (filename without extension)
                            filePath: filePath              // Path to the markdown file
                        });
                    }
                });

                // Add the module with its topics to the course structure
                courseStructure.push({
                    module: module,
                    topics: topics
                });
            });

            // Return the structured JSON with modules and topics
            res.json({ course: courseName, modules: courseStructure });
        });
    });
});

router.get('/:courseName/module/:moduleName/topics', (req, res) => {
    const { courseName, moduleName } = req.params;
    const modulePath = path.join(coursesDir, courseName, moduleName);

    fs.readdir(modulePath, (err, files) => {
        if (err) {
            return res.status(404).json({ message: `Module ${moduleName} not found in course ${courseName}` });
        }

        const topics = files
            .filter(file => file.endsWith('.md'))
            .map(file => path.basename(file, '.md')); // remove .md extension

        res.json({ topics });
    });
});

/**
 * GET /api/courses/:courseName/module/:moduleName/topic/:topicName
 * Return parsed HTML from a specific markdown topic
 */
router.get('/:courseName/module/:moduleName/topic/:topicName', (req, res) => {
    const { courseName, moduleName, topicName } = req.params;
    const topicPath = path.join(coursesDir, courseName, moduleName, `${topicName}.md`);

    fs.readFile(topicPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(404).json({ message: `Topic ${topicName} not found in module ${moduleName}` });
        }

        const html = marked(data);
        res.json({ topic: topicName, content: html });
    });
});

module.exports = router;

