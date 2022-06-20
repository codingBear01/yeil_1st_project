document.addEventListener('DOMContentLoaded', () => {
  const joinGroupBtn = document.querySelector('.join_group_btn');

  joinGroupBtn.addEventListener('click', () => {
    const groupId = joinGroupBtn.getAttribute('group-id');
    const action = joinGroupBtn.textContent.trim();

    const form = new FormData();
    form.append('groupId', groupId);
    form.append('action', action);

    fetch('/group/joinGroup', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201) {
          const joinedUserCnt = document.querySelector('.joined_user_cnt');

          joinGroupBtn.textContent = res.action;
          joinedUserCnt.textContent = res.joinGroupCnt;
        }
      });
  });
});
