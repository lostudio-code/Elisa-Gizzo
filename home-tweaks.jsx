// Home tweaks panel — re-skin the hero + palette
const HERO_IMAGES = {
  dreamy: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=2400&q=80",
  portrait: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=2400&q=80",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80",
  ocean: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=2400&q=80",
  golden: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=2400&q=80",
};

const PALETTES = {
  sage: {
    "--sage-100": "#ECEEE5",
    "--sage-200": "#DDE3DA",
    "--sage-500": "#9DAFA0",
    "--sage-700": "#56695C",
    "--sage-800": "#3A4A40",
    "--sage-900": "#2A352E",
    "--cream-50": "#FBF8F2",
    "--cream-100": "#F5F1E8",
  },
  ocean: {
    "--sage-100": "#E4EBEC",
    "--sage-200": "#CDD9DC",
    "--sage-500": "#8DA5AC",
    "--sage-700": "#4D6772",
    "--sage-800": "#36505B",
    "--sage-900": "#1E3540",
    "--cream-50": "#F7F4EE",
    "--cream-100": "#EFEAE0",
  },
  rose: {
    "--sage-100": "#F1E8E4",
    "--sage-200": "#E2D2CB",
    "--sage-500": "#B89C92",
    "--sage-700": "#7C5F55",
    "--sage-800": "#5C453C",
    "--sage-900": "#3A2A23",
    "--cream-50": "#FBF6EF",
    "--cream-100": "#F2EBDD",
  },
  charcoal: {
    "--sage-100": "#E5E5E2",
    "--sage-200": "#CDCDC8",
    "--sage-500": "#8D8E89",
    "--sage-700": "#4F5048",
    "--sage-800": "#33342E",
    "--sage-900": "#1B1C18",
    "--cream-50": "#F6F4ED",
    "--cream-100": "#EBE7DA",
  },
};

function HomeTweaks() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || TWEAK_DEFAULTS);

  // Apply palette tokens
  React.useEffect(() => {
    const root = document.documentElement;
    const p = PALETTES[t.palette] || PALETTES.sage;
    Object.entries(p).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [t.palette]);

  // Apply hero image
  React.useEffect(() => {
    const bg = document.getElementById("heroBg");
    if (bg) bg.style.backgroundImage = `url('${HERO_IMAGES[t.heroImage] || HERO_IMAGES.dreamy}')`;
  }, [t.heroImage]);

  // Apply headline case
  React.useEffect(() => {
    const el = document.querySelector(".hero-title");
    if (!el) return;
    const variants = {
      Title: "A&nbsp;Path<br/>That Shapes<br/>Your Future.",
      Soft:  "Space to<br/>find your<br/>own way.",
      Direct: "Therapy,<br/>without the<br/>pressure.",
    };
    el.innerHTML = variants[t.headlineCase] || variants.Title;
    // Re-run the word splitter so the new headline animates in.
    if (typeof window.__splitHeroTitle === "function") {
      requestAnimationFrame(() => window.__splitHeroTitle());
    }
  }, [t.headlineCase]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Theme"
        value={t.palette}
        options={[
          ["#9DAFA0", "#56695C", "#FBF8F2"],
          ["#8DA5AC", "#4D6772", "#F7F4EE"],
          ["#B89C92", "#7C5F55", "#FBF6EF"],
          ["#8D8E89", "#4F5048", "#F6F4ED"],
        ]}
        onChange={(v) => {
          // Map palette swatch back to key by index
          const keys = ["sage", "ocean", "rose", "charcoal"];
          const idx = [
            ["#9DAFA0", "#56695C", "#FBF8F2"],
            ["#8DA5AC", "#4D6772", "#F7F4EE"],
            ["#B89C92", "#7C5F55", "#FBF6EF"],
            ["#8D8E89", "#4F5048", "#F6F4ED"],
          ].findIndex((p) => JSON.stringify(p) === JSON.stringify(v));
          setTweak("palette", keys[idx] || "sage");
        }}
      />
      <TweakSection label="Hero" />
      <TweakSelect
        label="Image"
        value={t.heroImage}
        options={["dreamy", "portrait", "forest", "ocean", "golden"]}
        onChange={(v) => setTweak("heroImage", v)}
      />
      <TweakSelect
        label="Headline"
        value={t.headlineCase}
        options={["Title", "Soft", "Direct"]}
        onChange={(v) => setTweak("headlineCase", v)}
      />
    </TweaksPanel>
  );
}

const __tweaksMount = document.createElement("div");
__tweaksMount.className = "tweaks-host";
document.body.appendChild(__tweaksMount);
ReactDOM.createRoot(__tweaksMount).render(<HomeTweaks />);
