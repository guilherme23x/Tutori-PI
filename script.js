const API_BASE_URL = "https://tutori-flame.vercel.app/api";

let currentMentor = {};
let selectedDateTime = { date: "2025-11-05", time: "11:00" };

function showApiError(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.classList.remove("hidden");
  container.innerHTML = `
                <div class="card" style="border-color: #fca5a5; background-color: #fef2f2; color: #b91c1c; padding: 1rem;">
                    <h5 style="font-weight: 700; margin-bottom: 0.5rem;">Erro de Conexão com o Backend (Python/Supabase)</h5>
                    <p style="font-size: 0.875rem;">O frontend não conseguiu se conectar ao servidor da API em <code>${API_BASE_URL}</code>.</p>
                    <p style="font-size: 0.875rem; margin-top: 0.25rem;"><strong>Verifique:</strong> O servidor Python (FastAPI) está rodando (<code>uvicorn main:app --reload</code>)?</p>
                </div>
            `;
}

function displayMentors(mentors, container, isFeatured = false) {
  container.innerHTML = "";
  const displayMentors = mentors;

  if (mentors.length === 0 && !isFeatured) {
    document.getElementById("no-results-message").classList.remove("hidden");
    return;
  } else if (!isFeatured) {
    document.getElementById("no-results-message").classList.add("hidden");
  }

  if (isFeatured) return;

  displayMentors.forEach((mentor) => {
    const initials = mentor.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);

    const cardHtml = `
            <div class="mentorCard" data-mentor-id="${mentor.id}">
               
                <div class="mentorCardContent">
                    <img src="${
                      mentor.image_url
                    }" onerror="this.onerror=null; this.src='https://placehold.co/70x70/E8634E/FFFFFF?text=${initials}';" alt="Avatar de ${
      mentor.name
    }" class="mentorCardAvatar" />
                    <h4 class="mentorCardName">
                        ${mentor.name}
                    </h4>
                    <p class="mentorCardSubject">${mentor.subject}</p>
                    <div class="mentorCardRatingBox">
                        <span class="mentorCardRating">
                            <span class="mentorCardRatingIcon">⭐</span>
                            <span>${mentor.rating} (${
      mentor.rating * 300
    } avaliações)</span>
                        </span>
                        ${
                          mentor.verified
                            ? '<span class="badge badgeSuccessAlt">VERIFICADO</span>'
                            : ""
                        }
                    </div>
                    <button class="btn btnPrimary mentorCardButton" data-mentor-id="${
                      mentor.id
                    }">Ver Perfil</button>
                </div>
            </div>
          `;
    container.insertAdjacentHTML("beforeend", cardHtml);
  });
}

async function fetchMentors(subject = "", verified = false, maxPrice = 300) {
  const mentorList = document.getElementById("search-mentor-list");
  const resultsCount = document.getElementById("results-count");
  const errorContainer = document.getElementById("search-error-container");

  if (!mentorList) return;

  mentorList.innerHTML = "";
  errorContainer.classList.add("hidden");

  let url = `${API_BASE_URL}/mentors?max_price=${maxPrice}`;
  if (subject) url += `&subject=${subject}`;
  if (verified) url += `&verified=true`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        "Falha ao buscar mentores. Código de Status: " + response.status
      );
    const mentors = await response.json();

    displayMentors(mentors, mentorList, false);
    resultsCount.textContent = `${mentors.length} Resultado(s) Encontrado(s)`;
  } catch (error) {
    console.error("Erro ao carregar mentores:", error);
    resultsCount.textContent = `Erro ao carregar resultados.`;
    showApiError("search-error-container");
  }
}

function renderCalendar() {
  const widget = document.getElementById("calendar-widget");
  if (!widget) {
    console.error("Elemento #calendar-widget não encontrado.");
    return;
  }
  widget.innerHTML = "";

  const daysInMonth = 30;
  const monthName = "Novembro 2025";
  const firstDayIndex = 6;

  const header = `
            <div class="calendarHeader">
                <button>←</button>
                <span>${monthName}</span>
                <button>→</button>
            </div>
        `;

  const grid = document.createElement("div");
  grid.className = "calendarGrid";

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  dayNames.forEach((name) => {
    const div = document.createElement("div");
    div.className = "calendarDayName";
    div.textContent = name.substring(0, 3);
    grid.appendChild(div);
  });

  for (let i = 0; i < firstDayIndex; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `2025-11-${day < 10 ? "0" + day : day}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendarDay";
    dayDiv.textContent = day;
    dayDiv.dataset.date = dateString;

    if (day === 5) {
      dayDiv.classList.add("calendarDaySelected");
      dayDiv.classList.add("calendarDayAvailable");
    } else if (day >= 5 && day <= 15) {
      dayDiv.classList.add("calendarDayAvailable");
      dayDiv.addEventListener("click", (e) => {
        document.querySelectorAll(".calendarDay").forEach((d) => {
          d.classList.remove("calendarDaySelected");
        });
        e.target.classList.add("calendarDaySelected");
        selectedDateTime.date = e.target.dataset.date;
        setupScheduleListeners(currentMentor);
      });
    } else {
      dayDiv.classList.add("calendarDayDisabled");
    }
    grid.appendChild(dayDiv);
  }

  widget.innerHTML = header;
  widget.appendChild(grid);
}

async function loadProfile(mentorId) {
  try {
    const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}`);
    if (!response.ok) throw new Error("Mentor não encontrado.");
    const mentor = await response.json();
    currentMentor = mentor;

    const initials = mentor.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);

    document.getElementById("profile-details-area").innerHTML = `
                <div class="card profileHeaderCard">
                    <div class="profileHeader">
                        <img src="${
                          mentor.image_url
                        }" onerror="this.onerror=null; this.src='https://placehold.co/96x96/E8634E/FFFFFF?text=${initials}';" alt="Avatar de ${
      mentor.name
    }" class="profileAvatar" />
                        <div class="profileInfo">
                            <h2 class="profileName">${mentor.name} ${
      mentor.verified
        ? '<span class="badge badgeSuccessAlt">VERIFICADO</span>'
        : ""
    }</h2>
                            <p class="profileSubject">${
                              mentor.subject
                            } - Especialista</p>
                            <div class="profileRating">
                                <p>⭐ ${mentor.rating}/5 (${
      mentor.rating * 300
    } avaliações)</p>
                            </div>
                        </div>
                    </div>

                    <div class="profileSection">
                        <h3 class="profileSectionTitle">Sobre</h3>
                        <p class="profileBio">${mentor.bio}</p>
                    </div>

                    <div class="profileSection">
                        <h3 class="profileSectionTitle">Avaliações</h3>
                        <div class="reviewItem">
                            <div class="reviewAvatar">J</div>
                            <div class="reviewContent">
                                <p class="reviewName">João Pedro <span class="reviewDate">Há 2 semanas</span></p>
                                <p class="reviewRating">★★★★★</p>
                                <p class="reviewText">Mentoria excepcional! A Maria tem um conhecimento profundo e sabe explicar conceitos complexos de forma clara.</p>
                            </div>
                        </div>
                        <div class="reviewItem">
                            <div class="reviewAvatar">A</div>
                            <div class="reviewContent">
                                <p class="reviewName">Ana Carolina <span class="reviewDate">Há 1 mês</span></p>
                                <p class="reviewRating">★★★★★</p>
                                <p class="reviewText">Melhor investimento que fiz na minha carreira. Recomendo 100%!</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    const priceBox = document.querySelector(".schedulePriceValue");
    if (priceBox) {
      priceBox.textContent = `R$ ${mentor.price.toFixed(2)}`;
    }

    renderCalendar();
    setupScheduleListeners(mentor);
  } catch (error) {
    alert("Não foi possível carregar o perfil do mentor: " + error.message);
  }
}

function setupScheduleListeners(mentor) {
  const timeSlotsContainer = document.getElementById(
    "available-times-container"
  );
  const scheduleButton = document.getElementById("schedule-and-pay-button");

  if (!timeSlotsContainer) {
    console.error("Elemento #available-times-container não encontrado.");
    return;
  }

  timeSlotsContainer.innerHTML = "";
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  scheduleButton.textContent = `Agendar Sessão`;
  scheduleButton.disabled = false;

  let initialSelectedTime = "11:00";

  availableTimes.forEach((time) => {
    const slot = document.createElement("button");
    slot.className = "btn timeSlot";
    slot.textContent = time;
    slot.dataset.time = time;

    if (
      selectedDateTime.date === "2025-11-05" &&
      time === initialSelectedTime
    ) {
      slot.classList.add("timeSlotSelected");
      selectedDateTime.time = initialSelectedTime;
    }

    slot.addEventListener("click", (e) => {
      document.querySelectorAll(".timeSlot").forEach((s) => {
        s.classList.remove("timeSlotSelected");
      });
      e.target.classList.add("timeSlotSelected");
      selectedDateTime.time = e.target.dataset.time;
      scheduleButton.disabled = false;
    });
    timeSlotsContainer.appendChild(slot);
  });

  const scheduleBtnClickHandler = () => {
    if (selectedDateTime.date && selectedDateTime.time) {
      const appointmentData = {
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        price: mentor.price,
        name: mentor.name,
        subject: mentor.subject,
        mentorId: mentor.id,
      };

      sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
      window.location.href = "payment.html";
    } else {
      alert("Selecione a data e o horário.");
    }
  };

  scheduleButton.removeEventListener("click", scheduleBtnClickHandler);
  scheduleButton.addEventListener("click", scheduleBtnClickHandler);
}

function logSessionHistory(appointment) {
  if (!appointment) return;

  const newSession = {
    id: Date.now(),
    mentorName: appointment.name,
    subject: appointment.subject,
    date: appointment.date,
    time: appointment.time,
    price: appointment.price,
    status: "upcoming",
  };

  const sessions = JSON.parse(localStorage.getItem("tutoriSessions") || "[]");
  sessions.push(newSession);
  localStorage.setItem("tutoriSessions", JSON.stringify(sessions));
}

function renderHistory() {
  const historyContainer = document.getElementById("history-list-container");
  if (!historyContainer) return;

  const sessions = JSON.parse(localStorage.getItem("tutoriSessions") || "[]");
  historyContainer.innerHTML = "";

  if (sessions.length === 0) {
    historyContainer.innerHTML = `
                    <div class="card textMuted" style="text-align: center; padding: 1.5rem;">
                        Nenhuma aula agendada ainda.
                    </div>
                `;
    return;
  }

  sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  sessions.forEach((session) => {
    const isUpcoming = session.status === "upcoming";
    const isCompleted = session.status === "completed";
    const isCancelled = session.status === "cancelled";

    let cardClass = "historyCard";
    let actionContent = "";
    let statusTag = "";

    if (isUpcoming) {
      statusTag = `<span class="badge badgePrimary">AGENDADA</span>`;
      actionContent = `
                        <button class="btn btnPrimary access-room">Acessar Sala</button>
                        <button class="historyCardCancelButton cancel-session" data-id="${session.id}">Cancelar</button>
                    `;
    } else if (isCompleted) {
      cardClass += " historyCardCompleted";
      statusTag = `<span class="badge badgeSuccess">CONCLUÍDA</span>`;
      actionContent = `<button class="historyCardReviewButton">Deixar Avaliação</button>`;
    } else if (isCancelled) {
      cardClass += " historyCardCancelled";
      statusTag = `<span class="badge badgeGray">CANCELADA</span>`;
      actionContent = `<span class="historyCardCancelledText">Agendamento Cancelado</span>`;
    }

    const card = document.createElement("div");
    card.className = `card ${cardClass}`;
    card.innerHTML = `
                    <div class="historyCardInfo">
                        <h4 class="historyCardTitle">Aula com ${
                          session.mentorName
                        }</h4>
                        <p class="historyCardDetails">${session.subject} | ${
      session.date
    } | ${session.time} | R$ ${session.price.toFixed(2)}</p>
                    </div>
                    <div class="historyCardActions">
                        ${statusTag}
                        ${actionContent}
                    </div>
                `;
    historyContainer.appendChild(card);
  });

  document.querySelectorAll(".access-room").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      window.location.href = "session.html";
    });
  });

  document.querySelectorAll(".cancel-session").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (confirm("Tem certeza que deseja cancelar esta sessão?")) {
        cancelSession(parseInt(e.target.dataset.id));
      }
    });
  });
}

function cancelSession(sessionId) {
  const sessions = JSON.parse(localStorage.getItem("tutoriSessions") || "[]");
  const updatedSessions = sessions.map((session) => {
    if (session.id === sessionId) {
      return { ...session, status: "cancelled" };
    }
    return session;
  });
  localStorage.setItem("tutoriSessions", JSON.stringify(updatedSessions));
  renderHistory();
}

if (!localStorage.getItem("tutoriSessions")) {
  localStorage.setItem(
    "tutoriSessions",
    JSON.stringify([
      {
        id: 1,
        mentorName: "Gabriel Santos",
        subject: "Cálculo Avançado",
        date: "2025-11-05",
        time: "10:00",
        price: 90.0,
        status: "upcoming",
      },
      {
        id: 2,
        mentorName: "Ana Clara Faria",
        subject: "Python para Projetos",
        date: "2025-10-15",
        time: "14:00",
        price: 120.0,
        status: "completed",
      },
      {
        id: 3,
        mentorName: "Carlos Eduardo",
        subject: "Liderança Tech",
        date: "2025-09-01",
        time: "16:00",
        price: 200.0,
        status: "cancelled",
      },
    ])
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const onHomePage = path.endsWith("/") || path.endsWith("index.html");
  const onSearchPage = path.endsWith("search.html");
  const onProfilePage = path.endsWith("mentor-profile.html");
  const onPaymentPage = path.endsWith("payment.html");
  const onConfirmationPage = path.endsWith("confirmation.html");
  const onHistoryPage = path.endsWith("history.html");

  if (onHomePage) {
    document
      .getElementById("view-all-mentors")
      .addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "pages/search.html";
      });
  }

  if (onSearchPage) {
    const priceRangeInput = document.getElementById("price-range-input");
    const priceMaxDisplay = document.getElementById("price-max-display");
    const searchTopicInput = document.getElementById("search-topic-input");
    const searchVerifiedOnly = document.getElementById("search-verified-only");

    priceRangeInput.addEventListener("input", () => {
      priceMaxDisplay.textContent = `R$ ${parseFloat(
        priceRangeInput.value
      ).toFixed(2)}`;
    });

    const applyFilters = () => {
      const subject = searchTopicInput.value;
      const verified = searchVerifiedOnly.checked;
      const maxPrice = priceRangeInput.value;
      fetchMentors(subject, verified, maxPrice);
    };

    document
      .getElementById("apply-filters-button")
      .addEventListener("click", applyFilters);
    document
      .getElementById("apply-filters-button-sidebar")
      .addEventListener("click", applyFilters);

    fetchMentors("", false, 300);
  }

  if (onProfilePage) {
    const urlParams = new URLSearchParams(window.location.search);
    const mentorId = urlParams.get("id");
    if (mentorId) {
      loadProfile(mentorId);
    } else {
      alert("Nenhum mentor selecionado.");
      window.location.href = onHomePage ? "pages/search.html" : "search.html";
    }
  }

  if (onPaymentPage) {
    const appointment = JSON.parse(sessionStorage.getItem("appointment"));
    if (appointment) {
      document.getElementById("payment-mentor-name").textContent =
        appointment.name;
      document.getElementById("payment-mentor-subject").textContent =
        appointment.subject;
      document.getElementById("payment-time").textContent = appointment.time;
      document.getElementById("payment-date-time").textContent =
        appointment.date;
      document.getElementById(
        "payment-price-value"
      ).textContent = `R$ ${appointment.price.toFixed(2)}`;
    } else {
      alert("Erro: Nenhum agendamento encontrado. Redirecionando...");
      window.location.href = "search.html";
      return;
    }

    document
      .getElementById("back-to-schedule")
      .addEventListener("click", (e) => {
        e.preventDefault();
        window.history.back();
      });

    document
      .getElementById("finalize-payment-button")
      .addEventListener("click", () => {
        const inputs = document.querySelectorAll("#page-payment input");
        let isValid = true;
        inputs.forEach((input) => {
          if (!input.value) isValid = false;
        });

        if (!isValid) {
          alert("Preencha todos os campos do cartão.");
          return;
        }

        const appointmentToLog = JSON.parse(
          sessionStorage.getItem("appointment")
        );
        if (appointmentToLog) {
          logSessionHistory(appointmentToLog);
        }
        window.location.href = "confirmation.html";
      });
  }

  if (onConfirmationPage) {
    const appointment = JSON.parse(sessionStorage.getItem("appointment"));
    if (appointment) {
      document.getElementById("confirmed-mentor-name").textContent =
        appointment.name;
      document.getElementById("confirmed-date").textContent = appointment.date;
      document.getElementById("confirmed-time").textContent = appointment.time;
    }

    document.getElementById("go-to-history").addEventListener("click", () => {
      sessionStorage.removeItem("appointment");
      window.location.href = "history.html";
    });
  }

  if (onHistoryPage) {
    renderHistory();
  }

  const signupButton = document.getElementById("header-signup-button");
  if (signupButton) {
    signupButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = onHomePage ? "pages/search.html" : "search.html";
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
    const card = target.closest(".mentorCard");
    const button = target.closest("button[data-mentor-id]");

    let mentorId = null;

    if (button) {
      mentorId = button.dataset.mentorId;
    } else if (card && !button) {
      mentorId = card.dataset.mentorId;
    }

    if (mentorId) {
      const profileUrl = `mentor-profile.html?id=${mentorId}`;
      window.location.href = onHomePage ? `pages/${profileUrl}` : profileUrl;
    }
  });

  const featuredContainer = document.querySelector(".mentor-list-featured");
  if (featuredContainer) featuredContainer.innerHTML = "";
});
