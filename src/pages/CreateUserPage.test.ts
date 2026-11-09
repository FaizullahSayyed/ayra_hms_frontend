import { describe, expect, it } from "vitest";
import { getCreateUserReturnLocation } from "./CreateUserPage";

describe("create-user return navigation", () => {
  it("preserves the originating admin dashboard path, query, and hash", () => {
    expect(getCreateUserReturnLocation({
      returnTo: {
        pathname: "/admin/dashboard",
        search: "?filter=recent",
        hash: "#admin-patients",
      },
    })).toEqual({
      pathname: "/admin/dashboard",
      search: "?filter=recent",
      hash: "#admin-patients",
    });
  });

  it("falls back to the admin dashboard for missing or untrusted return paths", () => {
    const fallback = { pathname: "/admin/dashboard", search: "", hash: "" };
    expect(getCreateUserReturnLocation(null)).toEqual(fallback);
    expect(getCreateUserReturnLocation({ returnTo: { pathname: "//external.example" } })).toEqual(fallback);
    expect(getCreateUserReturnLocation({ returnTo: { pathname: "/login" } })).toEqual(fallback);
  });
});
