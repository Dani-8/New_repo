let students = []
let totalMarks = 600 // Total marks for 6 subjects
let currentView = 'table' // Default view
// -------------------------------------------------------

function calculateMarks(marks){
    let total = marks.html + marks.css + marks.javascript + marks.react + marks.python + marks.sql
    let percentage = (total / totalMarks) * 100

    return {
        totalMarks: total,
        percentage: percentage.toFixed(2)
    }
}

function getGrade(percentage){
    let p = parseFloat(percentage)
    if(p >= 90) return 'A+'
    if(p >= 80) return 'A'
    if(p >= 70) return 'B'
    if(p >= 60) return 'C'
    if(p >= 50) return 'D'
    return 'F'
}
// -------------------------------------------------------------------------------------------------
function switchView(viewName){
    currentView = viewName
    let views = ['table', 'stats', 'visuals', 'json']
    let buttons = {
        "table": document.getElementById("table-view-btn"),
        "stats": document.getElementById("class-stats-btn"),
        "visuals": document.getElementById("performance-visualization-btn"),
        "json": document.getElementById("raw-data-btn")
    }


    views.forEach(view => {
        let viewElement = view === "json" ? document.getElementById('jsonDataView') : document.getElementById(view + 'View')
        let button = buttons[view]

        if(view === viewName){
            viewElement.style.display = "block"

            button.classList.remove("switch-btn-default")
            button.classList.add("switch-btn-active")
        }else{
            viewElement.style.display = "none"

            button.classList.add("switch-btn-default")
            button.classList.remove("switch-btn-active")
        }
    })    
}


function updateViewButtons(){
    let hasStudent = students.length > 0 
    let buttons = ["table-view-btn", "class-stats-btn", "performance-visualization-btn", "raw-data-btn"]

    buttons.forEach(id => {
        let button = document.getElementById(id)
        button.disabled = !hasStudent
    })

    if(!hasStudent && currentView !== "table"){
        currentView == "table"
    }

    switchView(currentView)
}
// ----------------------------------------------------------------------------------------------------------------------

function deleteStudent(studentId){
    students = students.filter(student => student.id !== studentId)
    renderStudents()
}

// --------------------------------------------------------------------


function addStudent(event){
    event.preventDefault()

    let name = document.getElementById("studentName").value
    let html = parseInt(document.getElementById("html").value)
    let css = parseInt(document.getElementById("css").value)
    let javascript = parseInt(document.getElementById("javascript").value)
    let react = parseInt(document.getElementById("react").value)
    let python = parseInt(document.getElementById("python").value)
    let sql = parseInt(document.getElementById("sql").value)
    // -----------------------------------------------------------------------

    // SHOW ALERT
    if(name === "" || isNaN(html) || isNaN(css) || isNaN(javascript) || isNaN(react) || isNaN(python) || isNaN(sql)){
        alert("Please ensure Name is entered and all 6 subject marks are between 0 and 100.")
        return
    }


    if(name){
        name = name.toLowerCase().split(" ").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }).join(" ")    
    }


    let marks = {html, css, javascript, react, python, sql}
    let calculated = calculateMarks(marks)


    let studentObj = {
        id: Date.now(),
        name: name,
        marks: marks,
        totalMarks: calculated.totalMarks,
        percentage: calculated.percentage,
        grade: getGrade(calculated.percentage)
    }

    students.push(studentObj)


    renderStudents()

    document.getElementById("student-form").reset()
    document.getElementById("studentName").focus()
}
// -------------------------------------------------------------------------------------------------

// Function for Render Students.....
function renderStudents(){
    renderClassStats()
    renderVisualization()
    renderJSONdata()

    updateViewButtons()


    let container = document.getElementById("student-table-cont")

    if(students.length === 0){
        container.innerHTML = "<p>No students added yet....</p>"
        return
    }
    // -----------------------------------------------------------------------

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total</th>
                    <th>Percentge</th>
                    <th>Grade</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
        `

    students.forEach((student) => {
        let gradeClass = ""
        if(student.grade === 'A+' || student.grade === 'A'){
            gradeClass = "grade-excellent"
        } else if(student.grade === 'B' || student.grade === 'C' || student.grade === 'D'){
            gradeClass = "grade-average"
        } else if(student.grade === 'F'){
            gradeClass = "grade-fail"
        }

        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.totalMarks}</td>
                <td style="font-weight: bold;">${student.percentage}%</td>
                <td class="${gradeClass}" style="font-weight: bold;">${student.grade}</td>
                <td>
                    <button class="btn-action btn-action-marksheet" onclick="showMarksheet(${student.id})">
                        Marksheet
                    </button>
                    <button class="btn-action btn-action-delete" onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `
    })

    html += `
                </tbody>
            </table>
        `

    container.innerHTML = html
}
// -------------------------------------------------------------------------------------------------
function renderClassStats(){
    let container = document.getElementById("class-stats-cont")

    if(students.length === 0){
        container.innerHTML = "<p>No students to calculate statistics....</p>"
        return
    }
    // ----------------------------------------------------------------------------

    let totalStudents = students.length
    let failingCount = students.filter(s => parseFloat(s.percentage) < 50).length
    
    let topStudent = students.reduce((max, student) => 
        parseFloat(student.percentage) > parseFloat(max.percentage) ? student : max, students[0]
    )


    container.innerHTML = `
        <div class="stats-cont">
            <div class="total-student-cont">
                <p class="stats-heading">Total Students</p>
                <p class="stats-value">${totalStudents}</p>
            </div>
            <div class="failing-count-cont">
                <p class="stats-heading">Failing Student Count</p>
                <p class="stats-value">${failingCount}</p>
            </div>
            <div class="top-performer-cont">
                <p class="stats-heading">Top Performer</p>
                <p class="stats-value topper-name">${topStudent.name}</p>
                <p class="stats-desc">(${topStudent.percentage}%, Grade ${topStudent.grade})</p>
            </div>
        </div>
    `
}
// --------------------------------------------------------------------------------------------------
function renderVisualization(){
    let container = document.getElementById("performance-visualization-cont")

    if(students.length === 0){
        container.innerHTML = "<p>No students to calculate statistics....</p>"
        return
    }
    // ----------------------------------------------------------------------------

    let sortedStudents = [...students].sort((a,b) => parseFloat(b.percentage) - parseFloat(a.percentage))

    let html = '<div style="display: flex; flex-direction: column; gap: 10px;"></div>'

    sortedStudents.forEach(student => {
        let width = parseFloat(student.percentage)
        let barColor = width >= 75 ? '#4f46e5' : (width >= 50 ? '#f97316' : '#ef4444')


        html += `
            <div class="visual-cont">
                <span class="visual-student-name">${student.name}</span>
                <div class="bar-cont">
                    <div class="total-bar-achievement" style="width:${width}%; background-color: ${barColor};">
                        <span class="bar-achievement-percentage">${width.toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `
    })

    html += '</div>';   
    container.innerHTML = html;
}
// -------------------------------------------------------------------------------------------------
function renderJSONdata(){
    let container = document.getElementById("raw-data-cont")

    if(students.length === 0){
        container.innerHTML = "<p>Add students to see the raw data structure here....</p>"
        return
    }
    // -------------------------------------------------------------------------------------

    let jsonString = JSON.stringify(students, null, 2)

    container.innerHTML = `
        <pre><code class="language-json">${jsonString}</code></pre>
    `
}
// -------------------------------------------------------------------------------------------------




// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

function showMarksheet(studentId){
    let student = students.find((s) => s.id === studentId)
    
    if(!student){
        alert("Student not found!")
        return
    }
    // -------------------------------------------------------

    let marksheetContent = document.getElementById("marksheet-content")
    let status = student.percentage >= 75 ? 'Excellent' : (student.percentage >= 50 ? 'Good' : 'Needs Improvement')
    
    let gradeClass = ""
    if(student.grade === 'A+' || student.grade === 'A'){
        gradeClass = "grade-excellent"
    } else if(student.grade === 'B' || student.grade === 'C' || student.grade === 'D'){
        gradeClass = "grade-average"
    } else if(student.grade === 'F'){
        gradeClass = "grade-fail"
    }

    marksheetContent.innerHTML = `
        <div class="marksheet-heading">
            <h2>Marksheet</h2>
            <p id="marksheet-student-name">Student: ${student.name}</p>
        </div>

        <div class="marksheet-data">
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks (Out of 100)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HTML</td>
                        <td>${student.marks.html}</td>
                    </tr>
                    <tr>
                        <td>CSS</td>
                        <td>${student.marks.css}</td>
                    </tr>
                    <tr>
                        <td>JavaScript</td>
                        <td>${student.marks.javascript}</td>
                    </tr>
                    <tr>
                        <td>React</td>
                        <td>${student.marks.react}</td>
                    </tr>
                    <tr>
                        <td>Python</td>
                        <td>${student.marks.python}</td>
                    </tr>
                    <tr>
                        <td>SQL</td>
                        <td>${student.marks.sql}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="marksheet-summary">
            <p>
                <span class="summary-heading">Total Marks:</span>
                <span id="marksheet-total-marks" style="font-weight: bold;">${student.totalMarks} / ${totalMarks}</span>
            </p>
            <p>
                <span class="summary-heading">Percentage:</span>
                <span id="marksheet-percentage" style="font-weight: bold;">${student.percentage}%</span>
            </p>
            <p>
                <span class="summary-heading">Grade:</span>
                <span id="marksheet-grade" class="${gradeClass}" style="font-weight: bold;">${student.grade}</span>
            </p>
            <p>
                <span class="summary-heading">Status:</span>
                <span id="marksheet-status">${status}</span>
            </p>
        </div>
    `

    let marksheetModal = document.getElementById("marksheet-modal")
    marksheetModal.classList.remove("hidden")
}

function closeMarksheet(){
    let marksheetModal = document.getElementById("marksheet-modal")
    marksheetModal.classList.add("hidden")
}
// -----------------------------------------------------------------------------------------------------



let submitBtn = document.getElementById("add-btn")
submitBtn.addEventListener("click", addStudent)

document.getElementById('student-form')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('add-btn')?.click(); }
});
// -----------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', renderStudents);




