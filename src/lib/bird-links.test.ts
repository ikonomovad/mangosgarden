import { describe, expect, it } from "vitest";
import { birdChatUrl, birdSearchUrl } from "./bird-links";

describe("bird learning links", () => {
  it("encodes the English Google query", () => {
    expect(birdSearchUrl("Blue Tit", "en")).toBe("https://www.google.com/search?q=Blue%20Tit%20bird");
  });
  it("encodes the Macedonian Google query", () => {
    expect(birdSearchUrl("Гугутка", "mk")).toBe("https://www.google.com/search?q=%D0%93%D1%83%D0%B3%D1%83%D1%82%D0%BA%D0%B0%20%D0%BF%D1%82%D0%B8%D1%86%D0%B0");
  });
  it("encodes the full English ChatGPT prompt", () => {
    expect(birdChatUrl("Blue Tit", "en")).toBe("https://chatgpt.com/?q=Tell%20me%20more%20about%20the%20Blue%20Tit.%20Include%20interesting%20facts%2C%20its%20habits%2C%20and%20what%20it%20eats.");
  });
  it("encodes and preserves the full Macedonian ChatGPT prompt", () => {
    const url = birdChatUrl("Гугутка", "mk");
    expect(url.startsWith("https://chatgpt.com/?q=%D0%9A%D0%B0%D0%B6%D0%B8%20")).toBe(true);
    expect(url).not.toContain(" ");
    expect(new URL(url).searchParams.get("q")).toBe("Кажи ми повеќе за птицата Гугутка. Вклучи интересни факти, нејзините навики и што јаде.");
  });
  it("keeps special characters inside the query parameter", () => {
    expect(birdSearchUrl("A&B #?", "en")).toBe("https://www.google.com/search?q=A%26B%20%23%3F%20bird");
    expect(new URL(birdChatUrl("A&B #?", "en")).searchParams.get("q")).toBe("Tell me more about the A&B #?. Include interesting facts, its habits, and what it eats.");
  });
});