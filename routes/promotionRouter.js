const express = require('express');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = (200).json(promotions);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser,(req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Promotion.deleteMany()
    .then(promotions => res.status(200).json(promotions))
    .catch(err => next(err));
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions');
})
.put(authenticate.verifyUser, (req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            if ((partner.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                if (req.body.rating) {
                    partner.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.text) {
                    partner.comments.id(req.params.commentId).text = req.body.text;
                }
                partner.save()
                .then(partner => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(partner);
                })
                .catch(err => next(err));
            }

        } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser,(req, res) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err));
});
    
module.exports = promotionRouter;