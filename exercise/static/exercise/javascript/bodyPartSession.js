const bodyPartBtns = document.querySelectorAll('.body_part_btn');
const sessionResultBox = document.querySelector('.session_result_box');

bodyPartBtns.forEach((bodyPartBtn, idx) => {
  bodyPartBtn.addEventListener('click', () => {
    const bodyPart = bodyPartBtn.getAttribute('data-body-part');
    sessionResultBox.innerHTML = '';

    const form = new FormData();
    form.append('bodyPart', bodyPart);

    fetch('/exercise/bodyPartSession', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        res.forEach((el) => {
          const item = document.createElement('ul');

          item.innerHTML = `
        <li>
          <div>운동 이름: ${el.name}</div>
          <div>운동 부위: ${el.bodyPart}</div>
          <label>횟수</label>
          <input type="number" value="${el.count}"/>
          <label>세트 수</label>
          <input type="number" value="${el.set}"/>
        </li>
        `;

          sessionResultBox.appendChild(item);
        });
      });

    // innerHTML
  });
});
