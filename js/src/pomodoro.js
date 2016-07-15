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

        var currentTime = (timerType == "session") ? t.currentSessionTime : t.currentBreakTime;

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
                t.run(timerConfig, (t.currentTimer == "session") ? "break" : "session", showTimer);
            }

        }, 1000);

    },


    pause: function () {
        this.timerState = TIMER_PAUSE_STATE;
        clearInterval(this.timerID);
    },

    restart: function (sessionTime,breakTime) {

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





