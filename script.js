const form = document.getElementById('main_form')
const response = document.getElementById('response')
const add_header = document.getElementById('add_header')
const headers_container = document.getElementById('headers_container')
const body_container = document.getElementById('body_container')
const response_header = document.getElementById('response_header')
const body_form = document.getElementById('body_form')
const body_form_multipart = document.getElementById('body_form_multipart')
const multipart_type = document.getElementById('multipart_type')
const add_body_multipart = document.getElementById('add_body_multipart')
const res_url = document.getElementById('res_url')
const res_type = document.getElementById('res_type')
const res_status = document.getElementById('res_status')
const body_type = document.getElementById('body_type')

const add_param = document.getElementById('add_param')
const params_container = document.getElementById('params_container')
const params_form = document.getElementById('params_form')

let headers = [];
let params = []
let multiparts = []
let body = '';

form.addEventListener('submit', async (e) => {
    response_header.style.display = "none"
    e.preventDefault();

    let url = (e.target.url.value)
    const method = (e.target.verb.value)
    const final_hearder = {'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': '*'}
    let final_body = {}

    headers.forEach((item) => {
        final_hearder[item.key] = item.value
    })

    if (multiparts.length) {
        multiparts.forEach((item) => {
            final_body[item.name] = item.value
        })
    } else {
        final_body = body
    }
    let parass = ''
    params.forEach((p, i) => {
        if (i != params.length - 1) {
            parass += `${p.key}=${p.value}&`
        } else {
            parass += `${p.key}=${p.value}`
        }

    })

    if (parass.length) {
        if (url.includes("?")) {
            url += "&" + parass
        } else {
            url += "?" + parass
        }
    }

    try {
        if (method != 'get') {
            let send_body = ''
            if (body_type.value != "multipart/form-data") {
                final_hearder['Content-Type'] = body_type.value
                send_body = final_body
            } else {
                let fd = new FormData()
                for (let k in final_body) {
                    fd.append(k, final_body[k])
                }
                send_body = fd
            }
            const payload = {method: method, headers: final_hearder, body: send_body}
            const data = await fetch(url, payload)

            const type = data.headers.get("Content-Type")
            switch (type) {
                case 'application/json; charset=utf-8':
                    const res = await data.json()
                    makeResponse(JSON.stringify(res, null, 3), data, 'application/json')
                    break
                case 'text/plain; charset=utf-8':
                    const resi = await data.text()
                    makeResponse(resi, data)
                    break
                case 'text/html; charset=utf-8':
                    const resip = await data.text()
                    makeResponse(resip, data, 'text/html')
                    break
                default:
                    const reso = "Only JSON and Plain Text is supported as a response Content-Type. Your response neither JSON nor Plain Text."
                    makeResponse(reso, null, true)
                    break
            }

        } else {
            const payload = {method: method, headers: final_hearder}
            const data = await fetch(url, payload)
            const type = data.headers.get("Content-Type")

            switch (type) {
                case 'application/json; charset=utf-8':
                    const res = await data.json()
                    makeResponse(JSON.stringify(res, null, 5), data, 'application/json')
                    break
                case 'text/plain; charset=utf-8':
                    const resi = await data.text()
                    makeResponse(resi, data)
                    break
                case 'text/html; charset=utf-8':
                    const resip = await data.text()
                    makeResponse(resip, data, 'text/html')
                    break
                default:
                    const reso = "Only JSON, HTML, and Plain Text is supported as a response Content-Type. Your response neither JSON nor Plain Text."
                    makeResponse(reso, null, null, true)
                    break
            }
        }


    } catch (e) {
        const res = "Failed to fetch"
        makeResponse(res)
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
        const node_content_2 = document.createElement('p')
        node_content.innerText = item.key
        node_content_2.innerText = item.value

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
        node.appendChild(node_content_2)
        node.appendChild(node_delete)

        headers_container.appendChild(node)
        e.target.key.value = ''
        e.target.value.value = ''
    })
})

params_form.addEventListener('submit', (e) => {
    e.preventDefault()
    params.push({id: Math.random(), key: e.target.key.value, value: e.target.value.value})

    params_container.innerHTML = ''

    params.forEach((item) => {
        const node = document.createElement('div')
        node.id = item.id
        node.classList.add('each_param')

        const node_content = document.createElement('p')
        const node_content_2 = document.createElement('p')
        node_content.innerText = item.key
        node_content_2.innerText = item.value

        const node_delete = document.createElement('button')
        node_delete.classList.add('deleter')
        node_delete.innerText = 'Remove'

        node_delete.addEventListener('click', (i) => {
            i.target.parentNode.remove();

            params = params.filter((it) => {
                return it.id != item.id
            })
        })

        node.appendChild(node_content)
        node.appendChild(node_content_2)
        node.appendChild(node_delete)

        params_container.appendChild(node)
        e.target.key.value = ''
        e.target.value.value = ''
    })
})



function makeResponse(res, data, format, type_error) {
    if (data != null && !type_error) {
        response_header.style.display = "flex"
        res_type.innerText = data.headers.get('content-type')
        res_url.innerText = data.url
        res_status.innerText = data.status
        switch (format) {
            case 'application/json':
                response.innerHTML = ''
                let pre = document.createElement('pre')
                let code = document.createElement('code')
                code.innerText = res
                pre.append(code)
                response.appendChild(pre)
                break
            case 'text/html': response.innerHTML = res; break
            default: response.innerText = res; break

        }
    } else {
        response_header.style.display = "none"
    }
}


body_form.addEventListener('submit', (e) => {
    e.preventDefault()
    let n_body = e.target.body.value
    let good_body = n_body
    const type = body_type.value
    const body_error = document.getElementById('body_error')
    let correct_body = false

    switch (type) {
        case 'application/json':
            try {
                JSON.parse(n_body)
                correct_body = true
            } catch (e) {
            }
            break
        case 'text/plain':
            correct_body = true
            break
    }

    if (correct_body == true) {
        body_error.innerText = ""
        body_container.innerHTML = ''

        const node_delete = document.createElement('button')
        node_delete.classList.add('deleter')
        node_delete.innerText = 'Remove body'

        node_delete.addEventListener('click', (i) => {
            body_container.innerHTML = ''
            body = ''
        })

        let node = document.createElement("p")
        if (type == 'application/json') {
            node = document.createElement('pre')
            let c = document.createElement('code')
            c.innerText = JSON.stringify(good_body, null, 4)
            node.append(c)
        } else {
            node = document.createElement('p')
            node.innerText = good_body
        }
        body = good_body
        body_container.appendChild(node)
        body_container.appendChild(node_delete)

        e.target.body.value = ''
    } else {
        body_error.innerText = "Invalid body format!"
    }
})

body_type.addEventListener('change', (e) => {
    if (e.target.value == 'multipart/form-data') {
        body_error.innerText = ""
        body_container.innerHTML = ''
        body_form.style.display = 'none'
        body_form.reset()
        body_form_multipart.style.display = 'flex'
    } else {
        body_error.innerText = ""
        body_container.innerHTML = ''
        body_form.style.display = 'flex'
        body_form_multipart.style.display = 'none'
        body_form_multipart.reset()
    }
})


multipart_type.addEventListener('change', (e) => {
    document.getElementById('multipart_input').type = e.target.value
})


body_form_multipart.addEventListener('submit', (e) => {
    e.preventDefault()
    multiparts.push({id: Math.random(), name: e.target.name.value, value: e.target.value.type == 'file' ? e.target.value.files[0] : e.target.value.value})

    body_container.innerHTML = ''

    multiparts.forEach((item) => {
        const node = document.createElement('div')
        node.id = item.id
        node.classList.add('each_header')

        const node_content = document.createElement('p')
        const node_content_2 = document.createElement('p')
        node_content.innerText = item.name
        node_content_2.innerText = item.value.name ? item.value.name : item.value

        const node_delete = document.createElement('button')
        node_delete.classList.add('deleter')
        node_delete.innerText = 'Remove'

        node_delete.addEventListener('click', (i) => {
            i.target.parentNode.remove();

            multiparts = multiparts.filter((it) => {
                return it.id != item.id
            })
        })

        node.appendChild(node_content)
        node.appendChild(node_content_2)
        node.appendChild(node_delete)

        body_container.appendChild(node)
        e.target.name.value = ''
        e.target.value.value = ''
    })
})
