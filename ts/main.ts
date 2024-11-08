interface EducationEntry {
    degree: string;
    university: string;
    graduationYear: string;
}

interface WorkEntry {
    jobTitle: string;
    company: string;
    workDuration: string;
    responsibilities: string;
}

interface ResumeData {
    name: string;
    email: string;
    phone: string;
    education: EducationEntry[];
    workExperience: WorkEntry[];
    skills: string[];
}

interface SkillCategory {
    [key: string]: {
        color: string;
        skills: string[];
    };
}

class ResumeBuilder {
    private form: HTMLFormElement;
    private resumeOutput: HTMLDivElement;
    private addEducationBtn: HTMLButtonElement;
    private addWorkBtn: HTMLButtonElement;
    private resetFormBtn: HTMLButtonElement;
    private printResumeBtn: HTMLButtonElement;
    private skillCategories: SkillCategory = {
        'Programming Languages': { color: 'bg-blue-500', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
        'Web Technologies': { color: 'bg-green-500', skills: ['HTML', 'CSS', 'React', 'Angular', 'Vue.js'] },
        'Databases': { color: 'bg-yellow-500', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Oracle'] },
        'DevOps': { color: 'bg-red-500', skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure'] },
        'Other': { color: 'bg-purple-500', skills: [] }
    };

    constructor() {
        this.form = document.getElementById('resumeForm') as HTMLFormElement;
        this.resumeOutput = document.getElementById('generatedResume') as HTMLDivElement;
        this.addEducationBtn = document.getElementById('addEducation') as HTMLButtonElement;
        this.addWorkBtn = document.getElementById('addWork') as HTMLButtonElement;
        this.resetFormBtn = document.getElementById('resetForm') as HTMLButtonElement;
        this.printResumeBtn = document.getElementById('printResume') as HTMLButtonElement;

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.addEducationBtn.addEventListener('click', () => this.addEntry('education'));
        this.addWorkBtn.addEventListener('click', () => this.addEntry('work'));
        this.resetFormBtn.addEventListener('click', () => this.resetForm());
        this.printResumeBtn.addEventListener('click', () => this.printResume());

        this.form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
                const resumeData = this.getResumeData();
                this.generateResume(resumeData);
            }
        });

        this.form.addEventListener('input', () => {
            if (this.validateForm()) {
                const resumeData = this.getResumeData();
                this.generateResume(resumeData);
            }
        });
    }

    private addEntry(type: 'education' | 'work'): void {
        const container = document.getElementById(`${type}-entries`) as HTMLFieldSetElement;
        const newEntry = document.createElement('div');
        newEntry.className = `${type}-entry`;
        
        if (type === 'education') {
            newEntry.innerHTML = `
                <label for="degree">Degree:</label>
                <input type="text" class="degree" name="degree[]" required>
                
                <label for="university">University:</label>
                <input type="text" class="university" name="university[]" required>
                
                <label for="graduationYear">Graduation Year:</label>
                <input type="number" class="graduationYear" name="graduationYear[]" required min="1900" max="2099">
            `;
        } else {
            newEntry.innerHTML = `
                <label for="jobTitle">Job Title:</label>
                <input type="text" class="jobTitle" name="jobTitle[]" required>
                
                <label for="company">Company:</label>
                <input type="text" class="company" name="company[]" required>
                
                <label for="workDuration">Duration:</label>
                <input type="text" class="workDuration" name="workDuration[]" required>
                
                <label for="responsibilities">Responsibilities:</label>
                <textarea class="responsibilities" name="responsibilities[]" required></textarea>
            `;
        }

        container.insertBefore(newEntry, container.lastElementChild);
    }

    private resetForm(): void {
        this.form.reset();
        const educationEntries = document.querySelectorAll('.education-entry');
        const workEntries = document.querySelectorAll('.work-entry');

        educationEntries.forEach((entry, index) => {
            if (index !== 0) entry.remove();
        });

        workEntries.forEach((entry, index) => {
            if (index !== 0) entry.remove();
        });

        this.resumeOutput.innerHTML = '';
    }

    private printResume(): void {
        window.print();
    }

    private validateForm(): boolean {
        const inputs = Array.from(this.form.querySelectorAll('input, textarea')) as (HTMLInputElement | HTMLTextAreaElement)[];
        let isValid = true;

        inputs.forEach((input) => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                const fieldName = input.name || input.id || 'This field';
                this.showError(input, `${fieldName.replace('[]', '')} is required`);
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    }

    private showError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
        this.clearError(input);
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        input.parentNode?.insertBefore(errorElement, input.nextSibling);
    }

    private clearError(input: HTMLInputElement | HTMLTextAreaElement): void {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.className === 'error') {
            errorElement.remove();
        }
    }

    private getResumeData(): ResumeData {
        const formData = new FormData(this.form);
        
        const educationEntries: EducationEntry[] = [];
        const workEntries: WorkEntry[] = [];

        formData.getAll('degree[]').forEach((degree, index) => {
            educationEntries.push({
                degree: degree as string,
                university: formData.getAll('university[]')[index] as string,
                graduationYear: formData.getAll('graduationYear[]')[index] as string,
            });
        });

        formData.getAll('jobTitle[]').forEach((jobTitle, index) => {
            workEntries.push({
                jobTitle: jobTitle as string,
                company: formData.getAll('company[]')[index] as string,
                workDuration: formData.getAll('workDuration[]')[index] as string,
                responsibilities: formData.getAll('responsibilities[]')[index] as string,
            });
        });

        return {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            education: educationEntries,
            workExperience: workEntries,
            skills: (formData.get('skills') as string).split(',').map(skill => skill.trim()),
        };
    }

    private categorizeSkills(skills: string[]): { [key: string]: string[] } {
        const categorizedSkills: { [key: string]: string[] } = {};
        
        skills.forEach((skill: string) => {
            let found = false;
            for (const [category, data] of Object.entries(this.skillCategories)) {
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
    }

    private generateResume(data: ResumeData): void {
        const categorizedSkills = this.categorizeSkills(data.skills);
        const skillsHTML = Object.entries(categorizedSkills).map(([category, skills]) => `
            <div class="mb-2">
                <h4 class="font-semibold">${category}</h4>
                <div class="flex flex-wrap gap-2">
                    ${skills.map(skill => `
                        <span class="px-2 py-1 rounded-full text-sm text-white ${this.skillCategories[category].color}">
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const resumeHTML = `
            <div class="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
                <h3 class="text-2xl font-bold mb-4">Personal Information</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>

                <h3 class="text-2xl font-bold mt-6 mb-4">Education</h3>
                ${data.education.map(edu => `
                    <div class="mb-4">
                        <p class="font-semibold">${edu.degree}</p>
                        <p>${edu.university}, ${edu.graduationYear}</p>
                    </div>
                `).join('')}

                <h3 class="text-2xl font-bold mt-6 mb-4">Work Experience</h3>
                ${data.workExperience.map(work => `
                    <div class="mb-4">
                        <p class="font-semibold">${work.jobTitle}</p>
                        <p>${work.company}, ${work.workDuration}</p>
                        <p>${work.responsibilities}</p>
                    </div>
                `).join('')}

                <h3 class="text-2xl font-bold mt-6 mb-4">Skills</h3>
                ${skillsHTML}
            </div>
        `;

        this.resumeOutput.innerHTML = resumeHTML;
    }
}

// Initialize the ResumeBuilder when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeBuilder();
});