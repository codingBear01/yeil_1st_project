document.addEventListener('DOMContentLoaded', () => {
  const commentEditBtns = document.querySelectorAll('.edit_comment_btn');
  const commentDividers = document.querySelectorAll('.comment_divider');
  const commentDeleteBtns = document.querySelectorAll('.delete_comment_btn');
  const editEditForm = document.querySelector('.comment_edit_form');
  const commentContentForm = document.querySelector('.comment_content_form');

  commentEditBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      commentDividers[idx].style.display = 'none';
      commentDeleteBtns[idx].style.display = 'none';
      commentContentForm.style.display = 'none';
      editEditForm.style.display = 'block';

      const commentContent = document.querySelector(
        `.comment_content${btn.dataset.commentid}`
      );

      editEditForm.innerHTML = `
        <textarea class="comment_edit_textarea">${commentContent.textContent}</textarea>
        <div class="comment_edit_btn_box">
          <input type="submit" value="저장" />
          <button type="button" class="edit_cancle_btn">취소</button>
        </div>
      `;

      const commentEditForm = document.querySelector('.comment_edit_form');

      commentEditForm.onsubmit = () => {
        const commentContentTextarea = document.querySelector(
          '.comment_edit_textarea'
        ).value;
        const commentId = btn.dataset.commentid;

        fetch('/comment/editComment', {
          method: 'PUT',
          body: JSON.stringify({
            commentContentTextarea: commentContentTextarea,
            commentId: commentId,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.error) {
              console.log(`Error editing post: ${result.error}`);
            } else {
              console.log(result.message);
              commentEditForm.innerHTML = '';
              commentContent.innerHTML = commentContentTextarea;
              btn.style.display = 'block';
              commentDividers[idx].style.display = 'block';
              commentDeleteBtns[idx].style.display = 'block';
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return false;
      };

      const editCancleBtn = document.querySelector('.edit_cancle_btn');

      editCancleBtn.addEventListener('click', () => {
        commentEditForm.innerHTML = '';
        commentContentForm.style.display = 'block';
        commentEditForm.style.display = 'none';

        for (let i = 0; i < commentEditBtns.length; i++) {
          commentEditBtns[i].style.display = 'block';
          commentDividers[i].style.display = 'block';
          commentDeleteBtns[i].style.display = 'block';
        }
      });
    });
  });
});
