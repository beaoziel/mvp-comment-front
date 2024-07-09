/*--Funções método POST--*/

/* Postar no serv */
const postItem = (input_user, input_title, input_text, input_emoji) => {
    const formData = new FormData();
    formData.append('user', input_user);
    formData.append('title', input_title.toLowerCase())
    formData.append('text', input_text)
    formData.append('emoji', input_emoji)

    var status_div = document.getElementById("message-status")

    let url = 'http://localhost:8000/comment/new';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => {
            const data = response.json()
                switch (response.status) {
                    case 409:  
                    status_div.innerHTML = "Título já utilizado";
                    break;
                    case 200:
                    console.log(data);
                    window.location.reload()
                    break;
                }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
            alert(error.status)
        });
}

/* Validações e chamar metodo de Postar no serv */
function addComment() {
    let i_user = document.getElementById("id-username").value
    let i_title = document.getElementById("id-title").value
    let i_emoji = encodeURIComponent(document.getElementById("id-emoji").value)
    let i_text = document.getElementById("id-text").value

    if(i_user == "null" || i_text.length == 0 || i_emoji.length == 0 || i_title.length == 0) {
        document.getElementById("message-status").innerHTML = "Por favor, preencha todos os campos"
    } else {
        getUserID(i_user, i_title, i_text, i_emoji)
    } 
}

/*--Funções método GET--*/
const getAllComments = async () => {

    document.getElementById("container-results").innerHTML = ""
    let url = 'http://localhost:8000/comment/all';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.comments.map(c => {
                // Colocar na div
                document.getElementById("container-results").innerHTML +=
                    `<div class="result">
                <div id="container-user${c.id}" class="user-result"></div>
                <div class="content-result">
                <div class="title-result">
                    <h1>${capitalizeFirstLetter(c.title)}</h1> <h2> ${decodeURI(c.emoji)} </h2>
                </div>
                    <div class="text-result">
                        <p>
                          ${c.text}
                        </p>
                    </div>
                </div>
                <div class= "remove-result">  <img id='${c.title}' src="img/trash.png" onclick='deleteItem(this.id)'/> <img id='${c.id}' src="img/edit.png" onclick='getComment(this.id)'/>  </div>
            </div>`

            //Pegar o nome do usuario
                let url_id = `http://localhost:3000/user/getName?id=${c.user}`;
                fetch(url_id, {
                    method: 'get',
                })
                    .then((response) => response.json())
                    .then((data) => {
                        document.getElementById(`container-user${c.id}`).innerHTML += `<div> ${data.name} </div>`
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("container-results").innerHTML = `<div style= "width: 100%; text-align: center; height: 100%;"> Ops.. nenhum comentário encontrado :( </div>`
        });
}

const getComment = (input_id) => {
    openModalBox('emoji-box', 'edit-box', false)
    let url = `http://localhost:8000/comment/get?id=${input_id}`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("emoji-input-edit").innerHTML = decodeURI(data.emoji)
            document.getElementById("id-text-edit").value = data.text
            document.getElementById("id-title-edit").value = data.title
            document.getElementById("id-username-edit").value = data.user

            let url = `http://localhost:3000/user/getName?id=${data.user}`;
            fetch(url, {
                method: 'get',
            })
                .then((response) => response.json())
                .then((data) => {
                   for (i = 0; i <= 100; i++) {
                    var compare = document.getElementById("id-username-edit").getElementsByTagName('option')[i].value
                    if (compare == String(data.name)) {
                        document.getElementById("id-username-edit").getElementsByTagName('option')[i].selected = data.name
                        break;
                    }
                }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*--Funções métedo DELETE--*/
const deleteComment = (comment) => {
    let url = 'http://localhost:8000/comment/delete?title=' + comment;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

function deleteItem(title) {
    if (confirm("Deseja excluir comentário?") == true) {
        deleteComment(title)
        window.location.reload()
    }
}

/*--Funções metodo PUT--*/
const updateInfo = (input_user, input_title, input_text, input_emoji) => {

    const formData = new FormData();
    formData.append('user', input_user);
    formData.append('title', input_title)
    formData.append('text', input_text)
    formData.append('emoji', input_emoji)
    let url = 'http://localhost:8000/comment/update?title=' + input_title;
   
    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => {
            const data = response.json()
            switch (response.status) {
                case 200:
                console.log(data);
                window.location.reload();
                break;
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        });
}

function editComment() {
    let i_emoji = encodeURIComponent(document.getElementById("id-emoji-edit").value)
    let i_text = document.getElementById("id-text-edit").value
    let i_title = document.getElementById("id-title-edit").value
    let i_username = document.getElementById("id-username-edit").value

    if(i_username == "null" || i_text.length == 0 || i_emoji.length == 0) {
        document.getElementById("edit-errors").innerHTML = "Por favor, preencha todos os campos"
    } else {
        let url = `http://localhost:3000/user/getID?name=${i_username}`;
        fetch(url, {
            method: 'get',
        })
            .then((response) => response.json())
            .then((data) => {
                updateInfo(data.id,i_title,i_text,i_emoji)
                document.getElementById("emoji-box").value = "null"
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        
    }


}

/*Chamar todos os comentários */
getAllComments()
