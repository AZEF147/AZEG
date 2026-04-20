const state = {
  courses: [
    {
      title: "حفظ القرآن للمبتدئين",
      teacher: "الشيخ محمد",
      image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "تجويد عملي وتطبيقات",
      teacher: "أ. أحمد عبد الله",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "English Communication",
      teacher: "Ms. Sara",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  books: [
    {
      title: "تفسير ابن كثير",
      link: "https://waqfeya.net/book.php?bid=1698",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "رياض الصالحين",
      link: "https://waqfeya.net/book.php?bid=1059",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  payments: [],
  comments: [],
};

const courseList = document.getElementById("courseList");
const bookList = document.getElementById("bookList");
const pendingPayments = document.getElementById("pendingPayments");

function renderCourses() {
  courseList.innerHTML = state.courses
    .map(
      (c) => `
      <article>
        <img src="${c.image}" alt="${c.title}" />
        <div class="content">
          <h4>${c.title}</h4>
          <p>المحاضر: ${c.teacher}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderBooks() {
  bookList.innerHTML = state.books
    .map(
      (b) => `
      <article>
        <img src="${b.image}" alt="${b.title}" />
        <div class="content">
          <h4>${b.title}</h4>
          <a href="${b.link}" target="_blank">قراءة الكتاب من المصدر</a>
        </div>
      </article>`
    )
    .join("");
}

function renderPayments() {
  pendingPayments.innerHTML = state.payments
    .map(
      (p, i) => `<li>${p.name} - ${p.phone} - <a href="${p.proof}" target="_blank">إثبات</a>
      <button onclick="approvePayment(${i})">قبول</button></li>`
    )
    .join("");
}

window.approvePayment = function (idx) {
  const approved = state.payments.splice(idx, 1)[0];
  renderPayments();
  alert(`تم قبول طلب ${approved.name}. أرسل له كلمة المرور عبر واتساب.`);
};

document.getElementById("openSiteBtn").addEventListener("click", () => {
  const pass = document.getElementById("sitePassword").value;
  if (pass === "waleedzeyada") {
    document.getElementById("gate").style.display = "none";
  } else {
    alert("كلمة المرور غير صحيحة");
  }
});

document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("payerName").value;
  const phone = document.getElementById("payerPhone").value;
  const proof = document.getElementById("proofLink").value;
  state.payments.push({ name, phone, proof });
  renderPayments();
  document.getElementById("paymentStatus").textContent =
    "تم الإرسال بنجاح. سيقوم المدير بالمراجعة عبر لوحة التحكم.";
  e.target.reset();
});

document.getElementById("openAdminBtn").addEventListener("click", () => {
  const pass = document.getElementById("adminPassword").value;
  if (pass === "waleed") {
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    alert("كلمة سر المدير غير صحيحة");
  }
});

document.getElementById("addCourseForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.courses.push({
    title: document.getElementById("newCourseTitle").value,
    teacher: document.getElementById("newCourseTeacher").value,
    image: document.getElementById("newCourseImage").value,
  });
  renderCourses();
  e.target.reset();
});

document.getElementById("addBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.books.push({
    title: document.getElementById("newBookTitle").value,
    link: document.getElementById("newBookLink").value,
    image: document.getElementById("newBookImage").value,
  });
  renderBooks();
  e.target.reset();
});

document.getElementById("generateCert").addEventListener("click", () => {
  const cert = `شهادة تقدير\nتمنح أكاديمية قطاف هذه الشهادة للطالب: __________\nوذلك لاجتياز البرنامج بنجاح.`;
  document.getElementById("certificate").textContent = cert;
});

document.getElementById("commentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("commentName").value;
  const text = document.getElementById("commentText").value;
  state.comments.push({ name, text });
  const list = document.getElementById("commentList");
  list.innerHTML = state.comments
    .map((c) => `<li><b>${c.name}:</b> ${c.text}</li>`)
    .join("");
  e.target.reset();
});

renderCourses();
renderBooks();
renderPayments();
