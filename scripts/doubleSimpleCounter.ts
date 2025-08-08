import { toNano, Address } from '@ton/core';
import { SimpleCounter } from '../build/SimpleCounter/SimpleCounter_SimpleCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    const addressStr = await ui.input('SimpleCounter address');
    const address = Address.parse(addressStr);
    
    const simpleCounter = provider.open(SimpleCounter.fromAddress(address));
    
    const counterBefore = await simpleCounter.getCounter();
    ui.write(`Counter before: ${counterBefore}`);
    
    await simpleCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        'double'
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
    ui.write(`Expected: ${counterBefore * 2n}`);
    
    if (counterAfter === counterBefore * 2n) {
        ui.write('✅ Double operation successful!');
    } else {
        ui.write('❌ Something went wrong');
    }
}