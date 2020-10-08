let room_name = $('#room_name')
let btn_add_room = $('#add_room')
const URL_rooms_name_db = 'http://localhost:3000/room'
let namesRooms = []

$().ready(
    getRooms_db()
);

function getRooms_db() {
    fetch(URL_rooms_name_db).then(response => {
        return response.json()
    }).then(data => {
        namesRooms = data
        createNewRoom()
        console.log(namesRooms);
    })
}

function addRoom() {
    if (!room_name.val()) {
        return
    }
    fetch(URL_rooms_name_db, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ roomName: room_name.val() })
    }).then(response => {
        return response.json()
    }).then(data => {
        namesRooms.push(data)
        createNewRoom()
        room_name.val('')
        console.log('data', data);
    });
}

function createNewRoom() {
    $('#rooms_list').empty()
    namesRooms.forEach((elem, index) => {
        let createRoomName = $('<div class="col-6">')
        createRoomName.text(elem.roomName)
        $('#rooms_list').append(createRoomName)

        let divToBtn = $('<div class="col-6">')
        $('#rooms_list').append(divToBtn)

        let showRoom = $('<button>')
        $(showRoom).append($('<i class="fa fa-eye" aria-hidden="true"></i>'))
        showRoom.addClass("mb-1 btn-sm btn btn-outline-success show_room")
        showRoom.attr('index', index)
        divToBtn.append(showRoom)

        let delRoom = $('<button>')
        $(delRoom).append($('<i class="fa fa-trash-o" aria-hidden="true"></i>'))
        delRoom.addClass("mx-1 mb-1 btn-sm btn btn-outline-danger delete_room")
        delRoom.attr('index', index)
        divToBtn.append(delRoom)

        let renameRoom = $('<button>')
        $(renameRoom).append($('<i class="fa fa-pencil" aria-hidden="true"></i>'))
        renameRoom.addClass("btn-sm mb-1 btn btn-outline-danger rename_room")
        renameRoom.attr('index', index)
        divToBtn.append(renameRoom)
    })
}