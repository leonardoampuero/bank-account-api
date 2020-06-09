const AccountService = require('../services/account')
const Joi = require('joi')

const addTransaction = {
  method: 'POST',
  path: '/transactions',
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

const getTransaction = {
  method: 'Get',
  path: '/transactions/{id}',
  config: {
    description: 'Get transaction by id',
    notes: 'Returns the transaction object',
    tags: ['api'],
    validate: {
      params: {
        id: Joi.number().required()
      }
    }
  },

  handler: async (request, h) => {
    return AccountService.getTransaction(request.params.id)
  }
}

const getTransactions = {
  method: 'Get',
  path: '/transactions',
  config: {
    description: 'Get all transactions',
    notes: 'Returns list of transactions',
    tags: ['api']
  },

  handler: async (request, h) => {
    return AccountService.getTransactions()
  }
}

const getBalance = {
  method: 'Get',
  path: '/transactions/balance',
  config: {
    description: 'Get Account Total',
    notes: 'Returns the current bank account amount',
    tags: ['api']
  },

  handler: async (request, h) => {
    return AccountService.getBalance()
  }
}

module.exports = [addTransaction, getTransaction, getBalance, getTransactions]
