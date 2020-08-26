const db = require('../../config/db')
const { date } = require("../../lib/util")

module.exports = {

    all(callback) {
        
        db.query('SELECT * FROM instructors', function (err, results) {
            if(err) throw `Database Error! ${err}` // captura o erro e para a aplicação

            callback(results.rows)
        })
    },

    create(data, callback) {
        const { name, avatar_url, gender, services, birth } = data
        const todayDate = Date.now()

        const query = `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            name,
            avatar_url,
            gender,
            services,
            date(birth).iso,
            date(todayDate).iso
        ]

        db.query(query, values, function(err, results){       
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows[0])
        })
    },

    find(id, callback) {

        db.query('SELECT * FROM instructors WHERE id = $1', [id], function (err, results) {
            if(err) throw `Database Error! ${err}`

            return callback(results.rows[0])
        })
    },

    update(data, callback) {
        const { avatar_url, name, birth, gender, services, id } = data

        const query = `
            UPDATE instructors SET 
                avatar_url = ($1),
                name = ($2),
                birth = ($3),
                gender = ($4),
                services = ($5)
            WHERE id = ($6)
            `

        const values = [
            avatar_url, 
            name, 
            date(birth).iso, 
            gender, 
            services,
            id 
        ]

        db.query(query, values,function (err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },

    delete(id, callback) {

        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function (err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
}