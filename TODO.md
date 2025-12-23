# Fix CreateInvoice Wallet Integration

## Problem Analysis
The CreateInvoice page currently uses hardcoded wallet addresses instead of the actual connected wallet from Web3Context:
1. Header shows hardcoded "0x71C...9A23" instead of actual connected account
2. Receiving Wallet field shows hardcoded "0x71C7656EC7ab88b098defB751B7401B5f6d89A23" instead of actual account
3. This prevents proper invoice creation with the real user's wallet

## Plan
1. **Update CreateInvoice.jsx to use actual wallet address**:
   - Import useWeb3Context hook
   - Replace hardcoded wallet addresses with actual account from context
   - Format the account address properly for display
   - Ensure the receiving wallet shows the connected user's address

2. **Verify wallet integration**:
   - Check that the header displays the correct connected account
   - Ensure the receiving wallet field shows the user's actual address
   - Test that invoice creation uses the real wallet

## Files to Edit
- `/Users/koded/Desktop/Code/Settle-Scroll-Hackathon/frontend/src/pages/CreateInvoice.jsx`

## Implementation Steps
1. Read current CreateInvoice.jsx to understand exact structure
2. Update the component to use useWeb3Context
3. Replace hardcoded addresses with actual account values
4. Add proper address formatting functions
5. Test the changes

## Expected Outcome
- Header shows real connected wallet address
- Receiving wallet field displays actual user's address
- Invoice creation works with the real wallet
- Better user experience with accurate wallet information
