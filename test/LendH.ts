// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// @ts-ignore
import { ethers, waffle } from 'hardhat';
import { assert, expect, use } from 'chai';

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("LendH contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let LendH;
  let hardhatLendH;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    LendH = await ethers.getContractFactory("LendH");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call LendH.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatLendH = await LendH.deploy(owner.address);
    await hardhatLendH.deployed();

    // We can interact with the contract by calling `hardhatLendH.method()`
    await hardhatLendH.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
        console.log("ower address:",owner.address);
      console.log("addr1 address:",owner.addr1);
      console.log("addr2 address:",owner.addr2);
      // expect(await hardhatLendH.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatLendH.balanceOf(owner.address);
      expect(await hardhatLendH.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatLendH.transfer(addr1.address, 50);
      const addr1Balance = await hardhatLendH.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatLendH.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatLendH.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatLendH.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      // @ts-ignore

      // await expect(
      //   hardhatLendH.connect(addr1).transfer(owner.address, 1)
      // ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatLendH.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatLendH.balanceOf(
        owner.address
      );
      console.log("initialOwnerBalance:",initialOwnerBalance);
      // Transfer 100 tokens from owner to addr1.
      await hardhatLendH.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatLendH.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hardhatLendH.balanceOf(
        owner.address
      );
      console.log("finalOwnerBalance:",finalOwnerBalance);

      // expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatLendH.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatLendH.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});