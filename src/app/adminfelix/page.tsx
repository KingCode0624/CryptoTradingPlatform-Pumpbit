"use client"
import { useWeb3 } from "@/hooks"
import {
    b2testnet_Faucet_Address,
    ailayertestnet_Faucet_Address,
    b2testnetChainId,
    ailayertestnetChainId
} from "@/constants"
import { ethers } from "ethers"

const Admin = () => {
    const { faucetContract, usdcTokenContract, chainId, account } = useWeb3()

    const transferToken = async () => {
        let _faucetAddr: string = ""
        if (chainId === ailayertestnetChainId)
            _faucetAddr = ailayertestnet_Faucet_Address
        else if (chainId === b2testnetChainId)
            _faucetAddr = b2testnet_Faucet_Address

        try {
            await usdcTokenContract.methods.transfer(_faucetAddr, ethers.parseUnits("10000", 18)).send({ from: account })
            console.log("Token Transfter to contract is success")
        } catch (err) {
            console.log("Token Transfer failed")
        }
    }

    const airdropToken = async () => {
        try {
            await faucetContract.methods.claimTokens().send({ from: account })
            console.log("Airdrop success")
        } catch (err) {
            console.log("Airdrop failed", err)
        }
    }

    const getBalance = async () => {
        try {
            const _balance = await usdcTokenContract.methods.balanceOf(account).call()
            console.log("Balance =>", _balance)
        } catch (err) {

        }
    }

    return (
        <div>
            <button
                className="mt-[300px]"
                onClick={() => {
                    transferToken()
                }}>
                Transfter Token to Contract
            </button>

            <button
                className="mt-[300px] ml-[300px]"
                onClick={() => airdropToken()}>
                Airdrop
            </button>

            <button
                className="mt-[300px] ml-[300px]"
                onClick={() => getBalance()}>
                balance
            </button>
        </div>
    )
}

export default Admin