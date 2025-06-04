import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "../Signup";
import { AuthContext } from "@/hooks/use-auth-context";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("Signup Page", () => {
  it("renders signup form and validates required fields", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: null, loading: false }}>
          <Signup />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
}); 