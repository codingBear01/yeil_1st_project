const commentEditBtn = document.querySelectorAll('.comment_edit_btn');

commentEditBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const commentDivider = document.querySelector('.comment_divider');
    const commentDeleteBtn = document.querySelector('.comment_delete_btn');

    // btn.style.display = 'none';
    // commentDivider.style.display = 'none';
    // commentDeleteBtn.style.display = 'none';

    let commentContent = document.querySelector(
      `.comment_content${btn.dataset.commentid}`
    );

    commentContent.innerHTML = `
      <form class="comment_edit_form">
        <div>
            <textarea class="comment_edit_textarea">${commentContent.innerHTML}</textarea>
        </div>
        <input type="submit" value="저장" />
      </form>
    `;

    const commentEditForm = document.querySelector('.comment_edit_form');

    commentEditForm.onsubmit = () => {
      const commentContentTextarea = document.querySelector(
        '.comment_edit_textarea'
      ).value;
      const commentId = btn.dataset.commentid;

      fetch('editComment', {
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
            commentContent.innerHTML = commentContentTextarea;
            btn.style.display = 'block';
            commentDivider.style.display = 'block';
            commentDeleteBtn.style.display = 'block';
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return false;
    };
  });
});
