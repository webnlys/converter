import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bangla In Words Converter",
    short_name: "Bangla Words",
    description:
      "টাকার সংখ্যা ইংরেজি ও বাংলায় কথায় লিখুন। সংখ্যা ↔ টেক্সট রূপান্তর।",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#059669",
    lang: "bn-BD",
    dir: "ltr",
    categories: ["finance", "utilities"],
  };
}
