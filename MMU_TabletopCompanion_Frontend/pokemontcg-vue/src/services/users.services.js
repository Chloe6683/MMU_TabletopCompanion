const login = (username, password) => {
return fetch("http://localhost:3333/login", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        'username':username,
        'password':password
    })
}) 
.then((response) => {
if(response.status === 200){
return response.json();
}else if(response.status === 400){
throw 400
} else {
throw 500
}
})
.then((resJson) => {
localStorage.setItem("session_token", resJson.session_token)
return resJson
})
.catch((error) => {
console.log("Err", error)
return Promise.reject(error)
})
}

export const userService = {
    login
}