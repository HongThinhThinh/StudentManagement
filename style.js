//c1: prototype (function contructor - k dùng class)
//tạo constructor chuyên tạo student
function Student(name, birthday) {
  this.name = name;
  this.birthday = birthday;
  this.id = new Date().toISOString();
}

// --Store
function Store() {}
//getStudents: lấy danh sách từ LS, nếu chưa có thì trả mảng rỗng
Store.prototype.getStudents = function () {
  return JSON.parse(localStorage.getItem("students")) || [];
};

//lưu student vào LS
Store.prototype.add = function (student) {
  const students = this.getStudents(); //lấy danh sách từ store
  students.push(student); //thêm stuydent mới vào danh sách
  localStorage.setItem("students", JSON.stringify(students)); //cập nhật danh sách lên lại store
};
//get student: lấy sinh viên dựa trên ID

Store.prototype.getStudent = function (idRemove) {
  const students = this.getStudents();
  return students.find((student) => student.id == idRemove);
};
// remove: xóa student khỏi danh sách trong store
Store.prototype.remove = function (idRemove) {
  const students = this.getStudents();
  const indexRemove = students.findIndex((student) => student.id == idRemove);
  students.splice(indexRemove, 1);
  localStorage.setItem("students", JSON.stringify(students));
};
// --RenderUI: xử lý giao diện
function RenderUI() {}
//hàm add: render student lên màn hình
RenderUI.prototype.add = function (student) {
  const students = new Store().getStudents();
  const newTr = document.createElement("tr");
  newTr.innerHTML = `
            <td>${students.length + 1}</td>
            <td>${student.name}</td>
            <td>${student.birthday}</td>
            <td>
              <button class="btn btn-danger btn-sm btn-remove" data-id="${
                student.id
              }">
                Xóa
              </button>
            </td>`;
  document.querySelector("tbody").appendChild(newTr);
  document.querySelector("#name").value = "";
  document.querySelector("#birthday").value = "";
};

//render all: render tất cả student trong store lên màn hình sau mỗi lần f5
RenderUI.prototype.renderAll = function () {
  document.querySelector("tbody").innerHTML = ""; //clear nội dung trong tbody
  const students = new Store().getStudents(); //lấy danh sách từ store
  //duyệt danh sách và gọi renderUI.add cho mỗi item(đang là student)
  // students.forEach(student => {
  //     this.add(student)
  // });
  let content = students.reduce((result, student, studentIndex) => {
    return (result =
      result +
      `
            <tr>
                <td>${studentIndex + 1}</td>
                <td>${student.name}</td>
                <td>${student.birthday}</td>
                <td>
                <button class="btn btn-danger btn-sm btn-remove" data-id="${
                  student.id
                }">
                    Xóa
                </button>
                </td>
            </tr>
            `);
  }, "");
  document.querySelector("tbody").innerHTML = content;
};

//thông báo (alert) để thông báo kết quả add
RenderUI.prototype.alert = function (msg, type = "success") {
  const newAlert = document.createElement("div");
  newAlert.innerHTML = msg;
  newAlert.className = `alert alert-${type}`;
  document.querySelector("#notification").appendChild(newAlert);
  setTimeout(() => {
    newAlert.remove();
  }, 2000);
};

//sự kiện chính
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  //tạo ra các object quản lý
  const store = new Store();
  const ui = new RenderUI();
  const name = document.querySelector("#name").value;
  const birthday = document.querySelector("#birthday").value;
  //từ name và birthday tạo Student
  const newStudent = new Student(name, birthday);
  ui.add(newStudent);
  store.add(newStudent);
  ui.alert(`Bạn vừa thêm thành công ${name}`);
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new RenderUI();
  ui.renderAll();
});

document.querySelector("tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-remove")) {
    const store = new Store();
    const ui = new RenderUI();
    const idRemove = event.target.dataset.id; // lấy data id của nút vừa nhấn
    const student = store.getStudent(idRemove);
    const isConfirmed = confirm(`Bạn có muốn xóa ${student.name}`);
    if (isConfirmed) {
      store.remove(idRemove);
      ui.renderAll();
      ui.alert(` Bạn đã xóa ${student.name}`);
    } 
  }
});
