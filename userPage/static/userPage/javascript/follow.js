const followBtn = document.querySelector('.follow_btn');

followBtn.addEventListener('click', (e) => {
  const user = followBtn.getAttribute('data-user');
  const action = followBtn.textContent.trim();

  const form = new FormData();
  form.append('user', user);
  form.append('action', action);

  fetch('follow', {
    method: 'POST',
    body: form,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 201) {
        const followerCnt = document.querySelector('.follower_cnt');
        followBtn.textContent = res.action;
        followerCnt.textContent = res.followerCnt;
      } else {
        console.log(res.error);
      }
    });
});
