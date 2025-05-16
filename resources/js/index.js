document.addEventListener('DOMContentLoaded', function() {
    console.log("jQuery version:", typeof jQuery !== 'undefined' ? jQuery.fn.jquery : "Not loaded");

    if (typeof jQuery === 'undefined') {
        console.error('jQuery не завантажився! Перевірте підключення до файлу vendors/js/jquery.min.js');
        return;
    }

    $(document).ready(function() {
        console.log("jQuery is ready!");

        let workoutSchedule = {};
        let foodList = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const muscleGroups = ["Chest", "Back", "Legs", "Shoulder", "Biceps", "Triceps", "Abs"];
        let selectedMuscles = [];

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

        window.makeSchedule = function() {
            console.log("makeSchedule called");
            selectedMuscles = [];
            muscleGroups.forEach(muscle => {
                if (document.getElementById(muscle).checked) {
                    selectedMuscles.push(muscle);
                }
            });

            console.log("Selected muscles:", selectedMuscles);

            days.forEach(day => {
                const element = document.getElementById(day);
                if (element) element.innerHTML = '';
                if (workoutSchedule[day]) workoutSchedule[day] = [];
            });

            if (selectedMuscles.length > 0) {
                let startDay = document.getElementById('firstday').value;
                let startIndex = days.indexOf(startDay);
                let muscleIndex = 0;

                for (let i = 0; i < days.length; i++) {
                    let currentDayIndex = (startIndex + i) % days.length;
                    let currentDay = days[currentDayIndex];
                    let muscle = selectedMuscles[muscleIndex % selectedMuscles.length];
                    const element = document.getElementById(currentDay);
                    if (element) element.innerHTML = muscle;
                    if (workoutSchedule[currentDay]) workoutSchedule[currentDay].push(muscle);
                    muscleIndex++;
                }
            } else {
                days.forEach(day => {
                    const element = document.getElementById(day);
                    if (element) element.innerHTML = "Rest";
                    if (workoutSchedule[day]) workoutSchedule[day].push("Rest");
                });
            }
        };

        $('.cal-form').on('submit', function(e) {
            e.preventDefault();
            console.log("cal-form submitted");
            const name = document.getElementById('food-name').value;
            const calories = document.getElementById('food-calories').value;
            const protein = document.getElementById('food-protein').value;
            if (name && calories) {
                foodList.push({ name: name, calories: parseInt(calories), protein: parseInt(protein) || 0 });
                document.querySelector('.food-note span').textContent = `${name} added!`;
                document.getElementById('food-name').value = '';
                document.getElementById('food-calories').value = '';
                document.getElementById('food-protein').value = '';
                calCal();
            } else {
                document.querySelector('.food-note span').textContent = 'Please enter food name and calories.';
            }
        });

        window.calCal = function() {
            console.log("calCal called");
            let totalCalories = 0;
            let totalProtein = 0;
            foodList.forEach(food => {
                totalCalories += parseInt(food.calories) || 0;
                totalProtein += parseInt(food.protein) || 0;
            });
            document.getElementById('all-calories').textContent = totalCalories;
            document.getElementById('all-protein').textContent = totalProtein;
        };

        window.clearFood = function() {
            console.log("clearFood called");
            foodList = [];
            document.querySelector('.food-note span').textContent = '';
            document.getElementById('all-calories').textContent = '0';
            document.getElementById('all-protein').textContent = '0';
        };

        window.showProgress = function() {
            console.log("showProgress called");
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
});