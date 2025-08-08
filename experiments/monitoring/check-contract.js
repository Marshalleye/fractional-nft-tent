// check-contract.js
import { TonClient, Address } from '@ton/ton';
import dotenv from 'dotenv';
dotenv.config();
async function checkContract() {
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TON_TEST_API_KEY
    });
    
    const contractAddress = Address.parse('EQDMxrK03DYJk33bdi24-nHmylA4tZovi3yfbSC7Xhd2gY0H');
    
    try {
        console.log('🔍 Checking contract status...');
        console.log('Address:', contractAddress.toString());
        
        // Check if contract exists
        const contractState = await client.getContractState(contractAddress);
        
        if (contractState.state === 'active') {
            console.log('✅ Contract is ACTIVE!');
            console.log('Balance:', contractState.balance, 'nanoTON');
            console.log('Last transaction:', contractState.lastTransaction);
            
            // Try to call a getter method
            try {
                const result = await client.runMethod(contractAddress, 'counter');
                console.log('📊 Current counter value:', result.stack.readNumber());
            } catch (e) {
                console.log('📊 Counter method call failed:', e.message);
            }
            
        } else {
            console.log('❌ Contract not found or inactive');
            console.log('State:', contractState.state);
        }
        
    } catch (error) {
        console.log('❌ Error checking contract:', error.message);
    }
}

checkContract().catch(console.error);