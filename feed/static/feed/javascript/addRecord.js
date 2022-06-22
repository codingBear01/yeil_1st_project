document.addEventListener('DOMContentLoaded', () => {
  const addOnModalBtn = document.querySelector('.add_on_modal_btn');
  const feedModal = document.querySelector('.feed_modal');
  const feedModalClose = document.querySelector('.feed_modal_close');
  const feedModalList = document.querySelector('.feed_modal_list');
  const addOnFeedBtn = document.querySelector('.add_on_feed_btn');
  const selectedRecordList = document.querySelector('.selected_record_list');
  const addedRecordList = document.querySelector('.added_record_list');
  const creadteFeedBtn = document.querySelector('.creadte_feed_btn');
  const userId = addOnModalBtn.getAttribute('user-id');

  const addOnModal = () => {
    feedModal.style.display = 'block';

    window.addEventListener('click', (e) => {
      if (e.target === feedModal) {
        feedModal.style.display = 'none';
      }
    });

    feedModalList.innerHTML = '';

    fetch(`/feed/addOnModal/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((addSessionInfo) => {
          const item = document.createElement('li');
          const sessions = addSessionInfo.sessions.split(',');
          const bodyParts = addSessionInfo.bodyParts.split(',');
          const eachTimes = addSessionInfo.eachTimes.split(',');
          const counts = addSessionInfo.counts.split(',');
          const sets = addSessionInfo.sets.split(',');

          item.innerHTML = `
          <input 
            type='checkbox' 
            value='${addSessionInfo.id}'
            name='add_session_id'
          />
          <div>${addSessionInfo.date}</div>
          <div>닉네임: ${addSessionInfo.user}</div>
          <div>총 수행 시간: ${addSessionInfo.totalTime}</div>
        `;
          feedModalList.appendChild(item);

          for (let i = 0; i < sessions.length; i++) {
            const sessionsDiv = document.createElement('div');
            const bodyPartsDiv = document.createElement('div');
            const eachTimesDiv = document.createElement('div');
            const countsDiv = document.createElement('div');
            const setsDiv = document.createElement('div');

            sessionsDiv.textContent = `운동 이름: ${sessions[i]}`;
            bodyPartsDiv.textContent = `운동 부위: ${bodyParts[i]}`;
            eachTimesDiv.textContent = `수행 시간: ${eachTimes[i]}`;
            countsDiv.textContent = `수행 횟수: ${counts[i]}`;
            setsDiv.textContent = `세트 수: ${sets[i]}`;

            item.appendChild(sessionsDiv);
            item.appendChild(bodyPartsDiv);
            item.appendChild(eachTimesDiv);
            item.appendChild(countsDiv);
            item.appendChild(setsDiv);
          }
        });
      });
  };
  addOnModalBtn.addEventListener('click', addOnModal);
  addOnFeedBtn.addEventListener('click', () => {
    addedRecordList.innerHTML = '';
    const addSessionIds = document.getElementsByName('add_session_id');
    const addedTitle = document.createElement('div');
    addedTitle.textContent = '선택된 운동 목록';
    addedRecordList.appendChild(addedTitle);

    feedModal.style.display = 'none';

    addSessionIds.forEach((addSessionId) => {
      if (addSessionId.checked === true) {
        fetch(`/feed/addOnFeed/${addSessionId.value}`)
          .then((res) => res.json())
          .then((data) => {
            data.forEach((addedSessionInfo) => {
              const sessions = addedSessionInfo.sessions.split(',');
              const item = document.createElement('li');
              item.innerHTML = `
              <input name="added_session_id" class="added_session_info_id" 
              value="${addedSessionInfo.id}" 
              style="visibility: hidden; height: 0; border:none"/>
              <div class="added_session_box">
                <div>${addedSessionInfo.date}</div>
                <div>${sessions[0]} 외 ${sessions.length - 1}건</div>
                <button class="delete_added_session_btn" type="button">
                  <i class="fa-solid fa-circle-minus"></i>
                </button>
              </div>
            `;
              addedRecordList.appendChild(item);

              const deleteAddedSessionBtns = document.querySelectorAll(
                '.delete_added_session_btn'
              );
              const btnsIdx = deleteAddedSessionBtns.length - 1;

              deleteAddedSessionBtns[btnsIdx].addEventListener('click', () => {
                addedRecordList.removeChild(item);
              });
            });
          });
      }
    });
  });

  feedModalClose.addEventListener('click', () => {
    feedModal.style.display = 'none';
  });
});
