// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Experience from "./experience";

Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  configurable: true,
  value() {
    this.setAttribute("open", "");
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "close", {
  configurable: true,
  value() {
    this.removeAttribute("open");
  },
});

let path = "/";
vi.mock("next/navigation", () => ({ usePathname: () => path }));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  path = "/";
  vi.restoreAllMocks();
});

describe("training interactions", () => {
  it("updates and persists the participant display name", async () => {
    render(<Experience />);
    const field = await screen.findByLabelText("What should we call you?");
    fireEvent.change(field, { target: { value: "Ada" } });
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem("hermes-playground-progress")!).name,
      ).toBe("Ada"),
    );
  });

  it("reveals mission hints progressively and persists the hint count", async () => {
    path = "/missions/02-bug-hunter";
    render(<Experience />);
    await screen.findByText("Bug Hunter", { selector: "h1" });
    fireEvent.click(screen.getByRole("button", { name: "Reveal a hint" }));
    expect(await screen.findByText(/Compare the normalization/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reveal a hint" }));
    expect(await screen.findByText(/Check whether trimming/)).toBeTruthy();
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem("hermes-playground-progress")!).hints,
      ).toContain("02-bug-hunter:2"),
    );
  });

  it("awards mission XP once and shows completion feedback", async () => {
    path = "/missions/01-code-detective";
    render(<Experience />);
    await screen.findByText("Code Detective", { selector: "h1" });
    fireEvent.click(screen.getByRole("button", { name: /Mark complete/ }));
    expect(await screen.findByText("MISSION COMPLETE")).toBeTruthy();
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem("hermes-playground-progress")!).xp,
      ).toBe(100),
    );
  });

  it("marks nested missions in navigation and exposes keyboard navigation controls", async () => {
    path = "/missions/04-agent-workflow";
    render(<Experience />);
    const missionsLink = screen.getByRole("link", { name: /Missions/ });
    expect(missionsLink.getAttribute("aria-current")).toBe("page");
    expect(screen.getByText(/MISSION 04/, { selector: "strong" })).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Skip to content" })
        .getAttribute("href"),
    ).toBe("#main-content");

    path = "/presentation";
    cleanup();
    render(<Experience />);
    expect(
      screen
        .getByRole("progressbar", { name: "Presentation progress" })
        .getAttribute("aria-valuetext"),
    ).toBe("Slide 1 of 12");
    fireEvent.keyDown(window, { key: "ArrowDown" });
    await waitFor(() =>
      expect(
        screen
          .getByRole("progressbar", { name: "Presentation progress" })
          .getAttribute("aria-valuenow"),
      ).toBe("2"),
    );
    fireEvent.keyDown(window, { key: "PageUp" });
    await waitFor(() =>
      expect(
        screen
          .getByRole("progressbar", { name: "Presentation progress" })
          .getAttribute("aria-valuenow"),
      ).toBe("1"),
    );
  });

  it("closes the mobile navigation on Escape and restores focus to its toggle", () => {
    render(<Experience />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });

  it("copies task text and confirms a progress reset", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    path = "/missions/01-code-detective";
    const firstRender = render(<Experience />);
    await screen.findByText("Code Detective", { selector: "h1" });
    fireEvent.click(screen.getByRole("button", { name: "Copy task" }));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalled(),
    );
    firstRender.unmount();
    path = "/instructor";
    render(<Experience />);
    await screen.findByText("Reset local training progress");
    fireEvent.click(screen.getByRole("button", { name: /Reset progress/ }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Yes, reset" }));
    await waitFor(() =>
      expect(localStorage.getItem("hermes-playground-progress")).toBeTruthy(),
    );
    expect(
      JSON.parse(localStorage.getItem("hermes-playground-progress")!).completed,
    ).toEqual([]);
  });
});
