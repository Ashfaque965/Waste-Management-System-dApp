// contracts/deploy.js
async function main() {
  console.log("Deploying Waste Management System contracts...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy WasteToken
  const WasteToken = await ethers.getContractFactory("WasteToken");
  const wasteToken = await WasteToken.deploy();
  await wasteToken.deployed();
  console.log("WasteToken deployed to:", wasteToken.address);

  // Deploy WasteCollection
  const WasteCollection = await ethers.getContractFactory("WasteCollection");
  const wasteCollection = await WasteCollection.deploy();
  await wasteCollection.deployed();
  console.log("WasteCollection deployed to:", wasteCollection.address);

  // Deploy RecyclingVerification
  const RecyclingVerification = await ethers.getContractFactory("RecyclingVerification");
  const recyclingVerification = await RecyclingVerification.deploy();
  await recyclingVerification.deployed();
  console.log("RecyclingVerification deployed to:", recyclingVerification.address);

  // Deploy ReportingService
  const ReportingService = await ethers.getContractFactory("ReportingService");
  const reportingService = await ReportingService.deploy();
  await reportingService.deployed();
  console.log("ReportingService deployed to:", reportingService.address);

  // Save addresses
  const addresses = {
    wasteToken: wasteToken.address,
    wasteCollection: wasteCollection.address,
    recyclingVerification: recyclingVerification.address,
    reportingService: reportingService.address,
  };

  const fs = require("fs");
  fs.writeFileSync(
    "./deployment-addresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\nDeployment complete! Addresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
