const myFollowers = document.querySelector('.profile_follower');
const myFollowings = document.querySelector('.profile_following');

myFollowers.addEventListener('click', () => showFollows('followers'));
myFollowings.addEventListener('click', () => showFollows('followings'));

const showFollows = (showStatus) => {
  const profileRight = document.querySelector('.profile_right');
  const userId = myFollowers.getAttribute('user-id');
  const loggedUserId = myFollowers.getAttribute('logged-user-id');

  profileRight.innerHTML = '';

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
                    const followerCnt = document.querySelector('.follower_cnt');
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
};
