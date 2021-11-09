document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(function(data) {

    renderList(data)
    }) //end of second .then

    function renderList(books){
        //console.log(books)
        books.forEach(renderEachBook)
    }

    function renderEachBook(book){
        let li = document.createElement('li')
        li.innerText = book.title
        document.querySelector('#list').append(li)
        li.addEventListener('click', () => {
            clickDisplayDetails(book.img_url, book.title, book.subtitle, book.author, book.description, book.users, book.id)
        })
    }

    function clickDisplayDetails(image, title, subtitle, author, description, usersLike, bookId){
        document.querySelector('#show-panel').innerHTML = ''
        let img = document.createElement('img')
        img.src = image
        let hFour1 = document.createElement('h4')
        hFour1.innerText = title
        let hFour2 = document.createElement('h4')
        hFour2.innerText = subtitle
        let hFour3 = document.createElement('h4')
        hFour3.innerText = author
        let p = document.createElement('p')
        p.innerText = description
        let likeBtn = document.createElement('button')
        likeBtn.innerText = "LIKE"

        document.querySelector('#show-panel').append(img, hFour1, hFour2, hFour3, p)
        listOutLikers(usersLike) //appends the list of users
        document.querySelector('#show-panel').append(likeBtn)
        
        likeBtn.addEventListener('click', (e) => {
            handlePatch(usersLike, bookId) 
        })
    }

    function listOutLikers(likers) {
      let ul = document.createElement('ul')
        ul.innerHTML=''
        likers.forEach((users) => {
            
            let li = document.createElement('li')
            li.innerText = users.username
            ul.append(li)
        })
        
        document.querySelector('#show-panel').append(ul)
    }

    function handlePatch(users, bookId) {

          let idList = findNextUser(users, "id")
          
        fetch('http://localhost:3000/users')
        .then(resp => resp.json())
        .then(function(listOfUsers) {
            //console.log(listOfUsers)
            let totalIdList = findNextUser(listOfUsers, "id")
            let totalUserList = findNextUser(listOfUsers, "username")
            //console.log(users)
            //removes the current number of id from total list and find minimum id
            let filteredArray = totalIdList.filter(function(x){
                return idList.indexOf(x)<0;
            })
            let minLike = Math.min.apply(Math, filteredArray)
            //console.log(minLike)

            //console.log(totalUserList[minLike-1])

            let userObj = {id: minLike, username: totalUserList[minLike-1]}
            users.push(userObj) //add to current users the new object to pass in patch
            fetch(`http://localhost:3000/books/${bookId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                  users: users 
                }) 
              })
              .then(resp => resp.json())
              .then(function(data) {
                clickDisplayDetails(data.img_url, data.title, data.subtitle, data.author, data.description, data.users, data.id)
              })
        })
    }

    function findNextUser(obj, prop) {
        let result = [];
        function recursivelyFindProp(o, keyName) {
          Object.keys(o).forEach(function(key) {
            if(typeof o[key] === 'object') {
              recursivelyFindProp(o[key], keyName);
            } else {
              if (key === keyName) result.push(o[key]);
            }
          });
        }
        recursivelyFindProp(obj, prop);
        return result;
      }

}); //end of DOMContentLoaded
