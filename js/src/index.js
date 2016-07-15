$(document).ready(function () {
    var pomodoroTimer = $('.pomodoro-timer'),
        pomodoroControl = $('.pomodoro-length-control'),
        pomodoroTimerType = $('#pomodoroTimerType'),
        pomodoroTimerProgress = $('#pomodoroTimerProgress');


    var pomodoro = new Pomodoro(pomodoroTimer, pomodoroTimerType, pomodoroTimerProgress, pomodoroControl);

    pomodoroTimerType.text(timer.currentTimer);
    pomodoroTimerProgress.text(timer.currentSessionTime + ":00");

});

function Pomodoro(pomodoroTimer, pomodoroTimerType, pomodoroTimerProgress, pomodoroControl) {

    pomodoroTimer.click(function () {
        var breakValue = $('#breakValue').text(),
            sessionValue = $('#sessionValue').text(),
            timerConfig = {
                session: sessionValue * 60,
                break: breakValue * 60
            };

        timer.turn(timerConfig, function (currentTime, timerType) {
            var min = Math.floor(currentTime / 60),
                sec = currentTime % 60;

            pomodoroTimerType.text(timerType);
            pomodoroTimerProgress.text(min + ":" + sec);
        });

    });

    pomodoroControl.click(function () {
        var currentItem = $(this).hasClass('session') ? '#sessionValue' : '#breakValue',
            currentOperation = $(this).val(),
            currentValue = $(currentItem).text();

        if (timer.timerState == TIMER_INIT_STATE) {
            if (currentOperation == "-" && currentValue >= 2) {
                $(currentItem).text(--currentValue);
                console.log(currentItem);
            } else if (currentOperation == "+") {
                $(currentItem).text(++currentValue);
                console.log(currentItem);
            }
        }
    });
}



