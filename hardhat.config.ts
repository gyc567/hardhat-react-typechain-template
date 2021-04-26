import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import {accounts, node_url} from "./utils/network";

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: "0.7.3",
  // https://hardhat.org/metamask-issue.html
  // recommends workaround for metamask local testing but it didn't work.
  // Instead, set chainId to 31337 in Metamask > Settings > Network
  // networks: {
  //   hardhat: {
  //     chainId: 1337
  //   },
  // }
  networks: {
    kovan: {
      url: node_url('kovan'),
      accounts: accounts('kovan'),
    }
  }
};
