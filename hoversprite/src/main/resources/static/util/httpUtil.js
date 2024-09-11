async function sendHttpRequest(
    url,
    method = 'GET',
    body = null
) {

    let response = await fetch(url, {
        method: method,
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })

    let jsonData = ""
    
    try {
        jsonData = await response.json()
    } catch {
        jsonData = "{}"
    }

    return {
        json: jsonData,
        status: response.status,
        responseHeader: response.headers
    }
}

