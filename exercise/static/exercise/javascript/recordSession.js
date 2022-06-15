if (localStorage.getItem('data')) {
  const data = JSON.parse(localStorage.getItem('data'));
  const sessionNames = data.sessionName.split(',');
  const sessionBodyParts = data.sessionBodyPart.split(',');
  const sessionCnts = data.sessionCnt.split(',');
  const sessionSets = data.sessionSet.split(',');

  const sessionRecordContainer = document.querySelector(
    '.session_record_container'
  );

  for (let i = 0; i < sessionNames.length; i++) {
    const item = document.createElement('li');
    item.classList.add('session_record_wrapper');

    item.innerHTML = `
      <div class="session_record_box session_name">
        <span>${sessionNames[i]}</span>
      </div>
      <div class="session_record_box session_name">
        <span>${sessionBodyParts[i]}</span>
      </div>
      <div class="session_record_box session_cnt_box">
        <div class="session_cnt">
          <span>${sessionCnts[i]}</span>
        </div>
        <span>회</span>
        <span>X</span>
        <div class="set_cnt">
          <span>${sessionSets[i]}</span>
        </div>
        <span>세트</span>
      </div>
      <div class="session_record_box each_session_time"></div>
      <button class="session_fin_btn" type="submit">완료</button>
    `;

    sessionRecordContainer.appendChild(item);
  }

  document.addEventListener('DOMContentLoaded', () => {
    timerBtnEvt();
  });

  const totalTime = document.querySelector('.total_time');

  const init = () => {
    totalTime.innerHTML = '00:00:00';
  };

  const timerBtnEvt = () => {
    let time = 0;
    let clickedStatus = true;
    let hour = 0;
    let min = 0;
    let sec = 0;
    let timer;

    const timerStartBtn = document.querySelector('.timer_start_btn');
    const timerPauseBtn = document.querySelector('.timer_reset_btn');
    const timerStopBtn = document.querySelector('.timer_stop_btn');
    const timerRefreshBtn = document.querySelector('.timer_refresh_btn');

    const sessionRecordWrappers = document.querySelectorAll(
      '.session_record_wrapper'
    );
    const eachSessionTimes = document.querySelectorAll('.each_session_time');
    const sessionFinBtns = document.querySelectorAll('.session_fin_btn');

    sessionRecordWrappers.forEach((sessionRecordWrapper) => {
      sessionRecordWrapper.classList.add('wrap_disabled');
    });

    sessionFinBtns.forEach((sessionFinBtn, idx) => {
      sessionFinBtn.classList.add('btn_disabled');
    });

    timerStartBtn.addEventListener('click', () => {
      sessionFinBtns[0].classList.remove('btn_disabled');
      sessionRecordWrappers[0].classList.remove('wrap_disabled');

      sessionFinBtns.forEach((sessionFinBtn, idx) => {
        sessionFinBtn.addEventListener(
          'click',
          () => {
            if (idx + 1 <= sessionFinBtns.length - 1) {
              sessionFinBtns[idx + 1].classList.remove('btn_disabled');
              sessionRecordWrappers[idx + 1].classList.remove('wrap_disabled');
              sessionFinBtns[idx].classList.add('btn_disabled');
              sessionRecordWrappers[idx].classList.add('wrap_disabled');
            }

            min = Math.floor(time / 60);
            hour = Math.floor(min / 60);
            sec = time % 60;
            min = min % 60;

            let th = hour;
            let tm = min;
            let ts = sec;

            if (th < 10) {
              th = '0' + hour;
            }
            if (tm < 10) {
              tm = '0' + min;
            }
            if (ts < 10) {
              ts = '0' + sec;
            }

            eachSessionTimes[idx].innerHTML = `${th}:${tm}:${ts}`;

            if (sessionFinBtn === sessionFinBtns[sessionFinBtns.length - 1]) {
              console.log('마지막이라능');
              clearInterval(timer);
              clickedStatus = true;

              sessionFinBtn.classList.add('btn_disabled');
              sessionRecordWrappers[
                sessionRecordWrappers.length - 1
              ].classList.add('wrap_disabled');
              timerStartBtn.style.color = 'black';
              timerStartBtn.style.pointerEvents = 'none';
              timerPauseBtn.style.pointerEvents = 'none';
              timerStopBtn.style.pointerEvents = 'none';

              const sessionModal = document.querySelector('.session_modal');
              sessionModal.style.display = 'block';

              const sessionModalReturnBtn = document.querySelector(
                '.session_modal_return_btn'
              );

              sessionModalReturnBtn.addEventListener('click', () => {
                sessionModal.style.display = 'none';
              });

              timerStopBtn.style.display = 'none';
              timerRefreshBtn.style.display = 'flex';

              timerRefreshBtn.addEventListener('click', () => {
                timerStopBtn.style.display = 'flex';
                timerRefreshBtn.style.display = 'none';
                eachSessionTimes.forEach(
                  (eachSessionTime) => (eachSessionTime.innerHTML = '')
                );
                timerStartBtn.style.pointerEvents = 'auto';
                timerPauseBtn.style.pointerEvents = 'auto';
                timerStopBtn.style.pointerEvents = 'auto';

                clearInterval(timer);
                time = 0;
                init();
              });
            }
          },
          { once: true }
        );
      });

      if (clickedStatus) {
        timerStartBtn.style.color = '#7aa5ff';
        timerPauseBtn.style.color = 'black';
        clickedStatus = false;
      }

      if (time === 0) {
        init();
      }

      timer = setInterval(() => {
        time++;

        min = Math.floor(time / 60);
        hour = Math.floor(min / 60);
        sec = time % 60;
        min = min % 60;

        let th = hour;
        let tm = min;
        let ts = sec;

        if (th < 10) {
          th = '0' + hour;
        }
        if (tm < 10) {
          tm = '0' + min;
        }
        if (ts < 10) {
          ts = '0' + sec;
        }

        totalTime.innerHTML = `${th}:${tm}:${ts}`;
      }, 50);
    });

    timerPauseBtn.addEventListener('click', () => {
      if (time !== 0) {
        timerStartBtn.style.color = 'black';
        timerPauseBtn.style.color = '#7aa5ff';
        clearInterval(timer);
        clickedStatus = true;
      }
    });

    timerStopBtn.addEventListener('click', () => {
      if (time !== 0) {
        timerStartBtn.style.color = 'black';
        timerPauseBtn.style.color = 'black';
        eachSessionTimes.forEach(
          (eachSessionTime) => (eachSessionTime.innerHTML = '')
        );
        sessionRecordWrappers.forEach((sessionRecordWrapper) => {
          sessionRecordWrapper.classList.add('wrap_disabled');
        });

        sessionFinBtns.forEach((sessionFinBtn, idx) => {
          sessionFinBtn.classList.add('btn_disabled');
        });

        clearInterval(timer);
        clickedStatus = true;
        time = 0;
        init();
      }
    });
  };
}
