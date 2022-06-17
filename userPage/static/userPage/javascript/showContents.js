const profileFollower = document.querySelector('.profile_follower');
const profileFollowing = document.querySelector('.profile_following');
const profileFeed = document.querySelector('.profile_feed');
const profileSessionRecord = document.querySelector('.profile_session_record');

profileFollower.addEventListener('click', () => showContents('followers'));
profileFollowing.addEventListener('click', () => showContents('followings'));
profileFeed.addEventListener('click', () => showContents('feeds'));
profileSessionRecord.addEventListener('click', () => showContents('records'));

const showContents = (showStatus) => {
  const profileRight = document.querySelector('.profile_right');
  const profileLeft = document.querySelector('.profile_left');
  const userId = profileFollower.getAttribute('user-id');
  const userNickname = profileFollower.getAttribute('user-nickname');
  const loggedUserId = profileFollower.getAttribute('logged-user-id');

  profileRight.innerHTML = '';

  if (showStatus === 'followers' || showStatus === 'followings') {
    showStatus === 'followers'
      ? (profileLeft.textContent = `${userNickname}의 팔로워`)
      : (profileLeft.textContent = `${userNickname}의 팔로잉`);

    fetch(`follow/${userId}/${showStatus}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((followInfo) => {
          const profileContent = document.createElement('div');
          const item = document.createElement('div');
          profileContent.classList.add('profile_content');
          item.classList.add('follow_box');

          if (followInfo.profilePic === '') followInfo.profilePic = 'none';

          item.innerHTML = `
          <img src="${followInfo.profilePic}" class="follow_img"/>
          <a href="${followInfo.pk}" class="follower_nickname">
            ${followInfo.nickname}
          </a>
        `;

          profileRight.appendChild(profileContent);
          profileContent.appendChild(item);

          if (userId === loggedUserId) {
            const delBtn = document.createElement('button');
            delBtn.classList.add('delete_follower_btn');
            delBtn.textContent = '삭제';
            delBtn.setAttribute('data-pk', `${followInfo.pk}`);

            if (showStatus === 'followers') {
              profileContent.appendChild(delBtn);

              delBtn.addEventListener('click', () => {
                const user = delBtn.getAttribute('data-pk');
                const action = delBtn.textContent.trim();

                const form = new FormData();
                form.append('user', user);
                form.append('action', action);

                fetch('deleteFollower', {
                  method: 'POST',
                  body: form,
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.status === 201) {
                      const followerCnt =
                        document.querySelector('.follower_cnt');
                      followerCnt.textContent = res.followerCnt;
                      delBtn.textContent = res.action;
                    } else {
                      console.log(res.error);
                    }
                  });
              });
            }
          }
        });
      });
  } else if (showStatus === 'feeds') {
    const profileContent = document.createElement('div');
    const item = document.createElement('div');
    profileLeft.innerHTML = `${userNickname}의 피드`;

    fetch(`feeds/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((feedsInfo) => {
          item.innerHTML = `
            <div>No. ${feedsInfo.pk}</div>
            <div>작성 시간: ${feedsInfo.createdTime}</div>
            <div>작성자: ${feedsInfo.author}</div>
            <div>제목: ${feedsInfo.title}</div>
            <div>내용: ${feedsInfo.content}</div>
          `;

          profileRight.appendChild(profileContent);
          profileContent.appendChild(item);
        });
      });
  } else {
    profileLeft.innerHTML = `${userNickname}의 운동기록`;

    fetch(`records/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((recordsInfo) => {
          const profileContent = document.createElement('div');
          const item = document.createElement('div');
          const sessions = recordsInfo.sessions.split(',');
          const bodyParts = recordsInfo.bodyParts.split(',');
          const eachTimes = recordsInfo.eachTimes.split(',');
          const counts = recordsInfo.counts.split(',');
          const sets = recordsInfo.sets.split(',');

          item.innerHTML = `
            <div>${recordsInfo.date}</div>
            <div>닉네임: ${recordsInfo.user}</div>
            <div>총 수행 시간: ${recordsInfo.totalTime}</div>
            `;
          console.log(data);
          profileRight.appendChild(profileContent);
          profileContent.appendChild(item);

          for (let i = 0; i < sessions.length; i++) {
            const recordsDiv = document.createElement('div');
            recordsDiv.innerHTML = `
              <div>운동 이름: ${sessions[i]}</div>
              <div>운동 부위: ${bodyParts[i]}</div>
              <div>수행 시간: ${eachTimes[i]}</div>
              <div>수행 횟수: ${counts[i]}</div>
              <div>세트 수: ${sets[i]}</div>
            `;
            profileContent.appendChild(recordsDiv);
          }
        });
      });
  }
};
