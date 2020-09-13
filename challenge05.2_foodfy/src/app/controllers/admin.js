const { checkEmptyFields, date } = require("../../lib/utils")
const { paginate, foundRecipe, foundChefs, searchChef, searchRecipes, searchChefAndCountRecipes } = require('../models/User')
const { create, update, chefsSelectOptions, createRecipe, searchRecipe, updateRecipe, _deleteChef, _deleteRecipe } = require('../models/admin')

module.exports = {

    index( req, res ){
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 10
        let offset = limit * (page - 1)

        const params = {
            limit,
            offset,
            filter
        }

        paginate(params, recipes => {
                
            let total

            if(recipes != null && recipes.length != 0)
                total = Math.ceil(recipes[0].totalrecipes / limit)

            const pagination = {
                totalPages: total,
                page
            }
            
            return res.render('admin/index', { recipes, pagination, filter})           
        })
    },

    createRecipe ( req, res ){

        chefsSelectOptions( chefs => {
            return res.render('admin/create', { chefs })
        })
    },

    postRecipe( req, res ){

        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")

        req.body.created_at = date().iso

        createRecipe(req.body, () => {
            return res.redirect('/admin/recipes')
        })
    },

    show ( req, res ){

        foundRecipe(req.params.id, recipe => {

            if( !recipe )
                return res.send('Recipe not found!')

            return res.render('admin/recipe_description',  { recipe })
        })
    },

    editRecipe( req, res ){

        searchRecipe(req.params.id, recipe => {
            if( !recipe ){
                return res.send('Recipe not found!')
            }

            chefsSelectOptions( chefs => {
                return res.render('admin/editRecipe',  { recipe, chefs })
            })
        })
    },    
    
    putRecipe( req, res ){    

        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")
    
        req.body.created_at = date().iso

        updateRecipe(req.body, recipe => {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    
    deleteRecipe( req, res ){   
        
        _deleteRecipe(req.body.id, () => {            
            return res.redirect("/admin/recipes")
        })               
    },

    allChefs( req, res) {

        foundChefs( chefs => {
            return res.render('admin/allChefs', { chefs })
        })
    },

    detailsChef( req, res) {

       searchChefAndCountRecipes(req.params.id, chef => {

            if( !chef ){
                searchChef(req.params.id, chef => {
                    if( !chef ){
                        return res.send('Chef not found!')
                    }

                    return res.render('admin/chef_description',  { chef })
                })
            } else {
                searchRecipes(req.params.id, recipes => {
                    return res.render('admin/chef_description',  { chef, recipes })
                })
            }           
        })
    },

    createChef( req, res ) {
        return res.render('admin/createChef')
    },

    editChef( req, res ) {

        searchChef(req.params.id, chef => {
            if( !chef ){
                return res.send('Chef not found!')
            }

            return res.render('admin/editChef',  { chef })
        })
    },

    postChef( req, res ) {

        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")

        req.body.created_at = date().iso

        create(req.body, () => {
            return res.redirect('/admin/chefs')
        })
        
    },

    putChef( req, res ) {

        if(checkEmptyFields(req.body))
            return res.send("Please, fill all fields!")
        
        req.body.created_at = date().iso

        update(req.body, chef => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },

    deleteChef( req, res ){

        searchChefAndCountRecipes(req.body.id, chef => {

            if( chef ){               
                return res.send("Chefs que possuem receitas não podem ser deletados")

            } else {
                _deleteChef(req.body.id, () => {            
                    return res.redirect("/admin/chefs")
                })               
            }
        })
        
    }
}