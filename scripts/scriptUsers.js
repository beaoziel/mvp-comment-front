const getAllUsers = async () => {
    let url = 'http://localhost:3000/user/all';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.users.map(user => {
                document.getElementById("id-username").innerHTML += `<option value="${user.name}">${capitalizeFirstLetter(user.name)}</option>`
                document.getElementById("id-username-edit").innerHTML += `<option value="${user.name}">${capitalizeFirstLetter(user.name)}</option>`
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


const getUserID = async (name, input_title, input_text, input_emoji) => {
    let url = `http://localhost:3000/user/getID?name=${name}`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            postItem(data.id,input_title, input_text, input_emoji)
            getAllComments()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

getAllUsers()