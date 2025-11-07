/*
 * ======================================
 * Frontend JavaScript (script.js) - FIXED VERSION
 * ======================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Global State ---
    const state = {
        user: null,
        cases: [],
    };

    // --- DOM Element Selectors ---
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    const authLinks = document.getElementById('auth-links');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const guestLoginBtn = document.getElementById('guest-login-btn');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const fileCaseForm = document.getElementById('file-case-form');
    const scheduleHearingForm = document.getElementById('schedule-hearing-form'); 
    const addJudgementForm = document.getElementById('add-judgement-form');
    
    const reportsContainer = document.getElementById('reports-container'); 
    const reportCasesTypeBtn = document.getElementById('report-cases-type'); 
    const reportJudgesNoHearingsBtn = document.getElementById('report-judges-no-hearings'); 
    const reportsOutput = document.getElementById('reports-output'); 
    
    const caseTableBody = document.getElementById('case-table-body');
    const statusFilter = document.getElementById('status-filter');

    const modal = document.getElementById('case-details-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    const modalTitle = document.getElementById('modal-case-title');
    const modalContent = document.getElementById('modal-case-details-content');
    const modalError = document.getElementById('modal-error');
    
    const updateStatusForm = document.getElementById('update-status-form');
    const updateStatusCaseId = document.getElementById('update-status-case-id');
    const newStatusSelect = document.getElementById('new-status');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // --- Helper Functions ---

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = 'fixed bottom-10 right-10 p-4 rounded-lg shadow-lg text-white';
        
        if (type === 'success') {
            toast.classList.add('bg-green-500');
        } else {
            toast.classList.add('bg-red-500');
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function navigate(view) {
        loginView.classList.add('hidden');
        registerView.classList.add('hidden');
        dashboardView.classList.add('hidden');

        if (view === 'login') {
            loginView.classList.remove('hidden');
        } else if (view === 'register') {
            registerView.classList.remove('hidden');
        } else if (view === 'dashboard') {
            dashboardView.classList.remove('hidden');
        }
    }

    function updateUI() {
        if (state.user) {
            navigate('dashboard');
            
            authLinks.innerHTML = `
                <span class="text-gray-700">Welcome, <strong>${state.user.username}</strong> (${state.user.role})</span>
                <button id="logout-btn" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);

            const allRoleElements = document.querySelectorAll('.auth-lawyer, .auth-admin');
            allRoleElements.forEach(el => el.classList.add('hidden'));

            if (state.user.role === 'lawyer') {
                document.querySelectorAll('.auth-lawyer').forEach(el => el.classList.remove('hidden'));
            } else if (state.user.role === 'admin') {
                document.querySelectorAll('.auth-lawyer, .auth-admin').forEach(el => el.classList.remove('hidden'));
            }
            
        } else {
            navigate('login');
            authLinks.innerHTML = '';
        }
    }

    // --- API Fetch Functions ---

    async function fetchCases(status = '') {
        try {
            // FIX: Changed to lowercase 'cases' to match backend routes
            const url = status ? `/api/cases?status=${status}` : '/api/cases';
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch cases');
            }
            
            state.cases = await response.json();
            renderCaseTable();
        } catch (error) {
            console.error('Error fetching cases:', error);
            showToast('Could not load cases.', 'error');
        }
    }

    async function fetchCaseDetails(caseId) {
        try {
            // FIX: Changed to lowercase 'cases'
            const response = await fetch(`/api/cases/${caseId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch case details');
            }
            const caseDetails = await response.json();
            renderModal(caseDetails);
        } catch (error) {
            console.error('Error fetching case details:', error);
            modalError.textContent = 'Could not load details.';
        }
    }

    async function checkAuthStatus() {
        try {
            // FIX: Changed to lowercase 'auth'
            const response = await fetch('/api/auth/status');
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    state.user = data.user;
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
        updateUI();
        if (state.user) {
            fetchCases();
        }
    }

    // --- Render Functions ---

    function renderCaseTable() {
        caseTableBody.innerHTML = '';
        
        if (state.cases.length === 0) {
            caseTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-6 text-gray-500">No cases found.</td></tr>';
            return;
        }

        state.cases.forEach(caseItem => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${caseItem.CASE_ID}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${caseItem.CASE_TITLE}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        caseItem.STATUS === 'Closed' ? 'bg-red-100 text-red-800' :
                        caseItem.STATUS === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }">
                        ${caseItem.STATUS}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${caseItem.COURT_NAME}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button data-case-id="${caseItem.CASE_ID}"
                    class="text-blue-600 hover:text-blue-900 details-btn cursor-pointer pointer-events-auto">
                    Details
                    </button>
                </td>
            `;
            caseTableBody.appendChild(tr);
        });
    }

    function renderModal(caseDetails) {
        modalTitle.textContent = `${caseDetails.CASE_TITLE} (ID: ${caseDetails.CASE_ID})`;
        
        const display = (data) => data !== null && data !== undefined ? data : '<em class="text-gray-400">N/A</em>';

        modalContent.innerHTML = `
            <div class="detail-item"><strong>Status:</strong> <span>${display(caseDetails.STATUS)}</span></div>
            <div class="detail-item"><strong>Case Type:</strong> <span>${display(caseDetails.CASE_TYPE)}</span></div>
            <div class="detail-item"><strong>Date Filed:</strong> <span>${display(new Date(caseDetails.DATE_FILED).toLocaleDateString())}</span></div>
            
            <div class="detail-item"><strong>Total Hearings:</strong> <span class="font-bold text-blue-600">${display(caseDetails.TotalHearings)}</span></div>

            <div class="detail-item"><strong>Court:</strong> <span>${display(caseDetails.COURT_NAME)}</span></div>
            <div class="detail-item"><strong>Lawyer:</strong> <span>${display(caseDetails.LAWYER_NAME)} (${display(caseDetails.BAR_COUNCIL_ID)})</span></div>
            <div class="detail-item"><strong>Litigant:</strong> <span>${display(caseDetails.LITIGANT_NAME)}</span></div>
            <div class="detail-item"><strong>Law Section:</strong> <span>${display(caseDetails.ACT_NAME)}, S. ${display(caseDetails.SECTION_NUMBER)} (${display(caseDetails.SECTION_TITLE)})</span></div>
            <div class="detail-item"><strong>Judgement:</strong> <span>${display(caseDetails.JUDGEMENT_OUTCOME)}</span></div>
            <div class="detail-item"><strong>Judgement Date:</strong> <span>${caseDetails.JUDGEMENT_DATE ? new Date(caseDetails.JUDGEMENT_DATE).toLocaleDateString() : '<em class="text-gray-400">N/A</em>'}</span></div>
        `;

        updateStatusCaseId.value = caseDetails.CASE_ID;
        newStatusSelect.value = caseDetails.STATUS;
        modalDeleteBtn.dataset.id = caseDetails.CASE_ID;
        modalError.textContent = '';
        
        modal.classList.remove('hidden');
    }

    // --- Event Handlers ---

    showRegisterBtn.addEventListener('click', () => navigate('register'));
    showLoginBtn.addEventListener('click', () => navigate('login'));
    
    guestLoginBtn.addEventListener('click', () => {
        state.user = { username: 'Guest', role: 'public' };
        updateUI();
        fetchCases();
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    fileCaseForm.addEventListener('submit', handleFileCase);
    scheduleHearingForm.addEventListener('submit', handleScheduleHearing);
    addJudgementForm.addEventListener('submit', handleAddJudgement);
    
    statusFilter.addEventListener('change', (e) => fetchCases(e.target.value));

    modalCloseBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    updateStatusForm.addEventListener('submit', handleUpdateStatus);
    modalDeleteBtn.addEventListener('click', handleDeleteCase);

    // FIX: Changed event delegation to use data-case-id
    caseTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('details-btn')) {
            const caseId = e.target.dataset.caseId;
            console.log('Details button clicked for case:', caseId);
            fetchCaseDetails(caseId);
        }
    });
    
    reportCasesTypeBtn.addEventListener('click', () => handleReport('cases-by-type'));
    reportJudgesNoHearingsBtn.addEventListener('click', () => handleReport('judges-no-hearings'));

    // --- Handler Logic Functions ---

    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        
        document.getElementById('login-error').classList.add('hidden');
        
        try {
            // FIX: Changed to lowercase 'auth'
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            state.user = result.user;
            updateUI();
            fetchCases();
            loginForm.reset();
            showToast('Login successful!', 'success');
            
        } catch (error) {
            console.error('Login error:', error);
            document.getElementById('login-error').textContent = error.message;
            document.getElementById('login-error').classList.remove('hidden');
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());
        data.role = 'lawyer';
        
        document.getElementById('register-error').classList.add('hidden');
        
        try {
            // FIX: Changed to lowercase 'auth'
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            navigate('login');
            registerForm.reset();
            showToast('Registration successful! Please log in.', 'success');
            
        } catch (error) {
            console.error('Registration error:', error);
            document.getElementById('register-error').textContent = error.message;
            document.getElementById('register-error').classList.remove('hidden');
        }
    }

    async function handleLogout() {
        try {
            // FIX: Changed to lowercase 'auth'
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        state.user = null;
        state.cases = [];
        renderCaseTable();
        updateUI();
        showToast('You have been logged out.', 'success');
    }

    async function handleFileCase(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Filing case with data:', data);
        
        if (!data.case_title || !data.case_type || !data.court_id || !data.litigant_id || !data.section_id) {
            showToast('Missing required fields.', 'error');
            return;
        }

        try {
            // FIX: Changed to lowercase 'cases'
            const response = await fetch('/api/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (!response.ok) {
                if (result.message && result.message.includes('foreign key constraint fails')) {
                    throw new Error('Failed: Invalid Litigant, Court, or Section ID.');
                }
                throw new Error(result.message || 'Failed to file case');
            }

            showToast('Case filed successfully!', 'success');
            fileCaseForm.reset();
            fetchCases(statusFilter.value);
            
        } catch (error) {
            console.error('File case error:', error);
            showToast(error.message, 'error');
        }
    }
    
    async function handleScheduleHearing(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log('Scheduling hearing with data:', data);

        // FIX: Correct field name mapping
        const hearingData = {
            case_id: data.case_id,
            judge_id: data.judge_id,
            date: data.hearing_date,  // Maps 'hearing_date' to 'date'
            summary: data.summary
        };

        if (!hearingData.case_id || !hearingData.judge_id || !hearingData.date) {
            showToast('Missing required fields.', 'error');
            return;
        }
        
        try {
            // FIX: Changed to lowercase 'hearings'
            const response = await fetch('/api/hearings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hearingData),
            });
            
            const result = await response.json();

            if (!response.ok) {
                if (result.message && result.message.includes('Cannot schedule hearing')) {
                    throw new Error('Failed: The case is not "Ongoing".');
                }
                throw new Error(result.message || 'Failed to schedule hearing');
            }

            showToast('Hearing scheduled successfully!', 'success');
            scheduleHearingForm.reset();
            
            if (!modal.classList.contains('hidden') && updateStatusCaseId.value === hearingData.case_id) {
                fetchCaseDetails(hearingData.case_id);
            }
            
        } catch (error) {
            console.error('Schedule hearing error:', error);
            showToast(error.message, 'error');
        }
    }

    async function handleAddJudgement(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log('Adding judgement with data:', data);

        if (!data.case_id || !data.judge_id || !data.outcome) {
            showToast('Missing required fields.', 'error');
            return;
        }

        try {
            // FIX: Changed to lowercase 'judgements'
            const response = await fetch('/api/judgements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (!response.ok) {
                if (result.message && result.message.includes('Cannot add judgement')) {
                    throw new Error('Failed: The case is not "Awaiting Judgment".');
                }
                throw new Error(result.message || 'Failed to add judgement');
            }

            showToast('Judgement added successfully!', 'success');
            addJudgementForm.reset();
            fetchCases(statusFilter.value); 
            
        } catch (error) {
            console.error('Add judgement error:', error);
            showToast(error.message, 'error');
        }
    }

    async function handleUpdateStatus(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const caseId = updateStatusCaseId.value;
        
        try {
            // FIX: Changed to lowercase 'cases'
            const response = await fetch(`/api/cases/${caseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: data.status }),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }
            
            showToast('Status updated successfully!', 'success');
            modal.classList.add('hidden');
            fetchCases(statusFilter.value);

        } catch (error) {
            console.error('Update status error:', error);
            modalError.textContent = error.message;
        }
    }
    
    async function handleDeleteCase(e) {
        const caseId = e.target.dataset.id;
        
        if (!confirm(`Are you sure you want to delete Case ID ${caseId}? This action cannot be undone.`)) {
            return;
        }

        try {
            // FIX: Changed to lowercase 'cases'
            const response = await fetch(`/api/cases/${caseId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete case');
            }
            
            showToast('Case deleted successfully!', 'success');
            modal.classList.add('hidden');
            fetchCases(statusFilter.value);

        } catch (error) {
            console.error('Delete case error:', error);
            modalError.textContent = error.message;
        }
    }

    async function handleReport(reportType) {
        let url = '';
        if (reportType === 'cases-by-type') {
            // FIX: Changed to lowercase
            url = '/api/reports/cases-by-type';
        } else if (reportType === 'judges-no-hearings') {
            // FIX: Changed to lowercase
            url = '/api/reports/judges-no-hearings';
        }

        reportsOutput.innerHTML = `<pre class="text-sm text-gray-700">Loading...</pre>`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch report');
            }
            reportsOutput.innerHTML = `<pre class="text-sm text-gray-700">${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            reportsOutput.innerHTML = `<pre class="text-sm text-red-500">${error.message}</pre>`;
        }
    }

    // --- Initial Application Load ---
    checkAuthStatus();

});