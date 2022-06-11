const API_URL = 'http://localhost:8000'; // Може бути посилання на якийсь інший бекенд
const limit = 10;
const content = document.querySelector('#content');
const pagination = document.querySelector('#pagination');

const getCurrentPage = () => {
    const href = location.href;
    const url = new URL(href);
    const page = url.searchParams.get('page');

    return parseInt(page) ?? 1;
}

const renderContent = (items) => {
    const itemsElements = items.map(item => {
        const itemElement = document.createElement('div');
              itemElement.innerText = `Element ID ${item.id}`;
              itemElement.setAttribute('style', 'background: #f1f1f1; margin: 10px;');
        
        return itemElement;
    });

    content.replaceChildren(...itemsElements);
}

const renderPagination = (current, pages) => {
    const pageButtons = [...new Array(pages).keys()].map(item => {
        const button = document.createElement('button');
              button.innerText = item + 1;
        
        if (current === item + 1) {
            button.setAttribute('style', 'background: blue');
        }

        return button;
    });

    pagination.replaceChildren(...pageButtons);
}

const eventHandlers = () => {
    window.addEventListener('DOMContentLoaded', init);
    pagination.addEventListener('click', changeNavigation);

    window.onpopstate = init;
}

const requestData = (page, limit) => {
    const url = new URL(`${API_URL}/articles`);

    url.searchParams.set('_page', page);
    url.searchParams.set('_limit', limit);

    return fetch(url.toString()).then(response => response.json());
}

const init = () => {
    const currentPage = getCurrentPage();

    requestData(currentPage, limit)
        .then(data => {
            const totalPages = Math.ceil(data.total / limit);

            renderContent(data.articles);
            renderPagination(currentPage, totalPages);
        })
}

const changeNavigation = (event) => {
    if (event.target.nodeName === 'BUTTON') {
        const href = location.href;
        const url = new URL(href);
        const currentPage = parseInt(event.target.innerText);
        
        url.searchParams.set('page', currentPage);
        history.pushState({}, '', url.toString());

        requestData(currentPage, limit)
            .then(data => {
                const totalPages = Math.ceil(data.total / limit);

                renderContent(data.articles);
                renderPagination(currentPage, totalPages);
            })
    }
}


eventHandlers();