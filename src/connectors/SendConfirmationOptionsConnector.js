// @flow

import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import { updateMaxSpend } from '../actions/SendConfirmationActions'
import { activated } from '../actions/UniqueIdentifierModalActions.js'
import SendConfirmationOptions from '../components/common/SendConfirmationOptions'
import { CHANGE_MINING_FEE_SEND_CONFIRMATION } from '../constants/indexConstants'
import { type Dispatch, type RootState } from '../types/reduxTypes.js'

const mapStateToProps = (state: RootState) => {
  const { currencyWallets } = state.core.account
  const sourceWalletId = state.ui.wallets.selectedWalletId
  const currencyCode = state.ui.wallets.selectedCurrencyCode
  const isEditable = state.ui.scenes.sendConfirmation.isEditable

  return {
    sourceWallet: currencyWallets[sourceWalletId],
    currencyCode,
    isEditable
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeMiningFee: wallet => Actions[CHANGE_MINING_FEE_SEND_CONFIRMATION]({ wallet }),
  sendMaxSpend: () => dispatch(updateMaxSpend()),
  uniqueIdentifierModalActivated: () => dispatch(activated())
})

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmationOptions)
