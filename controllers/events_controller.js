const events = require('express').Router()
const db = require('../models')
const { Event } = db
const { Op } = require('sequelize')

//Get all events
events.get('/', async(req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [ [ 'date', 'ASC' ] ],
            where: {
                event_name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%`}
            }
        })
        res.status(200).json(foundEvents)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get an event by ID
events.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { name: req.params.name },
            include: [
                { 
                    model: MeetGreet, 
                    as: "meet_greets", 
                    attributes: { exclude: [ "event_id", "band_id" ] },
                    include: {
                         model: Band, 
                         as: "band", 
                    } 
                },
                { 
                    model: SetTime, 
                    as: "set_times",
                    attributes: { exclude: [ "event_id", "stage_id", "band_id" ] },
                    include: [
                        { model: Band, as: "band" },
                        { model: Stage, as: "stage" }
                    ]
                },
                { 
                    model: Stage, 
                    as: "stages",
                    through: { attributes: [] }
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Create an event
events.post('/', async (req,res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully created a new event',
            data: newEvent
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

//Update an event
events.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.update(req.body, {
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvent} event`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

//Delete an event
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvents} event(s)`
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = events