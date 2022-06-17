if (localStorage.getItem('data')) {
  const data = JSON.parse(localStorage.getItem('data'));
  const sessionNames = data.sessionName.split(',');
  const sessionBodyParts = data.sessionBodyPart.split(',');
  const sessionCnts = data.sessionCnt.split(',');
  const sessionSets = data.sessionSet.split(',');

  const sessionRecordContainer = document.querySelector(
    '.session_record_container'
  );

  for (let i = sessionNames.length - 1; i >= 0; i--) {
    const item = document.createElement('li');
    item.classList.add('session_record_wrapper');

    item.innerHTML = `
      <div class="session_record_box session_name">
        <span>${sessionNames[i]}</span>
      </div>
      <div class="session_record_box session_body_part">
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

    sessionRecordContainer.prepend(item);
  }

  document.addEventListener('DOMContentLoaded', () => {
    timerBtnEvt();
  });

  const totalTime = document.querySelector('.total_time');

  const init = () => {
    totalTime.innerHTML = '00:00:00';
  };

  const timerBtnEvt = () => {
    const timerStartBtn = document.querySelector('.timer_start_btn');
    const timerPauseBtn = document.querySelector('.timer_reset_btn');
    const timerRefreshBtn = document.querySelector('.timer_refresh_btn');
    const sessionResultBtn = document.querySelector('.session_result_btn');
    const sessionRecordWrappers = document.querySelectorAll(
      '.session_record_wrapper'
    );
    const eachSessionTimes = document.querySelectorAll('.each_session_time');
    const sessionFinBtns = document.querySelectorAll('.session_fin_btn');

    let time = 0;
    let clickedStatus = true;
    let hour = 0;
    let min = 0;
    let sec = 0;
    let timer;
    let clicked;

    sessionRecordWrappers.forEach((sessionRecordWrapper) => {
      sessionRecordWrapper.classList.add('wrap_disabled');
    });

    sessionFinBtns.forEach((sessionFinBtn) => {
      sessionFinBtn.classList.add('btn_disabled');
    });

    let saveRecords = {};
    const recordModalSaveBtn = document.querySelector('.record_modal_save_btn');

    const saveRecord = () => {
      console.log(saveRecords);
      const userId = recordModalSaveBtn.getAttribute('user-id');
      const saveDate = saveRecords.date;
      const saveTotalTime = saveRecords.totalTime;

      for (let i = 0; i < saveRecords.name.length; i++) {
        const form = new FormData();
        form.append('userId', userId);
        form.append('saveDate', saveDate);
        form.append('saveTotalTime', saveTotalTime);
        form.append('saveName', saveRecords.name[i]);
        form.append('saveBodyPart', saveRecords.bodyPart[i]);
        form.append('saveCnt', saveRecords.count[i]);
        form.append('saveSet', saveRecords.set[i]);
        form.append('saveEachTime', saveRecords.eachTime[i]);

        fetch('/record/saveRecord', {
          method: 'POST',
          body: form,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status === 201) {
              window.location.replace(res.url);
            } else {
              console.log('error');
            }
          });
      }
    };
    recordModalSaveBtn.addEventListener('click', saveRecord);

    timerStartBtn.addEventListener('click', () => {
      let curTime = 0;
      let prevTime = 0;
      let temp = 0;

      timerStartBtn.style.display = 'none';
      timerPauseBtn.style.display = 'flex';

      if (!clicked) {
        sessionFinBtns[0].classList.remove('btn_disabled');
        sessionRecordWrappers[0].classList.remove('wrap_disabled');
      }
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

            if (sessionFinBtn === sessionFinBtns[0]) {
              clicked = true;
              sessionFinBtns[0].classList.add('btn_disabled');
              sessionRecordWrappers[0].classList.add('wrap_disabled');

              temp = time;

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

              eachSessionTimes[0].innerHTML = `${th}:${tm}:${ts}`;
            } else {
              let resTime;

              if (sessionFinBtn === sessionFinBtns[1]) {
                prevTime = temp;
              }

              curTime = time;
              resTime = curTime - prevTime;
              prevTime = curTime;

              min = Math.floor(resTime / 60);
              hour = Math.floor(min / 60);
              sec = resTime % 60;
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
            }

            if (sessionFinBtn === sessionFinBtns[sessionFinBtns.length - 1]) {
              clearInterval(timer);
              clickedStatus = true;

              sessionFinBtn.classList.add('btn_disabled');
              sessionRecordWrappers[
                sessionRecordWrappers.length - 1
              ].classList.add('wrap_disabled');
              timerStartBtn.style.pointerEvents = 'none';
              timerPauseBtn.style.pointerEvents = 'none';
            }

            sessionResultBtn.addEventListener('click', () => {
              const recordModal = document.querySelector('.session_modal');
              const recordModalCloseBtn = document.querySelector(
                '.session_modal_close'
              );
              const sessionRecordNames =
                document.querySelectorAll('.session_name span');
              const sessionRecordBodyParts = document.querySelectorAll(
                '.session_body_part span'
              );
              const sessionRecordCnts =
                document.querySelectorAll('.session_cnt span');
              const sessionRecordSets =
                document.querySelectorAll('.set_cnt span');
              const today = new Date();
              const year = today.getFullYear();
              const month = today.getMonth() + 1;
              const date = today.getDate();
              const day = today.getDay();
              const dayArr = ['일', '월', '화', '수', '목', '금', '토'];
              const fullDay =
                year +
                '년 ' +
                month +
                '월 ' +
                date +
                '일 ' +
                dayArr[day] +
                '요일';

              recordModalCloseBtn.addEventListener('click', () => {
                recordModal.style.display = 'none';
              });
              recordModal.style.display = 'block';

              window.addEventListener('click', (e) => {
                if (e.target === recordModal) {
                  recordModal.style.display = 'none';
                }
              });

              let storedRecords = {
                name: [],
                bodyPart: [],
                count: [],
                set: [],
                eachTime: [],
                totalTime: '',
                date: '',
              };

              sessionRecordNames.forEach((sessionRecordName) => {
                storedRecords.name.push(sessionRecordName.textContent);
              });
              sessionRecordBodyParts.forEach((sessionRecordBodyPart) => {
                storedRecords.bodyPart.push(sessionRecordBodyPart.textContent);
              });
              sessionRecordCnts.forEach((sessionRecordCnt) => {
                storedRecords.count.push(sessionRecordCnt.textContent);
              });
              sessionRecordSets.forEach((sessionRecordSet) => {
                storedRecords.set.push(sessionRecordSet.textContent);
              });
              eachSessionTimes.forEach((eachSessionTime) => {
                storedRecords.eachTime.push(eachSessionTime.textContent);
              });
              storedRecords.totalTime = totalTime.innerHTML;
              storedRecords.date = fullDay;

              saveRecords = storedRecords;

              const form = new FormData();
              form.append('sessionRecordNames', storedRecords.name);
              form.append('sessionRecordBodyParts', storedRecords.bodyPart);
              form.append('sessionRecordCnts', storedRecords.count);
              form.append('sessionRecordSets', storedRecords.set);
              form.append('sessionRecordEachTimes', storedRecords.eachTime);
              form.append('totalTime', storedRecords.totalTime);
              form.append('date', storedRecords.date);

              fetch('/exercise/recordSession', {
                method: 'POST',
                body: form,
              })
                .then((res) => res.json())
                .then((res) => {
                  const sessionRecordNames = res.sessionRecordNames.split(',');
                  const sessionRecordBodyParts =
                    res.sessionRecordBodyParts.split(',');
                  const sessionRecordCnts = res.sessionRecordCnts.split(',');
                  const sessionRecordSets = res.sessionRecordSets.split(',');
                  const sessionRecordEachTimes =
                    res.sessionRecordEachTimes.split(',');
                  const totalTime = document.createElement('div');
                  totalTime.textContent = `총 수행시간: ${res.totalTime}`;
                  const recordDay = document.createElement('div');
                  recordDay.textContent = res.date;

                  const recordModalList =
                    document.querySelector('.record_modal_list');
                  recordModalList.innerHTML = '';

                  recordModalList.appendChild(recordDay);
                  recordModalList.appendChild(totalTime);

                  for (let i = 0; i < sessionRecordNames.length; i++) {
                    const item = document.createElement('li');
                    item.classList.add('record_modal_list_item');

                    item.innerHTML = `
                      <div>운동 이름: ${sessionRecordNames[i]}</div>
                      <div>운동 부위: ${sessionRecordBodyParts[i]}</div>
                      <div>수행 횟수: ${sessionRecordCnts[i]}</div>
                      <div>세트 수: ${sessionRecordSets[i]}</div>
                      <div>수행 시간: ${sessionRecordEachTimes[i]}</div>
                    `;

                    recordModalList.appendChild(item);
                  }
                });
            });
          },
          { once: true }
        );
      });

      if (clickedStatus) {
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
      }, 1000);
    });

    timerPauseBtn.addEventListener('click', () => {
      timerPauseBtn.style.display = 'none';
      timerStartBtn.style.display = 'flex';
      if (time !== 0) {
        clearInterval(timer);
        clickedStatus = true;
      }
    });

    timerRefreshBtn.addEventListener('click', () => {
      if (time !== 0) {
        timerStartBtn.style.display = 'flex';
        timerPauseBtn.style.display = 'none';

        clicked = false;

        timerStartBtn.style.pointerEvents = 'auto';
        timerPauseBtn.style.pointerEvents = 'auto';
        timerRefreshBtn.style.pointerEvents = 'auto';

        eachSessionTimes.forEach(
          (eachSessionTime) => (eachSessionTime.innerHTML = '')
        );
        sessionRecordWrappers.forEach((sessionRecordWrapper) => {
          sessionRecordWrapper.classList.add('wrap_disabled');
        });

        sessionFinBtns.forEach((sessionFinBtn) => {
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
