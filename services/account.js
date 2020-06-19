const { ACCOUNT_TYPES } = require('../constants/accountConstatns')
const storage = require('./storage')
const Boom = require('boom')
const { Semaphore } = require('async-mutex')
const semaphore = new Semaphore(1)

class Account {

  async addTransaction (type, amount) {
    const [value, release] = await semaphore.acquire()
    try {
      if (type === ACCOUNT_TYPES.DEBIT) {
        if ((storage.getTotalAmount() - amount) < 0) {
          throw Boom.badRequest('There is no money to apply the debit operation')
        }
      }

      let trx = storage.addTransaction(type, amount)
      storage.setTotalAmount(type, amount)

      return trx
    } catch (e) {
      throw e
    } finally {
      release()
    }
  }

  async getTransaction (id) {
    try {
      if (semaphore.isLocked()) {
        throw Boom.locked('Account locked')
      }

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

  async getTransactions () {
    try {
      if (semaphore.isLocked()) {
        throw Boom.locked('Account locked')
      }

      let trxs = storage.getTransactionsHistory()
      return trxs
    } catch (e) {
      throw e
    }
  }

  async getBalance () {
    try {
      if (semaphore.isLocked()) {
        throw Boom.locked('Account locked')
      }

      let trx = storage.getTotalAmount()
      return trx
    } catch (e) {
      throw e
    }
  }
}

module.exports = new Account()
