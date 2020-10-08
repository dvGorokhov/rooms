const URL_rooms_name_db = 'http://localhost:3000/room'

$().ready(
    getRooms_db()
);

function getRooms_db() {
    fetch(URL_rooms_name_db).then(response => {
        return response.json()
    }).then(data => {
        data.forEach((elem, index) => {
            let allRooms = $('<button class="card-text btn-block">')
            allRooms.attr('index', index)
            $('#user_room').append(allRooms)
            allRooms.text(data[index].roomName)
            console.log(data);
        });
    })
}
