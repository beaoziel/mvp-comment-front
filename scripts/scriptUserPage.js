/*Funções método GET */
const getAllUsersData = async () => {
    let url = 'http://localhost:3000/user/all';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.users.map(user => {
                document.getElementById("container-result-users").innerHTML +=
                    `<div class="result">
                    <div id="container-user-${user.name}" class="user-icon">${showRandomEmoji(user.name)}</div>
                    <div class="content-result">
                    <div class="title-result">
                        <h1>${capitalizeFirstLetter(user.name)}</h1> 
                    </div>
                    <span> ${user.mail} </span>
                    </div>
                    <div class= "remove-result">  
                        <img id='${user.name}' src="img/trash.png" onclick='confirmDeleteUser(this.id)'/> 
                        <img id='${user.id}' src="img/edit.png" onclick='editUser(this.id)'/>  </div>
                    </div>`
            })
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("container-result-users").innerHTML = `<div style= "width: 100%; text-align: center; height: 100%;"> Ops.. nenhum usuário cadastrado :( </div>`
        });
}

const getUserIDtoEdit = async (id) => {
    let url = `http://localhost:3000/user/getName?id=${id}`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("id-email-user").value = data.mail
            document.getElementById("id-username-user").value = data.name
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*Função método POST */
const postUser= (input_user, input_mail) => {
    const formData = new FormData();
    formData.append('name', input_user.toLowerCase());
    formData.append('mail', input_mail.toLowerCase())

    let status_div = document.getElementById("message-status-user")

    let url = 'http://localhost:3000/user/new';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => {
            const data = response.json()
                switch (response.status) {
                    case 409:  
                    status_div.innerHTML = "Nome já utilizado";
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

/*Função método PUT*/
const updateUser = (input_user, input_mail) => {
    const formData = new FormData();
    formData.append('name', input_user.toLowerCase());
    formData.append('mail', input_mail.toLowerCase())
    let url = 'http://localhost:3000/user/update?mail=' + input_mail;
    let status_div = document.getElementById("message-status-user")
   
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
                case 400:
                status_div.innerHTML = "Email não cadastrado";
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*Função método DELETE */
const deleteUser = (user) => {
    let url = 'http://localhost:3000/user/delete?name=' + user;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    
    let url_comment = 'http://localhost:8000/comment/user?user=' + user;
    fetch(url_comment, {
         method: 'get'
    })
        .then((response) => response.json())

        .catch((error) => {
            console.error('Error:', error);
        });
    
}

/*Funções */
function verifyValues() {
    i_mail = document.getElementById("id-email-user").value
    i_user = document.getElementById("id-username-user").value

    if(i_user.length == 0 || i_mail.length == 0) {
        document.getElementById("message-status-user").innerHTML = "Por favor, preencha todos os campos"
        return false
    } else {
        return true
    }

}

function editUser(id) {
    document.getElementById("btn-edit-user").style.display= "block"
    document.getElementById("btn-add-user").style.display= "none"
    document.getElementById("id-icon-edit").style.display = "block"
    getUserIDtoEdit(id)
}

function handleUser(method) {
    i_mail = document.getElementById("id-email-user").value
    i_user = document.getElementById("id-username-user").value
    switch(true){
        case (method == 'put'):
            if(verifyValues()) {
                updateUser(i_user, i_mail)
            }
        case (method == 'post'):
            if(verifyValues()) {
                postUser(i_user, i_mail)
            }
    }
 
}

function confirmDeleteUser(name) {
    if (confirm("Deseja excluir o usuário e todos os seus comentários?") == true) {
        deleteUser(name)
        // window.location.reload()
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function showRandomEmoji(name) {
    let url = 'https://emoji-api.com/emojis?access_key=1ef7f6aef4c2e4248e03b37f0d5d2182915ea0be';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            random = Math.floor(Math.random() * 1000)
            document.getElementById(`container-user-${name}`).innerHTML = data[random].character
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*Chamando todos os usuários */
getAllUsersData()
