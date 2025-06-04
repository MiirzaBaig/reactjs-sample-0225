import React from "react";
import { render, screen } from "@testing-library/react";
import TaskBoard from "../TaskBoard";

describe("TaskBoard", () => {
  it("renders columns and sample tasks", () => {
    render(<TaskBoard />);
    expect(screen.getByText(/to do/i)).toBeTruthy();
    expect(screen.getByText(/in progress/i)).toBeTruthy();
    expect(screen.getByText(/done/i)).toBeTruthy();
    expect(screen.getByText(/design new landing page/i)).toBeTruthy();
  });
}); 