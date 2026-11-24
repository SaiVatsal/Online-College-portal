/**
 * Academic Management Portal Core Logic
 * Fast, Vanilla JS, Zero AI styling, High accuracy CGPA & Attendance calculation.
 */

const STORAGE_KEY = 'AIT_PORTAL_DATA_V1';
const SESSION_STORAGE_KEY = 'AIT_PORTAL_ACTIVE_SESSION';
const TAB_STORAGE_KEY = 'AIT_PORTAL_ACTIVE_TAB';

// Initial Seed Database
const DEFAULT_DATA = {
  users: [
    { username: 'alex@student.edu', password: 'student123', role: 'student', studentId: 'S101', name: 'Alex Rivera' },
    { username: 'priya@student.edu', password: 'student123', role: 'student', studentId: 'S102', name: 'Priya Patel' },
    { username: 'marcus@student.edu', password: 'student123', role: 'student', studentId: 'S103', name: 'Marcus Chen' },
    { username: 'dr.sharma@faculty.edu', password: 'faculty123', role: 'faculty', facultyId: 'F201', name: 'Dr. R. Sharma' },
    { username: 'admin@portal.edu', password: 'admin123', role: 'admin', name: 'Registrar Admin' }
  ],
  students: [
    {
      id: 'S101',
      rollNo: 'CS-2024-041',
      name: 'Alex Rivera',
      email: 'alex@student.edu',
      program: 'B.Tech Computer Science',
      semester: 'Semester 5',
      cgpa: 8.41
    },
    {
      id: 'S102',
      rollNo: 'CS-2024-042',
      name: 'Priya Patel',
      email: 'priya@student.edu',
      program: 'B.Tech Computer Science',
      semester: 'Semester 5',
      cgpa: 9.12
    },
    {
      id: 'S103',
      rollNo: 'CS-2024-043',
      name: 'Marcus Chen',
      email: 'marcus@student.edu',
      program: 'B.Tech Computer Science',
      semester: 'Semester 5',
      cgpa: 7.25
    }
  ],
  courses: [
    { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, faculty: 'Dr. R. Sharma' },
    { code: 'CS302', title: 'Database Management Systems', credits: 4, faculty: 'Prof. K. Verma' },
    { code: 'CS303', title: 'Computer Networks', credits: 3, faculty: 'Dr. R. Sharma' },
    { code: 'CS304', title: 'Operating Systems', credits: 4, faculty: 'Dr. A. Joseph' },
    { code: 'CS305', title: 'Software Engineering', credits: 3, faculty: 'Prof. N. Rao' }
  ],
  // Marks per student per course: internal (max 40), exam (max 60)
  marks: {
    'S101': {
      'CS301': { internal: 34, exam: 52 },
      'CS302': { internal: 36, exam: 48 },
      'CS303': { internal: 30, exam: 42 },
      'CS304': { internal: 38, exam: 55 },
      'CS305': { internal: 32, exam: 44 }
    },
    'S102': {
      'CS301': { internal: 39, exam: 58 },
      'CS302': { internal: 38, exam: 56 },
      'CS303': { internal: 36, exam: 52 },
      'CS304': { internal: 39, exam: 54 },
      'CS305': { internal: 37, exam: 51 }
    },
    'S103': {
      'CS301': { internal: 25, exam: 38 },
      'CS302': { internal: 28, exam: 40 },
      'CS303': { internal: 24, exam: 35 },
      'CS304': { internal: 30, exam: 42 },
      'CS305': { internal: 26, exam: 39 }
    }
  },
  // Attendance records: held, attended
  attendance: {
    'S101': {
      'CS301': { held: 42, attended: 36 },
      'CS302': { held: 38, attended: 35 },
      'CS303': { held: 35, attended: 24 }, // Shortage case demo
      'CS304': { held: 40, attended: 38 },
      'CS305': { held: 30, attended: 28 }
    },
    'S102': {
      'CS301': { held: 42, attended: 40 },
      'CS302': { held: 38, attended: 37 },
      'CS303': { held: 35, attended: 33 },
      'CS304': { held: 40, attended: 39 },
      'CS305': { held: 30, attended: 29 }
    },
    'S103': {
      'CS301': { held: 42, attended: 30 },
      'CS302': { held: 38, attended: 29 },
      'CS303': { held: 35, attended: 28 },
      'CS304': { held: 40, attended: 31 },
      'CS305': { held: 30, attended: 22 }
    }
  },
  // Weekly timetable schedule
  timetable: [
    { day: 'Monday', s1: 'CS301 (Lab 1)', s2: 'CS301 (Hall A)', s3: 'CS302 (Hall B)', s4: 'CS304 (Hall C)', s5: 'Library / Remedial' },
    { day: 'Tuesday', s1: 'CS303 (Hall A)', s2: 'CS304 (Hall B)', s3: 'CS302 (Lab 2)', s4: 'CS305 (Hall A)', s5: 'Mentorship' },
    { day: 'Wednesday', s1: 'CS301 (Hall A)', s2: 'CS303 (Hall C)', s3: 'CS304 (Hall B)', s4: 'CS305 (Hall B)', s5: 'Sports / Clubs' },
    { day: 'Thursday', s1: 'CS302 (Hall B)', s2: 'CS305 (Hall A)', s3: 'CS303 (Lab 3)', s4: 'CS301 (Hall A)', s5: 'Project Work' },
    { day: 'Friday', s1: 'CS304 (Hall B)', s2: 'CS302 (Hall A)', s3: 'CS301 (Hall C)', s4: 'CS303 (Hall B)', s5: 'Weekly Seminar' }
  ],
  // Scheduled Exams
  exams: [
    { id: 'ex-1', code: 'CS301', type: 'Mid-Term Test', date: '2026-12-05', time: '10:00 AM - 12:00 PM', room: 'Exam Hall 1' },
    { id: 'ex-2', code: 'CS302', type: 'Mid-Term Test', date: '2026-12-07', time: '10:00 AM - 12:00 PM', room: 'Exam Hall 2' },
    { id: 'ex-3', code: 'CS303', type: 'Mid-Term Test', date: '2026-12-09', time: '10:00 AM - 12:00 PM', room: 'Exam Hall 1' },
    { id: 'ex-4', code: 'CS304', type: 'Lab Practical', date: '2026-12-11', time: '01:30 PM - 04:30 PM', room: 'Software Lab 3' }
  ]
};

// Application State Controller
class StudentPortalApp {
  constructor() {
    this.data = this.loadData();
    this.currentUser = null;
    this.activeTab = null;
    this.init();
  }

  // Load and sync localStorage with fallback
  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.users) parsed.users = [];
        DEFAULT_DATA.users.forEach(defUser => {
          if (!parsed.users.some(u => u.username.toLowerCase() === defUser.username.toLowerCase())) {
            parsed.users.push(defUser);
          }
        });
        if (!parsed.students) parsed.students = JSON.parse(JSON.stringify(DEFAULT_DATA.students));
        if (!parsed.courses) parsed.courses = JSON.parse(JSON.stringify(DEFAULT_DATA.courses));
        if (!parsed.marks) parsed.marks = JSON.parse(JSON.stringify(DEFAULT_DATA.marks));
        if (!parsed.attendance) parsed.attendance = JSON.parse(JSON.stringify(DEFAULT_DATA.attendance));
        if (!parsed.timetable) parsed.timetable = JSON.parse(JSON.stringify(DEFAULT_DATA.timetable));
        if (!parsed.exams) parsed.exams = JSON.parse(JSON.stringify(DEFAULT_DATA.exams));

        // Save back synchronized version so everything is preserved
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {}
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or corrupted, loading default state', e);
    }
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {}
    return fresh;
  }

  saveData(dataToSave = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  init() {
    // Check if session exists in localStorage or sessionStorage (persists across refresh)
    let savedSession = null;
    try {
      savedSession = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem('AIT_PORTAL_SESSION');
    } catch (e) {}

    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const liveUser = this.data.users.find(u => u.username.toLowerCase() === user.username.toLowerCase()) || user;
        this.loginUser(liveUser);
        return;
      } catch (e) {
        try {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          sessionStorage.removeItem('AIT_PORTAL_SESSION');
        } catch (err) {}
      }
    }
    this.showLoginView();
  }

  // Switch between Sign In and Registration cards
  showRegisterView() {
    document.getElementById('signInCard').style.display = 'none';
    document.getElementById('registerCard').style.display = 'block';
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('registerSuccess').style.display = 'none';
    document.getElementById('registerForm').reset();
    this.handleRegRoleChange();
  }

  showLoginView() {
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('portalView').style.display = 'none';
    document.getElementById('userSession').style.display = 'none';
    document.getElementById('signInCard').style.display = 'block';
    const regCard = document.getElementById('registerCard');
    if (regCard) regCard.style.display = 'none';
    const uInput = document.getElementById('usernameInput');
    const pInput = document.getElementById('passwordInput');
    if (uInput) uInput.value = '';
    if (pInput) pInput.value = '';
    const err = document.getElementById('loginError');
    if (err) err.style.display = 'none';
  }

  handleRegRoleChange() {
    const role = document.getElementById('regRole').value;
    const idLabel = document.getElementById('regIdentifierLabel');
    const idInput = document.getElementById('regIdentifier');
    const progLabel = document.getElementById('regProgramLabel');
    const progInput = document.getElementById('regProgram');

    if (role === 'faculty') {
      idLabel.textContent = 'Faculty / Staff ID';
      idInput.placeholder = 'e.g. FAC-2024-012';
      progLabel.textContent = 'Department';
      progInput.placeholder = 'e.g. Department of Computer Science';
    } else {
      idLabel.textContent = 'Roll Number';
      idInput.placeholder = 'e.g. CS-2024-050';
      progLabel.textContent = 'Academic Program';
      progInput.placeholder = 'e.g. B.Tech Computer Science';
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const role = document.getElementById('regRole').value;
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const identifier = document.getElementById('regIdentifier').value.trim();
    const program = document.getElementById('regProgram').value.trim();
    const password = document.getElementById('regPassword').value;
    const errBox = document.getElementById('registerError');
    const succBox = document.getElementById('registerSuccess');

    errBox.style.display = 'none';
    succBox.style.display = 'none';

    // Check if user already exists
    const exists = this.data.users.some(u => u.username.toLowerCase() === email);
    if (exists) {
      errBox.textContent = 'An account with this email address already exists. Please sign in instead.';
      errBox.style.display = 'block';
      return;
    }

    let newUser = null;

    if (role === 'student') {
      const studentId = 'S' + Math.floor(1000 + Math.random() * 9000);
      const newStudent = {
        id: studentId,
        rollNo: identifier,
        name: name,
        email: email,
        program: program,
        semester: 'Semester 1',
        cgpa: 0.00
      };

      this.data.students.push(newStudent);

      // Initialize default zero marks and attendance for courses
      if (!this.data.marks[studentId]) this.data.marks[studentId] = {};
      if (!this.data.attendance[studentId]) this.data.attendance[studentId] = {};

      this.data.courses.forEach(c => {
        this.data.marks[studentId][c.code] = { internal: 0, exam: 0 };
        this.data.attendance[studentId][c.code] = { held: 0, attended: 0 };
      });

      newUser = {
        username: email,
        password: password,
        role: 'student',
        studentId: studentId,
        name: name
      };
    } else {
      const facultyId = 'F' + Math.floor(1000 + Math.random() * 9000);
      newUser = {
        username: email,
        password: password,
        role: 'faculty',
        facultyId: facultyId,
        name: name
      };
    }

    this.data.users.push(newUser);
    this.saveData();

    // Auto login as newly registered user and persist across reloads
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      sessionStorage.setItem('AIT_PORTAL_SESSION', JSON.stringify(newUser));
    } catch (e) {}
    this.loginUser(newUser);
  }

  // Automatic role detection upon sign in
  handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('usernameInput').value.trim().toLowerCase();
    const p = document.getElementById('passwordInput').value.trim();
    const errBox = document.getElementById('loginError');

    // Auto-detect role from matched user credentials
    const matched = this.data.users.find(user => 
      user.username.toLowerCase() === u && 
      user.password === p
    );

    if (matched) {
      errBox.style.display = 'none';
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(matched));
        sessionStorage.setItem('AIT_PORTAL_SESSION', JSON.stringify(matched));
      } catch (e) {}
      this.loginUser(matched);
    } else {
      errBox.textContent = 'Invalid email or password. Please verify your credentials.';
      errBox.style.display = 'block';
    }
  }

  loginUser(user) {
    this.currentUser = user;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem('AIT_PORTAL_SESSION', JSON.stringify(user));
    } catch (e) {}

    document.getElementById('loginView').style.display = 'none';
    document.getElementById('portalView').style.display = 'block';
    document.getElementById('userSession').style.display = 'flex';

    document.getElementById('sessionUserName').textContent = user.name;
    document.getElementById('sessionRoleBadge').textContent = user.role.toUpperCase();

    this.buildNavigationTabs(user.role);
  }

  logout() {
    this.currentUser = null;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TAB_STORAGE_KEY);
      sessionStorage.removeItem('AIT_PORTAL_SESSION');
    } catch (e) {}
    document.getElementById('portalView').style.display = 'none';
    document.getElementById('userSession').style.display = 'none';
    this.showLoginView();
  }

  showLoginView() {
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('portalView').style.display = 'none';
    document.getElementById('userSession').style.display = 'none';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('loginError').style.display = 'none';
  }

  // Navigation Tabs construction based on user role (remembers active tab across reload)
  buildNavigationTabs(role) {
    const nav = document.getElementById('roleNavigation');
    nav.innerHTML = '';

    let tabs = [];
    if (role === 'student') {
      tabs = [
        { id: 'student-overview', label: 'Academic Overview' },
        { id: 'student-marks', label: 'Marks & Course Codes' },
        { id: 'student-attendance', label: 'Attendance Record' },
        { id: 'student-timetable', label: 'Weekly Timetable' },
        { id: 'student-exams', label: 'Exam Datesheet' }
      ];
    } else if (role === 'faculty') {
      tabs = [
        { id: 'faculty-attendance', label: 'Mark Attendance' },
        { id: 'faculty-exams', label: 'Schedule Exams' }
      ];
    } else if (role === 'admin') {
      tabs = [
        { id: 'admin-marks', label: 'Assign & Edit Marks' },
        { id: 'admin-attendance', label: 'Attendance Administration' },
        { id: 'admin-students', label: 'Students Ledger & CGPA' },
        { id: 'admin-system', label: 'System Settings' }
      ];
    }

    let savedTab = null;
    try {
      savedTab = localStorage.getItem(TAB_STORAGE_KEY);
    } catch (e) {}

    const initialTabId = (savedTab && tabs.some(t => t.id === savedTab)) ? savedTab : (tabs[0] ? tabs[0].id : null);

    tabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `nav-tab ${t.id === initialTabId ? 'active' : ''}`;
      btn.textContent = t.label;
      btn.onclick = () => this.switchTab(t.id, btn);
      nav.appendChild(btn);
    });

    if (initialTabId) {
      const activeBtn = Array.from(nav.children).find(b => b.classList.contains('active'));
      this.switchTab(initialTabId, activeBtn);
    }
  }

  switchTab(tabId, tabButton) {
    this.activeTab = tabId;
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tabId);
    } catch (e) {}

    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    if (tabButton) tabButton.classList.add('active');

    document.querySelectorAll('.view-pane').forEach(pane => pane.style.display = 'none');
    const activePane = document.getElementById(tabId);
    if (activePane) activePane.style.display = 'block';

    // Trigger tab-specific renders
    if (tabId === 'student-overview' || tabId === 'student-marks' || tabId === 'student-attendance' || tabId === 'student-timetable' || tabId === 'student-exams') {
      this.renderStudentViews();
    } else if (tabId === 'faculty-attendance') {
      this.renderFacultyAttendanceView();
    } else if (tabId === 'faculty-exams') {
      this.renderFacultyExamsView();
    } else if (tabId === 'admin-marks') {
      this.renderAdminMarksView();
    } else if (tabId === 'admin-attendance') {
      this.renderAdminAttendanceView();
    } else if (tabId === 'admin-students') {
      this.renderAdminStudentsRoster();
    }
  }

  // =================== GRADING & ACADEMIC FORMULAS ===================
  calculateGradeInfo(internal, exam) {
    const total = Math.round(Number(internal) + Number(exam));
    let grade = 'F';
    let points = 0;
    let status = 'Fail';

    if (total >= 90) { grade = 'O'; points = 10; status = 'Pass'; }
    else if (total >= 80) { grade = 'A+'; points = 9; status = 'Pass'; }
    else if (total >= 70) { grade = 'A'; points = 8; status = 'Pass'; }
    else if (total >= 60) { grade = 'B+'; points = 7; status = 'Pass'; }
    else if (total >= 50) { grade = 'B'; points = 6; status = 'Pass'; }
    else if (total >= 40) { grade = 'C'; points = 5; status = 'Pass'; }
    else { grade = 'F'; points = 0; status = 'Fail'; }

    return { total, grade, points, status };
  }

  calculateStudentCGPA(studentId) {
    const studentMarks = this.data.marks[studentId] || {};
    let totalCreditPoints = 0;
    let totalCredits = 0;

    this.data.courses.forEach(c => {
      const m = studentMarks[c.code] || { internal: 0, exam: 0 };
      const info = this.calculateGradeInfo(m.internal, m.exam);
      totalCreditPoints += (info.points * c.credits);
      totalCredits += c.credits;
    });

    if (totalCredits === 0) return 0.00;
    const cgpa = (totalCreditPoints / totalCredits).toFixed(2);
    return Number(cgpa);
  }

  calculateStudentOverallAttendance(studentId) {
    const stdAtt = this.data.attendance[studentId] || {};
    let totalHeld = 0;
    let totalAttended = 0;

    this.data.courses.forEach(c => {
      const rec = stdAtt[c.code] || { held: 0, attended: 0 };
      totalHeld += Number(rec.held || 0);
      totalAttended += Number(rec.attended || 0);
    });

    if (totalHeld === 0) return 100.0;
    return Number(((totalAttended / totalHeld) * 100).toFixed(1));
  }

  // =================== STUDENT VIEWS ===================
  renderStudentViews() {
    const studentId = this.currentUser.studentId || 'S101';
    const student = this.data.students.find(s => s.id === studentId) || this.data.students[0];

    // Compute live metrics
    const cgpa = this.calculateStudentCGPA(student.id);
    student.cgpa = cgpa; // Keep in sync
    const overallAtt = this.calculateStudentOverallAttendance(student.id);
    const totalCredits = this.data.courses.reduce((acc, cur) => acc + cur.credits, 0);

    // Profile Pane
    document.getElementById('stdProfileName').textContent = student.name;
    document.getElementById('stdRollNo').textContent = student.rollNo;
    document.getElementById('stdProgram').textContent = student.program;
    document.getElementById('stdSemester').textContent = student.semester;
    document.getElementById('stdCgpa').textContent = cgpa.toFixed(2);
    document.getElementById('stdAttendanceRate').textContent = `${overallAtt}%`;
    document.getElementById('stdCredits').textContent = totalCredits;

    // Marks Table
    const marksBody = document.getElementById('studentMarksTableBody');
    marksBody.innerHTML = '';
    const studentMarks = this.data.marks[student.id] || {};

    this.data.courses.forEach(c => {
      const m = studentMarks[c.code] || { internal: 0, exam: 0 };
      const grade = this.calculateGradeInfo(m.internal, m.exam);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.code}</strong></td>
        <td>${c.title}</td>
        <td>${c.credits}</td>
        <td>${m.internal} / 40</td>
        <td>${m.exam} / 60</td>
        <td><strong>${grade.total}</strong></td>
        <td><span class="badge ${grade.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${grade.grade}</span></td>
        <td>${grade.points}</td>
        <td><span class="badge ${grade.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${grade.status}</span></td>
      `;
      marksBody.appendChild(tr);
    });

    // Attendance Table
    const attBody = document.getElementById('studentAttendanceTableBody');
    attBody.innerHTML = '';
    const stdAtt = this.data.attendance[student.id] || {};
    let hasShortage = false;

    this.data.courses.forEach(c => {
      const rec = stdAtt[c.code] || { held: 0, attended: 0 };
      const pct = rec.held > 0 ? ((rec.attended / rec.held) * 100).toFixed(1) : 100;
      const isShort = Number(pct) < 75.0;
      if (isShort) hasShortage = true;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.code}</strong></td>
        <td>${c.title}</td>
        <td>${c.faculty}</td>
        <td>${rec.held}</td>
        <td>${rec.attended}</td>
        <td><strong>${pct}%</strong></td>
        <td><span class="badge ${isShort ? 'badge-fail' : 'badge-pass'}">${isShort ? 'Shortage (<75%)' : 'Eligible'}</span></td>
      `;
      attBody.appendChild(tr);
    });

    const warningBox = document.getElementById('attendanceWarningNotice');
    if (hasShortage) {
      warningBox.innerHTML = `<div class="alert alert-danger" style="margin-bottom: 0;">Attendance Alert: You have less than 75% attendance in one or more courses. Please contact respective faculty.</div>`;
    } else {
      warningBox.innerHTML = `<div class="alert alert-success" style="margin-bottom: 0;">Attendance Status: All courses meet the 75% attendance prerequisite.</div>`;
    }

    // Timetable
    const ttBody = document.getElementById('timetableBody');
    ttBody.innerHTML = '';
    this.data.timetable.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.day}</strong></td>
        <td><div class="timetable-cell"><span class="tt-course">${row.s1}</span></div></td>
        <td><div class="timetable-cell"><span class="tt-course">${row.s2}</span></div></td>
        <td><div class="timetable-cell"><span class="tt-course">${row.s3}</span></div></td>
        <td><div class="timetable-cell"><span class="tt-course">${row.s4}</span></div></td>
        <td><div class="timetable-cell"><span class="tt-course">${row.s5}</span></div></td>
      `;
      ttBody.appendChild(tr);
    });

    // Exams
    const examsBody = document.getElementById('studentExamsTableBody');
    examsBody.innerHTML = '';
    this.data.exams.forEach(ex => {
      const c = this.data.courses.find(item => item.code === ex.code) || { title: '-' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${ex.date}</strong></td>
        <td>${ex.time}</td>
        <td><strong>${ex.code}</strong></td>
        <td>${c.title}</td>
        <td><span class="badge badge-neutral">${ex.type}</span></td>
        <td>${ex.room}</td>
      `;
      examsBody.appendChild(tr);
    });
  }

  // =================== FACULTY VIEWS ===================
  renderFacultyAttendanceView() {
    const courseSelect = document.getElementById('facultyCourseSelect');
    courseSelect.innerHTML = '';

    this.data.courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.code}: ${c.title}`;
      courseSelect.appendChild(opt);
    });

    let savedCourse = null;
    try {
      savedCourse = localStorage.getItem('AIT_FACULTY_SELECTED_COURSE');
    } catch (e) {}
    if (savedCourse && this.data.courses.some(c => c.code === savedCourse)) {
      courseSelect.value = savedCourse;
    }

    // Default to today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDateInput').value = today;

    this.renderFacultyAttendanceRoster();
  }

  onFacultyCourseSelectChange() {
    const courseSelect = document.getElementById('facultyCourseSelect');
    try {
      localStorage.setItem('AIT_FACULTY_SELECTED_COURSE', courseSelect.value);
    } catch (e) {}
    this.renderFacultyAttendanceRoster();
  }

  renderFacultyAttendanceRoster() {
    const code = document.getElementById('facultyCourseSelect').value;
    const rosterBody = document.getElementById('facultyRosterBody');
    rosterBody.innerHTML = '';

    this.data.students.forEach(s => {
      const stdAtt = (this.data.attendance[s.id] && this.data.attendance[s.id][code]) || { held: 0, attended: 0 };
      const pct = stdAtt.held > 0 ? ((stdAtt.attended / stdAtt.held) * 100).toFixed(1) : 100;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="faculty-att-checkbox" data-student-id="${s.id}" checked>
        </td>
        <td><strong>${s.rollNo}</strong></td>
        <td>${s.name}</td>
        <td>${stdAtt.attended}</td>
        <td>${stdAtt.held}</td>
        <td><span class="badge ${Number(pct) >= 75 ? 'badge-pass' : 'badge-fail'}">${pct}%</span></td>
      `;
      rosterBody.appendChild(tr);
    });
  }

  toggleAllAttendance(checked) {
    document.querySelectorAll('.faculty-att-checkbox').forEach(cb => {
      cb.checked = checked;
    });
  }

  saveFacultyAttendance() {
    const code = document.getElementById('facultyCourseSelect').value;
    const date = document.getElementById('attendanceDateInput').value;
    const checkboxes = document.querySelectorAll('.faculty-att-checkbox');

    checkboxes.forEach(cb => {
      const sId = cb.getAttribute('data-student-id');
      if (!this.data.attendance[sId]) this.data.attendance[sId] = {};
      if (!this.data.attendance[sId][code]) this.data.attendance[sId][code] = { held: 0, attended: 0 };

      // Increment total lecture held count by 1
      this.data.attendance[sId][code].held += 1;
      // If student was present, increment attended
      if (cb.checked) {
        this.data.attendance[sId][code].attended += 1;
      }
    });

    this.saveData();
    const msg = document.getElementById('facultySaveMsg');
    msg.textContent = `Attendance recorded for ${code} on ${date}!`;
    setTimeout(() => { msg.textContent = ''; }, 3500);

    this.renderFacultyAttendanceRoster();
  }

  renderFacultyExamsView() {
    // Populate course dropdown
    const courseSelect = document.getElementById('newExamCourse');
    courseSelect.innerHTML = '';
    this.data.courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.code}: ${c.title}`;
      courseSelect.appendChild(opt);
    });

    // Populate table of current exams
    const listBody = document.getElementById('facultyExamsListBody');
    listBody.innerHTML = '';
    this.data.exams.forEach(ex => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ex.date}</td>
        <td><strong>${ex.code}</strong></td>
        <td>${ex.type}</td>
        <td>${ex.time}</td>
        <td>${ex.room}</td>
        <td>
          <button class="btn btn-xs btn-danger" onclick="app.deleteExam('${ex.id}')">Delete</button>
        </td>
      `;
      listBody.appendChild(tr);
    });
  }

  handleScheduleExam(e) {
    e.preventDefault();
    const code = document.getElementById('newExamCourse').value;
    const type = document.getElementById('newExamType').value;
    const date = document.getElementById('newExamDate').value;
    const time = document.getElementById('newExamTime').value.trim();
    const room = document.getElementById('newExamRoom').value.trim();

    const newExam = {
      id: 'ex-' + Date.now(),
      code,
      type,
      date,
      time,
      room
    };

    this.data.exams.push(newExam);
    this.saveData();
    this.renderFacultyExamsView();
    document.getElementById('createExamForm').reset();
  }

  deleteExam(id) {
    if (!confirm('Are you sure you want to remove this examination entry?')) return;
    this.data.exams = this.data.exams.filter(ex => ex.id !== id);
    this.saveData();
    this.renderFacultyExamsView();
  }

  // =================== ADMIN VIEWS ===================
  renderAdminMarksView() {
    const sel = document.getElementById('adminStudentSelect');
    sel.innerHTML = '';
    this.data.students.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.rollNo} - ${s.name}`;
      sel.appendChild(opt);
    });

    let savedStudentId = null;
    try {
      savedStudentId = localStorage.getItem('AIT_ADMIN_SELECTED_STUDENT');
    } catch (e) {}

    if (savedStudentId && this.data.students.some(s => s.id === savedStudentId)) {
      sel.value = savedStudentId;
    }

    this.renderAdminMarksEditor();
  }

  onAdminStudentSelectChange() {
    const sel = document.getElementById('adminStudentSelect');
    try {
      localStorage.setItem('AIT_ADMIN_SELECTED_STUDENT', sel.value);
    } catch (e) {}
    this.renderAdminMarksEditor();
  }

  renderAdminMarksEditor() {
    const studentId = document.getElementById('adminStudentSelect').value;
    const tableBody = document.getElementById('adminMarksTableBody');
    tableBody.innerHTML = '';

    const stdMarks = this.data.marks[studentId] || {};

    this.data.courses.forEach(c => {
      const m = stdMarks[c.code] || { internal: 0, exam: 0 };
      const info = this.calculateGradeInfo(m.internal, m.exam);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.code}</strong></td>
        <td>${c.title}</td>
        <td>${c.credits}</td>
        <td>
          <input type="number" min="0" max="40" class="num-input admin-internal-input" data-course="${c.code}" value="${m.internal}" oninput="app.handleLiveMarksChange('${c.code}')">
        </td>
        <td>
          <input type="number" min="0" max="60" class="num-input admin-exam-input" data-course="${c.code}" value="${m.exam}" oninput="app.handleLiveMarksChange('${c.code}')">
        </td>
        <td><strong id="adm-total-${c.code}">${info.total}</strong></td>
        <td><span class="badge ${info.status === 'Pass' ? 'badge-pass' : 'badge-fail'}" id="adm-grade-${c.code}">${info.grade}</span></td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.resetCourseMarks('${studentId}', '${c.code}')">Reset</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  handleLiveMarksChange(courseCode) {
    const studentId = document.getElementById('adminStudentSelect').value;
    const intInput = document.querySelector(`.admin-internal-input[data-course="${courseCode}"]`);
    const exInput = document.querySelector(`.admin-exam-input[data-course="${courseCode}"]`);
    const totalEl = document.getElementById(`adm-total-${courseCode}`);
    const gradeEl = document.getElementById(`adm-grade-${courseCode}`);

    const intVal = Math.min(40, Math.max(0, Number(intInput.value) || 0));
    const exVal = Math.min(60, Math.max(0, Number(exInput.value) || 0));

    const info = this.calculateGradeInfo(intVal, exVal);
    totalEl.textContent = info.total;
    gradeEl.textContent = info.grade;
    gradeEl.className = `badge ${info.status === 'Pass' ? 'badge-pass' : 'badge-fail'}`;

    // Auto-commit to data and immediately save to localStorage
    if (!this.data.marks[studentId]) this.data.marks[studentId] = {};
    this.data.marks[studentId][courseCode] = { internal: intVal, exam: exVal };

    const updatedCgpa = this.calculateStudentCGPA(studentId);
    const targetStudent = this.data.students.find(s => s.id === studentId);
    if (targetStudent) targetStudent.cgpa = updatedCgpa;

    this.saveData();

    const msg = document.getElementById('adminMarksSaveMsg');
    if (msg) {
      msg.textContent = 'Auto-saved';
      setTimeout(() => { if (msg.textContent === 'Auto-saved') msg.textContent = ''; }, 2000);
    }
  }

  resetCourseMarks(studentId, courseCode) {
    const intInput = document.querySelector(`.admin-internal-input[data-course="${courseCode}"]`);
    const exInput = document.querySelector(`.admin-exam-input[data-course="${courseCode}"]`);
    intInput.value = 0;
    exInput.value = 0;
    this.handleLiveMarksChange(courseCode);
  }

  saveAdminMarks() {
    const studentId = document.getElementById('adminStudentSelect').value;
    if (!this.data.marks[studentId]) this.data.marks[studentId] = {};

    this.data.courses.forEach(c => {
      const intInput = document.querySelector(`.admin-internal-input[data-course="${c.code}"]`);
      const exInput = document.querySelector(`.admin-exam-input[data-course="${c.code}"]`);

      const internal = Math.min(40, Math.max(0, Number(intInput.value) || 0));
      const exam = Math.min(60, Math.max(0, Number(exInput.value) || 0));

      this.data.marks[studentId][c.code] = { internal, exam };
    });

    // Recompute CGPA immediately
    const updatedCgpa = this.calculateStudentCGPA(studentId);
    const targetStudent = this.data.students.find(s => s.id === studentId);
    if (targetStudent) targetStudent.cgpa = updatedCgpa;

    this.saveData();

    const msg = document.getElementById('adminMarksSaveMsg');
    msg.textContent = `All marks saved! CGPA: ${updatedCgpa.toFixed(2)}`;
    setTimeout(() => { msg.textContent = ''; }, 3500);
  }

  renderAdminAttendanceView() {
    const sel = document.getElementById('adminAttendanceStudentSelect');
    sel.innerHTML = '';
    this.data.students.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.rollNo} - ${s.name}`;
      sel.appendChild(opt);
    });

    let savedStudentId = null;
    try {
      savedStudentId = localStorage.getItem('AIT_ADMIN_ATT_STUDENT');
    } catch (e) {}

    if (savedStudentId && this.data.students.some(s => s.id === savedStudentId)) {
      sel.value = savedStudentId;
    }

    this.renderAdminAttendanceEditor();
  }

  onAdminAttendanceStudentSelectChange() {
    const sel = document.getElementById('adminAttendanceStudentSelect');
    try {
      localStorage.setItem('AIT_ADMIN_ATT_STUDENT', sel.value);
    } catch (e) {}
    this.renderAdminAttendanceEditor();
  }

  renderAdminAttendanceEditor() {
    const studentId = document.getElementById('adminAttendanceStudentSelect').value;
    const tbody = document.getElementById('adminAttendanceTableBody');
    tbody.innerHTML = '';

    const stdAtt = this.data.attendance[studentId] || {};

    this.data.courses.forEach(c => {
      const rec = stdAtt[c.code] || { held: 0, attended: 0 };
      const pct = rec.held > 0 ? ((rec.attended / rec.held) * 100).toFixed(1) : 100;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.code}</strong></td>
        <td>${c.title}</td>
        <td>
          <input type="number" min="0" class="num-input admin-held-input" data-course="${c.code}" value="${rec.held}" oninput="app.handleLiveAttChange('${c.code}')">
        </td>
        <td>
          <input type="number" min="0" class="num-input admin-attended-input" data-course="${c.code}" value="${rec.attended}" oninput="app.handleLiveAttChange('${c.code}')">
        </td>
        <td><strong id="adm-att-pct-${c.code}">${pct}%</strong></td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.setFullAttendance('${c.code}')">Set 100%</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  handleLiveAttChange(courseCode) {
    const studentId = document.getElementById('adminAttendanceStudentSelect').value;
    const heldInput = document.querySelector(`.admin-held-input[data-course="${courseCode}"]`);
    const attInput = document.querySelector(`.admin-attended-input[data-course="${courseCode}"]`);
    const pctEl = document.getElementById(`adm-att-pct-${courseCode}`);

    const held = Math.max(0, Number(heldInput.value) || 0);
    const attended = Math.min(held, Math.max(0, Number(attInput.value) || 0));

    const pct = held > 0 ? ((attended / held) * 100).toFixed(1) : 100;
    pctEl.textContent = `${pct}%`;

    // Auto-commit to data and immediately save to localStorage
    if (!this.data.attendance[studentId]) this.data.attendance[studentId] = {};
    this.data.attendance[studentId][courseCode] = { held, attended };

    this.saveData();

    const msg = document.getElementById('adminAttendanceSaveMsg');
    if (msg) {
      msg.textContent = 'Auto-saved';
      setTimeout(() => { if (msg.textContent === 'Auto-saved') msg.textContent = ''; }, 2000);
    }
  }

  setFullAttendance(courseCode) {
    const heldInput = document.querySelector(`.admin-held-input[data-course="${courseCode}"]`);
    const attInput = document.querySelector(`.admin-attended-input[data-course="${courseCode}"]`);
    attInput.value = heldInput.value;
    this.handleLiveAttChange(courseCode);
  }

  saveAdminAttendance() {
    const studentId = document.getElementById('adminAttendanceStudentSelect').value;
    if (!this.data.attendance[studentId]) this.data.attendance[studentId] = {};

    this.data.courses.forEach(c => {
      const heldInput = document.querySelector(`.admin-held-input[data-course="${c.code}"]`);
      const attInput = document.querySelector(`.admin-attended-input[data-course="${c.code}"]`);

      const held = Math.max(0, Number(heldInput.value) || 0);
      const attended = Math.min(held, Math.max(0, Number(attInput.value) || 0));

      this.data.attendance[studentId][c.code] = { held, attended };
    });

    this.saveData();

    const msg = document.getElementById('adminAttendanceSaveMsg');
    msg.textContent = 'Attendance changes saved successfully!';
    setTimeout(() => { msg.textContent = ''; }, 3500);
  }

  renderAdminStudentsRoster() {
    const tbody = document.getElementById('adminStudentsRosterBody');
    tbody.innerHTML = '';
    const totalCredits = this.data.courses.reduce((sum, c) => sum + c.credits, 0);

    this.data.students.forEach(s => {
      const liveCgpa = this.calculateStudentCGPA(s.id);
      s.cgpa = liveCgpa;
      const liveAtt = this.calculateStudentOverallAttendance(s.id);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${s.rollNo}</strong></td>
        <td>${s.name}</td>
        <td>${s.program}</td>
        <td>${s.semester}</td>
        <td>${totalCredits}</td>
        <td><strong>${liveCgpa.toFixed(2)}</strong></td>
        <td><span class="badge ${liveAtt >= 75 ? 'badge-pass' : 'badge-fail'}">${liveAtt}%</span></td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.quickEditStudentMarks('${s.id}')">Edit Marks</button>
          <button class="btn btn-xs btn-outline" onclick="app.quickEditStudentAttendance('${s.id}')">Edit Attendance</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.saveData();
  }

  quickEditStudentMarks(studentId) {
    const tabBtn = Array.from(document.querySelectorAll('.nav-tab')).find(b => b.textContent.includes('Assign & Edit Marks'));
    this.switchTab('admin-marks', tabBtn);
    document.getElementById('adminStudentSelect').value = studentId;
    this.renderAdminMarksEditor();
  }

  quickEditStudentAttendance(studentId) {
    const tabBtn = Array.from(document.querySelectorAll('.nav-tab')).find(b => b.textContent.includes('Attendance Administration'));
    this.switchTab('admin-attendance', tabBtn);
    document.getElementById('adminAttendanceStudentSelect').value = studentId;
    this.renderAdminAttendanceEditor();
  }

  recalculateAllCGPA() {
    this.data.students.forEach(s => {
      s.cgpa = this.calculateStudentCGPA(s.id);
    });
    this.saveData();
    this.renderAdminStudentsRoster();
    alert('All student CGPAs recalculated accurately from current marks and course credits!');
  }

  exportDatabase() {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `student_portal_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  resetDatabase() {
    if (!confirm('Warning: This will reset all student marks, attendance, and exam modifications back to factory defaults. Continue?')) return;
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveData();
    location.reload();
  }
}

// Global bootstrap instance
const app = new StudentPortalApp();
