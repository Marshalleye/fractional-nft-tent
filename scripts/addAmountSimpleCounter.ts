import { toNano, Address } from '@ton/core';
import { SimpleCounter } from '../build/SimpleCounter/SimpleCounter_SimpleCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    const addressStr = await ui.input('SimpleCounter address');
    const amountStr = await ui.input('Amount to add');
    const amount = parseInt(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
        ui.write('❌ Invalid amount. Please enter a positive number.');
        return;
    }
    
    const address = Address.parse(addressStr);
    const simpleCounter = provider.open(SimpleCounter.fromAddress(address));
    
    const counterBefore = await simpleCounter.getCounter();
    ui.write(`Counter before: ${counterBefore}`);
    ui.write(`Adding: ${amount}`);
    
    // Send Add message with structured data
    await simpleCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            amount: BigInt(amount)
        }
    );
    
    ui.write('Waiting for transaction to confirm...');
    
    let counterAfter = await simpleCounter.getCounter();
    let attempts = 1;
    while (counterAfter === counterBefore && attempts < 20) {
        ui.write(`Attempt ${attempts}: checking...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        counterAfter = await simpleCounter.getCounter();
        attempts++;
    }
    
    ui.write(`Counter after: ${counterAfter}`);
    ui.write(`Expected: ${counterBefore + BigInt(amount)}`);
    
    if (counterAfter === counterBefore + BigInt(amount)) {
        ui.write('✅ Add operation successful!');
    } else {
        ui.write('❌ Something went wrong');
    }
}