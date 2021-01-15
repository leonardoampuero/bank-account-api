const AccountService = require('../services/account')
const Joi = require('joi')

const addTransaction = {
  method: 'POST',
  path: '/{account}',
  config: {
    description: 'Apply credit or debit transaction',
    notes: 'This endpoint receive a transaction to be applied to the user account',
    tags: ['api'],
    validate: {
      payload: {
        type: Joi.string().valid([ 'credit', 'debit' ]).required(),
        amount: Joi.number().positive().required()
      },
      params: {
        account: Joi.number().required()
      }
    }
  },

  handler: async (request, h) => {
    return AccountService.addTransaction(request.payload, request.params.account)
  }
}

const getTransactions = {
  method: 'Get',
  path: '/{account}/transactions',
  config: {
    description: 'Get all transactions',
    notes: 'Returns list of transactions',
    tags: ['api'],
    validate: {
      params: {
        account: Joi.number().required()
      }
    }
  },

  handler: async (request, h) => {
    return AccountService.getTransactions(request.params)
  }
}

const getBalance = {
  method: 'Get',
  path: '/{account}/balance',
  config: {
    description: 'Get Account Total',
    notes: 'Returns the current bank account amount',
    tags: ['api'],
    validate: {
      params: {
        account: Joi.number().required()
      }
    }
  },

  handler: async (request, h) => {
    return AccountService.getBalance(request.params)
  }
}

module.exports = [addTransaction, getBalance, getTransactions]
