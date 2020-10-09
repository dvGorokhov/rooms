const URL_rooms_name_db = 'http://localhost:3000/room'
const URL_booking_room = 'http://localhost:3000/booking'
let booking = []
let rooms = []
let roomID = null

$().ready(() => {
    hideCalendar()
    let pick_date = $('.datepicker-here')
    getRooms_db()
    pick_date.datepicker({
        minDate: new Date()
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
        console.log(data);
        rooms = data
        rooms.forEach((elem, index) => {
            let allRooms = $('<button class="card-text btn-block btn_room">')
            allRooms.attr('roomID', elem.id)
            $('#user_room').append(allRooms)
            allRooms.text(rooms[index].roomName)
            console.log(elem.roomName);
        });
        $('.btn_room').on('click', function () {
            show_calendar(this.getAttribute('roomID'), this.textContent)
        })
    })
}

function hideCalendar() {
    $('.datepicker-here').addClass('d-none')
}

function show_time() {
    let cur_date = $('.datepicker-here').val()
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
        let item_time = $('<div>')
        item_time.addClass('mt-3')
        item_time.text(pref + h + ':' + pref_m + m)
        let item_booking = $('<button>')
        item_booking.addClass('booking btn btn-primary btn-sm ml-5 mb-1')
        item_booking.text('booking')
        $('#see_date').append(item_time)
        $(item_time).append(item_booking)
    }
}

function show_calendar(id, text) {
    $('.room_name').text(text)
    roomID = id
    $('.datepicker-here').removeClass('d-none')
    fetch(URL_booking_room + '?roomId=' + roomID).then(response => {
        return response.json()
    }).then(data => {
        booking = data
        console.log(booking);
    })
}