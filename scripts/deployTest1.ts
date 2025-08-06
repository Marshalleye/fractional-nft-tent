import { toNano } from '@ton/core';
import { Test1 } from '../build/Test1/Test1_Test1';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const test1 = provider.open(await Test1.fromInit(BigInt(Math.floor(Math.random() * 10000)), 0n));

    await test1.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(test1.address);

    console.log('ID', await test1.getId());
}
