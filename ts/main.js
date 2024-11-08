var ResumeBuilder = /** @class */ (function () {
    function ResumeBuilder() {
        this.skillCategories = {
            'Programming Languages': { color: 'bg-blue-500', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
            'Web Technologies': { color: 'bg-green-500', skills: ['HTML', 'CSS', 'React', 'Angular', 'Vue.js'] },
            'Databases': { color: 'bg-yellow-500', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Oracle'] },
            'DevOps': { color: 'bg-red-500', skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure'] },
            'Other': { color: 'bg-purple-500', skills: [] }
        };
        this.form = document.getElementById('resumeForm');
        this.resumeOutput = document.getElementById('generatedResume');
        this.addEducationBtn = document.getElementById('addEducation');
        this.addWorkBtn = document.getElementById('addWork');
        this.resetFormBtn = document.getElementById('resetForm');
        this.printResumeBtn = document.getElementById('printResume');
        this.initializeEventListeners();
    }
    ResumeBuilder.prototype.initializeEventListeners = function () {
        var _this = this;
        this.addEducationBtn.addEventListener('click', function () { return _this.addEntry('education'); });
        this.addWorkBtn.addEventListener('click', function () { return _this.addEntry('work'); });
        this.resetFormBtn.addEventListener('click', function () { return _this.resetForm(); });
        this.printResumeBtn.addEventListener('click', function () { return _this.printResume(); });
        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (_this.validateForm()) {
                var resumeData = _this.getResumeData();
                _this.generateResume(resumeData);
            }
        });
        this.form.addEventListener('input', function () {
            if (_this.validateForm()) {
                var resumeData = _this.getResumeData();
                _this.generateResume(resumeData);
            }
        });
    };
    ResumeBuilder.prototype.addEntry = function (type) {
        var container = document.getElementById("".concat(type, "-entries"));
        var newEntry = document.createElement('div');
        newEntry.className = "".concat(type, "-entry");
        if (type === 'education') {
            newEntry.innerHTML = "\n                <label for=\"degree\">Degree:</label>\n                <input type=\"text\" class=\"degree\" name=\"degree[]\" required>\n                \n                <label for=\"university\">University:</label>\n                <input type=\"text\" class=\"university\" name=\"university[]\" required>\n                \n                <label for=\"graduationYear\">Graduation Year:</label>\n                <input type=\"number\" class=\"graduationYear\" name=\"graduationYear[]\" required min=\"1900\" max=\"2099\">\n            ";
        }
        else {
            newEntry.innerHTML = "\n                <label for=\"jobTitle\">Job Title:</label>\n                <input type=\"text\" class=\"jobTitle\" name=\"jobTitle[]\" required>\n                \n                <label for=\"company\">Company:</label>\n                <input type=\"text\" class=\"company\" name=\"company[]\" required>\n                \n                <label for=\"workDuration\">Duration:</label>\n                <input type=\"text\" class=\"workDuration\" name=\"workDuration[]\" required>\n                \n                <label for=\"responsibilities\">Responsibilities:</label>\n                <textarea class=\"responsibilities\" name=\"responsibilities[]\" required></textarea>\n            ";
        }
        container.insertBefore(newEntry, container.lastElementChild);
    };
    ResumeBuilder.prototype.resetForm = function () {
        this.form.reset();
        var educationEntries = document.querySelectorAll('.education-entry');
        var workEntries = document.querySelectorAll('.work-entry');
        educationEntries.forEach(function (entry, index) {
            if (index !== 0)
                entry.remove();
        });
        workEntries.forEach(function (entry, index) {
            if (index !== 0)
                entry.remove();
        });
        this.resumeOutput.innerHTML = '';
    };
    ResumeBuilder.prototype.printResume = function () {
        window.print();
    };
    ResumeBuilder.prototype.validateForm = function () {
        var _this = this;
        var inputs = Array.from(this.form.querySelectorAll('input, textarea'));
        var isValid = true;
        inputs.forEach(function (input) {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                var fieldName = input.name || input.id || 'This field';
                _this.showError(input, "".concat(fieldName.replace('[]', ''), " is required"));
            }
            else {
                _this.clearError(input);
            }
        });
        return isValid;
    };
    ResumeBuilder.prototype.showError = function (input, message) {
        var _a;
        this.clearError(input);
        var errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(errorElement, input.nextSibling);
    };
    ResumeBuilder.prototype.clearError = function (input) {
        var errorElement = input.nextElementSibling;
        if (errorElement && errorElement.className === 'error') {
            errorElement.remove();
        }
    };
    ResumeBuilder.prototype.getResumeData = function () {
        var formData = new FormData(this.form);
        var educationEntries = [];
        var workEntries = [];
        formData.getAll('degree[]').forEach(function (degree, index) {
            educationEntries.push({
                degree: degree,
                university: formData.getAll('university[]')[index],
                graduationYear: formData.getAll('graduationYear[]')[index],
            });
        });
        formData.getAll('jobTitle[]').forEach(function (jobTitle, index) {
            workEntries.push({
                jobTitle: jobTitle,
                company: formData.getAll('company[]')[index],
                workDuration: formData.getAll('workDuration[]')[index],
                responsibilities: formData.getAll('responsibilities[]')[index],
            });
        });
        return {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            education: educationEntries,
            workExperience: workEntries,
            skills: formData.get('skills').split(',').map(function (skill) { return skill.trim(); }),
        };
    };
    ResumeBuilder.prototype.categorizeSkills = function (skills) {
        var _this = this;
        var categorizedSkills = {};
        skills.forEach(function (skill) {
            var found = false;
            for (var _i = 0, _a = Object.entries(_this.skillCategories); _i < _a.length; _i++) {
                var _b = _a[_i], category = _b[0], data = _b[1];
                if (data.skills.includes(skill)) {
                    if (!categorizedSkills[category]) {
                        categorizedSkills[category] = [];
                    }
                    categorizedSkills[category].push(skill);
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (!categorizedSkills['Other']) {
                    categorizedSkills['Other'] = [];
                }
                categorizedSkills['Other'].push(skill);
            }
        });
        return categorizedSkills;
    };
    ResumeBuilder.prototype.generateResume = function (data) {
        var _this = this;
        var categorizedSkills = this.categorizeSkills(data.skills);
        var skillsHTML = Object.entries(categorizedSkills).map(function (_a) {
            var category = _a[0], skills = _a[1];
            return "\n            <div class=\"mb-2\">\n                <h4 class=\"font-semibold\">".concat(category, "</h4>\n                <div class=\"flex flex-wrap gap-2\">\n                    ").concat(skills.map(function (skill) { return "\n                        <span class=\"px-2 py-1 rounded-full text-sm text-white ".concat(_this.skillCategories[category].color, "\">\n                            ").concat(skill, "\n                        </span>\n                    "); }).join(''), "\n                </div>\n            </div>\n        ");
        }).join('');
        var resumeHTML = "\n            <div class=\"max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg\">\n                <h3 class=\"text-2xl font-bold mb-4\">Personal Information</h3>\n                <p><strong>Name:</strong> ".concat(data.name, "</p>\n                <p><strong>Email:</strong> ").concat(data.email, "</p>\n                <p><strong>Phone:</strong> ").concat(data.phone, "</p>\n\n                <h3 class=\"text-2xl font-bold mt-6 mb-4\">Education</h3>\n                ").concat(data.education.map(function (edu) { return "\n                    <div class=\"mb-4\">\n                        <p class=\"font-semibold\">".concat(edu.degree, "</p>\n                        <p>").concat(edu.university, ", ").concat(edu.graduationYear, "</p>\n                    </div>\n                "); }).join(''), "\n\n                <h3 class=\"text-2xl font-bold mt-6 mb-4\">Work Experience</h3>\n                ").concat(data.workExperience.map(function (work) { return "\n                    <div class=\"mb-4\">\n                        <p class=\"font-semibold\">".concat(work.jobTitle, "</p>\n                        <p>").concat(work.company, ", ").concat(work.workDuration, "</p>\n                        <p>").concat(work.responsibilities, "</p>\n                    </div>\n                "); }).join(''), "\n\n                <h3 class=\"text-2xl font-bold mt-6 mb-4\">Skills</h3>\n                ").concat(skillsHTML, "\n            </div>\n        ");
        this.resumeOutput.innerHTML = resumeHTML;
    };
    return ResumeBuilder;
}());
// Initialize the ResumeBuilder when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new ResumeBuilder();
});
