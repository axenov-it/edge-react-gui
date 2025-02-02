// @flow

import type { EdgeCurrencyWallet } from 'edge-core-js'
import { connect } from 'react-redux'

import {
  createAccountTransaction,
  createCurrencyWallet,
  fetchAccountActivationInfo,
  fetchWalletAccountActivationPaymentInfo
} from '../../actions/CreateWalletActions.js'
import {
  type AccountPaymentParams,
  type CreateWalletAccountSelectDispatchProps,
  type CreateWalletAccountSelectOwnProps,
  CreateWalletAccountSelect
} from '../../components/scenes/CreateWalletAccountSelectScene'
import { getDefaultDenomination } from '../../modules/UI/selectors.js'
import { type Dispatch, type RootState } from '../../types/reduxTypes.js'

const mapStateToProps = (state: RootState, ownProps: CreateWalletAccountSelectOwnProps) => {
  const { currencyWallets } = state.core.account
  const wallets = state.ui.wallets.byId
  const handleActivationInfo = state.ui.scenes.createWallet.handleActivationInfo
  const walletAccountActivationPaymentInfo = state.ui.scenes.createWallet.walletAccountActivationPaymentInfo
  const { supportedCurrencies, activationCost } = handleActivationInfo
  const { currencyCode, amount } = walletAccountActivationPaymentInfo
  const isCreatingWallet = state.ui.scenes.createWallet.isCreatingWallet
  const existingCoreWallet = ownProps.existingWalletId ? currencyWallets[ownProps.existingWalletId] : null
  const paymentDenomination = currencyCode ? getDefaultDenomination(state, currencyCode) : {}

  let paymentDenominationSymbol
  if (paymentDenomination) {
    paymentDenominationSymbol = paymentDenomination.symbol ? paymentDenomination.symbol : ''
  } else {
    paymentDenominationSymbol = ''
  }
  const walletAccountActivationQuoteError = state.ui.scenes.createWallet.walletAccountActivationQuoteError
  return {
    paymentCurrencyCode: currencyCode,
    amount,
    supportedCurrencies,
    activationCost,
    wallets,
    isCreatingWallet,
    paymentDenominationSymbol,
    existingCoreWallet,
    walletAccountActivationQuoteError,
    currencyConfigs: state.core.account.currencyConfig
  }
}

const mapDispatchToProps = (dispatch: Dispatch): CreateWalletAccountSelectDispatchProps => ({
  createAccountTransaction: (createdWalletId: string, accountName: string, paymentWalletId: string) =>
    dispatch(createAccountTransaction(createdWalletId, accountName, paymentWalletId)),
  fetchAccountActivationInfo: (currencyCode: string) => dispatch(fetchAccountActivationInfo(currencyCode)),
  fetchWalletAccountActivationPaymentInfo: (paymentInfo: AccountPaymentParams, createdCoreWallet: EdgeCurrencyWallet) =>
    dispatch(fetchWalletAccountActivationPaymentInfo(paymentInfo, createdCoreWallet)),
  createAccountBasedWallet: (walletName: string, walletType: string, fiatCurrencyCode: string, popScene: boolean, selectWallet: boolean) =>
    dispatch(createCurrencyWallet(walletName, walletType, fiatCurrencyCode, popScene, selectWallet)),
  setWalletAccountActivationQuoteError: message => dispatch({ type: 'WALLET_ACCOUNT_ACTIVATION_ESTIMATE_ERROR', data: message })
})

export const CreateWalletAccountSelectConnector = connect(mapStateToProps, mapDispatchToProps)(CreateWalletAccountSelect)
