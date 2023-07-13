
const API_URL = 'https://sistech-api.vercel.app/blog';

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}


function createEditForm(blogEntry, entry) {

    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.innerHTML = `
        <input type="text" name="title" value="${entry.title}" required>
        <textarea name="content" required>${entry.content}</textarea>
        <button type="submit">Save</button>
        <button type="button" class="cancel-btn">Cancel</button>
    `;

    const cancelBtn = editForm.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function () {
        blogEntry.querySelector('.edit-link').style.display = 'inline';
        blogEntry.removeChild(editForm);
    });

    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const updatedTitle = editForm.querySelector('input[name="title"]').value;
        const updatedContent = editForm.querySelector('textarea[name="content"]').value;

        // Update the entry on the server
        fetch(API_URL, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer e5fe227b-a6b1-4185-acd4-d6898005ee98",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: updatedTitle,
                content: updatedContent,
                id:entry.id
            })
        })
        .then(response => response.json())
        .then(updatedEntry => {
            // Update the entry in the UI
            const titleHeading = blogEntry.querySelector('h3');
            const contentParagraph = blogEntry.querySelector('p');

            titleHeading.textContent = updatedEntry.title;
            contentParagraph.textContent = updatedEntry.content;

            // Hide the edit form and show the edit link again
            blogEntry.querySelector('.edit-link').style.display = 'inline';
            blogEntry.removeChild(editForm);
        })
        .catch(error => {
            console.log("Error updating the blog entry:", error);
        });
    });

    blogEntry.appendChild(editForm);
    blogEntry.querySelector('.edit-link').style.display = 'none';
}

// Displaying the existing blogs

function fetchBlogEntries() {
    fetch(API_URL,{
        headers: {
        Authorization: "Bearer e5fe227b-a6b1-4185-acd4-d6898005ee98"
        }
    })
    .then(response => response.json())
    .then(data => {

    // Clear existing entries
    document.getElementById("blog-entries").innerHTML = "";

    // Display new entries
    data.forEach(entry => {
        const blogEntry = document.createElement("div");
        blogEntry.classList.add("blog-entry");
       
        const titleHeading = document.createElement("h3");
        titleHeading.textContent = entry.title;
        titleHeading.classList.add("title-blog");

        const contentParagraph = document.createElement("p");
        contentParagraph.textContent = entry.content;
        contentParagraph.classList.add("content-blog");
        
        const editLikeDiv = document.createElement("div");
        editLikeDiv.classList.add("edit-like-cont");
        
        const likeLink = document.createElement("a");
        likeLink.innerHTML = `
        <button class="like-button" type="like">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13ZM6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6" fill="#FBC7D4"/>
        <path d="M6 10L10 1C10.7956 1 11.5587 1.31607 12.1213 1.87868C12.6839 2.44129 13 3.20435 13 4V8H18.66C18.9499 7.99672 19.2371 8.0565 19.5016 8.17522C19.7661 8.29393 20.0016 8.46873 20.1919 8.68751C20.3821 8.90629 20.5225 9.16382 20.6033 9.44225C20.6842 9.72068 20.7035 10.0134 20.66 10.3L19.28 19.3C19.2077 19.7769 18.9654 20.2116 18.5979 20.524C18.2304 20.8364 17.7623 21.0055 17.28 21H6M6 10V21M6 10H3C2.46957 10 1.96086 10.2107 1.58579 10.5858C1.21071 10.9609 1 11.4696 1 12V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H6" stroke="#4A65A3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </button>
        `;
        
        const editLink = document.createElement("a");
        editLink.classList.add("edit-link");
        editLink.textContent = "Edit";
        editLink.addEventListener("click", function() {
            createEditForm(blogEntry, entry);
            likeLink.style.float = "right";
        });
        
        editLikeDiv.appendChild(editLink);
        editLikeDiv.appendChild(likeLink);


        // Append elements to the blog entry
        blogEntry.appendChild(titleHeading);
        blogEntry.appendChild(contentParagraph);
        blogEntry.appendChild(editLikeDiv);

        // Add the blog entry to the blog entries container
        document.getElementById("blog-entries").appendChild(blogEntry);
    });
    })
    .catch(error => {
    console.log("Error fetching blog entries:", error);
    });
}

fetchBlogEntries();

document.getElementById("new-blog-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    const title = titleInput.value;
    const content = contentInput.value;


    fetch(API_URL, {
        method: "POST",
        headers: {
        "Authorization": "Bearer e5fe227b-a6b1-4185-acd4-d6898005ee98",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        title: title,
        content: content,
        owner: "e5fe227b-a6b1-4185-acd4-d6898005ee98"
        })
    })
    .then(response => response.json())
    .then(newEntry => {
        const blogEntry = document.createElement("div");
        blogEntry.classList.add("blog-entry");

        const titleHeading = document.createElement("h3");
        titleHeading.textContent = newEntry.title;
        titleHeading.classList.add("title-blog");

        const contentParagraph = document.createElement("p");
        contentParagraph.textContent = newEntry.content;
        contentParagraph.classList.add("content-blog");

        const editLink = document.createElement("a");
        editLink.classList.add("edit-link");
        editLink.textContent = "Edit";
        editLink.addEventListener("click", function() {
            createEditForm(blogEntry, newEntry);
            likeLink.style.float = "right";
        });

        const editLikeDiv = document.createElement("div");
        editLikeDiv.classList.add("edit-like-cont");
        
        const likeLink = document.createElement("a");
        likeLink.innerHTML = `
        <button class="like-button" type="like">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13ZM6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6" fill="#FBC7D4"/>
        <path d="M6 10L10 1C10.7956 1 11.5587 1.31607 12.1213 1.87868C12.6839 2.44129 13 3.20435 13 4V8H18.66C18.9499 7.99672 19.2371 8.0565 19.5016 8.17522C19.7661 8.29393 20.0016 8.46873 20.1919 8.68751C20.3821 8.90629 20.5225 9.16382 20.6033 9.44225C20.6842 9.72068 20.7035 10.0134 20.66 10.3L19.28 19.3C19.2077 19.7769 18.9654 20.2116 18.5979 20.524C18.2304 20.8364 17.7623 21.0055 17.28 21H6M6 10V21M6 10H3C2.46957 10 1.96086 10.2107 1.58579 10.5858C1.21071 10.9609 1 11.4696 1 12V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H6" stroke="#4A65A3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </button>
        `;

        editLikeDiv.appendChild(editLink);
        editLikeDiv.appendChild(likeLink);

        // Append elements to the blog entry
        blogEntry.appendChild(titleHeading);
        blogEntry.appendChild(contentParagraph);
        blogEntry.appendChild(editLikeDiv);

        // Add the blog entry to the blog entries container
        document.getElementById("blog-entries").appendChild(blogEntry);

        // Clear the form inputs
        titleInput.value = "";
        contentInput.value = "";
    })
    .catch(error => {
        console.log("Error creating the blog entry:", error);
    });
});