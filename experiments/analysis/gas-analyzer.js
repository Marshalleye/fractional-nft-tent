// gas-analyzer.js
import { TonClient, Address } from '@ton/ton';
import dotenv from 'dotenv';
dotenv.config();
async function analyzeGasUsage() {
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TON_TEST_API_KEY
    });
    
    const contractAddress = Address.parse('kQDMxrK03DYJk33bdi24-nHmylA4tZovi3yfbSC7Xhd2gTaN');
    
    console.log('⛽ Gas Usage Analysis for SimpleCounter');
    console.log('=====================================\n');
    
    try {
        // Get transaction history
        const transactions = await client.getTransactions(contractAddress, { limit: 10 });
        
        console.log(`📊 Analyzing last ${transactions.length} transactions:\n`);
        
        let totalGasUsed = 0;
        const gasPerOperation = {};
        
        transactions.forEach((tx, index) => {
            const gasUsed = Number(tx.totalFees.coins) / 1e9;
            totalGasUsed += gasUsed;
            
            // Try to identify operation type from transaction
            let operationType = 'unknown';
            if (tx.inMessage?.body) {
                // This is simplified - in real analysis you'd decode the message
                operationType = 'message_call';
            }
            
            if (!gasPerOperation[operationType]) {
                gasPerOperation[operationType] = [];
            }
            gasPerOperation[operationType].push(gasUsed);
            
            console.log(`Transaction ${index + 1}:`);
            console.log(`  Gas Used: ${gasUsed.toFixed(6)} TON`);
            console.log(`  Type: ${operationType}`);
            console.log(`  Hash: ${tx.hash().toString('hex').slice(0, 16)}...`);
            console.log('');
        });
        
        console.log('📈 Summary:');
        console.log(`  Total Gas Used: ${totalGasUsed.toFixed(6)} TON`);
        console.log(`  Average per Transaction: ${(totalGasUsed / transactions.length).toFixed(6)} TON`);
        console.log('');
        
        console.log('💡 Gas Optimization Tips:');
        console.log('  - TON gas fees are very low compared to Ethereum');
        console.log('  - Your contract is efficient for simple operations');
        console.log('  - Consider gas costs when designing complex vault operations');
        
    } catch (error) {
        console.log('❌ Error analyzing gas usage:', error.message);
    }
}

analyzeGasUsage().catch(console.error);