const feedLike = document.querySelector('.feed_like');
const commentLikes = document.querySelectorAll('.comment_like');

feedLike.addEventListener('click', () => handleLike('feed'));
commentLikes.forEach((commentLike, idx) => {
  commentLike.addEventListener('click', () => handleLike('comment', idx));
});

const handleLike = (likeTarget, i) => {
  if (likeTarget === 'feed') {
    const feedId = feedLike.getAttribute('feed-id');
    const feedIsLiked = feedLike.getAttribute('feed-is-liked');
    const feedLikeCnt = document.querySelector(`#feed_like_count_${feedId}`);
    const feedHeart = document.querySelector(`#feed_heart_${feedId}`);

    const form = new FormData();
    form.append('feedId', feedId);
    form.append('feedIsLiked', feedIsLiked);

    fetch('/feed/feedLike', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201) {
          if (res.feedIsLiked === 'yes') {
            feedLike.setAttribute('feed-is-liked', 'yes');
            feedHeart.textContent = '💖';
          } else {
            feedLike.setAttribute('feed-is-liked', 'no');
            feedHeart.innerText = '🤍';
          }
          feedLikeCnt.textContent = res.feedLikeCnt;
        }
      });
  } else if (likeTarget === 'comment') {
    const commentId = commentLikes[i].getAttribute('comment-id');
    const commentIsLiked = commentLikes[i].getAttribute('comment-is-liked');
    const commentLikeCnt = document.querySelector(
      `#comment_like_count_${commentId}`
    );
    const commentHeart = document.querySelector(`#comment_heart_${commentId}`);

    const form = new FormData();
    form.append('commentId', commentId);
    form.append('commentIsLiked', commentIsLiked);

    fetch('/comment/commentLike', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 201) {
          if (res.commentIsLiked === 'yes') {
            commentLikes[i].setAttribute('comment-is-liked', 'yes');
            commentHeart.textContent = '💖';
          } else {
            commentLikes[i].setAttribute('comment-is-liked', 'no');
            commentHeart.innerText = '🤍';
          }
          commentLikeCnt.textContent = res.commentLikeCnt;
        }
      });
  }
};
