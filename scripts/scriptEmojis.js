/* Variáveis Globais*/
count_emoji_row = 0

/*Funções para os modais*/
function openModal() {
    if (!(document.getElementById("modal").style.display == 'block')) {
        document.getElementById("modal").style.display = 'block'
    } else {
        document.getElementById("modal").style.display = 'none'
    }
}

function openModalBox(box_close, box_open, edit) {
    if(!edit) {
        openModal("modal")
        document.getElementById(box_close).style.display = 'none'
        document.getElementById(box_open).style.display = 'flex'
    } else {
        document.getElementById(box_close).style.display = 'flex'
        document.getElementById(box_open).style.display= "flex"
        document.getElementById(box_open).value = "edit"
    }
   
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/*Função para resgatar/atribuir ID do emoji*/
function getEmojiData(id) {
    if(document.getElementById("emoji-box").value == "edit") {
        document.getElementById("id-emoji-edit").value = id
        document.getElementById("emoji-input-edit").innerHTML = id
        document.getElementById("emoji-box").style.display = 'none' 
    } else {
        document.getElementById("id-emoji").value = id
        document.getElementById("emoji-input").innerHTML = id
        openModalBox('edit-box', 'box-emoji')
    }
    
}

function getEmojiList(category, row_value, edit_mode) {
    let url = `https://emoji-api.com/categories/${category}?access_key=1ef7f6aef4c2e4248e03b37f0d5d2182915ea0be`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.map(emoji => {
                if (edit_mode) {
                    document.getElementById(`row${row_value}`).innerHTML += `<button id='${emoji.character}' title='${emoji.slug}' onclick='getEmojiData(this.id)' > 
                    ${emoji.character} </button>`
                } else {
                    document.getElementById(`row${row_value}`).innerHTML += `<button id='${emoji.character}' title='${emoji.slug}' onclick='getEmojiData(this.id)' > 
                    ${emoji.character} </button>`
                }
               
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*Pegar todas as categorias de Emoji*/
const getCategories = async () => {
    let url = 'https://emoji-api.com/categories?access_key=1ef7f6aef4c2e4248e03b37f0d5d2182915ea0be';
    await fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.map(category => {
                if (!(category.slug == 'component')) {
                    document.getElementById("emoji-box").innerHTML += `<span> ${category.slug} </span>
                    <div id="row${count_emoji_row}" class="row-display"></div>`;
                    getEmojiList(category.slug, count_emoji_row);
                    count_emoji_row++;
                }
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*Chamar a função de pegar emojis apenas quando necessária*/
function getAllEmojis(edit_input) {
    getCategories()
    openModalBox('edit-box', 'emoji-box', edit_input)
}


