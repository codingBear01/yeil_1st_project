const groupLike = document.querySelector('.group_like');

const handleLike = () => {
  console.log('clicked');
  const groupId = groupLike.getAttribute('group-id');
  const groupIsLiked = groupLike.getAttribute('group-is-liked');
  const groupLikeCnt = document.querySelector(`#group_like_count_${groupId}`);
  const groupHeart = document.querySelector(`#group_heart_${groupId}`);

  const form = new FormData();
  form.append('groupId', groupId);
  form.append('groupIsLiked', groupIsLiked);

  fetch('/group/groupLike', {
    method: 'POST',
    body: form,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 201) {
        if (res.groupIsLiked === 'yes') {
          groupLike.setAttribute('group-is-liked', 'yes');
          groupHeart.textContent = '💖';
        } else {
          groupLike.setAttribute('group-is-liked', 'no');
          groupHeart.innerText = '🤍';
        }
        groupLikeCnt.textContent = res.groupLikeCnt;
      }
    });
};
groupLike.addEventListener('click', handleLike);
