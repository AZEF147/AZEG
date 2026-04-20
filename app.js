const STORAGE_KEY = "qitaf_academy_v2";
const PASSWORDS = {
  student: "waleedzeyada",
  admin: "waleed",
};

const seedData = {
  courses: [
    {
      title: "تحفيظ القرآن للمستوى الأول",
      teacher: "الشيخ أحمد مصطفى",
      image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "تفسير جزء عم",
      teacher: "د. عبد الرحمن علي",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "English for Students",
      teacher: "Ms. Hala",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  books: [
    {
      title: "تفسير السعدي",
      link: "https://waqfeya.net/book.php?bid=11987",
      image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "الرحيق المختوم",
      link: "https://waqfeya.net/book.php?bid=1077",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  payments: [],
  comments: [],
  students: [
    {
      name: "طالب تجريبي",
      phone: "201033232430",
      points: 420,
      attendance: 88,
      absence: 12,
      werd: "حفظ 10 آيات + مراجعة السابق",
    },
  ],
};

let role = "student";
let isAdmin = false;
let state = loadData();

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(seedData);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(seedData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function q(id) {
  return document.getElementById(id);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStats() {
  q("statCourses").textContent = state.courses.length;
  q("statBooks").textContent = state.books.length;
  q("statStudents").textContent = state.students.length;
  q("pendingCount").textContent = state.payments.length;
  q("studentsCount").textContent = state.students.length;
  q("commentsCount").textContent = state.comments.length;
}

function renderCourses(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const result = state.courses.filter(
    (c) => c.title.toLowerCase().includes(normalized) || c.teacher.toLowerCase().includes(normalized)
  );
  q("courseList").innerHTML = result
    .map(
      (c) => `
      <article>
        <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}" />
        <div class="content">
          <h4>${escapeHtml(c.title)}</h4>
          <p>المحاضر: ${escapeHtml(c.teacher)}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderBooks(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const result = state.books.filter((b) => b.title.toLowerCase().includes(normalized));
  q("bookList").innerHTML = result
    .map(
      (b) => `
      <article>
        <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" />
        <div class="content">
          <h4>${escapeHtml(b.title)}</h4>
          <a target="_blank" href="${escapeHtml(b.link)}">فتح الكتاب من المصدر</a>
        </div>
      </article>`
    )
    .join("");
}

function renderComments() {
  q("commentList").innerHTML = state.comments
    .map((c) => `<li><b>${escapeHtml(c.name)}:</b> ${escapeHtml(c.text)}</li>`)
    .join("");
}

function renderPayments() {
  q("pendingPayments").innerHTML = state.payments
    .map(
      (p, i) => `<li>
        ${escapeHtml(p.name)} | ${escapeHtml(p.plan)} | ${escapeHtml(p.phone)} |
        <a target="_blank" href="${escapeHtml(p.proof)}">إثبات الدفع</a>
        <button data-approve="${i}">قبول</button>
      </li>`
    )
    .join("");
}

function renderStudentProfile() {
  const student = state.students[0];
  if (!student) return;
  q("pointsView").textContent = student.points;
  q("attendanceView").textContent = `${student.attendance}%`;
  q("absenceView").textContent = `${student.absence}%`;
  q("dailyWerd").textContent = student.werd;
}

function renderAll() {
  renderStats();
  renderCourses(q("courseSearch").value || "");
  renderBooks(q("bookSearch").value || "");
  renderComments();
  renderPayments();
  renderStudentProfile();
}

function setAdminView(open) {
  isAdmin = open;
  q("adminPanel").classList.toggle("hidden", !open);
  q("adminLocked").classList.toggle("hidden", open);
}

function setupAuth() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      role = tab.dataset.role;
    });
  });

  q("loginBtn").addEventListener("click", () => {
    const pass = q("authPassword").value;
    if (pass === PASSWORDS[role]) {
      q("authModal").style.display = "none";
      setAdminView(role === "admin");
      return;
    }
    alert("كلمة المرور غير صحيحة");
  });
}

function setupEvents() {
  q("courseSearch").addEventListener("input", (e) => renderCourses(e.target.value));
  q("bookSearch").addEventListener("input", (e) => renderBooks(e.target.value));

  q("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const payment = {
      name: q("payerName").value.trim(),
      phone: q("payerPhone").value.trim(),
      plan: q("payerPlan").value,
      proof: q("proofLink").value.trim(),
      createdAt: new Date().toISOString(),
    };
    state.payments.push(payment);
    saveData();
    renderAll();
    q("paymentStatus").textContent = "تم إرسال الطلب، بانتظار موافقة الإدارة.";
    q("paymentForm").reset();
  });

  q("pendingPayments").addEventListener("click", (e) => {
    const idx = e.target.dataset.approve;
    if (idx === undefined || !isAdmin) return;
    const approved = state.payments.splice(Number(idx), 1)[0];
    saveData();
    renderAll();
    const waMsg = encodeURIComponent(
      `مرحباً ${approved.name}، تم قبول طلبك في ${approved.plan}. كلمة الدخول: ${PASSWORDS.student}`
    );
    window.open(`https://wa.me/${approved.phone}?text=${waMsg}`, "_blank");
  });

  q("addCourseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    state.courses.push({
      title: q("newCourseTitle").value.trim(),
      teacher: q("newCourseTeacher").value.trim(),
      image: q("newCourseImage").value.trim(),
    });
    saveData();
    renderAll();
    e.target.reset();
  });

  q("addBookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    state.books.push({
      title: q("newBookTitle").value.trim(),
      link: q("newBookLink").value.trim(),
      image: q("newBookImage").value.trim(),
    });
    saveData();
    renderAll();
    e.target.reset();
  });

  q("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const student = {
      name: q("studentName").value.trim(),
      phone: q("studentPhone").value.trim(),
      points: Number(q("studentPoints").value),
      attendance: Number(q("studentAttendance").value),
      absence: Number(q("studentAbsence").value),
      werd: q("studentWerd").value.trim(),
    };
    state.students[0] = student;
    saveData();
    renderAll();
    e.target.reset();
  });

  q("commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.comments.push({
      name: q("commentName").value.trim(),
      text: q("commentText").value.trim(),
    });
    saveData();
    renderAll();
    e.target.reset();
  });

  q("generateCert").addEventListener("click", () => {
    const name = q("certName").value.trim() || "........................";
    q("certificate").textContent = `شهادة تقدير\nتمنح أكاديمية قطاف هذه الشهادة للطالب/ة: ${name}\nلاجتياز البرنامج بنجاح.`;
  });

  q("shareWerdBtn").addEventListener("click", () => {
    const student = state.students[0];
    if (!student) return;
    const msg = encodeURIComponent(`ورد ${student.name} اليوم: ${student.werd}`);
    window.open(`https://wa.me/${student.phone}?text=${msg}`, "_blank");
  });
}

setupAuth();
setupEvents();
renderAll();
setAdminView(false);
