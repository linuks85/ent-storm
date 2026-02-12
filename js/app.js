// app.js — исправленная версия с багфиксами
const translations = {
    kk: {
        title: "ҰБТ Штурм",
        logo_title: "♟ ҰБТ-штурм",
        subtitle: "Сәлем! Тестілеу алдында мәліметтеріңізді енгізіңіз",
        fio_label: "Толық аты-жөніңіз (ФИО)",
        iin_label: "ИИН (12 цифра)",
        continue: "Жалғастыру",
        subjects_title: "Тақырыптарды таңдаңыз",
        subjects_subtitle: "Бір немесе бірнеше тақырыпты белгілеңіз",
        no_subjects: "Қолжетімді тақырыптар жоқ. data/ қалтасына json-файлдар қосыңыз",
        start_quiz: "Бастау",
        player_name: "Ойыншы:",
        streak: "Стрик",
        lives: "Өмір",
        correct: "Дұрыс! 🔥",
        wrong: "Қате 😔",
        correct_answer: "Дұрыс жауап:",
        explanation: "Түсіндірме:",
        source: "Дереккөз:",
        next_question: "Келесі сұрақ",
        rating_title: "Рейтинг",
        session_time: "сек.",
        no_records: "Әзірше рекордтар жоқ",
        rating_button: "Рейтинг көру",
        game_over: "Ойын аяқталды!",
        max_streak: "Максималды стрик:",
        lives_left: "Қалған өмір:",
        current_streak: "Ағымдағы стрик:"
    },
    ru: {
        title: "ЕНТ Штурм",
        logo_title: "♟ ЕНТ-штурм",
        subtitle: "Привет! Перед тестом введите свои данные",
        fio_label: "ФИО полностью",
        iin_label: "ИИН (12 цифр)",
        continue: "Продолжить",
        subjects_title: "Выберите предметы",
        subjects_subtitle: "Отметьте один или несколько предметов",
        no_subjects: "Доступных предметов нет. Добавьте json-файлы в папку data/",
        start_quiz: "Начать",
        player_name: "Игрок:",
        streak: "Стрик",
        lives: "Жизни",
        correct: "Правильно! 🔥",
        wrong: "Неправильно 😔",
        correct_answer: "Правильный ответ:",
        explanation: "Объяснение:",
        source: "Источник:",
        next_question: "Следующий вопрос",
        rating_title: "Рейтинг",
        session_time: "сек.",
        no_records: "Пока нет рекордов",
        rating_button: "Посмотреть рейтинг",
        game_over: "Игра окончена!",
        max_streak: "Максимальный стрик:",
        lives_left: "Осталось жизней:",
        current_streak: "Текущий стрик:"
    }
};

let currentLang = "kk";
let selectedSubjects = []; // ИСПРАВЛЕНО: объявлена на верхнем уровне
let availableSubjects = [];
let allQuestions = [];
let streak = 0;
let maxStreakThisSession = 0;
let gameStartTime = 0;
let records = JSON.parse(localStorage.getItem('quizRecords')) || [];
let currentQuestionData = null; // для хранения текущего вопроса
let lives = 3; // количество жизней
let maxLives = 3; // максимальное количество жизней

// Список предметов
const subjects = [
    { id: "biologiya", name_kk: "Биология", name_ru: "Биология" },
    { id: "geografiya", name_kk: "География", name_ru: "География" },
    { id: "qazaqstan-taryhy", name_kk: "Қазақстан тарихы", name_ru: "История Казахстана" },
    { id: "matematika", name_kk: "Математика", name_ru: "Математика" },
    { id: "fizika", name_kk: "Физика", name_ru: "Физика" },
    { id: "himiya", name_kk: "Химия", name_ru: "Химия" },
    { id: "informatika", name_kk: "Информатика", name_ru: "Информатика" }
];

// Обновление отображения жизней
function updateLivesDisplay() {
    const livesContainer = document.getElementById('lives-count');
    if (!livesContainer) return;

    livesContainer.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('span');
        heart.style.fontSize = '1.5rem';
        heart.style.margin = '0 0.2rem';
        heart.style.display = 'inline-block';
        heart.style.transition = 'transform 0.3s ease';

        if (i < lives) {
            heart.textContent = '❤️';
            heart.style.animation = 'heartbeat 1s ease infinite';
        } else {
            heart.textContent = '🖤';
            heart.style.opacity = '0.3';
        }
        livesContainer.appendChild(heart);
    }
}

// Смена языка
function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    if (document.getElementById('subjects-screen') && !document.getElementById('subjects-screen').classList.contains('hidden')) {
        renderSubjects();
    }
}

// Загрузка доступных предметов
async function loadAvailableSubjects() {
    availableSubjects = [];
    for (const sub of subjects) {
        try {
            const res = await fetch(`data/${sub.id}.json`);
            if (!res.ok) continue;
            const data = await res.json();
            if (!Array.isArray(data)) continue;
            const filtered = data.filter(q => q.lang === currentLang || !q.lang);
            if (filtered.length > 0) {
                availableSubjects.push({
                    ...sub,
                    questionCount: filtered.length
                });
            }
        } catch (e) {
            console.error(`Ошибка загрузки ${sub.id}:`, e);
        }
    }
    renderSubjects();
}

function renderSubjects() {
    const grid = document.getElementById('subjects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (availableSubjects.length === 0) {
        grid.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-size:1.2rem;">
${translations[currentLang].no_subjects}
</p>`;
        document.getElementById('start-quiz-btn').disabled = true;
        return;
    }
    availableSubjects.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'subject-item';
        div.dataset.id = sub.id;
        div.innerHTML = `
${sub[`name_${currentLang}`]}
<span style="font-size:0.85rem;color:var(--text-muted);margin-left:8px;">
(${sub.questionCount})
</span>
`;
        div.onclick = () => {
            div.classList.toggle('selected');
            const sel = Array.from(document.querySelectorAll('.subject-item.selected'))
                .map(el => el.dataset.id);
            document.getElementById('start-quiz-btn').disabled = sel.length === 0;
        };
        grid.appendChild(div);
    });
}

// Загрузка вопросов
async function loadQuestionsFromSelected() {
    allQuestions = [];
    const selectedIds = Array.from(document.querySelectorAll('.subject-item.selected'))
        .map(el => el.dataset.id);

    // ИСПРАВЛЕНО: обновляем глобальную переменную selectedSubjects
    selectedSubjects = selectedIds.map(id => {
        const subject = subjects.find(s => s.id === id);
        return subject ? subject[`name_${currentLang}`] : id;
    });

    for (const id of selectedIds) {
        try {
            const res = await fetch(`data/${id}.json`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const filtered = data.filter(q => q.lang === currentLang || !q.lang);
                    allQuestions.push(...filtered);
                }
            }
        } catch (e) {
            console.error(`Ошибка загрузки вопросов ${id}:`, e);
        }
    }
    return allQuestions.length > 0;
}

// Показ случайного вопроса
function showRandomQuestion() {
    if (allQuestions.length === 0) {
        document.getElementById('feedback').textContent = currentLang === 'kk'
            ? "Сұрақтар таусылды"
            : "Вопросы закончились";
        document.getElementById('feedback').className = 'feedback correct';
        document.getElementById('feedback').classList.remove('hidden');
        return;
    }

    const idx = Math.floor(Math.random() * allQuestions.length);
    const q = allQuestions[idx];
    currentQuestionData = q; // сохраняем текущий вопрос

    // Очищаем предыдущий feedback
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-question').classList.add('hidden');

    // Текст вопроса
    document.getElementById('question-text').textContent = q.question;

    // Обработка изображения
    const imgCont = document.getElementById('question-image');
    imgCont.innerHTML = '';
    if (q.image && q.image.trim()) {
        const imageUrl = q.image.trim();

        // Создаем контейнер для прелоадера
        const loaderDiv = document.createElement('div');
        loaderDiv.style.textAlign = 'center';
        loaderDiv.style.padding = '2rem';
        loaderDiv.innerHTML = '<div style="color:var(--text-muted);">Загрузка изображения...</div>';
        imgCont.appendChild(loaderDiv);
        imgCont.classList.remove('hidden');

        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.style.display = 'block';
        img.style.margin = '1rem auto';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

        img.onload = () => {
            // Изображение загружено успешно
            imgCont.innerHTML = '';
            imgCont.appendChild(img);
        };

        img.onerror = () => {
            console.warn("Не удалось загрузить изображение:", imageUrl);
            imgCont.innerHTML = `
                <div style="
                    background: rgba(255, 107, 107, 0.1);
                    border: 2px dashed #ff6b6b;
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    margin: 1rem 0;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📷</div>
                    <div style="color: #ff6b6b; font-weight: 500; margin-bottom: 0.5rem;">
                        ${currentLang === 'kk' ? 'Сурет табылмады' : 'Изображение не найдено'}
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">
                        ${imageUrl}
                    </div>
                </div>
            `;
        };

        img.alt = currentLang === 'kk' ? 'Сұрақтың суреті' : 'Изображение к вопросу';
        img.src = imageUrl;

    } else {
        imgCont.classList.add('hidden');
    }

    // Варианты ответов
    const opts = document.getElementById('options-container');
    opts.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i, q.correct, q);
        opts.appendChild(btn);
    });
}

function checkAnswer(selectedIdx, correctIdx, question) {
    const opts = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');

    // Блокируем все кнопки
    opts.forEach(btn => btn.disabled = true);

    if (selectedIdx === correctIdx) {
        streak++;
        if (streak > maxStreakThisSession) maxStreakThisSession = streak;
        document.getElementById('streak-count').textContent = streak;
        opts[selectedIdx].classList.add('correct');

        feedback.innerHTML = `<strong>${translations[currentLang].correct}</strong>`;
        if (question.explanation) {
            feedback.innerHTML += `<br><br><strong>${translations[currentLang].explanation}</strong> ${question.explanation}`;
        }
        if (question.source) {
            feedback.innerHTML += `<br><br><strong>${translations[currentLang].source}</strong> ${question.source}`;
        }
        feedback.className = 'feedback correct';

        // Удаляем вопрос из массива
        allQuestions = allQuestions.filter(q => q !== question);

        // Кнопка "Следующий вопрос"
        document.getElementById('next-question').classList.remove('hidden');

    } else {
        // Неправильный ответ
        lives--; // Уменьшаем жизни (но стрик НЕ сбрасываем!)
        updateLivesDisplay();

        opts[selectedIdx].classList.add('wrong');
        opts[correctIdx].classList.add('correct');

        feedback.innerHTML = `<strong>${translations[currentLang].wrong}</strong><br><br>
<strong>${translations[currentLang].correct_answer}</strong> ${question.options[correctIdx]}<br><br>`;

        if (question.explanation) {
            feedback.innerHTML += `<strong>${translations[currentLang].explanation}</strong> ${question.explanation}<br><br>`;
        }
        if (question.source) {
            feedback.innerHTML += `<strong>${translations[currentLang].source}</strong> ${question.source || 'Жоқ'}<br><br>`;
        }

        feedback.className = 'feedback wrong';

        // Проверяем, закончились ли жизни
        if (lives <= 0) {
            // Игра окончена - ТЕПЕРЬ сбрасываем стрик
            streak = 0;
            document.getElementById('streak-count').textContent = 0;

            opts.innerHTML = '';
            document.getElementById('next-question').classList.add('hidden');

            feedback.innerHTML += `<div style="margin-top:1.5rem; padding:1rem; background:rgba(255,107,107,0.15); border-radius:8px;">
                <strong style="font-size:1.3rem;">💔 ${translations[currentLang].game_over}</strong><br><br>
                ${translations[currentLang].max_streak} <strong>${maxStreakThisSession}</strong>
            </div>`;

            // Кнопка "Рейтинг"
            const ratingBtn = document.createElement('button');
            ratingBtn.className = 'btn-primary';
            ratingBtn.style.marginTop = '1.5rem';
            ratingBtn.textContent = translations[currentLang].rating_button;
            ratingBtn.onclick = showRatingModal;
            feedback.appendChild(ratingBtn);

            // Сохранение рекорда
            const timeSec = Math.round((Date.now() - gameStartTime) / 1000);
            const user = JSON.parse(localStorage.getItem('quizUser')) || { fio: 'Аноним' };
            const subjectsText = selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'Общий';

            const record = {
                fio: user.fio || 'Аноним',
                streak: maxStreakThisSession,
                time: timeSec,
                date: new Date().toLocaleString(currentLang === 'kk' ? 'kk-KZ' : 'ru-RU'),
                subject: subjectsText
            };

            // Отправляем на сервер
            fetch('/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            })
                .then(res => res.json())
                .then(data => {
                    records = data.records || [];
                    showRatingModal();
                })
                .catch(err => {
                    console.error('Ошибка сохранения рекорда:', err);
                    showRatingModal();
                });
        } else {
            // Еще есть жизни - показываем кнопку "Следующий вопрос"
            // Стрик НЕ сбрасывается! Продолжаем с текущим значением
            document.getElementById('next-question').classList.remove('hidden');

            feedback.innerHTML += `<div style="margin-top:1rem; padding:1rem; background:rgba(92,124,250,0.1); border-radius:8px; border:1px solid var(--accent);">
                <div style="color:var(--text-muted); margin-bottom:0.5rem;">
                    ${translations[currentLang].lives_left} <strong style="color:#ff6b6b; font-size:1.3rem;">${lives}</strong>
                </div>
                <div style="color:var(--accent); font-size:1.1rem;">
                    💪 ${translations[currentLang].current_streak} <strong style="font-size:1.3rem;">${streak}</strong> 🔥
                </div>
            </div>`;
        }
    }
}

// Глобальные переменные для рейтинга
let currentRatingType = 'all';
let currentSubjectFilter = '';

// Функция обновления рейтинга в модальном окне
function updateRating() {
    const type = document.querySelector('input[name="rating-type"]:checked')?.value || 'all';
    currentRatingType = type;
    const select = document.getElementById('subject-filter');
    const subject = select.value;
    currentSubjectFilter = subject;

    // Показ/скрытие селекта предметов
    select.classList.toggle('hidden', type !== 'subject');

    // Если выбран "по предмету" — заполняем селект
    if (type === 'subject') {
        const subjectsSet = new Set();
        records.forEach(r => {
            if (r.subject) subjectsSet.add(r.subject);
        });
        select.innerHTML = '<option value="">Все предметы</option>';
        subjectsSet.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
            select.appendChild(opt);
        });
    }

    // Фильтруем рекорды
    let filteredRecords = records;
    if (type === 'subject' && subject) {
        filteredRecords = records.filter(r => r.subject === subject);
    }

    const list = document.getElementById('rating-list');
    let html = '';
    if (filteredRecords.length === 0) {
        html = `<p>${translations[currentLang].no_records}</p>`;
    } else {
        html = '<ol>';
        filteredRecords.forEach(r => {
            // ИСПРАВЛЕНО: правильный синтаксис шаблонных строк
            html += `<li>
    ${r.fio} — <strong>${r.streak} pts.</strong> (${r.time} ${translations[currentLang].session_time})
</li>`;
        });
        html += '</ol>';
    }
    list.innerHTML = html;
}

// Показ модального окна рейтинга
function showRatingModal() {
    const modal = document.getElementById('rating-modal');
    modal.classList.remove('hidden');

    // Сбрасываем фильтр при открытии
    document.querySelector('input[name="rating-type"][value="all"]').checked = true;
    document.getElementById('subject-filter').classList.add('hidden');

    // Загружаем рейтинг с сервера
    fetch('/records')
        .then(res => res.json())
        .then(data => {
            records = data || [];
            updateRating();
        })
        .catch(err => {
            console.error('Ошибка загрузки рейтинга:', err);
            const list = document.getElementById('rating-list');
            list.innerHTML = '<p>Не удалось загрузить рейтинг</p>';
            modal.classList.remove('hidden');
        });
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('rating-modal').classList.add('hidden');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('quizLang') || 'kk';
    setLanguage(savedLang);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) themeSwitch.checked = savedTheme === 'light';

    // Переключение языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            localStorage.setItem('quizLang', currentLang);
        });
    });

    // Переключение темы
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            const theme = themeSwitch.checked ? 'light' : 'dark';
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // Скрываем экраны по умолчанию
    document.getElementById('subjects-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.add('hidden');

    loadAvailableSubjects();

    // Форма входа
    document.getElementById('user-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const fio = document.getElementById('fio')?.value.trim();
        const iin = document.getElementById('iin')?.value.trim();

        if (!fio || iin.length !== 12 || !/^\d{12}$/.test(iin)) {
            alert(currentLang === 'kk' ? "Толық және дұрыс мәліметтерді енгізіңіз" : "Введите полные и правильные данные");
            return;
        }

        // Сохраняем пользователя
        const userData = { fio, iin, lang: currentLang };
        localStorage.setItem('quizUser', JSON.stringify(userData));

        // Блокируем кнопки языка
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });

        document.getElementById('welcome-screen')?.classList.add('hidden');
        document.getElementById('subjects-screen')?.classList.remove('hidden');
        loadAvailableSubjects();
    });

    // Кнопка "Начать викторину"
    document.getElementById('start-quiz-btn')?.addEventListener('click', async () => {
        const hasQuestions = await loadQuestionsFromSelected();
        if (!hasQuestions) {
            alert(currentLang === 'kk' ? "Таңдалған тақырыптарда сұрақтар жоқ" : "В выбранных предметах нет вопросов");
            return;
        }

        streak = 0;
        maxStreakThisSession = 0;
        lives = 3; // Сбрасываем жизни
        gameStartTime = Date.now();
        document.getElementById('streak-count').textContent = 0;

        // Устанавливаем имя игрока
        const user = JSON.parse(localStorage.getItem('quizUser')) || { fio: 'Аноним' };
        document.getElementById('player-name').textContent = user.fio || 'Аноним';

        updateLivesDisplay(); // Обновляем отображение жизней

        document.getElementById('subjects-screen')?.classList.add('hidden');
        document.getElementById('game-screen')?.classList.remove('hidden');
        showRandomQuestion();
    });

    // Кнопка "Следующий вопрос"
    document.getElementById('next-question')?.addEventListener('click', showRandomQuestion);
});
