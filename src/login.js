let login_name = $('input')
const users_url = 'http://localhost:3000/users'

function loginOn() {
    if (!login_name.val()) {
        return
    }
    fetch(users_url + '?name=' + login_name.val()).then(response => {
        return response.json()
    }).then(data => {
        if (data.length > 0) {
            localStorage.setItem('user', JSON.stringify(data[0]))
            if (data[0].role == "user") {
                window.location.href = 'http://localhost:8080/rooms.html'
            }
            else {
                window.location.href = 'http://localhost:8080/admin.html'
            }
        }
        else {
            fetch(users_url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: login_name.val(),
                    role: "user"
                })
            }).then(response => {
                return response.json()
            }).then(data => {
                localStorage.setItem('user', JSON.stringify(data))
                window.location.href = 'http://localhost:8080/rooms.html'
            });
        }
    })
}