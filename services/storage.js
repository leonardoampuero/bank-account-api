const { ACCOUNT_TYPES } = require('../constants/accountConstatns')
const moment = require('moment')

class AccountStorage {
  constructor (amount, transactions) {
    this.totalAmount = amount
    this.transactions = transactions
    this.id = 0
  }

  addTransaction (type, amount) {
    let trx = {
      id: ++this.id,
      type,
      amount,
      timestamp: moment()
    }

    this.transactions.push(trx)
    return trx
  }

  getTransactionsHistory () {
    return this.transactions
  }

  getTransaction (id) {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === Number(id)) {
        return this.transactions[i]
      }
    }

    return null
  }

  getTotalAmount () {
    return this.totalAmount
  }

  setTotalAmount (type, amount) {
    if (type === ACCOUNT_TYPES.DEBIT) {
      this.totalAmount = this.totalAmount - amount
    }

    this.totalAmount = this.totalAmount + amount
  }
}

module.exports = new AccountStorage(0, [])
