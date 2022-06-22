document.addEventListener('DOMContentLoaded', () => {
  const deleteBtns = document.querySelectorAll('.delete_comment_btn');

  deleteBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const commentBox = document.querySelector('.comment_box');
      const deleteStatus = confirm('이 댓글을 삭제하시겠습니까?');
      const commentId = btn.getAttribute('comment-id');
      const commentContainers = document.querySelector(
        `.comment_container${commentId}`
      );

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
            commentBox.removeChild(commentContainers);
          }
          return;
        });
    });
  });
});
