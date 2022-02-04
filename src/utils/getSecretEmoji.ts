/**
 * Check if string passed contains a keyword that corresponds to an emoji.
 * @param str - String to test.
 * @returns an emoji if one found, undefined if not.
 */
const getSecretEmoji = (str: string): string | undefined => {
  let emoji: string | undefined;

  const test = str.toLowerCase();

  switch (true) {
    case test.includes("banana"):
      return (emoji = "🍌");
    case test.includes("bacon"):
      return (emoji = "🥓");
    case test.includes("fries"):
      return (emoji = "🍟");
    case test.includes("pineapple"):
      return (emoji = "🍍");
    case test.includes("mango"):
      return (emoji = "🥭");
    case test.includes("cherry" || "cherries"):
      return (emoji = "🍒");
    case test.includes("strawberr"):
      return (emoji = "🍓");
    case test.includes("blueberry" || "blueberries"):
      return (emoji = "🫐");
    case test.includes("kiwi"):
      return (emoji = "🥝");
    case test.includes("tomato"):
      return (emoji = "🍅");
    case test.includes("avocado" || "guac"):
      return (emoji = "🥑");
    case test.includes("carrot"):
      return (emoji = "🥕");
    case test.includes("corn"):
      return (emoji = "🌽");
    case test.includes("pepper"):
      return (emoji = "🌶️");
    case test.includes("lettuce"):
      return (emoji = "🥬");
    case test.includes("broccoli"):
      return (emoji = "🥦");
    case test.includes("cheese"):
      return (emoji = "🧀");
    case test.includes("burger"):
      return (emoji = "🍔");
    case test.includes("pizza"):
      return (emoji = "🍕");
    case test.includes("hot dog" || "hot-dog"):
      return (emoji = "🌭");
    case test.includes("taco"):
      return (emoji = "🌮");
    case test.includes("rice"):
      return (emoji = "🍚");
    case test.includes("sushi"):
      return (emoji = "🍣");
    case test.includes("ice cream"):
      return (emoji = "🍦");
    case test.includes("pasta"):
      return (emoji = "🍝");
    case test.includes("cookie"):
      return (emoji = "🍪");
    case test.includes("doughnut"):
      return (emoji = "🍩");
  }

  return emoji;
};

export { getSecretEmoji };
