const Boom = require('boom')

var ACCOUNT = {
  accountNumber: 123,
  total: 1000,
  updatingCounter: 1, // to avoid race condition
  transactions: []
}
class AccountStorage {

  async findByAccountNumber (accountNumber) {
    if (accountNumber === 123) {
      return ACCOUNT
    } else {
      Boom.badRequest('Account not found')
    }
  }

  async findAndUpdate (updatedAccount, trx) {
    let account =  await this.findByAccountNumber(updatedAccount.accountNumber)

    // update database
    if (account.updatingCounter === updatedAccount.updatingCounter) {

      ACCOUNT.total = updatedAccount.total
      ACCOUNT.updatingCounter++
      ACCOUNT.transactions.push(trx)

      return ACCOUNT
    } else {
      // The account was modified by another service
      throw new Error('Transaction cannot be processed at this time, please retry')
    }
  }

  async getTransactions (accountNumber) {
    let account =  await this.findByAccountNumber(accountNumber)
    return account.transactions
  }

  async getBalance (accountNumber) {
    let account =  await this.findByAccountNumber(accountNumber)
    return account.total
  }
}

module.exports = new AccountStorage()
