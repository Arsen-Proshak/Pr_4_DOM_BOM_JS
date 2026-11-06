const commentForm = document.querySelector('#comment-form');
const authorInput = document.querySelector('#author-name');
const textInput = document.querySelector('#comment-text');
const commentsContainer = document.querySelector('#comments-container');
const commentsCountElement = document.querySelector('#comments-count');
const viewsCountElement = document.querySelector('#views-count');
const themeToggleBtn = document.querySelector('#theme-toggle');
const windowWidthElement = document.querySelector('#window-width');
const searchInput = document.querySelector('#search-input');




const savedTheme = localStorage.getItem('appTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('appTheme', isDark ? 'dark' : 'light');
});


let pageViews = Number(localStorage.getItem('pageViews')) || 0;
pageViews++;
localStorage.setItem('pageViews', pageViews);
viewsCountElement.textContent = pageViews;


let commentsArray = JSON.parse(localStorage.getItem('userComments')) || [];

function saveCommentsToStorage() {
    localStorage.setItem('userComments', JSON.stringify(commentsArray));
}


function updateWindowWidth() {
    windowWidthElement.textContent = window.innerWidth;
}
window.addEventListener('resize', updateWindowWidth);
updateWindowWidth();

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
        commentDiv.dataset.id = comment.id; // Унікальний ID картки

        const contentDiv = document.createElement('div');
        
        const authorEl = document.createElement('div');
        authorEl.classList.add('comment-author');
        authorEl.textContent = comment.author;

        const dateEl = document.createElement('span');
        dateEl.classList.add('comment-date');
        dateEl.textContent = ` (${comment.date})`;
        authorEl.appendChild(dateEl);

        const textEl = document.createElement('p');
        textEl.textContent = comment.text;

        contentDiv.appendChild(authorEl);
        contentDiv.appendChild(textEl);

        // Кнопка видалення для делегування
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.textContent = 'Видалити ✕';

        commentDiv.appendChild(contentDiv);
        commentDiv.appendChild(deleteBtn);

        commentsContainer.appendChild(commentDiv);
    });
}


commentsContainer.addEventListener('click', (event) => {
    // Відстежуємо клік саме по кнопці видалення через event.target
    if (event.target.classList.contains('btn-delete')) {
        const cardNode = event.target.closest('.comment-card');
        const commentId = Number(cardNode.dataset.id);

   
        cardNode.classList.add('fade-out');

        cardNode.addEventListener('transitionend', () => {
            // Видаляємо з масиву та оновлюємо localStorage
            commentsArray = commentsArray.filter(c => c.id !== commentId);
            saveCommentsToStorage();

            // Видаляємо безпосередньо з DOM-дерева
            cardNode.remove();
            
            commentsCountElement.textContent = commentsArray.length;
            if (commentsArray.length === 0) {
                renderComments();
            }
        }, { once: true }); // Впевнюємось, що обробник виконається 1 раз
    }
});


searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase().trim();
    const cards = commentsContainer.querySelectorAll('.comment-card');

    cards.forEach(card => {
        const textContent = card.textContent.toLowerCase();
        // Приховуємо елементи, вміст яких не збігається із запитом
        if (textContent.includes(query)) {
            card.classList.remove('is-hidden');
        } else {
            card.classList.add('is-hidden');
        }
    });
});


commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (author && text) {
        const newComment = {
            id: Date.now(), // Унікальний ID
            author: author,
            text: text,
            date: new Date().toLocaleTimeString()
        };

        commentsArray.unshift(newComment);
        saveCommentsToStorage(); // Збереження в localStorage
        renderComments();

        commentForm.reset();
        searchInput.value = ''; // Скидаємо фільтр
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        commentForm.reset();
    }
});


renderComments();