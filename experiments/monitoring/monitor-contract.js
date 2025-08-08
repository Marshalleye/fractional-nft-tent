// monitor-contract.js
import { TonClient, Address } from '@ton/ton';
import dotenv from 'dotenv';
dotenv.config();
async function monitorContract() {
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TON_TEST_API_KEY
    });
    
    const contractAddress = Address.parse('kQDMxrK03DYJk33bdi24-nHmylA4tZovi3yfbSC7Xhd2gTaN');
    
    console.log('🔍 Monitoring your SimpleCounter contract...');
    console.log('📍 Address:', contractAddress.toString());
    console.log('⏰ Checking every 10 seconds...\n');
    
    let lastCounter = -1;
    let lastOperationCount = -1;
    
    setInterval(async () => {
        try {
            // Get current state
            const counterResult = await client.runMethod(contractAddress, 'counter');
            const operationResult = await client.runMethod(contractAddress, 'operationCount');
            
            const currentCounter = counterResult.stack.readNumber();
            const currentOperations = operationResult.stack.readNumber();
            
            // Check for changes
            if (currentCounter !== lastCounter || currentOperations !== lastOperationCount) {
                const timestamp = new Date().toLocaleTimeString();
                console.log(`🚀 [${timestamp}] Contract State Changed!`);
                console.log(`   Counter: ${lastCounter} → ${currentCounter}`);
                console.log(`   Operations: ${lastOperationCount} → ${currentOperations}`);
                console.log('');
                
                lastCounter = currentCounter;
                lastOperationCount = currentOperations;
            } else {
                process.stdout.write('.');
            }
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }, 10000); // Check every 10 seconds
    
    console.log('💡 Send messages to your contract and watch the changes!');
    console.log('   Use: npx blueprint run (in another terminal)');
    console.log('   Press Ctrl+C to stop monitoring\n');
}

monitorContract().catch(console.error);