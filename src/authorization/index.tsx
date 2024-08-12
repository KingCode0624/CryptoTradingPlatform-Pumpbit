// const axios = require('axios');
// const ethUtil = require('ethereumjs-util');
// const sigUtil = require('@metamask/eth-sig-util');


import axios from 'axios';
import { Buffer } from 'buffer';
import { signTypedData, SignTypedDataVersion, TypedMessage } from '@metamask/eth-sig-util';

export const Authorization = async () => {
    try {
        const domain = "https://api.inftytrade.xyz";

        const address = "0x8E71fbF0f1a49ed1a3c774Bf7477dc39f66D268f";
        const hexKey = "fc8653d8a1e564334aa428521de4657310364c300f3f0193044e7ed1f413e94a";
        const chain = "b_square_testnet";
        const walletType = "metamask";

        const resp = await axios.get(`${domain}/v1/auth/login?chain=${chain}&address=${address}`);

        const privateKey = loadPrivateKey(hexKey);
        const typedData: any = resp.data.data.sign_data;

        const signature = signTypedDataTS(privateKey, typedData);

        const body = {
            address: address,
            signature: signature,
            chain: chain,
            wallet_type: walletType
        };

        const resp2 = await axios.post(`${domain}/v1/auth/login`, body, {
            headers: { 'Content-Type': 'application/json' }
        });

        return resp2.data
    } catch (err) {

    }
}

const loadPrivateKey = (hexKey: any) => {
    return Buffer.from(hexKey, 'hex');
}

const signTypedDataTS = (privateKey: any, typedData: any) => {
    return signTypedData({
        privateKey: privateKey,
        data: typedData,
        version: SignTypedDataVersion.V4
    });
}
