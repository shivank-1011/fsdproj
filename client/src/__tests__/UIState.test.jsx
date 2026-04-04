import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingState } from "../components/UIState";

describe("LoadingState Component", () => {
  it("should render the loading message", () => {
    const testMessage = "Fetching products...";
    render(<LoadingState message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it("should show default loading message if none provided", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render the spinner", () => {
    const { container } = render(<LoadingState />);
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });
});
