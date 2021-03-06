const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

function paginate(selectedPage, totalPages) {

    let pages = []
    let oldPage

    for( let currentPage = 1; currentPage <= totalPages; currentPage++ ){

        const twoFirstsAndTwoLastPages = currentPage == 1 || currentPage == 2 || 
                                         currentPage == totalPages - 1 || currentPage == totalPages
        const pageAfterSelectedPage = currentPage <= (selectedPage + 1)
        const pageBeforeSelectedPage = currentPage >= (selectedPage - 1)

        if (twoFirstsAndTwoLastPages || pageBeforeSelectedPage && pageAfterSelectedPage) {
            
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {

    const page = +pagination.dataset.page // o mais transforma em número, pois tá vindo como string
    const totalPages = +pagination.dataset.total
    const filter = pagination.dataset.filter  

    const pages = paginate(page, totalPages)

    let elements = ""

    for(let page of pages){

        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`

        } else {    
            
            if ( filter ) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`

            } else {            
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if(pagination) {    
    createPagination(pagination)
}
