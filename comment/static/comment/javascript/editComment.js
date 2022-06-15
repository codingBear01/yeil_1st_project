const commentEditBtns = document.querySelectorAll('.edit_comment_btn');
const commentDividers = document.querySelectorAll('.comment_divider');
const commentDeleteBtns = document.querySelectorAll('.delete_comment_btn');
const commentContainer = document.querySelector('.comment_container');
const editCommentBox = document.querySelector('.edit_comment_box');

commentEditBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    commentDividers[idx].style.display = 'none';
    commentDeleteBtns[idx].style.display = 'none';

    const commentContent = document.querySelector(
      `.comment_content${btn.dataset.commentid}`
    );

    editCommentBox.innerHTML = `
      <form class="comment_edit_form">
      <div>
      <textarea class="comment_edit_textarea">${commentContent.textContent}</textarea>
      </div>
      <input type="submit" value="저장" />
      <button type="button" class="edit_cancle_btn">취소</button>
      </form>
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
            editCommentBox.innerHTML = '';
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

    const editCancleBtns = document.querySelector('.edit_cancle_btn');

    editCancleBtns.addEventListener('click', () => {
      editCommentBox.innerHTML = '';
      btn.style.display = 'block';
      commentDividers[idx].style.display = 'block';
      commentDeleteBtns[idx].style.display = 'block';
    });
  });
});
