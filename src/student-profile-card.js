async function loadStudentProfile() {
    try {
        const response = await fetch("../data/Students.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        const currentUserId = "stu-101";

        const users = Array.isArray(data?.users) ? data.users : [];

        const user = users.find(
            (i) => i.id === currentUserId
        );

        if (!user) {
            console.warn("Student not found");
            renderProfile(null);
            return;
        }

        renderProfile(user);

    } catch (error) {
        console.error("Error loading student profile:", error);
        renderProfile(null);
    }
}


function renderProfile(user) {
    const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "-";

    document.getElementById("user-name").textContent = fullName;
    document.getElementById("user-id").textContent = user?.id ?? "—";
    document.getElementById("user-email").textContent = user?.email ?? "example@edugate.no";
    document.getElementById("user-dob").textContent = user?.dob ?? "00/00/0000";
    document.getElementById("user-grad-year").textContent = user?.gradYear ?? "0000";
    document.getElementById("user-school-id").textContent = user?.schoolId ?? "—";
}

loadStudentProfile();