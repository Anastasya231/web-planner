$(document).ready(function() {
    console.log("jQuery version:", jQuery.fn.jquery);

    // Ініціалізація змінних
    let workoutSchedule = {};
    let foodList = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const muscleGroups = ["Chest", "Back", "Legs", "Shoulder", "Biceps", "Triceps", "Abs"];

    // Функція планування розкладу
    function makeSchedule() {
        console.log("makeSchedule triggered");
        const selectedMuscles = muscleGroups.filter(muscle => $('#' + muscle).is(':checked'));
        console.log("Selected muscles:", selectedMuscles);

        // Очищаємо попередній розклад
        days.forEach(day => {
            const $dayElement = $('#' + day);
            if ($dayElement.length) {
                $dayElement.text('');
                workoutSchedule[day] = [];
            } else {
                console.warn(`Element with id "${day}" not found`);
            }
        });

        // Генеруємо новий розклад
        if (selectedMuscles.length > 0) {
            const startDay = $('#firstday').val() || 'Monday';
            const startIndex = days.indexOf(startDay);
            let muscleIndex = 0;

            days.forEach((_, i) => {
                const currentDay = days[(firstDayIndex + i) % days.length];

                const muscle = selectedMuscles[muscleIndex % selectedMuscles.length];
                const $dayElement = $('#' + currentDay);
                if ($dayElement.length) {
                    $dayElement.text(muscle);
                    workoutSchedule[currentDay] = [muscle];
                }
                muscleIndex++;
            });
        } else {
            days.forEach(day => {
                const $dayElement = $('#' + day);
                if ($dayElement.length) {
                    $dayElement.text('Rest');
                    workoutSchedule[day] = ['Rest'];
                }
            });
        }
    }

    // Обробник кнопки для розкладу
    $('#createScheduleBtn').on('click', function(e) {
        e.preventDefault();
        makeSchedule();
    });

    // Функція збереження профілю
    window.saveProfile = function() {
        const name = $('#name').val();
        const weight = $('#weight').val();
        const height = $('#height').val();
        const goal = $('#goal').val();
        if (name && weight && height && goal) {
            const profileInfo = `Name: ${name}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}`;
            $('#profileInfo').text(profileInfo);
            localStorage.setItem('profile', profileInfo);
        } else {
            $('#profileInfo').text('Please fill in all fields.');
        }
    };

    // Завантаження збереженого профілю
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        $('#profileInfo').text(savedProfile);
    }

    // Обробка форми калорій
    $('.cal-form').on('submit', function(e) {
        e.preventDefault();
        console.log("cal-form submitted");
        const name = $('#food-name').val();
        const calories = $('#food-calories').val();
        const protein = $('#food-protein').val();
        if (name && calories) {
            foodList.push({ name, calories: parseInt(calories), protein: parseInt(protein) || 0 });
            $('.food-note span').text(`${name} added!`);
            $('#food-name').val('');
            $('#food-calories').val('');
            $('#food-protein').val('');
            calCal();
        } else {
            $('.food-note span').text('Please enter food name and calories.');
        }
    });

    // Підрахунок калорій і протеїну
    function calCal() {
        console.log("calCal triggered");
        const totalCalories = foodList.reduce((sum, food) => sum + (parseInt(food.calories) || 0), 0);
        const totalProtein = foodList.reduce((sum, food) => sum + (parseInt(food.protein) || 0), 0);
        $('#all-calories').text(totalCalories);
        $('#all-protein').text(totalProtein);
    }

    // Очищення даних
    window.clearFood = function() {
        console.log("clearFood triggered");
        foodList = [];
        $('.food-note span').text('');
        $('#all-calories').text('0');
        $('#all-protein').text('0');
    };

    // Показ прогресу
    window.showProgress = function() {
        console.log("showProgress triggered");
        const totalWorkouts = Object.values(workoutSchedule).reduce((sum, activities) => 
            sum + (activities.includes('Rest') ? 0 : activities.length), 0);
        const totalWeeklyCalories = foodList.reduce((sum, food) => sum + (parseInt(food.calories) || 0), 0);
        $('#totalWorkouts').text(totalWorkouts);
        $('#totalWeeklyCalories').text(totalWeeklyCalories);
        $('#progress-result').css('display', 'block');
    };
});