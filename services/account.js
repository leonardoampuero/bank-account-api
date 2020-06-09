const { ACCOUNT_TYPES } = require('../constants/accountConstatns')
const storage = require('./storage')
const Boom = require('boom')
const moment = require('moment')

// It has no sense with Nodejs that is single threading. Anyway I have just added this flag to make sure the operation is locked.
let lockedStorage = false

class Account {
  async isLocked () {
    let now = moment()
    if (lockedStorage) {
      while (lockedStorage) {
        if (moment().diff(now, 'seconds') > 3) {
          throw Boom.gatewayTimeout('Timeout')
        }
      }
    }
  }

  async addTransaction (type, amount) {
    try {
      if (type === ACCOUNT_TYPES.DEBIT) {
        if ((storage.getTotalAmount() - amount) < 0) {
          throw Boom.badRequest('There is no money to apply the debit operation')
        }
      }

      await this.isLocked()
      lockedStorage = true
      let trx = storage.addTransaction(type, amount)
      storage.setTotalAmount(type, amount)

      return trx
    } catch (e) {
      throw e
    } finally {
      lockedStorage = false
    }
  }

  async getTransaction (id) {
    try {
      await this.isLocked()

      let trx = storage.getTransaction(id)
      if (!trx) {
        Boom.notFound()
      } else {
        return trx
      }
    } catch (e) {
      throw e
    }
  }

  async getTransactions (id) {
    try {
      await this.isLocked()

      let trxs = storage.getTransactionsHistory()
      return trxs
    } catch (e) {
      throw e
    }
  }

  async getBalance () {
    try {
      let now = moment()
      if (lockedStorage) {
        while (lockedStorage) {
          if (moment().diff(now, 'seconds') > 3) {
            throw Boom.gatewayTimeout('Timeout')
          }
        }
      }

      let trx = storage.getTotalAmount()
      return trx
    } catch (e) {
      throw e
    }
  }
}

module.exports = new Account()
