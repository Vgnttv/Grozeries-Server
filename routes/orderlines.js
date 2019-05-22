const { Router } = require('express')
const Orderline = require('../models').orderline
const Order = require('../models').order
const auth = require('../authorization/middleware')
const Product = require('../models').product
const { totalSum } = require('../logic')

const router = new Router()

router.post('/orders/:id', auth, (req, res, next) => {
    const quantity = req.body.quantity
    const price = req.body.price
    const productId = req.body.productId
    const orderId = req.params.id
    console.log("req at params.id should be /3:", req.params.id)
    const userId = req.body.userId
    console.log("req at body.ordersId should be 3 :", req.body.orderId)
    const shopId = req.body.shopId
    // console.log("req at orders/3:", req.body.shopId)
    const status = req.body.status
    const total_price = req.body.total_price

    // Order
        // .findByPk(req.params.id)
        // .then(order => {
            // if (!order) {
            //     return res.status(404).send({
            //         message: `order does not exist`
            //     })
            // }
            // else {
                Orderline
                    .create({ 
                        quantity, price, productId, orderId, total_price, userId, shopId, status })
                    .then(orderline => {
                        console.log("orderline BITCH", orderline)
                        const total = totalSum(orderline)
                        orderline.total_price = total


                        if (!orderline) {
                            return res.status(404).send({
                                message: `orderline does not exist`
                            })
                        }
                        orderline.save({ total_price: total })
                        return res.status(201).send(orderline)
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: 'Something went wrong',
                            error: err
                        })
                    })
            }
//         })
)

router.get('/orders/:id/orderlines', (req, res, next) => {
    Order
        .findByPk(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(404).send({
                    message: `order does not exist`
                })
            }
            order.getOrderlines()
            .then(orderlines => {
                res.send({ ...order.dataValues, orderlines })
            })
            // Orderline
            //     .findAll({ where: { orderId: order.id }, include: [Product] })
            //     .then(orderlines => {
            //         // console.log(orderlines,"orderlines???")
            //         res.send(orderlines)
            //     })
                .catch(err => {
                    res.status(500).send({
                        message: 'Something went wrong',
                        error: err
                    })
                })
        })
})
module.exports = router
