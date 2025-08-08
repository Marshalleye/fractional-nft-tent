import { Address, toNano } from '@ton/core';
import { SimpleCounter } from '../build/SimpleCounter/SimpleCounter_SimpleCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Simple version - only 2 parameters
    const simpleCounter = provider.open(
        await SimpleCounter.fromInit(
            BigInt(Math.floor(Math.random() * 10000)), // id: random number
            0n,                                         // counter: start at 0
            Address.parse("0:0000000000000000000000000000000000000000000000000000000000000000"), // owner: placeholder (will be set in receive())
            0n                                          // operation_count: start at 0
        )
    );

    await simpleCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(simpleCounter.address);

    console.log('🎉 SimpleCounter deployed!');
    console.log('📍 Address:', simpleCounter.address.toString());
    console.log('🆔 ID:', await simpleCounter.getId());
    console.log('🔢 Counter:', await simpleCounter.getCounter());
    console.log('🔍 Explorer:', `https://testnet.tonviewer.com/${simpleCounter.address.toString()}`);
}