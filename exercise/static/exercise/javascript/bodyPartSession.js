const bodyPartBtns = document.querySelectorAll('.body_part_btn');

bodyPartBtns.forEach((bodyPartBtn) => {
  bodyPartBtn.addEventListener('click', () => {
    const bodyPart = bodyPartBtn.getAttribute('data-body-part');
    const sessionResultList = document.querySelector('.session_result_list');

    sessionResultList.innerHTML = '';

    const form = new FormData();
    form.append('bodyPart', bodyPart);

    fetch('/exercise/bodyPartSession', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        res.forEach((el, idx) => {
          const item = document.createElement('li');

          item.innerHTML = `
            <div class="session_name">운동 이름: ${el.name}</div>
            <div class="session_body_part">운동 부위: ${el.bodyPart}</div>
            <div class="session_cnt">횟수: ${el.count}</div>
            <div class="session_set">세트 수: ${el.set}</div>
            <button class="store_session_btn">➕</button>
          `;

          sessionResultList.appendChild(item);

          const storeSessionBtns =
            document.querySelectorAll('.store_session_btn');

          const sessionName = el.name;

          storeSessionBtns[idx].addEventListener('click', () => {
            storeSession(sessionName);
          });
        });
      });
  });
});

const storeSession = (_sessionName) => {
  const form = new FormData();
  form.append('sessionName', _sessionName);

  fetch('/exercise/storeSession', {
    method: 'POST',
    body: form,
  })
    .then((res) => res.json())
    .then((res) => {
      const sessionStoreList = document.querySelector('.session_store_list');
      const item = document.createElement('li');
      item.classList.add('session_store_item');

      item.innerHTML = `
        <div>운동 이름: 
          <span class="store_session_name">${res[0].name}</span>
        </div>
        <div>운동 부위: 
          <span class="store_session_body_part">${res[0].bodyPart}</span>
        </div>
        <label>횟수</label>
        <input class="store_session_cnt" type="number" value="${res[0].count}"/>
        <label>세트 수</label>
        <input class="store_session_set" type="number" value="${res[0].set}"/>
        <button class="delete_session_btn">➖</button>
      `;

      sessionStoreList.appendChild(item);

      const storeSessionNames = document.querySelectorAll(
        '.store_session_name'
      );
      const storeSessionBodyParts = document.querySelectorAll(
        '.store_session_body_part'
      );
      const storeSessionCnts = document.querySelectorAll('.store_session_cnt');
      const storeSessionSets = document.querySelectorAll('.store_session_set');

      sessionStartBtn.disabled = true;
      const storedSessions = {
        name: [],
        bodyPart: [],
        count: [],
        set: [],
      };

      storeSessionNames.forEach((storeSessionName) => {
        storedSessions.name.push(storeSessionName.textContent);
      });
      storeSessionBodyParts.forEach((storeSessionBodyPart) => {
        storedSessions.bodyPart.push(storeSessionBodyPart.textContent);
      });
      storeSessionCnts.forEach((storeSessionCnt) => {
        storedSessions.count.push(storeSessionCnt.value);
      });
      storeSessionSets.forEach((storeSessionSet) => {
        storedSessions.set.push(storeSessionSet.value);
      });

      storeSessionCnts.forEach((storeSessionCnt) => {
        storeSessionCnt.addEventListener('keyup', () => {
          sessionStartBtn.disabled = true;
        });
      });
      storeSessionSets.forEach((storeSessionSet) => {
        storeSessionSet.addEventListener('keyup', () => {
          sessionStartBtn.disabled = true;
        });
      });

      modalSession = storedSessions;

      const deleteSessionBtns = document.querySelectorAll(
        '.delete_session_btn'
      );
      const itemsIdx = deleteSessionBtns.length - 1;

      deleteSessionBtns[itemsIdx].addEventListener('click', () => {
        sessionStoreList.removeChild(item);

        sessionStartBtn.disabled = true;
        const storedSessions = {
          name: [],
          bodyPart: [],
          count: [],
          set: [],
        };

        const storeSessionNames = document.querySelectorAll(
          '.store_session_name'
        );
        const storeSessionBodyParts = document.querySelectorAll(
          '.store_session_body_part'
        );
        const storeSessionCnts =
          document.querySelectorAll('.store_session_cnt');
        const storeSessionSets =
          document.querySelectorAll('.store_session_set');

        storeSessionNames.forEach((storeSessionName) => {
          storedSessions.name.push(storeSessionName.textContent);
        });
        storeSessionBodyParts.forEach((storeSessionBodyPart) => {
          storedSessions.bodyPart.push(storeSessionBodyPart.textContent);
        });
        storeSessionCnts.forEach((storeSessionCnt) => {
          storedSessions.count.push(storeSessionCnt.value);
        });
        storeSessionSets.forEach((storeSessionSet) => {
          storedSessions.set.push(storeSessionSet.value);
        });

        modalSession = storedSessions;
      });

      const sessionStoreBtn = document.querySelector('.session_store_btn');
      sessionStoreBtn.style.display = 'block';

      sessionStoreBtn.addEventListener('click', () => {
        sessionStartBtn.style.display = 'block';
        sessionStartBtn.disabled = false;

        const storedSessions = {
          name: [],
          bodyPart: [],
          count: [],
          set: [],
        };

        const storeSessionNames = document.querySelectorAll(
          '.store_session_name'
        );
        const storeSessionBodyParts = document.querySelectorAll(
          '.store_session_body_part'
        );
        const storeSessionCnts =
          document.querySelectorAll('.store_session_cnt');
        const storeSessionSets =
          document.querySelectorAll('.store_session_set');

        storeSessionNames.forEach((storeSessionName) => {
          storedSessions.name.push(storeSessionName.textContent);
        });
        storeSessionBodyParts.forEach((storeSessionBodyPart) => {
          storedSessions.bodyPart.push(storeSessionBodyPart.textContent);
        });
        storeSessionCnts.forEach((storeSessionCnt) => {
          storedSessions.count.push(storeSessionCnt.value);
        });
        storeSessionSets.forEach((storeSessionSet) => {
          storedSessions.set.push(storeSessionSet.value);
        });

        modalSession = storedSessions;
      });
    });
};

let modalSession = {};
const sessionStartBtn = document.querySelector('.session_start_btn');

const startSession = () => {
  const sessionModal = document.querySelector('.session_modal');
  const sessionModalClose = document.querySelector('.session_modal_close');

  sessionModal.style.display = 'block';

  sessionModalClose.addEventListener('click', () => {
    sessionModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === sessionModal) {
      sessionModal.style.display = 'none';
    }
  });

  const sessionObj = modalSession;

  const form = new FormData();
  form.append('sessionName', sessionObj.name);
  form.append('sessionBodyPart', sessionObj.bodyPart);
  form.append('sessionCnt', sessionObj.count);
  form.append('sessionSet', sessionObj.set);

  fetch('/exercise/startSession', {
    method: 'POST',
    body: form,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 201) {
        const data = { ...res };
        localStorage.setItem('data', JSON.stringify(data));

        const sessionNames = res.sessionName.split(',');
        const sessionBodyParts = res.sessionBodyPart.split(',');
        const sessionCnts = res.sessionCnt.split(',');
        const sessionSets = res.sessionSet.split(',');

        const sessionModalList = document.querySelector('.session_modal_list');
        sessionModalList.innerHTML = '';

        for (let i = 0; i < sessionNames.length; i++) {
          const item = document.createElement('li');
          item.classList.add('session_modal_list_item');

          item.innerHTML = `
        <div>운동 이름: ${sessionNames[i]}</div>
        <div>운동 부위: ${sessionBodyParts[i]}</div>
        <div>횟수: ${sessionCnts[i]}</div>
        <div>세트 수: ${sessionSets[i]}</div>
        `;

          sessionModalList.appendChild(item);
        }
      } else {
        console.log(res.error);
      }
    });
};

sessionStartBtn.addEventListener('click', startSession);
