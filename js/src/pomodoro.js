$(document).ready(function () {
    var pomodoroTimerProgress = $('#pomodoroTimerProgress'),
        pomodoroTimer = $('.pomodoro-timer'),
        control = $('.pomodoro-length-control'),
        breakValue = $('#breakValue').text(),
        sessionValue = $('#sessionValue').text();

    control.click(function () {
        var currentItem = $(this).hasClass('session') ? '#sessionValue' : '#breakValue',
            currentOperation = $(this).val(),
            currentValue = $(currentItem).text();

        if (currentOperation == "-" && currentValue >= 2) {
            $(currentItem).text(--currentValue);
        } else if (currentOperation == "+") {
            $(currentItem).text(++currentValue);
        }
    });

    pomodoroTimer.click(function () {
        var timerState = pomodoro.timerState,
            timerValue = $('#pomodoroTimerProgress').text();

        if (timerState == 1) {
            pomodoro.stop();
        } else if (timerState == 0) {
            pomodoro.start(timerValue, breakValue, showProgress);
        }

    });


    pomodoro.timerId = pomodoro.start(sessionValue, breakValue, showProgress);

    function showProgress(sessionTime) {
        pomodoroTimerProgress.text(sessionTime);
    }

});

var pomodoro = {
    timerId: 0,
    timerState: 0,
    start: function (sessionTime, breakTime, callback) {
        var timerId = setInterval(function () {
            callback(sessionTime--);
        }, 1000);

        setTimeout(function () {
            clearInterval(timerId);
            console.log("stop");
        }, sessionTime * 1000);

        this.timerState = 1;
        return timerId;
    },
    stop: function () {
        clearInterval(this.timerId);
        this.timerState = 0;
    },
    reset: function () {

    }
};
