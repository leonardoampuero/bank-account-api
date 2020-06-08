const { ACCOUNT_TYPES } = require('../constants/accountConstatns')
const Boom = require('boom')

var account = 0 //testing purposes

class Account {
  async addTransaction (type, amount) {
    if (type === ACCOUNT_TYPES.CREDIT) {
      account = account + amount
    } else {
      if (account - amount < 0) {
        throw Boom.badRequest('There is no money to apply the debit operation')
      }
      account = account - amount
    }

    return  {account}
  }
}

module.exports = new Account()
