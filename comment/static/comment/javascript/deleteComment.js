const deleteBtns = document.querySelectorAll('.delete_comment_btn');

deleteBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const deleteStatus = confirm('이 댓글을 삭제하시겠습니까?');
    const commentId = btn.getAttribute('comment-id');
    const commentContainer = document.querySelector('.comment_container');
    const comment = document.querySelector(`.comment_wrapper${commentId}`);

    fetch('/comment/deleteComment', {
      method: 'DELETE',
      body: JSON.stringify({
        deleteStatus: deleteStatus,
        commentId: commentId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (deleteStatus === true) {
          commentContainer.removeChild(comment);
        }
        return;
      });
  });
});
