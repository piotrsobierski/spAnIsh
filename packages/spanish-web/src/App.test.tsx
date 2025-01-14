import { test, expect } from "@playwright/experimental-ct-react";
import RainbowPrices from "./components/RainbowPrices";

test("renders learn react link", async ({ mount }) => {
  const component = await mount(<RainbowPrices />);
  //expect Flight Prices text
  await expect(component).toContainText("Flight Prices");

  //screenshot
  await component.screenshot({ path: "main.png" });
});
