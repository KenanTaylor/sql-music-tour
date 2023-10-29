const stages = require('express').Router()
const db = require('../models')
const { Stage, Event } = db
const { Op } = require('sequelize')

//get all stages
stages.get('/', async (req, res) => {
    try {
        const foundStages = await Stage.findAll({
            where: {
                stage_name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%`}
            }
        })
        res.status(200).json(foundStages)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get a stage by ID
stages.get('/:name', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { stage_id: req.params.name },
            include:{
                model: Event,
                as: 'events',
                through: { attributes: [] }
            }
        })
        res.status(200).json(foundStage)
    } catch (err) {
        res.status.json(err)
    }
})

//update a stage
stages.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Succesfully updated ${updatedStages} stage(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

//Delete a stage
stages.delete('/:id', async (req, res) => {
    try {
        const deletedStages = await Stage.destroy({
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedStages} stage(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = stages