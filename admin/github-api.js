// =========================================
// GITHUB API MODULE - For Git-as-Storage
// =========================================

class GitHubAPI {
    constructor() {
        this.owner = 'saintkarimm';
        this.repo = 'WENAMY-3';
        this.baseUrl = 'https://api.github.com';
        // Pre-configured token - replace with your actual token
        this.token = localStorage.getItem('githubToken') || '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';
        this.branch = 'main';
    }

    // Set GitHub Personal Access Token
    setToken(token) {
        this.token = token;
        localStorage.setItem('githubToken', token);
    }

    // Get stored token
    getToken() {
        return this.token;
    }

    // Check if token is set
    isAuthenticated() {
        return !!this.token;
    }

    // Make authenticated API request
    async request(endpoint, options = {}) {
        if (!this.token) {
            throw new Error('GitHub token not set. Please configure in Settings.');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `GitHub API error: ${response.status}`);
        }

        return response.json();
    }

    // =========================================
    // FILE OPERATIONS
    // =========================================

    // Get file content
    async getFile(path) {
        const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`);
        
        if (data.content) {
            // Decode base64 content
            const content = atob(data.content.replace(/\n/g, ''));
            return {
                content: JSON.parse(content),
                sha: data.sha,
                path: data.path
            };
        }
        
        throw new Error('File content not found');
    }

    // Create or update file
    async saveFile(path, content, message, sha = null) {
        const body = {
            message: message || `Update ${path}`,
            content: btoa(JSON.stringify(content, null, 2)),
            branch: this.branch
        };

        if (sha) {
            body.sha = sha;
        }

        return this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // Delete file
    async deleteFile(path, sha, message) {
        return this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify({
                message: message || `Delete ${path}`,
                sha: sha,
                branch: this.branch
            })
        });
    }

    // =========================================
    // PROJECTS DATA OPERATIONS
    // =========================================

    // Load all projects
    async loadProjects() {
        try {
            const file = await this.getFile('data/projects.json');
            return file.content;
        } catch (error) {
            console.error('Error loading projects:', error);
            return {};
        }
    }

    // Save all projects
    async saveProjects(projects, message = 'Update projects data') {
        try {
            let sha = null;
            try {
                const existing = await this.getFile('data/projects.json');
                sha = existing.sha;
            } catch (e) {
                // File doesn't exist yet
            }

            await this.saveFile('data/projects.json', projects, message, sha);
            return true;
        } catch (error) {
            console.error('Error saving projects:', error);
            throw error;
        }
    }

    // Add new project
    async addProject(projectId, projectData) {
        const projects = await this.loadProjects();
        projects[projectId] = {
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return this.saveProjects(projects, `Add project: ${projectData.name}`);
    }

    // Update project
    async updateProject(projectId, projectData) {
        const projects = await this.loadProjects();
        if (projects[projectId]) {
            projects[projectId] = {
                ...projects[projectId],
                ...projectData,
                updatedAt: new Date().toISOString()
            };
            return this.saveProjects(projects, `Update project: ${projectData.name || projectId}`);
        }
        throw new Error('Project not found');
    }

    // Delete project
    async deleteProject(projectId) {
        const projects = await this.loadProjects();
        if (projects[projectId]) {
            const projectName = projects[projectId].name;
            delete projects[projectId];
            return this.saveProjects(projects, `Delete project: ${projectName}`);
        }
        throw new Error('Project not found');
    }

    // =========================================
    // OFF-PLAN PROJECTS OPERATIONS
    // =========================================

    // Load off-plan projects
    async loadOffplanProjects() {
        try {
            const file = await this.getFile('data/offplan-projects.json');
            return file.content;
        } catch (error) {
            console.error('Error loading off-plan projects:', error);
            return { offplan: [], categories: [], metadata: {} };
        }
    }

    // Save off-plan projects
    async saveOffplanProjects(data, message = 'Update off-plan projects') {
        try {
            let sha = null;
            try {
                const existing = await this.getFile('data/offplan-projects.json');
                sha = existing.sha;
            } catch (e) {
                // File doesn't exist yet
            }

            data.metadata = {
                ...data.metadata,
                lastUpdated: new Date().toISOString()
            };

            await this.saveFile('data/offplan-projects.json', data, message, sha);
            return true;
        } catch (error) {
            console.error('Error saving off-plan projects:', error);
            throw error;
        }
    }

    // Add off-plan project
    async addOffplanProject(projectData) {
        const data = await this.loadOffplanProjects();
        const newProject = {
            ...projectData,
            id: projectData.id || `offplan-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.offplan.push(newProject);
        return this.saveOffplanProjects(data, `Add off-plan project: ${projectData.title}`);
    }

    // Update off-plan project
    async updateOffplanProject(projectId, projectData) {
        const data = await this.loadOffplanProjects();
        const index = data.offplan.findIndex(p => p.id === projectId);
        if (index !== -1) {
            data.offplan[index] = {
                ...data.offplan[index],
                ...projectData,
                updatedAt: new Date().toISOString()
            };
            return this.saveOffplanProjects(data, `Update off-plan project: ${projectData.title}`);
        }
        throw new Error('Off-plan project not found');
    }

    // Delete off-plan project
    async deleteOffplanProject(projectId) {
        const data = await this.loadOffplanProjects();
        const project = data.offplan.find(p => p.id === projectId);
        if (project) {
            data.offplan = data.offplan.filter(p => p.id !== projectId);
            return this.saveOffplanProjects(data, `Delete off-plan project: ${project.title}`);
        }
        throw new Error('Off-plan project not found');
    }

    // =========================================
    // IMAGE UPLOAD OPERATIONS
    // =========================================

    // Upload image to GitHub
    async uploadImage(file, projectFolder, fileName) {
        const path = `images/properties/${projectFolder}/${fileName}`;
        
        // Convert file to base64
        const base64 = await this.fileToBase64(file);
        
        // Check if file exists
        let sha = null;
        try {
            const existing = await this.getFile(path);
            sha = existing.sha;
        } catch (e) {
            // File doesn't exist
        }

        await this.saveFile(path, base64, `Upload image: ${fileName}`, sha);
        return path;
    }

    // Upload off-plan image
    async uploadOffplanImage(file, projectFolder, fileName) {
        const path = `images/offplan/${projectFolder}/${fileName}`;
        
        const base64 = await this.fileToBase64(file);
        
        let sha = null;
        try {
            const existing = await this.getFile(path);
            sha = existing.sha;
        } catch (e) {}

        await this.saveFile(path, base64, `Upload off-plan image: ${fileName}`, sha);
        return path;
    }

    // Convert File to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // =========================================
    // UTILITY METHODS
    // =========================================

    // Test connection
    async testConnection() {
        try {
            await this.request(`/repos/${this.owner}/${this.repo}`);
            return { success: true, message: 'Connected successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Get latest commit SHA
    async getLatestCommit() {
        const data = await this.request(`/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`);
        return data.object.sha;
    }
}

// Create global instance
window.githubAPI = new GitHubAPI();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubAPI;
}
