const AccountService = require('../services/account')
const Joi = require('joi')

const addTransaction = {
  method: 'POST',
  path: '/transaction',
  config: {
    description: 'Apply credit or debit transaction',
    notes: 'This endpoint receibed a transaction to be applied to the user account',
    tags: ['api'],
    validate: {
      payload: {
        type: Joi.string().valid([ 'credit', 'debit' ]).required(),
        amount: Joi.number().positive().required()
      }
    }
  },

  handler: async (request, h) => {
    return AccountService.addTransaction(request.payload.type, request.payload.amount)
  }
}

module.exports = [addTransaction]
