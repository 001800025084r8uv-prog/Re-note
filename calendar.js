document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const reminderList = document.getElementById('reminder-list');


    let currentDate = new Date();
    let today = new Date();


    function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();


    currentMonthYear.textContent = `${year}年 ${month + 1}月`;
    calendarGrid.innerHTML = '';


    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);


    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }


    const mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];


    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = day;
        const fullDate = new Date(year, month, day);


        if (fullDate.toDateString() === today.toDateString()) {
            dateDiv.classList.add('today');
        }


        // 学習日と復習日のチェック
        mindmaps.forEach(map => {
            const learningDate = new Date(map.learningDate);
            if (fullDate.toDateString() === learningDate.toDateString()) {
                dateDiv.classList.add('has-task'); // 学習日に色を付ける
            }


            const reviewIntervals = [1, 3, 7, 30, 180];
            reviewIntervals.forEach(interval => {
                const reviewDate = new Date(learningDate);
                reviewDate.setDate(learningDate.getDate() + interval);
                if (fullDate.toDateString() === reviewDate.toDateString()) {
                    dateDiv.classList.add('review-date'); // 復習日に色を付ける
                }
            });
        });


        calendarGrid.appendChild(dateDiv);
    }
}




    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });


    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });


    renderCalendar();
    displayTodayReminders();


function displayTodayReminders() {
    reminderList.innerHTML = '';
    let hasReminders = false;


    const mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];
    const todayDate = today.toDateString();


    mindmaps.forEach(item => {
        const learningDate = new Date(item.learningDate);
        const todayDateObj = new Date(todayDate);
        const diffTime = Math.abs(todayDateObj - learningDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


        const reviewIntervals = [1, 3, 7, 30, 180];
        if (reviewIntervals.includes(diffDays)) {
            const reminderItem = document.createElement('div');
            reminderItem.className = 'reminder-item';
            reminderItem.textContent = `✅ ${item.title}の復習をしよう！`;
            reminderList.appendChild(reminderItem);
            hasReminders = true;
        }
    });


    if (!hasReminders) {
        reminderList.innerHTML = '<p>復習する項目はありません。</p>';
    }
}