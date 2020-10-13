const URL_rooms_name_db = 'http://localhost:3000/room'
const URL_booking_room = 'http://localhost:3000/booking'
let room_name = $('#room_name')
let btn_add_room = $('#add_room')
let booking = []
let rooms = []
let select_date = []
let roomID = null

$().ready(() => {
  hideCalendar()
  let pick_date = $('.datepicker-here')
  getRooms_db()
  pick_date.datepicker({
    minDate: new Date(),
    toggleSelected: false
  })
  pick_date.on('click', function () {
    $('#see_date').text('')
    show_time()
  })
});

function getRooms_db() {

  fetch(URL_rooms_name_db).then(response => {
    return response.json()
  }).then(data => {
    let user = JSON.parse(localStorage.getItem('user'))
    console.log(user);
    rooms = data
    if (user.role == 'admin') {
      admin_show_room_lists()
    }
    else {
      users_show_room_lists()
    }
  })
}

function admin_show_room_lists() {
  $('#rooms_list').empty()
  rooms.forEach((elem, index) => {
    let createRoomName = $('<div class="col-6 names">')
    createRoomName.attr('index', index)
    createRoomName.attr('id', 'div-' + index)
    createRoomName.text(elem.roomName)
    $('#rooms_list').append(createRoomName)

    let rename_input = $('<input type="text" class="col-6 d-none">')
    rename_input.val(elem.roomName)
    rename_input.attr('index', index)
    rename_input.attr('id', 'input-' + index)
    $('#rooms_list').append(rename_input)

    let divToBtn = $('<div class="col-6">')
    $('#rooms_list').append(divToBtn)

    let showRoom = $('<button>')
    $(showRoom).append($('<i class="fa fa-eye" aria-hidden="true"></i>'))
    showRoom.addClass("mb-1 btn-sm btn btn-outline-success show_room")
    showRoom.attr('index', index)
    showRoom.attr('roomID', elem.id)
    divToBtn.append(showRoom)

    let delRoom = $('<button>')
    $(delRoom).append($('<i class="fa fa-trash-o" aria-hidden="true"></i>'))
    delRoom.addClass("mx-1 mb-1 btn-sm btn btn-outline-danger delete_room")
    delRoom.attr('index', index)
    delRoom.attr('roomID', elem.id)
    divToBtn.append(delRoom)

    let renameRoom = $('<button>')
    $(renameRoom).append($('<i class="fa fa-pencil" aria-hidden="true"></i>'))
    renameRoom.addClass("btn-sm mb-1 btn btn-outline-danger rename_room")
    renameRoom.attr('index', index)
    divToBtn.append(renameRoom)
  })
  $('.show_room').on('click', function () {
    let index = this.getAttribute('index')
    show_calendar(rooms[index].id, rooms[index].roomName)
  })
  $('.delete_room').on('click', function () {
    let index = this.getAttribute('index')
    console.log(index);
    admin_del_room(index)

  })
  $('.rename_room').on('click', function () {
    let index = this.getAttribute('index')
    admin_rename_room(index, this)
  })
}
// admin
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
    rooms.push(data)
    admin_show_room_lists()
    room_name.val('')
    console.log('data', data);
  });
}

function users_show_room_lists() {
  $('#user_room').empty()
  rooms.forEach((elem, index) => {
    let allRooms = $('<button class="card-text btn-block btn_room">')
    allRooms.attr('roomID', elem.id)
    $('#user_room').append(allRooms)
    allRooms.text(rooms[index].roomName)
  });
  $('.btn_room').on('click', function () {
    show_calendar(this.getAttribute('roomID'), this.textContent)
  })
}

function hideCalendar() {
  $('.datepicker-here').addClass('d-none')
}

function show_time() {
  $('#see_date').text('')
  let cur_date = $('.datepicker-here').val()
  select_date = booking.filter(function (elem) {
    return elem.date == cur_date
  })
  let user = JSON.parse(localStorage.getItem('user'))
  let d = new Date()
  let h = 8
  let m = 0
  for (let i = 0; i < 18; i++) {
    if (i % 2) {
      m = 30
    }
    else {
      h++
      m = 0
    }
    if (d.toLocaleDateString() == cur_date) {
      if (d.getHours() >= h) {
        if (d.getHours() === h) {
          if (d.getMinutes() < m) {
            m = 30
          } else {
            continue
          }
        } else {
          continue
        }
      }
    }
    let pref = ''
    let pref_m = ''
    if (h < 10) {
      pref = '0'
    }
    if (m < 10) {
      pref_m = '0'
    }
    let text_btn = 'booking'
    let time = pref + h + ':' + pref_m + m
    let user_class = ''
    select_date.forEach(elem => {
      if (elem.time == time) {
        if (elem.userId == user.id) {
          user_class = 'yellow'
          text_btn = 'cancel'
        } else {
          user_class = 'red'
        }
      }
    })

    let item_time = $('<div>')
    item_time.addClass('mt-3 ' + user_class)
    item_time.append($('<span>' + time + '</span>'))
    $('#see_date').append(item_time)

    if (user_class != 'red') {
      let item_booking = $('<button>')
      item_booking.addClass('booking_time btn btn-primary btn-sm ml-5 mb-1')
      item_booking.text(text_btn)
      $(item_time).append(item_booking)
    }
  }
  $('.booking_time').on('click', function () {
    if (this.textContent == 'booking') {
      addDateTimeBooking(this)
    }
    else {
      delDateTimeBooking(this)
    }

  })
}

function addDateTimeBooking(e) {
  let user = JSON.parse(localStorage.getItem('user'))
  fetch(URL_booking_room, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      userId: user.id,
      roomId: roomID,
      date: $('.datepicker-here').val(),
      time: $(e).parent().children('span').text()
    })
  }).then(response => {
    return response.json()
  }).then(data => {
    booking.push(data)
    show_time()
  });

}

function delDateTimeBooking(e) {
  let id = null
  let time = $(e).parent().children('span').text()
  select_date.forEach(elem => {
    if (elem.time == time) {
      id = elem.id
    }
  })
  delete_booking(id)
  booking.forEach((elem, index) => {
    if (elem.id == id) {
      booking.splice(index, 1)
    }
  })
  show_time()
}

function show_calendar(id, text) {
  $('#see_date').text('')
  $('.room_name').text(text)
  roomID = id
  $('.datepicker-here').removeClass('d-none')
  fetch(URL_booking_room + '?roomId=' + roomID).then(response => {
    return response.json()
  }).then(data => {
    booking = data
  })
}

function admin_rename_room(index, e) {
  console.log(index);
  let input = $('#input-' + index)
  let div = $('#div-' + index)
  if (!div.hasClass('d-none')) {
    div.addClass('d-none')
    input.removeClass('d-none')
    $(e).empty()
    $(e).append($('<i class="fa fa-floppy-o" aria-hidden="true"></i>'))
  }
  else {
    let index = $(e).attr('index')
    fetch(URL_rooms_name_db + '/' + rooms[index].id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        roomName: input.val(),
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      rooms[index].roomName = input.val()
      div.text(input.val())
      input.addClass('d-none')
      div.removeClass('d-none')
      $(e).empty()
      $(e).append($('<i class="fa fa-pencil" aria-hidden="true"></i>'))
    }).catch(err => {
      console.error(err)
    })
  }
}

function admin_del_room(index) {
  fetch(URL_booking_room + '?roomId=' + rooms[index].id).then(response => {
    return response.json()
  }).then(data => {
    data.forEach(elem => {
      delete_booking(elem.id)
    })
    delete_booking(rooms[index].id, URL_rooms_name_db)
    rooms.splice(index, 1)
    getRooms_db()
  })
}


function delete_booking(id, url = URL_booking_room) {
  fetch(url + '/' + id, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
  }).then(response => {
    return response.json()
  }).then(data => {
  }).catch(err => {
    console.error(err)
  })
}