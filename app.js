// === DATA MANAGEMENT ===
class AppData {
    // Consultation Requests
    static getConsultationRequests() {
        return JSON.parse(localStorage.getItem('consultationRequests')) || [];
    }

    static saveConsultationRequest(request) {
        const requests = this.getConsultationRequests();
        request.id = Date.now();
        request.status = 'new';
        request.date = new Date().toISOString();
        requests.push(request);
        localStorage.setItem('consultationRequests', JSON.stringify(requests));
        return request;
    }

    static updateConsultationStatus(requestId, status) {
        const requests = this.getConsultationRequests();
        const request = requests.find(req => req.id === requestId);
        if (request) {
            request.status = status;
            localStorage.setItem('consultationRequests', JSON.stringify(requests));
        }
    }

    // Project Data
    static getProjectData() {
        const defaultProject = {
            name: "LuxeBrand Global Website",
            description: "Complete website redesign with e-commerce integration and AI-powered personalization",
            progress: 75,
            daysRemaining: 14,
            tasksCompleted: 24,
            totalTasks: 32,
            teamMembers: 5,
            timeline: [
                {
                    id: 1,
                    title: "Project Kickoff",
                    description: "Initial meeting to establish project goals, timeline, and deliverables.",
                    date: "2025-01-10",
                    status: "completed"
                },
                {
                    id: 2,
                    title: "Design Phase",
                    description: "Creation of wireframes, mockups, and design concepts for approval.",
                    date: "2025-01-25",
                    status: "completed"
                },
                {
                    id: 3,
                    title: "Development Phase",
                    description: "Implementation of frontend and backend functionality.",
                    date: "2025-02-15",
                    status: "active"
                },
                {
                    id: 4,
                    title: "Content Integration",
                    description: "Adding client-provided content and media to the website.",
                    date: "2025-03-01",
                    status: "upcoming"
                }
            ],
            updates: [
                {
                    id: 1,
                    title: "Development Milestone Reached",
                    description: "The backend API integration has been completed successfully. Frontend development is now 80% complete.",
                    time: "2 hours ago",
                    icon: "fas fa-code"
                },
                {
                    id: 2,
                    title: "Design Review Completed",
                    description: "Client feedback has been incorporated into the design revisions. Final mockups approved.",
                    time: "1 day ago",
                    icon: "fas fa-palette"
                }
            ]
        };

        const storedProject = localStorage.getItem('clientProject');
        return storedProject ? JSON.parse(storedProject) : defaultProject;
    }

    static saveProjectData(projectData) {
        localStorage.setItem('clientProject', JSON.stringify(projectData));
    }

    static addProjectUpdate(update) {
        const projectData = this.getProjectData();
        update.id = Date.now();
        update.time = "Just now";
        projectData.updates.unshift(update);
        this.saveProjectData(projectData);
        return update;
    }

    static addTimelineItem(item) {
        const projectData = this.getProjectData();
        item.id = Date.now();
        projectData.timeline.push(item);
        this.saveProjectData(projectData);
        return item;
    }

    static updateProjectProgress(progressData) {
        const projectData = this.getProjectData();
        Object.assign(projectData, progressData);
        this.saveProjectData(projectData);
        return projectData;
    }
}

// === REAL-TIME UPDATES ===
class RealTimeUpdates {
    static listeners = new Set();

    static subscribe(callback) {
        this.listeners.add(callback);
    }

    static unsubscribe(callback) {
        this.listeners.delete(callback);
    }

    static notify(data) {
        this.listeners.forEach(callback => callback(data));
    }

    static startPolling() {
        // Simulate real-time updates every 5 seconds
        setInterval(() => {
            const projectData = AppData.getProjectData();
            this.notify({ type: 'projectUpdate', data: projectData });
        }, 5000);
    }
}

// === COMMON UI FUNCTIONS ===
class UIHelper {
    static showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const toastIcon = toast.querySelector('.toast-icon');
        toastIcon.textContent = type === 'success' ? '✓' : '⚠️';
        toastIcon.style.background = type === 'success' ? 'var(--gradient-neon)' : '#dc2626';
        
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    static getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
}