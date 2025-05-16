// Перевірка, чи завантажився jQuery
if (typeof jQuery === 'undefined') {
    console.error('jQuery не завантажився! Перевірте підключення до файлу vendors/js/jquery.min.js');
} else {
    $(document).ready(function() {
        // Ініціалізація змінних
        let workoutSchedule = {};
        let foodList = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const muscleGroups = ["Chest", "Back", "Legs", "Shoulder", "Biceps", "Triceps", "Abs"];
        let selectedMuscles = [];

        // Профіль
        window.saveProfile = function() {
            const name = document.getElementById('name').value;
            const weight = document.getElementById('weight').value;
            const height = document.getElementById('height').value;
            const goal = document.getElementById('goal').value;
            if (name && weight && height && goal) {
                const profileInfo = `Name: ${name}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}`;
                document.getElementById('profileInfo').textContent = profileInfo;
                localStorage.setItem('profile', profileInfo);
            } else {
                document.getElementById('profileInfo').textContent = 'Please fill in all fields.';
            }
        };

        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
            document.getElementById('profileInfo').textContent = savedProfile;
        }

        // Планування розкладу (виправлено)
        window.makeSchedule = function() {
            selectedMuscles = [];
            muscleGroups.forEach(muscle => {
                if (document.getElementById(muscle).checked) {
                    selectedMuscles.push(muscle);
                }
            });

            // Очищаємо попередній розклад
            days.forEach(day => {
                document.getElementById(day).innerHTML = '';
                workoutSchedule[day] = [];
            });

            // Генеруємо новий розклад
            if (selectedMuscles.length > 0) {
                let startDay = document.getElementById('firstday').value;
                let startIndex = days.indexOf(startDay);
                let muscleIndex = 0;

                for (let i = 0; i < days.length; i++) {
                    let currentDayIndex = (startIndex + i) % days.length;
                    let currentDay = days[currentDayIndex];
                    // Якщо м’язів більше, ніж днів, циклічно розподіляємо
                    let muscle = selectedMuscles[muscleIndex % selectedMuscles.length];
                    document.getElementById(currentDay).innerHTML = muscle;
                    workoutSchedule[currentDay].push(muscle);
                    muscleIndex++;
                }
            } else {
                days.forEach(day => {
                    document.getElementById(day).innerHTML = "Rest";
                    workoutSchedule[day].push("Rest");
                });
            }
        };

        // Додавання їжі (виправлено)
        $('.cal-form').on('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('food-name').value;
            const calories = document.getElementById('food-calories').value;
            const protein = document.getElementById('food-protein').value;
            if (name && calories) {
                foodList.push({ name: name, calories: parseInt(calories), protein: parseInt(protein) || 0 });
                document.querySelector('.food-note span').textContent = `${name} added!`;
                document.getElementById('food-name').value = '';
                document.getElementById('food-calories').value = '';
                document.getElementById('food-protein').value = '';
                calCal(); // Оновлюємо підрахунок
            } else {
                document.querySelector('.food-note span').textContent = 'Please enter food name and calories.';
            }
        });

        // Підрахунок калорій і протеїнів
        window.calCal = function() {
            let totalCalories = 0;
            let totalProtein = 0;
            foodList.forEach(food => {
                totalCalories += parseInt(food.calories) || 0;
                totalProtein += parseInt(food.protein) || 0;
            });
            document.getElementById('all-calories').textContent = totalCalories;
            document.getElementById('all-protein').textContent = totalProtein;
        };

        // Очищення
        window.clearFood = function() {
            foodList = [];
            document.querySelector('.food-note span').textContent = '';
            document.getElementById('all-calories').textContent = '0';
            document.getElementById('all-protein').textContent = '0';
        };

        // Перегляд прогресу
        window.showProgress = function() {
            let totalWorkouts = 0;
            for (let day in workoutSchedule) {
                workoutSchedule[day].forEach(activity => {
                    if (activity !== "Rest") totalWorkouts++;
                });
            }
            document.getElementById('totalWorkouts').textContent = totalWorkouts;

            let totalWeeklyCalories = 0;
            foodList.forEach(food => {
                totalWeeklyCalories += parseInt(food.calories) || 0;
            });
            document.getElementById('totalWeeklyCalories').textContent = totalWeeklyCalories;

            document.getElementById('progress-result').style.display = 'block';
        };
    });
}