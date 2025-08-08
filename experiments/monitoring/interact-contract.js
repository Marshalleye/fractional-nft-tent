// interact-contract.js
import { TonClient, WalletContractV4, internal } from '@ton/ton';
import { Address, beginCell, toNano } from '@ton/core';
import { mnemonicToPrivateKey } from '@ton/crypto';
import dotenv from 'dotenv';
dotenv.config();
async function interactWithContract() {
    // Your contract address
    const contractAddress = Address.parse('EQDMxrK03DYJk33bdi24-nHmylA4tZovi3yfbSC7Xhd2gY0H');
    
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TON_TEST_API_KEY
    });
    
    console.log('🎯 Interacting with your SimpleCounter contract');
    console.log('📍 Address:', contractAddress.toString());
    console.log('');
    
    // First, let's read the current counter value
    try {
        console.log('📊 Reading current counter value...');
        const result = await client.runMethod(contractAddress, 'counter');
        const currentCounter = result.stack.readNumber();
        console.log('✅ Current counter:', currentCounter);
        console.log('');
        
        // Read other getter methods if they exist
        try {
            const operationCount = await client.runMethod(contractAddress, 'operationCount');
            console.log('✅ Operation count:', operationCount.stack.readNumber());
        } catch (e) {
            console.log('📊 Operation count method not available');
        }
        
        try {
            const owner = await client.runMethod(contractAddress, 'owner');
            const ownerAddress = owner.stack.readAddress();
            console.log('✅ Contract owner:', ownerAddress.toString());
        } catch (e) {
            console.log('📊 Owner method not available');
        }
        
        console.log('');
        console.log('🚀 Contract is fully operational!');
        console.log('');
        console.log('💡 To send messages to your contract:');
        console.log('   1. Use: npx blueprint run');
        console.log('   2. Choose interaction options');
        console.log('   3. Or build a frontend interface');
        
    } catch (error) {
        console.log('❌ Error reading contract:', error.message);
    }
}

interactWithContract().catch(console.error);