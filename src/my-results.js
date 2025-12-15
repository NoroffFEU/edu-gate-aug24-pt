const rowsPerPage = 7;
let currentPage = 1;
let currentStudent = null;
let allRows = [];
let filteredRows = [];

const filters = {
    session: "all",
    term: "all",
    subject: "all"
};


document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("year-header").addEventListener("click", () => {
        filters.session = "all";
        applyFilters();
    });

    document.getElementById("term-header").addEventListener("click", () => {
        filters.term = "all";
        applyFilters();
    });

    document.getElementById("subject-header").addEventListener("click", () => {
        filters.subject = "all";
        applyFilters();
    });

    document.getElementById("results-body").addEventListener("click", (e) => {

        const yearCell = e.target.closest(".year-cell");
        if (yearCell) {
            filters.session = yearCell.dataset.session;
            applyFilters();
            return;
        }

        const termCell = e.target.closest(".term-cell");
        if (termCell) {
            filters.term = Number(termCell.dataset.term);
            applyFilters();
            return;
        }

        const subjectCell = e.target.closest(".subject-cell");
        if (subjectCell) {
            filters.subject = subjectCell.dataset.subject;
            applyFilters();
            return;
        }

    });

    fetch("../data/Results.json")
        .then((response) => response.json())
        .then((data) => {
            const currentStudentId = "stu-105";

            const studentRecords = data.results.filter(
                result => result.studentId === currentStudentId
            );

            if (studentRecords.length === 0) {
                console.warn("Student not found");
                return;
            }

            const termMap = {
                "First Term": 1,
                "Second Term": 2,
                "Third Term": 3
            };

            allRows = [];

            studentRecords.forEach((record) => {
                const year = record.session.split("/")[0];
                const termNumber = termMap[record.term] ?? record.term;

                record.subjects.forEach((subject) => {
                    allRows.push({
                        year,
                        session: record.session,
                        term: termNumber,
                        subject: subject.name,
                        score: subject.score,
                        grade: subject.grade
                    });
                });
            });

            filteredRows = allRows;
            renderPage(1);
        })
        .catch(error => {
            console.error("Error loading Results.json", error);
        });
});

function renderPage(page) {
    const tbody = document.getElementById("results-body");
    tbody.innerHTML = "";
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageRows = filteredRows.slice(startIndex, endIndex);

    pageRows.forEach((row) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="col-year year-cell" data-session="${row.session}">${row.year}</td>
            <td class="col-term term-cell" data-term="${row.term}">${row.term}</td>
            <td class="col-subject subject-cell" data-subject="${row.subject}">${row.subject}</td>
            <td>E1</td>
            <td class="col-result">${row.score}/100</td>
            <td>${row.grade}</td>
            <td class="row-info">
                <button class="info-btn">
                    <img src="../public/icons/info.png" alt="Info">
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    currentPage = page;
    renderPagination(filteredRows.length);
};


function applyFilters() {
    filteredRows = allRows.filter(row => {
        if (filters.session !== "all" && row.session !== filters.session) 
        return false;
        if (filters.term !== "all" && row.term !== filters.term) 
        return false;
        if (filters.subject !== "all" && row.subject !== filters.subject) 
        return false;
    
        return true;
    });

    renderPage(1);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const firstBtn = createIconButton("../public/icons/chevron-double-left.png", () => {
        renderPage(1);
    });
    firstBtn.disabled = currentPage === 1;
    pagination.appendChild(firstBtn);

    const prevBtn = createIconButton("../public/icons/chevron-left.png", () => {
        if (currentPage > 1) renderPage(currentPage - 1);
    });
    prevBtn.disabled = currentPage === 1;
    pagination.appendChild(prevBtn);

    for (let page = 1; page <= totalPages; page++) {
        const btn = document.createElement("button");
        btn.className = "page-btn";

        if (page === currentPage) btn.classList.add("active");

        btn.textContent = page;

        btn.addEventListener("click", () => {
            renderPage(page);
        });

        pagination.appendChild(btn);
    }

    const nextBtn = createIconButton("../public/icons/chevron-right.png", () => {
        if (currentPage < totalPages) renderPage(currentPage + 1);
    });
    nextBtn.disabled = currentPage === totalPages;
    pagination.appendChild(nextBtn);

    const lastBtn = createIconButton("../public/icons/chevron-double-right.png", () => {
        renderPage(totalPages);
    });
    lastBtn.disabled = currentPage === totalPages;
    pagination.appendChild(lastBtn);

};

function createIconButton(iconPath, onClick) {
    const btn = document.createElement("button");
    btn.className = "page-btn";

    const img = document.createElement("img");
    img.src = iconPath;
    img.alt = "";

    btn.appendChild(img);
    btn.addEventListener("click", onClick);

    return btn;
};

