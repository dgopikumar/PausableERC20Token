const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('FreezeFrameToken', function() {
    beforeEach(async function () {
        [owner, signer2] = await ethers.getSigners();

        FreezeFrameToken = await ethers.getContractFactory('FreezeFrameToken', owner);
        freezeFrameToken = await FreezeFrameToken.deploy();
    });

    describe('transfer', function() {
        it('transfers tokens when unpaused', async function() {
            let ownerBalance;
            let signer2Balance;

            ownerBalance = await freezeFrameToken.balanceOf(owner.address);
            signer2Balance = await freezeFrameToken.balanceOf(signer2.address);
            expect(ownerBalance).to.equal(ethers.utils.parseEther('1000'));
            expect(signer2Balance).to.equal(ethers.utils.parseEther('0'));

            await freezeFrameToken.connect(owner).transfer(signer2.address, ethers.utils.parseEther('250'));

            ownerBalance = await freezeFrameToken.balanceOf(owner.address);
            signer2Balance = await freezeFrameToken.balanceOf(signer2.address);
            expect(ownerBalance).to.equal(ethers.utils.parseEther('750'));
            expect(signer2Balance).to.equal(ethers.utils.parseEther('250'));
        });

        it('reverts transfers when paused', async function() {
            let ownerBalance;
            let signer2Balance;

            ownerBalance = await freezeFrameToken.balanceOf(owner.address);
            signer2Balance = await freezeFrameToken.balanceOf(signer2.address);
            expect(ownerBalance).to.equal(ethers.utils.parseEther('1000'));
            expect(signer2Balance).to.equal(ethers.utils.parseEther('0'));

            await freezeFrameToken.connect(owner).pause();

            expect(freezeFrameToken.connect(owner).transfer(signer2.address, ethers.utils.parseEther('250')
            ))
            .to.be.revertedWith('Pausable: paused');

            ownerBalance = await freezeFrameToken.balanceOf(owner.address);
            signer2Balance = await freezeFrameToken.balanceOf(signer2.address);
            expect(ownerBalance).to.equal(ethers.utils.parseEther('1000'));
            expect(signer2Balance).to.equal(ethers.utils.parseEther('0'));
        });
    });
});