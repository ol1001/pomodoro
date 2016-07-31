$(document).ready(function () {
    var pomodoroTimer = $('.pomodoro-timer'),
        pomodoroControl = $('.pomodoro-length-control'),
        pomodoroTimerType = $('#pomodoroTimerType'),
        pomodoroTimerProgress = $('#pomodoroTimerProgress'),
        pomodoroResetTimer = $('.pomodoroResetTimer');

    var pomodoro = new Pomodoro(pomodoroTimer, pomodoroTimerType, pomodoroTimerProgress, pomodoroControl, pomodoroResetTimer);

    pomodoroTimerType.text(timer.currentTimer);
    pomodoroTimerProgress.text(timer.currentSessionTime + ":00");
});

function Pomodoro(pomodoroTimer, pomodoroTimerType, pomodoroTimerProgress, pomodoroControl, pomodoroResetTimer) {

    pomodoroTimer.click(function () {
        var breakValue = $('#breakValue').text(),
            sessionValue = $('#sessionValue').text(),
            timerConfig = {
            session: sessionValue * 60,
            break: breakValue * 60
        };

        timer.turn(timerConfig, showTimer);

        function showTimer(currentTime, timerType) {
            var min = Math.floor(currentTime / 60),
                sec = currentTime % 60;

            pomodoroTimerType.text(timerType);
            pomodoroTimerProgress.text(min + ":" + sec);

            if (currentTime == 0) {
                playSound();
            }
        }

        function playSound() {
            var path = "http://www.w3schools.com/html/horse.mp3";

            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', path);
            audioElement.play();
        }
    });

    pomodoroResetTimer.click(function () {
        var pomodoroSessionValue = $('#sessionValue'),
            pomodoroBreakValue = $('#breakValue');

        timer.pause();
        timer.currentBreakTime = 5 * 60;
        timer.currentSessionTime = 25 * 60;
        timer.currentTimer = "session";
        timer.timerState = TIMER_INIT_STATE;
        pomodoroSessionValue.text("25");
        pomodoroBreakValue.text("5");
        pomodoroTimerProgress.text("25:00");
    });

    pomodoroControl.click(function () {
        var currentItem = $(this).hasClass('session') ? '#sessionValue' : '#breakValue',
            currentOperation = $(this).val(),
            currentValue = $(currentItem).text();

        if (timer.timerState == TIMER_INIT_STATE) {
            if (currentOperation == "-" && currentValue >= 2) {
                $(currentItem).text(--currentValue);
            } else if (currentOperation == "+") {
                $(currentItem).text(++currentValue);
            }
            if (currentItem == "#sessionValue") {
                pomodoroTimerProgress.text(currentValue + ":00");
            }
        } else if (timer.timerState == TIMER_PAUSE_STATE) {
            if (currentOperation == "-" && currentValue >= 2) {
                --currentValue;
                $(currentItem).text(currentValue);
            } else if (currentOperation == "+") {
                ++currentValue;
                $(currentItem).text(currentValue);
            }
            if (currentItem == "#sessionValue" && timer.currentTimer == "session") {
                timer.currentSessionTime = currentValue * 60;
                pomodoroTimerProgress.text(currentValue + ":00");
            } else if (currentItem == "#sessionValue" && timer.currentTimer == "break") {
                timer.currentSessionTime = currentValue * 60;
            } else if (currentItem == "#breakValue" && timer.currentTimer == "break") {
                timer.currentBreakTime = currentValue * 60;
                pomodoroTimerProgress.text(currentValue + ":00");
            } else if (currentItem == "#breakValue" && timer.currentTimer == "session") {
                timer.currentBreakTime = currentValue * 60;
            }
        }
    });
}
const TIMER_INIT_STATE = "INIT";
const TIMER_RUN_STATE = "RUN";
const TIMER_PAUSE_STATE = "PAUSE";

var timer = {
    timerID: 0,
    timerState: TIMER_INIT_STATE,
    currentTimer: "session",
    currentSessionTime: 25,
    currentBreakTime: 5,

    run: function (timerConfig, timerType, showTimer) {
        this.timerState = TIMER_RUN_STATE;

        var t = this;
        t.currentBreakTime = timerConfig.break;
        t.currentSessionTime = timerConfig.session;
        t.currentTimer = timerType;

        var currentTime = timerType == "session" ? t.currentSessionTime : t.currentBreakTime;

        t.timerID = setInterval(function () {
            currentTime--;

            if (t.currentTimer == "session") {
                t.currentSessionTime = currentTime;
            } else if (t.currentTimer == "break") {
                t.currentBreakTime = currentTime;
            }

            showTimer(currentTime, t.currentTimer);

            if (currentTime == 0) {
                clearInterval(t.timerID);
                t.run(timerConfig, t.currentTimer == "session" ? "break" : "session", showTimer);
            }
        }, 1000);
    },

    pause: function () {
        this.timerState = TIMER_PAUSE_STATE;
        clearInterval(this.timerID);
    },

    turn: function (timerConfig, showTimer) {
        switch (this.timerState) {
            case TIMER_INIT_STATE:
                this.run(timerConfig, timer.currentTimer, showTimer);
                break;
            case TIMER_RUN_STATE:
                this.pause();
                break;
            case TIMER_PAUSE_STATE:
                this.run({
                    session: this.currentSessionTime,
                    break: this.currentBreakTime
                }, timer.currentTimer, showTimer);
                break;
            default:
                alert("Timer ERROR");
        }
    }
};
