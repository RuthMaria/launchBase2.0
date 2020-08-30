const { age, graduation, date, checkEmptyFields } = require("../../lib/utils")
const { create, all, find, update, _delete, findBy } = require('../models/Teacher')

module.exports = {

    index( req, res ) {

        const { filter } = req.query

        if (filter) {
            
            findBy(filter, _teachers => {
                const teachers = []

                for( teacher of _teachers ){
                    teachers.push(
                        {
                            ...teacher,
                            occupation_area: teacher.occupation_area.split(",")
                        })        
                }
                return res.render('teachers/index', { teachers, filter })
            })
        } else {
            
            all(_teachers => {            
                const teachers = []

                for( teacher of _teachers ){
                    teachers.push(
                        {
                            ...teacher,
                            occupation_area: teacher.occupation_area.split(",")
                        })        
                }
                return res.render('teachers/index', { teachers })
            })
        }
    },

    create( req, res ) {        
        return res.render('teachers/create')
    },

    post( req, res ) {
        
        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")

        create(req.body, () => {
            return res.redirect(`/teachers`)
        })
    },
    
    show( req, res ) {

        find(req.params.id, teacher => {
            if ( !teacher ) 
                return res.send("Teacher not found!") 
                  
            teacher.age = age(teacher.birth),
            teacher.occupation_area = teacher.occupation_area.split(","),
            teacher.created_at = date(teacher.created_at).format,
            teacher.education_level = graduation(teacher.education_level)

            return res.render("teachers/show", { teacher })
        })        
    },

    edit( req, res ) {

        find(req.params.id, teacher => {
            
            if ( !teacher ) 
                return res.send("Teacher not found!") 

            teacher.birth = date(teacher.birth).iso

            return res.render("teachers/edit", { teacher })
        })
    },

    update( req, res ) {

        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")
        
        update(req.body, teacher => {
            return res.redirect(`/teachers/find/${teacher.id}`)
        })
    },
    
    delete( req, res ) {
        
        _delete(req.body.id, () => {
            return res.redirect("/teachers")
        })
    },
}


