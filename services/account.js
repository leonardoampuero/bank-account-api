const { ACCOUNT_TYPES } = require('../constants/accountConstatns')
const Storage = require('./storage')
const Boom = require('boom')
const moment = require('moment')

class Account {
  createTrx (type, amount) {
    return {
      type,
      amount,
      timestamp: moment()
    }
  }
  async processDebitTransaction (account, amount, type) {
    if ((account.total - amount) < 0) {
      throw Boom.badRequest('There is no enough money in your account')
    }
    account.total = account.total - amount

    return Storage.findAndUpdate(account, this.createTrx(type, amount))
  }

  async processCreditTransaction (account, amount, type) {
    account.total = account.total + amount

    return Storage.findAndUpdate(account, this.createTrx(type, amount))
  }
  async addTransaction (payload, accountNumber) {
    const {type, amount} = payload

    let account = await Storage.findByAccountNumber(accountNumber)

    if (type === ACCOUNT_TYPES.DEBIT) {
      return this.processDebitTransaction(account, amount, type)
    } else {
      return this.processCreditTransaction(account, amount, type)
    }
  }

  async getTransactions (params) {
    const { account } = params
    return Storage.getTransactions(account)
  }

  async getBalance (params) {
    const { account } = params
    return Storage.getBalance(account)
  }
}

module.exports = new Account()
