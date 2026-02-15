// ========== ПЕРЕВОДЫ ==========
const translations = {
    kk: {
        title: "ҰБТ Штурм",
        logo_title: "♟ ҰБТ-штурм",
        nav_home: "Басты бет",
        nav_rating: "Рейтинг",
        welcome_title: "Қош келдіңіз!",
        welcome_subtitle: "Тестілеуді бастау үшін мәліметтеріңізді енгізіңіз",
        fio_label: "Толық аты-жөніңіз (ФИО)",
        iin_label: "ИИН (12 цифра)",
        language_label: "Тестілеу тілі",
        lang_kk: "Қазақша",
        lang_ru: "Русский",
        continue: "Жалғастыру",
        subjects_title: "Тақырыптарды таңдаңыз",
        subjects_subtitle: "Бір немесе бірнеше тақырыпты белгілеңіз",
        no_subjects: "Қолжетімді тақырыптар жоқ",
        start_quiz: "Тестілеуді бастау",
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
        rating_subtitle: "Ойыншылардың үздік нәтижелері",
        filter_all: "Жалпы",
        filter_subject: "Пән бойынша",
        table_rank: "#",
        table_name: "Ойыншы",
        table_subject: "Пән",
        table_score: "Стрик",
        table_time: "Уақыт",
        session_time: "сек.",
        no_records: "Әзірше рекордтар жоқ",
        rating_button: "Рейтинг көру",
        game_over: "Ойын аяқталды!",
        max_streak: "Максималды стрик:",
        lives_left: "Қалған өмір:",
        current_streak: "Ағымдағы стрик:",
        questions_finished: "Сұрақтар аяқталды!",
        answered_all: "Сіз барлық сұрақтарды жауаптадыңыз!",
        final_streak: "Соңғы стрик:"
    },
    ru: {
        title: "ЕНТ Штурм",
        logo_title: "♟ ЕНТ-штурм",
        nav_home: "Главная",
        nav_rating: "Рейтинг",
        welcome_title: "Добро пожаловать!",
        welcome_subtitle: "Введите свои данные для начала тестирования",
        fio_label: "ФИО полностью",
        iin_label: "ИИН (12 цифр)",
        language_label: "Язык тестирования",
        lang_kk: "Қазақша",
        lang_ru: "Русский",
        continue: "Продолжить",
        subjects_title: "Выберите предметы",
        subjects_subtitle: "Отметьте один или несколько предметов",
        no_subjects: "Доступных предметов нет",
        start_quiz: "Начать тестирование",
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
        rating_subtitle: "Лучшие результаты игроков",
        filter_all: "Общий",
        filter_subject: "По предмету",
        table_rank: "#",
        table_name: "Игрок",
        table_subject: "Предмет",
        table_score: "Стрик",
        table_time: "Время",
        session_time: "сек.",
        no_records: "Пока нет рекордов",
        rating_button: "Посмотреть рейтинг",
        game_over: "Игра окончена!",
        max_streak: "Максимальный стрик:",
        lives_left: "Осталось жизней:",
        current_streak: "Текущий стрик:",
        questions_finished: "Вопросы закончились!",
        answered_all: "Вы ответили на все вопросы!",
        final_streak: "Финальный стрик:"
    }
};

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentLang = "ru";
let currentPage = "home";
let selectedSubjects = [];
let availableSubjects = [];
let allQuestions = [];
let questionQueue = [];
let streak = 0;
let maxStreakThisSession = 0;
let gameStartTime = 0;
let records = [];
let currentQuestionData = null;
let lives = 3;
let maxLives = 3;

const subjects = [
    { id: "biologiya", name_kk: "Биология", name_ru: "Биология" },
    { id: "geografiya", name_kk: "География", name_ru: "География" },
    { id: "qazaqstan-taryhy", name_kk: "Қазақстан тарихы", name_ru: "История Казахстана" },
    { id: "matematika", name_kk: "Математика", name_ru: "Математика" },
    { id: "fizika", name_kk: "Физика", name_ru: "Физика" },
    { id: "himiya", name_kk: "Химия", name_ru: "Химия" },
    { id: "informatika", name_kk: "Информатика", name_ru: "Информатика" }
];

// ========== УТИЛИТЫ ==========
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleOptions(options, correctIndex) {
    const indexed = options.map((option, index) => ({
        text: option,
        wasCorrect: index === correctIndex
    }));
    const shuffled = shuffleArray(indexed);
    const newCorrectIndex = shuffled.findIndex(opt => opt.wasCorrect);
    return {
        options: shuffled.map(opt => opt.text),
        correctIndex: newCorrectIndex
    };
}

function updateLivesDisplay() {
    const container = document.getElementById('lives-count');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('span');
        heart.style.fontSize = '1.5rem';
        heart.style.transition = 'transform 0.3s ease';
        if (i < lives) {
            heart.textContent = '❤️';
            heart.style.animation = 'heartbeat 1s ease infinite';
        } else {
            heart.textContent = '🖤';
            heart.style.opacity = '0.3';
        }
        container.appendChild(heart);
    }
}

// ========== НАВИГАЦИЯ ==========
function navigateTo(page) {
    currentPage = page;

    // Скрываем все секции
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));

    // Показываем нужную секцию
    const pageMap = {
        'home': 'welcome-screen',
        'rating': 'rating-screen'
    };

    const sectionId = pageMap[page];
    if (sectionId) {
        document.getElementById(sectionId).classList.remove('hidden');
    }

    // Обновляем активную кнопку в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Если открываем рейтинг - загружаем данные
    if (page === 'rating') {
        loadRating();
    }
}

// ========== ПЕРЕВОДЫ ==========
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Обновляем активную кнопку языка в форме
    document.querySelectorAll('.lang-btn-form').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    if (!document.getElementById('subjects-screen').classList.contains('hidden')) {
        renderSubjects();
    }
}

// ========== ПРЕДМЕТЫ ==========
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
                availableSubjects.push({ ...sub, questionCount: filtered.length });
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
${translations[currentLang].no_subjects}</p>`;
        document.getElementById('start-quiz-btn').disabled = true;
        return;
    }

    availableSubjects.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'subject-item';
        div.dataset.id = sub.id;
        div.innerHTML = `<span>${sub[`name_${currentLang}`]}<br><small style="opacity:0.7;">(${sub.questionCount})</small></span>`;
        div.onclick = () => {
            div.classList.toggle('selected');
            const sel = Array.from(document.querySelectorAll('.subject-item.selected')).map(el => el.dataset.id);
            document.getElementById('start-quiz-btn').disabled = sel.length === 0;
        };
        grid.appendChild(div);
    });
}

// ========== ВОПРОСЫ ==========
async function loadQuestionsFromSelected() {
    allQuestions = [];
    const selectedIds = Array.from(document.querySelectorAll('.subject-item.selected')).map(el => el.dataset.id);
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
            console.error(`Ошибка загрузки ${id}:`, e);
        }
    }

    if (allQuestions.length > 0) {
        questionQueue = allQuestions.map((_, index) => index);
        questionQueue = shuffleArray(questionQueue);
    }

    return allQuestions.length > 0;
}

function showRandomQuestion() {
    if (questionQueue.length === 0) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div style="text-align:center; padding:2rem;">
                <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
                <h2 style="color:var(--accent); margin-bottom:1rem;">${translations[currentLang].questions_finished}</h2>
                <p style="font-size:1.2rem; margin-bottom:1rem;">${translations[currentLang].answered_all}</p>
                <div style="font-size:1.5rem; color:var(--accent); margin-bottom:2rem;">
                    ${translations[currentLang].final_streak} <strong style="font-size:2rem;">${streak}</strong> 🔥
                </div>
            </div>
        `;
        feedback.className = 'feedback correct';
        feedback.classList.remove('hidden');

        const ratingBtn = document.createElement('button');
        ratingBtn.className = 'btn-primary';
        ratingBtn.textContent = translations[currentLang].rating_button;
        ratingBtn.onclick = () => navigateTo('rating');
        feedback.appendChild(ratingBtn);

        saveRecord();
        return;
    }

    const questionIndex = questionQueue.shift();
    const q = allQuestions[questionIndex];
    currentQuestionData = q;

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-question').classList.add('hidden');
    document.getElementById('question-text').textContent = q.id + ': \n' + q.question;

    // Изображение
    const imgCont = document.getElementById('question-image');
    imgCont.innerHTML = '';
    if (q.image && q.image.trim()) {
        const img = document.createElement('img');
        img.src = q.image.trim();
        img.alt = translations[currentLang].question;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.onerror = () => {
            imgCont.innerHTML = `<p style="color:#ef4444; text-align:center;">Изображение не найдено</p>`;
        };
        imgCont.appendChild(img);
        imgCont.classList.remove('hidden');
    } else {
        imgCont.classList.add('hidden');
    }

    // Варианты
    const shuffled = shuffleOptions(q.options, q.correct);
    const opts = document.getElementById('options-container');
    opts.innerHTML = '';
    shuffled.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i, shuffled.correctIndex, shuffled.options);
        opts.appendChild(btn);
    });
}

function checkAnswer(selectedIdx, correctIdx, shuffledOptions) {
    const opts = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    opts.forEach(btn => btn.disabled = true);

    if (selectedIdx === correctIdx) {
        streak++;
        if (streak > maxStreakThisSession) maxStreakThisSession = streak;
        document.getElementById('streak-count').textContent = streak;
        opts[selectedIdx].classList.add('correct');

        feedback.innerHTML = `<strong>${translations[currentLang].correct}</strong>`;
        if (currentQuestionData.explanation) {
            feedback.innerHTML += `<br><br><strong>${translations[currentLang].explanation}</strong> ${currentQuestionData.explanation}`;
        }
        if (currentQuestionData.source) {
            feedback.innerHTML += `<br><br><strong>${translations[currentLang].source}</strong> ${currentQuestionData.source}`;
        }
        feedback.className = 'feedback correct';
        document.getElementById('next-question').classList.remove('hidden');
    } else {
        lives--;
        updateLivesDisplay();
        opts[selectedIdx].classList.add('wrong');
        opts[correctIdx].classList.add('correct');

        feedback.innerHTML = `<strong>${translations[currentLang].wrong}</strong><br><br>
<strong>${translations[currentLang].correct_answer}</strong> ${shuffledOptions[correctIdx]}<br><br>`;

        if (currentQuestionData.explanation) {
            feedback.innerHTML += `<strong>${translations[currentLang].explanation}</strong> ${currentQuestionData.explanation}<br><br>`;
        }
        if (currentQuestionData.source) {
            feedback.innerHTML += `<strong>${translations[currentLang].source}</strong> ${currentQuestionData.source}<br><br>`;
        }
        feedback.className = 'feedback wrong';

        if (lives <= 0) {
            streak = 0;
            document.getElementById('streak-count').textContent = 0;
            feedback.innerHTML += `<div style="margin-top:1.5rem; padding:1rem; background:rgba(239,68,68,0.15); border-radius:12px; border:2px solid var(--error);">
                <strong style="font-size:1.3rem;">💔 ${translations[currentLang].game_over}</strong><br><br>
                ${translations[currentLang].max_streak} <strong>${maxStreakThisSession}</strong>
            </div>`;

            const ratingBtn = document.createElement('button');
            ratingBtn.className = 'btn-primary';
            ratingBtn.style.marginTop = '1.5rem';
            ratingBtn.textContent = translations[currentLang].rating_button;
            ratingBtn.onclick = () => navigateTo('rating');
            feedback.appendChild(ratingBtn);
            saveRecord();
        } else {
            document.getElementById('next-question').classList.remove('hidden');
            feedback.innerHTML += `<div style="margin-top:1rem; padding:1rem; background:var(--accent-light); border-radius:8px; border:1px solid var(--accent);">
                <div style="color:var(--text-muted); margin-bottom:0.5rem;">
                    ${translations[currentLang].lives_left} <strong style="color:var(--error); font-size:1.3rem;">${lives}</strong>
                </div>
                <div style="color:var(--accent); font-size:1.1rem;">
                    💪 ${translations[currentLang].current_streak} <strong style="font-size:1.3rem;">${streak}</strong> 🔥
                </div>
            </div>`;
        }
    }
}

// ========== РЕКОРДЫ ==========
function saveRecord() {
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

    fetch('/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    })
        .then(res => res.json())
        .then(data => { records = data.records || []; })
        .catch(err => console.error('Ошибка сохранения:', err));
}

function loadRating() {
    fetch('/records')
        .then(res => res.json())
        .then(data => {
            records = data || [];

            // Создаем кнопки предметов
            createSubjectButtons();

            // Показываем общий рейтинг
            renderRating(records);
        })
        .catch(err => {
            console.error('Ошибка загрузки рейтинга:', err);
            renderRating([]);
        });
}

function createSubjectButtons() {
    const subjectFilters = document.getElementById('subject-filters');
    const mainFilters = document.getElementById('main-filters');

    if (!subjectFilters || !mainFilters) return;

    // Собираем уникальные предметы из рекордов
    const subjectsSet = new Set();
    records.forEach(r => {
        if (r.subject) subjectsSet.add(r.subject);
    });

    // Если есть предметы, показываем кнопки
    if (subjectsSet.size > 0) {
        subjectFilters.innerHTML = '';
        subjectFilters.classList.remove('hidden');

        subjectsSet.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.subject = subject;

            // Иконки для предметов
            const icons = {
                'Информатика': '💻',
                'Informatika': '💻',
                'Математика': '📐',
                'Matematika': '📐',
                'Физика': '⚛️',
                'Fizika': '⚛️',
                'Химия': '🧪',
                'Himiya': '🧪',
                'Биология': '🧬',
                'Biologiya': '🧬',
                'География': '🌍',
                'Geografiya': '🌍',
                'История': '📜'
            };

            const icon = Object.keys(icons).find(key => subject.includes(key));
            const iconEmoji = icon ? icons[icon] : '📚';

            btn.innerHTML = `
                <span class="filter-icon">${iconEmoji}</span>
                <span>${subject}</span>
            `;

            btn.onclick = () => {
                // Снимаем активность с "Общий"
                mainFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Снимаем активность с других предметов
                subjectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Активируем текущую кнопку
                btn.classList.add('active');

                // Фильтруем рейтинг
                const filtered = records.filter(r => r.subject === subject);
                renderRating(filtered);
            };

            subjectFilters.appendChild(btn);
        });
    } else {
        subjectFilters.classList.add('hidden');
    }
}

function renderRating(data) {
    const tbody = document.getElementById('rating-tbody');
    const empty = document.getElementById('rating-empty');

    if (data.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    tbody.innerHTML = '';

    data.forEach((record, index) => {
        const tr = document.createElement('tr');

        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';

        tr.innerHTML = `
            <td class="col-rank"><span class="rank-medal">${medal}</span>${index + 1}</td>
            <td class="col-name">${record.fio}</td>
            <td class="col-subject">${record.subject}</td>
            <td class="col-score">${record.streak} 🔥</td>
            <td class="col-time">${record.time} ${translations[currentLang].session_time}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Язык
    const savedLang = localStorage.getItem('quizLang') || 'ru';
    setLanguage(savedLang);

    // Тема
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) themeSwitch.checked = savedTheme === 'light';

    // Навигация
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navigateTo(link.dataset.page));
    });

    // Клик по логотипу
    document.querySelector('.nav-logo').addEventListener('click', () => {
        location.reload();
    });

    // Переключение темы
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            const theme = themeSwitch.checked ? 'light' : 'dark';
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // Переключение языка в форме
    document.querySelectorAll('.lang-btn-form').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            localStorage.setItem('quizLang', currentLang);
        });
    });

    // Форма входа
    document.getElementById('user-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const fio = document.getElementById('fio')?.value.trim();
        const iin = document.getElementById('iin')?.value.trim();

        if (!fio || iin.length !== 12 || !/^\d{12}$/.test(iin)) {
            alert(currentLang === 'kk' ? "Толық және дұрыс мәліметтерді енгізіңіз" : "Введите полные и правильные данные");
            return;
        }

        localStorage.setItem('quizUser', JSON.stringify({ fio, iin, lang: currentLang }));
        document.getElementById('welcome-screen')?.classList.add('hidden');
        document.getElementById('subjects-screen')?.classList.remove('hidden');
        loadAvailableSubjects();
    });

    // Старт викторины
    document.getElementById('start-quiz-btn')?.addEventListener('click', async () => {
        const hasQuestions = await loadQuestionsFromSelected();
        if (!hasQuestions) {
            alert(currentLang === 'kk' ? "Таңдалған тақырыптарда сұрақтар жоқ" : "В выбранных предметах нет вопросов");
            return;
        }

        streak = 0;
        maxStreakThisSession = 0;
        lives = 3;
        gameStartTime = Date.now();
        document.getElementById('streak-count').textContent = 0;

        const user = JSON.parse(localStorage.getItem('quizUser')) || { fio: 'Аноним' };
        document.getElementById('player-name').textContent = user.fio || 'Аноним';
        updateLivesDisplay();

        document.getElementById('subjects-screen')?.classList.add('hidden');
        document.getElementById('game-screen')?.classList.remove('hidden');
        showRandomQuestion();
    });

    // Следующий вопрос
    document.getElementById('next-question')?.addEventListener('click', showRandomQuestion);

    // Фильтры рейтинга - кнопка "Общий"
    document.querySelectorAll('#main-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Снимаем активность со всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Активируем "Общий"
            btn.classList.add('active');
            // Показываем все рекорды
            renderRating(records);
        });
    });

    document.getElementById('subject-filter')?.addEventListener('change', updateSubjectFilter);

    loadAvailableSubjects();
});