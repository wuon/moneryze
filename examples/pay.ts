import { Moneryze } from "../src";

const moneryze = new Moneryze({
  appName: "Test",
  storeId: "store5",
  apiToken: "yesguy",
  cryptType: "7",
  isTest: true,
  countryCode: "CA",
});

const main = async () => {
  const result = await moneryze.send("res_add_cc", {
    pan: "4242424242424242",
    expdate: "2011",
  });
  console.log(result);
};

main();
