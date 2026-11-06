const commentForm = document.querySelector('#comment-form');
const authorInput = document.querySelector('#author-name');
const textInput = document.querySelector('#comment-text');
const commentsContainer = document.querySelector('#comments-container');
const commentsCountElement = document.querySelector('#comments-count');
const themeToggleBtn = document.querySelector('#theme-toggle');
const windowWidthElement = document.querySelector('#window-width');

let commentsArray = [];


function updateWindowWidth() {
    windowWidthElement.textContent = window.innerWidth;
}


window.addEventListener('resize', updateWindowWidth);
updateWindowWidth();


themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

function renderComments() {
    commentsCountElement.textContent = commentsArray.length;

    if (commentsArray.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">Поки немає жодного відгуку. Будьте першим!</p>';
        return;
    }

    commentsContainer.innerHTML = ''; 

  
    commentsArray.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment-card');

        const authorEl = document.createElement('div');
        authorEl.classList.add('comment-author');
        authorEl.textContent = comment.author;

        const dateEl = document.createElement('span');
        dateEl.classList.add('comment-date');
        dateEl.textContent = ` (${comment.date})`;
        authorEl.appendChild(dateEl);

        const textEl = document.createElement('p');
        textEl.textContent = comment.text;

        commentDiv.appendChild(authorEl);
        commentDiv.appendChild(textEl);

        commentsContainer.appendChild(commentDiv);
    });
}


commentForm.addEventListener('submit', (event) => {
   
    event.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (author && text) {
        const newComment = {
            author: author,
            text: text,
            date: new Date().toLocaleTimeString()
        };

        commentsArray.unshift(newComment); 
        renderComments();

        
        commentForm.reset();
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        commentForm.reset();
    
        console.log('Форму очищено за допомогою клавіші Escape');
    }
});