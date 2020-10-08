const URL_rooms_name_db = 'http://localhost:3000/room'

$().ready(() => {
    let pick_date = $('.datepicker-here')
    getRooms_db()
    pick_date.datepicker({
        minDate: new Date()
    })
    pick_date.on('click', function () {
        $('#see_date').text(pick_date.val())
        console.log(pick_date.val());
        show_time()
    })
});

function getRooms_db() {
    fetch(URL_rooms_name_db).then(response => {
        return response.json()
    }).then(data => {
        data.forEach((elem, index) => {
            let allRooms = $('<button class="card-text btn-block">')
            allRooms.attr('index', index)
            $('#user_room').append(allRooms)
            allRooms.text(data[index].roomName)
        });
    })
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
        item_time.text(pref + h + ':' + pref_m + m)
        let item_booking = $('<button>')
        item_booking.addClass('ml-5 mb-1')
        item_booking.text('booking')
        $('#see_date').append(item_time)
        $(item_time).append(item_booking)
        console.log(d.toLocaleDateString());
    }
}