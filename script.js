// ================================
// Attendance Management System
// Part 1
// ================================

let students = JSON.parse(localStorage.getItem("students")) || [];

const addBtn = document.getElementById("addBtn");
const studentTable = document.getElementById("studentTable");

const totalStudents = document.getElementById("totalStudents");
const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const attendancePercent = document.getElementById("attendancePercent");

const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");

addBtn.addEventListener("click", addStudent);
searchInput.addEventListener("keyup", renderStudents);
exportBtn.addEventListener("click", exportCSV);

renderStudents();

function addStudent(){

    const name =
    document.getElementById("studentName").value.trim();

    const roll =
    document.getElementById("rollNumber").value.trim();

    if(name==="" || roll===""){
        alert("Please enter all details");
        return;
    }

    const exists = students.some(s => s.roll === roll);

    if(exists){
        alert("Roll Number already exists");
        return;
    }

    students.push({
        roll:roll,
        name:name,
        status:"Absent"
    });

    saveData();

    document.getElementById("studentName").value="";
    document.getElementById("rollNumber").value="";

    renderStudents();
}

function renderStudents(){

    studentTable.innerHTML="";

    let present=0;
    let absent=0;

    const keyword =
    searchInput.value.toLowerCase();

    students
    .filter(student =>

        student.name.toLowerCase().includes(keyword) ||

        student.roll.toLowerCase().includes(keyword)

    )

    .forEach((student,index)=>{

        if(student.status==="Present")
            present++;
        else
            absent++;

        studentTable.innerHTML += `
        <tr>

            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${student.status}</td>

            <td>

                <button
                class="present-btn"
                onclick="markPresent(${index})">
                Present
                </button>

                <button
                class="absent-btn"
                onclick="markAbsent(${index})">
                Absent
                </button>

                <button
                class="delete-btn"
                onclick="deleteStudent(${index})">
                Delete
                </button>

            </td>

        </tr>
        `;

    });

    totalStudents.innerHTML = students.length;
    presentCount.innerHTML = present;
    absentCount.innerHTML = absent;

    let percent = 0;

    if(students.length>0){
        percent = (present/students.length)*100;
    }

    attendancePercent.innerHTML =
    percent.toFixed(1)+"%";
}

function saveData(){

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// Mark Present
function markPresent(index){

    students[index].status = "Present";

    saveData();

    renderStudents();

}

// Mark Absent
function markAbsent(index){

    students[index].status = "Absent";

    saveData();

    renderStudents();

}

// Delete Student
function deleteStudent(index){

    let confirmDelete =
    confirm("Are you sure you want to delete this student?");

    if(confirmDelete){

        students.splice(index,1);

        saveData();

        renderStudents();

    }

}

// Export CSV
function exportCSV(){

    if(students.length===0){

        alert("No student data available.");

        return;

    }

    let csv =
    "Roll Number,Student Name,Attendance Status\n";

    students.forEach(student=>{

        csv +=
        `${student.roll},${student.name},${student.status}\n`;

    });

    const blob =
    new Blob([csv],{type:"text/csv"});

    const url =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "attendance.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

}