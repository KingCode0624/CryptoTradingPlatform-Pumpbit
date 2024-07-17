// const axios = require('axios');
// const ethUtil = require('ethereumjs-util');
// const sigUtil = require('@metamask/eth-sig-util');


import axios from 'axios';
import { Buffer } from 'buffer';
import { signTypedData, SignTypedDataVersion, TypedMessage } from '@metamask/eth-sig-util';
// import sigUtil from '@metamask/eth-sig-util';

// type MessageTypes = {
//     EIP712Domain: [
//         { name: 'name'; type: 'string' },
//         { name: 'chainId'; type: 'uint256' },
//         { name: 'version'; type: 'string' },
//         { name: 'salt'; type: 'bytes32' }
//     ];
//     Challenge: [
//         { name: 'address'; type: 'address' },
//         { name: 'nonce'; type: 'string' },
//         { name: 'message'; type: 'string' }
//     ];
// };



export const Authorization = async () => {
    const domain = "https://api.inftytrade.xyz";


    const address = "0x8E71fbF0f1a49ed1a3c774Bf7477dc39f66D268f";
    const hexKey = "fc8653d8a1e564334aa428521de4657310364c300f3f0193044e7ed1f413e94a";
    const chain = "b_square_testnet";
    const walletType = "metamask";
    console.log("Hello, World!");

    const resp = await axios.get(`${domain}/v1/auth/login?chain=${chain}&address=${address}`);
    console.log("response => ", resp.data);

    const privateKey = loadPrivateKey(hexKey);
    console.log(privateKey.toString('hex'));

    // const typedData: TypedMessage<MessageTypes> = resp.data.data.sign_data;
    const typedData: any = resp.data.data.sign_data;

    const signature = signTypedDataTS(privateKey, typedData);
    console.log("Signature:", signature);

    const body = {
        address: address,
        signature: signature,
        chain: chain,
        wallet_type: walletType
    };

    const resp2 = await axios.post(`${domain}/v1/auth/login`, body, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log("access token response:", resp2.data);

    return resp2.data
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
