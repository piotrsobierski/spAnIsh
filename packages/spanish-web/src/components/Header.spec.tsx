import { test, expect } from "@playwright/experimental-ct-react";
import { Header } from "./Header";
import AxeBuilder from "@axe-core/playwright";

test("should render header with correct text", async ({ mount, page }) => {
  const component = await mount(<Header />);

  await expect(component).toContainText("Spanish AI Vocabulary Tutor");

  // Take browser-specific screenshots
  const browserName =
    page.context().browser()?.browserType().name() ?? "unknown";
  await component.screenshot({ path: `header-${browserName}.png` });

  // Run accessibility tests
  const results = await new AxeBuilder({ page }).analyze();

  // Format violations for snapshot
  const formattedViolations = results.violations.map((violation) => ({
    help: violation.help,
    description: violation.description,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  }));

  expect(JSON.stringify(formattedViolations, null, 2)).toMatchSnapshot();
});
