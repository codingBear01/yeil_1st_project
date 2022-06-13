const profileFeed = document.querySelector('.profile_feed');

profileFeed.addEventListener('click', () => showFeeds());

const showFeeds = (showStatus) => {
  const profileRight = document.querySelector('.profile_right');
  const profileLeft = document.querySelector('.profile_left');
  const userNickname = myFollowers.getAttribute('user-nickname');
  const userId = profileFeed.getAttribute('user-id');

  profileRight.innerHTML = '';
  profileLeft.innerHTML = `${userNickname}의 피드`;

  fetch(`feeds/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((feedsInfo) => {
        const profileContent = document.createElement('div');
        const item = document.createElement('div');

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
};
