const myFeeds = document.querySelector('.my_feeds');
const followingFeeds = document.querySelector('.following_feeds');

myFeeds.addEventListener('click', () => showFeeds('mine'));
followingFeeds.addEventListener('click', () => showFeeds('followings'));

const showFeeds = (showStatus) => {
  const profileRight = document.querySelector('.profile_right');
  const userId = myFeeds.getAttribute('data-user-id');

  profileRight.innerHTML = '';

  fetch(`feeds/${userId}/${showStatus}`)
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
