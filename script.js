const form = document.getElementById('main_form')
const response = document.getElementById('response')
const add_header = document.getElementById('add_header')
const headers_container = document.getElementById('headers_container')
const body_container = document.getElementById('body_container')
const response_header = document.getElementById('response_header')

const res_url = document.getElementById('res_url')
const res_type = document.getElementById('res_type')
const res_status = document.getElementById('res_status')

let headers = [];
let body = '';
let content_type = '';

form.addEventListener('submit', async (e) => {
    response_header.style.display = "none"
    e.preventDefault();

    const url = (e.target.url.value)
    const method = (e.target.verb.value)
    const final_hearder = {}

    headers.forEach((item) => {
        final_hearder[item.key] = item.value
    })

    try {
        if (method != 'get') {
            final_hearder['Content-Type'] = content_type
            const payload = {method: method, headers: final_hearder, body: (body)}
            const data = await fetch(url, payload)
            const res = await data.json()
            makeResponse(JSON.stringify(res), data)
            console.log(data)
            response_header.style.display = "flex"
        } else {
            const payload = {method: method, headers: final_hearder}
            const data = await fetch(url, payload)
            const res = await data.json()
            makeResponse(JSON.stringify(res), data)
            console.log(data)
            response_header.style.display = "flex"
        }


    } catch (e) {
        const res = "Failed to fetch"
        makeResponse(res, null)
        console.log(e)
    }
})

headers_form.addEventListener('submit', (e) => {
    e.preventDefault()
    headers.push({id: Math.random(), key: e.target.key.value, value: e.target.value.value})

    headers_container.innerHTML = ''

    headers.forEach((item) => {
        const node = document.createElement('div')
        node.id = item.id
        node.classList.add('each_header')

        const node_content = document.createElement('p')
        node_content.innerText = `${item.key} : ${item.value}`

        const node_delete = document.createElement('button')
        node_delete.classList.add('deleter')
        node_delete.innerText = 'Remove'

        node_delete.addEventListener('click', (i) => {
            i.target.parentNode.remove();

            headers = headers.filter((it) => {
                return it.id != item.id
            })
        })

        node.appendChild(node_content)
        node.appendChild(node_delete)

        headers_container.appendChild(node)
    })
})

body_form.addEventListener('submit', (e) => {
    e.preventDefault()
    body = e.target.body.value
    content_type = e.target.content_type.value

    body_container.innerHTML = ''

    const node_delete = document.createElement('button')
    node_delete.classList.add('deleter')
    node_delete.innerText = 'Remove body'

    node_delete.addEventListener('click', (i) => {
        body_container.innerHTML = ''
        body = ''

    })

    const node = document.createElement('p')
    node.innerText = body
    body_container.appendChild(node)
    body_container.appendChild(node_delete)
})

function makeResponse(res, data) {
    response.innerText = res
    if (data != null) {
        res_type.innerText = data.type
        res_url.innerText = data.url
        res_status.innerText = data.status
    }
}
