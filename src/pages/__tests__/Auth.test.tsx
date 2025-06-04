import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Auth from "../Auth";
import { AuthContext } from "@/hooks/use-auth-context";
import { BrowserRouter } from "react-router-dom";

describe("Login Page", () => {
  it("renders login form and validates required fields", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: null, loading: false }}>
          <Auth />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Check for email and password fields
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    // Try submitting empty form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
}); 